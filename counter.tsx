import { useState } from "react";

export default function ScoreCounter() {
  const [score, setScore] = useState(0);

  return (
    <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Score: {score}</h2>
      <button onClick={() => setScore(score + 1)}>+1</button>
      <button onClick={() => setScore(0)} style={{ marginLeft: 8 }}>
        Reset
      </button>
    </div>
  );
}