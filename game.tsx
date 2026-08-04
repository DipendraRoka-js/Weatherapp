import React, { useState, useEffect, useCallback } from "react";
import { Star, Moon, Sun, Sparkles, Rocket, Telescope, Globe, Compass, RotateCcw } from "lucide-react";

const SYMBOLS = [
  { Icon: Star, key: "star" },
  { Icon: Moon, key: "moon" },
  { Icon: Sun, key: "sun" },
  { Icon: Sparkles, key: "sparkles" },
  { Icon: Rocket, key: "rocket" },
  { Icon: Telescope, key: "telescope" },
  { Icon: Globe, key: "globe" },
  { Icon: Compass, key: "compass" },
];

const COLORS = {
  bg: "#0E1330",
  panel: "#161B44",
  cardBack: "#1F2657",
  cardBackHover: "#272E68",
  border: "#333B7A",
  gold: "#E8B84B",
  goldDim: "#B08F3A",
  violet: "#8C7FE0",
  cream: "#EDE7D8",
  creamDim: "#9B98B5",
  success: "#6FA287",
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const doubled = [...SYMBOLS, ...SYMBOLS].map((s, i) => ({
    ...s,
    id: `${s.key}-${i}`,
  }));
  return shuffle(doubled);
}

function formatTime(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function StarAtlasMemory() {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [locked, setLocked] = useState(false);

  const won = matched.length === deck.length && deck.length > 0;

  useEffect(() => {
    if (!running || won) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, won]);

  const handleFlip = useCallback(
    (index) => {
      if (locked) return;
      if (flipped.includes(index) || matched.includes(index)) return;
      if (!running) setRunning(true);

      const next = [...flipped, index];
      setFlipped(next);

      if (next.length === 2) {
        setLocked(true);
        setMoves((m) => m + 1);
        const [a, b] = next;
        if (deck[a].key === deck[b].key) {
          setTimeout(() => {
            setMatched((prev) => [...prev, a, b]);
            setFlipped([]);
            setLocked(false);
          }, 500);
        } else {
          setTimeout(() => {
            setFlipped([]);
            setLocked(false);
          }, 900);
        }
      }
    },
    [flipped, matched, locked, running, deck]
  );

  useEffect(() => {
    if (won) setRunning(false);
  }, [won]);

  function reset() {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setSeconds(0);
    setRunning(false);
    setLocked(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: COLORS.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        @keyframes twinkle {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.9; }
        }
        .star-dot { animation: twinkle 3.5s ease-in-out infinite; }
        .flip-card { perspective: 800px; }
        .flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
        }
        .flip-inner.is-flipped { transform: rotateY(180deg); }
        .flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .flip-face.back { transform: rotateY(180deg); }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="star-dot"
            style={{
              position: "absolute",
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              width: i % 5 === 0 ? 3 : 1.5,
              height: i % 5 === 0 ? 3 : 1.5,
              borderRadius: "50%",
              background: COLORS.cream,
              animationDelay: `${(i % 7) * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: COLORS.goldDim,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Constellation Memory
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 600,
              fontSize: 40,
              color: COLORS.cream,
              margin: 0,
              letterSpacing: "0.02em",
            }}
          >
            Star Atlas
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: COLORS.panel,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "10px 18px",
            marginBottom: 18,
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          <div style={{ color: COLORS.creamDim, fontSize: 13 }}>
            Moves <span style={{ color: COLORS.cream, fontWeight: 500 }}>{moves}</span>
          </div>
          <div style={{ color: COLORS.creamDim, fontSize: 13 }}>
            Time <span style={{ color: COLORS.cream, fontWeight: 500 }}>{formatTime(seconds)}</span>
          </div>
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: `1px solid ${COLORS.border}`,
              color: COLORS.creamDim,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {won && (
          <div
            style={{
              textAlign: "center",
              color: COLORS.gold,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              marginBottom: 14,
            }}
          >
            Mapped in {moves} moves, {formatTime(seconds)}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 10,
          }}
        >
          {deck.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(index);
            const isMatched = matched.includes(index);
            const { Icon } = card;
            return (
              <div
                key={card.id}
                className="flip-card"
                style={{ aspectRatio: "1 / 1" }}
                onClick={() => handleFlip(index)}
              >
                <div className={`flip-inner ${isFlipped ? "is-flipped" : ""}`}>
                  <div
                    className="flip-face front"
                    style={{
                      background: COLORS.cardBack,
                      border: `1px solid ${COLORS.border}`,
                      cursor: locked || isFlipped ? "default" : "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: COLORS.goldDim,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                  <div
                    className="flip-face back"
                    style={{
                      background: isMatched ? "#17301F" : COLORS.panel,
                      border: `1px solid ${isMatched ? COLORS.success : COLORS.violet}`,
                    }}
                  >
                    <Icon
                      size={28}
                      strokeWidth={1.6}
                      color={isMatched ? COLORS.success : COLORS.gold}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: COLORS.creamDim,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Flip two cards to find each matching pair.
        </div>
      </div>
    </div>
  );
}