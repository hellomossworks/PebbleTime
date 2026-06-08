import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";

// ─── THEMES ───────────────────────────────────────────────────────────────────

const THEMES = {
  stone: {
    name: "Warm Stone",
    bg: "#f5f2ee",
    card: "#fdfcfa",
    border: "#e8e2d9",
    borderMid: "#d4cbbf",
    textMuted: "#b8ac9c",
    textMid: "#8c7f6e",
    textDark: "#4a4038",
    primary: "#7a9172",
    primaryLight: "#a8bf9e",
    secondary: "#e8e2d9",
    secondaryText: "#6b5f50",
    accent: "#c17f4a",
    accentLight: "#e8dfd0",
    water: "#7a9aaa",
    danger: "#b85c5c",
    white: "#fdfcfa",
    swatch1: "#7a9172",
    swatch2: "#c17f4a",
  },
  slate: {
    name: "Cool Slate",
    bg: "#eef0f3",
    card: "#f8f9fb",
    border: "#dde1e7",
    borderMid: "#c8cdd6",
    textMuted: "#a0a8b4",
    textMid: "#6b7585",
    textDark: "#2e3545",
    primary: "#5b7fa6",
    primaryLight: "#92b4d0",
    secondary: "#dde1e7",
    secondaryText: "#4a5568",
    accent: "#7b6fa6",
    accentLight: "#ddd8f0",
    water: "#6fa6a6",
    danger: "#a65b5b",
    white: "#f8f9fb",
    swatch1: "#5b7fa6",
    swatch2: "#7b6fa6",
  },
  forest: {
    name: "Deep Forest",
    bg: "#1a2218",
    card: "#232e20",
    border: "#2e3e2a",
    borderMid: "#3a5034",
    textMuted: "#6a8c60",
    textMid: "#90b484",
    textDark: "#d4e8cc",
    primary: "#7ab86a",
    primaryLight: "#a4d096",
    secondary: "#2e3e2a",
    secondaryText: "#90b484",
    accent: "#c8a84a",
    accentLight: "#3a3018",
    water: "#4a9aaa",
    danger: "#c06060",
    white: "#e8f4e0",
    swatch1: "#7ab86a",
    swatch2: "#c8a84a",
  },
  dusk: {
    name: "Dusk",
    bg: "#1e1824",
    card: "#261e30",
    border: "#342848",
    borderMid: "#4a3860",
    textMuted: "#8070a0",
    textMid: "#a898c8",
    textDark: "#e0d8f4",
    primary: "#9878d8",
    primaryLight: "#c0a8f0",
    secondary: "#342848",
    secondaryText: "#c0a8f0",
    accent: "#e098a0",
    accentLight: "#3a2030",
    water: "#70a0d8",
    danger: "#e07070",
    white: "#f0ecfc",
    swatch1: "#9878d8",
    swatch2: "#e098a0",
  },
  ember: {
    name: "Ember",
    bg: "#1c1510",
    card: "#251a12",
    border: "#352418",
    borderMid: "#4a3220",
    textMuted: "#8a6040",
    textMid: "#b88458",
    textDark: "#f0dcc0",
    primary: "#d4804a",
    primaryLight: "#e8a878",
    secondary: "#352418",
    secondaryText: "#d4a070",
    accent: "#e8c060",
    accentLight: "#382810",
    water: "#7a9aaa",
    danger: "#c05050",
    white: "#fdf4e8",
    swatch1: "#d4804a",
    swatch2: "#e8c060",
  },
  rose: {
    name: "Soft Rose",
    bg: "#f8f0f0",
    card: "#fdf8f8",
    border: "#ead8d8",
    borderMid: "#d8c0c0",
    textMuted: "#c0a0a0",
    textMid: "#a07878",
    textDark: "#503838",
    primary: "#c87888",
    primaryLight: "#e0a8b0",
    secondary: "#ead8d8",
    secondaryText: "#784858",
    accent: "#c89858",
    accentLight: "#f0e8d8",
    water: "#88a8c8",
    danger: "#b85858",
    white: "#fdf8f8",
    swatch1: "#c87888",
    swatch2: "#c89858",
  },
};

const SUGGESTED_TASKS = [
  "Dishes", "Laundry", "Emails", "Shower", "Getting dressed",
  "Tidying", "Vacuuming", "Cooking", "Groceries", "Exercise",
  "Reading", "Journalling", "Meditation", "Feed pets", "Water plants",
];


// ─── QUEUE DATA ───────────────────────────────────────────────────────────────

const PRESET_QUEUES = [
  {
    id: "morning",
    name: "Morning Routine",
    icon: "\u{1F305}",
    tasks: [
      { name: "Get up & stretch", minutes: 5, seconds: 0 },
      { name: "Shower", minutes: 10, seconds: 0 },
      { name: "Getting dressed", minutes: 5, seconds: 0 },
      { name: "Breakfast", minutes: 15, seconds: 0 },
    ],
  },
  {
    id: "cleaning",
    name: "Cleaning Blitz",
    icon: "\u{1F9F9}",
    tasks: [
      { name: "Dishes", minutes: 10, seconds: 0 },
      { name: "Vacuuming", minutes: 15, seconds: 0 },
      { name: "Tidying", minutes: 10, seconds: 0 },
      { name: "Wipe surfaces", minutes: 5, seconds: 0 },
    ],
  },
  {
    id: "workday",
    name: "Work Day Startup",
    icon: "\u{1F4BB}",
    tasks: [
      { name: "Check emails", minutes: 10, seconds: 0 },
      { name: "Plan the day", minutes: 5, seconds: 0 },
      { name: "First task", minutes: 25, seconds: 0 },
    ],
  },
];

const DEFAULT_SETTINGS = {
  theme: "stone",
  animations: true,
  alertMode: "both",
  chimeStyle: "bowl",
  vibrationPattern: "double",
  halfwayAlert: true,
  lastMinuteWarning: true,
  defaultTimerType: "countdown",
  colorSafe: false,
  monochrome: false,
  highContrast: false,
  fontSize: "normal",
  prioritiseTasks: true,
  hiddenTasks: [],
  encouragement: true,
  simpleMode: false,
  timerStyle: "ring",
  breathingPattern: "4-4-4",
  budgetStyle: "bars",
  defaultLanding: "setup",
};

const FONT_SCALE = { small: 0.88, normal: 1, large: 1.18, xlarge: 1.35 };

// ─── VISUAL MODE TRANSFORM ────────────────────────────────────────────────────

function applyVisualMode(theme, colorSafe, monochrome, highContrast) {
  if (!colorSafe && !monochrome) return theme;
  const t = Object.assign({}, theme);
  if (monochrome) {
    function toGrey(hex) {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      const lum = Math.round(0.299*r + 0.587*g + 0.114*b);
      const h = lum.toString(16).padStart(2,"0");
      return "#"+h+h+h;
    }
    return Object.fromEntries(Object.entries(t).map(([k,v]) =>
      typeof v === "string" && v.startsWith("#") ? [k, toGrey(v)] : [k,v]
    ));
  }
  if (highContrast) {
    const dark = parseInt(theme.bg.slice(1),16) < 0x808080;
    return Object.assign({}, t, dark ? {
      textDark: "#ffffff",
      textMid: "#e0e0e0",
      textMuted: "#b0b0b0",
      border: "#555555",
      borderMid: "#777777",
    } : {
      textDark: "#000000",
      textMid: "#222222",
      textMuted: "#555555",
      border: "#999999",
      borderMid: "#666666",
    });
  }
  if (colorSafe) {
    const dark = theme.textDark.toLowerCase() === theme.bg.toLowerCase() || parseInt(theme.bg.slice(1),16) < 0x808080;
    if (dark) {
      return Object.assign({}, t, {
        primary: "#5db8d8",
        primaryLight: "#8ed4e8",
        accent: "#f0c040",
        accentLight: "#2a2410",
        water: "#d87840",
        danger: "#f07070",
        swatch1: "#5db8d8",
        swatch2: "#f0c040",
      });
    } else {
      return Object.assign({}, t, {
        primary: "#0077b6",
        primaryLight: "#48b4d8",
        accent: "#e08c00",
        accentLight: "#fff3cc",
        water: "#0096c7",
        danger: "#c0392b",
        swatch1: "#0077b6",
        swatch2: "#e08c00",
      });
    }
  }
  return t;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "short" });
}

// ─── SOUND ────────────────────────────────────────────────────────────────────

// ─── CHIME STYLES ────────────────────────────────────────────────────────────

async function playChime(type, style) {
  try {
    await Tone.start();
    const s = style || "bowl";

    if (type === "complete") {
      if (s === "bowl") {
        const synth = new Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 1.4, release: 0.2 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
        synth.volume.value = -18;
        synth.triggerAttackRelease("C4", "2n");
        setTimeout(() => synth.dispose(), 3000);
      } else if (s === "bell") {
        const synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 1.8, sustain: 0.1, release: 1.2 } }).toDestination();
        synth.volume.value = -16;
        synth.triggerAttackRelease("A5", "4n");
        setTimeout(() => synth.dispose(), 3000);
      } else if (s === "pop") {
        const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 } }).toDestination();
        synth.volume.value = -14;
        synth.triggerAttackRelease("C5", "16n");
        setTimeout(() => synth.dispose(), 500);
      } else if (s === "double") {
        const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.4, sustain: 0.05, release: 0.3 } }).toDestination();
        synth.volume.value = -18;
        synth.triggerAttackRelease("G4", "8n");
        setTimeout(() => { synth.triggerAttackRelease("C5", "8n"); setTimeout(() => synth.dispose(), 1000); }, 300);
      }
    } else if (type === "tick") {
      if (s === "bowl") {
        const synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 } }).toDestination();
        synth.volume.value = -28;
        synth.triggerAttackRelease("G5", "32n");
        setTimeout(() => synth.dispose(), 500);
      } else if (s === "bell") {
        const synth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.2 } }).toDestination();
        synth.volume.value = -24;
        synth.triggerAttackRelease("E5", "16n");
        setTimeout(() => synth.dispose(), 500);
      } else if (s === "pop") {
        const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 } }).toDestination();
        synth.volume.value = -20;
        synth.triggerAttackRelease("A4", "32n");
        setTimeout(() => synth.dispose(), 300);
      } else if (s === "double") {
        const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 } }).toDestination();
        synth.volume.value = -22;
        synth.triggerAttackRelease("F4", "16n");
        setTimeout(() => { synth.triggerAttackRelease("A4", "16n"); setTimeout(() => synth.dispose(), 500); }, 150);
      }
    } else if (type === "start") {
      const synth = new Tone.Synth({ oscillator: { type: "triangle" }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.4 } }).toDestination();
      synth.volume.value = -20;
      synth.triggerAttackRelease("E4", "8n");
      setTimeout(() => { synth.triggerAttackRelease("G4", "8n"); setTimeout(() => synth.dispose(), 1000); }, 180);
    }
  } catch (e) {}
}

// ─── VIBRATION PATTERNS ───────────────────────────────────────────────────────

const VIBRATION_PATTERNS = {
  single:  { nudge: [80],           warning: [120],              complete: [200] },
  double:  { nudge: [60, 40, 60],   warning: [80, 40, 80],       complete: [100, 50, 100, 50, 200] },
  long:    { nudge: [150],          warning: [250],              complete: [400] },
  rhythm:  { nudge: [40, 30, 40, 30, 40], warning: [60, 40, 60, 40, 120], complete: [80, 40, 80, 40, 80, 40, 200] },
};

function vibrate(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
}

function fireAlert(type, settings) {
  const useSound = settings.alertMode === "sound" || settings.alertMode === "both";
  const useVibe = settings.alertMode === "vibration" || settings.alertMode === "both";
  const patterns = VIBRATION_PATTERNS[settings.vibrationPattern] || VIBRATION_PATTERNS.double;
  if (type === "nudge") {
    if (useSound) playChime("tick", settings.chimeStyle);
    if (useVibe) vibrate(patterns.nudge);
  } else if (type === "warning") {
    if (useSound) playChime("tick", settings.chimeStyle);
    if (useVibe) vibrate(patterns.warning);
  } else if (type === "complete") {
    if (useSound) playChime("complete", settings.chimeStyle);
    if (useVibe) vibrate(patterns.complete);
  } else if (type === "start") {
    if (useSound) playChime("start", settings.chimeStyle);
    if (useVibe) vibrate([40]);
  }
}

// ─── TOGGLE ───────────────────────────────────────────────────────────────────

function Toggle({ value, onChange, C }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: "48px",
        height: "26px",
        borderRadius: "13px",
        background: value ? C.primary : C.border,
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.2s ease",
        flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute",
        top: "3px",
        left: value ? "25px" : "3px",
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        background: C.white,
        transition: "left 0.2s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

// ─── RIPPLE CIRCLE ────────────────────────────────────────────────────────────

function RippleCircle({ active, progress, children, size, C, animate }) {
  return (
    <div style={{
      position: "relative",
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}
      >
        <circle cx={size / 2} cy={size / 2} r={(size / 2) - 8} fill="none" stroke={C.border} strokeWidth="6" />
        <circle
          cx={size / 2} cy={size / 2} r={(size / 2) - 8}
          fill="none"
          stroke={active ? C.primary : C.borderMid}
          strokeWidth="6"
          strokeDasharray={2 * Math.PI * ((size / 2) - 8)}
          strokeDashoffset={2 * Math.PI * ((size / 2) - 8) * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: animate ? "stroke-dashoffset 0.5s ease, stroke 0.3s ease" : "none" }}
        />
      </svg>
      {active && animate && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: size, height: size,
          borderRadius: "50%",
          animation: "ripple 2s ease-out infinite",
          border: `2px solid ${C.primaryLight}`,
          opacity: 0.4,
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─── BUTTON ───────────────────────────────────────────────────────────────────

function PebbleButton({ onClick, children, variant, small, disabled, C }) {
  const base = {
    border: "none",
    borderRadius: "100px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'Lora', serif",
    fontWeight: "500",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.5 : 1,
    letterSpacing: "0.02em",
  };
  const variants = {
    primary: { background: C.primary, color: C.white, padding: small ? "8px 20px" : "14px 36px", fontSize: small ? "13px" : "15px", boxShadow: `0 4px 16px ${C.primary}44` },
    secondary: { background: C.secondary, color: C.secondaryText, padding: small ? "8px 20px" : "14px 36px", fontSize: small ? "13px" : "15px" },
    ghost: { background: "transparent", color: C.textMid, padding: small ? "6px 14px" : "10px 24px", fontSize: small ? "12px" : "14px", border: `1px solid ${C.borderMid}` },
    danger: { background: C.danger, color: C.white, padding: small ? "8px 20px" : "14px 36px", fontSize: small ? "13px" : "15px" },
    accent: { background: C.accent, color: C.white, padding: small ? "8px 20px" : "14px 36px", fontSize: small ? "13px" : "15px", boxShadow: `0 4px 16px ${C.accent}44` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant || "primary"] }}>
      {children}
    </button>
  );
}

// ─── TASK PILL ────────────────────────────────────────────────────────────────

function TaskPill({ name, onSelect, selected, C }) {
  return (
    <button
      onClick={() => onSelect(name)}
      style={{
        background: selected ? C.primary : C.secondary,
        color: selected ? C.white : C.secondaryText,
        border: "none", borderRadius: "100px",
        padding: "6px 14px", fontSize: "13px",
        cursor: "pointer", fontFamily: "'Lora', serif",
        transition: "all 0.15s ease", whiteSpace: "nowrap",
      }}
    >
      {name}
    </button>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────

function HistoryEntry({ entry, C }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px", background: C.card, borderRadius: "12px",
      marginBottom: "6px", border: `1px solid ${C.border}`,
    }}>
      <div>
        <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{entry.taskName}</div>
        <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{formatDate(entry.completedAt)}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "15px", color: C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(entry.duration)}</div>
        <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{entry.timerType}</div>
      </div>
    </div>
  );
}

function TaskHistory({ history, taskName, C }) {
  const filtered = taskName
    ? history.filter(e => e.taskName.toLowerCase() === taskName.toLowerCase())
    : history;
  const sorted = [...filtered].sort((a, b) => b.completedAt - a.completedAt);

  if (sorted.length === 0) {
    return (
      <div style={{ textAlign: "center", color: C.textMuted, fontSize: "13px", padding: "24px", fontFamily: "'Lora', serif", fontStyle: "italic" }}>
        No history yet. Start a timer to see how long things take you! 🪨
      </div>
    );
  }

  const avg = Math.round(sorted.reduce((a, b) => a + b.duration, 0) / sorted.length);

  return (
    <div>
      {taskName && sorted.length > 1 && (
        <div style={{
          background: C.accentLight, borderRadius: "12px", padding: "12px 16px", marginBottom: "12px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif" }}>Average for {taskName}</span>
          <span style={{ fontSize: "15px", color: C.accent, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(avg)}</span>
        </div>
      )}
      {sorted.slice(0, 10).map((entry, i) => <HistoryEntry key={i} entry={entry} C={C} />)}
    </div>
  );
}

// ─── SETTINGS SCREEN ─────────────────────────────────────────────────────────

function SettingsScreen({ settings, onSave, customTasks, onDeleteCustomTask, onExport, onImport, onClearAll, miscHistory, onDeleteMisc }) {
  const [local, setLocal] = useState(settings);
  const [visualOpen, setVisualOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const C = applyVisualMode(THEMES[local.theme] || THEMES.stone, local.colorSafe, local.monochrome, local.highContrast);

  function update(key, val) {
    const next = { ...local, [key]: val };
    setLocal(next);
    onSave(next);
  }

  function SectionLabel({ children }) {
    return (
      <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "12px", marginTop: "28px" }}>
        {children}
      </div>
    );
  }

  function SettingRow({ label, desc, children }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: C.card, borderRadius: "12px", marginBottom: "8px", border: `1px solid ${C.border}` }}>
        <div style={{ flex: 1, paddingRight: "16px" }}>
          <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{label}</div>
          {desc && <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{desc}</div>}
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px 40px" }}>

      <SectionLabel>Accessibility</SectionLabel>

      <SettingRow label="Animations" desc="Ripple and transition effects">
        <Toggle value={local.animations} onChange={v => update("animations", v)} C={C} />
      </SettingRow>

      <button
        onClick={() => setAlertsOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: C.card, borderRadius: alertsOpen ? "12px 12px 0 0" : "12px",
          border: `1px solid ${C.border}`, borderBottom: alertsOpen ? "none" : `1px solid ${C.border}`,
          cursor: "pointer", marginBottom: alertsOpen ? "0" : "8px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>Sounds & vibration</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>
            {local.alertMode === "off" ? "Alerts off" : local.alertMode === "sound" ? "Sound only" : local.alertMode === "vibration" ? "Vibration only" : "Sound & vibration"}
          </div>
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>{alertsOpen ? "▲" : "▼"}</div>
      </button>

      {alertsOpen && (
        <div style={{ background: C.card, borderRadius: "0 0 12px 12px", border: `1px solid ${C.border}`, borderTop: "none", padding: "16px", marginBottom: "8px" }}>

          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Alert mode</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
            {[["off","🔕","Off"],["sound","🔔","Sound only"],["vibration","📳","Vibration only"],["both","🔔📳","Both"]].map(([key, icon, label]) => (
              <button key={key} onClick={() => update("alertMode", key)} style={{ padding: "10px 8px", borderRadius: "10px", border: `2px solid ${local.alertMode === key ? C.primary : C.border}`, background: local.alertMode === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "12px", color: local.alertMode === key ? C.primary : C.textMid, fontWeight: local.alertMode === key ? "600" : "400", transition: "all 0.15s ease", textAlign: "center" }}>
                <div style={{ fontSize: "18px", marginBottom: "4px" }}>{icon}</div>
                {label}
              </button>
            ))}
          </div>

          {(local.alertMode === "sound" || local.alertMode === "both") && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Chime style</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[["bowl","Singing bowl"],["bell","Soft bell"],["pop","Gentle pop"],["double","Double chime"]].map(([key, label]) => (
                  <button key={key} onClick={() => update("chimeStyle", key)} style={{ padding: "10px 8px", borderRadius: "10px", border: `2px solid ${local.chimeStyle === key ? C.primary : C.border}`, background: local.chimeStyle === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "12px", color: local.chimeStyle === key ? C.primary : C.textMid, fontWeight: local.chimeStyle === key ? "600" : "400", transition: "all 0.15s ease", textAlign: "center" }}>
                    {label}
                  </button>
                ))}
              </div>
              <button onClick={() => fireAlert("complete", { ...local, alertMode: "sound" })} style={{ marginTop: "10px", width: "100%", padding: "8px", borderRadius: "8px", border: `1px solid ${C.borderMid}`, background: "transparent", color: C.textMid, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "12px" }}>
                ▶ Test chime
              </button>
            </div>
          )}

          {(local.alertMode === "vibration" || local.alertMode === "both") && (
            <div style={{ marginBottom: "8px" }}>
              <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Vibration pattern</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {[["single","Single pulse"],["double","Double tap"],["long","Long buzz"],["rhythm","Gentle rhythm"]].map(([key, label]) => (
                  <button key={key} onClick={() => { update("vibrationPattern", key); vibrate(VIBRATION_PATTERNS[key].complete); }} style={{ padding: "10px 8px", borderRadius: "10px", border: `2px solid ${local.vibrationPattern === key ? C.primary : C.border}`, background: local.vibrationPattern === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "12px", color: local.vibrationPattern === key ? C.primary : C.textMid, fontWeight: local.vibrationPattern === key ? "600" : "400", transition: "all 0.15s ease", textAlign: "center" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      <button
        onClick={() => setVisualOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: C.card, borderRadius: visualOpen ? "12px 12px 0 0" : "12px",
          border: `1px solid ${C.border}`, borderBottom: visualOpen ? "none" : `1px solid ${C.border}`,
          cursor: "pointer", marginBottom: visualOpen ? "0" : "8px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>Visual accessibility</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Colour-safe mode and monochrome</div>
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>{visualOpen ? "▲" : "▼"}</div>
      </button>

      {visualOpen && (
        <div style={{ background: C.card, borderRadius: "0 0 12px 12px", border: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}`, padding: "4px 0 4px", marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            <div>
              <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>Colour-safe mode</div>
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Uses blue, orange and yellow — safe for all colour blindness types</div>
            </div>
            <Toggle value={local.colorSafe} onChange={v => update("colorSafe", v)} C={C} />
          </div>
          <div style={{ height: "1px", background: C.border, margin: "0 16px" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            <div>
              <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>Monochrome</div>
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Greyscale version of your current theme</div>
            </div>
            <Toggle value={local.monochrome} onChange={v => update("monochrome", v)} C={C} />
          </div>
          <div style={{ height: "1px", background: C.border, margin: "0 16px" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
            <div>
              <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>High contrast</div>
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Stronger text and border contrast</div>
            </div>
            <Toggle value={local.highContrast} onChange={v => update("highContrast", v)} C={C} />
          </div>
        </div>
      )}

      <SectionLabel>Text size</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "8px" }}>
        {[["small","A","13px"],["normal","A","15px"],["large","A","18px"],["xlarge","A","21px"]].map(([key, label, size]) => (
          <button
            key={key}
            onClick={() => update("fontSize", key)}
            style={{
              padding: "12px 8px", borderRadius: "12px", border: `2px solid ${local.fontSize === key ? C.primary : C.border}`,
              background: local.fontSize === key ? C.bg : C.card, cursor: "pointer",
              fontFamily: "'Lora', serif", fontSize: size, color: local.fontSize === key ? C.primary : C.textMid,
              fontWeight: local.fontSize === key ? "600" : "400", transition: "all 0.15s ease",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <SectionLabel>Timer alerts</SectionLabel>

      <SettingRow label="Halfway alert" desc="Gentle nudge at the midpoint of a countdown">
        <Toggle value={local.halfwayAlert} onChange={v => update("halfwayAlert", v)} C={C} />
      </SettingRow>

      <SettingRow label="Last 60 seconds" desc="Warning when a minute remains">
        <Toggle value={local.lastMinuteWarning} onChange={v => update("lastMinuteWarning", v)} C={C} />
      </SettingRow>

      <SectionLabel>Colour scheme</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "8px" }}>
        {["stone","forest","slate","dusk","rose","ember"].map(key => {
          const theme = THEMES[key];
          return (
            <button
              key={key}
              onClick={() => update("theme", key)}
              style={{
                padding: "14px",
                borderRadius: "14px",
                border: `2px solid ${local.theme === key ? C.primary : C.border}`,
                background: theme.bg,
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color 0.15s ease",
              }}
            >
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: theme.swatch1 }} />
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: theme.swatch2 }} />
              </div>
              <div style={{ fontSize: "13px", fontFamily: "'Lora', serif", fontWeight: "500", color: theme.textDark }}>
                {theme.name}
              </div>
              {local.theme === key && (
                <div style={{ fontSize: "11px", color: theme.primary, marginTop: "2px", fontFamily: "'Lora', serif" }}>
                  ✓ Active
                </div>
              )}
            </button>
          );
        })}
      </div>

      <SectionLabel>Timer style</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        {[["ring","🔵 Ring","Circular progress"],["bar","📊 Bar","Horizontal fill"],["wave","🌊 Wave","Rising water"],["pebble","🪨 Pebble","Shrinking shape"],["minimal","🔢 Minimal","Numbers only"]].map(([key, label, desc]) => (
          <button key={key} onClick={() => update("timerStyle", key)} style={{ padding: "12px 10px", borderRadius: "12px", border: `2px solid ${local.timerStyle === key ? C.primary : C.border}`, background: local.timerStyle === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", textAlign: "left", transition: "all 0.15s ease" }}>
            <div style={{ fontSize: "13px", color: local.timerStyle === key ? C.primary : C.textDark, fontWeight: "600", marginBottom: "2px" }}>{label}</div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>{desc}</div>
          </button>
        ))}
      </div>

      <SectionLabel>Budget display style</SectionLabel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
        {[["bars","📊 Bars","Progress bars"],["minimal","🔢 Minimal","Numbers only"],["bubbles","🫧 Bubbles","Circular fills"],["wave","🌊 Wave","Rising water"]].map(([key, label, desc]) => (
          <button key={key} onClick={() => update("budgetStyle", key)} style={{ padding: "12px 10px", borderRadius: "12px", border: `2px solid ${local.budgetStyle === key ? C.primary : C.border}`, background: local.budgetStyle === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", textAlign: "left", transition: "all 0.15s ease" }}>
            <div style={{ fontSize: "13px", color: local.budgetStyle === key ? C.primary : C.textDark, fontWeight: "600", marginBottom: "2px" }}>{label}</div>
            <div style={{ fontSize: "11px", color: C.textMuted }}>{desc}</div>
          </button>
        ))}
      </div>

      <SectionLabel>Defaults</SectionLabel>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "10px" }}>Opening screen</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[["setup","🪨 Timer"],["queue","🏁 Queue"],["budget","⏱️ Budget"],["breathing","🧘 Breathing"]].map(([key, label]) => (
            <button key={key} onClick={() => update("defaultLanding", key)} style={{ padding: "12px 10px", borderRadius: "12px", border: `2px solid ${local.defaultLanding === key ? C.primary : C.border}`, background: local.defaultLanding === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "13px", color: local.defaultLanding === key ? C.primary : C.textMid, fontWeight: local.defaultLanding === key ? "600" : "400", transition: "all 0.15s ease", textAlign: "center" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <SettingRow label="Simple mode" desc="Hide everything except the timer — for overwhelm days">
        <Toggle value={local.simpleMode || false} onChange={v => update("simpleMode", v)} C={C} />
      </SettingRow>

      <SettingRow label="Encouragement notes" desc="Gentle notes after each timer completes">
        <Toggle value={local.encouragement !== false} onChange={v => update("encouragement", v)} C={C} />
      </SettingRow>

      <SettingRow label="Prioritise my tasks" desc="Most used tasks float to the top of the list">
        <Toggle value={local.prioritiseTasks} onChange={v => update("prioritiseTasks", v)} C={C} />
      </SettingRow>

      <SettingRow label="Default timer type" desc="Opens to this mode each time">
        <select
          value={local.defaultTimerType}
          onChange={e => update("defaultTimerType", e.target.value)}
          style={{
            background: C.secondary, border: `1px solid ${C.borderMid}`,
            borderRadius: "8px", padding: "6px 10px",
            fontFamily: "'Lora', serif", fontSize: "13px",
            color: C.textDark, cursor: "pointer", outline: "none",
          }}
        >
          <option value="countdown">Countdown</option>
          <option value="stopwatch">Stopwatch</option>
          <option value="pomodoro">Pomodoro</option>
        </select>
      </SettingRow>


      <SectionLabel>Manage tasks</SectionLabel>

      <button
        onClick={() => setTasksOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: C.card, borderRadius: tasksOpen ? "12px 12px 0 0" : "12px",
          border: `1px solid ${C.border}`, borderBottom: tasksOpen ? "none" : `1px solid ${C.border}`,
          cursor: "pointer", marginBottom: tasksOpen ? "0" : "8px",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>Task list</div>
          <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>Hide built-in tasks or delete your custom ones</div>
        </div>
        <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>{tasksOpen ? "▲" : "▼"}</div>
      </button>

      {tasksOpen && <div style={{ background: C.card, borderRadius: "0 0 12px 12px", border: `1px solid ${C.border}`, borderTop: "none", overflow: "hidden", marginBottom: "8px" }}>
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
          Built-in tasks can be hidden. Your custom tasks can be deleted.
        </div>
        {SUGGESTED_TASKS.map((task, i) => {
          const hidden = (local.hiddenTasks || []).includes(task);
          return (
            <div key={task} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderTop: i > 0 ? `1px solid ${C.border}` : "none", opacity: hidden ? 0.45 : 1 }}>
              <span style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif" }}>{task}</span>
              <button
                onClick={() => {
                  const current = local.hiddenTasks || [];
                  const next = hidden ? current.filter(t => t !== task) : [...current, task];
                  update("hiddenTasks", next);
                }}
                style={{ fontSize: "12px", color: hidden ? C.primary : C.textMuted, background: "transparent", border: `1px solid ${hidden ? C.primary : C.borderMid}`, borderRadius: "20px", padding: "4px 12px", cursor: "pointer", fontFamily: "'Lora', serif", transition: "all 0.15s ease" }}
              >
                {hidden ? "Show" : "Hide"}
              </button>
            </div>
          );
        })}
        {(customTasks || []).map((task, i) => (
          <div key={task} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", borderTop: `1px solid ${C.border}` }}>
            <span style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif" }}>⭐ {task}</span>
            <button
              onClick={() => onDeleteCustomTask && onDeleteCustomTask(task)}
              style={{ fontSize: "12px", color: C.danger, background: "transparent", border: `1px solid ${C.danger}`, borderRadius: "20px", padding: "4px 12px", cursor: "pointer", fontFamily: "'Lora', serif" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>}


      <SectionLabel>Your data</SectionLabel>

      <div style={{ background: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "8px" }}>
        <div style={{ padding: "12px 16px", fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif", borderBottom: `1px solid ${C.border}` }}>
          Your data lives on this device only. Exporting saves a file you can re-import anytime to restore everything.
        </div>
        {[
          { key: "export", icon: "💾", label: "Export data", desc: "Save a backup file to your device", color: C.primary },
          { key: "import", icon: "📁", label: "Import data", desc: "Restore from a backup file", color: C.textDark },
          { key: "clear", icon: "🗑️", label: "Clear all data", desc: "Remove all timers, history and tasks", color: C.danger },
        ].map((item, i) => (
          <button
            key={item.key}
            onClick={() => setModal(item.key)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", background: "transparent", border: "none", borderTop: i > 0 ? `1px solid ${C.border}` : "none", cursor: "pointer", textAlign: "left" }}
          >
            <span style={{ fontSize: "24px" }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: "14px", color: item.color, fontFamily: "'Lora', serif", fontWeight: "600" }}>{item.label}</div>
              <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px", fontFamily: "'Lora', serif" }}>{item.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {modal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}>
          <div style={{ background: C.card, borderRadius: "20px", padding: "28px 24px", maxWidth: "400px", width: "100%", border: `1px solid ${C.border}` }}>
            {modal === "export" && (
              <div>
                <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "16px" }}>💾</div>
                <div style={{ fontSize: "20px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, textAlign: "center", marginBottom: "12px" }}>Export your data</div>
                <div style={{ fontSize: "14px", color: C.textMid, fontFamily: "'Lora', serif", textAlign: "center", marginBottom: "16px", lineHeight: "1.5" }}>
                  This will save a JSON file to your device containing all your history, tasks, queues and settings.
                </div>
                <div style={{ background: C.bg, borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px" }}>🔒</span>
                  <div style={{ fontSize: "12px", color: C.textMid, fontFamily: "'Lora', serif", lineHeight: "1.5" }}>
                    Your exported file is saved directly to your device and is never sent anywhere. We have no access to your data, we have never sought access to it, and we never will.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <PebbleButton onClick={() => setModal(null)} variant="secondary" C={C}>Cancel</PebbleButton>
                  <PebbleButton onClick={() => { onExport(); setModal(null); }} variant="primary" C={C}>Save backup</PebbleButton>
                </div>
              </div>
            )}
            {modal === "import" && (
              <div>
                <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "16px" }}>📁</div>
                <div style={{ fontSize: "20px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, textAlign: "center", marginBottom: "12px" }}>Import data</div>
                <div style={{ fontSize: "14px", color: C.textMid, fontFamily: "'Lora', serif", textAlign: "center", marginBottom: "16px", lineHeight: "1.5" }}>
                  This will replace your current history, tasks, queues and settings with those from a backup file.
                </div>
                <div style={{ background: C.bg, borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px" }}>🔒</span>
                  <div style={{ fontSize: "12px", color: C.textMid, fontFamily: "'Lora', serif", lineHeight: "1.5" }}>
                    Your backup file is read directly on your device and is never sent anywhere. Pebbletime is built on a simple principle: your personal data belongs to you, and only you.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <PebbleButton onClick={() => setModal(null)} variant="secondary" C={C}>Cancel</PebbleButton>
                  <PebbleButton onClick={() => { onImport(); setModal(null); }} variant="primary" C={C}>Choose file and restore</PebbleButton>
                </div>
              </div>
            )}
            {modal === "clear" && (
              <div>
                <div style={{ textAlign: "center", fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
                <div style={{ fontSize: "20px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, textAlign: "center", marginBottom: "12px" }}>Clear all data</div>
                <div style={{ fontSize: "14px", color: C.textMid, fontFamily: "'Lora', serif", textAlign: "center", marginBottom: "16px", lineHeight: "1.5" }}>
                  This will permanently remove all your history, tasks, queues and settings from this device. It cannot be undone, so you may want to save a backup first.
                </div>
                <div style={{ background: C.bg, borderRadius: "12px", padding: "12px 14px", marginBottom: "20px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "18px" }}>🔒</span>
                  <div style={{ fontSize: "12px", color: C.textMid, fontFamily: "'Lora', serif", lineHeight: "1.5" }}>
                    Your data exists only on this device. We have no access to it, we have never sought access to it, and we never will.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <PebbleButton onClick={() => setModal(null)} variant="secondary" C={C}>Cancel</PebbleButton>
                  <PebbleButton onClick={() => { onClearAll(); setModal(null); }} variant="danger" C={C}>Delete everything</PebbleButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}


// ─── GENTLE INSIGHT ───────────────────────────────────────────────────────────

function GentleInsight({ history, C }) {
  if (!history || history.length < 3) return null;

  const insights = [];
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const thisWeek = history.filter(e => now - e.completedAt < oneWeek);

  // How many this week
  if (thisWeek.length >= 2) {
    insights.push(`You've completed ${thisWeek.length} timers this week 🪨`);
  }

  // Average duration for most common task
  const taskCounts = {};
  history.forEach(e => { if (e.taskName !== "Timer") taskCounts[e.taskName] = (taskCounts[e.taskName] || 0) + 1; });
  const topTask = Object.entries(taskCounts).sort((a, b) => b[1] - a[1])[0];
  if (topTask) {
    const taskEntries = history.filter(e => e.taskName === topTask[0]);
    if (taskEntries.length >= 2) {
      const avg = Math.round(taskEntries.reduce((a, e) => a + e.duration, 0) / taskEntries.length);
      insights.push(`${topTask[0]} usually takes you around ${formatDuration(avg)}`);
    }
  }

  // Quickest recent task
  const recent = history.slice(0, 10).filter(e => e.taskName !== "Timer");
  if (recent.length >= 3) {
    const quickest = recent.reduce((a, b) => a.duration < b.duration ? a : b);
    insights.push(`Your quickest task lately was ${quickest.taskName} at ${formatDuration(quickest.duration)}`);
  }

  if (insights.length === 0) return null;

  // Pick one insight gently — rotate by day
  const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % insights.length;
  const insight = insights[idx];

  return (
    <div style={{
      background: C.card,
      borderRadius: "14px",
      border: `1px solid ${C.border}`,
      padding: "14px 16px",
      marginBottom: "20px",
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
    }}>
      <span style={{ fontSize: "16px", marginTop: "1px" }}>🌿</span>
      <div>
        <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>A gentle reflection</div>
        <div style={{ fontSize: "14px", color: C.textMid, fontFamily: "'Lora', serif", fontStyle: "italic", lineHeight: "1.5" }}>{insight}</div>
      </div>
    </div>
  );
}

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────

function SetupScreen({ onStart, history, customTasks, onAddCustomTask, settings, C, taskUsage }) {
  const [taskName, setTaskName] = useState("");
  const [timerType, setTimerType] = useState(settings.defaultTimerType);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [newCustomTask, setNewCustomTask] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [breathingPattern, setBreathingPattern] = useState(settings.breathingPattern || "4-4-4");

  const hidden = settings.hiddenTasks || [];
  const allTasks = (settings.prioritiseTasks
    ? [...SUGGESTED_TASKS, ...customTasks].sort((a, b) => (taskUsage[b] || 0) - (taskUsage[a] || 0))
    : [...SUGGESTED_TASKS, ...customTasks]
  ).filter(t => !hidden.includes(t));

  function handleStart() {
    const totalSeconds = timerType === "stopwatch" ? 0 : (minutes * 60 + seconds);
    fireAlert("start", settings);
    onStart({ taskName: taskName.trim() || "Timer", timerType, totalSeconds, breathingPattern });
  }

  function handleAddCustom() {
    if (!newCustomTask.trim()) return;
    onAddCustomTask(newCustomTask.trim());
    setNewCustomTask("");
    setShowAddTask(false);
  }

  function handlePillSelect(name) {
    setTaskName(name);
    setHistoryFilter(name);
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px" }}>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "12px" }}>
          What are you working on?
        </h2>
        <input
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Name your task (optional)..."
          style={{
            width: "100%", padding: "14px 18px", borderRadius: "14px",
            border: `2px solid ${taskName ? C.primary : C.border}`,
            background: C.card, fontSize: "16px",
            fontFamily: "'Lora', serif", color: C.textDark, outline: "none",
            boxSizing: "border-box", transition: "border-color 0.2s ease",
          }}
          onKeyDown={e => e.key === "Enter" && handleStart()}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
          {allTasks.map(t => (
            <TaskPill key={t} name={t} selected={taskName === t} onSelect={handlePillSelect} C={C} />
          ))}
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            style={{
              background: "transparent", border: `1px dashed ${C.borderMid}`, borderRadius: "100px",
              padding: "6px 14px", fontSize: "13px", color: C.textMuted, cursor: "pointer", fontFamily: "'Lora', serif",
            }}
          >
            + custom
          </button>
        </div>

        {showAddTask && (
          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <input
              value={newCustomTask}
              onChange={e => setNewCustomTask(e.target.value)}
              placeholder="New task name..."
              style={{
                flex: 1, padding: "8px 14px", borderRadius: "10px",
                border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif",
                fontSize: "13px", color: C.textDark, outline: "none", background: C.card,
              }}
              onKeyDown={e => e.key === "Enter" && handleAddCustom()}
            />
            <PebbleButton onClick={handleAddCustom} variant="primary" small C={C}>Save</PebbleButton>
          </div>
        )}
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "12px" }}>
          Timer type
        </h2>
        <div style={{ display: "flex", gap: "10px" }}>
          {[
            { id: "countdown", label: "Countdown", desc: "Set a limit" },
            { id: "stopwatch", label: "Stopwatch", desc: "Count up" },
            { id: "pomodoro", label: "Pomodoro", desc: "25 + break" },
            { id: "breathing", label: "Breathing", desc: "Guided breath" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTimerType(t.id)}
              style={{
                flex: 1, padding: "12px 8px", borderRadius: "14px",
                border: `2px solid ${timerType === t.id ? C.primary : C.border}`,
                background: timerType === t.id ? C.bg : C.card,
                cursor: "pointer", textAlign: "center", transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontSize: "13px", fontFamily: "'Lora', serif", fontWeight: "600", color: timerType === t.id ? C.primary : C.secondaryText }}>
                {t.label}
              </div>
              <div style={{ fontSize: "11px", color: C.textMuted, marginTop: "2px" }}>{t.desc}</div>
            </button>
          ))}
        </div>

        {timerType === "countdown" && (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", display: "block", marginBottom: "6px" }}>Minutes</label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="180"
                defaultValue={minutes}
                onFocus={e => e.target.select()}
                onBlur={e => {
                  const val = Math.max(0, Math.min(180, parseInt(e.target.value) || 0));
                  setMinutes(val);
                  e.target.value = String(val);
                }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "18px", color: C.textDark, outline: "none", background: C.card, boxSizing: "border-box", textAlign: "center" }}
              />
            </div>
            <div style={{ color: C.textMuted, fontSize: "20px", marginTop: "16px" }}>:</div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", display: "block", marginBottom: "6px" }}>Seconds</label>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                max="59"
                defaultValue={seconds}
                onFocus={e => e.target.select()}
                onBlur={e => {
                  const val = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
                  setSeconds(val);
                  e.target.value = String(val).padStart(2, "0");
                }}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "18px", color: C.textDark, outline: "none", background: C.card, boxSizing: "border-box", textAlign: "center" }}
              />
            </div>
          </div>
        )}

        {timerType === "pomodoro" && (
          <div style={{ marginTop: "12px", padding: "12px 16px", background: C.accentLight, borderRadius: "12px", fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
            25 minutes focus, then a 5 minute break. Repeat!
          </div>
        )}
        {timerType === "breathing" && (
          <div style={{ marginTop: "12px" }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              {Object.entries(BREATHING_PATTERNS).map(([key, p]) => (
                <button key={key} onClick={() => setBreathingPattern(key)} style={{ flex: 1, padding: "10px 6px", borderRadius: "10px", border: `2px solid ${(breathingPattern || settings.breathingPattern) === key ? C.primary : C.border}`, background: (breathingPattern || settings.breathingPattern) === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "12px", color: (breathingPattern || settings.breathingPattern) === key ? C.primary : C.textMid, transition: "all 0.15s ease", textAlign: "center" }}>
                  <div style={{ fontWeight: "600", marginBottom: "2px" }}>{key}</div>
                  <div style={{ fontSize: "10px", color: C.textMuted }}>{p.label}</div>
                </button>
              ))}
            </div>
            <div style={{ padding: "10px 14px", background: C.accentLight, borderRadius: "10px", fontSize: "12px", color: C.textMid, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
              Optional: set a duration below, or leave at 0 to run until you stop.
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
        <PebbleButton onClick={handleStart} variant="primary" disabled={timerType === "countdown" && minutes * 60 + seconds === 0} C={C}>
          Start timer
        </PebbleButton>
      </div>

      <GentleInsight history={history} C={C} />

      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", margin: 0 }}>
            History {historyFilter && `· ${historyFilter}`}
          </h2>
          <div style={{ display: "flex", gap: "8px" }}>
            {historyFilter && <PebbleButton onClick={() => setHistoryFilter(null)} variant="ghost" small C={C}>Show all</PebbleButton>}
            <PebbleButton onClick={() => setShowHistory(!showHistory)} variant="ghost" small C={C}>{showHistory ? "Hide" : "Show"}</PebbleButton>
          </div>
        </div>
        {showHistory && <TaskHistory history={history} taskName={historyFilter} C={C} />}
      </div>
    </div>
  );
}

// ─── TIMER SCREEN ─────────────────────────────────────────────────────────────

function TimerScreen({ config, onComplete, onCancel, settings, C }) {
  const { taskName, timerType, totalSeconds } = config;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [pomodoroPhase, setPomodoroPhase] = useState("focus");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const intervalRef = useRef(null);
  const soundedRef = useRef(false);
  const halfwayRef = useRef(false);
  const lastMinuteRef = useRef(false);
  const [warningState, setWarningState] = useState(null);

  const POMODORO_FOCUS = 25 * 60;
  const POMODORO_BREAK = 5 * 60;
  const currentTotal = timerType === "pomodoro" ? (pomodoroPhase === "focus" ? POMODORO_FOCUS : POMODORO_BREAK) : totalSeconds;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1;
          // Halfway alert
          if (timerType === "countdown" && currentTotal > 0 && !halfwayRef.current && next >= Math.floor(currentTotal / 2)) {
            halfwayRef.current = true;
            if (settings.halfwayAlert) {
              setWarningState("halfway");
              setTimeout(() => setWarningState(null), 2500);
              fireAlert("nudge", settings);
            }
          }
          // Last 60 seconds warning
          if (timerType === "countdown" && currentTotal > 90 && !lastMinuteRef.current && currentTotal - next <= 60) {
            lastMinuteRef.current = true;
            if (settings.lastMinuteWarning) {
              setWarningState("lastminute");
              setTimeout(() => setWarningState(w => w === "lastminute" ? null : w), 3000);
              fireAlert("warning", settings);
            }
          }
          if (timerType !== "stopwatch" && next >= currentTotal) {
            if (timerType === "pomodoro") {
              fireAlert("complete", settings);
              if (pomodoroPhase === "focus") {
                setPomodoroPhase("break");
                setPomodoroCount(c => c + 1);
                setElapsed(0);
                return 0;
              } else {
                setPomodoroPhase("focus");
                setElapsed(0);
                return 0;
              }
            } else {
              clearInterval(intervalRef.current);
              if (!soundedRef.current) {
                soundedRef.current = true;
                fireAlert("complete", settings);
                setWarningState(null);
              }
              return next;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, timerType, currentTotal, pomodoroPhase, settings.alertMode, settings.chimeStyle, settings.vibrationPattern]);

  const isFinished = timerType !== "stopwatch" && timerType !== "pomodoro" && elapsed >= currentTotal && currentTotal > 0;
  const displayTime = timerType === "stopwatch" ? elapsed : Math.max(0, currentTotal - elapsed);
  const progress = timerType === "stopwatch" ? 0 : currentTotal > 0 ? Math.min(1, elapsed / currentTotal) : 0;

  function handleDone() {
    setRunning(false);
    onComplete({ taskName, timerType, duration: elapsed, completedAt: Date.now() });
  }

  const phaseColor = pomodoroPhase === "break" ? C.water : C.primary;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif" }}>
          {timerType === "pomodoro" ? (pomodoroPhase === "focus" ? "Focus time" : "Break time") : timerType === "stopwatch" ? "Counting up" : "Counting down"}
        </span>
      </div>

      <div style={{ fontSize: "20px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, marginBottom: "40px" }}>
        {taskName}
      </div>

      {warningState && (
        <div style={{
          background: warningState === "lastminute" ? C.danger : C.accent,
          color: C.white,
          borderRadius: "12px",
          padding: "10px 18px",
          fontSize: "13px",
          fontFamily: "'Lora', serif",
          textAlign: "center",
          marginBottom: "16px",
          animation: "fadeIn 0.3s ease",
        }}>
          {warningState === "halfway" ? "Halfway there! 🪨" : "One minute left! ⏳"}
        </div>
      )}

      {(() => {
        const timeNode = (
          <div>
            <div style={{ fontSize: "48px", fontFamily: "'Lora', serif", fontWeight: "300", color: isFinished ? C.accent : (timerType === "pomodoro" ? phaseColor : running ? C.primary : C.textDark), letterSpacing: "-1px", lineHeight: 1, transition: settings.animations ? "color 0.3s ease" : "none" }}>
              {formatTime(displayTime)}
            </div>
            {isFinished && <div style={{ fontSize: "13px", color: C.accent, fontFamily: "'Lora', serif", marginTop: "6px" }}>Done! ✓</div>}
            {timerType === "pomodoro" && <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif", marginTop: "6px" }}>{pomodoroCount} {pomodoroCount === 1 ? "pomodoro" : "pomodoros"} done</div>}
          </div>
        );
        const style = settings.timerStyle || "ring";
        if (style === "bar") return (
          <div style={{ marginBottom: "40px", paddingTop: "40px" }}>
            <div style={{ fontSize: "48px", fontFamily: "'Lora', serif", fontWeight: "300", color: isFinished ? C.accent : running ? C.primary : C.textDark, letterSpacing: "-1px", textAlign: "center", marginBottom: "24px" }}>{formatTime(displayTime)}</div>
            <TimerBar progress={progress} active={running && !isFinished} C={C} animate={settings.animations} />
          </div>
        );
        if (style === "wave") return (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
            <TimerWave progress={progress} active={running && !isFinished} C={C} animate={settings.animations}>{timeNode}</TimerWave>
          </div>
        );
        if (style === "pebble") return (
          <div style={{ marginBottom: "40px" }}>
            <TimerPebble progress={progress} active={running && !isFinished} C={C} animate={settings.animations}>{timeNode}</TimerPebble>
          </div>
        );
        if (style === "minimal") return (
          <div style={{ marginBottom: "40px" }}>
            <TimerMinimal>{timeNode}</TimerMinimal>
          </div>
        );
        return (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px" }}>
            <RippleCircle active={running && !isFinished} progress={progress} size={240} C={C} animate={settings.animations}>{timeNode}</RippleCircle>
          </div>
        );
      })()}

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
        {!isFinished && <PebbleButton onClick={() => setRunning(r => !r)} variant="secondary" C={C}>{running ? "Pause" : "Resume"}</PebbleButton>}
        <PebbleButton onClick={handleDone} variant="primary" C={C}>{isFinished ? "Save & finish" : "Finish early"}</PebbleButton>
      </div>

      <PebbleButton onClick={onCancel} variant="ghost" small C={C}>Cancel</PebbleButton>

      {timerType !== "stopwatch" && (
        <div style={{ marginTop: "32px" }}>
          <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>Elapsed: {formatDuration(elapsed)}</div>
        </div>
      )}

      {running && !isFinished && (
        <div style={{ marginTop: "20px", padding: "10px 14px", background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px", maxWidth: "280px", margin: "20px auto 0" }}>
          <span style={{ fontSize: "14px" }}>💡</span>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", lineHeight: "1.4" }}>
            Keep your screen on so the timer doesn't stop.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── COMPLETION SCREEN ────────────────────────────────────────────────────────


// ─── ENCOURAGEMENT ────────────────────────────────────────────────────────────

const QUICK_NOTES = [
  "That was speedy! ⚡",
  "Blink and you'd miss it!",
  "Quick and done. Love that. 🪨",
  "In and out. Nice work!",
  "Fast mover! ⚡",
];

const LONG_NOTES = [
  "That took some staying power. Well done. 🌿",
  "You stuck with it. That matters. 🪨",
  "A long one! You did it though.",
  "That deserves a proper rest. Nice work. 🌿",
  "Solid effort on that one. 🪨",
];

const THEMED_NOTES = [
  { keywords: ["dish", "washing up", "wash up", "sink"], notes: [
    "The sink has been defeated. 🪨",
    "Clean dishes, clear mind. 🌿",
    "Future you will appreciate that. 🫧",
    "Squeaky clean. 🌿",
    "One of those tasks that's always worth doing. 🪨",
  ]},
  { keywords: ["read", "book"], notes: [
    "Words well spent. 🌿",
    "A little further in. 📖",
    "Time with a book is never wasted. 🪨",
    "Pages turned. 🌿",
    "Good for the brain, that. 📖",
  ]},
  { keywords: ["shower", "bath"], notes: [
    "Fresh start. 🌿",
    "Clean and ready. 🚿",
    "That always feels better after. 🪨",
    "Refreshed. 🌿",
  ]},
  { keywords: ["email", "inbox"], notes: [
    "Inbox: tamed. 📬",
    "You faced the emails. Respect. 🪨",
    "Correspondence handled. 🌿",
    "Nobody loves emails. You did them anyway. 📬",
    "The replies are out in the world now. 🪨",
  ]},
  { keywords: ["laundry", "washing"], notes: [
    "Clean clothes incoming. 🧺",
    "Future you has something to wear. 🌿",
    "The laundry didn't win today. 🪨",
    "Domestic legend. 🧺",
  ]},
  { keywords: ["cook", "meal", "dinner", "lunch", "breakfast", "food"], notes: [
    "Something good is coming. 🍳",
    "Feeding yourself is an act of care. 🌿",
    "Chef mode: activated. 🪨",
    "That smells good, probably. 🍳",
  ]},
  { keywords: ["tidy", "clean", "vacuum", "hoover", "wipe", "mop"], notes: [
    "Space cleared. 🌿",
    "A tidier space for a tidier mind. 🪨",
    "That room didn't tidy itself. 🌿",
    "Order restored. 🧹",
    "It all adds up. 🪨",
  ]},
  { keywords: ["exercise", "walk", "run", "gym", "workout", "stretch", "yoga"], notes: [
    "Body moved. That counts. 🌿",
    "Out and back. 🪨",
    "You moved and that's enough. 🌿",
    "Endorphins incoming. 🪨",
    "A body in motion. 🌿",
  ]},
  { keywords: ["meditat", "breathe", "breathing", "mindful"], notes: [
    "A little quieter now. 🌿",
    "That was for you. 🪨",
    "Stillness is a skill. 🌿",
    "Mind: visited. 🪨",
  ]},
  { keywords: ["dressed", "dressing", "get up", "getting up"], notes: [
    "Ready for the day. 🌿",
    "Dressed and out there. 🪨",
    "That's the first step done. 🌿",
  ]},
  { keywords: ["pet", "feed", "cat", "dog", "fish", "animal"], notes: [
    "Someone's very happy right now. 🐾",
    "Fed and loved. 🌿",
    "Good human. 🐾",
    "They noticed. They always notice. 🌿",
  ]},
  { keywords: ["plant", "water", "garden"], notes: [
    "They needed that. 🌿",
    "Green and growing. 🪨",
    "Good plant parent. 🌿",
  ]},
];

const GENERAL_NOTES = [
  "Showing up is enough. 🪨",
  "You did a thing today. That matters. 🌿",
  "Some days this is everything. 🪨",
  "One small thing done. 🌿",
  "You're here and you're trying. That's real. 🪨",
  "Not every day is easy. This one had something good in it. 🌿",
  "That took something. Well done. 🪨",
  "Quietly proud of you. 🌿",
  "You didn't have to, but you did. 🪨",
  "That's yours. You did that. 🌿",
  "Little by little. 🪨",
  "One thing at a time. You've got this. 🌿",
  "It's okay to go slow. You still got there. 🪨",
  "Every small thing counts more than it looks. 🌿",
  "You made something happen today. 🪨",
  "Be gentle with yourself. You're doing fine. 🌿",
  "That was worth doing. So were you. 🪨",
  "Task defeated. You win this round. 🪨",
  "Adulting: briefly achieved. 🌿",
  "You vs the task. You won. 🪨",
  "Somewhere, a to-do list weeps. 🌿",
  "The task had no idea who it was dealing with. 🪨",
  "You got out of bed. You did a thing. That's two wins. 🪨",
  "Sometimes the smallest tasks are the hardest. You did it anyway. 🌿",
  "Even on the tough days, you show up. 🪨",
  "This might have been hard to start. You started. 🌿",
  "Progress doesn't always look big. This counts. 🪨",
  "Whatever today has been, this was something good in it. 🌿",
  "You don't have to feel okay to do okay. 🪨",
  "That took more than it looks. 🌿",
  "You're allowed to take your time. 🌿",
  "No rush. You got there. 🪨",
  "There's no wrong way to do this. 🌿",
  "You set a timer and you used it. That's the whole thing. 🪨",
  "Not everything needs to be perfect. This was enough. 🌿",
  "Enough is enough. And that was enough. 🪨",
  "You don't have to do everything. You did something. 🌿",
  "Done at your own pace is still done. 🪨",
  "You're figuring it out. 🌿",
  "One task closer to rest. 🪨",
  "That one's behind you now. 🌿",
  "Crossed off, even if it's not on a list. 🪨",
  "The future version of you just got a little easier. 🌿",
  "That's real. You made something real happen. 🪨",
  "Something exists now that didn't before — a done thing. 🌿",
  "Tiny victory. Still a victory. 🪨",
  "You timed it, you did it, it's done. 🌿",
  "Mark that one off. 🪨",
  "Glad you did that. 🌿",
  "Rooting for you, always. 🪨",
  "You've got more in you than you think. 🌿",
  "I noticed. Good work. 🪨",
  "Still here, still going. That's something. 🌿",
  "Not alone in this. 🪨",
  "You're doing better than you think. 🌿",
  "Cheering quietly from over here. 🪨",
  "You're not invisible. This matters. 🌿",
  "Someone is glad you're doing okay. 🪨",
  "One stone placed. The path gets built. 🪨",
  "Quiet work. Real work. 🌿",
  "Not every good thing makes a sound. 🪨",
  "Gentle and done. 🌿",
];

function getEncouragementNote(duration, taskName) {
  const name = (taskName || "").toLowerCase();

  // Check themed pools first
  for (const theme of THEMED_NOTES) {
    if (theme.keywords.some(k => name.includes(k))) {
      // 60% chance to use themed note, 40% general so it stays fresh
      if (Math.random() < 0.6) {
        return theme.notes[Math.floor(Math.random() * theme.notes.length)];
      }
      break;
    }
  }

  // Duration-aware
  if (duration < 5 * 60) return QUICK_NOTES[Math.floor(Math.random() * QUICK_NOTES.length)];
  if (duration > 30 * 60) return LONG_NOTES[Math.floor(Math.random() * LONG_NOTES.length)];

  return GENERAL_NOTES[Math.floor(Math.random() * GENERAL_NOTES.length)];
}

function CompletionScreen({ entry, onContinue, onSaveMiscName, C, settings }) {
  const isUnnamed = entry.taskName === "Timer";
  const [miscName, setMiscName] = useState("");
  const [saved, setSaved] = useState(false);
  const [note] = useState(() => getEncouragementNote(entry.duration, entry.taskName));

  function handleSaveMisc() {
    if (!miscName.trim()) return;
    onSaveMiscName(miscName.trim());
    setSaved(true);
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: C.accentLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: "36px" }}>
        🪨
      </div>
      <h2 style={{ fontSize: "24px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, marginBottom: "8px" }}>
        {isUnnamed ? "Timer done!" : "Nice work!"}
      </h2>
      <p style={{ fontSize: "15px", color: C.textMid, fontFamily: "'Lora', serif", marginBottom: "8px" }}>
        {isUnnamed ? "Your timer" : entry.taskName} took you <strong style={{ color: C.primary }}>{formatDuration(entry.duration)}</strong>
      </p>
      {settings.encouragement !== false && (
        <p style={{ fontSize: "14px", color: C.textMuted, fontFamily: "'Lora', serif", fontStyle: "italic", marginBottom: "24px" }}>
          {note}
        </p>
      )}

      {isUnnamed && !saved && (
        <div style={{ background: C.card, borderRadius: "16px", padding: "16px", border: `1px solid ${C.border}`, marginBottom: "16px", textAlign: "left" }}>
          <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "8px" }}>
            Want to name this timer? It'll be saved under Misc.
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              value={miscName}
              onChange={e => setMiscName(e.target.value)}
              placeholder="e.g. Reading, Stretching..."
              onKeyDown={e => e.key === "Enter" && handleSaveMisc()}
              style={{ flex: 1, padding: "8px 12px", borderRadius: "10px", border: `1px solid ${miscName ? C.primary : C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "14px", color: C.textDark, outline: "none", background: C.bg }}
            />
            <PebbleButton onClick={handleSaveMisc} variant="primary" small C={C} disabled={!miscName.trim()}>
              Save
            </PebbleButton>
          </div>
        </div>
      )}

      {saved && (
        <div style={{ background: C.card, borderRadius: "16px", padding: "14px 16px", border: `1px solid ${C.border}`, marginBottom: "16px", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "18px" }}>✓</span>
          <div>
            <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{miscName}</div>
            <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>Saved to Misc · {formatDuration(entry.duration)}</div>
          </div>
        </div>
      )}

      {!isUnnamed && (
        <div style={{ background: C.card, borderRadius: "16px", padding: "16px", border: `1px solid ${C.border}`, marginBottom: "24px", textAlign: "left" }}>
          <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Saved to history</div>
          <div style={{ fontSize: "15px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{entry.taskName}</div>
          <div style={{ fontSize: "13px", color: C.primary, fontFamily: "'Lora', serif", marginTop: "2px" }}>{formatDuration(entry.duration)} · {entry.timerType}</div>
        </div>
      )}

      <div style={{ marginBottom: "16px" }} />
      <PebbleButton onClick={onContinue} variant="primary" C={C}>Start another</PebbleButton>
    </div>
  );
}


// ─── QUEUE BUILDER SCREEN ─────────────────────────────────────────────────────

function QueueBuilderScreen({ customTasks, onStart, onSave, savedQueues, C, settings, taskUsage, queueHistory }) {
  const hiddenQ = settings.hiddenTasks || [];
  const allTasks = (settings.prioritiseTasks
    ? [...SUGGESTED_TASKS, ...customTasks].sort((a, b) => (taskUsage[b] || 0) - (taskUsage[a] || 0))
    : [...SUGGESTED_TASKS, ...customTasks]
  ).filter(t => !hiddenQ.includes(t));
  const [queueName, setQueueName] = useState("");
  const [queueIcon, setQueueIcon] = useState("\u{1F4CB}");
  const [tasks, setTasks] = useState([{ name: "", minutes: 5, seconds: 0 }]);
  const [loadedId, setLoadedId] = useState(null);
  const [showLibrary, setShowLibrary] = useState(true);
  const [queueTab, setQueueTab] = useState("library");
  const [schedulingId, setSchedulingId] = useState(null);

  const allQueues = [
    ...PRESET_QUEUES,
    ...savedQueues.filter(q => !PRESET_QUEUES.find(p => p.id === q.id)),
  ];

  function addTask() {
    setTasks(t => [...t, { name: "", minutes: 5, seconds: 0 }]);
  }

  function removeTask(i) {
    setTasks(t => t.filter((_, idx) => idx !== i));
  }

  function updateTask(i, field, val) {
    setTasks(t => t.map((task, idx) => idx === i ? { ...task, [field]: val } : task));
  }

  function moveTask(i, dir) {
    setTasks(t => {
      const next = [...t];
      const swap = i + dir;
      if (swap < 0 || swap >= next.length) return t;
      [next[i], next[swap]] = [next[swap], next[i]];
      return next;
    });
  }

  function loadQueue(q) {
    setQueueName(q.name);
    setQueueIcon(q.icon || "\u{1F4CB}");
    setTasks(q.tasks.map(t => ({ ...t })));
    setLoadedId(q.id);
    setShowLibrary(false);
  }

  function handleSave() {
    if (!queueName.trim() || tasks.some(t => !t.name.trim())) return;
    const q = {
      id: loadedId || `custom_${Date.now()}`,
      name: queueName.trim(),
      icon: queueIcon,
      tasks: tasks.map(t => ({ name: t.name.trim(), minutes: t.minutes, seconds: t.seconds })),
    };
    onSave(q);
  }

  function handleStart() {
    if (!tasks.some(t => t.name.trim())) return;
    const validTasks = tasks.filter(t => t.name.trim());
    fireAlert("start", settings);
    onStart({
      queueName: queueName.trim() || "Queue",
      queueIcon: queueIcon,
      tasks: validTasks,
      queueId: loadedId || null,
    });
  }

  const totalSeconds = tasks.reduce((a, t) => a + t.minutes * 60 + t.seconds, 0);
  const totalMins = Math.floor(totalSeconds / 60);
  const validTasks = tasks.filter(t => t.name.trim());

  const ICONS = ["\u{1F4CB}", "\u{1F305}", "\u{1F9F9}", "\u{1F4BB}", "\u{1F3C3}", "\u{1F37D}", "\u{1F4DA}", "\u{1F33F}"];

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px 40px" }}>

      {/* Tab bar */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {[["library","🏁 Queues"],["history","📋 History"]].map(([tab, label]) => (
          <button key={tab} onClick={() => setQueueTab(tab)} style={{ flex: 1, padding: "10px", borderRadius: "10px", border: `2px solid ${queueTab === tab ? C.primary : C.border}`, background: queueTab === tab ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "13px", color: queueTab === tab ? C.primary : C.textMid, fontWeight: queueTab === tab ? "600" : "400", transition: "all 0.15s ease" }}>
            {label}
          </button>
        ))}
      </div>

      {queueTab === "history" && (
        <div>
          {(!queueHistory || queueHistory.length === 0) ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: C.textMuted, fontFamily: "'Lora', serif", fontStyle: "italic", fontSize: "14px" }}>
              No queue runs yet. Start a queue to see your history here! 🏁
            </div>
          ) : (
            queueHistory.slice(0, 20).map((run, i) => {
              const totalPlanned = run.tasks.reduce((a, t) => a + t.planned, 0);
              const totalActual = run.tasks.reduce((a, t) => a + t.duration, 0);
              const diff = totalActual - totalPlanned;
              return (
                <div key={i} style={{ background: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, marginBottom: "10px", overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "20px" }}>{run.queueIcon || "🏁"}</span>
                      <div>
                        <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{run.queueName}</div>
                        <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginTop: "2px" }}>{formatDate(run.completedAt)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "14px", color: C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(totalActual)}</div>
                      <div style={{ fontSize: "11px", color: diff > 60 ? C.danger : C.textMuted, fontFamily: "'Lora', serif" }}>
                        {diff > 0 ? "+" : ""}{formatDuration(Math.abs(diff))} {diff > 60 ? "over" : diff < -60 ? "under" : "on time"}
                      </div>
                    </div>
                  </div>
                  {run.tasks.map((t, j) => (
                    <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderTop: j > 0 ? `1px solid ${C.border}` : "none" }}>
                      <span style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif" }}>{t.name}</span>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "13px", color: C.primary, fontFamily: "'Lora', serif" }}>{formatDuration(t.duration)}</span>
                        <span style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginLeft: "6px" }}>/ {formatDuration(t.planned)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}

      {queueTab === "library" && showLibrary && (() => {
        const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
        const todaysQueues = allQueues.filter(q => q.schedule && q.schedule.includes(todayIdx));
        return (
        <div style={{ marginBottom: "28px" }}>
          {todaysQueues.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "10px" }}>Today</div>
              {todaysQueues.map(q => (
                <div key={q.id} style={{ background: C.card, borderRadius: "14px", border: `2px solid ${C.primary}`, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{q.icon}</span>
                    <div>
                      <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{q.name}</div>
                      <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{q.tasks.length} tasks · {Math.floor(q.tasks.reduce((a, t) => a + t.minutes * 60 + t.seconds, 0) / 60)}m</div>
                    </div>
                  </div>
                  <PebbleButton onClick={() => { fireAlert("start", settings); onStart({ queueName: q.name, queueIcon: q.icon, tasks: q.tasks, queueId: q.id }); }} variant="primary" small C={C}>
                    Start →
                  </PebbleButton>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", margin: 0 }}>
              Queue library
            </h2>
            <button onClick={() => setShowLibrary(false)} style={{ fontSize: "12px", color: C.textMuted, background: "transparent", border: "none", cursor: "pointer", fontFamily: "'Lora', serif" }}>
              + build new
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {allQueues.map(q => {
              const qTotal = q.tasks.reduce((a, t) => a + t.minutes * 60 + t.seconds, 0);
              return (
                <div key={q.id}>
                <div style={{ background: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>{q.icon}</span>
                    <div>
                      <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500" }}>{q.name}</div>
                      <div style={{ fontSize: "12px", color: C.textMuted, marginTop: "2px" }}>{q.tasks.length} tasks · {Math.floor(qTotal / 60)}m total</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <PebbleButton onClick={() => { loadQueue(q); fireAlert("start", settings); onStart({ queueName: q.name, queueIcon: q.icon, tasks: q.tasks, queueId: q.id }); }} variant="primary" small C={C}>
                      Start
                    </PebbleButton>
                    <PebbleButton onClick={() => loadQueue(q)} variant="ghost" small C={C}>
                      Edit
                    </PebbleButton>
                    <PebbleButton onClick={() => setSchedulingId(schedulingId === q.id ? null : q.id)} variant="ghost" small C={C}>
                      🗓️
                    </PebbleButton>
                  </div>
                </div>

                {schedulingId === q.id && (
                  <div style={{ marginTop: "10px", padding: "12px 14px", background: C.bg, borderRadius: "10px", border: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Repeat on</div>
                    <div style={{ display: "flex", gap: "6px", marginBottom: "10px" }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, di) => {
                        const days = q.schedule || [];
                        const active = days.includes(di);
                        return (
                          <button key={day} onClick={() => {
                            const current = q.schedule || [];
                            const next = active ? current.filter(d => d !== di) : [...current, di];
                            onSave({ ...q, schedule: next });
                          }} style={{ flex: 1, padding: "6px 2px", borderRadius: "8px", border: `2px solid ${active ? C.primary : C.border}`, background: active ? C.primary : C.card, color: active ? C.white : C.textMuted, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "11px", fontWeight: active ? "600" : "400", transition: "all 0.15s ease" }}>
                            {day}
                          </button>
                        );
                      })}
                    </div>
                    {q.schedule && q.schedule.length > 0 && (
                      <div style={{ fontSize: "12px", color: C.primary, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                        Scheduled for {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].filter((_, i) => q.schedule.includes(i)).join(", ")}
                      </div>
                    )}
                    {(!q.schedule || q.schedule.length === 0) && (
                      <div style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif", fontStyle: "italic" }}>
                        No days selected — tap days to schedule
                      </div>
                    )}
                  </div>
                )}
                </div>
              );
            })}
          </div>
        </div>
        );
      })()}

      {queueTab === "library" && !showLibrary && (
        <div>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "12px" }}>
              Queue name
            </h2>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
              {ICONS.map(icon => (
                <button key={icon} onClick={() => setQueueIcon(icon)} style={{ fontSize: "20px", background: queueIcon === icon ? C.secondary : "transparent", border: `2px solid ${queueIcon === icon ? C.primary : "transparent"}`, borderRadius: "8px", padding: "4px", cursor: "pointer" }}>
                  {icon}
                </button>
              ))}
            </div>
            <input
              value={queueName}
              onChange={e => setQueueName(e.target.value)}
              placeholder="e.g. Morning Routine"
              style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: `2px solid ${queueName ? C.primary : C.border}`, background: C.card, fontSize: "15px", fontFamily: "'Lora', serif", color: C.textDark, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "12px" }}>
            Tasks
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {tasks.map((task, i) => (
              <div key={i} style={{ background: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <button onClick={() => moveTask(i, -1)} disabled={i === 0} style={{ background: "transparent", border: "none", cursor: i === 0 ? "default" : "pointer", color: i === 0 ? C.border : C.textMuted, fontSize: "12px", padding: "1px 4px", lineHeight: 1 }}>▲</button>
                    <button onClick={() => moveTask(i, 1)} disabled={i === tasks.length - 1} style={{ background: "transparent", border: "none", cursor: i === tasks.length - 1 ? "default" : "pointer", color: i === tasks.length - 1 ? C.border : C.textMuted, fontSize: "12px", padding: "1px 4px", lineHeight: 1 }}>▼</button>
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      value={task.name}
                      onChange={e => updateTask(i, "name", e.target.value)}
                      placeholder="Task name..."
                      list={`tasklist_${i}`}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: `1px solid ${task.name ? C.primary : C.borderMid}`, background: C.bg, fontSize: "14px", fontFamily: "'Lora', serif", color: C.textDark, outline: "none", boxSizing: "border-box" }}
                    />
                    <datalist id={`tasklist_${i}`}>
                      {allTasks.map(t => <option key={t} value={t} />)}
                    </datalist>
                  </div>
                  <button onClick={() => removeTask(i)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "16px", padding: "4px" }}>×</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingLeft: "28px" }}>
                  <input
                    type="number" min="0" max="180" value={task.minutes}
                    onChange={e => updateTask(i, "minutes", Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: "60px", padding: "6px 8px", borderRadius: "8px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "14px", color: C.textDark, outline: "none", background: C.bg, textAlign: "center" }}
                  />
                  <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>min</span>
                  <input
                    type="number" min="0" max="59" value={task.seconds}
                    onChange={e => updateTask(i, "seconds", Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    style={{ width: "60px", padding: "6px 8px", borderRadius: "8px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "14px", color: C.textDark, outline: "none", background: C.bg, textAlign: "center" }}
                  />
                  <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>sec</span>
                </div>
              </div>
            ))}
          </div>

          <button onClick={addTask} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: `1px dashed ${C.borderMid}`, background: "transparent", color: C.textMuted, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "13px", marginBottom: "16px" }}>
            + Add task
          </button>

          {totalMins > 0 && (
            <div style={{ background: C.accentLight, borderRadius: "12px", padding: "10px 16px", marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif" }}>Total time</span>
              <span style={{ fontSize: "13px", color: C.accent, fontFamily: "'Lora', serif", fontWeight: "600" }}>{totalMins}m {totalSeconds % 60 > 0 ? `${totalSeconds % 60}s` : ""}</span>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "16px" }}>
            <PebbleButton onClick={handleSave} variant="ghost" C={C} disabled={!queueName.trim() || validTasks.length === 0}>
              Save queue
            </PebbleButton>
            <PebbleButton onClick={handleStart} variant="primary" C={C} disabled={validTasks.length === 0}>
              Start race 🏁
            </PebbleButton>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => setShowLibrary(true)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: "'Lora', serif" }}>
              ← Back to library
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── QUEUE RUNNER SCREEN ──────────────────────────────────────────────────────

function QueueRunnerScreen({ config, onComplete, onCancel, settings, C }) {
  const { queueName, queueIcon, tasks, queueId } = config;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [taskResults, setTaskResults] = useState([]);
  const intervalRef = useRef(null);
  const soundedRef = useRef(false);
  const halfwayRef = useRef(false);
  const lastMinuteRef = useRef(false);
  const [warningState, setWarningState] = useState(null);

  const currentTask = tasks[currentIdx];
  const currentTotal = currentTask.minutes * 60 + currentTask.seconds;
  const isLastTask = currentIdx === tasks.length - 1;
  const isFinished = elapsed >= currentTotal && currentTotal > 0;
  const displayTime = Math.max(0, currentTotal - elapsed);
  const progress = currentTotal > 0 ? Math.min(1, elapsed / currentTotal) : 0;

  useEffect(() => {
    soundedRef.current = false;
    halfwayRef.current = false;
    lastMinuteRef.current = false;
    setWarningState(null);
    setElapsed(0);
  }, [currentIdx]);

  useEffect(() => {
    if (running && !isFinished) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1;
          if (!halfwayRef.current && next >= Math.floor(currentTotal / 2) && settings.halfwayAlert) {
            halfwayRef.current = true;
            setWarningState("halfway");
            setTimeout(() => setWarningState(null), 2500);
            fireAlert("nudge", settings);
          }
          if (!lastMinuteRef.current && currentTotal > 90 && currentTotal - next <= 60 && settings.lastMinuteWarning) {
            lastMinuteRef.current = true;
            setWarningState("lastminute");
            setTimeout(() => setWarningState(w => w === "lastminute" ? null : w), 3000);
            fireAlert("warning", settings);
          }
          if (next >= currentTotal) {
            clearInterval(intervalRef.current);
            if (!soundedRef.current) {
              soundedRef.current = true;
              fireAlert("complete", settings);
              setWarningState(null);
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, currentIdx, currentTotal, settings]);

  function advanceTask(overrideElapsed) {
    const duration = overrideElapsed !== undefined ? overrideElapsed : elapsed;
    const result = { name: currentTask.name, duration, planned: currentTotal, completedAt: Date.now() };
    const newResults = [...taskResults, result];
    setTaskResults(newResults);

    if (isLastTask || overrideElapsed === undefined && isLastTask) {
      onComplete({ queueName, queueIcon, queueId, tasks: newResults, completedAt: Date.now() });
    } else {
      setCurrentIdx(i => i + 1);
      setRunning(true);
      fireAlert("start", settings);
    }
  }

  function handleNext() {
    clearInterval(intervalRef.current);
    const duration = elapsed;
    const result = { name: currentTask.name, duration, planned: currentTotal, completedAt: Date.now() };
    const newResults = [...taskResults, result];
    setTaskResults(newResults);
    if (isLastTask) {
      onComplete({ queueName, queueIcon, queueId, tasks: newResults, completedAt: Date.now() });
    } else {
      setCurrentIdx(i => i + 1);
      setRunning(true);
      fireAlert("start", settings);
    }
  }

  useEffect(() => {
    if (isFinished && running) {
      setRunning(false);
    }
  }, [isFinished]);

  const totalPlanned = tasks.reduce((a, t) => a + t.minutes * 60 + t.seconds, 0);
  const totalElapsed = taskResults.reduce((a, r) => a + r.duration, 0) + elapsed;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ marginBottom: "6px" }}>
        <span style={{ fontSize: "20px" }}>{queueIcon}</span>
        <div style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif", marginTop: "2px" }}>{queueName}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "24px" }}>
        {tasks.map((t, i) => (
          <div key={i} style={{ width: "28px", height: "4px", borderRadius: "2px", background: i < currentIdx ? C.primary : i === currentIdx ? C.primaryLight : C.border, transition: "background 0.3s ease" }} />
        ))}
      </div>

      <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "6px" }}>
        Task {currentIdx + 1} of {tasks.length}
      </div>
      <div style={{ fontSize: "20px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, marginBottom: "28px" }}>
        {currentTask.name}
      </div>

      {warningState && (
        <div style={{ background: warningState === "lastminute" ? C.danger : C.accent, color: C.white, borderRadius: "12px", padding: "10px 18px", fontSize: "13px", fontFamily: "'Lora', serif", textAlign: "center", marginBottom: "16px", animation: "fadeIn 0.3s ease" }}>
          {warningState === "halfway" ? "Halfway there! \u{1FA92}" : "One minute left! \u{23F3}"}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
        <RippleCircle active={running && !isFinished} progress={progress} size={220} C={C} animate={settings.animations}>
          <div>
            <div style={{ fontSize: "44px", fontFamily: "'Lora', serif", fontWeight: "300", color: isFinished ? C.accent : running ? C.primary : C.textDark, letterSpacing: "-1px", lineHeight: 1 }}>
              {formatTime(displayTime)}
            </div>
            {isFinished && <div style={{ fontSize: "13px", color: C.accent, fontFamily: "'Lora', serif", marginTop: "6px" }}>Done! ✓</div>}
          </div>
        </RippleCircle>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
        {!isFinished && (
          <PebbleButton onClick={() => setRunning(r => !r)} variant="secondary" C={C}>
            {running ? "Pause" : "Resume"}
          </PebbleButton>
        )}
        <PebbleButton onClick={handleNext} variant="primary" C={C}>
          {isFinished ? (isLastTask ? "Finish 🏁" : "Next task →") : (isLastTask ? "Finish early" : "Skip →")}
        </PebbleButton>
      </div>

      <PebbleButton onClick={onCancel} variant="ghost" small C={C}>Cancel queue</PebbleButton>
      {running && (
        <div style={{ marginTop: "20px", padding: "10px 14px", background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px", maxWidth: "280px", margin: "20px auto 0" }}>
          <span style={{ fontSize: "14px" }}>💡</span>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", lineHeight: "1.4" }}>
            Keep your screen on so the timer doesn't stop.
          </div>
        </div>
      )}

      <div style={{ marginTop: "24px", padding: "14px 16px", background: C.card, borderRadius: "14px", border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Coming up</div>
        {tasks.slice(currentIdx + 1, currentIdx + 3).map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif" }}>{t.name}</span>
            <span style={{ fontSize: "13px", color: C.textMuted, fontFamily: "'Lora', serif" }}>{t.minutes}m{t.seconds > 0 ? ` ${t.seconds}s` : ""}</span>
          </div>
        ))}
        {tasks.slice(currentIdx + 1).length === 0 && (
          <div style={{ fontSize: "13px", color: C.textMuted, fontFamily: "'Lora', serif", fontStyle: "italic" }}>Last task!</div>
        )}
      </div>
    </div>
  );
}

// ─── QUEUE COMPLETION SCREEN ──────────────────────────────────────────────────

function QueueCompletionScreen({ result, onContinue, C }) {
  const totalPlanned = result.tasks.reduce((a, t) => a + t.planned, 0);
  const totalActual = result.tasks.reduce((a, t) => a + t.duration, 0);
  const diff = totalActual - totalPlanned;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px 40px", textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏁</div>
      <h2 style={{ fontSize: "24px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, marginBottom: "4px" }}>
        Queue complete!
      </h2>
      <p style={{ fontSize: "14px", color: C.textMid, fontFamily: "'Lora', serif", marginBottom: "24px" }}>
        {result.queueIcon} {result.queueName}
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <div style={{ flex: 1, background: C.card, borderRadius: "14px", padding: "14px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Planned</div>
          <div style={{ fontSize: "18px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(totalPlanned)}</div>
        </div>
        <div style={{ flex: 1, background: C.card, borderRadius: "14px", padding: "14px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Actual</div>
          <div style={{ fontSize: "18px", color: C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(totalActual)}</div>
        </div>
        <div style={{ flex: 1, background: diff > 0 ? C.accentLight : C.card, borderRadius: "14px", padding: "14px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Diff</div>
          <div style={{ fontSize: "18px", color: diff > 60 ? C.danger : diff < -60 ? C.water : C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>
            {diff > 0 ? "+" : ""}{formatDuration(Math.abs(diff))}
          </div>
        </div>
      </div>

      <div style={{ background: C.card, borderRadius: "14px", border: `1px solid ${C.border}`, marginBottom: "24px", overflow: "hidden" }}>
        {result.tasks.map((t, i) => {
          const taskDiff = t.duration - t.planned;
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif" }}>{t.name}</div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "14px", color: C.primary, fontFamily: "'Lora', serif", fontWeight: "500" }}>{formatDuration(t.duration)}</div>
                <div style={{ fontSize: "11px", color: taskDiff > 30 ? C.danger : C.textMuted, fontFamily: "'Lora', serif" }}>
                  {taskDiff > 0 ? "+" : ""}{formatDuration(Math.abs(taskDiff))} {taskDiff > 30 ? "over" : taskDiff < -30 ? "under" : "on time"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <PebbleButton onClick={onContinue} variant="primary" C={C}>Back to queues</PebbleButton>
    </div>
  );
}


// ─── ONBOARDING ───────────────────────────────────────────────────────────────

const ONBOARDING_SLIDES = [
  {
    icon: "🪨",
    title: "Welcome to Pebbletime",
    body: "A gentle timer for everyday tasks. No pressure, no scores. Just you and your time.",
  },
  {
    icon: "⏱️",
    title: "Time your tasks",
    body: "Name a task, set a time, and go. Over time you'll learn how long things actually take you — which is surprisingly useful.",
  },
  {
    icon: "🏁",
    title: "Race through queues",
    body: "Chain tasks together and run them one after another. Great for routines like mornings, cleaning, or winding down.",
  },
  {
    icon: "🌿",
    title: "It's all yours",
    body: "Everything stays on your device. No accounts, no tracking, no data sent anywhere. Ever.",
  },
];

function OnboardingScreen({ onDone, C }) {
  const [idx, setIdx] = useState(0);
  const slide = ONBOARDING_SLIDES[idx];
  const isLast = idx === ONBOARDING_SLIDES.length - 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "'Lora', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ maxWidth: "360px", width: "100%", textAlign: "center" }}>

        <div style={{ fontSize: "64px", marginBottom: "28px", lineHeight: 1 }}>{slide.icon}</div>

        <h1 style={{ fontSize: "22px", fontWeight: "600", color: C.textDark, marginBottom: "16px", lineHeight: 1.3 }}>
          {slide.title}
        </h1>

        <p style={{ fontSize: "15px", color: C.textMid, lineHeight: 1.7, marginBottom: "48px", fontStyle: "italic" }}>
          {slide.body}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "36px" }}>
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} style={{ width: i === idx ? "20px" : "6px", height: "6px", borderRadius: "3px", background: i === idx ? C.primary : C.border, transition: "all 0.3s ease" }} />
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <PebbleButton onClick={() => isLast ? onDone() : setIdx(i => i + 1)} variant="primary" C={C}>
            {isLast ? "Get started 🪨" : "Next →"}
          </PebbleButton>

          {!isLast && (
            <button
              onClick={onDone}
              style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: "'Lora', serif", padding: "8px" }}
            >
              Skip
            </button>
          )}
        </div>

      </div>
    </div>
  );
}



// ─── TIMER VISUALS ────────────────────────────────────────────────────────────

function TimerBar({ progress, active, C, animate }) {
  return (
    <div style={{ width: "100%", maxWidth: "280px", margin: "0 auto" }}>
      <div style={{ height: "12px", borderRadius: "6px", background: C.border, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: `${progress * 100}%`,
          borderRadius: "6px",
          background: active ? C.primary : C.borderMid,
          transition: animate ? "width 0.5s ease, background 0.3s ease" : "none",
        }} />
      </div>
    </div>
  );
}

function TimerWave({ progress, active, C, animate, children }) {
  const fill = progress * 100;
  return (
    <div style={{ position: "relative", width: "200px", height: "200px", borderRadius: "50%", overflow: "hidden", border: `4px solid ${C.border}`, margin: "0 auto" }}>
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: `${fill}%`,
        background: active ? C.primary : C.borderMid,
        transition: animate ? "height 0.8s ease, background 0.3s ease" : "none",
        opacity: 0.4,
      }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

function TimerMinimal({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "160px" }}>
      {children}
    </div>
  );
}

function TimerPebble({ progress, active, C, animate, children }) {
  const scale = 0.4 + (1 - progress) * 0.6;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "220px" }}>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          width: "200px",
          height: "180px",
          borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
          background: active ? C.primary : C.borderMid,
          opacity: 0.25,
          transform: `scale(${scale})`,
          transition: animate ? "transform 0.8s ease, background 0.3s ease" : "none",
          position: "absolute",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── BREATHING TIMER ──────────────────────────────────────────────────────────

const BREATHING_PATTERNS = {
  "4-4-4": { label: "Box breathing", phases: [
    { name: "Breathe in", duration: 4, scale: 1.3 },
    { name: "Hold", duration: 4, scale: 1.3 },
    { name: "Breathe out", duration: 4, scale: 0.85 },
  ]},
  "4-7-8": { label: "Relaxing breath", phases: [
    { name: "Breathe in", duration: 4, scale: 1.3 },
    { name: "Hold", duration: 7, scale: 1.3 },
    { name: "Breathe out", duration: 8, scale: 0.85 },
  ]},
  "5-5": { label: "Simple breath", phases: [
    { name: "Breathe in", duration: 5, scale: 1.3 },
    { name: "Breathe out", duration: 5, scale: 0.85 },
  ]},
};

function BreathingTimerScreen({ config, onComplete, onCancel, settings, C }) {
  const pattern = BREATHING_PATTERNS[config.breathingPattern] || BREATHING_PATTERNS["4-4-4"];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const intervalRef = useRef(null);
  const totalDuration = config.totalSeconds || 0;

  const phase = pattern.phases[phaseIdx];

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setPhaseElapsed(e => {
          const next = e + 1;
          setTotalElapsed(t => t + 1);
          if (next >= phase.duration) {
            const nextIdx = (phaseIdx + 1) % pattern.phases.length;
            if (nextIdx === 0) setCycles(c => c + 1);
            setPhaseIdx(nextIdx);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phaseIdx, phase.duration]);

  useEffect(() => {
    if (totalDuration > 0 && totalElapsed >= totalDuration) {
      setRunning(false);
      onComplete({ taskName: config.taskName, timerType: "breathing", duration: totalElapsed, completedAt: Date.now() });
    }
  }, [totalElapsed, totalDuration]);

  const phaseProgress = phase.duration > 0 ? phaseElapsed / phase.duration : 0;
  const currentScale = phase.scale === 1.3
    ? 0.85 + phaseProgress * 0.45
    : 1.3 - phaseProgress * 0.45;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "8px" }}>
        {pattern.label}
      </div>
      <div style={{ fontSize: "18px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, marginBottom: "40px" }}>
        {config.taskName !== "Timer" ? config.taskName : "Breathing"}
      </div>

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "240px", marginBottom: "24px" }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: "160px", height: "160px", borderRadius: "50%",
            background: C.primary, opacity: 0.2,
            transform: `scale(${currentScale})`,
            transition: "transform 0.5s ease",
            position: "absolute",
          }} />
          <div style={{
            width: "120px", height: "120px", borderRadius: "50%",
            background: C.primary, opacity: 0.15,
            transform: `scale(${currentScale * 0.85})`,
            transition: "transform 0.5s ease",
            position: "absolute",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: "22px", fontFamily: "'Lora', serif", fontWeight: "500", color: C.primary, marginBottom: "4px" }}>
              {phase.name}
            </div>
            <div style={{ fontSize: "36px", fontFamily: "'Lora', serif", fontWeight: "300", color: C.textDark }}>
              {phase.duration - phaseElapsed}
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: "13px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "32px" }}>
        {cycles} {cycles === 1 ? "cycle" : "cycles"} complete
        {totalDuration > 0 && ` · ${formatTime(Math.max(0, totalDuration - totalElapsed))} remaining`}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "16px" }}>
        <PebbleButton onClick={() => setRunning(r => !r)} variant="secondary" C={C}>
          {running ? "Pause" : "Resume"}
        </PebbleButton>
        <PebbleButton onClick={() => { setRunning(false); onComplete({ taskName: config.taskName, timerType: "breathing", duration: totalElapsed, completedAt: Date.now() }); }} variant="primary" C={C}>
          Finish
        </PebbleButton>
      </div>
      <PebbleButton onClick={onCancel} variant="ghost" small C={C}>Cancel</PebbleButton>
      {running && (
        <div style={{ marginTop: "20px", padding: "10px 14px", background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px", maxWidth: "280px", margin: "20px auto 0" }}>
          <span style={{ fontSize: "14px" }}>💡</span>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", lineHeight: "1.4" }}>
            Keep your screen on so the timer doesn't stop.
          </div>
        </div>
      )}
    </div>
  );
}


// ─── BUDGET SCREEN ────────────────────────────────────────────────────────────

function BudgetSetupScreen({ customTasks, settings, C, taskUsage, onStart }) {
  const hidden = settings.hiddenTasks || [];
  const allTasks = (settings.prioritiseTasks
    ? [...SUGGESTED_TASKS, ...customTasks].sort((a, b) => (taskUsage[b] || 0) - (taskUsage[a] || 0))
    : [...SUGGESTED_TASKS, ...customTasks]
  ).filter(t => !hidden.includes(t));

  const [budgetName, setBudgetName] = useState("");
  const [budgetMinutes, setBudgetMinutes] = useState(30);
  const [budgetSeconds, setBudgetSeconds] = useState(0);
  const [tasks, setTasks] = useState([
    { name: "", minutes: 10, seconds: 0 },
    { name: "", minutes: 10, seconds: 0 },
  ]);

  const budgetTotal = budgetMinutes * 60 + budgetSeconds;
  const tasksTotal = tasks.reduce((a, t) => a + t.minutes * 60 + t.seconds, 0);
  const overflow = tasksTotal > budgetTotal;
  const validTasks = tasks.filter(t => t.name.trim());

  function addTask() {
    setTasks(t => [...t, { name: "", minutes: 10, seconds: 0 }]);
  }

  function removeTask(i) {
    setTasks(t => t.filter((_, idx) => idx !== i));
  }

  function updateTask(i, field, val) {
    setTasks(t => t.map((task, idx) => idx === i ? { ...task, [field]: val } : task));
  }

  function handleStart() {
    if (settings.sounds || settings.alertMode === "both" || settings.alertMode === "sound") {
      fireAlert("start", settings);
    }
    onStart({
      budgetName: budgetName.trim() || "Budget",
      budgetTotal,
      tasks: validTasks,
    });
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px 40px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "10px" }}>
          Budget name
        </h2>
        <input
          value={budgetName}
          onChange={e => setBudgetName(e.target.value)}
          placeholder="e.g. Before I leave, Lunch break..."
          style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: `2px solid ${budgetName ? C.primary : C.border}`, background: C.card, fontSize: "15px", fontFamily: "'Lora', serif", color: C.textDark, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "10px" }}>
          Time budget
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", display: "block", marginBottom: "4px" }}>Minutes</label>
            <input type="number" min="1" max="480" defaultValue={budgetMinutes}
              onFocus={e => e.target.select()}
              onBlur={e => { const v = Math.max(1, Math.min(480, parseInt(e.target.value) || 1)); setBudgetMinutes(v); e.target.value = String(v); }}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "18px", color: C.textDark, outline: "none", background: C.card, textAlign: "center", boxSizing: "border-box" }}
            />
          </div>
          <span style={{ color: C.textMuted, fontSize: "20px", marginTop: "16px" }}>:</span>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", display: "block", marginBottom: "4px" }}>Seconds</label>
            <input type="number" min="0" max="59" defaultValue={budgetSeconds}
              onFocus={e => e.target.select()}
              onBlur={e => { const v = Math.max(0, Math.min(59, parseInt(e.target.value) || 0)); setBudgetSeconds(v); e.target.value = String(v).padStart(2, "0"); }}
              style={{ width: "100%", padding: "10px", borderRadius: "10px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "18px", color: C.textDark, outline: "none", background: C.card, textAlign: "center", boxSizing: "border-box" }}
            />
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMuted, fontFamily: "'Lora', serif", fontWeight: "400", marginBottom: "10px" }}>
        Tasks running in parallel
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
        {tasks.map((task, i) => (
          <div key={i} style={{ background: C.card, borderRadius: "12px", border: `1px solid ${C.border}`, padding: "12px 14px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ flex: 1 }}>
                <input
                  value={task.name}
                  onChange={e => updateTask(i, "name", e.target.value)}
                  placeholder="Task name..."
                  list={`budget_task_${i}`}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: `1px solid ${task.name ? C.primary : C.borderMid}`, background: C.bg, fontSize: "14px", fontFamily: "'Lora', serif", color: C.textDark, outline: "none", boxSizing: "border-box" }}
                />
                <datalist id={`budget_task_${i}`}>
                  {allTasks.map(t => <option key={t} value={t} />)}
                </datalist>
              </div>
              <button onClick={() => removeTask(i)} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "18px", padding: "4px", flexShrink: 0 }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="number" min="0" max="480" defaultValue={task.minutes}
                onFocus={e => e.target.select()}
                onBlur={e => { const v = Math.max(0, parseInt(e.target.value) || 0); updateTask(i, "minutes", v); e.target.value = String(v); }}
                style={{ width: "60px", padding: "6px 8px", borderRadius: "8px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "14px", color: C.textDark, outline: "none", background: C.bg, textAlign: "center" }}
              />
              <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>min</span>
              <input type="number" min="0" max="59" defaultValue={task.seconds}
                onFocus={e => e.target.select()}
                onBlur={e => { const v = Math.max(0, Math.min(59, parseInt(e.target.value) || 0)); updateTask(i, "seconds", v); e.target.value = String(v).padStart(2, "0"); }}
                style={{ width: "60px", padding: "6px 8px", borderRadius: "8px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "14px", color: C.textDark, outline: "none", background: C.bg, textAlign: "center" }}
              />
              <span style={{ fontSize: "12px", color: C.textMuted, fontFamily: "'Lora', serif" }}>sec</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addTask} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: `1px dashed ${C.borderMid}`, background: "transparent", color: C.textMuted, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "13px", marginBottom: "14px" }}>
        + Add task
      </button>

      {budgetTotal > 0 && (
        <div style={{ borderRadius: "12px", padding: "12px 16px", marginBottom: "14px", background: overflow ? `${C.danger}18` : C.accentLight, border: `1px solid ${overflow ? C.danger : C.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif" }}>Budget</span>
            <span style={{ fontSize: "13px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(budgetTotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: overflow ? "8px" : "0" }}>
            <span style={{ fontSize: "13px", color: C.textMid, fontFamily: "'Lora', serif" }}>Tasks total</span>
            <span style={{ fontSize: "13px", color: overflow ? C.danger : C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(tasksTotal)}</span>
          </div>
          {overflow && (
            <div style={{ fontSize: "12px", color: C.danger, fontFamily: "'Lora', serif", fontStyle: "italic", marginTop: "6px" }}>
              ⚠️ Tasks exceed your budget by {formatDuration(tasksTotal - budgetTotal)}. You can still start, but some tasks may not finish in time.
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PebbleButton onClick={handleStart} variant="primary" C={C} disabled={validTasks.length === 0 || budgetTotal === 0}>
          Start budget ⏱️
        </PebbleButton>
      </div>
    </div>
  );
}

// ─── BUDGET RUNNER SCREEN ─────────────────────────────────────────────────────

function BudgetRunnerScreen({ config, onComplete, onCancel, settings, C }) {
  const { budgetName, budgetTotal, tasks } = config;
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [taskElapsed, setTaskElapsed] = useState(tasks.map(() => 0));
  const [taskDone, setTaskDone] = useState(tasks.map(() => false));
  const firedRef = useRef(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(e => {
          const next = e + 1;
          if (next >= budgetTotal && !firedRef.current) {
            firedRef.current = true;
            fireAlert("complete", settings);
          }
          return next;
        });
        setTaskElapsed(prev => prev.map((e, i) => taskDone[i] ? e : e + 1));
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, taskDone, budgetTotal, settings]);

  const budgetProgress = budgetTotal > 0 ? Math.min(1, elapsed / budgetTotal) : 0;
  const budgetRemaining = Math.max(0, budgetTotal - elapsed);
  const budgetOver = elapsed > budgetTotal;
  const bStyle = settings.budgetStyle || "bars";

  function toggleTaskDone(i) {
    setTaskDone(prev => {
      const next = [...prev];
      next[i] = !next[i];
      if (next[i]) fireAlert("complete", settings);
      return next;
    });
  }

  function handleFinish() {
    setRunning(false);
    onComplete({
      budgetName, budgetTotal,
      actualDuration: elapsed,
      tasks: tasks.map((t, i) => ({
        name: t.name,
        planned: t.minutes * 60 + t.seconds,
        actual: taskElapsed[i],
        done: taskDone[i],
      })),
      completedAt: Date.now(),
    });
  }

  function TaskCard({ task, i }) {
    const planned = task.minutes * 60 + task.seconds;
    const actual = taskElapsed[i];
    const taskOver = actual > planned;
    const taskProgress = planned > 0 ? Math.min(1, actual / planned) : 0;
    const done = taskDone[i];

    if (bStyle === "minimal") {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: C.card, borderRadius: "12px", border: `1px solid ${done ? C.primary : C.border}`, opacity: done ? 0.6 : 1 }}>
          <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", textDecoration: done ? "line-through" : "none" }}>{task.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ fontSize: "16px", color: taskOver && !done ? C.danger : C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatTime(actual)}</div>
            <button onClick={() => toggleTaskDone(i)} style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${done ? C.primary : C.borderMid}`, background: done ? C.primary : "transparent", cursor: "pointer", color: done ? C.white : C.textMuted, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
          </div>
        </div>
      );
    }

    if (bStyle === "bubbles" || bStyle === "wave") {
      const isWave = bStyle === "wave";
      return (
        <div style={{ textAlign: "center", opacity: done ? 0.6 : 1 }}>
          <div onClick={() => toggleTaskDone(i)} style={{ position: "relative", width: "100px", height: "100px", borderRadius: isWave ? "16px" : "50%", overflow: "hidden", border: `3px solid ${done ? C.primary : taskOver ? C.danger : C.border}`, margin: "0 auto 6px", cursor: "pointer" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${taskProgress * 100}%`, background: taskOver && !done ? C.danger : C.primary, opacity: 0.3, transition: isWave ? "height 0.8s ease" : "height 0.5s ease" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontSize: "15px", color: taskOver && !done ? C.danger : C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatTime(actual)}</div>
              {done && <div style={{ fontSize: "16px" }}>✓</div>}
            </div>
          </div>
          <div style={{ fontSize: "11px", color: C.textMid, fontFamily: "'Lora', serif", maxWidth: "100px", textDecoration: done ? "line-through" : "none" }}>{task.name}</div>
        </div>
      );
    }

    return (
      <div style={{ background: C.card, borderRadius: "12px", border: `1px solid ${done ? C.primary : C.border}`, padding: "12px 14px", opacity: done ? 0.6 : 1, transition: "opacity 0.2s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
          <div style={{ fontSize: "14px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "500", textDecoration: done ? "line-through" : "none" }}>{task.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "14px", color: taskOver && !done ? C.danger : C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatTime(actual)}</div>
              <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif" }}>/ {formatDuration(planned)}</div>
            </div>
            <button onClick={() => toggleTaskDone(i)} style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${done ? C.primary : C.borderMid}`, background: done ? C.primary : "transparent", cursor: "pointer", color: done ? C.white : C.textMuted, fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</button>
          </div>
        </div>
        <div style={{ height: "4px", borderRadius: "2px", background: C.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${taskProgress * 100}%`, borderRadius: "2px", background: taskOver && !done ? C.danger : C.primary, transition: "width 0.5s ease" }} />
        </div>
      </div>
    );
  }

  const isBubbleOrWave = bStyle === "bubbles" || bStyle === "wave";

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px", textAlign: "center" }}>
      <div style={{ fontSize: "13px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {budgetName}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "40px", fontFamily: "'Lora', serif", fontWeight: "300", color: budgetOver ? C.danger : C.textDark, letterSpacing: "-1px", marginBottom: "6px" }}>
          {budgetOver ? "+" : ""}{formatTime(budgetOver ? elapsed - budgetTotal : budgetRemaining)}
        </div>
        <div style={{ fontSize: "12px", color: budgetOver ? C.danger : C.textMuted, fontFamily: "'Lora', serif" }}>
          {budgetOver ? "over budget" : "remaining in budget"}
        </div>
        <div style={{ height: "6px", borderRadius: "3px", background: C.border, overflow: "hidden", marginTop: "12px" }}>
          <div style={{ height: "100%", width: `${Math.min(100, budgetProgress * 100)}%`, borderRadius: "3px", background: budgetOver ? C.danger : C.primary, transition: "width 0.5s ease, background 0.3s ease" }} />
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: isBubbleOrWave ? "wrap" : "nowrap", flexDirection: isBubbleOrWave ? "row" : "column", gap: "8px", marginBottom: "24px", textAlign: "left", justifyContent: isBubbleOrWave ? "center" : "stretch" }}>
        {tasks.map((task, i) => (
          <TaskCard key={i} task={task} i={i} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
        <PebbleButton onClick={() => setRunning(r => !r)} variant="secondary" C={C}>
          {running ? "Pause" : "Resume"}
        </PebbleButton>
        <PebbleButton onClick={handleFinish} variant="primary" C={C}>
          Finish ⏱️
        </PebbleButton>
      </div>

      <PebbleButton onClick={onCancel} variant="ghost" small C={C}>Cancel</PebbleButton>

      {running && (
        <div style={{ marginTop: "20px", padding: "10px 14px", background: C.card, borderRadius: "10px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "8px", maxWidth: "280px", margin: "20px auto 0" }}>
          <span style={{ fontSize: "14px" }}>💡</span>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", lineHeight: "1.4" }}>
            Keep your screen on so the timer doesn't stop.
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BUDGET COMPLETION SCREEN ─────────────────────────────────────────────────

function BudgetCompletionScreen({ result, onContinue, C }) {
  const diff = result.actualDuration - result.budgetTotal;
  const doneTasks = result.tasks.filter(t => t.done).length;

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 16px 40px", textAlign: "center" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>⏱️</div>
      <h2 style={{ fontSize: "22px", fontFamily: "'Lora', serif", fontWeight: "600", color: C.textDark, marginBottom: "4px" }}>
        Budget done!
      </h2>
      <p style={{ fontSize: "14px", color: C.textMid, fontFamily: "'Lora', serif", marginBottom: "20px" }}>
        {result.budgetName} · {doneTasks} of {result.tasks.length} tasks finished
      </p>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <div style={{ flex: 1, background: C.card, borderRadius: "12px", padding: "12px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Budget</div>
          <div style={{ fontSize: "16px", color: C.textDark, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(result.budgetTotal)}</div>
        </div>
        <div style={{ flex: 1, background: C.card, borderRadius: "12px", padding: "12px", border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Actual</div>
          <div style={{ fontSize: "16px", color: C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{formatDuration(result.actualDuration)}</div>
        </div>
        <div style={{ flex: 1, background: diff > 0 ? `${C.danger}18` : C.card, borderRadius: "12px", padding: "12px", border: `1px solid ${diff > 0 ? C.danger : C.border}` }}>
          <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif", marginBottom: "4px" }}>Diff</div>
          <div style={{ fontSize: "16px", color: diff > 0 ? C.danger : C.primary, fontFamily: "'Lora', serif", fontWeight: "600" }}>{diff > 0 ? "+" : ""}{formatDuration(Math.abs(diff))}</div>
        </div>
      </div>

      <div style={{ background: C.card, borderRadius: "12px", border: `1px solid ${C.border}`, overflow: "hidden", marginBottom: "24px" }}>
        {result.tasks.map((t, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderTop: i > 0 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "14px" }}>{t.done ? "✓" : "○"}</span>
              <span style={{ fontSize: "13px", color: t.done ? C.textDark : C.textMuted, fontFamily: "'Lora', serif" }}>{t.name}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", color: C.primary, fontFamily: "'Lora', serif" }}>{formatDuration(t.actual)}</div>
              <div style={{ fontSize: "11px", color: C.textMuted, fontFamily: "'Lora', serif" }}>/ {formatDuration(t.planned)}</div>
            </div>
          </div>
        ))}
      </div>

      <PebbleButton onClick={onContinue} variant="primary" C={C}>Back to budget</PebbleButton>
    </div>
  );
}

// ─── SIMPLE MODE SCREEN ───────────────────────────────────────────────────────

function SimpleModeScreen({ onStart, settings, C }) {
  const [taskName, setTaskName] = useState("");
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [timerType, setTimerType] = useState(settings.defaultTimerType || "countdown");

  function handleStart() {
    fireAlert("start", settings);
    onStart({
      taskName: taskName.trim() || "Timer",
      timerType,
      totalSeconds: timerType === "stopwatch" ? 0 : minutes * 60 + seconds,
    });
  }

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
      <div style={{ marginBottom: "32px" }}>
        <input
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="What are you doing? (optional)"
          onKeyDown={e => e.key === "Enter" && handleStart()}
          style={{ width: "100%", padding: "14px 18px", borderRadius: "14px", border: `2px solid ${taskName ? C.primary : C.border}`, background: C.card, fontSize: "16px", fontFamily: "'Lora', serif", color: C.textDark, outline: "none", boxSizing: "border-box", textAlign: "center", transition: "border-color 0.2s ease" }}
        />
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "28px" }}>
        {[["countdown","Countdown"],["stopwatch","Stopwatch"],["pomodoro","Pomodoro"]].map(([key, label]) => (
          <button key={key} onClick={() => setTimerType(key)} style={{ flex: 1, padding: "10px 8px", borderRadius: "12px", border: `2px solid ${timerType === key ? C.primary : C.border}`, background: timerType === key ? C.bg : C.card, cursor: "pointer", fontFamily: "'Lora', serif", fontSize: "13px", color: timerType === key ? C.primary : C.textMid, fontWeight: timerType === key ? "600" : "400", transition: "all 0.15s ease" }}>
            {label}
          </button>
        ))}
      </div>

      {timerType === "countdown" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "36px" }}>
          <input
            type="number" min="0" max="180" defaultValue={minutes}
            onFocus={e => e.target.select()}
            onBlur={e => { const v = Math.max(0, Math.min(180, parseInt(e.target.value) || 0)); setMinutes(v); e.target.value = String(v); }}
            style={{ width: "80px", padding: "12px", borderRadius: "10px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "24px", color: C.textDark, outline: "none", background: C.card, textAlign: "center" }}
          />
          <span style={{ fontSize: "24px", color: C.textMuted }}>:</span>
          <input
            type="number" min="0" max="59" defaultValue={seconds}
            onFocus={e => e.target.select()}
            onBlur={e => { const v = Math.max(0, Math.min(59, parseInt(e.target.value) || 0)); setSeconds(v); e.target.value = String(v).padStart(2, "0"); }}
            style={{ width: "80px", padding: "12px", borderRadius: "10px", border: `1px solid ${C.borderMid}`, fontFamily: "'Lora', serif", fontSize: "24px", color: C.textDark, outline: "none", background: C.card, textAlign: "center" }}
          />
        </div>
      )}

      {timerType !== "countdown" && <div style={{ marginBottom: "36px" }} />}

      <PebbleButton
        onClick={handleStart}
        variant="primary"
        C={C}
        disabled={timerType === "countdown" && minutes * 60 + seconds === 0}
      >
        Start 🪨
      </PebbleButton>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function Pebbletime() {
  const [screen, setScreen] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("pebbletime_settings") || "{}");
      return s.defaultLanding || "setup";
    } catch { return "setup"; }
  });
  const [timerConfig, setTimerConfig] = useState(null);
  const [lastEntry, setLastEntry] = useState(null);
  const [queueConfig, setQueueConfig] = useState(null);
  const [queueResult, setQueueResult] = useState(null);
  const [budgetConfig, setBudgetConfig] = useState(null);
  const [budgetResult, setBudgetResult] = useState(null);

  function handleBudgetStart(config) {
    setBudgetConfig(config);
    setScreen("budget_runner");
  }

  function handleBudgetComplete(result) {
    setBudgetResult(result);
    setScreen("budget_complete");
  }
  const [savedQueues, setSavedQueues] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pebbletime_queues") || "[]"); }
    catch { return []; }
  });

  const [miscHistory, setMiscHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pebbletime_misc") || "[]"); }
    catch { return []; }
  });

  function saveMiscHistory(h) {
    setMiscHistory(h);
    try { localStorage.setItem("pebbletime_misc", JSON.stringify(h)); } catch {}
  }

  function handleSaveMiscName(name) {
    if (!lastEntry) return;
    const entry = { ...lastEntry, taskName: name, misc: true, savedAt: Date.now() };
    saveMiscHistory([entry, ...miscHistory]);
  }

  function handleDeleteMisc(idx) {
    saveMiscHistory(miscHistory.filter((_, i) => i !== idx));
  }

  function saveSavedQueues(q) {
    setSavedQueues(q);
    try { localStorage.setItem("pebbletime_queues", JSON.stringify(q)); } catch {}
  }

  function handleSaveQueue(q) {
    const existing = savedQueues.findIndex(s => s.id === q.id);
    const next = existing >= 0
      ? savedQueues.map((s, i) => i === existing ? q : s)
      : [...savedQueues, q];
    saveSavedQueues(next);
  }

  function handleQueueStart(config) {
    recordTaskUsage(config.tasks.map(t => t.name));
    setQueueConfig(config);
    setScreen("queue_runner");
  }

  const [queueHistory, setQueueHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pebbletime_queue_history") || "[]"); }
    catch { return []; }
  });

  function saveQueueHistory(h) {
    setQueueHistory(h);
    try { localStorage.setItem("pebbletime_queue_history", JSON.stringify(h)); } catch {}
  }

  function handleQueueComplete(result) {
    saveQueueHistory([result, ...queueHistory]);
    setQueueResult(result);
    setScreen("queue_complete");
  }

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    try { return localStorage.getItem("pebbletime_onboarding") === "done"; }
    catch { return false; }
  });

  function completeOnboarding() {
    try { localStorage.setItem("pebbletime_onboarding", "done"); } catch {}
    setHasSeenOnboarding(true);
  }

  const [settings, setSettings] = useState(() => {
    try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("pebbletime_settings") || "{}") }; }
    catch { return DEFAULT_SETTINGS; }
  });

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pebbletime_history") || "[]"); }
    catch { return []; }
  });

  const [customTasks, setCustomTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pebbletime_custom_tasks") || "[]"); }
    catch { return []; }
  });

  const [taskUsage, setTaskUsage] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pebbletime_task_usage") || "{}"); }
    catch { return {}; }
  });

  function recordTaskUsage(names) {
    setTaskUsage(prev => {
      const next = { ...prev };
      (Array.isArray(names) ? names : [names]).forEach(n => {
        next[n] = (next[n] || 0) + 1;
      });
      try { localStorage.setItem("pebbletime_task_usage", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const C = applyVisualMode(THEMES[settings.theme] || THEMES.stone, settings.colorSafe, settings.monochrome, settings.highContrast);

  useEffect(() => {
    document.body.style.background = C.bg;
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, [C.bg]);

  function saveSettings(s) {
    setSettings(s);
    try { localStorage.setItem("pebbletime_settings", JSON.stringify(s)); } catch {}
  }

  function saveHistory(h) {
    setHistory(h);
    try { localStorage.setItem("pebbletime_history", JSON.stringify(h)); } catch {}
  }

  function saveCustomTasks(t) {
    setCustomTasks(t);
    try { localStorage.setItem("pebbletime_custom_tasks", JSON.stringify(t)); } catch {}
  }

  function handleStart(config) {
    recordTaskUsage(config.taskName);
    setTimerConfig(config);
    setScreen(config.timerType === "breathing" ? "breathing" : "timer");
  }

  function handleNavChange(id) {
    setTimerConfig(null);
    setScreen(id);
  }

  function handleComplete(entry) {
    saveHistory([entry, ...history]);
    setLastEntry(entry);
    setScreen("complete");
  }

  function handleAddCustomTask(name) {
    if (!customTasks.includes(name)) saveCustomTasks([...customTasks, name]);
  }

  function handleDeleteCustomTask(name) {
    saveCustomTasks(customTasks.filter(t => t !== name));
  }

  function handleExport() {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      history,
      customTasks,
      savedQueues,
      taskUsage,
      miscHistory,
      queueHistory,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pebbletime-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const data = JSON.parse(evt.target.result);
          if (data.version !== 1) { alert("This doesn't look like a valid Pebbletime backup."); return; }
          if (data.settings) saveSettings({ ...DEFAULT_SETTINGS, ...data.settings });
          if (data.history) saveHistory(data.history);
          if (data.customTasks) saveCustomTasks(data.customTasks);
          if (data.savedQueues) saveSavedQueues(data.savedQueues);
          if (data.taskUsage) { setTaskUsage(data.taskUsage); try { localStorage.setItem("pebbletime_task_usage", JSON.stringify(data.taskUsage)); } catch {} }
          if (data.miscHistory) saveMiscHistory(data.miscHistory);
          if (data.queueHistory) saveQueueHistory(data.queueHistory);
        } catch { alert("Could not read the backup file. Please try again."); }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function handleClearAll() {
    ["pebbletime_settings","pebbletime_history","pebbletime_custom_tasks","pebbletime_queues","pebbletime_task_usage","pebbletime_queue_history","pebbletime_misc","pebbletime_onboarding"].forEach(k => { try { localStorage.removeItem(k); } catch {} });
    saveSettings(DEFAULT_SETTINGS);
    saveHistory([]);
    saveCustomTasks([]);
    saveSavedQueues([]);
    setTaskUsage({});
    saveMiscHistory([]);
    saveQueueHistory([]);
    setHasSeenOnboarding(false);
  }

  const navItems = [
    { id: "setup", label: "Timer", icon: "🪨" },
    { id: "queue", label: "Queue", icon: "🏁" },
    { id: "budget", label: "Budget", icon: "⏱️" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.bg, backgroundAttachment: "fixed", fontFamily: "'Lora', serif", transition: "background 0.3s ease", zoom: FONT_SCALE[settings.fontSize] || 1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap'); html, body { margin: 0; padding: 0; }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(1.3); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        * { box-sizing: border-box; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { opacity: 1; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "24px 24px 0", maxWidth: "480px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: "600", color: C.textDark, letterSpacing: "-0.3px" }}>🪨 Pebbletime</div>
          <div style={{ fontSize: "12px", color: C.textMuted, letterSpacing: "0.05em" }}>by Mossworks</div>
        </div>
        {screen === "timer" || screen === "complete" || screen === "queue_runner" || screen === "queue_complete" || screen === "budget_runner" || screen === "budget_complete" ? (
          <button onClick={() => setScreen(screen === "queue_runner" || screen === "queue_complete" ? "queue" : "setup")} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: "'Lora', serif" }}>
            ← back
          </button>
        ) : settings.simpleMode ? (
          <div style={{ display: "flex", gap: "4px" }}>
            {screen !== "setup" && (
              <button onClick={() => setScreen("setup")} style={{ background: "transparent", border: "none", color: C.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: "'Lora', serif", padding: "7px 12px" }}>
                ← back
              </button>
            )}
            <button onClick={() => setScreen("settings")} style={{ background: screen === "settings" ? C.secondary : "transparent", border: "none", borderRadius: "10px", color: C.textMuted, cursor: "pointer", fontSize: "13px", fontFamily: "'Lora', serif", padding: "7px 12px" }}>
              ⚙️ Settings
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "4px" }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavChange(item.id)}
                style={{
                  background: screen === item.id ? C.secondary : "transparent",
                  border: "none", borderRadius: "10px",
                  padding: "7px 12px", cursor: "pointer",
                  fontSize: "13px", color: screen === item.id ? C.textDark : C.textMuted,
                  fontFamily: "'Lora', serif", transition: "all 0.15s ease",
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {!hasSeenOnboarding && (
        <OnboardingScreen onDone={completeOnboarding} C={C} />
      )}

      {hasSeenOnboarding && screen === "setup" && !settings.simpleMode && (
        <SetupScreen onStart={handleStart} history={history} customTasks={customTasks} onAddCustomTask={handleAddCustomTask} settings={settings} C={C} taskUsage={taskUsage} />
      )}
      {hasSeenOnboarding && screen === "setup" && settings.simpleMode && (
        <SimpleModeScreen onStart={handleStart} settings={settings} C={C} />
      )}
      {hasSeenOnboarding && screen === "breathing" && !timerConfig && (
        <SetupScreen onStart={handleStart} history={history} customTasks={customTasks} onAddCustomTask={handleAddCustomTask} settings={{ ...settings, defaultTimerType: "breathing" }} C={C} taskUsage={taskUsage} />
      )}
      {hasSeenOnboarding && screen === "breathing" && timerConfig && timerConfig.timerType === "breathing" && (
        <BreathingTimerScreen config={timerConfig} onComplete={handleComplete} onCancel={() => { setTimerConfig(null); setScreen("breathing"); }} settings={settings} C={C} />
      )}
      {hasSeenOnboarding && screen === "timer" && timerConfig && (
        <TimerScreen config={timerConfig} onComplete={handleComplete} onCancel={() => setScreen("setup")} settings={settings} C={C} />
      )}
      {hasSeenOnboarding && screen === "complete" && lastEntry && (
        <CompletionScreen entry={lastEntry} onContinue={() => setScreen("setup")} onSaveMiscName={handleSaveMiscName} C={C} settings={settings} />
      )}
      {hasSeenOnboarding && screen === "queue" && (
        <QueueBuilderScreen customTasks={customTasks} onStart={handleQueueStart} onSave={handleSaveQueue} savedQueues={savedQueues} C={C} settings={settings} taskUsage={taskUsage} queueHistory={queueHistory} />
      )}
      {hasSeenOnboarding && screen === "queue_runner" && queueConfig && (
        <QueueRunnerScreen config={queueConfig} onComplete={handleQueueComplete} onCancel={() => setScreen("queue")} settings={settings} C={C} />
      )}
      {hasSeenOnboarding && screen === "queue_complete" && queueResult && (
        <QueueCompletionScreen result={queueResult} onContinue={() => setScreen("queue")} C={C} />
      )}
      {hasSeenOnboarding && screen === "budget" && (
        <BudgetSetupScreen customTasks={customTasks} settings={settings} C={C} taskUsage={taskUsage} onStart={handleBudgetStart} />
      )}
      {hasSeenOnboarding && screen === "budget_runner" && budgetConfig && (
        <BudgetRunnerScreen config={budgetConfig} onComplete={handleBudgetComplete} onCancel={() => setScreen("budget")} settings={settings} C={C} />
      )}
      {hasSeenOnboarding && screen === "budget_complete" && budgetResult && (
        <BudgetCompletionScreen result={budgetResult} onContinue={() => setScreen("budget")} C={C} />
      )}
      {hasSeenOnboarding && screen === "settings" && (
        <SettingsScreen settings={settings} onSave={saveSettings} customTasks={customTasks} onDeleteCustomTask={handleDeleteCustomTask} onExport={handleExport} onImport={handleImport} onClearAll={handleClearAll} miscHistory={miscHistory} onDeleteMisc={handleDeleteMisc} />
      )}
    </div>
  );
}
