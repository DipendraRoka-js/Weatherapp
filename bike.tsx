import React, { useState, useMemo } from "react";
import { Heart, Gauge, Zap, Weight, Search, Flame } from "lucide-react";

const BIKES = [
  { id: 1, name: "Ninja 650", brand: "Kawasaki", type: "Sport", cc: 649, power: 67, weight: 196, topSpeed: 200, price: 7649 },
  { id: 2, name: "Duke 390", brand: "KTM", type: "Naked", cc: 373, power: 43, weight: 167, topSpeed: 167, price: 5899 },
  { id: 3, name: "Classic 350", brand: "Royal Enfield", type: "Cruiser", cc: 349, power: 20, weight: 195, topSpeed: 120, price: 4599 },
  { id: 4, name: "Africa Twin", brand: "Honda", type: "Adventure", cc: 1084, power: 101, weight: 226, topSpeed: 200, price: 14399 },
  { id: 5, name: "Iron 883", brand: "Harley-Davidson", type: "Cruiser", cc: 883, power: 50, weight: 256, topSpeed: 160, price: 9499 },
  { id: 6, name: "GTS 300", brand: "Vespa", type: "Scooter", cc: 278, power: 24, weight: 158, topSpeed: 130, price: 6899 },
  { id: 7, name: "MT-07", brand: "Yamaha", type: "Naked", cc: 689, power: 73, weight: 184, topSpeed: 210, price: 8199 },
  { id: 8, name: "Panigale V2", brand: "Ducati", type: "Sport", cc: 955, power: 155, weight: 200, topSpeed: 270, price: 17995 },
];

const MAX_SPEED = 270;
const MAX_POWER = 160;
const TYPES = ["All", ...Array.from(new Set(BIKES.map((b) => b.type)))];

function SpeedGauge({ topSpeed, power }) {
  const pct = Math.min(topSpeed / MAX_SPEED, 1);
  const angle = -120 + pct * 240; // -120deg to +120deg sweep
  const radius = 70;
  const cx = 90;
  const cy = 90;
  const arcFor = (frac) => {
    const start = -120;
    const end = start + frac * 240;
    const toXY = (deg) => {
      const rad = (deg * Math.PI) / 180;
      return [cx + radius * Math.sin(rad), cy - radius * Math.cos(rad)];
    };
    const [x1, y1] = toXY(start);
    const [x2, y2] = toXY(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <svg viewBox="0 0 180 150" className="w-44 h-40">
      <path d={arcFor(1)} fill="none" stroke="#3a3a3d" strokeWidth="10" strokeLinecap="round" />
      <path d={arcFor(pct)} fill="none" stroke="#f5b700" strokeWidth="10" strokeLinecap="round" />
      <line
        x1={cx}
        y1={cy}
        x2={cx + 52 * Math.sin((angle * Math.PI) / 180)}
        y2={cy - 52 * Math.cos((angle * Math.PI) / 180)}
        stroke="#e63946"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="5" fill="#f2f0eb" />
      <text x={cx} y={cy + 34} textAnchor="middle" fill="#f2f0eb" fontSize="20" fontWeight="900" fontFamily="monospace">
        {topSpeed}
      </text>
      <text x={cx} y={cy + 50} textAnchor="middle" fill="#8b8d93" fontSize="9" letterSpacing="2" fontFamily="monospace">
        KM/H TOP
      </text>
    </svg>
  );
}

function SpecBar({ icon: Icon, label, value, max, unit, color }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-zinc-500 font-mono">
          <Icon size={12} />
          {label}
        </div>
        <span className="text-sm font-mono font-bold text-zinc-100">
          {value}
          <span className="text-zinc-500 text-xs">{unit}</span>
        </span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function MotoGarageApp() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedId, setSelectedId] = useState(BIKES[0].id);
  const [favorites, setFavorites] = useState(new Set());

  const filtered = useMemo(() => {
    return BIKES.filter((b) => {
      const matchesType = typeFilter === "All" || b.type === typeFilter;
      const matchesQuery = (b.name + b.brand).toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [query, typeFilter]);

  const selected = BIKES.find((b) => b.id === selectedId) || filtered[0] || BIKES[0];

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#16171a] text-zinc-100 font-sans p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#f2f0eb]">
              Moto<span className="text-[#f5b700]">Garage</span>
            </h1>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">
              {filtered.length} bikes on the rack · {favorites.size} favorited
            </p>
          </div>
          <Flame className="text-[#e63946]" size={28} />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search make or model..."
              className="w-full bg-[#1f2023] border border-zinc-800 rounded-lg py-2.5 pl-9 pr-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-[#f5b700] transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-colors ${
                  typeFilter === t
                    ? "bg-[#f5b700] text-[#16171a]"
                    : "bg-[#1f2023] text-zinc-400 border border-zinc-800 hover:border-zinc-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-2 flex flex-col gap-2">
            {filtered.length === 0 && (
              <div className="text-zinc-600 text-sm font-mono text-center py-10 border border-dashed border-zinc-800 rounded-lg">
                No bikes match. Try another search.
              </div>
            )}
            {filtered.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                  selected.id === b.id
                    ? "bg-[#1f2023] border-[#f5b700]"
                    : "bg-[#1a1b1e] border-zinc-800 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{b.brand}</div>
                    <div className="font-black uppercase tracking-tight text-lg leading-tight">{b.name}</div>
                    <div className="text-xs text-zinc-500 font-mono mt-0.5">{b.type} · {b.cc}cc</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(b.id);
                    }}
                    className="p-1"
                    aria-label="favorite"
                  >
                    <Heart
                      size={18}
                      fill={favorites.has(b.id) ? "#e63946" : "none"}
                      stroke={favorites.has(b.id) ? "#e63946" : "#666"}
                    />
                  </button>
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-3 bg-[#1a1b1e] border border-zinc-800 rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">{selected.brand}</div>
                <h2 className="text-2xl font-black uppercase tracking-tight">{selected.name}</h2>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-widest bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                  {selected.type}
                </span>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Price</div>
                <div className="text-xl font-mono font-bold text-[#f5b700]">${selected.price.toLocaleString()}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-zinc-800 mt-3 pt-4">
              <SpeedGauge topSpeed={selected.topSpeed} power={selected.power} />
              <div className="flex-1 w-full">
                <SpecBar icon={Zap} label="Power" value={selected.power} max={MAX_POWER} unit=" hp" color="#f5b700" />
                <SpecBar icon={Weight} label="Weight" value={selected.weight} max={280} unit=" kg" color="#8b8d93" />
                <SpecBar icon={Gauge} label="Engine" value={selected.cc} max={1100} unit=" cc" color="#e63946" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}