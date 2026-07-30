
/* Berna V10 — all previous features + modular room, inventory and shop. */
(() => {
  'use strict';
  const ITEMS = Array.isArray(window.BERNA_V10_ROOM_ITEMS) ? window.BERNA_V10_ROOM_ITEMS : [];
  const SLOTS = window.BERNA_V10_ROOM_SLOTS || {};
  const CATEGORIES = Array.isArray(window.BERNA_V10_ROOM_CATEGORIES) ? window.BERNA_V10_ROOM_CATEGORIES : [{id:'all',label:'Tümü'}];
  const LEGACY_MAP = window.BERNA_V10_ROOM_LEGACY_MAP || {};
  const ITEM_MAP = new Map(ITEMS.map(item => [item.id, item]));
  const ROOM_VERSION = 1;

  function roomState() {
    const raw = state.modularRoom && typeof state.modularRoom === 'object' ? state.modularRoom : {};
    const rawOwned = raw.ownedItemIds || raw.ownedItems || raw.inventory || [];
    const owned = new Set(Array.isArray(rawOwned) ? rawOwned.filter(id => ITEM_MAP.has(id)) : []);
    const equippedRaw = raw.equippedBySlot || raw.equipped || raw.room?.equipped || {};
    const equipped = {};
    Object.entries(equippedRaw || {}).forEach(([slot,id]) => {
      const item = ITEM_MAP.get(id);
      if (item && item.slot === slot && SLOTS[slot]) { owned.add(id); equipped[slot] = id; }
    });

    // One-time migration from every earlier Berna room format.
    const oldOwned = Array.isArray(state.ownedItems) ? state.ownedItems : [];
    oldOwned.forEach(oldId => { const mapped = LEGACY_MAP[oldId]; if (mapped && ITEM_MAP.has(mapped)) owned.add(mapped); });
    const oldEquipped = state.equippedItems && typeof state.equippedItems === 'object' ? state.equippedItems : {};
    Object.values(oldEquipped).forEach(oldId => {
      const mapped = LEGACY_MAP[oldId]; const item = ITEM_MAP.get(mapped);
      if (item) { owned.add(mapped); if (!equipped[item.slot]) equipped[item.slot] = mapped; }
    });

    state.modularRoom = {
      version: ROOM_VERSION,
      ownedItemIds: [...owned],
      equippedBySlot: equipped,
      storeCategory: CATEGORIES.some(c => c.id === raw.storeCategory) ? raw.storeCategory : 'all',
      inventoryCategory: CATEGORIES.some(c => c.id === raw.inventoryCategory) ? raw.inventoryCategory : 'all'
    };
    syncLegacyMarkers();
    return state.modularRoom;
  }

  function syncLegacyMarkers() {
    const room = state.modularRoom || {equippedBySlot:{}};
    const eq = room.equippedBySlot || {};
    state.equippedItems ||= {};
    state.equippedItems.bed = eq.bed ? 'bed-sage' : '';
    state.equippedItems.rug = eq.rug ? 'rug-sage' : '';
    state.equippedItems.shelf = (eq.wallShelf || eq.bookcase) ? 'shelf-oak' : '';
    state.equippedItems.lamp = (eq.tableLight || eq.stringLight || eq.ceilingLight) ? 'lamp-moon' : '';
    state.equippedItems.plant = (eq.floorPlant || eq.hangingPlant) ? 'plant-monstera' : '';
    state.equippedItems.toy = (eq.toy || eq.catTree || eq.catCorner) ? 'toy-ball' : '';
  }

  function persist({backup=true}={}) {
    syncLegacyMarkers();
    saveState({autoBackup:backup});
    renderStats();
    if (typeof evaluateProgressRewards === 'function') {
      evaluateProgressRewards({notify:true});
      if (typeof renderAchievements === 'function') renderAchievements();
    }
  }

  function isOwned(id) { return roomState().ownedItemIds.includes(id); }
  function isEquipped(id) { const item=ITEM_MAP.get(id); return Boolean(item && roomState().equippedBySlot[item.slot] === id); }
  function categoryItems(category) { return ITEMS.filter(item => category === 'all' || item.group === category); }
  function money(value) { return Number(value || 0).toLocaleString('tr-TR'); }

  function renderCategoryTabs(containerId, activeKey, keyName, rerender) {
    const container = document.getElementById(containerId); if (!container) return;
    const room = roomState();
    container.innerHTML = CATEGORIES.map(cat => `<button type="button" class="${room[keyName]===cat.id?'active':''}" data-v10-category="${cat.id}">${cat.label}</button>`).join('');
    container.querySelectorAll('[data-v10-category]').forEach(button => button.addEventListener('click', () => {
      room[keyName] = button.dataset.v10Category; persist({backup:false}); rerender();
    }));
  }

  function itemCard(item, mode) {
    const owned = isOwned(item.id), equipped = isEquipped(item.id);
    let label, action, disabled = false, className='';
    if (!owned && mode === 'shop') { label = `<img src="./coin.png" alt=""> ${money(item.price)}`; action='buy'; disabled = state.coins < item.price; }
    else if (equipped) { label='Odadan Kaldır'; action='remove'; className='v10-remove'; }
    else { label='Kullan'; action='equip'; }
    const status = equipped ? 'Odada' : owned ? 'Envanterde' : 'Dükkan';
    return `<article class="${mode==='shop'?'shop-item':'inventory-item'}${owned?' owned':''}${equipped?' equipped':''}">
      <span class="v10-catalog-status">${status}</span>
      <div class="v10-catalog-preview"><img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy"></div>
      <div class="v10-catalog-copy"><small>${escapeHtml(item.category)}</small><strong>${escapeHtml(item.name)}</strong>${mode==='shop'&&!owned?`<span><img src="./coin.png" alt="">${money(item.price)} coin</span>`:''}</div>
      <button type="button" class="${className}" data-v10-item="${item.id}" data-v10-action="${action}" ${disabled?'disabled':''}>${label}</button>
    </article>`;
  }

  function modularRenderShop() {
    roomState();
    renderCategoryTabs('storeCategoryTabs', state.modularRoom.storeCategory, 'storeCategory', modularRenderShop);
    const grid = document.getElementById('shopGrid'); if (!grid) return;
    grid.innerHTML = categoryItems(state.modularRoom.storeCategory).map(item => itemCard(item,'shop')).join('') || '<div class="v10-empty">Bu kategoride eşya bulunamadı.</div>';
    grid.querySelectorAll('[data-v10-action]').forEach(button => button.addEventListener('click', () => handleAction(button.dataset.v10Action, button.dataset.v10Item)));
  }

  function modularRenderInventory() {
    roomState();
    renderCategoryTabs('inventoryCategoryTabs', state.modularRoom.inventoryCategory, 'inventoryCategory', modularRenderInventory);
    const grid = document.getElementById('inventoryGrid'); if (!grid) return;
    const owned = categoryItems(state.modularRoom.inventoryCategory).filter(item => isOwned(item.id));
    const count = document.getElementById('inventoryOwnedCount'); if (count) count.textContent = `${state.modularRoom.ownedItemIds.length} eşya`;
    grid.innerHTML = owned.map(item => itemCard(item,'inventory')).join('') || '<div class="v10-empty">Bu kategoride henüz eşyan yok.</div>';
    grid.querySelectorAll('[data-v10-action]').forEach(button => button.addEventListener('click', () => handleAction(button.dataset.v10Action, button.dataset.v10Item)));
  }

  function buy(id) {
    const item = ITEM_MAP.get(id); if (!item || isOwned(id)) return;
    if (state.coins < item.price) { showToast('Bu eşya için yeterli coinin yok'); return; }
    state.coins -= item.price;
    state.modularRoom.ownedItemIds.push(id);
    persist();
    modularRenderShop(); modularRenderInventory();
    showToast(`${item.name} envanterine eklendi`);
    showRoomStatus('Yeni eşyan envanterinde. İstersen şimdi odaya yerleştir.');
  }

  function equip(id) {
    const item = ITEM_MAP.get(id); if (!item || !isOwned(id)) return;
    state.modularRoom.equippedBySlot[item.slot] = id;
    persist();
    modularRenderRoom(id); modularRenderShop(); modularRenderInventory();
    showToast(`${item.name} odaya yerleştirildi`);
    showRoomStatus(`${item.name} Miki'nin odasına cuk oturdu.`);
  }

  function remove(id) {
    const item = ITEM_MAP.get(id); if (!item) return;
    if (state.modularRoom.equippedBySlot[item.slot] === id) delete state.modularRoom.equippedBySlot[item.slot];
    persist();
    modularRenderRoom(); modularRenderShop(); modularRenderInventory();
    showToast(`${item.name} envanterine kaldırıldı`);
  }

  function handleAction(action,id) { if(action==='buy') buy(id); if(action==='equip') equip(id); if(action==='remove') remove(id); }

  function renderEquippedStrip() {
    const strip = document.getElementById('v10EquippedStrip'); if (!strip) return;
    const entries = Object.entries(roomState().equippedBySlot);
    strip.innerHTML = entries.map(([slot,id]) => { const item=ITEM_MAP.get(id); return item ? `<button type="button" class="v10-equipped-chip" data-v10-strip-remove="${id}"><img src="${item.image}" alt=""><span>${escapeHtml(item.name)}</span><b>Çıkar</b></button>` : ''; }).join('');
    strip.querySelectorAll('[data-v10-strip-remove]').forEach(button => button.addEventListener('click', () => remove(button.dataset.v10StripRemove)));
  }

  function renderLayers(justAddedId=null) {
    const layer = document.getElementById('v10RoomLayers'); if (!layer) return;
    layer.innerHTML = Object.entries(roomState().equippedBySlot).map(([slotName,id]) => {
      const slot=SLOTS[slotName], item=ITEM_MAP.get(id); if(!slot||!item) return '';
      return `<img class="v10-room-item${id===justAddedId?' just-added':''}" data-anchor="${slot.anchor||'bottom'}" src="${item.image}" alt="${escapeHtml(item.name)}" style="--room-x:${slot.x}%;--room-y:${slot.y}%;--room-width:${slot.width}%;--room-z:${slot.z};">`;
    }).join('');
  }

  const previousRenderRoom = typeof renderRoom === 'function' ? renderRoom : null;
  function modularRenderRoom(justAddedId=null) {
    roomState();
    if (previousRenderRoom) previousRenderRoom(null);
    renderLayers(justAddedId); renderEquippedStrip();
    const badge=document.getElementById('dataVersionBadge'); if(badge) badge.textContent='Veri v9 · Oda v1';
  }

  // Override the catalog/room functions used throughout every previous version.
  renderShop = modularRenderShop;
  renderInventory = modularRenderInventory;
  renderRoom = modularRenderRoom;
  buyItem = item => { const id=typeof item==='string'?item:item?.id; if(id) buy(id); };
  equipRoomItem = equip;
  unequipRoomSlot = slot => { const id=roomState().equippedBySlot[slot]; if(id) remove(id); };

  roomState();
  persist({backup:false});
  modularRenderRoom(); modularRenderInventory(); modularRenderShop();
  const brandVersion=document.querySelector('.version'); if(brandVersion) brandVersion.textContent='v10';
  document.title='Berna V10';
})();
