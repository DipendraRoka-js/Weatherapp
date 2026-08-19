import { useState } from "react";

export default function BadmintonApp() {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [nameA, setNameA] = useState("Player A");
  const [nameB, setNameB] = useState("Player B");

  const addPoint = (player) => {
    if (player === "A") setScoreA((s) => s + 1);
    else setScoreB((s) => s + 1);
  };

  const removePoint = (player) => {
    if (player === "A") setScoreA((s) => Math.max(0, s - 1));
    else setScoreB((s) => Math.max(0, s - 1));
  };

  const resetGame = () => {
    setScoreA(0);
    setScoreB(0);
  };

  const winner =
    scoreA >= 21 && scoreA - scoreB >= 2
      ? nameA
      : scoreB >= 21 && scoreB - scoreA >= 2
      ? nameB
      : null;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-slate-800">🏸 Badminton Scoreboard</h1>

      {winner && (
        <div className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold">
          {winner} wins! 🎉
        </div>
      )}

      <div className="flex gap-8">
        {[
          { name: nameA, setName: setNameA, score: scoreA, key: "A" },
          { name: nameB, setName: setNameB, score: scoreB, key: "B" },
        ].map((p) => (
          <div
            key={p.key}
            className="bg-white rounded-2xl shadow-md p-6 w-48 flex flex-col items-center"
          >
            <input
              className="text-center font-semibold text-lg mb-2 border-b border-slate-300 focus:outline-none"
              value={p.name}
              onChange={(e) => p.setName(e.target.value)}
            />
            <div className="text-6xl font-bold text-slate-800 mb-4">{p.score}</div>
            <div className="flex gap-2">
              <button
                onClick={() => addPoint(p.key)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                +1
              </button>
              <button
                onClick={() => removePoint(p.key)}
                className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-4 py-2 rounded-lg"
              >
                -1
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium"
      >
        Reset Game
      </button>
    </div>
  );
}