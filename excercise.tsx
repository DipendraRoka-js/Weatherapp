import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Trash2, TrendingUp, Dumbbell, ChevronDown, X } from "lucide-react";

// ---- constants -------------------------------------------------

const DEFAULT_EXERCISES = [
  "Back Squat",
  "Bench Press",
  "Deadlift",
  "Overhead Press",
  "Barbell Row",
  "Front Squat",
];

const PLATES_LB = [45, 35, 25, 10, 5, 2.5];
const PLATE_COLOR = {
  45: "#E8542A",
  35: "#C9A227",
  25: "#5B7A8C",
  10: "#7A8288",
  5: "#3A3733",
  2.5: "#EDEAE3",
};
const BAR_WEIGHT = 45;

function calcPlates(totalWeight) {
  let remaining = Math.max(0, (totalWeight - BAR_WEIGHT) / 2);
  const plates = [];
  for (const p of PLATES_LB) {
    while (remaining + 1e-6 >= p) {
      plates.push(p);
      remaining -= p;
    }
  }
  return plates;
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function isSameDay(a, b) {
  const da = new Date(a), db = new Date(b);
  return da.toDateString() === db.toDateString();
}

// ---- plate stack visual -----------------------------------------

function PlateStack({ weight }) {
  const plates = calcPlates(weight);
  const half = Math.ceil(plates.length / 2);
  const left = plates.slice(0, half);
  const right = plates.slice(half);

  const Plate = ({ size, i }) => {
    const h = 30 + Math.min(size, 45) * 1.1;
    const w = 7 + size / 12;
    return (
      <div
        key={i}
        style={{
          width: `${w}px`,
          height: `${h}px`,
          background: PLATE_COLOR[size],
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.35)",
        }}
      />
    );
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 80 }}>
      <div style={{ display: "flex", flexDirection: "row-reverse", gap: 2, alignItems: "center" }}>
        {left.map((s, i) => <Plate size={s} i={`l${i}`} key={`l${i}`} />)}
      </div>
      <div style={{ width: 46, height: 8, background: "#5B6670", borderRadius: 2 }} />
      <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
        {right.map((s, i) => <Plate size={s} i={`r${i}`} key={`r${i}`} />)}
      </div>
    </div>
  );
}

// ---- main app -----------------------------------------------------

export default function IronLog() {
  const [loaded, setLoaded] = useState(false);
  const [sets, setSets] = useState([]);
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES);
  const [exercise, setExercise] = useState(DEFAULT_EXERCISES[0]);
  const [weight, setWeight] = useState(135);
  const [reps, setReps] = useState(5);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [saveError, setSaveError] = useState(false);

  // load persisted data
  useEffect(() => {
    (async () => {
      try {
        const s = await window.storage.get("ironlog:sets", false);
        if (s?.value) setSets(JSON.parse(s.value));
      } catch (e) { /* no data yet */ }
      try {
        const ex = await window.storage.get("ironlog:exercises", false);
        if (ex?.value) setExercises(JSON.parse(ex.value));
      } catch (e) { /* no data yet */ }
      setLoaded(true);
    })();
  }, []);

  const persistSets = useCallback(async (next) => {
    try {
      const res = await window.storage.set("ironlog:sets", JSON.stringify(next), false);
      if (!res) setSaveError(true);
    } catch (e) { setSaveError(true); }
  }, []);

  const persistExercises = useCallback(async (next) => {
    try { await window.storage.set("ironlog:exercises", JSON.stringify(next), false); }
    catch (e) { /* non-fatal */ }
  }, []);

  const addSet = () => {
    if (!weight || !reps) return;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      exercise,
      weight: Number(weight),
      reps: Number(reps),
      ts: Date.now(),
    };
    const next = [entry, ...sets];
    setSets(next);
    persistSets(next);
  };

  const removeSet = (id) => {
    const next = sets.filter((s) => s.id !== id);
    setSets(next);
    persistSets(next);
  };

  const addExercise = () => {
    const name = newExerciseName.trim();
    if (!name || exercises.includes(name)) return;
    const next = [...exercises, name];
    setExercises(next);
    persistExercises(next);
    setExercise(name);
    setNewExerciseName("");
    setPickerOpen(false);
  };

  const todaySets = useMemo(
    () => sets.filter((s) => isSameDay(s.ts, Date.now())),
    [sets]
  );

  const prByExercise = useMemo(() => {
    const map = {};
    for (const s of sets) {
      if (!map[s.exercise] || s.weight > map[s.exercise]) map[s.exercise] = s.weight;
    }
    return map;
  }, [sets]);

  const currentPR = prByExercise[exercise] || 0;
  const isPR = Number(weight) > 0 && Number(weight) >= currentPR && currentPR > 0 && Number(weight) > currentPR;
  const isFirstEver = !currentPR;

  const historyByDay = useMemo(() => {
    const groups = {};
    for (const s of sets) {
      const key = new Date(s.ts).toDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(s);
    }
    return Object.entries(groups)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, 8);
  }, [sets]);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#1C1B1A",
        color: "#EDEAE3",
        minHeight: "100%",
        padding: "28px 20px 60px",
        maxWidth: 480,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap');
        .il-input { -moz-appearance: textfield; }
        .il-input::-webkit-outer-spin-button, .il-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .il-btn:active { transform: translateY(1px); }
        .il-focus:focus-visible { outline: 2px solid #E8542A; outline-offset: 2px; }
      `}</style>

      {/* header */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
        <h1
          style={{
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: "0.02em",
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Iron Log
        </h1>
        <Dumbbell size={22} color="#5B6670" />
      </div>
      <div style={{ color: "#7A8288", fontSize: 13, marginBottom: 26, letterSpacing: "0.03em" }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </div>

      {!loaded ? (
        <div style={{ color: "#7A8288", fontSize: 14, padding: "40px 0", textAlign: "center" }}>
          Loading your log…
        </div>
      ) : (
        <>
          {/* exercise picker */}
          <div style={{ marginBottom: 18, position: "relative" }}>
            <div style={{ fontSize: 11, color: "#7A8288", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Exercise
            </div>
            <button
              className="il-btn il-focus"
              onClick={() => setPickerOpen((o) => !o)}
              style={{
                width: "100%",
                background: "#262421",
                border: "1px solid #3A3733",
                borderRadius: 8,
                padding: "12px 14px",
                color: "#EDEAE3",
                fontFamily: "'Oswald', sans-serif",
                fontSize: 18,
                fontWeight: 500,
                textTransform: "uppercase",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {exercise}
              <ChevronDown size={18} color="#7A8288" style={{ transform: pickerOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
            </button>

            {pickerOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  background: "#262421",
                  border: "1px solid #3A3733",
                  borderRadius: 8,
                  zIndex: 10,
                  padding: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {exercises.map((ex) => (
                  <button
                    key={ex}
                    className="il-btn"
                    onClick={() => { setExercise(ex); setPickerOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      background: ex === exercise ? "#3A3733" : "transparent",
                      border: "none",
                      color: "#EDEAE3",
                      padding: "9px 10px",
                      borderRadius: 5,
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                  >
                    {ex}
                  </button>
                ))}
                <div style={{ display: "flex", gap: 6, marginTop: 6, paddingTop: 8, borderTop: "1px solid #3A3733" }}>
                  <input
                    className="il-focus"
                    value={newExerciseName}
                    onChange={(e) => setNewExerciseName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addExercise()}
                    placeholder="Add exercise…"
                    style={{
                      flex: 1,
                      background: "#1C1B1A",
                      border: "1px solid #3A3733",
                      borderRadius: 5,
                      color: "#EDEAE3",
                      padding: "8px 10px",
                      fontSize: 14,
                    }}
                  />
                  <button
                    className="il-btn"
                    onClick={addExercise}
                    style={{ background: "#E8542A", border: "none", borderRadius: 5, padding: "0 12px", color: "#1C1B1A", cursor: "pointer" }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* weight / reps entry */}
          <div style={{ background: "#262421", border: "1px solid #3A3733", borderRadius: 10, padding: 18, marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#7A8288", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Weight (lb)
                </div>
                <input
                  className="il-input il-focus"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#1C1B1A",
                    border: "1px solid #3A3733",
                    borderRadius: 7,
                    color: "#EDEAE3",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 26,
                    padding: "8px 10px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#7A8288", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  Reps
                </div>
                <input
                  className="il-input il-focus"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  style={{
                    width: "100%",
                    background: "#1C1B1A",
                    border: "1px solid #3A3733",
                    borderRadius: 7,
                    color: "#EDEAE3",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    fontSize: 26,
                    padding: "8px 10px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {/* plate visual */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <PlateStack weight={Number(weight) || 0} />
            </div>
            <div style={{ textAlign: "center", fontSize: 11, color: "#5B6670", marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
              45lb bar + plates/side
            </div>

            {(isPR || isFirstEver) && Number(weight) > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", color: "#C9A227", fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
                <TrendingUp size={15} />
                {isFirstEver ? "First set logged for this lift" : "New personal record"}
              </div>
            )}

            <button
              className="il-btn il-focus"
              onClick={addSet}
              style={{
                width: "100%",
                background: "#E8542A",
                border: "none",
                borderRadius: 7,
                color: "#1C1B1A",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "12px 0",
                cursor: "pointer",
              }}
            >
              Log Set
            </button>
            {saveError && (
              <div style={{ color: "#E8542A", fontSize: 12, marginTop: 8, textAlign: "center" }}>
                Couldn't save — your set is on screen but may not persist.
              </div>
            )}
          </div>

          {/* today's sets */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ fontSize: 11, color: "#7A8288", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Today · {todaySets.length} set{todaySets.length === 1 ? "" : "s"}
            </div>
            {todaySets.length === 0 ? (
              <div style={{ color: "#5B6670", fontSize: 14, padding: "10px 2px" }}>
                Nothing logged yet. First set of the day is the hardest to start.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {todaySets.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "#262421",
                      border: "1px solid #3A3733",
                      borderRadius: 7,
                      padding: "10px 12px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.exercise}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#7A8288" }}>
                        {s.weight} lb × {s.reps}
                      </div>
                    </div>
                    <button
                      className="il-btn"
                      onClick={() => removeSet(s.id)}
                      aria-label={`Remove set: ${s.exercise} ${s.weight} lb by ${s.reps}`}
                      style={{ background: "none", border: "none", color: "#5B6670", cursor: "pointer", padding: 6 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRs */}
          {Object.keys(prByExercise).length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontSize: 11, color: "#7A8288", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Personal Records
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(prByExercise).map(([ex, w]) => (
                  <div key={ex} style={{ background: "#262421", border: "1px solid #3A3733", borderRadius: 7, padding: "10px 12px" }}>
                    <div style={{ fontSize: 12, color: "#7A8288", marginBottom: 2 }}>{ex}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 18, color: "#C9A227" }}>
                      {w} lb
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* history */}
          {historyByDay.length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#7A8288", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                History
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {historyByDay.map(([day, daySets]) => (
                  <div key={day}>
                    <div style={{ fontSize: 12, color: "#5B6670", marginBottom: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                      {fmtDate(daySets[0].ts)}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {daySets.map((s) => (
                        <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#B8B4AC" }}>
                          <span>{s.exercise}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{s.weight} lb × {s.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}