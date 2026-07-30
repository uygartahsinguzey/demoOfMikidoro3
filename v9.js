/* Berna V9 reference concept enhancements. Existing data model and features are preserved. */
(() => {
  const trMonth = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" });
  const trDay = new Intl.DateTimeFormat("tr-TR", { weekday: "long", day: "numeric", month: "long" });

  function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function safeDate(key) {
    const parsed = typeof parseDateKey === "function" ? parseDateKey(key) : null;
    return parsed || new Date();
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function addMonths(date, amount) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
  }

  function renderV9Greeting() {
    const heading = document.querySelector(".v9-greeting-copy h1");
    if (!heading) return;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";
    const sun = heading.querySelector("img");
    heading.textContent = `${greeting}, Berna! `;
    if (sun) heading.appendChild(sun);
  }

  function renderV9AgendaCalendar() {
    const grid = document.getElementById("agendaMonthGrid");
    const label = document.getElementById("agendaMonthLabel");
    if (!grid || !label || typeof agendaSelectedDate === "undefined") return;

    const selected = safeDate(agendaSelectedDate);
    const first = startOfMonth(selected);
    label.textContent = trMonth.format(first).replace(/^./, char => char.toLocaleUpperCase("tr-TR"));

    // Convert Sunday=0 to Monday=0.
    const mondayIndex = (first.getDay() + 6) % 7;
    const cursor = new Date(first);
    cursor.setDate(first.getDate() - mondayIndex);
    const todayKey = typeof getDateKey === "function" ? getDateKey() : dateKey(new Date());

    grid.innerHTML = "";
    for (let i = 0; i < 42; i += 1) {
      const current = new Date(cursor);
      current.setDate(cursor.getDate() + i);
      const key = dateKey(current);
      const tasks = typeof agendaTasksForDate === "function" ? agendaTasksForDate(key) : [];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "v9-month-day";
      if (current.getMonth() !== first.getMonth()) button.classList.add("outside");
      if (key === agendaSelectedDate) button.classList.add("selected");
      if (key === todayKey) button.classList.add("today");
      if (tasks.length) button.classList.add("has-tasks");
      button.dataset.date = key;
      button.setAttribute("aria-label", trDay.format(current));
      button.textContent = String(current.getDate());
      grid.appendChild(button);
    }
  }

  function renderV9AgendaCards() {
    const examName = document.getElementById("agendaExamName");
    const examMeta = document.getElementById("agendaExamMeta");
    const examPct = document.getElementById("agendaExamPercent");
    const examBar = document.getElementById("agendaExamProgressBar");
    if (examName && examMeta && examPct && examBar && typeof nearestUpcomingExam === "function") {
      const exam = nearestUpcomingExam();
      if (!exam) {
        examName.textContent = "Sınav hedefi ekle";
        examMeta.textContent = "Ders ve çalışma hedefini belirle.";
        examPct.textContent = "—";
        examBar.style.width = "0%";
      } else {
        const studied = typeof calculateExamStudyMinutes === "function" ? calculateExamStudyMinutes(exam) : 0;
        const target = Math.max(0, Number(exam.targetMinutes) || 0);
        const percent = target ? Math.min(100, Math.round(studied / target * 100)) : 0;
        const days = typeof examDaysRemaining === "function" ? examDaysRemaining(exam) : 0;
        examName.textContent = exam.name;
        examMeta.textContent = `${exam.subject} · ${days > 0 ? `${days} gün kaldı` : days === 0 ? "Bugün" : "Geçmiş sınav"} · ${studied}/${target || "—"} dk`;
        examPct.textContent = target ? `%${percent}\nİlerleme` : "Hedef\nYok";
        examBar.style.width = `${percent}%`;
        document.getElementById("agendaExamSummary")?.style.setProperty("--exam-accent", exam.color || "#315f35");
      }
    }

    const planText = document.getElementById("agendaWeeklyPlanText");
    const planBar = document.getElementById("agendaWeeklyPlanBar");
    if (planText && planBar && typeof weeklyCompletedMinutes === "function") {
      const goal = state?.studyGoals?.weeklyMinutes;
      const target = Math.max(1, Number(goal?.target) || 300);
      const progress = weeklyCompletedMinutes(state.currentDate || getDateKey());
      const percent = Math.min(100, Math.round(progress / target * 100));
      planText.textContent = goal?.enabled === false ? `Bu hafta ${progress} dakika çalıştın · haftalık hedef kapalı` : `Haftalık plan · ${progress} / ${target} dakika`;
      planBar.style.width = `${goal?.enabled === false ? 0 : percent}%`;
    }
  }

  function ensureProgressStreakCard() {
    const shell = document.querySelector("#progressPage .history-page-shell");
    const metrics = document.querySelector("#progressPage .history-metrics-grid");
    if (!shell || !metrics || document.getElementById("v9ProgressStreak")) return;
    const card = document.createElement("section");
    card.className = "card v9-progress-streak";
    card.id = "v9ProgressStreak";
    card.innerHTML = `<div><h3>🔥 Seri (Streak)</h3><p id="v9ProgressStreakMeta">Küçük adımlar, yumuşak bir seri.</p></div><strong id="v9ProgressStreakValue">0 gün</strong>`;
    metrics.insertAdjacentElement("afterend", card);
  }

  function renderV9ProgressStreak() {
    ensureProgressStreakCard();
    const value = document.getElementById("v9ProgressStreakValue");
    const meta = document.getElementById("v9ProgressStreakMeta");
    if (!value || !meta) return;
    const current = Number(state?.streak?.current) || Number(document.getElementById("streakCurrent")?.textContent.match(/\d+/)?.[0]) || 0;
    const longest = Number(state?.streak?.longest) || Number(document.getElementById("streakLongest")?.textContent.match(/\d+/)?.[0]) || 0;
    value.textContent = `${current} gün`;
    meta.textContent = `En uzun seri: ${longest} gün · haftada bir dinlenme günü hakkın var.`;
  }

  function renderV9All() {
    renderV9Greeting();
    renderV9AgendaCalendar();
    renderV9AgendaCards();
    renderV9ProgressStreak();
  }

  const previousAgendaRender = typeof renderAgendaPage === "function" ? renderAgendaPage : null;
  if (previousAgendaRender) {
    renderAgendaPage = function renderAgendaPageV9() {
      previousAgendaRender();
      renderV9AgendaCalendar();
      renderV9AgendaCards();
    };
  }

  document.getElementById("agendaMonthGrid")?.addEventListener("click", event => {
    const button = event.target.closest("[data-date]");
    if (!button) return;
    agendaSelectedDate = button.dataset.date;
    renderAgendaPage();
  });

  document.getElementById("agendaPrevMonth")?.addEventListener("click", () => {
    const next = addMonths(safeDate(agendaSelectedDate), -1);
    agendaSelectedDate = dateKey(next);
    renderAgendaPage();
  });

  document.getElementById("agendaNextMonth")?.addEventListener("click", () => {
    const next = addMonths(safeDate(agendaSelectedDate), 1);
    agendaSelectedDate = dateKey(next);
    renderAgendaPage();
  });

  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => requestAnimationFrame(renderV9All));
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) renderV9All();
  });

  window.addEventListener("resize", renderV9All);
  renderV9All();
})();
