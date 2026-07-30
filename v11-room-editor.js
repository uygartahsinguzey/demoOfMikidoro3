/* Berna V11 — free-placement room editor inspired by social room games. */
(() => {
  'use strict';

  const ITEMS = Array.isArray(window.BERNA_V10_ROOM_ITEMS) ? window.BERNA_V10_ROOM_ITEMS : [];
  const ITEM_MAP = new Map(ITEMS.map(item => [item.id, item]));
  const OLD_SLOTS = window.BERNA_V10_ROOM_SLOTS || {};
  const CATEGORIES = Array.isArray(window.BERNA_V10_ROOM_CATEGORIES) ? window.BERNA_V10_ROOM_CATEGORIES : [{id:'all',label:'Tümü'}];
  const ROOM_VERSION = 2;

  const TYPE_RULES = {
    rug:      {kind:'rug',      minX:16,maxX:84,minY:66,maxY:96,anchor:'center',baseZ:10,minScale:.65,maxScale:1.45},
    wallShelf:{kind:'wall',     minX:8,maxX:92,minY:17,maxY:52,anchor:'center',baseZ:90,minScale:.65,maxScale:1.35},
    wallArt:  {kind:'wall',     minX:8,maxX:92,minY:16,maxY:52,anchor:'center',baseZ:92,minScale:.65,maxScale:1.5},
    stringLight:{kind:'wall',   minX:9,maxX:91,minY:14,maxY:49,anchor:'center',baseZ:94,minScale:.65,maxScale:1.45},
    hangingPlant:{kind:'ceiling',minX:7,maxX:93,minY:10,maxY:47,anchor:'center',baseZ:100,minScale:.65,maxScale:1.4},
    ceilingLight:{kind:'ceiling',minX:15,maxX:85,minY:7,maxY:34,anchor:'center',baseZ:102,minScale:.7,maxScale:1.35},
    tableLight:{kind:'surface', minX:5,maxX:95,minY:38,maxY:90,anchor:'bottom',baseZ:230,minScale:.55,maxScale:1.45},
    surfaceDecor:{kind:'surface',minX:5,maxX:95,minY:38,maxY:90,anchor:'bottom',baseZ:235,minScale:.55,maxScale:1.45},
    pillow:   {kind:'surface',  minX:5,maxX:95,minY:42,maxY:92,anchor:'center',baseZ:240,minScale:.55,maxScale:1.5},
    toy:      {kind:'floor',    minX:4,maxX:96,minY:58,maxY:97,anchor:'bottom',baseZ:210,minScale:.55,maxScale:1.6},
    default:  {kind:'floor',    minX:5,maxX:95,minY:48,maxY:96,anchor:'bottom',baseZ:190,minScale:.6,maxScale:1.45}
  };

  const friendlyKinds = {floor:'Zemin eşyası',wall:'Duvar eşyası',ceiling:'Tavan eşyası',rug:'Halı',surface:'Küçük dekor'};

  let editing = false;
  let selectedId = null;
  let drag = null;
  let initialSnapshot = null;
  let undoStack = [];
  let redoStack = [];
  let justAddedId = null;
  let preservedMikiNode = null;

  const deepClone = value => JSON.parse(JSON.stringify(value));
  const uid = () => (window.crypto?.randomUUID?.() || `room-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const round2 = value => Math.round(value * 100) / 100;
  const safeText = value => typeof escapeHtml === 'function' ? escapeHtml(String(value)) : String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));

  function ruleFor(item) {
    return TYPE_RULES[item?.slot] || TYPE_RULES.default;
  }

  function baseWidth(item) {
    const legacy = OLD_SLOTS[item.slot];
    const widths = {
      bed:27, desk:29, bookcase:23, chair:16, bench:28, nightstand:12,
      catCorner:14, rug:38, wallShelf:20, wallArt:10, hangingPlant:10,
      floorPlant:11, tableLight:7, stringLight:22, ceilingLight:9,
      pouf:12, pillow:11, sideTable:13, catTree:16, toy:8, surfaceDecor:12
    };
    return Number(widths[item.slot] || legacy?.width || 14);
  }

  function defaultPosition(item, index = 0) {
    const legacy = OLD_SLOTS[item.slot] || {x:50,y:74};
    const offsets = [[0,0],[-8,4],[8,5],[-14,8],[14,8],[-20,10],[20,10]];
    const [dx,dy] = offsets[index % offsets.length];
    const rule = ruleFor(item);
    return {
      x: clamp(Number(legacy.x || 50) + dx, rule.minX, rule.maxX),
      y: clamp(Number(legacy.y || 74) + dy, rule.minY, rule.maxY)
    };
  }

  function normalizePlaced(rawPlaced, inventoryCounts) {
    const seen = new Set();
    const result = [];
    (Array.isArray(rawPlaced) ? rawPlaced : []).forEach(raw => {
      const item = ITEM_MAP.get(raw?.itemId);
      if (!item) return;
      const rule = ruleFor(item);
      const instanceId = raw.instanceId && !seen.has(raw.instanceId) ? raw.instanceId : uid();
      seen.add(instanceId);
      result.push({
        instanceId,
        itemId:item.id,
        x:clamp(Number(raw.x ?? defaultPosition(item).x),rule.minX,rule.maxX),
        y:clamp(Number(raw.y ?? defaultPosition(item).y),rule.minY,rule.maxY),
        scale:clamp(Number(raw.scale ?? 1),rule.minScale,rule.maxScale),
        flipX:Boolean(raw.flipX),
        rotation:Number.isFinite(Number(raw.rotation)) ? Number(raw.rotation) : 0,
        zOffset:clamp(Number(raw.zOffset ?? 0),-180,180)
      });
      inventoryCounts[item.id] = Math.max(Number(inventoryCounts[item.id] || 0), result.filter(p => p.itemId === item.id).length);
    });
    return result;
  }

  function roomState() {
    if (state.avatarRoom && state.avatarRoom.version === ROOM_VERSION && Array.isArray(state.avatarRoom.placedItems) && state.avatarRoom.inventoryCounts && typeof state.avatarRoom.inventoryCounts === 'object') {
      return state.avatarRoom;
    }
    const legacy = state.avatarRoom || state.modularRoom || {};
    const counts = {};
    if (legacy.inventoryCounts && typeof legacy.inventoryCounts === 'object') {
      Object.entries(legacy.inventoryCounts).forEach(([id,count]) => {
        if (ITEM_MAP.has(id)) counts[id] = clamp(Math.floor(Number(count) || 0),0,99);
      });
    }
    const owned = legacy.ownedItemIds || legacy.ownedItems || legacy.inventory || [];
    (Array.isArray(owned) ? owned : []).forEach(id => { if (ITEM_MAP.has(id)) counts[id] = Math.max(counts[id] || 0,1); });

    let placed = normalizePlaced(legacy.placedItems, counts);
    if (!placed.length) {
      const equipped = legacy.equippedBySlot || legacy.equipped || legacy.room?.equipped || {};
      Object.entries(equipped || {}).forEach(([slot,id],index) => {
        const item = ITEM_MAP.get(id);
        if (!item) return;
        counts[id] = Math.max(counts[id] || 0,1);
        const pos = defaultPosition(item,index);
        placed.push({instanceId:uid(),itemId:id,x:pos.x,y:pos.y,scale:1,flipX:false,rotation:0,zOffset:0});
      });
    }

    state.avatarRoom = {
      version:ROOM_VERSION,
      inventoryCounts:counts,
      placedItems:placed,
      storeCategory:CATEGORIES.some(c => c.id === legacy.storeCategory) ? legacy.storeCategory : 'all',
      inventoryCategory:CATEGORIES.some(c => c.id === legacy.inventoryCategory) ? legacy.inventoryCategory : 'all',
      drawerCategory:CATEGORIES.some(c => c.id === legacy.drawerCategory) ? legacy.drawerCategory : 'all',
      gridEnabled:Boolean(legacy.gridEnabled)
    };
    syncLegacy();
    return state.avatarRoom;
  }

  function syncLegacy() {
    const room = state.avatarRoom;
    if (!room) return;
    const ownedItemIds = Object.keys(room.inventoryCounts).filter(id => room.inventoryCounts[id] > 0);
    const equippedBySlot = {};
    room.placedItems.forEach(placed => {
      const item = ITEM_MAP.get(placed.itemId);
      if (item && !equippedBySlot[item.slot]) equippedBySlot[item.slot] = item.id;
    });
    state.modularRoom = {
      version:ROOM_VERSION,
      ownedItemIds,
      inventoryCounts:{...room.inventoryCounts},
      equippedBySlot,
      placedItems:deepClone(room.placedItems),
      storeCategory:room.storeCategory,
      inventoryCategory:room.inventoryCategory,
      drawerCategory:room.drawerCategory,
      gridEnabled:room.gridEnabled
    };
    state.equippedItems ||= {};
    state.equippedItems.bed = equippedBySlot.bed ? 'bed-sage' : '';
    state.equippedItems.rug = equippedBySlot.rug ? 'rug-sage' : '';
    state.equippedItems.shelf = (equippedBySlot.wallShelf || equippedBySlot.bookcase) ? 'shelf-oak' : '';
    state.equippedItems.lamp = (equippedBySlot.tableLight || equippedBySlot.stringLight || equippedBySlot.ceilingLight) ? 'lamp-moon' : '';
    state.equippedItems.plant = (equippedBySlot.floorPlant || equippedBySlot.hangingPlant) ? 'plant-monstera' : '';
    state.equippedItems.toy = (equippedBySlot.toy || equippedBySlot.catTree || equippedBySlot.catCorner) ? 'toy-ball' : '';
  }

  function persist({notifyBackup=true}={}) {
    syncLegacy();
    saveState({autoBackup:notifyBackup});
    if (typeof renderStats === 'function') renderStats();
    const badge = document.getElementById('dataVersionBadge');
    if (badge) badge.textContent = 'Veri v11 · Oda motoru v2';
  }

  function totalOwned(id) { return Number(roomState().inventoryCounts[id] || 0); }
  function placedCount(id) { return roomState().placedItems.filter(p => p.itemId === id).length; }
  function availableCount(id) { return Math.max(0,totalOwned(id)-placedCount(id)); }
  function getPlaced(instanceId) { return roomState().placedItems.find(p => p.instanceId === instanceId) || null; }

  function dynamicZ(placed, item) {
    const rule = ruleFor(item);
    const depth = ['floor','surface'].includes(rule.kind) ? Math.round(placed.y * 5) : 0;
    return rule.baseZ + depth + Number(placed.zOffset || 0);
  }

  function itemTransformStyle(placed, item) {
    const rule = ruleFor(item);
    return [
      `left:${placed.x}%`,
      `top:${placed.y}%`,
      `width:${baseWidth(item)}%`,
      `z-index:${dynamicZ(placed,item)}`,
      `--scale:${placed.scale}`,
      `--flip:${placed.flipX ? -1 : 1}`,
      `--rotation:${placed.rotation}deg`
    ].join(';');
  }

  function applyPlacedStyle(element, placed, item) {
    if (!element || !placed || !item) return;
    element.style.cssText = itemTransformStyle(placed,item);
    element.dataset.anchor = ruleFor(item).anchor;
  }

  function ensureEditorUi() {
    const roomCanvas = document.getElementById('roomCanvas');
    const roomSection = document.getElementById('roomSection');
    const headerActions = document.querySelector('.room-header-actions');
    if (!roomCanvas || !roomSection || !headerActions) return;

    if (!document.getElementById('v11EditRoomButton')) {
      const editButton = document.createElement('button');
      editButton.id = 'v11EditRoomButton';
      editButton.className = 'v11-edit-button';
      editButton.type = 'button';
      editButton.innerHTML = '<img src="./settings-pixel.png" alt=""> Düzenle';
      headerActions.prepend(editButton);
      editButton.addEventListener('click', () => editing ? saveEdit() : beginEdit());
    }
    if (!document.getElementById('v11FloatingEditButton')) {
      const floating = document.createElement('button');
      floating.id = 'v11FloatingEditButton';
      floating.className = 'v11-floating-edit';
      floating.type = 'button';
      floating.innerHTML = '<img src="./settings-pixel.png" alt=""><span>Odayı Düzenle</span>';
      roomCanvas.appendChild(floating);
      floating.addEventListener('click', event => { event.stopPropagation(); editing ? saveEdit() : beginEdit(); });
    }

    if (!document.getElementById('v11WallGuide')) {
      const wallGuide = document.createElement('div');
      wallGuide.id = 'v11WallGuide'; wallGuide.className = 'v11-zone-guide wall'; wallGuide.setAttribute('aria-hidden','true');
      const floorGuide = document.createElement('div');
      floorGuide.id = 'v11FloorGuide'; floorGuide.className = 'v11-zone-guide floor'; floorGuide.setAttribute('aria-hidden','true');
      roomCanvas.append(wallGuide,floorGuide);
    }

    if (!document.getElementById('v11EditorPanel')) {
      const panel = document.createElement('div');
      panel.id = 'v11EditorPanel'; panel.className = 'v11-editor-panel';
      panel.innerHTML = `
        <div class="v11-editor-head">
          <div class="v11-editor-head-copy"><strong>Oda Düzenleme Modu</strong><small>Eşyayı seç, sürükle ve istediğin yere bırak.</small></div>
          <div class="v11-editor-head-actions">
            <button type="button" id="v11UndoButton">↶ Geri</button>
            <button type="button" id="v11RedoButton">↷ İleri</button>
            <button type="button" id="v11GridButton">Izgara</button>
            <button type="button" class="cancel" id="v11CancelButton">Vazgeç</button>
            <button type="button" class="save" id="v11SaveButton">Kaydet</button>
          </div>
        </div>
        <div class="v11-selected-tools" id="v11SelectedTools">
          <div class="v11-selected-meta"><strong id="v11SelectedName">Eşya seç</strong><span id="v11SelectedKind">—</span></div>
          <div class="v11-selected-actions">
            <button type="button" data-v11-action="smaller">− Küçült</button>
            <button type="button" data-v11-action="larger">＋ Büyüt</button>
            <button type="button" data-v11-action="flip">⇆ Çevir</button>
            <button type="button" data-v11-action="rotate">↻ Döndür</button>
            <button type="button" data-v11-action="back">↓ Arkaya</button>
            <button type="button" data-v11-action="front">↑ Öne</button>
            <button type="button" data-v11-action="duplicate">⧉ Kopyala</button>
            <button type="button" class="danger" data-v11-action="remove">Kaldır</button>
          </div>
        </div>
        <div class="v11-room-inventory">
          <div class="v11-room-inventory-head"><strong>Envanter</strong><span id="v11DrawerSummary">0 eşya hazır</span></div>
          <div class="v11-room-category-tabs" id="v11DrawerTabs"></div>
          <div class="v11-room-inventory-grid" id="v11DrawerGrid"></div>
        </div>
        <div class="v11-editor-tip">Duvar eşyaları duvarda, mobilyalar zeminde kalır. Katman düğmeleriyle eşyaları ön veya arkaya alabilirsin.</div>`;
      const imageWrap = roomSection.querySelector('.room-image-wrap');
      imageWrap.insertAdjacentElement('afterend',panel);

      document.getElementById('v11UndoButton').addEventListener('click',undo);
      document.getElementById('v11RedoButton').addEventListener('click',redo);
      document.getElementById('v11GridButton').addEventListener('click',toggleGrid);
      document.getElementById('v11CancelButton').addEventListener('click',cancelEdit);
      document.getElementById('v11SaveButton').addEventListener('click',saveEdit);
      panel.querySelectorAll('[data-v11-action]').forEach(button => button.addEventListener('click',() => selectedAction(button.dataset.v11Action)));
    }

    preservedMikiNode = document.getElementById('roomMikiWrap') || preservedMikiNode;
    const layer = document.getElementById('v10RoomLayers');
    if (preservedMikiNode && layer && preservedMikiNode.parentElement !== layer) layer.appendChild(preservedMikiNode);

    if (roomCanvas.dataset.v11ListenersBound !== '1') {
      roomCanvas.dataset.v11ListenersBound = '1';
      roomCanvas.addEventListener('pointerdown',onCanvasPointerDown);
      window.addEventListener('pointermove',onPointerMove,{passive:false});
      window.addEventListener('pointerup',onPointerUp);
      window.addEventListener('pointercancel',onPointerUp);
    }
  }

  function snapshot() { return deepClone(roomState().placedItems); }
  function pushHistory() {
    undoStack.push(snapshot());
    if (undoStack.length > 40) undoStack.shift();
    redoStack.length = 0;
    updateEditorButtons();
  }

  function undo() {
    if (!editing || !undoStack.length) return;
    redoStack.push(snapshot());
    roomState().placedItems = undoStack.pop();
    selectedId = null;
    renderAllRoomUi();
  }

  function redo() {
    if (!editing || !redoStack.length) return;
    undoStack.push(snapshot());
    roomState().placedItems = redoStack.pop();
    selectedId = null;
    renderAllRoomUi();
  }

  function beginEdit() {
    if (editing) return;
    editing = true;
    initialSnapshot = snapshot();
    undoStack = []; redoStack = [];
    selectedId = null;
    const panel = document.getElementById('v11EditorPanel');
    const canvas = document.getElementById('roomCanvas');
    const editButton = document.getElementById('v11EditRoomButton');
    const floatingButton = document.getElementById('v11FloatingEditButton');
    panel?.classList.add('is-open');
    canvas?.classList.add('v11-editing');
    editButton?.classList.add('is-active');
    floatingButton?.classList.add('is-active');
    if (editButton) editButton.innerHTML = '<img src="./check-pixel.png" alt=""> Kaydet';
    if (floatingButton) floatingButton.innerHTML = '<img src="./check-pixel.png" alt=""><span>Odayı Kaydet</span>';
    applyGridClass();
    renderAllRoomUi();
    showRoomStatus?.('Düzenleme modu açık. Eşyaları sürükleyebilirsin.');
  }

  function finishEditUi() {
    editing = false; selectedId = null; drag = null;
    document.getElementById('v11EditorPanel')?.classList.remove('is-open');
    document.getElementById('roomCanvas')?.classList.remove('v11-editing','v11-grid-on');
    const editButton = document.getElementById('v11EditRoomButton');
    const floatingButton = document.getElementById('v11FloatingEditButton');
    editButton?.classList.remove('is-active');
    floatingButton?.classList.remove('is-active');
    if (editButton) editButton.innerHTML = '<img src="./settings-pixel.png" alt=""> Düzenle';
    if (floatingButton) floatingButton.innerHTML = '<img src="./settings-pixel.png" alt=""><span>Odayı Düzenle</span>';
    updateSelectedTools();
  }

  function saveEdit() {
    if (!editing) return;
    persist();
    finishEditUi();
    renderAllRoomUi();
    showToast?.('Oda düzenin kaydedildi');
    showRoomStatus?.('Miki yeni düzeni çok sevdi.');
  }

  function cancelEdit() {
    if (!editing) return;
    roomState().placedItems = initialSnapshot || [];
    finishEditUi();
    renderAllRoomUi();
    showToast?.('Oda değişiklikleri geri alındı');
  }

  function toggleGrid() {
    const room = roomState();
    room.gridEnabled = !room.gridEnabled;
    applyGridClass();
  }

  function applyGridClass() {
    const enabled = editing && roomState().gridEnabled;
    document.getElementById('roomCanvas')?.classList.toggle('v11-grid-on',enabled);
    document.getElementById('v11GridButton')?.classList.toggle('active',enabled);
  }

  function onCanvasPointerDown(event) {
    if (!editing) return;
    const target = event.target.closest?.('.v11-room-item');
    if (!target) {
      selectedId = null;
      updateSelectedTools();
      renderLayers();
      return;
    }
    const placed = getPlaced(target.dataset.instanceId);
    if (!placed) return;
    event.preventDefault();
    pushHistory();
    selectedId = placed.instanceId;
    const rect = document.getElementById('roomCanvas').getBoundingClientRect();
    const pointerX = ((event.clientX - rect.left) / rect.width) * 100;
    const pointerY = ((event.clientY - rect.top) / rect.height) * 100;
    drag = {instanceId:placed.instanceId,pointerId:event.pointerId,offsetX:pointerX-placed.x,offsetY:pointerY-placed.y,moved:false,element:target};
    try { target.setPointerCapture?.(event.pointerId); } catch (_) {}
    document.querySelectorAll('.v11-room-item').forEach(el => el.classList.toggle('is-selected',el===target));
    target.classList.add('is-dragging');
    updateSelectedTools();
  }

  function onPointerMove(event) {
    if (!editing || !drag || event.pointerId !== drag.pointerId) return;
    event.preventDefault();
    const canvas = document.getElementById('roomCanvas');
    const rect = canvas.getBoundingClientRect();
    const placed = getPlaced(drag.instanceId);
    const item = placed && ITEM_MAP.get(placed.itemId);
    if (!placed || !item) return;
    const rule = ruleFor(item);
    let x = ((event.clientX - rect.left) / rect.width) * 100 - drag.offsetX;
    let y = ((event.clientY - rect.top) / rect.height) * 100 - drag.offsetY;
    if (roomState().gridEnabled) { x = Math.round(x/2.5)*2.5; y = Math.round(y/2.5)*2.5; }
    placed.x = round2(clamp(x,rule.minX,rule.maxX));
    placed.y = round2(clamp(y,rule.minY,rule.maxY));
    drag.moved = true;
    applyPlacedStyle(drag.element,placed,item);
  }

  function onPointerUp(event) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    drag.element?.classList.remove('is-dragging');
    drag = null;
    renderLayers();
    renderDrawer();
  }

  function selectInstance(instanceId) {
    selectedId = getPlaced(instanceId) ? instanceId : null;
    renderLayers();
    updateSelectedTools();
  }

  function selectedAction(action) {
    if (!editing || !selectedId) return;
    const placed = getPlaced(selectedId);
    const item = placed && ITEM_MAP.get(placed.itemId);
    if (!placed || !item) return;
    const rule = ruleFor(item);
    pushHistory();
    if (action === 'smaller') placed.scale = round2(clamp(placed.scale - .08,rule.minScale,rule.maxScale));
    if (action === 'larger') placed.scale = round2(clamp(placed.scale + .08,rule.minScale,rule.maxScale));
    if (action === 'flip') placed.flipX = !placed.flipX;
    if (action === 'rotate') placed.rotation = (Number(placed.rotation || 0) + 15) % 360;
    if (action === 'back') placed.zOffset = clamp(Number(placed.zOffset || 0)-25,-180,180);
    if (action === 'front') placed.zOffset = clamp(Number(placed.zOffset || 0)+25,-180,180);
    if (action === 'remove') {
      roomState().placedItems = roomState().placedItems.filter(p => p.instanceId !== placed.instanceId);
      selectedId = null;
    }
    if (action === 'duplicate') {
      if (availableCount(item.id) <= 0) { undoStack.pop(); showToast?.('Bu eşyadan envanterinde başka yok'); updateEditorButtons(); return; }
      const copy = {...deepClone(placed),instanceId:uid(),x:clamp(placed.x+5,rule.minX,rule.maxX),y:clamp(placed.y+3,rule.minY,rule.maxY)};
      roomState().placedItems.push(copy); selectedId = copy.instanceId; justAddedId = copy.instanceId;
    }
    renderAllRoomUi();
  }

  function placeFromInventory(id) {
    const item = ITEM_MAP.get(id);
    if (!item || availableCount(id) <= 0) return;
    if (!editing) beginEdit();
    pushHistory();
    const sameTypeIndex = roomState().placedItems.filter(p => ITEM_MAP.get(p.itemId)?.slot === item.slot).length;
    const pos = defaultPosition(item,sameTypeIndex);
    const placed = {instanceId:uid(),itemId:id,x:pos.x,y:pos.y,scale:1,flipX:false,rotation:0,zOffset:0};
    roomState().placedItems.push(placed);
    selectedId = placed.instanceId; justAddedId = placed.instanceId;
    renderAllRoomUi();
    showToast?.(`${item.name} odaya eklendi`);
  }

  function removeOnePlacedItem(id) {
    const found = [...roomState().placedItems].reverse().find(p => p.itemId === id);
    if (!found) return;
    if (!editing) beginEdit();
    pushHistory();
    roomState().placedItems = roomState().placedItems.filter(p => p.instanceId !== found.instanceId);
    if (selectedId === found.instanceId) selectedId = null;
    renderAllRoomUi();
  }

  function buy(id) {
    const item = ITEM_MAP.get(id);
    if (!item) return;
    if (state.coins < item.price) { showToast?.('Bu eşya için yeterli coinin yok'); return; }
    state.coins -= item.price;
    const room = roomState();
    room.inventoryCounts[id] = Math.min(99,Number(room.inventoryCounts[id] || 0)+1);
    persist();
    renderAllRoomUi();
    showToast?.(`${item.name} envanterine eklendi`);
  }

  function renderLayers() {
    const layer = document.getElementById('v10RoomLayers');
    if (!layer) return;
    const miki = document.getElementById('roomMikiWrap') || preservedMikiNode;
    if (miki) preservedMikiNode = miki;
    const markup = roomState().placedItems.map(placed => {
      const item = ITEM_MAP.get(placed.itemId);
      if (!item) return '';
      const rule = ruleFor(item);
      return `<button type="button" class="v11-room-item${placed.instanceId===selectedId?' is-selected':''}${placed.instanceId===justAddedId?' v11-pop':''}" data-instance-id="${placed.instanceId}" data-anchor="${rule.anchor}" aria-label="${safeText(item.name)}" style="${itemTransformStyle(placed,item)}"><img src="${item.image}" alt=""></button>`;
    }).join('');
    layer.innerHTML = markup;
    if (miki) layer.appendChild(miki);
    layer.querySelectorAll('.v11-room-item').forEach(button => {
      button.addEventListener('click',event => { if(editing){event.stopPropagation();selectInstance(button.dataset.instanceId);} });
    });
    justAddedId = null;
  }

  function renderCategoryTabs(containerId,current,onSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = CATEGORIES.map(cat => `<button type="button" class="${cat.id===current?'active':''}" data-category="${cat.id}">${cat.label}</button>`).join('');
    container.querySelectorAll('button').forEach(button => button.addEventListener('click',() => onSelect(button.dataset.category)));
  }

  function filteredItems(category) { return category === 'all' ? ITEMS : ITEMS.filter(item => item.group === category); }

  function renderDrawer() {
    const room = roomState();
    renderCategoryTabs('v11DrawerTabs',room.drawerCategory,category => { room.drawerCategory=category; renderDrawer(); });
    const grid = document.getElementById('v11DrawerGrid');
    if (!grid) return;
    const visible = filteredItems(room.drawerCategory).filter(item => totalOwned(item.id) > 0);
    const availableTotal = ITEMS.reduce((sum,item) => sum + availableCount(item.id),0);
    const summary = document.getElementById('v11DrawerSummary');
    if (summary) summary.textContent = `${availableTotal} eşya hazır`;
    grid.innerHTML = visible.length ? visible.map(item => {
      const total = totalOwned(item.id), placed = placedCount(item.id), available = availableCount(item.id);
      return `<article class="v11-drawer-item"><span class="count">${placed}/${total}</span><div class="preview"><img src="${item.image}" alt="${safeText(item.name)}"></div><div><strong>${safeText(item.name)}</strong><small>${available} adet boşta</small></div><button type="button" data-v11-place="${item.id}" ${available<=0?'disabled':''}>${available>0?'Odaya Ekle':'Hepsi Odada'}</button></article>`;
    }).join('') : '<div class="v11-empty-drawer">Bu kategoride satın aldığın eşya yok.</div>';
    grid.querySelectorAll('[data-v11-place]').forEach(button => button.addEventListener('click',() => placeFromInventory(button.dataset.v11Place)));
  }

  function renderShopV11() {
    const room = roomState();
    renderCategoryTabs('storeCategoryTabs',room.storeCategory,category => { room.storeCategory=category; renderShopV11(); });
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    grid.innerHTML = filteredItems(room.storeCategory).map(item => {
      const total = totalOwned(item.id);
      return `<article class="shop-item"><span class="v11-card-count">Sende ${total}</span><div class="v10-catalog-preview"><img src="${item.image}" alt="${safeText(item.name)}"></div><div class="v10-catalog-copy"><small>${safeText(item.category)}</small><strong>${safeText(item.name)}</strong><span><img src="./coin.png" alt=""> ${item.price.toLocaleString('tr-TR')}</span><em class="v11-card-subline">Serbestçe yerleştirilebilir</em></div><button type="button" class="v11-buy" data-v11-buy="${item.id}">Satın Al</button></article>`;
    }).join('');
    grid.querySelectorAll('[data-v11-buy]').forEach(button => button.addEventListener('click',() => buy(button.dataset.v11Buy)));
  }

  function renderInventoryV11() {
    const room = roomState();
    renderCategoryTabs('inventoryCategoryTabs',room.inventoryCategory,category => { room.inventoryCategory=category; renderInventoryV11(); });
    const grid = document.getElementById('inventoryGrid');
    if (!grid) return;
    const visible = filteredItems(room.inventoryCategory).filter(item => totalOwned(item.id) > 0);
    const totalUnits = Object.values(room.inventoryCounts).reduce((sum,n) => sum+Number(n||0),0);
    const count = document.getElementById('inventoryOwnedCount');
    if (count) count.textContent = `${totalUnits} eşya`;
    grid.innerHTML = visible.length ? visible.map(item => {
      const total=totalOwned(item.id),placed=placedCount(item.id),available=availableCount(item.id);
      const action = available>0 ? `<button type="button" class="v11-place" data-v11-inventory-place="${item.id}">Odaya Ekle</button>` : `<button type="button" class="v11-find" data-v11-find="${item.id}">Odada Göster</button>`;
      return `<article class="inventory-item"><span class="v11-card-count">${placed}/${total} odada</span><div class="v10-catalog-preview"><img src="${item.image}" alt="${safeText(item.name)}"></div><div class="v10-catalog-copy"><small>${safeText(item.category)}</small><strong>${safeText(item.name)}</strong><span>${available} adet envanterde</span><em class="v11-card-subline">Taşı, çevir, büyüt ve katmanla</em></div>${action}</article>`;
    }).join('') : '<div class="v10-empty">Henüz bu kategoride eşyan yok.</div>';
    grid.querySelectorAll('[data-v11-inventory-place]').forEach(button => button.addEventListener('click',() => {
      switchToRoomPanel(); placeFromInventory(button.dataset.v11InventoryPlace);
    }));
    grid.querySelectorAll('[data-v11-find]').forEach(button => button.addEventListener('click',() => {
      const found = roomState().placedItems.find(p => p.itemId === button.dataset.v11Find);
      switchToRoomPanel(); beginEdit(); if(found) selectInstance(found.instanceId);
    }));
    if (!document.querySelector('.v11-inventory-note')) {
      const card = document.querySelector('.inventory-page-card');
      card?.insertAdjacentHTML('beforeend','<p class="v11-inventory-note">Eşyalar artık sabit yuvalara bağlı değil. Düzenleme modunda istediğin yere taşıyabilir, çevirebilir ve katman sırasını değiştirebilirsin.</p>');
    }
  }

  function switchToRoomPanel() {
    document.querySelectorAll('.miki-subtabs button').forEach(button => button.classList.toggle('active',button.dataset.mikiPanel==='room'));
    document.querySelectorAll('.miki-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById('mikiRoomPanel')?.classList.add('active');
  }

  function updateSelectedTools() {
    const tools = document.getElementById('v11SelectedTools');
    const placed = selectedId ? getPlaced(selectedId) : null;
    const item = placed && ITEM_MAP.get(placed.itemId);
    tools?.classList.toggle('is-visible',Boolean(item && editing));
    if (!item) return;
    const rule = ruleFor(item);
    const name = document.getElementById('v11SelectedName');
    const kind = document.getElementById('v11SelectedKind');
    if (name) name.textContent = item.name;
    if (kind) kind.textContent = `${friendlyKinds[rule.kind] || 'Eşya'} · %${Math.round(placed.scale*100)}`;
    const duplicate = document.querySelector('[data-v11-action="duplicate"]');
    if (duplicate) duplicate.disabled = availableCount(item.id) <= 0;
  }

  function updateEditorButtons() {
    const undoButton = document.getElementById('v11UndoButton');
    const redoButton = document.getElementById('v11RedoButton');
    if (undoButton) undoButton.disabled = !undoStack.length;
    if (redoButton) redoButton.disabled = !redoStack.length;
  }

  function renderAllRoomUi() {
    renderLayers();
    renderDrawer();
    renderShopV11();
    renderInventoryV11();
    updateSelectedTools();
    updateEditorButtons();
    applyGridClass();
  }

  const oldRenderRoom = typeof renderRoom === 'function' ? renderRoom : null;
  function renderRoomV11() {
    roomState();
    preservedMikiNode = document.getElementById('roomMikiWrap') || preservedMikiNode;
    if (oldRenderRoom) {
      try { oldRenderRoom(null); } catch (_) {}
    }
    const layerAfterLegacy = document.getElementById('v10RoomLayers');
    if (preservedMikiNode && layerAfterLegacy && !document.contains(preservedMikiNode)) layerAfterLegacy.appendChild(preservedMikiNode);
    ensureEditorUi();
    renderLayers(); renderDrawer(); updateSelectedTools(); updateEditorButtons(); applyGridClass();
    const badge = document.getElementById('dataVersionBadge');
    if (badge) badge.textContent = 'Veri v11 · Oda motoru v2';
  }

  // Replace the V10 fixed-slot room APIs with the V11 free-placement engine.
  renderRoom = renderRoomV11;
  renderShop = renderShopV11;
  renderInventory = renderInventoryV11;
  buyItem = item => buy(typeof item === 'string' ? item : item?.id);
  equipRoomItem = placeFromInventory;
  unequipRoomSlot = slot => {
    const found = [...roomState().placedItems].reverse().find(p => ITEM_MAP.get(p.itemId)?.slot === slot);
    if (found) removeOnePlacedItem(found.itemId);
  };

  roomState();
  ensureEditorUi();
  persist({notifyBackup:false});
  renderAllRoomUi();
  const version = document.querySelector('.version'); if (version) version.textContent = 'v11';
  document.title = 'Berna V11';

  document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click',() => {
    if (editing && button.dataset.page !== 'mikiPage') saveEdit();
  }));
  window.addEventListener('beforeunload',() => { if(editing) persist({notifyBackup:false}); });

  window.BernaRoomEditor = {
    begin:beginEdit, save:saveEdit, cancel:cancelEdit, buy, place:placeFromInventory,
    remove:removeOnePlacedItem, state:() => deepClone(roomState())
  };
})();
