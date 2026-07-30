const APP_VERSION = "10.0";
const DATA_VERSION = 9;
const STORAGE_KEY = "berna-v7.1-state";
const LOCAL_BACKUP_KEY = "berna-v7.4-local-backups";
const BACKUP_FORMAT = "berna-backup";
const AUTO_BACKUP_INTERVAL_MS = 5 * 60 * 1000;
const MAX_LOCAL_BACKUPS = 10;
const PRIORITIES = new Set(["low", "normal", "high"]);
const RECURRENCES = new Set(["none", "daily", "weekdays", "weekly"]);
const ROOM_MODES = new Set(["day", "night"]);
const HISTORY_VIEWS = new Set(["daily", "weekly", "monthly", "yearly"]);
const WORK_MODES = new Set(["pomodoro", "free", "stopwatch"]);
const TIMER_PHASES = new Set(["focus", "shortBreak", "longBreak"]);
const BASE_ROOM_ITEMS = new Set(["wall-cream", "floor-oak", "window-classic"]);
const BASE_ROOM_SLOTS = new Set(["wall", "floor", "window"]);
const ROOM_DEFAULTS = Object.freeze({
  wall: "wall-cream",
  floor: "floor-oak",
  window: "window-classic",
  bed: "",
  rug: "",
  plant: "",
  shelf: "",
  lamp: "",
  toy: "",
  accessory: "",
  seasonal: ""
});
const SHOP_CATEGORIES = [
  { id: "all", label: "Tümü" },
  { id: "wall", label: "Duvar" },
  { id: "floor", label: "Zemin" },
  { id: "furniture", label: "Mobilya" },
  { id: "decor", label: "Dekorasyon" },
  { id: "plants", label: "Bitkiler" },
  { id: "toys", label: "Oyuncaklar" },
  { id: "accessories", label: "Miki Aksesuarları" },
  { id: "seasonal", label: "Sezonluk" }
];

const DEFAULT_TASK_TEMPLATES = [
  { title: "Psikoloji makalesi oku 🧠", category: "Psikoloji", minutes: 25 },
  { title: "Staj raporu yaz 📖", category: "Staj", minutes: 25 },
  { title: "Almanca kelime çalış ✏️", category: "Almanca", minutes: 25 },
  { title: "Spor yap 💪", category: "Spor", minutes: 25 }
];

const shopItems = [
  { id: "wall-cream", name: "Krem Duvar", category: "wall", slot: "wall", price: 0, included: true, visual: "wall-cream", description: "Sade başlangıç duvarı" },
  { id: "wall-pink", name: "Pembe Çizgiler", category: "wall", slot: "wall", price: 350, image: "./wallpaper.png", visual: "wall-pink", description: "Yumuşak pembe duvar kağıdı" },
  { id: "wall-sage", name: "Adaçayı Kareler", category: "wall", slot: "wall", price: 520, visual: "wall-sage", description: "Sakin yeşil cozy desen" },
  { id: "wall-stars", name: "Gece Yıldızları", category: "wall", slot: "wall", price: 800, visual: "wall-stars", description: "Gece görünümünde parlayan yıldızlar" },

  { id: "floor-oak", name: "Bal Meşe", category: "floor", slot: "floor", price: 0, included: true, image: "./floor.png", visual: "floor-oak", description: "Sıcak başlangıç zemini" },
  { id: "floor-walnut", name: "Ceviz Zemin", category: "floor", slot: "floor", price: 650, image: "./floor.png", visual: "floor-walnut", description: "Koyu ve sıcak ahşap" },
  { id: "floor-white", name: "Beyazlatılmış Meşe", category: "floor", slot: "floor", price: 820, image: "./floor.png", visual: "floor-white", description: "Aydınlık İskandinav görünümü" },

  { id: "window-classic", name: "Klasik Pencere", category: "wall", slot: "window", price: 0, included: true, image: "./window.png", visual: "window-classic", description: "Başlangıç penceresi" },
  { id: "window-pink", name: "Pembe Çerçeve", category: "wall", slot: "window", price: 560, image: "./window.png", visual: "window-pink", description: "Pastel pembe pencere" },
  { id: "window-midnight", name: "Gece Çerçevesi", category: "wall", slot: "window", price: 900, image: "./window.png", visual: "window-midnight", description: "Koyu lacivert çerçeve" },

  { id: "bed-rose", name: "Gül Yatak", category: "furniture", slot: "bed", price: 800, image: "./bed.png", visual: "bed-rose", description: "Miki için pembe yatak" },
  { id: "bed-sage", name: "Adaçayı Yatak", category: "furniture", slot: "bed", price: 1050, image: "./bed.png", visual: "bed-sage", description: "Sakin yeşil yatak" },
  { id: "bed-sky", name: "Gökyüzü Yatak", category: "furniture", slot: "bed", price: 1250, image: "./bed.png", visual: "bed-sky", description: "Soğuk mavi gece yatağı" },
  { id: "shelf-oak", name: "Meşe Raf", category: "furniture", slot: "shelf", price: 700, image: "./shelf.png", visual: "shelf-oak", description: "Kitaplar için klasik raf" },
  { id: "shelf-white", name: "Krem Raf", category: "furniture", slot: "shelf", price: 930, image: "./shelf.png", visual: "shelf-white", description: "Aydınlık ve sade raf" },
  { id: "lamp-rose", name: "Pembe Lamba", category: "furniture", slot: "lamp", price: 480, image: "./lamp.png", visual: "lamp-rose", description: "Yumuşak çalışma ışığı" },
  { id: "lamp-moon", name: "Ay Işığı Lambası", category: "furniture", slot: "lamp", price: 780, image: "./lamp.png", visual: "lamp-moon", description: "Gece modunda ekstra parıltı" },

  { id: "rug-rose", name: "Gül Halı", category: "decor", slot: "rug", price: 380, image: "./rug.png", visual: "rug-rose", description: "Pembe cozy halı" },
  { id: "rug-sky", name: "Mavi Halı", category: "decor", slot: "rug", price: 560, image: "./rug.png", visual: "rug-sky", description: "Serin gökyüzü tonları" },
  { id: "rug-sage", name: "Yeşil Halı", category: "decor", slot: "rug", price: 690, image: "./rug.png", visual: "rug-sage", description: "Doğal adaçayı tonu" },

  { id: "plant-monstera", name: "Monstera", category: "plants", slot: "plant", price: 320, image: "./plant.png", visual: "plant-monstera", description: "Odaya canlılık katar" },
  { id: "plant-flower", name: "Pembe Çiçek", category: "plants", slot: "plant", price: 540, image: "./plant.png", visual: "plant-flower", description: "Çiçekli pastel bitki" },

  { id: "toy-ball", name: "Pembe Top", category: "toys", slot: "toy", price: 420, image: "./toy.png", visual: "toy-ball", description: "Miki'nin ilk oyuncağı" },
  { id: "toy-mouse", name: "Oyuncak Fare", category: "toys", slot: "toy", price: 680, image: "./toy.png", visual: "toy-mouse", description: "Miki'nin favori avı" },

  { id: "accessory-bow", name: "Pembe Fiyonk", category: "accessories", slot: "accessory", price: 520, visual: "accessory-bow", description: "Miki için küçük fiyonk" },
  { id: "accessory-collar", name: "Altın Tasma", category: "accessories", slot: "accessory", price: 760, visual: "accessory-collar", description: "Minik yıldızlı tasma" },

  { id: "seasonal-garland", name: "Işık Zinciri", category: "seasonal", slot: "seasonal", price: 950, visual: "seasonal-garland", description: "Duvar boyunca sıcak ışıklar" },
  { id: "seasonal-snow", name: "Kış Karı", category: "seasonal", slot: "seasonal", price: 1200, visual: "seasonal-snow", description: "Pencerenin önünde yumuşak kar" }
];

const ROOM_ITEM_IDS = new Set(shopItems.map(item => item.id));
const ROOM_ITEM_BY_ID = new Map(shopItems.map(item => [item.id, item]));
const LEGACY_ROOM_ITEM_MAP = Object.freeze({
  wallpaper: "wall-pink",
  floor: "floor-oak",
  window: "window-classic",
  bed: "bed-rose",
  rug: "rug-rose",
  plant: "plant-monstera",
  shelf: "shelf-oak",
  lamp: "lamp-rose",
  toy: "toy-ball"
});

function deepClone(value) {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `berna-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) return null;
  const [year, month, day] = String(dateKey).split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey) || new Date();
  date.setDate(date.getDate() + amount);
  return getDateKey(date);
}

function clampMinutes(value) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return 25;
  return Math.min(180, Math.max(1, number));
}

function clampPomodoros(value) {
  const number = Math.round(Number(value));
  if (!Number.isFinite(number)) return 1;
  return Math.min(20, Math.max(1, number));
}

function clampNonNegative(value) {
  const number = Math.round(Number(value));
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function calculateReward(minutes) {
  const safeMinutes = clampMinutes(minutes);
  if (safeMinutes < 5) return { coins: 0, xp: 0, tier: "Mini odak" };

  let coins = Math.floor(safeMinutes / 5) * 2;
  let xp = Math.floor(safeMinutes / 10) * 5;
  let tier = "Kısa odak";

  if (safeMinutes >= 60) {
    coins += 8;
    xp += 15;
    tier = "Derin çalışma";
  } else if (safeMinutes >= 45) {
    coins += 5;
    xp += 10;
    tier = "Uzun odak";
  } else if (safeMinutes >= 25) {
    coins += 2;
    xp += 5;
    tier = "Standart Pomodoro";
  }

  return { coins: Math.min(35, coins), xp: Math.min(55, xp), tier };
}

function normalizeTask(task, fallbackDate = getDateKey()) {
  const source = task && typeof task === "object" ? task : {};
  const dueDate = parseDateKey(source.dueDate) ? source.dueDate : fallbackDate;
  const recurrence = RECURRENCES.has(source.recurrence) ? source.recurrence : "none";
  const priority = PRIORITIES.has(source.priority) ? source.priority : "normal";
  return {
    id: String(source.id || createId()),
    title: String(source.title || "Görev").trim().slice(0, 60) || "Görev",
    category: String(source.category || "Genel").trim().slice(0, 28) || "Genel",
    minutes: clampMinutes(source.minutes || 25),
    done: Boolean(source.done),
    priority,
    estimatedPomodoros: clampPomodoros(source.estimatedPomodoros || Math.max(1, Math.round((Number(source.minutes) || 25) / 25))),
    completedPomodoros: clampNonNegative(source.completedPomodoros),
    recurrence,
    recurrenceSeriesId: String(source.recurrenceSeriesId || ""),
    carryOver: source.carryOver !== false,
    dueDate,
    carriedFromTaskId: String(source.carriedFromTaskId || ""),
    createdAt: typeof source.createdAt === "string" ? source.createdAt : new Date().toISOString(),
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : new Date().toISOString()
  };
}

function cloneTasks(tasks, fallbackDate = getDateKey()) {
  return Array.isArray(tasks) ? tasks.map(task => normalizeTask(task, fallbackDate)) : [];
}

function createDefaultTasks(dateKey = getDateKey()) {
  return DEFAULT_TASK_TEMPLATES.map(task => normalizeTask({
    ...task,
    id: createId(),
    dueDate: dateKey,
    priority: "normal",
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    recurrence: "none",
    carryOver: true
  }, dateKey));
}

function normalizeRecurringTemplate(template) {
  const source = template && typeof template === "object" ? template : {};
  const startDate = parseDateKey(source.startDate) ? source.startDate : getDateKey();
  const recurrence = RECURRENCES.has(source.recurrence) && source.recurrence !== "none" ? source.recurrence : "daily";
  return {
    id: String(source.id || createId()),
    title: String(source.title || "Tekrarlayan görev").trim().slice(0, 60) || "Tekrarlayan görev",
    category: String(source.category || "Genel").trim().slice(0, 28) || "Genel",
    minutes: clampMinutes(source.minutes || 25),
    priority: PRIORITIES.has(source.priority) ? source.priority : "normal",
    estimatedPomodoros: clampPomodoros(source.estimatedPomodoros || 1),
    recurrence,
    carryOver: source.carryOver !== false,
    startDate,
    active: source.active !== false,
    createdAt: typeof source.createdAt === "string" ? source.createdAt : new Date().toISOString(),
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : new Date().toISOString()
  };
}

function createInitialState() {
  const today = getDateKey();
  const tasks = createDefaultTasks(today);
  return {
    dataVersion: DATA_VERSION,
    appVersion: APP_VERSION,
    coins: 125,
    xp: 0,
    level: 1,
    pomodoros: 0,
    focusMinutes: 25,
    activeSessionMinutes: 25,
    remainingSeconds: 25 * 60,
    workMode: "pomodoro",
    timerPhase: "focus",
    breaksEnabled: true,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    longBreakEvery: 4,
    autoStartBreaks: false,
    autoStartFocus: false,
    pomodoroCycleCount: 0,
    timerRunning: false,
    timerEndAt: null,
    runStartedAt: null,
    runStartedRemainingSeconds: 0,
    sessionStartedAt: null,
    sessionDate: null,
    sessionElapsedSeconds: 0,
    sessionCompletedTaskIdsAtStart: [],
    activeTaskId: "",
    activeTaskTitle: "",
    activeTaskCategory: "",
    selectedTaskId: "",
    soundEnabled: true,
    dayStarted: false,
    examName: "",
    examDate: "",
    exams: [],
    currentDate: today,
    tasks,
    taskCalendar: { [today]: cloneTasks(tasks, today) },
    recurringTasks: [],
    ownedItems: [...BASE_ROOM_ITEMS],
    equippedItems: deepClone(ROOM_DEFAULTS),
    roomMode: "day",
    shopCategory: "all",
    inventoryCategory: "all",
    dailyGoalMinutes: 50,
    studyGoals: normalizeStudyGoals(),
    goalRewardClaims: {},
    streakMinimumMinutes: 15,
    streakRestDays: [],
    lastStudyAt: null,
    lastInteractionAt: new Date().toISOString(),
    ambientSound: "off",
    ambientVolume: 35,
    unlockedAchievements: {},
    dailyMissionClaims: {},
    lastOpenPage: "todayPage",
    mikiPanel: "room",
    historyView: "weekly",
    history: {},
    lastSavedAt: new Date().toISOString(),
    migratedFromVersion: DATA_VERSION
  };
}

function normalizeStudyGoals(goals, legacyDailyMinutes = 50) {
  const source = goals && typeof goals === "object" ? goals : {};
  const normalizeGoal = (value, defaults, min, max) => {
    const item = value && typeof value === "object" ? value : {};
    return {
      enabled: item.enabled !== undefined ? Boolean(item.enabled) : defaults.enabled,
      target: Math.min(max, Math.max(min, Math.round(Number(item.target) || defaults.target)))
    };
  };
  const dailyMinutes = normalizeGoal(source.dailyMinutes, { enabled: true, target: Number(legacyDailyMinutes) || 50 }, 10, 600);
  const dailyPomodoros = normalizeGoal(source.dailyPomodoros, { enabled: true, target: 2 }, 1, 20);
  const weeklyMinutes = normalizeGoal(source.weeklyMinutes, { enabled: true, target: 300 }, 30, 5000);
  const subjectSource = source.subjectWeekly && typeof source.subjectWeekly === "object" ? source.subjectWeekly : {};
  const subjectWeekly = {
    enabled: Boolean(subjectSource.enabled),
    subject: String(subjectSource.subject || "").trim().slice(0, 28),
    target: Math.min(5000, Math.max(30, Math.round(Number(subjectSource.target) || 200)))
  };
  return { dailyMinutes, dailyPomodoros, weeklyMinutes, subjectWeekly };
}

function normalizeGoalRewardClaims(claims) {
  if (!claims || typeof claims !== "object" || Array.isArray(claims)) return {};
  const entries = Object.entries(claims)
    .filter(([key, value]) => typeof key === "string" && key.length < 180 && (typeof value === "string" || value === true))
    .slice(-500);
  return Object.fromEntries(entries);
}

function normalizeSession(session) {
  const source = session && typeof session === "object" ? session : {};
  const minutes = Math.max(0, Number(source.minutes) || 0);
  const completed = typeof source.completed === "boolean" ? source.completed : true;
  return {
    minutes,
    plannedMinutes: Math.max(minutes, Number(source.plannedMinutes) || minutes),
    workedSeconds: Math.max(0, Number(source.workedSeconds) || Math.round(minutes * 60)),
    completed,
    canceled: Boolean(source.canceled),
    startedAt: typeof source.startedAt === "string" ? source.startedAt : "",
    completedAt: typeof source.completedAt === "string" ? source.completedAt : "",
    rewardCoins: Math.max(0, Number(source.rewardCoins) || 0),
    rewardXp: Math.max(0, Number(source.rewardXp) || 0),
    firstSessionBonus: Boolean(source.firstSessionBonus),
    taskBonusCount: Math.max(0, Number(source.taskBonusCount) || 0),
    taskId: String(source.taskId || ""),
    taskTitle: String(source.taskTitle || "Serbest çalışma").slice(0, 60),
    taskCategory: String(source.taskCategory || "Genel").slice(0, 28),
    mode: WORK_MODES.has(source.mode) ? source.mode : "pomodoro",
    sessionType: source.sessionType === "break" ? "break" : "focus"
  };
}

function normalizeExam(exam) {
  const source = exam && typeof exam === "object" ? exam : {};
  const color = /^#[0-9a-f]{6}$/i.test(String(source.color || "")) ? String(source.color) : "#f36b7f";
  return {
    id: String(source.id || createId()),
    name: String(source.name || "Sınav").trim().slice(0, 50) || "Sınav",
    subject: String(source.subject || source.category || "Genel").trim().slice(0, 28) || "Genel",
    date: parseDateKey(source.date) ? source.date : "",
    color,
    targetMinutes: Math.min(50000, Math.max(0, Math.round(Number(source.targetMinutes) || 0))),
    createdAt: typeof source.createdAt === "string" ? source.createdAt : new Date().toISOString(),
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : new Date().toISOString()
  };
}

function ensureHistoryRecord(targetState, dateKey) {
  if (!targetState.history || typeof targetState.history !== "object" || Array.isArray(targetState.history)) {
    targetState.history = {};
  }
  if (!targetState.history[dateKey]) {
    targetState.history[dateKey] = { date: dateKey, totalMinutes: 0, pomodoros: 0, tasks: [], sessions: [] };
  }
  const record = targetState.history[dateKey];
  record.date = dateKey;
  record.totalMinutes = Math.max(0, Number(record.totalMinutes) || 0);
  record.pomodoros = Math.max(0, Number(record.pomodoros) || 0);
  record.tasks = cloneTasks(record.tasks, dateKey);
  record.sessions = Array.isArray(record.sessions) ? record.sessions.map(normalizeSession) : [];
  return record;
}

function syncTasksToHistory(targetState = state, dateKey = targetState.currentDate, tasks = targetState.tasks) {
  const record = ensureHistoryRecord(targetState, dateKey);
  record.tasks = cloneTasks(tasks || [], dateKey);
}

function recurrenceApplies(template, dateKey) {
  const date = parseDateKey(dateKey);
  const start = parseDateKey(template.startDate);
  if (!date || !start || date < start || template.active === false) return false;
  if (template.recurrence === "daily") return true;
  if (template.recurrence === "weekdays") {
    const day = date.getDay();
    return day >= 1 && day <= 5;
  }
  if (template.recurrence === "weekly") return date.getDay() === start.getDay();
  return false;
}

function ensureTaskCalendar(targetState) {
  if (!targetState.taskCalendar || typeof targetState.taskCalendar !== "object" || Array.isArray(targetState.taskCalendar)) {
    targetState.taskCalendar = {};
  }
  Object.keys(targetState.taskCalendar).forEach(dateKey => {
    if (!parseDateKey(dateKey)) {
      delete targetState.taskCalendar[dateKey];
      return;
    }
    targetState.taskCalendar[dateKey] = cloneTasks(targetState.taskCalendar[dateKey], dateKey);
  });
}

function ensureRecurringTasksForDate(targetState, dateKey) {
  ensureTaskCalendar(targetState);
  const existing = cloneTasks(targetState.taskCalendar[dateKey] || [], dateKey);
  const recurring = Array.isArray(targetState.recurringTasks) ? targetState.recurringTasks : [];

  recurring.forEach(template => {
    if (!recurrenceApplies(template, dateKey)) return;
    if (existing.some(task => task.recurrenceSeriesId === template.id)) return;
    existing.push(normalizeTask({
      id: createId(),
      title: template.title,
      category: template.category,
      minutes: template.minutes,
      priority: template.priority,
      estimatedPomodoros: template.estimatedPomodoros,
      completedPomodoros: 0,
      recurrence: template.recurrence,
      recurrenceSeriesId: template.id,
      carryOver: template.carryOver,
      dueDate: dateKey,
      done: false
    }, dateKey));
  });

  targetState.taskCalendar[dateKey] = existing;
  return existing;
}

function processDayRollover(targetState) {
  const today = getDateKey();
  const originalDate = parseDateKey(targetState.currentDate) ? targetState.currentDate : today;
  let cursor = originalDate;
  ensureTaskCalendar(targetState);
  targetState.taskCalendar[cursor] = cloneTasks(targetState.tasks || targetState.taskCalendar[cursor] || [], cursor);

  let safety = 0;
  while (cursor < today && safety < 730) {
    const dayTasks = ensureRecurringTasksForDate(targetState, cursor);
    syncTasksToHistory(targetState, cursor, dayTasks);
    const nextDate = addDays(cursor, 1);
    const nextTasks = ensureRecurringTasksForDate(targetState, nextDate);

    dayTasks.forEach(task => {
      if (task.done || !task.carryOver || task.recurrence !== "none") return;
      if (nextTasks.some(candidate => candidate.carriedFromTaskId === task.id)) return;
      nextTasks.push(normalizeTask({
        ...task,
        id: createId(),
        done: false,
        dueDate: nextDate,
        carriedFromTaskId: task.id,
        updatedAt: new Date().toISOString()
      }, nextDate));
    });

    targetState.taskCalendar[nextDate] = nextTasks;
    cursor = nextDate;
    safety += 1;
  }

  targetState.currentDate = today;
  targetState.tasks = ensureRecurringTasksForDate(targetState, today);
  targetState.taskCalendar[today] = cloneTasks(targetState.tasks, today);
  targetState.dayStarted = originalDate === today ? Boolean(targetState.dayStarted) : false;

  Object.keys(targetState.taskCalendar).forEach(dateKey => {
    if (dateKey < today) delete targetState.taskCalendar[dateKey];
  });
}

function migrateV1ToV2(raw) {
  const migrated = { ...raw };
  migrated.history = migrated.history && typeof migrated.history === "object" ? migrated.history : {};
  migrated.examName = typeof migrated.examName === "string" ? migrated.examName : "";
  migrated.examDate = parseDateKey(migrated.examDate) ? migrated.examDate : "";
  migrated.dataVersion = 2;
  return migrated;
}

function migrateV2ToV3(raw) {
  const migrated = { ...raw };
  migrated.activeSessionMinutes = migrated.activeSessionMinutes || migrated.focusMinutes || 25;
  migrated.timerEndAt = migrated.timerEndAt || null;
  migrated.runStartedAt = migrated.runStartedAt || null;
  migrated.runStartedRemainingSeconds = migrated.runStartedRemainingSeconds || 0;
  migrated.sessionElapsedSeconds = migrated.sessionElapsedSeconds || 0;
  migrated.sessionCompletedTaskIdsAtStart = Array.isArray(migrated.sessionCompletedTaskIdsAtStart) ? migrated.sessionCompletedTaskIdsAtStart : [];
  migrated.dataVersion = 3;
  return migrated;
}

function migrateV3ToV4(raw) {
  const migrated = { ...raw };
  const dateKey = parseDateKey(migrated.currentDate) ? migrated.currentDate : getDateKey();
  migrated.tasks = cloneTasks(migrated.tasks, dateKey);
  migrated.taskCalendar = migrated.taskCalendar && typeof migrated.taskCalendar === "object" ? migrated.taskCalendar : { [dateKey]: cloneTasks(migrated.tasks, dateKey) };
  migrated.recurringTasks = Array.isArray(migrated.recurringTasks) ? migrated.recurringTasks : [];
  migrated.selectedTaskId = String(migrated.selectedTaskId || "");
  migrated.activeTaskId = String(migrated.activeTaskId || "");
  migrated.activeTaskTitle = String(migrated.activeTaskTitle || "");
  migrated.activeTaskCategory = String(migrated.activeTaskCategory || "");
  migrated.dataVersion = 4;
  return migrated;
}

function migrateV4ToV5(raw) {
  const migrated = { ...raw };
  const legacyOwned = Array.isArray(migrated.ownedItems) ? migrated.ownedItems : [];
  const owned = new Set(BASE_ROOM_ITEMS);
  const equipped = { ...ROOM_DEFAULTS };

  legacyOwned.forEach(id => {
    const mapped = LEGACY_ROOM_ITEM_MAP[id] || id;
    if (!ROOM_ITEM_IDS.has(mapped)) return;
    owned.add(mapped);
    const item = ROOM_ITEM_BY_ID.get(mapped);
    if (item && item.slot) equipped[item.slot] = mapped;
  });

  if (migrated.equippedItems && typeof migrated.equippedItems === "object") {
    Object.entries(migrated.equippedItems).forEach(([slot, id]) => {
      const mapped = LEGACY_ROOM_ITEM_MAP[id] || id;
      const item = ROOM_ITEM_BY_ID.get(mapped);
      if (item && item.slot === slot) {
        owned.add(mapped);
        equipped[slot] = mapped;
      }
    });
  }

  migrated.ownedItems = [...owned];
  migrated.equippedItems = equipped;
  migrated.roomMode = ROOM_MODES.has(migrated.roomMode) ? migrated.roomMode : "day";
  migrated.shopCategory = SHOP_CATEGORIES.some(category => category.id === migrated.shopCategory) ? migrated.shopCategory : "all";
  migrated.inventoryCategory = SHOP_CATEGORIES.some(category => category.id === migrated.inventoryCategory) ? migrated.inventoryCategory : "all";
  migrated.dailyGoalMinutes = Math.min(600, Math.max(10, Math.round(Number(migrated.dailyGoalMinutes) || 50)));
  migrated.historyView = HISTORY_VIEWS.has(migrated.historyView) ? migrated.historyView : "weekly";
  migrated.dataVersion = 5;
  return migrated;
}

function migrateV5ToV6(raw) {
  const migrated = { ...raw };
  migrated.workMode = WORK_MODES.has(migrated.workMode) ? migrated.workMode : "pomodoro";
  migrated.timerPhase = TIMER_PHASES.has(migrated.timerPhase) ? migrated.timerPhase : "focus";
  migrated.breaksEnabled = migrated.breaksEnabled !== false;
  migrated.shortBreakMinutes = Math.min(60, Math.max(1, Math.round(Number(migrated.shortBreakMinutes) || 5)));
  migrated.longBreakMinutes = Math.min(90, Math.max(1, Math.round(Number(migrated.longBreakMinutes) || 15)));
  migrated.longBreakEvery = Math.min(10, Math.max(2, Math.round(Number(migrated.longBreakEvery) || 4)));
  migrated.autoStartBreaks = Boolean(migrated.autoStartBreaks);
  migrated.autoStartFocus = Boolean(migrated.autoStartFocus);
  migrated.pomodoroCycleCount = Math.max(0, Math.round(Number(migrated.pomodoroCycleCount) || 0));
  const legacyExams = Array.isArray(migrated.exams) ? migrated.exams : [];
  if (!legacyExams.length && parseDateKey(migrated.examDate)) {
    legacyExams.push({ id: createId(), name: migrated.examName || "Sınav", subject: "Genel", date: migrated.examDate, color: "#f36b7f", targetMinutes: 0 });
  }
  migrated.exams = legacyExams.map(normalizeExam).filter(exam => exam.date);
  migrated.dataVersion = 6;
  return migrated;
}

function migrateV6ToV7(raw) {
  const migrated = { ...raw };
  migrated.studyGoals = normalizeStudyGoals(migrated.studyGoals, migrated.dailyGoalMinutes || 50);
  migrated.dailyGoalMinutes = migrated.studyGoals.dailyMinutes.target;
  migrated.goalRewardClaims = normalizeGoalRewardClaims(migrated.goalRewardClaims);
  migrated.dataVersion = 7;
  return migrated;
}

function migrateV7ToV8(raw) {
  const migrated = { ...raw };
  migrated.streakMinimumMinutes = [10, 15].includes(Number(migrated.streakMinimumMinutes)) ? Number(migrated.streakMinimumMinutes) : 15;
  migrated.streakRestDays = Array.isArray(migrated.streakRestDays) ? migrated.streakRestDays : [];
  migrated.lastStudyAt = typeof migrated.lastStudyAt === "string" ? migrated.lastStudyAt : null;
  migrated.lastInteractionAt = typeof migrated.lastInteractionAt === "string" ? migrated.lastInteractionAt : (migrated.lastSavedAt || new Date().toISOString());
  migrated.ambientSound = typeof migrated.ambientSound === "string" ? migrated.ambientSound : "off";
  migrated.ambientVolume = Math.min(100, Math.max(0, Math.round(Number(migrated.ambientVolume) || 35)));
  migrated.dataVersion = 8;
  return migrated;
}

function migrateV8ToV9(raw) {
  const migrated = { ...raw };
  migrated.unlockedAchievements = migrated.unlockedAchievements && typeof migrated.unlockedAchievements === "object" && !Array.isArray(migrated.unlockedAchievements) ? migrated.unlockedAchievements : {};
  migrated.dailyMissionClaims = migrated.dailyMissionClaims && typeof migrated.dailyMissionClaims === "object" && !Array.isArray(migrated.dailyMissionClaims) ? migrated.dailyMissionClaims : {};
  migrated.lastOpenPage = ["todayPage", "focusPage", "agendaPage", "mikiPage", "progressPage"].includes(migrated.lastOpenPage) ? migrated.lastOpenPage : "todayPage";
  migrated.mikiPanel = ["room", "inventory", "store"].includes(migrated.mikiPanel) ? migrated.mikiPanel : "room";
  migrated.dataVersion = 9;
  return migrated;
}

function normalizeState(raw) {
  const base = createInitialState();
  const source = raw && typeof raw === "object" ? raw : {};
  const merged = { ...base, ...source };

  merged.dataVersion = DATA_VERSION;
  merged.appVersion = APP_VERSION;
  merged.coins = clampNonNegative(merged.coins);
  merged.xp = clampNonNegative(merged.xp);
  merged.level = Math.floor(merged.xp / 100) + 1;
  merged.pomodoros = clampNonNegative(merged.pomodoros);
  merged.focusMinutes = clampMinutes(merged.focusMinutes);
  merged.workMode = WORK_MODES.has(merged.workMode) ? merged.workMode : "pomodoro";
  merged.timerPhase = TIMER_PHASES.has(merged.timerPhase) ? merged.timerPhase : "focus";
  merged.breaksEnabled = merged.breaksEnabled !== false;
  merged.shortBreakMinutes = Math.min(60, Math.max(1, Math.round(Number(merged.shortBreakMinutes) || 5)));
  merged.longBreakMinutes = Math.min(90, Math.max(1, Math.round(Number(merged.longBreakMinutes) || 15)));
  merged.longBreakEvery = Math.min(10, Math.max(2, Math.round(Number(merged.longBreakEvery) || 4)));
  merged.autoStartBreaks = Boolean(merged.autoStartBreaks);
  merged.autoStartFocus = Boolean(merged.autoStartFocus);
  merged.pomodoroCycleCount = Math.max(0, Math.round(Number(merged.pomodoroCycleCount) || 0));
  merged.activeSessionMinutes = clampMinutes(merged.activeSessionMinutes || merged.focusMinutes);
  merged.remainingSeconds = Math.max(0, Math.round(Number(merged.remainingSeconds) || 0));
  merged.timerEndAt = Number.isFinite(Number(merged.timerEndAt)) ? Number(merged.timerEndAt) : null;
  merged.runStartedAt = Number.isFinite(Number(merged.runStartedAt)) ? Number(merged.runStartedAt) : null;
  merged.runStartedRemainingSeconds = Math.max(0, Math.round(Number(merged.runStartedRemainingSeconds) || 0));
  merged.sessionStartedAt = Number.isFinite(Number(merged.sessionStartedAt)) ? Number(merged.sessionStartedAt) : null;
  merged.sessionDate = parseDateKey(merged.sessionDate) ? merged.sessionDate : null;
  merged.sessionElapsedSeconds = Math.max(0, Math.round(Number(merged.sessionElapsedSeconds) || 0));
  merged.sessionCompletedTaskIdsAtStart = Array.isArray(merged.sessionCompletedTaskIdsAtStart) ? merged.sessionCompletedTaskIdsAtStart.map(String) : [];
  merged.activeTaskId = String(merged.activeTaskId || "");
  merged.activeTaskTitle = String(merged.activeTaskTitle || "").slice(0, 60);
  merged.activeTaskCategory = String(merged.activeTaskCategory || "").slice(0, 28);
  merged.selectedTaskId = String(merged.selectedTaskId || "");
  merged.timerRunning = Boolean(merged.timerRunning && merged.runStartedAt && (merged.workMode === "stopwatch" || merged.timerEndAt));
  merged.soundEnabled = merged.soundEnabled !== false;
  merged.dayStarted = Boolean(merged.dayStarted);
  merged.examName = typeof merged.examName === "string" ? merged.examName.slice(0, 40) : "";
  merged.examDate = parseDateKey(merged.examDate) ? merged.examDate : "";
  merged.exams = (Array.isArray(merged.exams) ? merged.exams : []).map(normalizeExam).filter(exam => exam.date);
  if (!merged.exams.length && merged.examDate) merged.exams.push(normalizeExam({ name: merged.examName || "Sınav", date: merged.examDate, subject: "Genel", targetMinutes: 0 }));
  merged.currentDate = parseDateKey(merged.currentDate) ? merged.currentDate : getDateKey();
  merged.tasks = cloneTasks(merged.tasks, merged.currentDate);
  const normalizedOwned = new Set(BASE_ROOM_ITEMS);
  (Array.isArray(merged.ownedItems) ? merged.ownedItems : []).forEach(id => {
    const mapped = LEGACY_ROOM_ITEM_MAP[id] || String(id || "");
    if (ROOM_ITEM_IDS.has(mapped)) normalizedOwned.add(mapped);
  });
  merged.ownedItems = [...normalizedOwned];
  const sourceEquipped = merged.equippedItems && typeof merged.equippedItems === "object" ? merged.equippedItems : {};
  merged.equippedItems = { ...ROOM_DEFAULTS };
  Object.keys(ROOM_DEFAULTS).forEach(slot => {
    const mapped = LEGACY_ROOM_ITEM_MAP[sourceEquipped[slot]] || String(sourceEquipped[slot] || "");
    const item = ROOM_ITEM_BY_ID.get(mapped);
    if (item && item.slot === slot && normalizedOwned.has(mapped)) merged.equippedItems[slot] = mapped;
  });
  BASE_ROOM_SLOTS.forEach(slot => {
    if (!merged.equippedItems[slot]) merged.equippedItems[slot] = ROOM_DEFAULTS[slot];
  });
  merged.roomMode = ROOM_MODES.has(merged.roomMode) ? merged.roomMode : "day";
  merged.shopCategory = SHOP_CATEGORIES.some(category => category.id === merged.shopCategory) ? merged.shopCategory : "all";
  merged.inventoryCategory = SHOP_CATEGORIES.some(category => category.id === merged.inventoryCategory) ? merged.inventoryCategory : "all";
  merged.studyGoals = normalizeStudyGoals(merged.studyGoals, merged.dailyGoalMinutes || 50);
  merged.dailyGoalMinutes = merged.studyGoals.dailyMinutes.target;
  merged.goalRewardClaims = normalizeGoalRewardClaims(merged.goalRewardClaims);
  merged.streakMinimumMinutes = [10, 15].includes(Number(merged.streakMinimumMinutes)) ? Number(merged.streakMinimumMinutes) : 15;
  merged.streakRestDays = [...new Set((Array.isArray(merged.streakRestDays) ? merged.streakRestDays : []).filter(dateKey => parseDateKey(dateKey)))].sort().slice(-730);
  merged.lastStudyAt = typeof merged.lastStudyAt === "string" && !Number.isNaN(Date.parse(merged.lastStudyAt)) ? merged.lastStudyAt : null;
  merged.lastInteractionAt = typeof merged.lastInteractionAt === "string" && !Number.isNaN(Date.parse(merged.lastInteractionAt)) ? merged.lastInteractionAt : (merged.lastSavedAt || new Date().toISOString());
  const ambientIds = new Set(["off", "rain", "fireplace", "cafe", "library", "insects", "window-rain", "white-noise"]);
  merged.ambientSound = ambientIds.has(merged.ambientSound) ? merged.ambientSound : "off";
  merged.ambientVolume = Math.min(100, Math.max(0, Math.round(Number(merged.ambientVolume) || 35)));
  merged.unlockedAchievements = merged.unlockedAchievements && typeof merged.unlockedAchievements === "object" && !Array.isArray(merged.unlockedAchievements) ? merged.unlockedAchievements : {};
  merged.dailyMissionClaims = merged.dailyMissionClaims && typeof merged.dailyMissionClaims === "object" && !Array.isArray(merged.dailyMissionClaims) ? merged.dailyMissionClaims : {};
  merged.lastOpenPage = ["todayPage", "focusPage", "agendaPage", "mikiPage", "progressPage"].includes(merged.lastOpenPage) ? merged.lastOpenPage : "todayPage";
  merged.mikiPanel = ["room", "inventory", "store"].includes(merged.mikiPanel) ? merged.mikiPanel : "room";
  merged.historyView = HISTORY_VIEWS.has(merged.historyView) ? merged.historyView : "weekly";
  merged.history = merged.history && typeof merged.history === "object" && !Array.isArray(merged.history) ? merged.history : {};
  Object.keys(merged.history).forEach(dateKey => ensureHistoryRecord(merged, dateKey));
  merged.recurringTasks = Array.isArray(merged.recurringTasks) ? merged.recurringTasks.map(normalizeRecurringTemplate) : [];
  ensureTaskCalendar(merged);
  processDayRollover(merged);

  if (!merged.tasks.some(task => task.id === merged.selectedTaskId && !task.done)) merged.selectedTaskId = "";
  if (!merged.timerRunning && merged.sessionElapsedSeconds === 0 && merged.remainingSeconds <= 0) merged.remainingSeconds = 0;
  syncTasksToHistory(merged, merged.currentDate, merged.tasks);
  return merged;
}

function migrateState(raw) {
  if (!raw || typeof raw !== "object") return createInitialState();
  let version = Number(raw.dataVersion) || 1;
  if (version > DATA_VERSION) throw new Error("Bu yedek daha yeni bir Berna sürümüne ait.");
  let migrated = deepClone(raw);
  const originalVersion = version;

  if (version < 2) { migrated = migrateV1ToV2(migrated); version = 2; }
  if (version < 3) { migrated = migrateV2ToV3(migrated); version = 3; }
  if (version < 4) { migrated = migrateV3ToV4(migrated); version = 4; }
  if (version < 5) { migrated = migrateV4ToV5(migrated); version = 5; }
  if (version < 6) { migrated = migrateV5ToV6(migrated); version = 6; }
  if (version < 7) { migrated = migrateV6ToV7(migrated); version = 7; }
  if (version < 8) { migrated = migrateV7ToV8(migrated); version = 8; }
  if (version < 9) { migrated = migrateV8ToV9(migrated); version = 9; }

  migrated.migratedFromVersion = originalVersion;
  return normalizeState(migrated);
}

function getStateFingerprint(targetState = state) {
  const copy = deepClone(targetState);
  delete copy.lastSavedAt;
  return JSON.stringify(copy);
}

function readLocalBackups() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LOCAL_BACKUP_KEY));
    return Array.isArray(parsed) ? parsed.filter(item => item && item.state && item.createdAt) : [];
  } catch {
    return [];
  }
}

function writeLocalBackups(backups) {
  localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(backups.slice(0, MAX_LOCAL_BACKUPS)));
}

function makeBackupPayload(reason = "manual") {
  return {
    format: BACKUP_FORMAT,
    appVersion: APP_VERSION,
    dataVersion: DATA_VERSION,
    createdAt: new Date().toISOString(),
    reason,
    state: deepClone(state)
  };
}

function createLocalBackup(reason = "manual", force = false) {
  try {
    const backups = readLocalBackups();
    const fingerprint = getStateFingerprint();
    const latestFingerprint = backups[0] && backups[0].state ? getStateFingerprint(backups[0].state) : "";
    if (!force && latestFingerprint === fingerprint) return false;

    backups.unshift(makeBackupPayload(reason));
    writeLocalBackups(backups);
    renderBackupList();
    return true;
  } catch {
    return false;
  }
}

function maybeCreateAutomaticBackup() {
  const backups = readLocalBackups();
  const latestTime = backups[0] ? new Date(backups[0].createdAt).getTime() : 0;
  if (!latestTime || Date.now() - latestTime >= AUTO_BACKUP_INTERVAL_MS) {
    createLocalBackup("automatic", false);
  }
}

function loadState() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (!savedText) return normalizeState(createInitialState());
    return migrateState(JSON.parse(savedText));
  } catch (error) {
    console.warn("Berna verileri okunamadı:", error);
    return normalizeState(createInitialState());
  }
}

let state = loadState();
let timerInterval = null;
let examCountdownInterval = null;
let autoBackupInterval = null;
let draggedTaskId = "";
let completionAudioContext = null;

function saveState({ autoBackup = true } = {}) {
  state.dataVersion = DATA_VERSION;
  state.appVersion = APP_VERSION;
  state.lastSavedAt = new Date().toISOString();
  state.taskCalendar[state.currentDate] = cloneTasks(state.tasks, state.currentDate);
  syncTasksToHistory(state, state.currentDate, state.tasks);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (autoBackup) maybeCreateAutomaticBackup();
  } catch (error) {
    console.warn("Berna verileri kaydedilemedi:", error);
    showToast("Veriler kaydedilemedi; dışa aktarma ile yedek al");
  }
}

function formatFullDate(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return "";
  const text = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatHistoryDate(dateKey) {
  const date = parseDateKey(dateKey);
  if (!date) return dateKey;
  const text = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function formatSessionTime(value) {
  if (!value) return "Saat kaydı yok";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saat kaydı yok";
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function formatBackupTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Tarih bilinmiyor";
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function renderDate() {
  const text = new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", weekday: "long" }).format(new Date());
  document.getElementById("todayDate").textContent = text.charAt(0).toUpperCase() + text.slice(1);
}

function renderExamCountdown() {
  const nameElement = document.getElementById("examNameDisplay");
  const dateElement = document.getElementById("examDateDisplay");
  const daysElement = document.getElementById("examDays");
  const unitElement = document.getElementById("examCountdownUnit");
  const card = document.getElementById("examCountdownCard");
  const examDate = parseDateKey(state.examDate);

  if (!examDate) {
    nameElement.textContent = "Sınav tarihini ayarla";
    dateElement.textContent = "Tarih eklediğinde geri sayım burada görünecek.";
    daysElement.textContent = "—";
    unitElement.textContent = "gün";
    card.classList.remove("exam-today", "exam-passed");
    return;
  }

  const today = parseDateKey(getDateKey());
  const diffDays = Math.round((examDate.getTime() - today.getTime()) / 86400000);
  nameElement.textContent = state.examName.trim() || "Sınav";
  dateElement.textContent = formatFullDate(state.examDate);
  card.classList.toggle("exam-today", diffDays === 0);
  card.classList.toggle("exam-passed", diffDays < 0);

  if (diffDays > 0) {
    daysElement.textContent = String(diffDays);
    unitElement.textContent = "gün kaldı";
  } else if (diffDays === 0) {
    daysElement.textContent = "Bugün";
    unitElement.textContent = "sınav günü";
  } else {
    daysElement.textContent = String(Math.abs(diffDays));
    unitElement.textContent = "gün geçti";
  }
}

function priorityLabel(priority) {
  return priority === "high" ? "Yüksek" : priority === "low" ? "Düşük" : "Normal";
}

function recurrenceLabel(recurrence) {
  return { daily: "Her gün", weekdays: "Hafta içi", weekly: "Haftalık", none: "" }[recurrence] || "";
}

function renderCategoryDatalist() {
  const categories = new Set(["Genel", "Psikoloji", "Staj", "Almanca", "Spor"]);
  state.tasks.forEach(task => categories.add(task.category));
  state.recurringTasks.forEach(task => categories.add(task.category));
  Object.values(state.history).forEach(record => {
    (record.tasks || []).forEach(task => categories.add(task.category));
    (record.sessions || []).forEach(session => categories.add(session.taskCategory));
  });
  document.getElementById("categorySuggestions").innerHTML = [...categories]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "tr"))
    .map(category => `<option value="${escapeHtml(category)}"></option>`)
    .join("");
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  if (!state.tasks.length) {
    list.innerHTML = '<div class="task-empty-state">Bugün için görev yok. “Ekle” ile ilk görevini oluştur.</div>';
  }

  state.tasks.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = `task-row task-priority-${task.priority}${task.done ? " completed" : ""}`;
    row.draggable = true;
    row.dataset.taskId = task.id;
    row.innerHTML = `
      <button class="task-drag" type="button" aria-label="Görevi sürükle" title="Sürükleyerek sırala">⋮⋮</button>
      <input class="task-check" type="checkbox" ${task.done ? "checked" : ""} aria-label="${escapeHtml(task.title)} tamamlandı" />
      <div class="task-main">
        <div class="task-title-line"><span class="task-title">${escapeHtml(task.title)}</span><span class="priority-dot" title="${priorityLabel(task.priority)} öncelik"></span></div>
        <div class="task-meta">
          <span>${escapeHtml(task.category)}</span>
          <span>🍅 ${task.completedPomodoros}/${task.estimatedPomodoros}</span>
          ${task.recurrence !== "none" ? `<span>↻ ${recurrenceLabel(task.recurrence)}</span>` : ""}
          ${task.carriedFromTaskId ? "<span>→ Dünden</span>" : ""}
        </div>
      </div>
      <span class="task-time">${task.minutes}dk</span>
      <div class="task-actions">
        <button type="button" data-task-action="up" title="Yukarı taşı" aria-label="Yukarı taşı" ${index === 0 ? "disabled" : ""}>↑</button>
        <button type="button" data-task-action="down" title="Aşağı taşı" aria-label="Aşağı taşı" ${index === state.tasks.length - 1 ? "disabled" : ""}>↓</button>
        <button type="button" data-task-action="edit" title="Düzenle" aria-label="Görevi düzenle">✎</button>
        <button type="button" data-task-action="move" title="Başka güne taşı" aria-label="Görevi başka güne taşı">▣</button>
        <button type="button" data-task-action="delete" title="Sil" aria-label="Görevi sil">×</button>
      </div>`;

    row.querySelector(".task-check").addEventListener("change", event => toggleTaskDone(task.id, event.target.checked));
    row.querySelectorAll("[data-task-action]").forEach(button => {
      button.addEventListener("click", () => handleTaskAction(button.dataset.taskAction, task.id));
    });
    row.addEventListener("dragstart", event => {
      draggedTaskId = task.id;
      row.classList.add("dragging");
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
      }
    });
    row.addEventListener("dragend", () => {
      draggedTaskId = "";
      row.classList.remove("dragging");
      document.querySelectorAll(".task-row.drag-over").forEach(item => item.classList.remove("drag-over"));
    });
    row.addEventListener("dragover", event => {
      event.preventDefault();
      if (draggedTaskId && draggedTaskId !== task.id) row.classList.add("drag-over");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", event => {
      event.preventDefault();
      row.classList.remove("drag-over");
      reorderTaskByDrop(draggedTaskId || event.dataTransfer?.getData("text/plain"), task.id);
    });
    list.appendChild(row);
  });

  const completed = state.tasks.filter(task => task.done).length;
  const total = state.tasks.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  document.getElementById("taskDone").textContent = completed;
  document.getElementById("taskTotal").textContent = total;
  document.getElementById("taskPercent").textContent = `${percent}%`;
  document.getElementById("taskProgress").style.width = `${percent}%`;
  renderTaskSelector();
  renderCategoryDatalist();
}

function renderTaskSelector() {
  const select = document.getElementById("focusTaskSelect");
  const preview = document.getElementById("focusTaskPreview");
  const inProgress = hasSessionInProgress();
  const available = state.tasks.filter(task => !task.done || task.id === state.activeTaskId);
  const currentValue = inProgress ? state.activeTaskId : state.selectedTaskId;

  select.innerHTML = '<option value="">Serbest çalışma</option>' + available.map(task =>
    `<option value="${escapeHtml(task.id)}">${escapeHtml(task.category)} · ${escapeHtml(task.title)}</option>`
  ).join("");
  select.value = available.some(task => task.id === currentValue) ? currentValue : "";
  select.disabled = inProgress;

  const task = available.find(item => item.id === select.value);
  if (inProgress && state.activeTaskTitle) {
    preview.textContent = `${state.activeTaskCategory || "Genel"} · ${state.activeTaskTitle} bu oturuma bağlandı.`;
  } else if (task) {
    preview.textContent = `${task.category} · ${task.completedPomodoros}/${task.estimatedPomodoros} Pomodoro · ${priorityLabel(task.priority)} öncelik`;
  } else {
    preview.textContent = "Görev seçersen çalışma geçmişin ders ve görev bazında ayrılır.";
  }
}

function getLiveRemainingSeconds(now = Date.now()) {
  if (!state.timerRunning || !state.timerEndAt) return Math.max(0, Math.round(state.remainingSeconds));
  return Math.max(0, Math.ceil((state.timerEndAt - now) / 1000));
}

function getCurrentRunElapsedSeconds(now = Date.now()) {
  if (!state.timerRunning || !state.runStartedAt) return 0;
  return Math.max(0, state.runStartedRemainingSeconds - getLiveRemainingSeconds(now));
}

function getTotalWorkedSeconds(now = Date.now()) {
  return Math.max(0, state.sessionElapsedSeconds + getCurrentRunElapsedSeconds(now));
}

function hasSessionInProgress() {
  const plannedSeconds = clampMinutes(state.activeSessionMinutes || state.focusMinutes) * 60;
  return Boolean(state.timerRunning || state.sessionElapsedSeconds > 0 || (state.remainingSeconds > 0 && state.remainingSeconds < plannedSeconds));
}

function setPixelReward(elementId, icon, text) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = `<img src="${icon}" alt=""> ${escapeHtml(text)}`;
}

function renderRewardPreview() {
  const minutes = hasSessionInProgress() ? state.activeSessionMinutes : state.focusMinutes;
  const reward = calculateReward(minutes);
  document.getElementById("rewardXp").textContent = `⭐ +${reward.xp} XP`;
  document.getElementById("rewardCoin").textContent = `+${reward.coins} 🪙`;
  document.getElementById("rewardTier").textContent = `${reward.tier} · İlk tamamlanan oturuma günlük bonus`;
}

function renderTimer() {
  const remaining = getLiveRemainingSeconds();
  const minutes = Math.floor(remaining / 60).toString().padStart(2, "0");
  const seconds = Math.floor(remaining % 60).toString().padStart(2, "0");
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;

  const inProgress = hasSessionInProgress();
  document.getElementById("timerButtonText").textContent = state.timerRunning ? "Duraklat" : (remaining === 0 ? "Yeniden" : (inProgress ? "Devam Et" : "Başlat"));
  document.getElementById("timerIcon").textContent = state.timerRunning ? "Ⅱ" : "▶";
  document.getElementById("cancelTimerButton").classList.toggle("hidden", !inProgress);
  document.getElementById("timerStatusText").textContent = state.timerRunning
    ? "Güvenli sayaç aktif · sekme kapansa da süre korunur"
    : (inProgress ? "Oturum duraklatıldı" : "Odaklanma");
  renderRewardPreview();
  renderTaskSelector();
}

function renderStats() {
  const xpInLevel = state.xp % 100;
  document.getElementById("topCoin").textContent = state.coins;
  document.getElementById("mikiXp").textContent = xpInLevel;
  document.getElementById("mikiLevel").textContent = state.level;
  document.getElementById("mikiProgress").style.width = `${xpInLevel}%`;
  document.getElementById("mikiStage").textContent = state.level >= 5 ? "Yetişkin" : state.level >= 3 ? "Genç" : "Yavru";
  document.getElementById("statLevel").textContent = state.level;
  document.getElementById("statXp").textContent = xpInLevel;
  document.getElementById("statCoin").textContent = state.coins;
  document.getElementById("statPomodoro").textContent = state.pomodoros;
}

function renderShop() {
  const grid = document.getElementById("shopGrid");
  grid.innerHTML = "";
  shopItems.forEach(item => {
    const included = Boolean(item.included || BASE_ROOM_ITEMS.has(item.id));
    const owned = included || state.ownedItems.includes(item.id);
    const button = document.createElement("button");
    button.className = `shop-item${owned ? " owned" : ""}${included ? " included" : ""}`;
    button.type = "button";
    button.disabled = included;
    const priceLabel = included ? "Başlangıç" : (owned ? "Odada" : item.price);
    const priceClass = included ? "included-label" : (owned ? "owned-label" : "coin-price");
    button.innerHTML = `<h3>${escapeHtml(item.name)}</h3><img src="${item.image}" alt="${escapeHtml(item.name)}" /><span class="level">${included ? "Başlangıç eşyası" : "Seviye 1"}</span><span class="price ${priceClass}">${priceLabel}</span>`;
    if (!included) button.addEventListener("click", () => buyItem(item));
    grid.appendChild(button);
  });
}

function renderRoom(justAddedId = null) {
  const canvas = document.getElementById("roomCanvas");
  if (!canvas) return;
  canvas.classList.toggle("has-wallpaper", state.ownedItems.includes("wallpaper"));
  document.querySelectorAll("[data-room-item]").forEach(element => {
    const itemId = element.dataset.roomItem;
    const isOwned = state.ownedItems.includes(itemId);
    element.classList.toggle("is-owned", isOwned);
    element.setAttribute("aria-hidden", String(!isOwned));
    if (isOwned && itemId === justAddedId) {
      element.classList.remove("just-added");
      requestAnimationFrame(() => element.classList.add("just-added"));
      setTimeout(() => element.classList.remove("just-added"), 720);
    }
  });
  if (justAddedId === "wallpaper") {
    canvas.classList.remove("wallpaper-just-added");
    requestAnimationFrame(() => canvas.classList.add("wallpaper-just-added"));
    setTimeout(() => canvas.classList.remove("wallpaper-just-added"), 720);
  }
}

function populateHistoryYears() {
  const select = document.getElementById("historyYear");
  const previous = select.value;
  const years = new Set([new Date().getFullYear()]);
  Object.keys(state.history).forEach(key => years.add(Number(key.slice(0, 4))));
  select.innerHTML = [...years].filter(Number.isInteger).sort((a, b) => b - a).map(year => `<option value="${year}">${year}</option>`).join("");
  select.value = [...years].map(String).includes(previous) ? previous : String(new Date().getFullYear());
}

function renderStudyBreakdown(entries) {
  const totals = new Map();
  entries.forEach(([, record]) => {
    (record.sessions || []).forEach(session => {
      const title = session.taskTitle || "Serbest çalışma";
      const category = session.taskCategory || "Genel";
      const key = `${category}\u0000${title}`;
      totals.set(key, (totals.get(key) || 0) + (Number(session.minutes) || 0));
    });
  });
  const rows = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const container = document.getElementById("studyBreakdown");
  if (!rows.length) {
    container.innerHTML = '<div class="breakdown-empty">Göreve bağlanan Pomodoro tamamlandığında burada ders ve görev toplamları görünecek.</div>';
    return;
  }
  const max = Math.max(...rows.map(([, minutes]) => minutes), 1);
  container.innerHTML = rows.map(([key, minutes]) => {
    const [category, title] = key.split("\u0000");
    return `<div class="breakdown-row"><div class="breakdown-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(category)}</span></div><div class="breakdown-bar"><span style="width:${Math.max(8, Math.round(minutes / max * 100))}%"></span></div><b>${minutes} dk</b></div>`;
  }).join("");
}

function historyTaskRow(task) {
  return `<li class="${task.done ? "done" : ""}"><span class="history-task-check">${task.done ? "✓" : "○"}</span><span>${escapeHtml(task.title)}<em>${escapeHtml(task.category || "Genel")} · ${priorityLabel(task.priority)}</em></span><small>${task.completedPomodoros || 0}/${task.estimatedPomodoros || 1} 🍅</small></li>`;
}

function historySessionRow(session) {
  const status = session.completed ? "Tamamlandı" : "Yarım bırakıldı";
  const rewardText = session.completed ? ` · +${session.rewardXp || 0} XP / +${session.rewardCoins || 0} coin` : " · ödül yok";
  const taskText = session.taskTitle || "Serbest çalışma";
  const categoryText = session.taskCategory || "Genel";
  return `<li class="${session.completed ? "" : "canceled-session"}"><span>${session.completed ? "🍅" : "◐"}</span><span><strong>${escapeHtml(taskText)}</strong><em>${escapeHtml(categoryText)} · ${escapeHtml(formatSessionTime(session.completedAt))} · ${status}${rewardText}</em></span><small>${session.minutes} dk</small></li>`;
}

function renderSpecificDay(dateKey = document.getElementById("historyDate").value) {
  const container = document.getElementById("specificDayDetail");
  const date = parseDateKey(dateKey);
  if (!date) {
    container.innerHTML = '<div class="specific-day-empty">Görüntülemek için bir tarih seç.</div>';
    return;
  }
  if (dateKey === state.currentDate) syncTasksToHistory(state, state.currentDate, state.tasks);
  const record = state.history[dateKey];
  if (!record) {
    container.innerHTML = `<div class="specific-day-empty"><strong>${escapeHtml(formatFullDate(dateKey))}</strong><span>Bu gün için henüz çalışma veya yapılacaklar kaydı yok.</span></div>`;
    return;
  }

  const tasks = Array.isArray(record.tasks) ? record.tasks : [];
  const sessions = Array.isArray(record.sessions) ? record.sessions : [];
  const done = tasks.filter(task => task.done).length;
  const taskRows = tasks.length ? tasks.map(historyTaskRow).join("") : '<li class="history-no-task">O gün yapılacak eklenmemiş.</li>';
  const sessionRows = sessions.length ? sessions.map(historySessionRow).join("") : ((Number(record.totalMinutes) || 0) > 0
    ? `<li class="history-no-task">${Number(record.totalMinutes) || 0} dakika çalışıldı; oturum ayrıntısı eski sürümde kaydedilmedi.</li>`
    : '<li class="history-no-task">O gün çalışma oturumu yok.</li>');

  container.innerHTML = `<div class="specific-day-title"><div><strong>${escapeHtml(formatFullDate(dateKey))}</strong><span>${Number(record.totalMinutes) || 0} dakika · ${Number(record.pomodoros) || 0} Pomodoro · ${done}/${tasks.length} görev</span></div></div><div class="specific-day-columns"><div class="specific-day-block"><h4>Çalışma Oturumları</h4><ul class="specific-session-list">${sessionRows}</ul></div><div class="specific-day-block"><h4>O Günün Yapılacakları</h4><ul>${taskRows}</ul></div></div>`;
}

function renderHistory() {
  syncTasksToHistory(state, state.currentDate, state.tasks);
  const historyDateInput = document.getElementById("historyDate");
  historyDateInput.max = getDateKey();
  if (!historyDateInput.value) historyDateInput.value = state.currentDate;
  renderSpecificDay(historyDateInput.value);

  const selectedYear = Number(document.getElementById("historyYear").value) || new Date().getFullYear();
  const entries = Object.entries(state.history).filter(([dateKey]) => Number(dateKey.slice(0, 4)) === selectedYear).sort(([a], [b]) => b.localeCompare(a));
  const totalMinutes = entries.reduce((sum, [, record]) => sum + (Number(record.totalMinutes) || 0), 0);
  const totalPomodoros = entries.reduce((sum, [, record]) => sum + (Number(record.pomodoros) || 0), 0);
  const activeDays = entries.filter(([, record]) => (Number(record.totalMinutes) || 0) > 0).length;
  document.getElementById("yearTotalMinutes").textContent = `${totalMinutes} dk`;
  document.getElementById("yearPomodoros").textContent = totalPomodoros;
  document.getElementById("yearActiveDays").textContent = activeDays;
  renderStudyBreakdown(entries);

  const container = document.getElementById("historyDays");
  if (!entries.length) {
    container.innerHTML = '<div class="history-empty">Bu yıl için henüz çalışma kaydı yok.</div>';
    return;
  }
  container.innerHTML = entries.map(([dateKey, record]) => {
    const tasks = Array.isArray(record.tasks) ? record.tasks : [];
    const done = tasks.filter(task => task.done).length;
    const taskRows = tasks.length ? tasks.map(historyTaskRow).join("") : '<li class="history-no-task">O gün yapılacak eklenmemiş.</li>';
    return `<details class="history-day-card" ${dateKey === state.currentDate ? "open" : ""}><summary><span class="history-day-date">${escapeHtml(formatHistoryDate(dateKey))}</span><span class="history-day-meta">${Number(record.totalMinutes) || 0} dk · ${done}/${tasks.length} görev</span></summary><div class="history-day-content"><div class="history-day-session">🍅 ${Number(record.pomodoros) || 0} Pomodoro · ${Number(record.totalMinutes) || 0} dakika çalışma</div><ul>${taskRows}</ul></div></details>`;
  }).join("");
}

function renderBackupList() {
  const container = document.getElementById("localBackupList");
  if (!container) return;
  const backups = readLocalBackups();
  document.getElementById("dataVersionBadge").textContent = `Veri v${DATA_VERSION}`;
  const status = document.getElementById("backupStatus");
  if (backups[0]) status.textContent = `Son yerel yedek: ${formatBackupTime(backups[0].createdAt)} · ${backups[0].reason === "automatic" ? "Otomatik" : backups[0].reason === "before-import" ? "İçe aktarma öncesi" : "Manuel"}`;
  if (!backups.length) {
    container.innerHTML = '<div class="backup-empty">Henüz yerel yedek yok.</div>';
    return;
  }
  container.innerHTML = backups.map((backup, index) => `<div class="local-backup-row"><div><strong>${formatBackupTime(backup.createdAt)}</strong><span>${backup.reason === "automatic" ? "Otomatik yedek" : backup.reason === "before-import" ? "İçe aktarma öncesi" : "Manuel yedek"} · Veri v${backup.dataVersion || 1}</span></div><button type="button" data-restore-backup="${index}">Geri Yükle</button></div>`).join("");
  container.querySelectorAll("[data-restore-backup]").forEach(button => button.addEventListener("click", () => restoreLocalBackup(Number(button.dataset.restoreBackup))));
}

function renderAll() {
  renderDate();
  renderExamCountdown();
  renderTasks();
  renderTimer();
  renderStats();
  renderShop();
  renderRoom();
  document.getElementById("focusMinutes").value = String(state.focusMinutes);
  document.getElementById("soundEnabled").checked = state.soundEnabled;
  document.getElementById("startDayButton").disabled = state.dayStarted;
  document.getElementById("startDayButton").style.opacity = state.dayStarted ? ".62" : "1";
}

function countCompletedTasks(tasks = state.tasks) {
  return Array.isArray(tasks) ? tasks.filter(task => task.done).length : 0;
}

function getCompletedTaskIds(tasks = state.tasks) {
  return Array.isArray(tasks) ? tasks.filter(task => task.done).map(task => task.id) : [];
}

function beginFreshSession(now = Date.now()) {
  const selectedTask = state.tasks.find(task => task.id === state.selectedTaskId && !task.done);
  state.activeSessionMinutes = state.focusMinutes;
  state.remainingSeconds = state.focusMinutes * 60;
  state.sessionElapsedSeconds = 0;
  state.sessionStartedAt = now;
  state.sessionDate = getDateKey(new Date(now));
  state.sessionCompletedTaskIdsAtStart = getCompletedTaskIds();
  state.activeTaskId = selectedTask ? selectedTask.id : "";
  state.activeTaskTitle = selectedTask ? selectedTask.title : "Serbest çalışma";
  state.activeTaskCategory = selectedTask ? selectedTask.category : "Genel";
}

function startOrResumeTimer() {
  const now = Date.now();
  if (state.remainingSeconds === 0 || !hasSessionInProgress()) beginFreshSession(now);
  else if (!state.sessionStartedAt) {
    state.sessionStartedAt = now;
    state.sessionDate = state.sessionDate || getDateKey(new Date(now));
    state.sessionCompletedTaskIdsAtStart = getCompletedTaskIds();
  }
  state.runStartedAt = now;
  state.runStartedRemainingSeconds = Math.max(1, Math.round(state.remainingSeconds));
  state.timerEndAt = now + state.runStartedRemainingSeconds * 1000;
  state.timerRunning = true;
  saveState();
  requestNotificationPermission();
  primeCompletionSound();
  syncTimerInterval();
  renderTimer();
}

function pauseTimer() {
  if (!state.timerRunning) return;
  const now = Date.now();
  state.remainingSeconds = getLiveRemainingSeconds(now);
  state.sessionElapsedSeconds = getTotalWorkedSeconds(now);
  state.timerRunning = false;
  state.timerEndAt = null;
  state.runStartedAt = null;
  state.runStartedRemainingSeconds = 0;
  saveState();
  syncTimerInterval();
  renderTimer();
}

function toggleTimer() {
  if (state.timerRunning) pauseTimer();
  else startOrResumeTimer();
}

function reconcileTimerState() {
  if (!state.timerRunning || !state.timerEndAt) {
    renderTimer();
    return;
  }
  if (Date.now() >= state.timerEndAt) {
    completePomodoro({ recovered: true });
    return;
  }
  renderTimer();
}

function syncTimerInterval() {
  clearInterval(timerInterval);
  timerInterval = null;
  if (!state.timerRunning) return;
  timerInterval = setInterval(() => {
    if (getLiveRemainingSeconds() <= 0) completePomodoro();
    else renderTimer();
  }, 250);
}

function resetSession({ showZero = false } = {}) {
  state.timerRunning = false;
  state.timerEndAt = null;
  state.runStartedAt = null;
  state.runStartedRemainingSeconds = 0;
  state.sessionStartedAt = null;
  state.sessionDate = null;
  state.sessionElapsedSeconds = 0;
  state.sessionCompletedTaskIdsAtStart = [];
  state.activeTaskId = "";
  state.activeTaskTitle = "";
  state.activeTaskCategory = "";
  state.activeSessionMinutes = state.focusMinutes;
  state.remainingSeconds = showZero ? 0 : state.focusMinutes * 60;
}

function completePomodoro({ recovered = false } = {}) {
  clearInterval(timerInterval);
  timerInterval = null;
  const completedAt = new Date();
  const completedMinutes = clampMinutes(state.activeSessionMinutes || state.focusMinutes);
  const targetDate = state.sessionDate || getDateKey(completedAt);
  const record = ensureHistoryRecord(state, targetDate);
  const firstSessionBonus = record.pomodoros === 0;
  const baseReward = calculateReward(completedMinutes);
  const baselineIds = new Set(state.sessionCompletedTaskIdsAtStart || []);
  const newlyCompletedTasks = targetDate === state.currentDate ? state.tasks.filter(task => task.done && !baselineIds.has(task.id)).length : 0;
  const taskBonusCount = Math.min(3, newlyCompletedTasks);
  const rewardCoins = baseReward.coins + (firstSessionBonus ? 3 : 0) + taskBonusCount * 2;
  const rewardXp = baseReward.xp + (firstSessionBonus ? 5 : 0) + taskBonusCount * 3;

  const linkedTask = state.tasks.find(task => task.id === state.activeTaskId);
  if (linkedTask && targetDate === state.currentDate) {
    linkedTask.completedPomodoros += 1;
    linkedTask.updatedAt = new Date().toISOString();
  }

  record.totalMinutes += completedMinutes;
  record.pomodoros += 1;
  if (targetDate === state.currentDate) record.tasks = cloneTasks(state.tasks, targetDate);
  record.sessions.push(normalizeSession({
    minutes: completedMinutes,
    plannedMinutes: completedMinutes,
    workedSeconds: completedMinutes * 60,
    completed: true,
    canceled: false,
    startedAt: state.sessionStartedAt ? new Date(state.sessionStartedAt).toISOString() : "",
    completedAt: completedAt.toISOString(),
    rewardCoins,
    rewardXp,
    firstSessionBonus,
    taskBonusCount,
    taskId: state.activeTaskId,
    taskTitle: state.activeTaskTitle || "Serbest çalışma",
    taskCategory: state.activeTaskCategory || "Genel"
  }));

  state.pomodoros += 1;
  state.coins += rewardCoins;
  state.xp += rewardXp;
  state.level = Math.floor(state.xp / 100) + 1;
  resetSession({ showZero: true });
  saveState();
  createLocalBackup("automatic", false);
  renderAll();

  const bonusParts = [];
  if (firstSessionBonus) bonusParts.push("günlük ilk oturum bonusu");
  if (taskBonusCount) bonusParts.push(`${taskBonusCount} görev bonusu`);
  const bonusText = bonusParts.length ? ` (${bonusParts.join(" + ")})` : "";
  showToast(`${completedMinutes} dk tamamlandı: +${rewardXp} XP, +${rewardCoins} coin${bonusText}`);
  showRoomStatus("Miki seninle gurur duyuyor ♥");
  showCompletionNotification(completedMinutes, rewardXp, rewardCoins, recovered);
  if (state.soundEnabled) playCompletionSound();
}

function cancelCurrentSession() {
  if (!hasSessionInProgress()) return;
  const workedSeconds = getTotalWorkedSeconds();
  const workedMinutes = Math.floor(workedSeconds / 60);
  const question = workedMinutes > 0
    ? `${workedMinutes} dakikalık çalışma geçmişe kaydedilecek, ancak XP ve coin verilmeyecek. Oturumu bitirmek istiyor musun?`
    : "Bir dakikadan az çalıştın. Bu oturum geçmişe eklenmeden bitirilecek. Devam edilsin mi?";
  if (!window.confirm(question)) return;

  const targetDate = state.sessionDate || state.currentDate;
  if (workedMinutes > 0) {
    const record = ensureHistoryRecord(state, targetDate);
    record.totalMinutes += workedMinutes;
    if (targetDate === state.currentDate) record.tasks = cloneTasks(state.tasks, targetDate);
    record.sessions.push(normalizeSession({
      minutes: workedMinutes,
      plannedMinutes: clampMinutes(state.activeSessionMinutes || state.focusMinutes),
      workedSeconds,
      completed: false,
      canceled: true,
      startedAt: state.sessionStartedAt ? new Date(state.sessionStartedAt).toISOString() : "",
      completedAt: new Date().toISOString(),
      rewardCoins: 0,
      rewardXp: 0,
      taskId: state.activeTaskId,
      taskTitle: state.activeTaskTitle || "Serbest çalışma",
      taskCategory: state.activeTaskCategory || "Genel"
    }));
  }
  clearInterval(timerInterval);
  timerInterval = null;
  resetSession();
  saveState();
  renderAll();
  showToast(workedMinutes > 0 ? `${workedMinutes} dakika geçmişe kaydedildi; ödül verilmedi` : "Oturum iptal edildi");
}

function primeCompletionSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!completionAudioContext) completionAudioContext = new AudioContext();
    if (completionAudioContext.state === "suspended") completionAudioContext.resume().catch(() => {});
  } catch {}
}

async function requestNotificationPermission() {
  try {
    if (!("Notification" in window) || Notification.permission !== "default") return;
    await Notification.requestPermission();
  } catch {}
}

async function showCompletionNotification(minutes, xp, coins, recovered) {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const options = { body: `${minutes} dakikalık odak tamamlandı. +${xp} XP, +${coins} coin kazandın.`, icon: "./icon-192.png", badge: "./icon-192.png", tag: "berna-pomodoro-complete", renotify: true, data: { url: "./" } };
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(recovered ? "Berna · Oturum tamamlandı" : "Pomodoro tamamlandı!", options);
    } else new Notification("Pomodoro tamamlandı!", options);
  } catch {}
}

function playCompletionSound() {
  try {
    primeCompletionSound();
    const ctx = completionAudioContext;
    if (!ctx) return;
    ctx.resume().catch(() => {});
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(740, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(980, ctx.currentTime + .25);
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.16, ctx.currentTime + .03);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .45);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + .48);
  } catch {}
}

function toggleTaskDone(taskId, done) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return;
  task.done = Boolean(done);
  task.updatedAt = new Date().toISOString();
  if (task.done && state.selectedTaskId === task.id) state.selectedTaskId = "";
  saveState();
  renderTasks();
}

function reorderTaskByDrop(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return;
  const sourceIndex = state.tasks.findIndex(task => task.id === sourceId);
  const targetIndex = state.tasks.findIndex(task => task.id === targetId);
  if (sourceIndex < 0 || targetIndex < 0) return;
  const [task] = state.tasks.splice(sourceIndex, 1);
  state.tasks.splice(targetIndex, 0, task);
  saveState();
  renderTasks();
}

function moveTaskOrder(taskId, direction) {
  const index = state.tasks.findIndex(task => task.id === taskId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= state.tasks.length) return;
  [state.tasks[index], state.tasks[target]] = [state.tasks[target], state.tasks[index]];
  saveState();
  renderTasks();
}

function isActiveSessionTask(taskId) {
  return hasSessionInProgress() && state.activeTaskId === taskId;
}

function handleTaskAction(action, taskId) {
  if (action === "up") return moveTaskOrder(taskId, -1);
  if (action === "down") return moveTaskOrder(taskId, 1);
  if (isActiveSessionTask(taskId) && ["edit", "move", "delete"].includes(action)) {
    showToast("Aktif oturuma bağlı görevi oturum bitmeden değiştiremezsin");
    return;
  }
  if (action === "edit") openTaskEditor(taskId);
  if (action === "move") openMoveTask(taskId);
  if (action === "delete") deleteTask(taskId);
}

function openTaskEditor(taskId = "") {
  const task = state.tasks.find(item => item.id === taskId);
  document.getElementById("editingTaskId").value = task ? task.id : "";
  document.getElementById("taskModalTitle").textContent = task ? "Görevi Düzenle" : "Yeni görev ekle";
  document.getElementById("newTaskTitle").value = task ? task.title : "";
  document.getElementById("newTaskCategory").value = task ? task.category : "";
  document.getElementById("newTaskDate").min = getDateKey();
  document.getElementById("newTaskDate").value = task ? task.dueDate : state.currentDate;
  document.getElementById("newTaskMinutes").value = String(task ? task.minutes : 25);
  document.getElementById("newTaskPomodoros").value = String(task ? task.estimatedPomodoros : 1);
  document.getElementById("newTaskPriority").value = task ? task.priority : "normal";
  document.getElementById("newTaskRecurrence").value = task ? task.recurrence : "none";
  document.getElementById("newTaskCarryOver").checked = task ? task.carryOver : true;
  renderCategoryDatalist();
  openModal("taskModal");
  setTimeout(() => document.getElementById("newTaskTitle").focus(), 50);
}

function removeFutureSeriesOccurrences(seriesId, fromDate) {
  if (!seriesId) return;
  Object.keys(state.taskCalendar).forEach(dateKey => {
    if (dateKey < fromDate) return;
    state.taskCalendar[dateKey] = state.taskCalendar[dateKey].filter(task => task.recurrenceSeriesId !== seriesId);
  });
  state.tasks = state.tasks.filter(task => task.recurrenceSeriesId !== seriesId || task.dueDate < fromDate);
}

function upsertRecurringTemplate(task, existingSeriesId = "") {
  if (task.recurrence === "none") {
    if (existingSeriesId) {
      state.recurringTasks = state.recurringTasks.filter(template => template.id !== existingSeriesId);
      removeFutureSeriesOccurrences(existingSeriesId, task.dueDate);
    }
    task.recurrenceSeriesId = "";
    return;
  }

  const seriesId = existingSeriesId || task.recurrenceSeriesId || createId();
  const template = normalizeRecurringTemplate({
    id: seriesId,
    title: task.title,
    category: task.category,
    minutes: task.minutes,
    priority: task.priority,
    estimatedPomodoros: task.estimatedPomodoros,
    recurrence: task.recurrence,
    carryOver: task.carryOver,
    startDate: task.dueDate,
    active: true
  });
  state.recurringTasks = state.recurringTasks.filter(item => item.id !== seriesId);
  state.recurringTasks.push(template);
  removeFutureSeriesOccurrences(seriesId, task.dueDate);
  task.recurrenceSeriesId = seriesId;
}

function saveTask() {
  const editingId = document.getElementById("editingTaskId").value;
  const titleInput = document.getElementById("newTaskTitle");
  const title = titleInput.value.trim();
  const category = document.getElementById("newTaskCategory").value.trim() || "Genel";
  const dueDate = document.getElementById("newTaskDate").value;
  if (!title) {
    titleInput.focus();
    showToast("Görev adını yazmalısın");
    return;
  }
  if (!parseDateKey(dueDate) || dueDate < getDateKey()) {
    document.getElementById("newTaskDate").focus();
    showToast("Bugün veya gelecekte bir tarih seçmelisin");
    return;
  }

  const existing = state.tasks.find(task => task.id === editingId);
  const oldSeriesId = existing ? existing.recurrenceSeriesId : "";
  const task = normalizeTask({
    ...(existing || {}),
    id: existing ? existing.id : createId(),
    title,
    category,
    dueDate,
    minutes: document.getElementById("newTaskMinutes").value,
    estimatedPomodoros: document.getElementById("newTaskPomodoros").value,
    priority: document.getElementById("newTaskPriority").value,
    recurrence: document.getElementById("newTaskRecurrence").value,
    carryOver: document.getElementById("newTaskCarryOver").checked,
    updatedAt: new Date().toISOString()
  }, dueDate);
  upsertRecurringTemplate(task, oldSeriesId);

  if (existing) state.tasks = state.tasks.filter(item => item.id !== existing.id);
  if (dueDate === state.currentDate) state.tasks.push(task);
  else {
    state.taskCalendar[dueDate] = cloneTasks(state.taskCalendar[dueDate] || [], dueDate);
    state.taskCalendar[dueDate].push(task);
  }

  if (state.selectedTaskId === editingId && dueDate !== state.currentDate) state.selectedTaskId = "";
  saveState();
  renderTasks();
  closeModal("taskModal");
  showToast(existing ? "Görev güncellendi" : (dueDate === state.currentDate ? "Görev eklendi" : `${formatFullDate(dueDate)} için görev planlandı`));
}

function deleteTask(taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return;
  const recurringText = task.recurrenceSeriesId ? " Bu işlem gelecek tekrarları da kaldırır." : "";
  if (!window.confirm(`“${task.title}” silinsin mi?${recurringText}`)) return;
  state.tasks = state.tasks.filter(item => item.id !== taskId);
  if (task.recurrenceSeriesId) {
    state.recurringTasks = state.recurringTasks.filter(template => template.id !== task.recurrenceSeriesId);
    removeFutureSeriesOccurrences(task.recurrenceSeriesId, state.currentDate);
  }
  if (state.selectedTaskId === taskId) state.selectedTaskId = "";
  saveState();
  renderTasks();
  showToast("Görev silindi");
}

function openMoveTask(taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return;
  document.getElementById("movingTaskId").value = task.id;
  document.getElementById("movingTaskName").textContent = task.title;
  document.getElementById("moveTaskDate").min = addDays(state.currentDate, 1);
  document.getElementById("moveTaskDate").value = addDays(state.currentDate, 1);
  openModal("moveTaskModal");
}

function confirmMoveTask() {
  const taskId = document.getElementById("movingTaskId").value;
  const targetDate = document.getElementById("moveTaskDate").value;
  const task = state.tasks.find(item => item.id === taskId);
  if (!task || !parseDateKey(targetDate) || targetDate <= state.currentDate) {
    showToast("Gelecekte bir tarih seçmelisin");
    return;
  }
  state.tasks = state.tasks.filter(item => item.id !== taskId);
  const moved = normalizeTask({ ...task, dueDate: targetDate, done: false, updatedAt: new Date().toISOString() }, targetDate);
  state.taskCalendar[targetDate] = cloneTasks(state.taskCalendar[targetDate] || [], targetDate);
  state.taskCalendar[targetDate].push(moved);
  if (state.selectedTaskId === taskId) state.selectedTaskId = "";
  saveState();
  renderTasks();
  closeModal("moveTaskModal");
  showToast(`Görev ${formatFullDate(targetDate)} tarihine taşındı`);
}

function buyItem(item) {
  if (item.included || BASE_ROOM_ITEMS.has(item.id)) {
    showToast(`${item.name} odanın başlangıç eşyası`);
    return;
  }
  if (state.ownedItems.includes(item.id)) {
    showToast(`${item.name} zaten sende`);
    return;
  }
  if (state.coins < item.price) {
    showToast(`${item.name} için ${item.price - state.coins} coin daha gerekli`);
    return;
  }
  state.coins -= item.price;
  state.ownedItems.push(item.id);
  saveState();
  renderStats();
  renderShop();
  renderRoom(item.id);
  showToast(`${item.name} satın alındı ve odaya yerleştirildi`);
  showRoomStatus(`${item.name} odaya eklendi ✨`);
}

function startDay() {
  if (state.dayStarted) {
    showToast("Bugün Miki ile güne zaten başladın");
    return;
  }
  state.dayStarted = true;
  state.coins += 5;
  saveState();
  renderAll();
  showToast("Miki uyandı! Günlük +5 coin");
  showRoomStatus("Miki güne hazır ♥");
}

function saveSettings() {
  const input = document.getElementById("focusMinutes");
  const rawMinutes = Number(input.value);
  if (!Number.isFinite(rawMinutes) || rawMinutes < 1 || rawMinutes > 180) {
    input.focus();
    showToast("Süre 1 ile 180 dakika arasında olmalı");
    return;
  }
  if (hasSessionInProgress()) {
    showToast("Süreyi değiştirmeden önce mevcut oturumu bitir veya tamamla");
    return;
  }
  const minutes = clampMinutes(rawMinutes);
  state.focusMinutes = minutes;
  state.activeSessionMinutes = minutes;
  state.remainingSeconds = minutes * 60;
  state.soundEnabled = document.getElementById("soundEnabled").checked;
  saveState();
  renderTimer();
  closeModal("settingsModal");
  showToast(`Pomodoro süresi ${minutes} dakika olarak ayarlandı`);
}

function openExamSettings() {
  document.getElementById("examNameInput").value = state.examName || "";
  document.getElementById("examDateInput").value = state.examDate || "";
  openModal("examModal");
}

function saveExamCountdown() {
  const nameInput = document.getElementById("examNameInput");
  const dateInput = document.getElementById("examDateInput");
  if (!parseDateKey(dateInput.value)) {
    dateInput.focus();
    showToast("Geçerli bir sınav tarihi seçmelisin");
    return;
  }
  state.examName = nameInput.value.trim().slice(0, 40) || "Sınav";
  state.examDate = dateInput.value;
  saveState();
  renderExamCountdown();
  closeModal("examModal");
  showToast("Sınav geri sayımı kaydedildi");
}

function clearExamCountdown() {
  state.examName = "";
  state.examDate = "";
  saveState();
  renderExamCountdown();
  closeModal("examModal");
  showToast("Sınav geri sayımı kaldırıldı");
}

function exportData() {
  saveState({ autoBackup: false });
  const payload = makeBackupPayload("export");
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const now = new Date();
  const stamp = `${getDateKey(now)}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
  link.href = url;
  link.download = `berna-yedek-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Berna yedek dosyası indirildi");
}

function extractBackupState(parsed) {
  if (parsed && parsed.format === BACKUP_FORMAT && parsed.state) return parsed.state;
  if (parsed && typeof parsed === "object" && (parsed.tasks || parsed.history || parsed.coins !== undefined)) return parsed;
  throw new Error("Bu dosya geçerli bir Berna yedeği değil.");
}

async function importDataFile(file) {
  if (!file) return;
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const importedState = migrateState(extractBackupState(parsed));
    if (!window.confirm("Yedek geri yüklendiğinde mevcut Berna verilerinin yerine geçecek. Devam edilsin mi?")) return;
    createLocalBackup("before-import", true);
    state = importedState;
    saveState({ autoBackup: false });
    createLocalBackup("manual", true);
    reconcileTimerState();
    renderAll();
    renderBackupList();
    closeModal("backupModal");
    showToast("Yedek başarıyla geri yüklendi");
  } catch (error) {
    showToast(error.message || "Yedek dosyası okunamadı");
  } finally {
    document.getElementById("importDataInput").value = "";
  }
}

function restoreLocalBackup(index) {
  const backups = readLocalBackups();
  const backup = backups[index];
  if (!backup) return;
  if (!window.confirm(`${formatBackupTime(backup.createdAt)} tarihli yerel yedek geri yüklensin mi?`)) return;
  try {
    const currentSnapshot = makeBackupPayload("before-import");
    state = migrateState(backup.state);
    saveState({ autoBackup: false });
    backups.unshift(currentSnapshot);
    writeLocalBackups(backups);
    reconcileTimerState();
    renderAll();
    renderBackupList();
    closeModal("backupModal");
    showToast("Yerel yedek geri yüklendi");
  } catch (error) {
    showToast(error.message || "Yerel yedek geri yüklenemedi");
  }
}

function openHistory() {
  saveState();
  showAppPage("progressPage");
  populateHistoryYears();
  populateHistoryCategories();
  const input = document.getElementById("historyDate");
  input.max = getDateKey();
  if (!input.value) input.value = state.currentDate;
  renderHistory();
}

function openBackup() {
  closeModal("settingsModal");
  renderBackupList();
  openModal("backupModal");
}

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("hidden");
  if (![...document.querySelectorAll(".modal-backdrop")].some(item => !item.classList.contains("hidden"))) document.body.classList.remove("modal-open");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function showRoomStatus(message) {
  const status = document.getElementById("roomStatus");
  status.textContent = message;
  status.classList.add("show");
  clearTimeout(showRoomStatus.timeout);
  showRoomStatus.timeout = setTimeout(() => status.classList.remove("show"), 2600);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => showAppPage(button.dataset.page || "todayPage"));
  });
}

function startExamCountdownUpdates() {
  clearInterval(examCountdownInterval);
  examCountdownInterval = setInterval(renderExamCountdown, 60000);
}

function startAutoBackupScheduler() {
  clearInterval(autoBackupInterval);
  maybeCreateAutomaticBackup();
  autoBackupInterval = setInterval(maybeCreateAutomaticBackup, AUTO_BACKUP_INTERVAL_MS);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

renderAll();
reconcileTimerState();
saveState({ autoBackup: false });
syncTimerInterval();
setupNavigation();
startExamCountdownUpdates();
startAutoBackupScheduler();
registerServiceWorker();

document.getElementById("timerButton").addEventListener("click", toggleTimer);
document.getElementById("cancelTimerButton").addEventListener("click", cancelCurrentSession);
document.getElementById("focusTaskSelect").addEventListener("change", event => {
  if (hasSessionInProgress()) return;
  state.selectedTaskId = event.target.value;
  saveState();
  renderTaskSelector();
});
document.getElementById("settingsButton").addEventListener("click", () => openModal("settingsModal"));
document.getElementById("openBackupButton").addEventListener("click", openBackup);
document.getElementById("exportDataButton").addEventListener("click", exportData);
document.getElementById("createBackupButton").addEventListener("click", () => {
  const created = createLocalBackup("manual", true);
  showToast(created ? "Yerel yedek oluşturuldu" : "Yerel yedek oluşturulamadı");
});
document.getElementById("importDataInput").addEventListener("change", event => importDataFile(event.target.files?.[0]));
document.getElementById("examSettingsButton").addEventListener("click", openExamSettings);
document.getElementById("saveExamButton").addEventListener("click", saveExamCountdown);
document.getElementById("clearExamButton").addEventListener("click", clearExamCountdown);
document.getElementById("historyButton").addEventListener("click", openHistory);
document.getElementById("historyYear").addEventListener("change", renderHistory);
document.getElementById("historyDate").addEventListener("change", event => renderSpecificDay(event.target.value));
document.getElementById("addTaskButton").addEventListener("click", () => openTaskEditor());
document.getElementById("saveTaskButton").addEventListener("click", saveTask);
document.getElementById("confirmMoveTaskButton").addEventListener("click", confirmMoveTask);
document.getElementById("saveSettingsButton").addEventListener("click", saveSettings);
document.getElementById("startDayButton").addEventListener("click", startDay);
document.getElementById("goStoreButton").addEventListener("click", () => { showAppPage("mikiPage"); showMikiPanel("store"); });
document.getElementById("coinPill").addEventListener("click", () => {
  showAppPage("mikiPage");
  showMikiPanel("store");
  showToast("Coinlerini Miki mağazasında kullanabilirsin");
});
document.getElementById("brandButton").addEventListener("click", () => showAppPage("todayPage"));

document.querySelectorAll("[data-minutes]").forEach(button => button.addEventListener("click", () => {
  document.getElementById("focusMinutes").value = button.dataset.minutes;
}));
document.querySelectorAll("[data-close]").forEach(button => button.addEventListener("click", () => closeModal(button.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(backdrop => backdrop.addEventListener("click", event => {
  if (event.target === backdrop) closeModal(backdrop.id);
}));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    const openModalElement = [...document.querySelectorAll(".modal-backdrop")].find(modal => !modal.classList.contains("hidden"));
    if (openModalElement) closeModal(openModalElement.id);
  }
  if (event.key === "Enter" && !document.getElementById("taskModal").classList.contains("hidden") && event.target.id === "newTaskTitle") saveTask();
  if (event.key === "Enter" && !document.getElementById("examModal").classList.contains("hidden") && event.target.id === "examNameInput") saveExamCountdown();
});

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) reconcileTimerState();
  else {
    saveState({ autoBackup: false });
    maybeCreateAutomaticBackup();
  }
});
window.addEventListener("focus", reconcileTimerState);
window.addEventListener("pageshow", reconcileTimerState);
window.addEventListener("beforeunload", () => {
  if (state.timerRunning) state.remainingSeconds = getLiveRemainingSeconds();
  saveState({ autoBackup: false });
});

/* v7.5 room inventory, personalization and meaningful progress dashboard */
function isRoomItemOwned(itemId) {
  return BASE_ROOM_ITEMS.has(itemId) || state.ownedItems.includes(itemId);
}

function getEquippedRoomItem(slot) {
  const itemId = state.equippedItems?.[slot] || "";
  const item = ROOM_ITEM_BY_ID.get(itemId);
  return item && item.slot === slot ? item : null;
}

function catalogVisualMarkup(item, context = "shop") {
  const classes = `catalog-visual ${context}-catalog-visual visual-${item.visual || item.id}`;
  if (item.image) {
    return `<div class="${classes}"><img src="${item.image}" alt="${escapeHtml(item.name)}" /></div>`;
  }
  const symbol = item.slot === "accessory" ? "♥" : item.slot === "seasonal" ? "✦" : item.slot === "wall" ? "▦" : "◆";
  return `<div class="${classes}" role="img" aria-label="${escapeHtml(item.name)}"><span>${symbol}</span></div>`;
}

function renderStoreCategoryTabs() {
  const container = document.getElementById("storeCategoryTabs");
  if (!container) return;
  container.innerHTML = SHOP_CATEGORIES.map(category => `<button type="button" class="${state.shopCategory === category.id ? "active" : ""}" data-store-category="${category.id}">${escapeHtml(category.label)}</button>`).join("");
  container.querySelectorAll("[data-store-category]").forEach(button => button.addEventListener("click", () => {
    state.shopCategory = button.dataset.storeCategory;
    saveState();
    renderShop();
  }));
}

function renderShop() {
  renderStoreCategoryTabs();
  const grid = document.getElementById("shopGrid");
  if (!grid) return;
  const items = shopItems.filter(item => state.shopCategory === "all" || item.category === state.shopCategory);
  grid.innerHTML = items.map(item => {
    const owned = isRoomItemOwned(item.id);
    const equipped = state.equippedItems?.[item.slot] === item.id;
    let action = "buy";
    let actionText = `${item.price}`;
    if (item.included) { action = "included"; actionText = equipped ? "Başlangıç · Kullanımda" : "Başlangıç"; }
    else if (equipped && BASE_ROOM_SLOTS.has(item.slot)) { action = "equipped"; actionText = "Kullanımda"; }
    else if (equipped) { action = "remove"; actionText = "Odadan Kaldır"; }
    else if (owned) { action = "equip"; actionText = "Odaya Yerleştir"; }
    return `<article class="shop-item${owned ? " owned" : ""}${equipped ? " equipped" : ""}">
      <div class="shop-item-status">${equipped ? "Odada" : owned ? "Envanterde" : item.included ? "Başlangıç" : "Mağaza"}</div>
      <h3>${escapeHtml(item.name)}</h3>
      ${catalogVisualMarkup(item, "shop")}
      <p>${escapeHtml(item.description || "")}</p>
      <button type="button" data-shop-item="${item.id}" data-shop-action="${action}" ${action === "included" || action === "equipped" ? "disabled" : ""}>${actionText}</button>
    </article>`;
  }).join("");

  grid.querySelectorAll("[data-shop-item]").forEach(button => button.addEventListener("click", () => {
    const item = ROOM_ITEM_BY_ID.get(button.dataset.shopItem);
    if (!item) return;
    if (button.dataset.shopAction === "buy") buyItem(item);
    else if (button.dataset.shopAction === "equip") equipRoomItem(item.id);
    else if (button.dataset.shopAction === "remove") unequipRoomSlot(item.slot);
  }));
}

function renderInventoryCategoryTabs() {
  const container = document.getElementById("inventoryCategoryTabs");
  if (!container) return;
  const available = SHOP_CATEGORIES.filter(category => category.id === "all" || shopItems.some(item => item.category === category.id && isRoomItemOwned(item.id)));
  if (!available.some(category => category.id === state.inventoryCategory)) state.inventoryCategory = "all";
  container.innerHTML = available.map(category => `<button type="button" class="${state.inventoryCategory === category.id ? "active" : ""}" data-inventory-category="${category.id}">${escapeHtml(category.label)}</button>`).join("");
  container.querySelectorAll("[data-inventory-category]").forEach(button => button.addEventListener("click", () => {
    state.inventoryCategory = button.dataset.inventoryCategory;
    saveState();
    renderInventory();
  }));
}

function renderInventory() {
  renderInventoryCategoryTabs();
  const grid = document.getElementById("inventoryGrid");
  if (!grid) return;
  const ownedItems = shopItems.filter(item => isRoomItemOwned(item.id) && (state.inventoryCategory === "all" || item.category === state.inventoryCategory));
  document.getElementById("inventoryOwnedCount").textContent = `${state.ownedItems.filter(id => ROOM_ITEM_IDS.has(id)).length} eşya`;
  grid.innerHTML = ownedItems.map(item => {
    const equipped = state.equippedItems?.[item.slot] === item.id;
    const cannotRemove = equipped && BASE_ROOM_SLOTS.has(item.slot);
    const action = equipped ? (cannotRemove ? "fixed" : "remove") : "equip";
    const text = equipped ? (cannotRemove ? "Temel Parça" : "Kaldır") : "Kullan";
    return `<article class="inventory-item${equipped ? " equipped" : ""}">
      ${catalogVisualMarkup(item, "inventory")}
      <div class="inventory-item-copy"><strong>${escapeHtml(item.name)}</strong><span>${equipped ? "Şu anda odada" : "Envanterde"}</span></div>
      <button type="button" data-inventory-item="${item.id}" data-inventory-action="${action}" ${action === "fixed" ? "disabled" : ""}>${text}</button>
    </article>`;
  }).join("") || '<div class="inventory-empty">Bu kategoride henüz eşyan yok.</div>';

  grid.querySelectorAll("[data-inventory-item]").forEach(button => button.addEventListener("click", () => {
    const item = ROOM_ITEM_BY_ID.get(button.dataset.inventoryItem);
    if (!item) return;
    if (button.dataset.inventoryAction === "equip") equipRoomItem(item.id);
    if (button.dataset.inventoryAction === "remove") unequipRoomSlot(item.slot);
  }));
}

function buyItem(item) {
  if (!item || item.included || BASE_ROOM_ITEMS.has(item.id)) {
    showToast(`${item?.name || "Bu eşya"} odanın başlangıç parçası`);
    return;
  }
  if (isRoomItemOwned(item.id)) {
    showToast(`${item.name} zaten envanterinde`);
    return;
  }
  if (state.coins < item.price) {
    showToast(`${item.name} için ${item.price - state.coins} coin daha gerekli`);
    return;
  }
  state.coins -= item.price;
  state.ownedItems.push(item.id);
  saveState();
  renderStats();
  renderShop();
  renderInventory();
  showToast(`${item.name} satın alındı ve envantere eklendi`);
  showRoomStatus("Yeni eşyanı Envanter'den odaya yerleştirebilirsin ✨");
}

function equipRoomItem(itemId) {
  const item = ROOM_ITEM_BY_ID.get(itemId);
  if (!item || !isRoomItemOwned(itemId)) return;
  state.equippedItems[item.slot] = item.id;
  saveState();
  renderRoom(item.id);
  renderShop();
  renderInventory();
  showToast(`${item.name} odaya yerleştirildi`);
  showRoomStatus(`${item.name} kullanılıyor ✨`);
}

function unequipRoomSlot(slot) {
  if (BASE_ROOM_SLOTS.has(slot)) {
    showToast("Duvar, zemin ve pencere yalnızca başka bir modelle değiştirilebilir");
    return;
  }
  const item = getEquippedRoomItem(slot);
  if (!item) return;
  state.equippedItems[slot] = "";
  saveState();
  renderRoom();
  renderShop();
  renderInventory();
  showToast(`${item.name} odadan kaldırıldı; envanterinde duruyor`);
}

function renderRoom(justAddedId = null) {
  const canvas = document.getElementById("roomCanvas");
  if (!canvas) return;
  canvas.dataset.wallTheme = state.equippedItems.wall || ROOM_DEFAULTS.wall;
  canvas.dataset.floorTheme = state.equippedItems.floor || ROOM_DEFAULTS.floor;
  canvas.classList.toggle("is-night", state.roomMode === "night");

  document.querySelectorAll("[data-room-slot]").forEach(element => {
    const slot = element.dataset.roomSlot;
    const item = getEquippedRoomItem(slot);
    const visible = Boolean(item);
    element.classList.toggle("is-owned", visible);
    element.classList.toggle("is-equipped", visible);
    element.setAttribute("aria-hidden", String(!visible));
    element.dataset.variant = item?.visual || "";
    if (item?.image) element.src = item.image;
    if (visible && item.id === justAddedId) {
      element.classList.remove("just-added");
      requestAnimationFrame(() => element.classList.add("just-added"));
      setTimeout(() => element.classList.remove("just-added"), 720);
    }
  });

  const accessory = getEquippedRoomItem("accessory");
  const accessoryElement = document.getElementById("mikiAccessory");
  accessoryElement.dataset.variant = accessory?.visual || "";
  accessoryElement.classList.toggle("active", Boolean(accessory));

  const seasonal = getEquippedRoomItem("seasonal");
  const seasonalElement = document.getElementById("roomSeasonal");
  seasonalElement.dataset.variant = seasonal?.visual || "";
  seasonalElement.classList.toggle("active", Boolean(seasonal));

  const modeButton = document.getElementById("roomModeButton");
  modeButton.innerHTML = state.roomMode === "night" ? '<img src="./sun.png" alt=""> Gündüz' : '<img src="./moon-pixel.png" alt=""> Gece';
  modeButton.title = state.roomMode === "night" ? "Gündüz görünümüne geç" : "Gece görünümüne geç";

  if (justAddedId && [state.equippedItems.wall, state.equippedItems.floor].includes(justAddedId)) {
    canvas.classList.remove("surface-just-added");
    requestAnimationFrame(() => canvas.classList.add("surface-just-added"));
    setTimeout(() => canvas.classList.remove("surface-just-added"), 720);
  }
}

function toggleRoomMode() {
  state.roomMode = state.roomMode === "night" ? "day" : "night";
  saveState();
  renderRoom();
  showRoomStatus(state.roomMode === "night" ? "Miki'nin odasında gece oldu 🌙" : "Odaya gün ışığı doldu ☀");
}

function renderTodaySummary() {
  const record = ensureHistoryRecord(state, state.currentDate);
  const done = state.tasks.filter(task => task.done).length;
  document.getElementById("todayStudyMinutes").textContent = `${Math.round(Number(record.totalMinutes) || 0)} dk`;
  document.getElementById("todayStudyPomodoros").textContent = `${Math.round(Number(record.pomodoros) || 0)} Pomodoro`;
  document.getElementById("todayStudyTasks").textContent = `${done} / ${state.tasks.length}`;
}

function getWeekStartKey(dateKey) {
  const date = parseDateKey(dateKey) || new Date();
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return getDateKey(date);
}

function getMonthStartKey(dateKey) {
  const date = parseDateKey(dateKey) || new Date();
  return getDateKey(new Date(date.getFullYear(), date.getMonth(), 1));
}

function getMonthEndKey(dateKey) {
  const date = parseDateKey(dateKey) || new Date();
  return getDateKey(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

function dateKeysBetween(startKey, endKey) {
  const keys = [];
  let cursor = startKey;
  let safety = 0;
  while (cursor <= endKey && safety < 800) {
    keys.push(cursor);
    cursor = addDays(cursor, 1);
    safety += 1;
  }
  return keys;
}

function recordSessions(record, categoryFilter = "") {
  const sessions = Array.isArray(record?.sessions) ? record.sessions : [];
  return sessions.filter(session => !categoryFilter || (session.taskCategory || "Genel") === categoryFilter);
}

function recordMinutes(record, categoryFilter = "") {
  const sessions = recordSessions(record, categoryFilter);
  if (sessions.length || categoryFilter) return Math.round(sessions.reduce((sum, session) => sum + (Number(session.minutes) || 0), 0));
  return Math.round(Number(record?.totalMinutes) || 0);
}

function recordPomodoros(record, categoryFilter = "") {
  const sessions = recordSessions(record, categoryFilter);
  if (sessions.length || categoryFilter) return sessions.filter(session => session.completed).length;
  return Math.round(Number(record?.pomodoros) || 0);
}

function recordTasks(record, categoryFilter = "") {
  const tasks = Array.isArray(record?.tasks) ? record.tasks : [];
  return tasks.filter(task => !categoryFilter || (task.category || "Genel") === categoryFilter);
}

function historyPeriod(view = state.historyView) {
  const dateInput = document.getElementById("historyDate");
  const anchorKey = parseDateKey(dateInput?.value) ? dateInput.value : state.currentDate;
  if (view === "daily") return { start: anchorKey, end: anchorKey, label: formatFullDate(anchorKey), keys: [anchorKey] };
  if (view === "weekly") {
    const start = getWeekStartKey(anchorKey);
    const end = addDays(start, 6);
    return { start, end, label: `${formatHistoryDate(start)} – ${formatHistoryDate(end)}`, keys: dateKeysBetween(start, end) };
  }
  if (view === "monthly") {
    const start = getMonthStartKey(anchorKey);
    const end = getMonthEndKey(anchorKey);
    const date = parseDateKey(start);
    const label = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" }).format(date);
    return { start, end, label: label.charAt(0).toUpperCase() + label.slice(1), keys: dateKeysBetween(start, end) };
  }
  const year = Number(document.getElementById("historyYear")?.value) || new Date().getFullYear();
  const start = `${year}-01-01`;
  const end = `${year}-12-31`;
  return { start, end, label: `${year} yılı`, keys: dateKeysBetween(start, end) };
}

function currentHistoryCategory() {
  return document.getElementById("historyCategoryFilter")?.value || "";
}

function periodEntries(period) {
  return period.keys.map(dateKey => [dateKey, state.history[dateKey] || null]);
}

function calculateStreak(categoryFilter = "") {
  const today = getDateKey();
  let cursor = today;
  if (recordMinutes(state.history[cursor], categoryFilter) < 10) cursor = addDays(cursor, -1);
  let streak = 0;
  while (recordMinutes(state.history[cursor], categoryFilter) >= 10 && streak < 2000) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

function topCategoryForEntries(entries) {
  const totals = new Map();
  entries.forEach(([, record]) => (record?.sessions || []).forEach(session => {
    const category = session.taskCategory || "Genel";
    totals.set(category, (totals.get(category) || 0) + (Number(session.minutes) || 0));
  }));
  return [...totals.entries()].sort((a, b) => b[1] - a[1])[0] || null;
}

function productiveHourForEntries(entries, categoryFilter = "") {
  const totals = new Map();
  entries.forEach(([, record]) => recordSessions(record, categoryFilter).forEach(session => {
    const value = session.startedAt || session.completedAt;
    const date = new Date(value);
    if (!value || Number.isNaN(date.getTime())) return;
    const hour = date.getHours();
    totals.set(hour, (totals.get(hour) || 0) + (Number(session.minutes) || 0));
  }));
  const best = [...totals.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!best) return "—";
  return `${String(best[0]).padStart(2, "0")}:00–${String((best[0] + 1) % 24).padStart(2, "0")}:00`;
}

function weekMinutes(anchorKey, categoryFilter = "") {
  const start = getWeekStartKey(anchorKey);
  return dateKeysBetween(start, addDays(start, 6)).reduce((sum, key) => sum + recordMinutes(state.history[key], categoryFilter), 0);
}

function comparisonText(diff) {
  if (diff > 0) return `+${diff} dk`;
  if (diff < 0) return `${diff} dk`;
  return "Aynı";
}

function populateHistoryYears() {
  const select = document.getElementById("historyYear");
  if (!select) return;
  const previous = select.value;
  const years = new Set([new Date().getFullYear()]);
  Object.keys(state.history).forEach(key => years.add(Number(key.slice(0, 4))));
  select.innerHTML = [...years].filter(Number.isInteger).sort((a, b) => b - a).map(year => `<option value="${year}">${year}</option>`).join("");
  select.value = [...years].map(String).includes(previous) ? previous : String(new Date().getFullYear());
}

function populateHistoryCategories() {
  const select = document.getElementById("historyCategoryFilter");
  if (!select) return;
  const previous = select.value;
  const categories = new Set();
  Object.values(state.history).forEach(record => {
    (record.tasks || []).forEach(task => categories.add(task.category || "Genel"));
    (record.sessions || []).forEach(session => categories.add(session.taskCategory || "Genel"));
  });
  state.tasks.forEach(task => categories.add(task.category || "Genel"));
  select.innerHTML = '<option value="">Tümü</option>' + [...categories].filter(Boolean).sort((a, b) => a.localeCompare(b, "tr")).map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
  if ([...categories].includes(previous)) select.value = previous;
}

function renderStudyBreakdown(entries, categoryFilter = currentHistoryCategory()) {
  const totals = new Map();
  entries.forEach(([, record]) => recordSessions(record, categoryFilter).forEach(session => {
    const title = session.taskTitle || "Serbest çalışma";
    const category = session.taskCategory || "Genel";
    const key = `${category}\u0000${title}`;
    totals.set(key, (totals.get(key) || 0) + (Number(session.minutes) || 0));
  }));
  const rows = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const container = document.getElementById("studyBreakdown");
  if (!rows.length) {
    container.innerHTML = '<div class="breakdown-empty">Bu dönemde seçili ders veya göreve bağlı çalışma yok.</div>';
    return;
  }
  const max = Math.max(...rows.map(([, minutes]) => minutes), 1);
  container.innerHTML = rows.map(([key, minutes]) => {
    const [category, title] = key.split("\u0000");
    return `<div class="breakdown-row"><div class="breakdown-copy"><strong>${escapeHtml(title)}</strong><span>${escapeHtml(category)}</span></div><div class="breakdown-bar"><span style="width:${Math.max(8, Math.round(minutes / max * 100))}%"></span></div><b>${Math.round(minutes)} dk</b></div>`;
  }).join("");
}

function renderSpecificDay(dateKey = document.getElementById("historyDate")?.value, categoryFilter = currentHistoryCategory()) {
  const container = document.getElementById("specificDayDetail");
  if (!container) return;
  const date = parseDateKey(dateKey);
  if (!date) {
    container.innerHTML = '<div class="specific-day-empty">Görüntülemek için bir tarih seç.</div>';
    return;
  }
  if (dateKey === state.currentDate) syncTasksToHistory(state, state.currentDate, state.tasks);
  const record = state.history[dateKey];
  if (!record) {
    container.innerHTML = `<div class="specific-day-empty"><strong>${escapeHtml(formatFullDate(dateKey))}</strong><span>Bu gün için henüz çalışma veya yapılacaklar kaydı yok.</span></div>`;
    return;
  }
  const tasks = recordTasks(record, categoryFilter);
  const sessions = recordSessions(record, categoryFilter);
  const done = tasks.filter(task => task.done).length;
  const taskRows = tasks.length ? tasks.map(historyTaskRow).join("") : '<li class="history-no-task">Bu filtrede görev yok.</li>';
  const sessionRows = sessions.length ? sessions.map(historySessionRow).join("") : '<li class="history-no-task">Bu filtrede çalışma oturumu yok.</li>';
  container.innerHTML = `<div class="specific-day-title"><div><strong>${escapeHtml(formatFullDate(dateKey))}</strong><span>${recordMinutes(record, categoryFilter)} dakika · ${recordPomodoros(record, categoryFilter)} Pomodoro · ${done}/${tasks.length} görev</span></div></div><div class="specific-day-columns"><div class="specific-day-block"><h4>Çalışma Oturumları</h4><ul class="specific-session-list">${sessionRows}</ul></div><div class="specific-day-block"><h4>O Günün Yapılacakları</h4><ul>${taskRows}</ul></div></div>`;
}

function heatLevel(minutes, goal) {
  if (minutes <= 0) return 0;
  const ratio = minutes / Math.max(1, goal);
  if (ratio < .35) return 1;
  if (ratio < .7) return 2;
  if (ratio < 1) return 3;
  return 4;
}

function renderHistoryVisual(period, categoryFilter) {
  const container = document.getElementById("historyVisual");
  const title = document.getElementById("historyVisualTitle");
  const legend = document.getElementById("historyVisualLegend");
  const view = state.historyView;
  const goal = state.dailyGoalMinutes;
  title.textContent = period.label;

  if (view === "daily") {
    legend.textContent = "Saatlere göre çalışma";
    const record = state.history[period.start];
    const hours = Array.from({ length: 24 }, () => 0);
    recordSessions(record, categoryFilter).forEach(session => {
      const date = new Date(session.startedAt || session.completedAt);
      if (!Number.isNaN(date.getTime())) hours[date.getHours()] += Number(session.minutes) || 0;
    });
    const activeHours = hours.map((minutes, hour) => ({ hour, minutes })).filter(item => item.minutes > 0);
    container.innerHTML = activeHours.length ? `<div class="hour-chart">${activeHours.map(item => `<div class="hour-row"><span>${String(item.hour).padStart(2, "0")}:00</span><div><i style="width:${Math.max(8, Math.min(100, item.minutes / Math.max(...hours, 1) * 100))}%"></i></div><b>${Math.round(item.minutes)} dk</b></div>`).join("")}</div>` : '<div class="history-visual-empty">Bu gün için saat bilgili çalışma kaydı yok.</div>';
    return;
  }

  if (view === "weekly") {
    legend.textContent = "Günlere göre dakika";
    const values = period.keys.map(key => ({ key, minutes: recordMinutes(state.history[key], categoryFilter) }));
    const max = Math.max(...values.map(item => item.minutes), goal, 1);
    container.innerHTML = `<div class="week-bars">${values.map(item => {
      const date = parseDateKey(item.key);
      const day = new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(date).replace(".", "");
      return `<button type="button" data-history-date="${item.key}" title="${formatFullDate(item.key)} · ${item.minutes} dk"><span class="week-bar-track"><i style="height:${Math.max(item.minutes ? 8 : 2, item.minutes / max * 100)}%"></i><em style="bottom:${Math.min(98, goal / max * 100)}%"></em></span><b>${item.minutes}</b><small>${day}</small></button>`;
    }).join("")}</div>`;
    return;
  }

  if (view === "monthly") {
    legend.textContent = "Renk koyulaştıkça çalışma süresi artar";
    const first = parseDateKey(period.start);
    const leading = (first.getDay() + 6) % 7;
    const cells = Array.from({ length: leading }, () => '<span class="calendar-cell blank"></span>');
    period.keys.forEach(key => {
      const minutes = recordMinutes(state.history[key], categoryFilter);
      const level = heatLevel(minutes, goal);
      cells.push(`<button type="button" class="calendar-cell heat-${level}" data-history-date="${key}" title="${formatFullDate(key)} · ${minutes} dk"><b>${Number(key.slice(-2))}</b><small>${minutes || ""}</small></button>`);
    });
    container.innerHTML = `<div class="month-calendar"><div class="calendar-weekdays"><span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span></div><div class="calendar-grid">${cells.join("")}</div></div>`;
    return;
  }

  legend.textContent = "Yıllık takvim ısı haritası";
  const year = Number(period.start.slice(0, 4));
  const gridStart = getWeekStartKey(`${year}-01-01`);
  const gridEnd = addDays(getWeekStartKey(`${year}-12-31`), 6);
  const keys = dateKeysBetween(gridStart, gridEnd);
  container.innerHTML = `<div class="year-heatmap-wrap"><div class="heatmap-day-labels"><span>Pzt</span><span></span><span>Çar</span><span></span><span>Cum</span><span></span><span>Paz</span></div><div class="year-heatmap">${keys.map(key => {
    const inYear = key.startsWith(String(year));
    const minutes = inYear ? recordMinutes(state.history[key], categoryFilter) : 0;
    return `<button type="button" class="heat-cell heat-${heatLevel(minutes, goal)}${inYear ? "" : " outside"}" ${inYear ? `data-history-date="${key}" title="${formatFullDate(key)} · ${minutes} dk"` : "disabled"}></button>`;
  }).join("")}</div></div>`;
}

function renderAbandonedSessions(entries, categoryFilter) {
  const sessions = [];
  entries.forEach(([dateKey, record]) => recordSessions(record, categoryFilter).forEach(session => {
    if (!session.completed || session.canceled) sessions.push({ dateKey, ...session });
  }));
  const container = document.getElementById("abandonedSessions");
  document.getElementById("abandonedCount").textContent = `${sessions.length} kayıt`;
  container.innerHTML = sessions.length ? sessions.slice(0, 12).reverse().map(session => `<button type="button" data-history-date="${session.dateKey}"><span>◐</span><div><strong>${escapeHtml(session.taskTitle || "Serbest çalışma")}</strong><small>${escapeHtml(formatHistoryDate(session.dateKey))} · ${escapeHtml(session.taskCategory || "Genel")}</small></div><b>${Math.round(Number(session.minutes) || 0)} dk</b></button>`).join("") : '<div class="abandoned-empty">Bu dönemde yarım bırakılan oturum yok.</div>';
}

function renderHistoryDayList(entries, categoryFilter) {
  const container = document.getElementById("historyDays");
  const visible = entries.filter(([, record]) => record && (recordMinutes(record, categoryFilter) > 0 || recordTasks(record, categoryFilter).length));
  if (!visible.length) {
    container.innerHTML = '<div class="history-empty">Bu dönemde görüntülenecek kayıt yok.</div>';
    return;
  }
  container.innerHTML = visible.slice().reverse().slice(0, state.historyView === "yearly" ? 40 : 62).map(([dateKey, record]) => {
    const tasks = recordTasks(record, categoryFilter);
    const done = tasks.filter(task => task.done).length;
    const taskRows = tasks.length ? tasks.map(historyTaskRow).join("") : '<li class="history-no-task">Bu filtrede görev yok.</li>';
    const abandoned = recordSessions(record, categoryFilter).filter(session => !session.completed || session.canceled).length;
    return `<details class="history-day-card"><summary><span class="history-day-date">${escapeHtml(formatHistoryDate(dateKey))}</span><span class="history-day-meta">${recordMinutes(record, categoryFilter)} dk · ${done}/${tasks.length} görev${abandoned ? ` · ${abandoned} yarım` : ""}</span></summary><div class="history-day-content"><div class="history-day-session">🍅 ${recordPomodoros(record, categoryFilter)} tamamlanan Pomodoro</div><ul>${taskRows}</ul><button type="button" class="history-open-day" data-history-date="${dateKey}">Günün ayrıntısını aç</button></div></details>`;
  }).join("");
}

function renderHistory() {
  syncTasksToHistory(state, state.currentDate, state.tasks);
  const today = getDateKey();
  const dateInput = document.getElementById("historyDate");
  dateInput.max = today;
  if (!dateInput.value) dateInput.value = state.currentDate;
  const categoryFilter = currentHistoryCategory();
  const period = historyPeriod(state.historyView);
  const entries = periodEntries(period);
  const metricKeys = period.keys.filter(key => key <= today);
  const metricEntries = metricKeys.map(key => [key, state.history[key] || null]);
  const totalMinutes = metricEntries.reduce((sum, [, record]) => sum + recordMinutes(record, categoryFilter), 0);
  const totalPomodoros = metricEntries.reduce((sum, [, record]) => sum + recordPomodoros(record, categoryFilter), 0);
  const activeDays = metricEntries.filter(([, record]) => recordMinutes(record, categoryFilter) > 0).length;
  const allTasks = metricEntries.flatMap(([, record]) => recordTasks(record, categoryFilter));
  const taskRate = allTasks.length ? Math.round(allTasks.filter(task => task.done).length / allTasks.length * 100) : 0;
  const goalDays = metricEntries.filter(([, record]) => recordMinutes(record, categoryFilter) >= state.dailyGoalMinutes).length;
  const goalRate = metricEntries.length ? Math.round(goalDays / metricEntries.length * 100) : 0;
  const anchor = dateInput.value || state.currentDate;
  const rollingStart = addDays(getWeekStartKey(anchor), -49);
  const rollingEnd = addDays(getWeekStartKey(anchor), 6);
  const rollingMinutes = dateKeysBetween(rollingStart, rollingEnd).reduce((sum, key) => sum + recordMinutes(state.history[key], categoryFilter), 0);
  const weeklyAverage = Math.round(rollingMinutes / 8);
  const topCategory = categoryFilter ? [categoryFilter, totalMinutes] : topCategoryForEntries(metricEntries);
  const thisWeek = weekMinutes(anchor, categoryFilter);
  const previousWeek = weekMinutes(addDays(getWeekStartKey(anchor), -1), categoryFilter);
  const diff = thisWeek - previousWeek;

  document.querySelectorAll("[data-history-view]").forEach(button => button.classList.toggle("active", button.dataset.historyView === state.historyView));
  document.getElementById("historyDateControl").classList.toggle("hidden-control", state.historyView === "yearly");
  document.getElementById("historyYearControl").classList.toggle("hidden-control", state.historyView !== "yearly");
  document.getElementById("dailyGoalMinutes").value = String(state.dailyGoalMinutes);
  document.getElementById("periodTotalMinutes").textContent = `${totalMinutes} dk`;
  document.getElementById("periodPomodoros").textContent = String(totalPomodoros);
  document.getElementById("periodActiveDays").textContent = String(activeDays);
  document.getElementById("currentStreak").textContent = `${calculateStreak(categoryFilter)} gün`;
  document.getElementById("topStudyCategory").textContent = topCategory ? `${topCategory[0]} · ${Math.round(topCategory[1])} dk` : "—";
  document.getElementById("weeklyAverage").textContent = `${weeklyAverage} dk`;
  document.getElementById("productiveHour").textContent = productiveHourForEntries(metricEntries, categoryFilter);
  document.getElementById("taskCompletionRate").textContent = `${taskRate}%`;
  document.getElementById("goalAchievementRate").textContent = state.studyGoals?.dailyMinutes?.enabled === false ? "Kapalı" : `${goalRate}%`;
  document.getElementById("weekComparison").textContent = comparisonText(diff);
  document.getElementById("studyBreakdownPeriod").textContent = period.label;
  document.getElementById("historyListHeading").textContent = `${period.label} kayıtları`;

  const insight = diff > 0
    ? `Bu hafta ${thisWeek} dakika çalıştın. Geçen haftaya göre ${diff} dakika daha fazla.`
    : diff < 0
      ? `Bu hafta ${thisWeek} dakika çalıştın. Geçen haftanın ${Math.abs(diff)} dakika gerisindesin; küçük bir oturum farkı kapatabilir.`
      : thisWeek > 0
        ? `Bu hafta ${thisWeek} dakika çalıştın. Geçen haftayla aynı tempodasın.`
        : "Bu hafta henüz çalışma kaydı yok. Küçük bir oturumla başlayabilirsin.";
  document.getElementById("historyInsight").textContent = insight;

  renderHistoryVisual(period, categoryFilter);
  renderStudyBreakdown(metricEntries, categoryFilter);
  document.getElementById("historyDailyDetail").classList.toggle("hidden-section", state.historyView !== "daily");
  if (state.historyView === "daily") renderSpecificDay(period.start, categoryFilter);
  renderAbandonedSessions(metricEntries, categoryFilter);
  renderHistoryDayList(entries, categoryFilter);
}

function openHistory() {
  saveState();
  showAppPage("progressPage");
  populateHistoryYears();
  populateHistoryCategories();
  const input = document.getElementById("historyDate");
  input.max = getDateKey();
  if (!input.value) input.value = state.currentDate;
  renderHistory();
}

function renderAll() {
  renderDate();
  renderExamCountdown();
  renderTasks();
  renderTimer();
  renderStats();
  renderShop();
  renderRoom();
  renderTodaySummary();
  document.getElementById("focusMinutes").value = String(state.focusMinutes);
  document.getElementById("soundEnabled").checked = state.soundEnabled;
  document.getElementById("startDayButton").disabled = state.dayStarted;
  document.getElementById("startDayButton").style.opacity = state.dayStarted ? ".62" : "1";
}

// v7.5 controls
document.getElementById("roomModeButton").addEventListener("click", toggleRoomMode);
document.getElementById("openInventoryButton").addEventListener("click", () => {
  showAppPage("mikiPage");
  showMikiPanel("inventory");
});
document.getElementById("historyViewTabs").addEventListener("click", event => {
  const button = event.target.closest("[data-history-view]");
  if (!button || !HISTORY_VIEWS.has(button.dataset.historyView)) return;
  state.historyView = button.dataset.historyView;
  saveState();
  renderHistory();
});
document.getElementById("historyCategoryFilter").addEventListener("change", renderHistory);
document.getElementById("dailyGoalMinutes").addEventListener("input", renderGoalSettingsPreview);
document.getElementById("historyVisual").addEventListener("click", event => {
  const button = event.target.closest("[data-history-date]");
  if (!button) return;
  document.getElementById("historyDate").value = button.dataset.historyDate;
  state.historyView = "daily";
  saveState();
  renderHistory();
});
document.getElementById("abandonedSessions").addEventListener("click", event => {
  const button = event.target.closest("[data-history-date]");
  if (!button) return;
  document.getElementById("historyDate").value = button.dataset.historyDate;
  state.historyView = "daily";
  renderHistory();
});
document.getElementById("historyDays").addEventListener("click", event => {
  const button = event.target.closest("[data-history-date]");
  if (!button) return;
  document.getElementById("historyDate").value = button.dataset.historyDate;
  state.historyView = "daily";
  renderHistory();
});
document.getElementById("taskList").addEventListener("change", () => setTimeout(renderTodaySummary, 0));
document.getElementById("historyDate").addEventListener("change", renderHistory);

/* v7.6 structured breaks, three focus modes and multiple exams */
function isBreakPhase() {
  return state.workMode === "pomodoro" && (state.timerPhase === "shortBreak" || state.timerPhase === "longBreak");
}

function isStopwatchMode() {
  return state.workMode === "stopwatch";
}

function phaseMinutes(phase = state.timerPhase) {
  if (phase === "shortBreak") return state.shortBreakMinutes;
  if (phase === "longBreak") return state.longBreakMinutes;
  return state.focusMinutes;
}

function phaseLabel(phase = state.timerPhase) {
  if (phase === "shortBreak") return "Kısa Mola";
  if (phase === "longBreak") return "Uzun Mola";
  if (state.workMode === "free") return "Serbest Sayaç";
  if (state.workMode === "stopwatch") return "Kronometre";
  return "Pomodoro";
}

function formatTimerSeconds(totalSeconds, allowHours = false) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  if (allowHours && hours > 0) return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const totalMinutes = Math.floor(safe / 60);
  return `${String(totalMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getLiveRemainingSeconds(now = Date.now()) {
  if (isStopwatchMode()) return 0;
  if (!state.timerRunning || !state.timerEndAt) return Math.max(0, Math.round(state.remainingSeconds));
  return Math.max(0, Math.ceil((state.timerEndAt - now) / 1000));
}

function getCurrentRunElapsedSeconds(now = Date.now()) {
  if (!state.timerRunning || !state.runStartedAt) return 0;
  if (isStopwatchMode()) return Math.max(0, Math.floor((now - state.runStartedAt) / 1000));
  return Math.max(0, state.runStartedRemainingSeconds - getLiveRemainingSeconds(now));
}

function getTotalWorkedSeconds(now = Date.now()) {
  return Math.max(0, state.sessionElapsedSeconds + getCurrentRunElapsedSeconds(now));
}

function hasSessionInProgress() {
  return Boolean(state.timerRunning || state.sessionStartedAt || state.sessionElapsedSeconds > 0);
}

function getSelectedFocusTask() {
  return state.tasks.find(task => task.id === state.selectedTaskId && !task.done) || null;
}

function preparePhase(phase = "focus") {
  state.timerPhase = TIMER_PHASES.has(phase) ? phase : "focus";
  state.timerRunning = false;
  state.timerEndAt = null;
  state.runStartedAt = null;
  state.runStartedRemainingSeconds = 0;
  state.sessionStartedAt = null;
  state.sessionDate = null;
  state.sessionElapsedSeconds = 0;
  state.sessionCompletedTaskIdsAtStart = [];
  state.activeTaskId = "";
  state.activeTaskTitle = "";
  state.activeTaskCategory = "";
  state.activeSessionMinutes = phaseMinutes(state.timerPhase);
  state.remainingSeconds = isStopwatchMode() ? 0 : state.activeSessionMinutes * 60;
}

function beginFreshSession(now = Date.now()) {
  const breakPhase = isBreakPhase();
  const selectedTask = breakPhase ? null : getSelectedFocusTask();
  state.activeSessionMinutes = phaseMinutes();
  state.remainingSeconds = isStopwatchMode() ? 0 : state.activeSessionMinutes * 60;
  state.sessionElapsedSeconds = 0;
  state.sessionStartedAt = now;
  state.sessionDate = getDateKey(new Date(now));
  state.sessionCompletedTaskIdsAtStart = breakPhase ? [] : getCompletedTaskIds();
  state.activeTaskId = selectedTask ? selectedTask.id : "";
  state.activeTaskTitle = breakPhase ? phaseLabel() : (selectedTask ? selectedTask.title : "Serbest çalışma");
  state.activeTaskCategory = breakPhase ? "Mola" : (selectedTask ? selectedTask.category : "Genel");
}

function startOrResumeTimer() {
  const now = Date.now();
  if (!hasSessionInProgress()) beginFreshSession(now);
  else if (!state.sessionStartedAt) state.sessionStartedAt = now;

  state.runStartedAt = now;
  if (isStopwatchMode()) {
    state.runStartedRemainingSeconds = 0;
    state.timerEndAt = null;
  } else {
    state.runStartedRemainingSeconds = Math.max(1, Math.round(state.remainingSeconds));
    state.timerEndAt = now + state.runStartedRemainingSeconds * 1000;
  }
  state.timerRunning = true;
  saveState();
  requestNotificationPermission();
  primeCompletionSound();
  syncTimerInterval();
  renderTimer();
}

function pauseTimer() {
  if (!state.timerRunning) return;
  const now = Date.now();
  if (!isStopwatchMode()) state.remainingSeconds = getLiveRemainingSeconds(now);
  state.sessionElapsedSeconds = getTotalWorkedSeconds(now);
  state.timerRunning = false;
  state.timerEndAt = null;
  state.runStartedAt = null;
  state.runStartedRemainingSeconds = 0;
  saveState();
  syncTimerInterval();
  renderTimer();
}

function toggleTimer() {
  if (state.timerRunning) pauseTimer();
  else startOrResumeTimer();
}

function renderWorkModeTabs() {
  document.querySelectorAll("[data-work-mode]").forEach(button => {
    button.classList.toggle("active", button.dataset.workMode === state.workMode);
    button.disabled = hasSessionInProgress();
  });
}

function renderTaskSelector() {
  const select = document.getElementById("focusTaskSelect");
  const preview = document.getElementById("focusTaskPreview");
  const picker = document.getElementById("focusTaskPicker");
  const breakPhase = isBreakPhase();
  const inProgress = hasSessionInProgress();
  const available = state.tasks.filter(task => !task.done || task.id === state.activeTaskId);
  const currentValue = inProgress ? state.activeTaskId : state.selectedTaskId;

  picker.classList.toggle("break-hidden", breakPhase);
  select.innerHTML = '<option value="">Serbest çalışma</option>' + available.map(task =>
    `<option value="${escapeHtml(task.id)}">${escapeHtml(task.category)} · ${escapeHtml(task.title)}</option>`
  ).join("");
  select.value = available.some(task => task.id === currentValue) ? currentValue : "";
  select.disabled = inProgress || breakPhase;

  const task = available.find(item => item.id === select.value);
  if (breakPhase) preview.textContent = "Mola süresi çalışma geçmişine ve ödüllere eklenmez.";
  else if (inProgress && state.activeTaskTitle) preview.textContent = `${state.activeTaskCategory || "Genel"} · ${state.activeTaskTitle} bu oturuma bağlandı.`;
  else if (task) preview.textContent = `${task.category} · ${task.completedPomodoros}/${task.estimatedPomodoros} Pomodoro · ${priorityLabel(task.priority)} öncelik`;
  else preview.textContent = "Görev seçersen çalışma geçmişin ders ve görev bazında ayrılır.";
}

function renderRewardPreview() {
  const heading = document.getElementById("rewardHeading");
  const rewardBox = document.getElementById("rewardBox");
  if (isBreakPhase()) {
    heading.textContent = "Mola süresinde:";
    setPixelReward("rewardXp", "./xp-star.png", "+0 XP");
    setPixelReward("rewardCoin", "./coin.png", "+0");
    document.getElementById("rewardTier").textContent = "Mola dinlenmek içindir; çalışma ödülü verilmez.";
    rewardBox.classList.add("break-reward-box");
    return;
  }
  rewardBox.classList.remove("break-reward-box");
  const minutes = isStopwatchMode() ? Math.floor(getTotalWorkedSeconds() / 60) : (hasSessionInProgress() ? state.activeSessionMinutes : state.focusMinutes);
  const reward = calculateReward(Math.max(1, minutes || state.focusMinutes));
  const zero = isStopwatchMode() && minutes < 5;
  heading.textContent = isStopwatchMode() ? "Kronometreyi tamamladığında:" : "Bu süre tamamlandığında:";
  setPixelReward("rewardXp", "./xp-star.png", `+${zero ? 0 : reward.xp} XP`);
  setPixelReward("rewardCoin", "./coin.png", `+${zero ? 0 : reward.coins}`);
  document.getElementById("rewardTier").textContent = isStopwatchMode()
    ? (minutes ? `${minutes} gerçek dakika üzerinden hesaplanıyor · 5 dakikadan önce ödül yok` : "Süreyi sen bitirirsin · gerçek çalışma dakikasına göre ödül")
    : `${reward.tier} · İlk tamamlanan oturuma günlük bonus`;
}

function renderMikiFocusState() {
  const card = document.getElementById("mikiCard");
  const activity = document.getElementById("mikiActivity");
  const roomMiki = document.querySelector(".room-miki-wrap");
  if (!card || !activity) return;
  card.classList.remove("miki-working", "miki-short-break", "miki-long-break", "miki-resting");
  if (isBreakPhase()) {
    const long = state.timerPhase === "longBreak";
    card.classList.add(long ? "miki-long-break" : "miki-short-break");
    activity.textContent = long ? "Uzun molada derin uyuyor" : "Kısa molada esniyor";
    roomMiki?.classList.add("miki-room-resting");
  } else if (state.timerRunning) {
    card.classList.add("miki-working");
    activity.textContent = isStopwatchMode() ? "Seninle kronometre tutuyor" : "Seninle odaklanıyor";
    roomMiki?.classList.remove("miki-room-resting");
  } else if (hasSessionInProgress()) {
    card.classList.add("miki-resting");
    activity.textContent = "Seninle birlikte bekliyor";
    roomMiki?.classList.remove("miki-room-resting");
  } else {
    activity.textContent = "Çalışmaya hazır";
    roomMiki?.classList.remove("miki-room-resting");
  }
}

function renderTimer() {
  const breakPhase = isBreakPhase();
  const inProgress = hasSessionInProgress();
  const shownSeconds = isStopwatchMode() ? getTotalWorkedSeconds() : getLiveRemainingSeconds();
  document.getElementById("timer").textContent = formatTimerSeconds(shownSeconds, isStopwatchMode());
  document.getElementById("focusModeTitle").textContent = phaseLabel();

  const timerButtonText = state.timerRunning ? "Duraklat" : (inProgress ? "Devam Et" : (breakPhase ? "Molayı Başlat" : "Başlat"));
  document.getElementById("timerButtonText").textContent = timerButtonText;
  document.getElementById("timerIcon").textContent = state.timerRunning ? "Ⅱ" : "▶";
  document.getElementById("finishTimerButton").classList.toggle("hidden", !(isStopwatchMode() && inProgress));
  document.getElementById("cancelTimerButton").classList.toggle("hidden", !inProgress);
  document.getElementById("cancelTimerButton").textContent = breakPhase ? "Molayı Geç" : "Oturumu İptal Et";

  let status = "Odaklanmaya hazır";
  if (breakPhase) status = state.timerRunning ? `${phaseLabel()} aktif · Miki dinleniyor` : `${phaseLabel()} hazır`;
  else if (state.timerRunning && isStopwatchMode()) status = "Kronometre çalışıyor · süre gerçek saatten hesaplanıyor";
  else if (state.timerRunning) status = "Güvenli sayaç aktif · sekme kapansa da süre korunur";
  else if (inProgress) status = "Oturum duraklatıldı";
  document.getElementById("timerStatusText").textContent = status;

  const nextCount = Math.min(state.longBreakEvery, state.pomodoroCycleCount + 1);
  const cycle = document.getElementById("cycleStatus");
  cycle.classList.toggle("hidden", state.workMode !== "pomodoro");
  if (state.workMode === "pomodoro") {
    cycle.textContent = state.breaksEnabled
      ? `${nextCount} / ${state.longBreakEvery} odak · ${nextCount >= state.longBreakEvery ? "sonraki mola uzun" : "sonraki mola kısa"}`
      : "Molalar kapalı · yalnızca odak sayacı";
  }
  document.getElementById("focusCard").classList.toggle("break-active", breakPhase);
  document.getElementById("focusCard").classList.toggle("stopwatch-active", isStopwatchMode());
  renderWorkModeTabs();
  renderRewardPreview();
  renderTaskSelector();
  renderMikiFocusState();
}

function switchWorkMode(mode) {
  if (!WORK_MODES.has(mode) || mode === state.workMode) return;
  if (hasSessionInProgress()) {
    showToast("Çalışma modunu değiştirmeden önce mevcut oturumu tamamla veya iptal et");
    return;
  }
  state.workMode = mode;
  state.timerPhase = "focus";
  preparePhase("focus");
  saveState();
  renderTimer();
  showToast(`${phaseLabel()} modu seçildi`);
}

function syncTimerInterval() {
  clearInterval(timerInterval);
  timerInterval = null;
  if (!state.timerRunning) return;
  timerInterval = setInterval(() => {
    if (!isStopwatchMode() && getLiveRemainingSeconds() <= 0) completePomodoro();
    else renderTimer();
  }, isStopwatchMode() ? 500 : 250);
}

function reconcileTimerState() {
  if (!state.timerRunning) {
    renderTimer();
    return;
  }
  if (!isStopwatchMode() && state.timerEndAt && Date.now() >= state.timerEndAt) {
    completePomodoro({ recovered: true });
    return;
  }
  renderTimer();
  syncTimerInterval();
}

function resetSession({ showZero = false, phase = "focus" } = {}) {
  state.timerPhase = TIMER_PHASES.has(phase) ? phase : "focus";
  state.timerRunning = false;
  state.timerEndAt = null;
  state.runStartedAt = null;
  state.runStartedRemainingSeconds = 0;
  state.sessionStartedAt = null;
  state.sessionDate = null;
  state.sessionElapsedSeconds = 0;
  state.sessionCompletedTaskIdsAtStart = [];
  state.activeTaskId = "";
  state.activeTaskTitle = "";
  state.activeTaskCategory = "";
  state.activeSessionMinutes = phaseMinutes(state.timerPhase);
  state.remainingSeconds = isStopwatchMode() ? 0 : (showZero ? 0 : state.activeSessionMinutes * 60);
}

function recordCompletedFocusSession(completedMinutes, completedAt, recovered = false) {
  const targetDate = state.sessionDate || getDateKey(completedAt);
  const record = ensureHistoryRecord(state, targetDate);
  const firstSessionBonus = record.pomodoros === 0;
  const baseReward = calculateReward(Math.max(1, completedMinutes));
  const baselineIds = new Set(state.sessionCompletedTaskIdsAtStart || []);
  const newlyCompletedTasks = targetDate === state.currentDate ? state.tasks.filter(task => task.done && !baselineIds.has(task.id)).length : 0;
  const taskBonusCount = Math.min(3, newlyCompletedTasks);
  const rewardCoins = baseReward.coins + (firstSessionBonus ? 3 : 0) + taskBonusCount * 2;
  const rewardXp = baseReward.xp + (firstSessionBonus ? 5 : 0) + taskBonusCount * 3;

  const linkedTask = state.tasks.find(task => task.id === state.activeTaskId);
  if (linkedTask && targetDate === state.currentDate) {
    linkedTask.completedPomodoros += 1;
    linkedTask.updatedAt = new Date().toISOString();
  }

  record.totalMinutes += completedMinutes;
  record.pomodoros += 1;
  if (targetDate === state.currentDate) record.tasks = cloneTasks(state.tasks, targetDate);
  record.sessions.push(normalizeSession({
    minutes: completedMinutes,
    plannedMinutes: isStopwatchMode() ? completedMinutes : state.activeSessionMinutes,
    workedSeconds: isStopwatchMode() ? getTotalWorkedSeconds() : completedMinutes * 60,
    completed: true,
    canceled: false,
    startedAt: state.sessionStartedAt ? new Date(state.sessionStartedAt).toISOString() : "",
    completedAt: completedAt.toISOString(),
    rewardCoins,
    rewardXp,
    firstSessionBonus,
    taskBonusCount,
    taskId: state.activeTaskId,
    taskTitle: state.activeTaskTitle || "Serbest çalışma",
    taskCategory: state.activeTaskCategory || "Genel",
    mode: state.workMode,
    sessionType: "focus"
  }));

  state.pomodoros += 1;
  state.coins += rewardCoins;
  state.xp += rewardXp;
  state.level = Math.floor(state.xp / 100) + 1;
  return { rewardCoins, rewardXp, firstSessionBonus, taskBonusCount, targetDate, recovered };
}

function nextBreakPhase() {
  const nextCount = state.pomodoroCycleCount + 1;
  if (nextCount >= state.longBreakEvery) {
    state.pomodoroCycleCount = 0;
    return "longBreak";
  }
  state.pomodoroCycleCount = nextCount;
  return "shortBreak";
}

function completeFocusSession({ recovered = false, stopwatch = false } = {}) {
  clearInterval(timerInterval);
  timerInterval = null;
  const completedAt = new Date();
  const completedMinutes = stopwatch ? Math.floor(getTotalWorkedSeconds() / 60) : clampMinutes(state.activeSessionMinutes || state.focusMinutes);
  if (completedMinutes < 1) {
    showToast("Bir dakikadan kısa çalışma tamamlanmış oturum olarak kaydedilmez");
    return;
  }

  const result = recordCompletedFocusSession(completedMinutes, completedAt, recovered);
  let nextPhase = "focus";
  const shouldOfferBreak = state.workMode === "pomodoro" && state.breaksEnabled;
  if (shouldOfferBreak) nextPhase = nextBreakPhase();
  resetSession({ phase: nextPhase });
  saveState();
  createLocalBackup("automatic", false);
  renderAll();

  const bonusParts = [];
  if (result.firstSessionBonus) bonusParts.push("günlük ilk oturum bonusu");
  if (result.taskBonusCount) bonusParts.push(`${result.taskBonusCount} görev bonusu`);
  const bonusText = bonusParts.length ? ` (${bonusParts.join(" + ")})` : "";
  showToast(`${completedMinutes} dk tamamlandı: +${result.rewardXp} XP, +${result.rewardCoins} coin${bonusText}`);
  showRoomStatus(shouldOfferBreak ? `Miki ${phaseLabel(nextPhase).toLocaleLowerCase("tr-TR")} için hazır ♥` : "Miki seninle gurur duyuyor ♥");
  showFocusNotification(completedMinutes, result.rewardXp, result.rewardCoins, recovered, shouldOfferBreak ? nextPhase : "");
  if (state.soundEnabled) playCompletionSound();

  if (shouldOfferBreak && state.autoStartBreaks) {
    setTimeout(() => {
      if (!hasSessionInProgress() && isBreakPhase()) startOrResumeTimer();
    }, 700);
  }
}

function completeBreak({ recovered = false } = {}) {
  clearInterval(timerInterval);
  timerInterval = null;
  const finishedLabel = phaseLabel();
  resetSession({ phase: "focus" });
  saveState();
  renderAll();
  showToast(`${finishedLabel} tamamlandı · çalışma ödülü verilmedi`);
  showRoomStatus("Miki dinlendi, yeniden odaklanmaya hazır ♥");
  showBreakNotification(finishedLabel, recovered);
  if (state.soundEnabled) playCompletionSound();
  if (state.autoStartFocus) {
    setTimeout(() => {
      if (!hasSessionInProgress() && state.timerPhase === "focus") startOrResumeTimer();
    }, 700);
  }
}

function completePomodoro({ recovered = false } = {}) {
  if (isBreakPhase()) completeBreak({ recovered });
  else completeFocusSession({ recovered, stopwatch: false });
}

function finishStopwatchSession() {
  if (!isStopwatchMode() || !hasSessionInProgress()) return;
  if (state.timerRunning) {
    const now = Date.now();
    state.sessionElapsedSeconds = getTotalWorkedSeconds(now);
    state.timerRunning = false;
    state.runStartedAt = null;
  }
  const minutes = Math.floor(state.sessionElapsedSeconds / 60);
  if (minutes < 1) {
    showToast("Kronometreyi tamamlamak için en az 1 dakika çalışmalısın");
    renderTimer();
    return;
  }
  completeFocusSession({ stopwatch: true });
}

function cancelCurrentSession() {
  if (!hasSessionInProgress()) return;
  if (isBreakPhase()) {
    if (!window.confirm(`${phaseLabel()} atlanıp odak sayacına dönülsün mü?`)) return;
    clearInterval(timerInterval);
    timerInterval = null;
    resetSession({ phase: "focus" });
    saveState();
    renderAll();
    showToast("Mola atlandı");
    return;
  }

  const workedSeconds = getTotalWorkedSeconds();
  const workedMinutes = Math.floor(workedSeconds / 60);
  const question = workedMinutes > 0
    ? `${workedMinutes} dakikalık çalışma geçmişe kaydedilecek, ancak XP ve coin verilmeyecek. Oturum iptal edilsin mi?`
    : "Bir dakikadan az çalıştın. Oturum geçmişe eklenmeden iptal edilsin mi?";
  if (!window.confirm(question)) return;

  const targetDate = state.sessionDate || state.currentDate;
  if (workedMinutes > 0) {
    const record = ensureHistoryRecord(state, targetDate);
    record.totalMinutes += workedMinutes;
    if (targetDate === state.currentDate) record.tasks = cloneTasks(state.tasks, targetDate);
    record.sessions.push(normalizeSession({
      minutes: workedMinutes,
      plannedMinutes: isStopwatchMode() ? workedMinutes : state.activeSessionMinutes,
      workedSeconds,
      completed: false,
      canceled: true,
      startedAt: state.sessionStartedAt ? new Date(state.sessionStartedAt).toISOString() : "",
      completedAt: new Date().toISOString(),
      rewardCoins: 0,
      rewardXp: 0,
      taskId: state.activeTaskId,
      taskTitle: state.activeTaskTitle || "Serbest çalışma",
      taskCategory: state.activeTaskCategory || "Genel",
      mode: state.workMode,
      sessionType: "focus"
    }));
  }
  clearInterval(timerInterval);
  timerInterval = null;
  resetSession({ phase: "focus" });
  saveState();
  renderAll();
  showToast(workedMinutes > 0 ? `${workedMinutes} dakika geçmişe kaydedildi; ödül verilmedi` : "Oturum iptal edildi");
}

async function showFocusNotification(minutes, xp, coins, recovered, nextPhase = "") {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const nextText = nextPhase ? ` ${phaseLabel(nextPhase)} hazır.` : "";
    const options = {
      body: `${minutes} dakikalık çalışma tamamlandı. +${xp} XP, +${coins} coin.${nextText}`,
      icon: "./icon-192.png", badge: "./icon-192.png", tag: "berna-focus-complete", renotify: true, data: { url: "./" }
    };
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(recovered ? "Berna · Çalışma tamamlandı" : "Odak tamamlandı!", options);
    } else new Notification("Odak tamamlandı!", options);
  } catch {}
}

async function showBreakNotification(label, recovered) {
  try {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const options = { body: `${label} bitti. Hazırsan yeniden odaklanabilirsin.`, icon: "./icon-192.png", badge: "./icon-192.png", tag: "berna-break-complete", renotify: true, data: { url: "./" } };
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(recovered ? "Berna · Mola tamamlandı" : "Mola bitti!", options);
    } else new Notification("Mola bitti!", options);
  } catch {}
}

function saveSettings() {
  if (hasSessionInProgress()) {
    showToast("Ayarları değiştirmeden önce mevcut oturumu tamamla veya iptal et");
    return;
  }
  const focus = Number(document.getElementById("focusMinutes").value);
  const shortBreak = Number(document.getElementById("shortBreakMinutes").value);
  const longBreak = Number(document.getElementById("longBreakMinutes").value);
  const every = Number(document.getElementById("longBreakEvery").value);
  if (!Number.isFinite(focus) || focus < 1 || focus > 180) return showToast("Odak süresi 1 ile 180 dakika arasında olmalı");
  if (!Number.isFinite(shortBreak) || shortBreak < 1 || shortBreak > 60) return showToast("Kısa mola 1 ile 60 dakika arasında olmalı");
  if (!Number.isFinite(longBreak) || longBreak < 1 || longBreak > 90) return showToast("Uzun mola 1 ile 90 dakika arasında olmalı");
  if (!Number.isFinite(every) || every < 2 || every > 10) return showToast("Uzun mola sıklığı 2 ile 10 odak arasında olmalı");

  state.focusMinutes = clampMinutes(focus);
  state.shortBreakMinutes = Math.round(shortBreak);
  state.longBreakMinutes = Math.round(longBreak);
  state.longBreakEvery = Math.round(every);
  state.breaksEnabled = document.getElementById("breaksEnabled").checked;
  state.autoStartBreaks = state.breaksEnabled && document.getElementById("autoStartBreaks").checked;
  state.autoStartFocus = state.breaksEnabled && document.getElementById("autoStartFocus").checked;
  state.soundEnabled = document.getElementById("soundEnabled").checked;
  preparePhase("focus");
  saveState();
  renderTimer();
  closeModal("settingsModal");
  showToast(`Odak ${state.focusMinutes} dk · kısa mola ${state.shortBreakMinutes} dk · uzun mola ${state.longBreakMinutes} dk`);
}

function calculateExamStudyMinutes(exam) {
  let total = 0;
  Object.values(state.history || {}).forEach(record => {
    const sessions = Array.isArray(record?.sessions) ? record.sessions : [];
    sessions.forEach(session => {
      if (session.sessionType === "break" || session.completed === false || session.canceled) return;
      if ((session.taskCategory || "Genel").localeCompare(exam.subject || "Genel", "tr", { sensitivity: "base" }) === 0) total += Number(session.minutes) || 0;
    });
  });
  return Math.round(total);
}

function examDaysRemaining(exam) {
  const date = parseDateKey(exam.date);
  const today = parseDateKey(getDateKey());
  return date && today ? Math.round((date.getTime() - today.getTime()) / 86400000) : Infinity;
}

function sortedExams() {
  return state.exams.slice().sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name, "tr"));
}

function nearestUpcomingExam() {
  return sortedExams().find(exam => examDaysRemaining(exam) >= 0) || null;
}

function renderExamCountdown() {
  const nameElement = document.getElementById("examNameDisplay");
  const dateElement = document.getElementById("examDateDisplay");
  const progressElement = document.getElementById("examProgressDisplay");
  const daysElement = document.getElementById("examDays");
  const unitElement = document.getElementById("examCountdownUnit");
  const averageElement = document.getElementById("examDailyAverage");
  const card = document.getElementById("examCountdownCard");
  const exam = nearestUpcomingExam();

  if (!exam) {
    nameElement.textContent = state.exams.length ? "Yaklaşan sınav yok" : "Sınavlarını ekle";
    dateElement.textContent = state.exams.length ? "Geçmiş sınavlarını yönetim ekranından görebilirsin." : "Birden fazla sınavı hedefleriyle birlikte takip edebilirsin.";
    progressElement.textContent = "Ders hedefi henüz ayarlanmadı.";
    daysElement.textContent = "—";
    unitElement.textContent = "gün";
    averageElement.textContent = state.exams.length ? `${state.exams.length} kayıtlı` : "Sınav ekle";
    card.classList.remove("exam-today", "exam-passed");
    card.style.setProperty("--exam-accent", "#f36b7f");
    return;
  }

  const days = examDaysRemaining(exam);
  const studied = calculateExamStudyMinutes(exam);
  const remaining = Math.max(0, exam.targetMinutes - studied);
  const daily = exam.targetMinutes > 0 ? Math.ceil(remaining / Math.max(1, days)) : 0;
  card.style.setProperty("--exam-accent", exam.color);
  card.classList.toggle("exam-today", days === 0);
  card.classList.remove("exam-passed");
  nameElement.textContent = exam.name;
  dateElement.textContent = `${exam.subject} · ${formatFullDate(exam.date)}`;
  progressElement.textContent = exam.targetMinutes > 0
    ? (remaining > 0 ? `${exam.targetMinutes} dk hedef · kalan ${remaining} dk için günde ${daily} dk çalışmalısın` : `${exam.targetMinutes} dk çalışma hedefi tamamlandı`)
    : `${studied} dk çalışıldı · hedef eklenmedi`;
  if (days > 0) {
    daysElement.textContent = String(days);
    unitElement.textContent = "gün kaldı";
    averageElement.textContent = exam.targetMinutes > 0 ? (remaining > 0 ? `Günde ${daily} dk` : "Hedef tamam") : "Hedef ekle";
  } else {
    daysElement.textContent = "Bugün";
    unitElement.textContent = "sınav günü";
    averageElement.textContent = remaining > 0 ? `${remaining} dk kaldı` : "Hazırsın";
  }
}

function resetExamForm() {
  document.getElementById("editingExamId").value = "";
  document.getElementById("examFormTitle").textContent = "Yeni sınav ekle";
  document.getElementById("examNameInput").value = "";
  document.getElementById("examSubjectInput").value = "";
  document.getElementById("examDateInput").min = getDateKey();
  document.getElementById("examDateInput").value = "";
  document.getElementById("examColorInput").value = "#f36b7f";
  document.getElementById("examTargetMinutesInput").value = "600";
  document.getElementById("saveExamButton").textContent = "Sınavı Kaydet";
}

function renderExamManager() {
  const exams = sortedExams();
  const container = document.getElementById("examList");
  document.getElementById("examCountBadge").textContent = `${exams.length} sınav`;
  if (!exams.length) {
    container.innerHTML = '<div class="exam-list-empty">Henüz sınav eklenmedi. Soldaki formdan ilk sınavını oluştur.</div>';
    return;
  }
  container.innerHTML = exams.map(exam => {
    const days = examDaysRemaining(exam);
    const studied = calculateExamStudyMinutes(exam);
    const percent = exam.targetMinutes ? Math.min(100, Math.round(studied / exam.targetMinutes * 100)) : 0;
    const remaining = Math.max(0, exam.targetMinutes - studied);
    const daily = exam.targetMinutes ? Math.ceil(remaining / Math.max(1, days)) : 0;
    const dayText = days > 0 ? `${days} gün kaldı` : days === 0 ? "Bugün" : `${Math.abs(days)} gün önce`;
    return `<article class="exam-list-card${days < 0 ? " exam-list-passed" : ""}" style="--exam-color:${exam.color}">
      <div class="exam-list-card-head"><span class="exam-color-dot"></span><div><strong>${escapeHtml(exam.name)}</strong><small>${escapeHtml(exam.subject)} · ${escapeHtml(formatFullDate(exam.date))}</small></div><b>${dayText}</b></div>
      <div class="exam-target-progress"><div><i style="width:${percent}%"></i></div><span>${studied} / ${exam.targetMinutes || "—"} dk</span></div>
      <p>${exam.targetMinutes ? (remaining ? `Hedefe ulaşmak için günde yaklaşık ${daily} dakika.` : "Çalışma hedefi tamamlandı.") : "Bu sınav için çalışma hedefi eklenmedi."}</p>
      <div class="exam-list-actions"><button type="button" data-exam-action="edit" data-exam-id="${escapeHtml(exam.id)}">Düzenle</button><button type="button" data-exam-action="delete" data-exam-id="${escapeHtml(exam.id)}">Sil</button></div>
    </article>`;
  }).join("");
}

function openExamSettings() {
  resetExamForm();
  renderCategoryDatalist();
  renderExamManager();
  openModal("examModal");
}

function editExam(examId) {
  const exam = state.exams.find(item => item.id === examId);
  if (!exam) return;
  document.getElementById("editingExamId").value = exam.id;
  document.getElementById("examFormTitle").textContent = "Sınavı düzenle";
  document.getElementById("examNameInput").value = exam.name;
  document.getElementById("examSubjectInput").value = exam.subject;
  document.getElementById("examDateInput").min = "";
  document.getElementById("examDateInput").value = exam.date;
  document.getElementById("examColorInput").value = exam.color;
  document.getElementById("examTargetMinutesInput").value = String(exam.targetMinutes || 0);
  document.getElementById("saveExamButton").textContent = "Değişiklikleri Kaydet";
  document.querySelector(".exam-form-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveExamCountdown() {
  const editingId = document.getElementById("editingExamId").value;
  const name = document.getElementById("examNameInput").value.trim();
  const subject = document.getElementById("examSubjectInput").value.trim();
  const date = document.getElementById("examDateInput").value;
  const color = document.getElementById("examColorInput").value;
  const targetMinutes = Number(document.getElementById("examTargetMinutesInput").value);
  if (!name) return showToast("Sınav adını yazmalısın");
  if (!subject) return showToast("Sınavın ders veya kategori adını yazmalısın");
  if (!parseDateKey(date)) return showToast("Geçerli bir sınav tarihi seçmelisin");
  if (!Number.isFinite(targetMinutes) || targetMinutes < 0 || targetMinutes > 50000) return showToast("Çalışma hedefi 0 ile 50.000 dakika arasında olmalı");

  const existing = state.exams.find(item => item.id === editingId);
  const exam = normalizeExam({
    ...(existing || {}), id: existing?.id || createId(), name, subject, date, color,
    targetMinutes, updatedAt: new Date().toISOString()
  });
  state.exams = state.exams.filter(item => item.id !== exam.id);
  state.exams.push(exam);
  state.examName = exam.name;
  state.examDate = exam.date;
  saveState();
  renderExamCountdown();
  renderExamManager();
  resetExamForm();
  showToast(existing ? "Sınav güncellendi" : "Sınav eklendi");
}

function clearExamCountdown() {
  resetExamForm();
  document.getElementById("examNameInput").focus();
}

function deleteExam(examId) {
  const exam = state.exams.find(item => item.id === examId);
  if (!exam || !window.confirm(`“${exam.name}” sınavı silinsin mi?`)) return;
  state.exams = state.exams.filter(item => item.id !== examId);
  saveState();
  renderExamCountdown();
  renderExamManager();
  if (document.getElementById("editingExamId").value === examId) resetExamForm();
  showToast("Sınav silindi");
}

function renderCategoryDatalist() {
  const categories = new Set(["Genel", "Psikoloji", "Staj", "Almanca", "Spor"]);
  state.tasks.forEach(task => categories.add(task.category));
  state.recurringTasks.forEach(task => categories.add(task.category));
  state.exams.forEach(exam => categories.add(exam.subject));
  Object.values(state.history).forEach(record => {
    (record.tasks || []).forEach(task => categories.add(task.category));
    (record.sessions || []).forEach(session => categories.add(session.taskCategory));
  });
  document.getElementById("categorySuggestions").innerHTML = [...categories].filter(Boolean).sort((a, b) => a.localeCompare(b, "tr")).map(category => `<option value="${escapeHtml(category)}"></option>`).join("");
}

function renderStats() {
  const xpInLevel = state.xp % 100;
  document.getElementById("topCoin").textContent = state.coins;
  document.getElementById("mikiXp").textContent = xpInLevel;
  document.getElementById("mikiLevel").textContent = state.level;
  document.getElementById("mikiProgress").style.width = `${xpInLevel}%`;
  document.getElementById("mikiStage").textContent = state.level >= 5 ? "Yetişkin" : state.level >= 3 ? "Genç" : "Yavru";
  document.getElementById("statLevel").textContent = state.level;
  document.getElementById("statXp").textContent = xpInLevel;
  document.getElementById("statCoin").textContent = state.coins;
  document.getElementById("statPomodoro").textContent = state.pomodoros;
  renderMikiFocusState();
}

function renderAll() {
  renderDate();
  renderExamCountdown();
  renderTasks();
  renderTimer();
  renderStats();
  renderShop();
  renderRoom();
  renderTodaySummary();
  document.getElementById("focusMinutes").value = String(state.focusMinutes);
  document.getElementById("shortBreakMinutes").value = String(state.shortBreakMinutes);
  document.getElementById("longBreakMinutes").value = String(state.longBreakMinutes);
  document.getElementById("longBreakEvery").value = String(state.longBreakEvery);
  document.getElementById("breaksEnabled").checked = state.breaksEnabled;
  document.getElementById("autoStartBreaks").checked = state.autoStartBreaks;
  document.getElementById("autoStartFocus").checked = state.autoStartFocus;
  document.getElementById("soundEnabled").checked = state.soundEnabled;
  document.getElementById("breakSettingsGrid").classList.toggle("settings-disabled", !state.breaksEnabled);
  document.getElementById("startDayButton").disabled = state.dayStarted;
  document.getElementById("startDayButton").style.opacity = state.dayStarted ? ".62" : "1";
}

// v7.6 controls
document.getElementById("workModeTabs").addEventListener("click", event => {
  const button = event.target.closest("[data-work-mode]");
  if (button) switchWorkMode(button.dataset.workMode);
});
document.getElementById("finishTimerButton").addEventListener("click", finishStopwatchSession);
document.getElementById("breaksEnabled").addEventListener("change", event => {
  document.getElementById("breakSettingsGrid").classList.toggle("settings-disabled", !event.target.checked);
});
document.getElementById("examList").addEventListener("click", event => {
  const button = event.target.closest("[data-exam-action]");
  if (!button) return;
  if (button.dataset.examAction === "edit") editExam(button.dataset.examId);
  if (button.dataset.examAction === "delete") deleteExam(button.dataset.examId);
});

function renderTodaySummary() {
  const record = ensureHistoryRecord(state, state.currentDate);
  const done = state.tasks.filter(task => task.done).length;
  document.getElementById("todayStudyMinutes").textContent = `${Math.round(Number(record.totalMinutes) || 0)} dk`;
  document.getElementById("todayStudyPomodoros").textContent = `${Math.round(Number(record.pomodoros) || 0)} oturum`;
  document.getElementById("todayStudyTasks").textContent = `${done} / ${state.tasks.length}`;
}


/* v7.7 daily and weekly study goals */
function getWeekStartKey(dateKey = getDateKey()) {
  const date = parseDateKey(dateKey) || new Date();
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return getDateKey(date);
}

function getWeekDateKeys(dateKey = getDateKey()) {
  const start = getWeekStartKey(dateKey);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

function completedFocusSessionsForDate(dateKey) {
  const record = state.history?.[dateKey];
  if (!record) return [];
  return (Array.isArray(record.sessions) ? record.sessions : []).filter(session =>
    session && session.sessionType !== "break" && session.completed !== false && !session.canceled
  );
}

function completedMinutesForDate(dateKey, subject = "") {
  const record = state.history?.[dateKey];
  if (!record) return 0;
  const sessions = completedFocusSessionsForDate(dateKey);
  if (sessions.length) {
    return Math.round(sessions.reduce((sum, session) => {
      if (subject && String(session.taskCategory || "Genel").localeCompare(subject, "tr", { sensitivity: "base" }) !== 0) return sum;
      return sum + (Number(session.minutes) || 0);
    }, 0));
  }
  return subject ? 0 : Math.round(Number(record.totalMinutes) || 0);
}

function completedPomodorosForDate(dateKey) {
  const record = state.history?.[dateKey];
  if (!record) return 0;
  const sessions = completedFocusSessionsForDate(dateKey);
  if (sessions.length) return sessions.filter(session => session.mode === "pomodoro").length;
  return Math.round(Number(record.pomodoros) || 0);
}

function weeklyCompletedMinutes(dateKey = getDateKey(), subject = "") {
  return getWeekDateKeys(dateKey).reduce((sum, key) => sum + completedMinutesForDate(key, subject), 0);
}

function studyGoalDefinitions() {
  const goals = state.studyGoals || normalizeStudyGoals(null, state.dailyGoalMinutes);
  const today = state.currentDate || getDateKey();
  const weekStart = getWeekStartKey(today);
  return [
    {
      id: "dailyMinutes", label: "Günlük çalışma hedefi", enabled: goals.dailyMinutes.enabled,
      target: goals.dailyMinutes.target, progress: completedMinutesForDate(today), unit: "dk",
      periodKey: today, rewardCoins: 3, rewardXp: 5
    },
    {
      id: "dailyPomodoros", label: "Günlük Pomodoro hedefi", enabled: goals.dailyPomodoros.enabled,
      target: goals.dailyPomodoros.target, progress: completedPomodorosForDate(today), unit: "Pomodoro",
      periodKey: today, rewardCoins: 2, rewardXp: 3
    },
    {
      id: "weeklyMinutes", label: "Haftalık çalışma hedefi", enabled: goals.weeklyMinutes.enabled,
      target: goals.weeklyMinutes.target, progress: weeklyCompletedMinutes(today), unit: "dk",
      periodKey: weekStart, rewardCoins: 8, rewardXp: 12
    },
    {
      id: "subjectWeekly", label: goals.subjectWeekly.subject ? `${goals.subjectWeekly.subject} haftalık hedefi` : "Derse özel haftalık hedef",
      enabled: goals.subjectWeekly.enabled && Boolean(goals.subjectWeekly.subject),
      target: goals.subjectWeekly.target, progress: weeklyCompletedMinutes(today, goals.subjectWeekly.subject), unit: "dk",
      periodKey: `${weekStart}:${goals.subjectWeekly.subject.toLocaleLowerCase("tr-TR")}`, rewardCoins: 6, rewardXp: 10,
      subject: goals.subjectWeekly.subject
    }
  ];
}

function goalClaimKey(goal) {
  return `${goal.id}:${goal.periodKey}`;
}

function checkStudyGoalCompletions() {
  const completed = [];
  state.goalRewardClaims = normalizeGoalRewardClaims(state.goalRewardClaims);
  studyGoalDefinitions().forEach(goal => {
    if (!goal.enabled || goal.progress < goal.target) return;
    const key = goalClaimKey(goal);
    if (state.goalRewardClaims[key]) return;
    state.goalRewardClaims[key] = new Date().toISOString();
    state.coins += goal.rewardCoins;
    state.xp += goal.rewardXp;
    completed.push(goal);
  });
  if (completed.length) state.level = Math.floor(state.xp / 100) + 1;
  return completed;
}

function percentOf(progress, target) {
  return Math.min(100, Math.max(0, target ? Math.round(progress / target * 100) : 0));
}

function renderStudyGoalCard() {
  const definitions = studyGoalDefinitions();
  const enabled = definitions.filter(goal => goal.enabled);
  const primary = enabled.find(goal => goal.progress < goal.target) || enabled[0];
  const headline = document.getElementById("goalHeadline");
  const progressBar = document.getElementById("goalProgressBar");
  const progressText = document.getElementById("goalProgressText");
  const secondaryText = document.getElementById("goalSecondaryText");
  const card = document.getElementById("studyGoalCard");
  if (!headline || !progressBar || !progressText || !secondaryText || !card) return;

  if (!primary) {
    headline.textContent = "Hedeflerini aç; Miki seninle birlikte küçük adımları kutlasın.";
    progressBar.style.width = "0%";
    progressText.textContent = "Aktif hedef yok";
    secondaryText.textContent = "Düzenle ile hedef ekle";
    card.classList.remove("goal-complete");
    return;
  }

  const dailyMinutes = definitions.find(goal => goal.id === "dailyMinutes");
  const dailyPomodoros = definitions.find(goal => goal.id === "dailyPomodoros");
  const weekly = definitions.find(goal => goal.id === "weeklyMinutes");
  const dailyParts = [];
  if (dailyMinutes?.enabled) dailyParts.push(`${dailyMinutes.progress}/${dailyMinutes.target} dk`);
  if (dailyPomodoros?.enabled) dailyParts.push(`${dailyPomodoros.progress}/${dailyPomodoros.target} Pomodoro`);
  headline.textContent = dailyParts.length ? `Bugün ${dailyParts.join(" · ")}` : primary.label;
  progressBar.style.width = `${percentOf(primary.progress, primary.target)}%`;
  progressText.textContent = `${primary.label}: ${Math.min(primary.progress, primary.target)} / ${primary.target} ${primary.unit}`;
  secondaryText.textContent = weekly?.enabled ? `Bu hafta ${weekly.progress} / ${weekly.target} dk` : "Haftalık hedef kapalı";
  card.classList.toggle("goal-complete", enabled.every(goal => goal.progress >= goal.target));
}

function setGoalBar(id, statusId, progress, target, unit) {
  const bar = document.getElementById(id);
  const status = document.getElementById(statusId);
  if (bar) bar.style.width = `${percentOf(progress, target)}%`;
  if (status) status.textContent = `${progress} / ${target} ${unit}`;
}

function renderGoalSettingsPreview() {
  const today = state.currentDate || getDateKey();
  const dailyMinutesTarget = Math.min(600, Math.max(10, Math.round(Number(document.getElementById("dailyGoalMinutes")?.value) || 50)));
  const dailyPomodoroTarget = Math.min(20, Math.max(1, Math.round(Number(document.getElementById("dailyPomodoroGoalTarget")?.value) || 2)));
  const weeklyTarget = Math.min(5000, Math.max(30, Math.round(Number(document.getElementById("weeklyMinutesGoalTarget")?.value) || 300)));
  const subjectTarget = Math.min(5000, Math.max(30, Math.round(Number(document.getElementById("subjectWeeklyGoalTarget")?.value) || 200)));
  const subject = String(document.getElementById("subjectGoalCategory")?.value || "").trim();
  setGoalBar("dailyMinutesGoalBar", "dailyMinutesGoalStatus", completedMinutesForDate(today), dailyMinutesTarget, "dk");
  setGoalBar("dailyPomodoroGoalBar", "dailyPomodoroGoalStatus", completedPomodorosForDate(today), dailyPomodoroTarget, "Pomodoro");
  setGoalBar("weeklyMinutesGoalBar", "weeklyMinutesGoalStatus", weeklyCompletedMinutes(today), weeklyTarget, "dk");
  if (subject) setGoalBar("subjectWeeklyGoalBar", "subjectWeeklyGoalStatus", weeklyCompletedMinutes(today, subject), subjectTarget, "dk");
  else {
    const bar = document.getElementById("subjectWeeklyGoalBar");
    if (bar) bar.style.width = "0%";
    const status = document.getElementById("subjectWeeklyGoalStatus");
    if (status) status.textContent = "Ders seçilmedi";
  }
  document.querySelectorAll(".goal-option-card").forEach(card => {
    const checkbox = card.querySelector('input[type="checkbox"]');
    card.classList.toggle("goal-disabled", checkbox && !checkbox.checked);
  });
}

function openGoalSettings() {
  renderCategoryDatalist();
  const goals = state.studyGoals || normalizeStudyGoals(null, state.dailyGoalMinutes);
  document.getElementById("dailyMinutesGoalEnabled").checked = goals.dailyMinutes.enabled;
  document.getElementById("dailyGoalMinutes").value = String(goals.dailyMinutes.target);
  document.getElementById("dailyPomodoroGoalEnabled").checked = goals.dailyPomodoros.enabled;
  document.getElementById("dailyPomodoroGoalTarget").value = String(goals.dailyPomodoros.target);
  document.getElementById("weeklyMinutesGoalEnabled").checked = goals.weeklyMinutes.enabled;
  document.getElementById("weeklyMinutesGoalTarget").value = String(goals.weeklyMinutes.target);
  document.getElementById("subjectWeeklyGoalEnabled").checked = goals.subjectWeekly.enabled;
  document.getElementById("subjectGoalCategory").value = goals.subjectWeekly.subject;
  document.getElementById("subjectWeeklyGoalTarget").value = String(goals.subjectWeekly.target);
  renderGoalSettingsPreview();
  openModal("goalModal");
}

function saveStudyGoals() {
  const subject = document.getElementById("subjectGoalCategory").value.trim().slice(0, 28);
  const subjectEnabled = document.getElementById("subjectWeeklyGoalEnabled").checked;
  if (subjectEnabled && !subject) {
    showToast("Derse özel hedef için ders veya kategori seçmelisin");
    document.getElementById("subjectGoalCategory").focus();
    return;
  }
  state.studyGoals = normalizeStudyGoals({
    dailyMinutes: { enabled: document.getElementById("dailyMinutesGoalEnabled").checked, target: document.getElementById("dailyGoalMinutes").value },
    dailyPomodoros: { enabled: document.getElementById("dailyPomodoroGoalEnabled").checked, target: document.getElementById("dailyPomodoroGoalTarget").value },
    weeklyMinutes: { enabled: document.getElementById("weeklyMinutesGoalEnabled").checked, target: document.getElementById("weeklyMinutesGoalTarget").value },
    subjectWeekly: { enabled: subjectEnabled, subject, target: document.getElementById("subjectWeeklyGoalTarget").value }
  }, state.dailyGoalMinutes);
  state.dailyGoalMinutes = state.studyGoals.dailyMinutes.target;
  saveState();
  renderStudyGoalCard();
  renderHistory();
  closeModal("goalModal");
  showToast("Günlük ve haftalık hedefler kaydedildi");
}

function celebrateStudyGoals(goals) {
  if (!goals.length) return;
  const card = document.getElementById("mikiCard");
  const roomMiki = document.querySelector(".room-miki-wrap");
  const activity = document.getElementById("mikiActivity");
  card?.classList.add("miki-goal-celebration");
  roomMiki?.classList.add("miki-room-celebration");
  if (activity) activity.textContent = goals.length > 1 ? `${goals.length} hedef tamamlandı!` : "Hedef tamamlandı!";
  const totalXp = goals.reduce((sum, goal) => sum + goal.rewardXp, 0);
  const totalCoins = goals.reduce((sum, goal) => sum + goal.rewardCoins, 0);
  const names = goals.map(goal => goal.label).join(" ve ");
  showToast(`${names}: +${totalXp} XP, +${totalCoins} coin`);
  showRoomStatus("Miki hedefini seninle kutluyor! ✨");
  if (state.soundEnabled) playCompletionSound();
  clearTimeout(celebrateStudyGoals.timeout);
  celebrateStudyGoals.timeout = setTimeout(() => {
    card?.classList.remove("miki-goal-celebration");
    roomMiki?.classList.remove("miki-room-celebration");
    renderMikiFocusState();
  }, 4200);
}

const completeFocusSessionV76 = completeFocusSession;
completeFocusSession = function completeFocusSessionWithGoals(options = {}) {
  completeFocusSessionV76(options);
  const completedGoals = checkStudyGoalCompletions();
  if (!completedGoals.length) {
    renderStudyGoalCard();
    return;
  }
  saveState();
  renderStats();
  renderStudyGoalCard();
  renderTodaySummary();
  celebrateStudyGoals(completedGoals);
};

const renderAllV76 = renderAll;
renderAll = function renderAllV77() {
  renderAllV76();
  renderStudyGoalCard();
};

const renderCategoryDatalistV76 = renderCategoryDatalist;
renderCategoryDatalist = function renderCategoryDatalistV77() {
  renderCategoryDatalistV76();
  const subject = state.studyGoals?.subjectWeekly?.subject;
  if (!subject) return;
  const list = document.getElementById("categorySuggestions");
  if (list && ![...list.options].some(option => option.value === subject)) list.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(subject)}"></option>`);
};

document.getElementById("goalSettingsButton").addEventListener("click", openGoalSettings);
document.getElementById("historyGoalButton").addEventListener("click", openGoalSettings);
document.getElementById("saveStudyGoalsButton").addEventListener("click", saveStudyGoals);
["dailyMinutesGoalEnabled", "dailyPomodoroGoalEnabled", "weeklyMinutesGoalEnabled", "subjectWeeklyGoalEnabled", "dailyPomodoroGoalTarget", "weeklyMinutesGoalTarget", "subjectWeeklyGoalTarget", "subjectGoalCategory"].forEach(id => {
  document.getElementById(id).addEventListener("input", renderGoalSettingsPreview);
  document.getElementById(id).addEventListener("change", renderGoalSettingsPreview);
});

renderStudyGoalCard();


/* v7.8 living Miki, gentle streaks and procedural ambient sounds */
const AMBIENT_OPTIONS = Object.freeze([
  { id: "off", label: "Kapalı", icon: "○", description: "Sessiz odak" },
  { id: "rain", label: "Yağmur", icon: "☂", description: "Yumuşak sürekli yağmur" },
  { id: "fireplace", label: "Şömine", icon: "♨", description: "Sıcak çıtırtılar" },
  { id: "cafe", label: "Kafe", icon: "☕", description: "Uzak ve yumuşak kafe uğultusu" },
  { id: "library", label: "Kütüphane", icon: "▤", description: "Sessiz sayfa ve oda sesi" },
  { id: "insects", label: "Gece Böcekleri", icon: "✦", description: "Geceye uygun hafif cırcır sesi" },
  { id: "window-rain", label: "Pencere Yağmuru", icon: "▥", description: "Cama vuran damlalar" },
  { id: "white-noise", label: "Beyaz Gürültü", icon: "≈", description: "Dengeli sabit gürültü" }
]);
const AMBIENT_IDS = new Set(AMBIENT_OPTIONS.map(option => option.id));
const MIKI_STAGE_CLASSES = ["miki-stage-kitten", "miki-stage-young", "miki-stage-adult", "miki-stage-mentor"];
const MIKI_ACTIVITY_CLASSES = [
  "miki-at-desk", "miki-sleeping-bed", "miki-sleeping-floor", "miki-playing",
  "miki-by-window", "miki-wandering", "miki-waiting", "miki-celebrating"
];

function parseSafeDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function inferLastStudyAt() {
  let latest = null;
  Object.values(state.history || {}).forEach(record => {
    (Array.isArray(record?.sessions) ? record.sessions : []).forEach(session => {
      if (!session || session.sessionType === "break" || session.completed === false || session.canceled) return;
      const date = parseSafeDate(session.completedAt || session.startedAt);
      if (date && (!latest || date > latest)) latest = date;
    });
  });
  return latest ? latest.toISOString() : null;
}

const mikiPreviousOpenAt = parseSafeDate(state.lastInteractionAt || state.lastSavedAt);
const mikiAbsenceHoursAtLoad = mikiPreviousOpenAt ? Math.max(0, (Date.now() - mikiPreviousOpenAt.getTime()) / 3600000) : 0;
if (!state.lastStudyAt) state.lastStudyAt = inferLastStudyAt();
state.lastInteractionAt = new Date().toISOString();
saveState({ autoBackup: false });

function getMikiStageData(level = state.level) {
  if (level >= 10) return { key: "mentor", className: "miki-stage-mentor", label: "Usta Miki", trait: "Sakin ve bilge" };
  if (level >= 6) return { key: "adult", className: "miki-stage-adult", label: "Yetişkin", trait: "Kendinden emin" };
  if (level >= 3) return { key: "young", className: "miki-stage-young", label: "Genç", trait: "Meraklı kaşif" };
  return { key: "kitten", className: "miki-stage-kitten", label: "Yavru", trait: "Minik yol arkadaşı" };
}

function renderMikiEvolution() {
  const stage = getMikiStageData();
  const card = document.getElementById("mikiCard");
  const roomMiki = document.querySelector(".room-miki-wrap");
  const motion = document.querySelector(".miki-motion-wrap");
  [card, roomMiki, motion].forEach(element => {
    if (!element) return;
    element.classList.remove(...MIKI_STAGE_CLASSES);
    element.classList.add(stage.className);
    element.dataset.mikiStage = stage.key;
  });
  const stageLabel = document.getElementById("mikiStage");
  if (stageLabel) stageLabel.textContent = stage.label;
  const trait = document.getElementById("mikiTrait");
  if (trait) trait.textContent = stage.trait;
}

function mikiSupportiveMessage() {
  const lastStudy = parseSafeDate(state.lastStudyAt);
  const hours = lastStudy ? Math.max(0, (Date.now() - lastStudy.getTime()) / 3600000) : Infinity;
  if (mikiAbsenceHoursAtLoad >= 72) return "Seni görmek güzel. Hazır olduğunda birlikte küçücük bir adım atarız.";
  if (hours >= 48) return "Buradayım. Bugün 10–15 dakika bile güzel bir başlangıç olur.";
  if (hours >= 12) return "Biraz dinlendik. Hazır olduğunda yanındayım.";
  return "Beraber ilerliyoruz; acele etmene gerek yok.";
}

let currentMikiIdleMode = "waiting";
let mikiIdleTimer = null;
let mikiCelebrationUntil = 0;
let lastMikiRenderedMode = "";

function getIdleMikiOptions() {
  const options = ["wandering", "window"];
  if (state.equippedItems?.toy) options.push("playing", "playing");
  if (state.equippedItems?.bed) options.push("sleeping-bed");
  return options;
}

function chooseMikiIdleMode() {
  const lastInteraction = parseSafeDate(state.lastInteractionAt);
  const inactiveMinutes = lastInteraction ? (Date.now() - lastInteraction.getTime()) / 60000 : 0;
  const hour = new Date().getHours();
  if (inactiveMinutes >= 30 || hour >= 23 || hour < 7) return state.equippedItems?.bed ? "sleeping-bed" : "sleeping-floor";
  const options = getIdleMikiOptions();
  return options[Math.floor(Math.random() * options.length)] || "waiting";
}

function clearMikiActivityClasses() {
  const roomMiki = document.querySelector(".room-miki-wrap");
  const card = document.getElementById("mikiCard");
  roomMiki?.classList.remove(...MIKI_ACTIVITY_CLASSES, "miki-room-resting");
  card?.classList.remove("miki-working", "miki-short-break", "miki-long-break", "miki-resting", "miki-idle-sleep", "miki-idle-play", "miki-idle-window", "miki-idle-walk");
}

function applyMikiActivity(mode, message) {
  clearMikiActivityClasses();
  const roomMiki = document.querySelector(".room-miki-wrap");
  const card = document.getElementById("mikiCard");
  const activity = document.getElementById("mikiActivity");
  const bubble = document.getElementById("roomMikiBubble");
  const desk = document.getElementById("roomFocusDesk");
  const normalizedMode = mode || "waiting";
  roomMiki?.classList.add(`miki-${normalizedMode}`);
  if (desk) desk.classList.toggle("active", normalizedMode === "at-desk");
  if (card) {
    if (normalizedMode === "at-desk") card.classList.add("miki-working");
    else if (normalizedMode.startsWith("sleeping")) card.classList.add("miki-idle-sleep");
    else if (normalizedMode === "playing") card.classList.add("miki-idle-play");
    else if (normalizedMode === "by-window") card.classList.add("miki-idle-window");
    else if (normalizedMode === "wandering") card.classList.add("miki-idle-walk");
    else card.classList.add("miki-resting");
  }
  if (activity) activity.textContent = message;
  if (bubble) {
    bubble.textContent = message;
    if (message && normalizedMode !== lastMikiRenderedMode) {
      bubble.classList.add("show");
      clearTimeout(applyMikiActivity.bubbleTimeout);
      applyMikiActivity.bubbleTimeout = setTimeout(() => bubble.classList.remove("show"), 4600);
    }
  }
  lastMikiRenderedMode = normalizedMode;
}

function renderLivingMiki() {
  renderMikiEvolution();
  if (Date.now() < mikiCelebrationUntil) {
    applyMikiActivity("celebrating", "Başardın! Birlikte güzel ilerledik ✨");
    document.querySelector(".room-miki-wrap")?.classList.add("miki-room-celebration");
    return;
  }
  if (isBreakPhase()) {
    if (state.timerPhase === "longBreak") {
      applyMikiActivity(state.equippedItems?.bed ? "sleeping-bed" : "sleeping-floor", "Uzun molada huzurla dinleniyor");
      document.getElementById("mikiCard")?.classList.add("miki-long-break");
    } else {
      const mode = state.equippedItems?.toy ? "playing" : "by-window";
      applyMikiActivity(mode, state.equippedItems?.toy ? "Kısa molada oyuncağıyla oynuyor" : "Kısa molada pencereden dışarı bakıyor");
      document.getElementById("mikiCard")?.classList.add("miki-short-break");
    }
    return;
  }
  if (state.timerRunning) {
    applyMikiActivity("at-desk", isStopwatchMode() ? "Masada seninle süre tutuyor" : "Masada seninle odaklanıyor");
    return;
  }
  if (hasSessionInProgress()) {
    applyMikiActivity("waiting", "Yanında sessizce bekliyor");
    return;
  }
  const mode = currentMikiIdleMode || chooseMikiIdleMode();
  if (mode === "sleeping-bed") applyMikiActivity("sleeping-bed", "Satın aldığın yatağında uyuyor");
  else if (mode === "sleeping-floor") applyMikiActivity("sleeping-floor", "Sakin bir köşede uyukluyor");
  else if (mode === "playing") applyMikiActivity("playing", "Oyuncağıyla keyifle oynuyor");
  else if (mode === "window") applyMikiActivity("by-window", "Pencerenin önünde dünyayı izliyor");
  else if (mode === "wandering") applyMikiActivity("wandering", "Odasında merakla dolaşıyor");
  else applyMikiActivity("waiting", mikiSupportiveMessage());
}

function scheduleMikiIdleCycle() {
  clearInterval(mikiIdleTimer);
  mikiIdleTimer = setInterval(() => {
    if (state.timerRunning || hasSessionInProgress() || isBreakPhase() || Date.now() < mikiCelebrationUntil) return;
    currentMikiIdleMode = chooseMikiIdleMode();
    renderLivingMiki();
  }, 17000);
}

function celebrateMikiAfterSession() {
  mikiCelebrationUntil = Date.now() + 4300;
  renderLivingMiki();
  clearTimeout(celebrateMikiAfterSession.timeout);
  celebrateMikiAfterSession.timeout = setTimeout(() => {
    document.querySelector(".room-miki-wrap")?.classList.remove("miki-room-celebration");
    currentMikiIdleMode = state.equippedItems?.toy ? "playing" : "window";
    renderLivingMiki();
  }, 4400);
}

function isRestDay(dateKey) {
  return state.streakRestDays.includes(dateKey);
}

function weekRestDays(dateKey = getDateKey()) {
  const keys = new Set(getWeekDateKeys(dateKey));
  return state.streakRestDays.filter(key => keys.has(key));
}

function calculateGentleStreak() {
  const threshold = state.streakMinimumMinutes;
  const today = getDateKey();
  let cursor = today;
  let current = 0;
  let recentGrace = 2;
  let reachedProtectedHistory = false;
  let scanned = 0;
  while (scanned < 730) {
    const studied = completedMinutesForDate(cursor) >= threshold;
    const rested = isRestDay(cursor);
    if (studied) {
      current += 1;
      reachedProtectedHistory = true;
    } else if (rested) {
      reachedProtectedHistory = true;
    } else if (!reachedProtectedHistory && recentGrace > 0) {
      recentGrace -= 1;
    } else break;
    cursor = addDays(cursor, -1);
    scanned += 1;
  }

  const historyKeys = Object.keys(state.history || {}).filter(parseDateKey);
  const restKeys = state.streakRestDays.filter(parseDateKey);
  const earliest = [...historyKeys, ...restKeys, today].sort()[0] || today;
  let longest = 0;
  let running = 0;
  cursor = earliest;
  scanned = 0;
  while (cursor <= today && scanned < 1200) {
    if (completedMinutesForDate(cursor) >= threshold) {
      running += 1;
      longest = Math.max(longest, running);
    } else if (!isRestDay(cursor)) running = 0;
    cursor = addDays(cursor, 1);
    scanned += 1;
  }

  const todayMinutes = completedMinutesForDate(today);
  const todayQualified = todayMinutes >= threshold;
  const todayRest = isRestDay(today);
  const usedThisWeek = weekRestDays(today).length;
  let status = `${threshold - Math.min(threshold, todayMinutes)} dakika daha çalışırsan seri günün tamamlanır.`;
  if (todayQualified) status = "Bugünkü küçük adımın seriyi devam ettirdi. Harika gidiyorsun.";
  else if (todayRest) status = "Bugün dinlenme günü. Serin güvende; gönül rahatlığıyla dinlen.";
  else if (current > 0) status = `Serin güvende. Hazır olduğunda ${threshold} dakikalık yumuşak bir dönüş yeterli.`;
  else status = `Yeni bir seri için yalnızca ${threshold} dakika yeterli. Geçmiş başarın kaybolmadı.`;
  return { current, longest: Math.max(longest, current), threshold, todayMinutes, todayQualified, todayRest, usedThisWeek, status };
}

function renderStreakPanel() {
  const panel = document.getElementById("streakPanel");
  if (!panel) return;
  const streak = calculateGentleStreak();
  document.getElementById("streakCurrent").textContent = `${streak.current} gün`;
  document.getElementById("streakLongest").textContent = `${streak.longest} gün`;
  document.getElementById("streakStatus").textContent = streak.status;
  const progress = document.getElementById("streakTodayProgress");
  progress.style.width = `${Math.min(100, Math.round(streak.todayMinutes / streak.threshold * 100))}%`;
  document.getElementById("streakTodayText").textContent = `${streak.todayMinutes} / ${streak.threshold} dk`;
  const selector = document.getElementById("streakMinimumSelect");
  selector.value = String(streak.threshold);
  const restButton = document.getElementById("restDayButton");
  if (streak.todayQualified) {
    restButton.disabled = true;
    restButton.textContent = "Bugün çalışma günü ✓";
  } else if (streak.todayRest) {
    restButton.disabled = false;
    restButton.textContent = "Dinlenme gününü geri al";
  } else if (streak.usedThisWeek >= 1) {
    restButton.disabled = true;
    restButton.textContent = "Bu haftanın dinlenme günü kullanıldı";
  } else {
    restButton.disabled = false;
    restButton.textContent = "Bugünü dinlenme günü yap";
  }
  document.getElementById("restDayAvailability").textContent = streak.usedThisWeek ? "Bu hafta 0 dinlenme günü kaldı" : "Bu hafta 1 dinlenme günü hakkın var";
  const historyStreak = document.getElementById("currentStreak");
  if (historyStreak) historyStreak.textContent = `${streak.current} gün`;
}

function toggleTodayRestDay() {
  const today = getDateKey();
  if (completedMinutesForDate(today) >= state.streakMinimumMinutes) return showToast("Bugün zaten seri için yeterli çalıştın");
  const index = state.streakRestDays.indexOf(today);
  if (index >= 0) {
    state.streakRestDays.splice(index, 1);
    showToast("Dinlenme günü işareti kaldırıldı");
  } else {
    if (weekRestDays(today).length >= 1) return showToast("Bu hafta bir dinlenme günü kullandın");
    state.streakRestDays.push(today);
    state.streakRestDays.sort();
    showToast("Bugün dinlenme günü olarak işaretlendi. Serin güvende ♥");
    showRoomStatus("Miki de bugün seninle dinleniyor 🌿");
  }
  saveState();
  renderStreakPanel();
  currentMikiIdleMode = state.equippedItems?.bed ? "sleeping-bed" : "sleeping-floor";
  renderLivingMiki();
}

function changeStreakMinimum() {
  state.streakMinimumMinutes = Number(document.getElementById("streakMinimumSelect").value) === 10 ? 10 : 15;
  saveState();
  renderStreakPanel();
  showToast(`Seri hedefi günde ${state.streakMinimumMinutes} dakika oldu`);
}

class BernaAmbientEngine {
  constructor() {
    this.context = null;
    this.master = null;
    this.nodes = [];
    this.intervals = [];
    this.playing = false;
    this.soundId = "off";
  }
  async ensureContext() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) throw new Error("Tarayıcın ortam seslerini desteklemiyor");
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = state.ambientVolume / 100 * 0.55;
      this.master.connect(this.context.destination);
    }
    if (this.context.state === "suspended") await this.context.resume();
  }
  createNoise(kind = "white", seconds = 3) {
    const length = Math.floor(this.context.sampleRate * seconds);
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      if (kind === "brown") {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      } else if (kind === "pink") {
        last = last * 0.97 + white * 0.03;
        data[i] = last * 2.2;
      } else data[i] = white;
    }
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }
  addNoise({ kind = "white", type = "lowpass", frequency = 2000, gain = 0.15, q = 0.7 } = {}) {
    const source = this.createNoise(kind);
    const filter = this.context.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = q;
    const gainNode = this.context.createGain();
    gainNode.gain.value = gain;
    source.connect(filter).connect(gainNode).connect(this.master);
    source.start();
    this.nodes.push(source, filter, gainNode);
    return gainNode;
  }
  addTone(frequency, gainValue = 0.01, type = "sine") {
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = gainValue;
    oscillator.connect(gain).connect(this.master);
    oscillator.start();
    this.nodes.push(oscillator, gain);
  }
  schedule(fn, minMs, maxMs) {
    const tick = () => {
      if (!this.playing) return;
      fn();
      const id = setTimeout(tick, minMs + Math.random() * (maxMs - minMs));
      this.intervals.push(id);
    };
    const id = setTimeout(tick, minMs);
    this.intervals.push(id);
  }
  burst({ frequency = 1800, duration = 0.08, gain = 0.025, type = "sine" } = {}) {
    if (!this.context || !this.playing) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    oscillator.connect(gainNode).connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }
  build(soundId) {
    if (soundId === "rain") {
      const rain = this.addNoise({ kind: "pink", type: "highpass", frequency: 650, gain: 0.22 });
      const lfo = this.context.createOscillator();
      const lfoGain = this.context.createGain();
      lfo.frequency.value = 0.08;
      lfoGain.gain.value = 0.035;
      lfo.connect(lfoGain).connect(rain.gain);
      lfo.start();
      this.nodes.push(lfo, lfoGain);
    } else if (soundId === "window-rain") {
      this.addNoise({ kind: "pink", type: "highpass", frequency: 900, gain: 0.18 });
      this.addNoise({ kind: "brown", type: "lowpass", frequency: 700, gain: 0.055 });
      this.schedule(() => this.burst({ frequency: 900 + Math.random() * 1900, duration: 0.035 + Math.random() * 0.09, gain: 0.012 + Math.random() * 0.025 }), 180, 850);
    } else if (soundId === "fireplace") {
      this.addNoise({ kind: "brown", type: "lowpass", frequency: 900, gain: 0.14 });
      this.schedule(() => this.burst({ frequency: 120 + Math.random() * 550, duration: 0.025 + Math.random() * 0.08, gain: 0.025 + Math.random() * 0.04, type: "triangle" }), 260, 1300);
    } else if (soundId === "cafe") {
      this.addNoise({ kind: "pink", type: "bandpass", frequency: 750, gain: 0.12, q: 0.55 });
      this.addNoise({ kind: "brown", type: "lowpass", frequency: 300, gain: 0.065 });
      this.addTone(118, 0.006, "sine");
      this.addTone(163, 0.004, "sine");
      this.schedule(() => this.burst({ frequency: 1700 + Math.random() * 1200, duration: 0.035, gain: 0.012 }), 3500, 9500);
    } else if (soundId === "library") {
      this.addNoise({ kind: "brown", type: "lowpass", frequency: 550, gain: 0.055 });
      this.addNoise({ kind: "pink", type: "bandpass", frequency: 1500, gain: 0.018, q: 1.1 });
      this.schedule(() => this.burst({ frequency: 600 + Math.random() * 650, duration: 0.12, gain: 0.007, type: "triangle" }), 7000, 16000);
    } else if (soundId === "insects") {
      this.addNoise({ kind: "brown", type: "lowpass", frequency: 450, gain: 0.045 });
      this.schedule(() => {
        const base = 3200 + Math.random() * 1700;
        this.burst({ frequency: base, duration: 0.07, gain: 0.015, type: "square" });
        setTimeout(() => this.burst({ frequency: base * 1.03, duration: 0.06, gain: 0.012, type: "square" }), 95);
      }, 550, 2200);
    } else if (soundId === "white-noise") {
      this.addNoise({ kind: "white", type: "lowpass", frequency: 9000, gain: 0.13 });
    }
  }
  async start(soundId) {
    this.stop(false);
    if (soundId === "off") return;
    await this.ensureContext();
    this.playing = true;
    this.soundId = soundId;
    this.build(soundId);
  }
  stop(updateUi = true) {
    this.playing = false;
    this.nodes.forEach(node => { try { if (typeof node.stop === "function") node.stop(); } catch {} try { node.disconnect(); } catch {} });
    this.nodes = [];
    this.intervals.forEach(id => clearTimeout(id));
    this.intervals = [];
    this.soundId = "off";
    if (updateUi) renderAmbientUi();
  }
  setVolume(value) {
    if (!this.master || !this.context) return;
    const target = Math.min(1, Math.max(0, value / 100 * 0.55));
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.linearRampToValueAtTime(target, this.context.currentTime + 0.08);
  }
}

const ambientEngine = new BernaAmbientEngine();

function ambientOption(soundId = state.ambientSound) {
  return AMBIENT_OPTIONS.find(option => option.id === soundId) || AMBIENT_OPTIONS[0];
}

function renderAmbientUi() {
  const list = document.getElementById("ambientSoundGrid");
  if (list) {
    list.innerHTML = AMBIENT_OPTIONS.map(option => `
      <button type="button" class="ambient-option ${state.ambientSound === option.id ? "selected" : ""} ${ambientEngine.playing && ambientEngine.soundId === option.id ? "playing" : ""}" data-ambient-id="${option.id}">
        <span><img src="./sound-pixel.png" alt=""></span><strong>${escapeHtml(option.label)}</strong><small>${escapeHtml(option.description)}</small>
      </button>`).join("");
    list.querySelectorAll("[data-ambient-id]").forEach(button => button.addEventListener("click", () => selectAmbientSound(button.dataset.ambientId)));
  }
  const selected = ambientOption();
  const now = document.getElementById("ambientNow");
  if (now) now.textContent = ambientEngine.playing ? `${selected.label} çalıyor` : (state.ambientSound === "off" ? "Ortam sesi kapalı" : `${selected.label} seçili · oynatılmıyor`);
  const toggle = document.getElementById("ambientToggleButton");
  if (toggle) toggle.textContent = ambientEngine.playing ? "Ⅱ Durdur" : "▶ Oynat";
  const button = document.getElementById("ambientButton");
  button?.classList.toggle("active", ambientEngine.playing);
  button?.setAttribute("aria-label", ambientEngine.playing ? `${selected.label} ortam sesini yönet` : "Ortam sesleri");
  const volume = document.getElementById("ambientVolume");
  if (volume) volume.value = String(state.ambientVolume);
  const value = document.getElementById("ambientVolumeValue");
  if (value) value.textContent = `%${state.ambientVolume}`;
  renderAmbientRoomEffect();
}

async function selectAmbientSound(soundId) {
  if (!AMBIENT_IDS.has(soundId)) return;
  state.ambientSound = soundId;
  saveState();
  if (soundId === "off") ambientEngine.stop();
  else {
    try {
      await ambientEngine.start(soundId);
      showToast(`${ambientOption(soundId).label} ortam sesi başladı`);
    } catch (error) {
      showToast(error.message || "Ortam sesi başlatılamadı");
    }
  }
  renderAmbientUi();
}

async function toggleAmbientPlayback() {
  if (ambientEngine.playing) {
    ambientEngine.stop();
    showToast("Ortam sesi durduruldu");
    return;
  }
  if (state.ambientSound === "off") state.ambientSound = "rain";
  try {
    await ambientEngine.start(state.ambientSound);
    saveState();
    showToast(`${ambientOption().label} ortam sesi başladı`);
  } catch (error) {
    showToast(error.message || "Ortam sesi başlatılamadı");
  }
  renderAmbientUi();
}

function setAmbientVolume(value) {
  state.ambientVolume = Math.min(100, Math.max(0, Math.round(Number(value) || 0)));
  ambientEngine.setVolume(state.ambientVolume);
  saveState({ autoBackup: false });
  renderAmbientUi();
}

function renderAmbientRoomEffect() {
  const canvas = document.getElementById("roomCanvas");
  if (!canvas) return;
  [...canvas.classList].filter(name => name.startsWith("ambient-")).forEach(name => canvas.classList.remove(name));
  if (ambientEngine.playing && ambientEngine.soundId !== "off") canvas.classList.add(`ambient-${ambientEngine.soundId}`);
  const effect = document.getElementById("roomAmbientEffect");
  if (effect) effect.dataset.ambient = ambientEngine.playing ? ambientEngine.soundId : "off";
}

function openAmbientModal() {
  renderAmbientUi();
  openModal("ambientModal");
}

const renderStatsV77ForV78 = renderStats;
renderStats = function renderStatsV78() {
  renderStatsV77ForV78();
  renderMikiEvolution();
  renderStreakPanel();
};

const renderRoomV77ForV78 = renderRoom;
renderRoom = function renderRoomV78(justAddedId = null) {
  renderRoomV77ForV78(justAddedId);
  renderAmbientRoomEffect();
  renderLivingMiki();
};

const renderMikiFocusStateV77ForV78 = renderMikiFocusState;
renderMikiFocusState = function renderMikiFocusStateV78() {
  renderMikiFocusStateV77ForV78();
  renderLivingMiki();
};

const completeFocusSessionV77ForV78 = completeFocusSession;
completeFocusSession = function completeFocusSessionV78(options = {}) {
  const beforeSessions = Object.values(state.history || {}).reduce((sum, record) => sum + (Array.isArray(record?.sessions) ? record.sessions.length : 0), 0);
  completeFocusSessionV77ForV78(options);
  const afterSessions = Object.values(state.history || {}).reduce((sum, record) => sum + (Array.isArray(record?.sessions) ? record.sessions.length : 0), 0);
  if (afterSessions > beforeSessions) {
    state.lastStudyAt = new Date().toISOString();
    state.lastInteractionAt = state.lastStudyAt;
    saveState();
    celebrateMikiAfterSession();
    renderStreakPanel();
  }
};

const renderAllV77ForV78 = renderAll;
renderAll = function renderAllV78() {
  renderAllV77ForV78();
  renderMikiEvolution();
  renderStreakPanel();
  renderAmbientUi();
  renderLivingMiki();
};

const openSettingsV77ForV78 = typeof openSettings === "function" ? openSettings : null;
if (openSettingsV77ForV78) {
  openSettings = function openSettingsV78() {
    openSettingsV77ForV78();
    renderAmbientUi();
  };
}

document.getElementById("ambientButton")?.addEventListener("click", openAmbientModal);
document.getElementById("ambientToggleButton")?.addEventListener("click", toggleAmbientPlayback);
document.getElementById("ambientVolume")?.addEventListener("input", event => setAmbientVolume(event.target.value));
document.getElementById("restDayButton")?.addEventListener("click", toggleTodayRestDay);
document.getElementById("streakMinimumSelect")?.addEventListener("change", changeStreakMinimum);
document.getElementById("timerButton")?.addEventListener("click", () => {
  state.lastInteractionAt = new Date().toISOString();
  saveState({ autoBackup: false });
  setTimeout(renderLivingMiki, 0);
});
document.getElementById("finishTimerButton")?.addEventListener("click", () => setTimeout(renderLivingMiki, 0));
document.getElementById("cancelTimerButton")?.addEventListener("click", () => setTimeout(renderLivingMiki, 0));
window.addEventListener("focus", () => {
  state.lastInteractionAt = new Date().toISOString();
  saveState({ autoBackup: false });
  renderLivingMiki();
  renderStreakPanel();
});
window.addEventListener("beforeunload", () => ambientEngine.stop(false));

currentMikiIdleMode = mikiAbsenceHoursAtLoad >= 48 ? "waiting" : (mikiAbsenceHoursAtLoad >= 8 ? (state.equippedItems?.bed ? "sleeping-bed" : "sleeping-floor") : chooseMikiIdleMode());
scheduleMikiIdleCycle();
renderAll();

document.getElementById("ambientNow")?.addEventListener("click", openAmbientModal);

/* v7.9 real page navigation, daily missions, achievements and focused UI */
const BERNA_PAGES = new Set(["todayPage", "focusPage", "agendaPage", "mikiPage", "progressPage"]);
const MIKI_PANELS = new Set(["room", "inventory", "store"]);
let agendaSelectedDate = state.currentDate || getDateKey();

function showAppPage(pageId, { save = true } = {}) {
  const safePage = BERNA_PAGES.has(pageId) ? pageId : "todayPage";
  document.querySelectorAll(".app-page").forEach(page => page.classList.toggle("active", page.id === safePage));
  document.querySelectorAll(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.page === safePage));
  document.body.dataset.currentPage = safePage;
  state.lastOpenPage = safePage;
  if (save) saveState({ autoBackup: false });
  if (safePage === "agendaPage") renderAgendaPage();
  if (safePage === "mikiPage") { showMikiPanel(state.mikiPanel || "room", { save: false }); renderRoom(); renderInventory(); renderShop(); }
  if (safePage === "progressPage") { populateHistoryYears(); populateHistoryCategories(); renderHistory(); }
  updateFocusedInterface();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showMikiPanel(panelId, { save = true } = {}) {
  const safePanel = MIKI_PANELS.has(panelId) ? panelId : "room";
  state.mikiPanel = safePanel;
  document.querySelectorAll(".miki-panel").forEach(panel => panel.classList.toggle("active", panel.id === `miki${safePanel[0].toUpperCase()}${safePanel.slice(1)}Panel`));
  document.querySelectorAll("[data-miki-panel]").forEach(button => button.classList.toggle("active", button.dataset.mikiPanel === safePanel));
  if (safePanel === "inventory") renderInventory();
  if (safePanel === "store") renderShop();
  if (save) saveState({ autoBackup: false });
}

function updateFocusedInterface() {
  const active = document.body.dataset.currentPage === "focusPage" && hasSessionInProgress();
  document.body.classList.toggle("focus-session-active", active);
  const preview = document.getElementById("focusTaskPreview");
  if (preview && active) preview.textContent = state.activeTaskTitle || "Serbest çalışma";
}

function agendaTasksForDate(dateKey) {
  if (dateKey === state.currentDate) return state.tasks;
  if (dateKey < state.currentDate) return cloneTasks(state.history?.[dateKey]?.tasks || [], dateKey);
  ensureRecurringTasksForDate(state, dateKey);
  return state.taskCalendar[dateKey] || [];
}

function renderAgendaPage() {
  const input = document.getElementById("agendaDate");
  if (!parseDateKey(agendaSelectedDate)) agendaSelectedDate = state.currentDate;
  input.value = agendaSelectedDate;
  const tasks = agendaTasksForDate(agendaSelectedDate);
  const done = tasks.filter(task => task.done).length;
  const totalMinutes = tasks.reduce((sum, task) => sum + (Number(task.minutes) || 0), 0);
  const archived = agendaSelectedDate < state.currentDate;
  document.getElementById("agendaSummary").innerHTML = `<div><span>${escapeHtml(formatFullDate(agendaSelectedDate))}</span><strong>${done} / ${tasks.length} tamamlandı</strong></div><div><span>Planlanan süre</span><strong>${totalMinutes} dk</strong></div>${archived ? '<em>Geçmiş günler yalnızca görüntülenir.</em>' : ''}`;
  const list = document.getElementById("agendaTaskList");
  if (!tasks.length) {
    list.innerHTML = '<div class="agenda-empty"><img src="./calendar-pixel.png" alt=""><strong>Bu gün için görev yok</strong><span>Yeni bir görev ekleyerek planını oluşturabilirsin.</span></div>';
    return;
  }
  list.innerHTML = tasks.map((task,index) => `<article class="agenda-task ${task.done ? "done" : ""} priority-${task.priority}">
    <label><input type="checkbox" data-agenda-check="${escapeHtml(task.id)}" ${task.done ? "checked" : ""} ${archived ? "disabled" : ""}><span class="agenda-task-main"><strong>${escapeHtml(task.title)}</strong><small>${escapeHtml(task.category)} · ${task.minutes} dk · ${task.completedPomodoros}/${task.estimatedPomodoros} Pomodoro</small></span></label>
    <div class="agenda-task-actions">${archived ? '' : `<button data-agenda-action="edit" data-task-id="${escapeHtml(task.id)}" title="Düzenle"><img src="./settings-pixel.png" alt=""></button><button data-agenda-action="move" data-task-id="${escapeHtml(task.id)}" title="Taşı"><img src="./calendar-pixel.png" alt=""></button><button data-agenda-action="delete" data-task-id="${escapeHtml(task.id)}" title="Sil">×</button>`}</div>
  </article>`).join("");
}

function openAgendaNewTask() {
  document.getElementById("editingTaskId").value = "";
  document.getElementById("taskModal").dataset.sourceDate = "";
  openTaskEditor();
  document.getElementById("newTaskDate").value = agendaSelectedDate < getDateKey() ? getDateKey() : agendaSelectedDate;
}

function findAgendaTask(taskId) {
  const tasks = agendaTasksForDate(agendaSelectedDate);
  return tasks.find(task => task.id === taskId) || null;
}

function openAgendaTaskEditor(taskId) {
  if (agendaSelectedDate === state.currentDate) return openTaskEditor(taskId);
  const task = findAgendaTask(taskId);
  if (!task || agendaSelectedDate < state.currentDate) return;
  const modal = document.getElementById("taskModal");
  modal.dataset.sourceDate = agendaSelectedDate;
  document.getElementById("editingTaskId").value = task.id;
  document.getElementById("taskModalTitle").textContent = "Görevi Düzenle";
  document.getElementById("newTaskTitle").value = task.title;
  document.getElementById("newTaskCategory").value = task.category;
  document.getElementById("newTaskDate").min = getDateKey();
  document.getElementById("newTaskDate").value = task.dueDate;
  document.getElementById("newTaskMinutes").value = String(task.minutes);
  document.getElementById("newTaskPomodoros").value = String(task.estimatedPomodoros);
  document.getElementById("newTaskPriority").value = task.priority;
  document.getElementById("newTaskRecurrence").value = task.recurrence;
  document.getElementById("newTaskCarryOver").checked = task.carryOver;
  renderCategoryDatalist(); openModal("taskModal");
}

function saveFutureAgendaTask(event) {
  const modal = document.getElementById("taskModal");
  const sourceDate = modal.dataset.sourceDate;
  if (!sourceDate || sourceDate === state.currentDate) return false;
  event.preventDefault(); event.stopImmediatePropagation();
  const id = document.getElementById("editingTaskId").value;
  const sourceTasks = state.taskCalendar[sourceDate] || [];
  const old = sourceTasks.find(task => task.id === id);
  const title = document.getElementById("newTaskTitle").value.trim();
  const dueDate = document.getElementById("newTaskDate").value;
  if (!old || !title || !parseDateKey(dueDate) || dueDate < getDateKey()) { showToast("Görev bilgilerini kontrol et"); return true; }
  const updated = normalizeTask({ ...old, title, category: document.getElementById("newTaskCategory").value.trim() || "Genel", dueDate, minutes: document.getElementById("newTaskMinutes").value, estimatedPomodoros: document.getElementById("newTaskPomodoros").value, priority: document.getElementById("newTaskPriority").value, recurrence: document.getElementById("newTaskRecurrence").value, carryOver: document.getElementById("newTaskCarryOver").checked, updatedAt: new Date().toISOString() }, dueDate);
  state.taskCalendar[sourceDate] = sourceTasks.filter(task => task.id !== id);
  state.taskCalendar[dueDate] = cloneTasks(state.taskCalendar[dueDate] || [], dueDate);
  state.taskCalendar[dueDate].push(updated);
  modal.dataset.sourceDate = ""; saveState(); closeModal("taskModal"); agendaSelectedDate = dueDate; renderAgendaPage(); showToast("Görev güncellendi");
  return true;
}

function deleteAgendaTask(taskId) {
  if (agendaSelectedDate === state.currentDate) return deleteTask(taskId);
  const task = findAgendaTask(taskId); if (!task || !window.confirm(`“${task.title}” silinsin mi?`)) return;
  state.taskCalendar[agendaSelectedDate] = (state.taskCalendar[agendaSelectedDate] || []).filter(item => item.id !== taskId);
  saveState(); renderAgendaPage(); showToast("Görev silindi");
}

function moveAgendaTask(taskId) {
  if (agendaSelectedDate === state.currentDate) return openMoveTask(taskId);
  const task = findAgendaTask(taskId); if (!task) return;
  const target = window.prompt("Yeni tarihi YYYY-AA-GG biçiminde yaz:", addDays(agendaSelectedDate, 1));
  if (!parseDateKey(target) || target < getDateKey()) { if (target !== null) showToast("Geçerli bir gelecek tarihi gir"); return; }
  state.taskCalendar[agendaSelectedDate] = (state.taskCalendar[agendaSelectedDate] || []).filter(item => item.id !== taskId);
  state.taskCalendar[target] = cloneTasks(state.taskCalendar[target] || [], target);
  state.taskCalendar[target].push(normalizeTask({ ...task, dueDate: target, done: false }, target));
  saveState(); renderAgendaPage(); showToast(`Görev ${formatFullDate(target)} tarihine taşındı`);
}

const ACHIEVEMENTS = Object.freeze([
  { id:"first-pomodoro", title:"İlk Pomodoro", description:"İlk Pomodoro oturumunu tamamla.", icon:"./tomato.png", coins:5, xp:10, condition:() => state.pomodoros >= 1 },
  { id:"minutes-100", title:"Toplam 100 dakika", description:"Toplam 100 dakika tamamlanmış çalışma yap.", icon:"./history-pixel.png", coins:8, xp:15, condition:() => totalCompletedStudyMinutes() >= 100 },
  { id:"minutes-1000", title:"Toplam 1.000 dakika", description:"Toplam 1.000 dakika tamamlanmış çalışma yap.", icon:"./trophy-pixel.png", coins:25, xp:50, condition:() => totalCompletedStudyMinutes() >= 1000 },
  { id:"four-pomodoros", title:"Aynı gün 4 Pomodoro", description:"Aynı gün dört Pomodoro tamamla.", icon:"./check-pixel.png", coins:10, xp:20, condition:() => Object.keys(state.history || {}).some(key => completedPomodorosForDate(key) >= 4) },
  { id:"exam-target", title:"Bir sınav hedefini tamamlama", description:"Bir sınavın çalışma hedefini tamamla.", icon:"./exam-pixel.png", coins:15, xp:30, condition:() => (state.exams || []).some(exam => exam.targetMinutes > 0 && calculateExamStudyMinutes(exam) >= exam.targetMinutes) },
  { id:"seven-days", title:"7 farklı günde çalışma", description:"Yedi farklı günde en az bir tamamlanmış çalışma yap.", icon:"./calendar-pixel.png", coins:12, xp:25, condition:() => activeStudyDayCount() >= 7 },
  { id:"full-room", title:"Bir odayı tamamen dekore etme", description:"Odayı yatak, halı, raf, lamba, bitki ve oyuncakla tamamla.", icon:"./house.png", coins:20, xp:35, condition:() => ["bed","rug","shelf","lamp","plant","toy"].every(slot => Boolean(state.equippedItems?.[slot])) }
]);
const DAILY_MISSIONS = Object.freeze([
  { id:"study-25", title:"Bugün 25 dakika çalış", icon:"./tomato.png", target:25, progress:() => completedMinutesForDate(state.currentDate), unit:"dk", coins:3, xp:5 },
  { id:"complete-task", title:"Bir görevi tamamla", icon:"./check-pixel.png", target:1, progress:() => state.tasks.some(task => task.done) ? 1 : 0, unit:"görev", coins:2, xp:3 },
  { id:"start-with-miki", title:"Miki ile güne başla", icon:"./miki-card.png", target:1, progress:() => state.dayStarted ? 1 : 0, unit:"başlangıç", coins:1, xp:2 }
]);

function totalCompletedStudyMinutes() { return Object.keys(state.history || {}).reduce((sum,key) => sum + completedMinutesForDate(key), 0); }
function activeStudyDayCount() { return Object.keys(state.history || {}).filter(key => completedMinutesForDate(key) > 0).length; }
function missionClaimKey(id,date=state.currentDate) { return `${date}:${id}`; }

function evaluateProgressRewards({ notify = true } = {}) {
  let changed=false; const messages=[];
  state.unlockedAchievements ||= {}; state.dailyMissionClaims ||= {};
  ACHIEVEMENTS.forEach(item => {
    if (!state.unlockedAchievements[item.id] && item.condition()) {
      state.unlockedAchievements[item.id] = new Date().toISOString(); state.coins += item.coins; state.xp += item.xp; changed=true;
      messages.push(`Başarı açıldı: ${item.title}`);
    }
  });
  DAILY_MISSIONS.forEach(item => {
    const key=missionClaimKey(item.id); const complete=item.progress() >= item.target;
    if (complete && !state.dailyMissionClaims[key]) {
      state.dailyMissionClaims[key]=new Date().toISOString(); state.coins += item.coins; state.xp += item.xp; changed=true;
      messages.push(`Günlük görev: ${item.title}`);
    }
  });
  if (changed) {
    state.level=Math.floor(state.xp/100)+1; saveState(); renderStats();
    if (notify && messages.length) { showToast(`${messages[0]} · Miki seninle gurur duyuyor`); showRoomStatus("Küçük bir başarı daha! Miki seviniyor."); if (state.soundEnabled) playCompletionSound(); }
  }
  return changed;
}

function renderDailyMissions() {
  const list=document.getElementById("dailyMissionList"); if (!list) return;
  const completed=DAILY_MISSIONS.filter(item => Boolean(state.dailyMissionClaims?.[missionClaimKey(item.id)])).length;
  document.getElementById("dailyMissionCount").textContent=`${completed} / ${DAILY_MISSIONS.length}`;
  list.innerHTML=DAILY_MISSIONS.map(item => { const progress=Math.min(item.target,item.progress()); const claimed=Boolean(state.dailyMissionClaims?.[missionClaimKey(item.id)]); const percent=Math.round(progress/item.target*100); return `<article class="daily-mission ${claimed ? "complete" : ""}"><img src="${item.icon}" alt=""><div><strong>${escapeHtml(item.title)}</strong><span>${progress} / ${item.target} ${item.unit}</span><i><b style="width:${percent}%"></b></i></div><small>${claimed ? "Tamamlandı" : `+${item.xp} XP · +${item.coins} coin`}</small></article>`; }).join("");
}

function renderAchievements() {
  const unlocked=ACHIEVEMENTS.filter(item => state.unlockedAchievements?.[item.id]).length;
  const count=document.getElementById("achievementCount"); if (count) count.textContent=`${unlocked} / ${ACHIEVEMENTS.length}`;
  const line=document.getElementById("achievementSummaryLine"); if (line) line.textContent=`${unlocked} / ${ACHIEVEMENTS.length} başarı açıldı`;
  const preview=document.getElementById("achievementPreview");
  if (preview) preview.innerHTML=ACHIEVEMENTS.map(item => `<div class="achievement-mini ${state.unlockedAchievements?.[item.id] ? "unlocked" : "locked"}"><img src="${item.icon}" alt=""><span>${escapeHtml(item.title)}</span></div>`).join("");
  const grid=document.getElementById("achievementsGrid"); if (!grid) return;
  grid.innerHTML=ACHIEVEMENTS.map(item => { const unlockedAt=state.unlockedAchievements?.[item.id]; return `<article class="achievement-card ${unlockedAt ? "unlocked" : "locked"}"><div class="achievement-icon"><img src="${item.icon}" alt=""></div><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p><small>${unlockedAt ? `Açıldı · ${formatBackupTime(unlockedAt)}` : `Ödül: +${item.xp} XP · +${item.coins} coin`}</small></div></article>`; }).join("");
}

const renderAllV78ForV79 = renderAll;
renderAll = function renderAllV79() {
  renderAllV78ForV79();
  evaluateProgressRewards({ notify:false });
  renderDailyMissions(); renderAchievements(); renderAgendaPage(); updateFocusedInterface();
};

const renderTimerV78ForV79 = renderTimer;
renderTimer = function renderTimerV79() { renderTimerV78ForV79(); updateFocusedInterface(); };

const renderTasksV78ForV79 = renderTasks;
renderTasks = function renderTasksV79() { renderTasksV78ForV79(); if (document.body.dataset.currentPage === "agendaPage") renderAgendaPage(); setTimeout(() => { evaluateProgressRewards(); renderDailyMissions(); renderAchievements(); }, 0); };

const equipRoomItemV78ForV79 = equipRoomItem;
equipRoomItem = function equipRoomItemV79(itemId) { equipRoomItemV78ForV79(itemId); evaluateProgressRewards(); renderAchievements(); };

const openTaskEditorV78ForV79 = openTaskEditor;
openTaskEditor = function openTaskEditorV79(taskId = "") {
  document.getElementById("taskModal").dataset.sourceDate = "";
  return openTaskEditorV78ForV79(taskId);
};

const openAchievements = () => { evaluateProgressRewards({notify:false}); renderAchievements(); openModal("achievementsModal"); };
document.getElementById("todayBackupButton")?.addEventListener("click", openBackup);
document.getElementById("openAchievementsButton")?.addEventListener("click", openAchievements);
document.getElementById("historyAchievementsButton")?.addEventListener("click", openAchievements);
document.getElementById("agendaAddTaskButton")?.addEventListener("click", openAgendaNewTask);
document.getElementById("agendaDate")?.addEventListener("change", event => { agendaSelectedDate=event.target.value || state.currentDate; renderAgendaPage(); });
document.getElementById("agendaPrevDay")?.addEventListener("click", () => { agendaSelectedDate=addDays(agendaSelectedDate,-1); renderAgendaPage(); });
document.getElementById("agendaNextDay")?.addEventListener("click", () => { agendaSelectedDate=addDays(agendaSelectedDate,1); renderAgendaPage(); });
document.getElementById("agendaTodayButton")?.addEventListener("click", () => { agendaSelectedDate=state.currentDate; renderAgendaPage(); });
document.getElementById("agendaTaskList")?.addEventListener("change", event => { const id=event.target.dataset.agendaCheck; if (!id || agendaSelectedDate !== state.currentDate) return; toggleTaskDone(id,event.target.checked); renderAgendaPage(); });
document.getElementById("agendaTaskList")?.addEventListener("click", event => { const button=event.target.closest("[data-agenda-action]"); if (!button) return; const id=button.dataset.taskId; if (button.dataset.agendaAction==="edit") openAgendaTaskEditor(id); if (button.dataset.agendaAction==="move") moveAgendaTask(id); if (button.dataset.agendaAction==="delete") deleteAgendaTask(id); });
document.getElementById("saveTaskButton")?.addEventListener("click", saveFutureAgendaTask, true);
document.getElementById("saveTaskButton")?.addEventListener("click", () => setTimeout(renderAgendaPage,0));
document.getElementById("mikiSubtabs")?.addEventListener("click", event => { const button=event.target.closest("[data-miki-panel]"); if (button) showMikiPanel(button.dataset.mikiPanel); });
document.getElementById("historyButton")?.addEventListener("click", () => showAppPage("progressPage"));
document.getElementById("openInventoryButton")?.addEventListener("click", () => showMikiPanel("inventory"));
document.getElementById("goStoreButton")?.addEventListener("click", () => showMikiPanel("store"));
document.getElementById("timerButton")?.addEventListener("click", () => setTimeout(updateFocusedInterface,0));
document.getElementById("cancelTimerButton")?.addEventListener("click", () => setTimeout(updateFocusedInterface,0));
document.getElementById("finishTimerButton")?.addEventListener("click", () => setTimeout(updateFocusedInterface,0));

evaluateProgressRewards({notify:false});
renderDailyMissions(); renderAchievements(); renderAgendaPage(); renderRewardPreview();
showAppPage(state.lastOpenPage || "todayPage", {save:false});
