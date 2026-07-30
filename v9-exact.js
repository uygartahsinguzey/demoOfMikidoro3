/* Berna V9 – strict reference-layout adapter.
   Keeps the V9 data model/features; only reorganizes the visible mobile UI. */
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function addDaysExact(key, amount) {
    const [y,m,d] = key.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + amount);
    return localDateKey(date);
  }

  function completedMinutes(key) {
    try {
      if (typeof completedMinutesForDate === "function") return Number(completedMinutesForDate(key)) || 0;
      const entry = state?.history?.[key];
      return (entry?.sessions || []).filter(s => s.completed !== false && s.type !== "break").reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
    } catch { return 0; }
  }

  function completedPomodoros(key) {
    try {
      if (typeof completedPomodorosForDate === "function") return Number(completedPomodorosForDate(key)) || 0;
      const entry = state?.history?.[key];
      return (entry?.sessions || []).filter(s => s.completed !== false && (s.mode === "pomodoro" || s.type === "pomodoro")).length;
    } catch { return 0; }
  }

  function prepareToday() {
    const page = $("#todayPage");
    const grid = $("#todayPage .today-page-grid");
    const primary = $("#todayPrimary");
    const exam = $("#examCountdownCard");
    const summary = $("#todayStudySummary");
    const achievements = $("#todayPage .achievement-preview-card");
    const missions = $("#todayPage .daily-missions-card");
    if (!page || !grid || !exam || !summary || !achievements || !missions) return;

    primary?.classList.add("exact-feature-storage");
    exam.classList.add("exact-exam-card");
    summary.classList.add("exact-summary-card");
    grid.insertBefore(exam, achievements);
    grid.insertBefore(summary, achievements);

    const missionHead = $(".feature-card-head", missions);
    if (missionHead) {
      missionHead.classList.add("exact-mission-head");
      const missionTitle = $("h2", missionHead);
      if (missionTitle) missionTitle.textContent = "Günlük Görevler";
    }

    if (!$(".exact-section-label", exam.parentElement)) {
      // Label is drawn by CSS for the exam card.
    }

    let summaryLabel = $("#exactSummaryLabel");
    if (!summaryLabel) {
      summaryLabel = document.createElement("div");
      summaryLabel.id = "exactSummaryLabel";
      summaryLabel.className = "exact-section-label exact-summary-label";
      summaryLabel.textContent = "Günlük Özet";
    }
    // Keep a deterministic order even after the underlying render functions run.
    grid.appendChild(missions);
    grid.appendChild(exam);
    grid.appendChild(summaryLabel);
    grid.appendChild(summary);
    grid.appendChild(achievements);

    const achHead = $(".feature-card-head", achievements);
    if (achHead) {
      const title = $("h2", achHead);
      if (title) title.textContent = "Başarılar";
      const count = $("#achievementCount", achHead);
      if (count) count.style.display = "none";
    }
    const allButton = $("#openAchievementsButton");
    if (allButton) allButton.textContent = "Tümünü Gör  ›";
  }

  function prepareFocus() {
    const ring = $(".focus-ring-shell");
    const tabs = $("#workModeTabs");
    if (ring && tabs && !$("#exactModeButton")) {
      const button = document.createElement("button");
      button.type = "button";
      button.id = "exactModeButton";
      button.className = "exact-mode-button";
      button.innerHTML = `<span>Pomodoro</span><small>1 / 4</small>`;
      ring.appendChild(button);

      const popover = document.createElement("div");
      popover.className = "exact-mode-popover";
      popover.id = "exactModePopover";
      tabs.parentNode.insertBefore(popover, tabs);
      popover.appendChild(tabs);
      button.addEventListener("click", event => {
        event.stopPropagation();
        popover.classList.toggle("open");
      });
      document.addEventListener("click", event => {
        if (!event.target.closest("#exactModePopover") && !event.target.closest("#exactModeButton")) popover.classList.remove("open");
      });
      tabs.addEventListener("click", event => {
        const choice = event.target.closest("[data-work-mode]");
        if (!choice) return;
        button.querySelector("span").textContent = choice.textContent.trim();
        setTimeout(() => popover.classList.remove("open"), 80);
      });
    }

    const mikiSlot = $("#focusMikiSlot");
    const mikiCard = $("#mikiCard");
    if (mikiSlot && mikiCard && !$(".exact-focus-scene", mikiSlot)) {
      const scene = document.createElement("div");
      scene.className = "exact-focus-scene";
      scene.innerHTML = `
        <img class="exact-scene-plant" src="./plant.png" alt="">
        <img class="exact-scene-window" src="./window.png" alt="">
        <img class="exact-scene-bed" src="./bed.png" alt="">
      `;
      mikiSlot.insertBefore(scene, mikiCard);
      scene.appendChild(mikiCard);
    }

    const taskLabel = $("#focusTaskPicker label");
    if (taskLabel) taskLabel.textContent = "Seçili Görev";
    const ambient = $("#ambientNow");
    if (ambient) ambient.setAttribute("aria-label", "Ortam sesi seç");
  }

  function prepareAgenda() {
    const card = $("#agendaPage .agenda-card");
    const list = $("#agendaTaskList");
    if (card && list && !$(".exact-agenda-list-title", card)) {
      const title = document.createElement("div");
      title.className = "exact-agenda-list-title";
      title.innerHTML = `<strong>Bugünkü Planlar</strong><span id="exactAgendaDateLabel"></span>`;
      card.insertBefore(title, list);
    }
  }

  function setExactMikiPanel(panel = "inventory", { save = true } = {}) {
    const chosen = panel === "store" ? "store" : "inventory";
    if (typeof state !== "undefined") state.mikiPanel = chosen;
    $("#mikiRoomPanel")?.classList.add("active");
    // Inventory stays in the page; the store opens as a drawer above it.
    $("#mikiInventoryPanel")?.classList.add("active");
    $("#mikiStorePanel")?.classList.toggle("active", chosen === "store");
    $$('[data-miki-panel]').forEach(button => button.classList.toggle("active", button.dataset.mikiPanel === chosen));
    try {
      if (chosen === "inventory" && typeof renderInventory === "function") renderInventory();
      if (chosen === "store" && typeof renderShop === "function") renderShop();
      if (typeof renderRoom === "function") renderRoom();
      if (save && typeof saveState === "function") saveState({ autoBackup: false });
    } catch {}
  }

  function prepareMiki() {
    const subtabs = $("#mikiSubtabs");
    if (!subtabs) return;
    const roomButton = $('[data-miki-panel="room"]', subtabs);
    roomButton?.remove();
    const inventoryButton = $('[data-miki-panel="inventory"]', subtabs);
    const storeButton = $('[data-miki-panel="store"]', subtabs);
    const storeSection = $("#storeSection");
    if (storeSection && !$(".exact-store-drawer-head", storeSection)) {
      const drawerHead = document.createElement("div");
      drawerHead.className = "exact-store-drawer-head";
      drawerHead.innerHTML = `<strong>Dükkan</strong><button type="button" aria-label="Dükkanı kapat">×</button>`;
      storeSection.insertBefore(drawerHead, storeSection.firstChild);
      $("button", drawerHead).addEventListener("click", () => setExactMikiPanel("inventory"));
    }
    if (inventoryButton) inventoryButton.innerHTML = `<span>Eşyalarım</span>`;
    if (storeButton) storeButton.innerHTML = `<span>Dükkan</span>`;

    if (!subtabs.dataset.exactBound) {
      subtabs.dataset.exactBound = "1";
      subtabs.addEventListener("click", event => {
      const button = event.target.closest("[data-miki-panel]");
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setExactMikiPanel(button.dataset.mikiPanel);
      }, true);
    }

    try {
      showMikiPanel = function exactShowMikiPanel(panelId, options = {}) {
        setExactMikiPanel(panelId, options);
      };
    } catch {}

    setExactMikiPanel(state?.mikiPanel === "store" ? "store" : "inventory", { save: false });
  }

  function totalCompletedMinutes() {
    const keys = Object.keys(state?.history || {});
    return keys.reduce((sum, key) => sum + completedMinutes(key), 0);
  }

  function totalCompletedTasks() {
    return Object.values(state?.history || {}).reduce((sum, day) => sum + (day?.tasks || []).filter(t => t.done).length, 0) + (state?.tasks || []).filter(t => t.done).length;
  }

  function buildHeatmap() {
    const heatmap = $("#exactHeatmap");
    if (!heatmap) return;
    const today = localDateKey();
    const cells = [];
    for (let offset = -34; offset <= 0; offset += 1) {
      const key = addDaysExact(today, offset);
      const minutes = completedMinutes(key);
      const level = minutes === 0 ? 0 : minutes < 30 ? 1 : minutes < 60 ? 2 : 3;
      cells.push(`<span class="heat-${level}" title="${key}: ${minutes} dk"></span>`);
    }
    heatmap.innerHTML = cells.join("");
  }

  function buildWeekBars() {
    const bars = $("#exactWeekBars");
    if (!bars) return;
    const today = new Date();
    const mondayDelta = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayDelta);
    const labels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
    const values = labels.map((_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return completedMinutes(localDateKey(date));
    });
    const max = Math.max(60, ...values);
    bars.innerHTML = values.map((value, index) => {
      const hours = value / 60;
      const height = Math.max(value ? 12 : 3, Math.round(value / max * 86));
      return `<div class="exact-bar-column"><span>${hours ? hours.toFixed(1) : "0"}</span><i style="height:${height}px"></i><small>${labels[index]}</small></div>`;
    }).join("");
  }

  function buildProgressDashboard() {
    const shell = $("#progressPage .history-page-shell");
    if (!shell) return;
    let dashboard = $("#exactProgressDashboard");
    if (!dashboard) {
      dashboard = document.createElement("div");
      dashboard.id = "exactProgressDashboard";
      dashboard.className = "exact-progress-dashboard";
      dashboard.innerHTML = `
        <section class="card exact-heatmap-card">
          <div class="exact-card-heading"><strong>Çalışma Takvimi</strong><span>${new Intl.DateTimeFormat("tr-TR", {month:"long", year:"numeric"}).format(new Date())}</span></div>
          <div class="exact-heatmap-weekdays"><span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span></div>
          <div class="exact-heatmap" id="exactHeatmap"></div>
          <div class="exact-heat-legend"><span><i class="heat-0"></i>0 dk</span><span><i class="heat-1"></i>1–29 dk</span><span><i class="heat-2"></i>30–59 dk</span><span><i class="heat-3"></i>60+ dk</span></div>
        </section>
        <section class="card exact-week-card">
          <div class="exact-card-heading"><strong>Haftalık Çalışma (saat)</strong><span>Bu hafta</span></div>
          <div class="exact-week-bars" id="exactWeekBars"></div>
        </section>
        <section class="exact-stat-section">
          <h3>İstatistikler</h3>
          <div class="exact-stat-grid">
            <div><img src="./history-pixel.png" alt=""><span>Toplam Süre</span><strong id="exactTotalTime">0 dk</strong></div>
            <div><img src="./tomato.png" alt=""><span>Toplam Pomodoro</span><strong id="exactTotalPomodoro">0</strong></div>
            <div><img src="./check-pixel.png" alt=""><span>Tamamlanan Görev</span><strong id="exactTotalTasks">0</strong></div>
            <div><img src="./miki-card.png" alt=""><span>Ortalama / Gün</span><strong id="exactAverageDay">0 dk</strong></div>
          </div>
        </section>
        <section class="card exact-streak-card">
          <div><span class="exact-fire">◆</span><div><strong>Seri (Streak)</strong><small id="exactStreakMeta">En uzun seri: 0 gün</small></div></div>
          <strong id="exactStreakValue">0 gün</strong>
          <img src="./miki-card.png" alt="Miki">
        </section>
        <button class="exact-details-toggle" id="exactDetailsToggle" type="button">Ayrıntılı geçmişi aç</button>
      `;
      const titleRow = $(".history-title-row", shell);
      titleRow?.insertAdjacentElement("afterend", dashboard);
      const details = [...shell.children].filter(child => child !== titleRow && child !== dashboard);
      details.forEach(child => child.classList.add("exact-progress-detail"));
      $("#exactDetailsToggle")?.addEventListener("click", () => {
        shell.classList.toggle("show-exact-details");
        $("#exactDetailsToggle").textContent = shell.classList.contains("show-exact-details") ? "Ayrıntılı geçmişi kapat" : "Ayrıntılı geçmişi aç";
      });
    }

    buildHeatmap();
    buildWeekBars();
    const total = totalCompletedMinutes();
    const activeDays = Math.max(1, Object.keys(state?.history || {}).filter(k => completedMinutes(k) > 0).length);
    const totalPomodoros = Number(state?.pomodoros) || Object.keys(state?.history || {}).reduce((sum, key) => sum + completedPomodoros(key), 0);
    $("#exactTotalTime").textContent = total >= 60 ? `${Math.floor(total / 60)} sa ${total % 60} dk` : `${total} dk`;
    $("#exactTotalPomodoro").textContent = String(totalPomodoros);
    $("#exactTotalTasks").textContent = String(totalCompletedTasks());
    $("#exactAverageDay").textContent = `${Math.round(total / activeDays)} dk`;
    const current = Number(state?.streak?.current) || 0;
    const longest = Number(state?.streak?.longest) || 0;
    $("#exactStreakValue").textContent = `${current} gün`;
    $("#exactStreakMeta").textContent = `En uzun seri: ${longest} gün`;
  }

  function refreshExactUI() {
    prepareToday();
    prepareFocus();
    prepareAgenda();
    prepareMiki();
    buildProgressDashboard();
    const dateLabel = $("#exactAgendaDateLabel");
    if (dateLabel) dateLabel.textContent = agendaSelectedDate === state.currentDate ? "Bugün" : (typeof formatFullDate === "function" ? formatFullDate(agendaSelectedDate) : agendaSelectedDate);
    const modeButton = $("#exactModeButton span");
    const activeMode = $("#workModeTabs [data-work-mode].active");
    if (modeButton && activeMode) modeButton.textContent = activeMode.textContent.trim();
  }

  // Keep exact dashboard synchronized with existing render cycles.
  try {
    const oldRenderAll = renderAll;
    renderAll = function exactRenderAll() {
      oldRenderAll();
      requestAnimationFrame(refreshExactUI);
    };
  } catch {}
  try {
    const oldRenderHistory = renderHistory;
    renderHistory = function exactRenderHistory() {
      oldRenderHistory();
      requestAnimationFrame(buildProgressDashboard);
    };
  } catch {}
  try {
    const oldShowPage = showAppPage;
    showAppPage = function exactShowPage(pageId, options) {
      oldShowPage(pageId, options);
      requestAnimationFrame(() => {
        if (pageId === "mikiPage") setExactMikiPanel(state?.mikiPanel === "store" ? "store" : "inventory", { save: false });
        refreshExactUI();
      });
    };
  } catch {}

  $$(".nav-item").forEach(button => button.addEventListener("click", () => requestAnimationFrame(refreshExactUI)));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshExactUI(); });
  window.addEventListener("resize", refreshExactUI);
  refreshExactUI();
})();
