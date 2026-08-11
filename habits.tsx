import React, { useState, useMemo } from "react";
import { Flame, Check, Plus, X, Trash2 } from "lucide-react";

const PALETTE = {
  bg: "#12211B",
  panel: "#1A2E24",
  panelLight: "#22392D",
  ink: "#E9E4D8",
  inkDim: "#9FB0A5",
  accent: "#E0A458",
  accentDim: "#8A6A3D",
  line: "#2E4A3B",
};

const STARTER_HABITS = [
  { id: 1, name: "Morning pages", color: "#E0A458" },
  { id: 2, name: "Move the body", color: "#6FA88A" },
  { id: 3, name: "Read 20 pages", color: "#C97B63" },
];

function lastNDays(n) {
  const days = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

function keyFor(date) {
  return date.toISOString().slice(0, 10);
}

function computeStreak(log, habitId, days) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const k = keyFor(days[i]);
    if (log[`${habitId}:${k}`]) streak++;
    else break;
  }
  return streak;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState(STARTER_HABITS);
  const [log, setLog] = useState({});
  const [newHabit, setNewHabit] = useState("");
  const [adding, setAdding] = useState(false);

  const days = useMemo(() => lastNDays(14), []);
  const todayKey = keyFor(new Date());

  const toggle = (habitId, dateKey) => {
    setLog((prev) => {
      const k = `${habitId}:${dateKey}`;
      const next = { ...prev };
      if (next[k]) delete next[k];
      else next[k] = true;
      return next;
    });
  };

  const addHabit = () => {
    const name = newHabit.trim();
    if (!name) return;
    const colors = ["#E0A458", "#6FA88A", "#C97B63", "#7B96B8", "#B58AC9"];
    setHabits((prev) => [
      ...prev,
      { id: Date.now(), name, color: colors[prev.length % colors.length] },
    ]);
    setNewHabit("");
    setAdding(false);
  };

  const removeHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setLog((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(`${id}:`)) delete next[k];
      });
      return next;
    });
  };

  const totalToday = habits.filter((h) => log[`${h.id}:${todayKey}`]).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: PALETTE.bg,
        color: PALETTE.ink,
        fontFamily: "'Georgia', 'Iowan Old Style', serif",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: PALETTE.accent,
              fontFamily: "'Courier New', monospace",
              marginBottom: 8,
            }}
          >
            Field Log — Fortnight View
          </div>
          <h1
            style={{
              fontSize: 36,
              margin: 0,
              fontWeight: 400,
              fontStyle: "italic",
              letterSpacing: "-0.01em",
            }}
          >
            Habits, kept honestly.
          </h1>
          <div
            style={{
              marginTop: 10,
              fontFamily: "'Courier New', monospace",
              fontSize: 13,
              color: PALETTE.inkDim,
            }}
          >
            {totalToday} of {habits.length} logged today
          </div>
        </div>

        <div
          style={{
            background: PALETTE.panel,
            borderRadius: 10,
            border: `1px solid ${PALETTE.line}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr repeat(14, 22px) 50px 30px",
              gap: 6,
              padding: "14px 16px",
              borderBottom: `1px solid ${PALETTE.line}`,
              alignItems: "center",
            }}
          >
            <div />
            {days.map((d) => (
              <div
                key={keyFor(d)}
                style={{
                  fontSize: 10,
                  color: PALETTE.inkDim,
                  textAlign: "center",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {d.getDate()}
              </div>
            ))}
            <div
              style={{
                fontSize: 10,
                color: PALETTE.inkDim,
                textAlign: "center",
                fontFamily: "'Courier New', monospace",
              }}
            >
              streak
            </div>
            <div />
          </div>

          {habits.map((habit) => {
            const streak = computeStreak(log, habit.id, days);
            return (
              <div
                key={habit.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr repeat(14, 22px) 50px 30px",
                  gap: 6,
                  padding: "12px 16px",
                  alignItems: "center",
                  borderBottom: `1px solid ${PALETTE.line}`,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: habit.color,
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  {habit.name}
                </div>

                {days.map((d) => {
                  const k = keyFor(d);
                  const checked = !!log[`${habit.id}:${k}`];
                  const isToday = k === todayKey;
                  return (
                    <button
                      key={k}
                      onClick={() => toggle(habit.id, k)}
                      aria-label={`${habit.name} on ${k}`}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        border: isToday
                          ? `1px solid ${PALETTE.accent}`
                          : `1px solid ${PALETTE.line}`,
                        background: checked ? habit.color : "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                      }}
                    >
                      {checked && <Check size={13} color={PALETTE.bg} strokeWidth={3} />}
                    </button>
                  );
                })}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 13,
                    color: streak > 0 ? PALETTE.accent : PALETTE.inkDim,
                  }}
                >
                  {streak > 0 && <Flame size={13} />}
                  {streak}
                </div>

                <button
                  onClick={() => removeHabit(habit.id)}
                  aria-label={`Remove ${habit.name}`}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: PALETTE.inkDim,
                    display: "flex",
                    justifyContent: "center",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#C97B63")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = PALETTE.inkDim)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}

          <div style={{ padding: "14px 16px" }}>
            {adding ? (
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  autoFocus
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") addHabit();
                    if (e.key === "Escape") {
                      setAdding(false);
                      setNewHabit("");
                    }
                  }}
                  placeholder="Name a habit..."
                  style={{
                    flex: 1,
                    background: PALETTE.panelLight,
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 6,
                    padding: "8px 10px",
                    color: PALETTE.ink,
                    fontFamily: "inherit",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
                <button
                  onClick={addHabit}
                  style={{
                    background: PALETTE.accent,
                    border: "none",
                    borderRadius: 6,
                    padding: "0 14px",
                    color: PALETTE.bg,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setAdding(false);
                    setNewHabit("");
                  }}
                  style={{
                    background: "none",
                    border: `1px solid ${PALETTE.line}`,
                    borderRadius: 6,
                    padding: "0 10px",
                    color: PALETTE.inkDim,
                    cursor: "pointer",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAdding(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "none",
                  border: "none",
                  color: PALETTE.accent,
                  cursor: "pointer",
                  fontFamily: "'Courier New', monospace",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                <Plus size={14} /> add a habit
              </button>
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            color: PALETTE.inkDim,
            fontFamily: "'Courier New', monospace",
          }}
        >
          Tap a cell to mark it done. Streaks count consecutive days ending today.
        </div>
      </div>
    </div>
  );
}