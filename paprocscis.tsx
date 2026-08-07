import { useState } from "react";

function App() {
  const [result, setResult] = useState("");
  const [playerChoice, setPlayerChoice] = useState("");
  const [computerChoice, setComputerChoice] = useState("");

  const choices = ["Rock", "Paper", "Scissors"];

  const playGame = (player) => {
    const computer = choices[Math.floor(Math.random() * 3)];
    setPlayerChoice(player);
    setComputerChoice(computer);

    if (player === computer) {
      setResult("It's a Tie!");
    } else if (
      (player === "Rock" && computer === "Scissors") ||
      (player === "Paper" && computer === "Rock") ||
      (player === "Scissors" && computer === "Paper")
    ) {
      setResult("You Win! 🎉");
    } else {
      setResult("You Lose! 😢");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Rock, Paper, Scissors</h1>

      <div>
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => playGame(choice)}
            style={{ margin: "10px", padding: "10px 20px" }}
          >
            {choice}
          </button>
        ))}
      </div>

      {playerChoice && (
        <div style={{ marginTop: "20px" }}>
          <p>You chose: {playerChoice}</p>
          <p>Computer chose: {computerChoice}</p>
          <h2>{result}</h2>
        </div>
      )}
    </div>
  );
}

export default App;