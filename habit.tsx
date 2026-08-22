import { useState, useRef, useMemo } from "react";

const PALETTE = {
  bg: "#EEF0E7",
  card: "#FFFFFF",
  ink: "#20291F",
  inkSoft: "#5C6455",
  moss: "#2F4F3E",
  gold: "#C89B3C",
  line: "#DCE0D3",
};

const STARTER_HABITS = [
  { id: 1, name: "Morning walk", streak: 4, done: true },
  { id: 2, name: "Read 10 pages", streak: 9, done: false },
  { id: 3, name: "Drink water", streak: 12, done: true },
  { id: 4, name: "No phone before bed", streak: 2, done: false },
];

function LeafMark({ size = 18, color = PALETTE.moss }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 20c8-1 14-7 15-15-8 1-14 7-15 15Z"
        fill={color}
        opacity="0.9"
      />
      <path d="M5 19c4-4 8-8 13-14" stroke={PALETTE.bg} strokeWidth="1" />
    </svg>
  );
}

function ProgressRing({ pct }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg width={96} height={96} viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke={PALETTE.line} strokeWidth="8" />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={PALETTE.gold}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        transform="rotate(-90 48 48)"
        style={{ transition: "stroke-dashoffset 0.5s ease" }}
      />
      <text
        x="48"
        y="53"
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill={PALETTE.ink}
        fontFamily="Georgia, serif"
      >
        {pct}%
      </text>
    </svg>
  );
}

function HabitRow({ habit, onToggle }) {
  return (
    <div
      onClick={() => onToggle(habit.id)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderRadius: 12,
        background: habit.done ? "#F1F6EE" : PALETTE.card,
        border: `1px solid ${habit.done ? PALETTE.moss + "33" : PALETTE.line}`,
        cursor: "pointer",
        transition: "background 0.2s ease, border-color 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: `2px solid ${habit.done ? PALETTE.moss : PALETTE.line}`,
            background: habit.done ? PALETTE.moss : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {habit.done && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 12l6 6L20 6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <span
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            color: PALETTE.ink,
            textDecoration: habit.done ? "line-through" : "none",
            opacity: habit.done ? 0.6 : 1,
          }}
        >
          {habit.name}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: PALETTE.inkSoft, fontSize: 13 }}>
        <LeafMark size={14} />
        {habit.streak}
      </div>
    </div>
  );
}

export default function HabitTracker() {
  const [habits, setHabits] = useState(STARTER_HABITS);
  const [newHabit, setNewHabit] = useState("");
  const inputRef = useRef(null);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, done: !h.done, streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1) }
          : h
      )
    );
  };

  const addHabit = () => {
    const name = newHabit.trim();
    if (!name) return;
    setHabits((prev) => [...prev, { id: Date.now(), name, streak: 0, done: false }]);
    setNewHabit("");
    inputRef.current?.focus();
  };

  const donePct = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.round((habits.filter((h) => h.done).length / habits.length) * 100);
  }, [habits]);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        minHeight: "100%",
        background: PALETTE.bg,
        fontFamily: "system-ui, sans-serif",
        padding: "32px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <LeafMark size={20} />
          <span style={{ fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: PALETTE.inkSoft }}>
            {today}
          </span>
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: 32,
            color: PALETTE.ink,
            margin: "0 0 20px 0",
          }}
        >
          Today's habits
        </h1>

        <div
          style={{
            background: PALETTE.card,
            borderRadius: 18,
            border: `1px solid ${PALETTE.line}`,
            padding: 24,
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 24,
          }}
        >
          <ProgressRing pct={donePct} />
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, color: PALETTE.ink }}>
              {habits.filter((h) => h.done).length} of {habits.length} done
            </div>
            <div style={{ fontSize: 13, color: PALETTE.inkSoft, marginTop: 2 }}>
              Keep your streaks alive
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {habits.map((h) => (
            <HabitRow key={h.id} habit={h} onToggle={toggleHabit} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            placeholder="Add a new habit..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: 10,
              border: `1px solid ${PALETTE.line}`,
              fontSize: 14,
              outline: "none",
              background: PALETTE.card,
              color: PALETTE.ink,
            }}
          />
          <button
            onClick={addHabit}
            style={{
              padding: "12px 18px",
              borderRadius: 10,
              border: "none",
              background: PALETTE.moss,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
