import React, { useState, useMemo } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Cell } from "recharts";

const CATEGORIES = [
  { id: "food", label: "Food", color: "#C1613B" },
  { id: "transport", label: "Transport", color: "#8C7A3E" },
  { id: "housing", label: "Housing", color: "#3E7C6B" },
  { id: "leisure", label: "Leisure", color: "#7A5C8C" },
  { id: "other", label: "Other", color: "#6B6558" },
];

const seedEntries = [
  { id: 1, desc: "Farmers market produce", amount: -34.5, category: "food", date: "Aug 03" },
  { id: 2, desc: "Freelance payment — Kessler Co.", amount: 620, category: "other", date: "Aug 04" },
  { id: 3, desc: "Metro pass, monthly", amount: -75, category: "transport", date: "Aug 04" },
  { id: 4, desc: "Rent", amount: -1200, category: "housing", date: "Aug 05" },
  { id: 5, desc: "Cinema, two tickets", amount: -22, category: "leisure", date: "Aug 06" },
  { id: 6, desc: "Consulting retainer", amount: 900, category: "other", date: "Aug 07" },
  { id: 7, desc: "Coffee, weekly stock", amount: -18.4, category: "food", date: "Aug 08" },
];

function formatMoney(n) {
  const sign = n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export default function Ledger() {
  const [entries, setEntries] = useState(seedEntries);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [filter, setFilter] = useState("all");

  const balance = useMemo(
    () => entries.reduce((sum, e) => sum + e.amount, 0),
    [entries]
  );

  const income = useMemo(
    () => entries.filter((e) => e.amount > 0).reduce((s, e) => s + e.amount, 0),
    [entries]
  );

  const spent = useMemo(
    () => entries.filter((e) => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0),
    [entries]
  );

  const chartData = useMemo(() => {
    return CATEGORIES.map((c) => ({
      name: c.label,
      total: entries
        .filter((e) => e.category === c.id && e.amount < 0)
        .reduce((s, e) => s + Math.abs(e.amount), 0),
      color: c.color,
    })).filter((d) => d.total > 0);
  }, [entries]);

  const filteredEntries = useMemo(() => {
    if (filter === "all") return entries;
    if (filter === "income") return entries.filter((e) => e.amount > 0);
    if (filter === "expense") return entries.filter((e) => e.amount < 0);
    return entries.filter((e) => e.category === filter);
  }, [entries, filter]);

  function addEntry(e) {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!desc.trim() || isNaN(val) || val <= 0) return;
    const signed = type === "expense" ? -val : val;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setEntries((prev) => [
      { id: Date.now(), desc: desc.trim(), amount: signed, category, date: dateStr },
      ...prev,
    ]);
    setDesc("");
    setAmount("");
  }

  function removeEntry(id) {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  const catMap = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

  return (
    <div
      style={{
        background: "#F6F0E4",
        minHeight: "100vh",
        fontFamily: "'Inter', ui-sans-serif, system-ui",
        color: "#1A1A16",
      }}
      className="w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .ledger-row { border-bottom: 1px dashed #C9BFA8; }
        .ledger-row:last-child { border-bottom: none; }
        .tape-edge {
          background-image: repeating-linear-gradient(
            -45deg, #1B3A2F, #1B3A2F 6px, #17332A 6px, #17332A 12px
          );
        }
        input:focus, select:focus, button:focus-visible {
          outline: 2px solid #C9A227;
          outline-offset: 2px;
        }
      `}</style>

      <div style={{ background: "#1B3A2F" }} className="text-[#F6F0E4] px-6 py-8 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-1" style={{ color: "#C9A227" }}>
            <Receipt size={18} />
            <span className="text-xs tracking-[0.2em] uppercase font-medium">Personal Ledger</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Running Balance
          </h1>
          <div className="flex flex-wrap items-end gap-8">
            <div>
              <div className="text-xs uppercase tracking-wide opacity-70 mb-1">Balance</div>
              <div
                className="font-mono text-4xl md:text-5xl font-bold"
                style={{ color: balance >= 0 ? "#E8DCC0" : "#E39C7A" }}
              >
                {formatMoney(balance)}
              </div>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <TrendingUp size={16} style={{ color: "#7EC9A8" }} />
              <span className="font-mono text-sm" style={{ color: "#7EC9A8" }}>
                {formatMoney(income)} in
              </span>
            </div>
            <div className="flex items-center gap-2 pb-1">
              <TrendingDown size={16} style={{ color: "#E39C7A" }} />
              <span className="font-mono text-sm" style={{ color: "#E39C7A" }}>
                {formatMoney(spent)} out
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="tape-edge h-2 w-full" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 py-10 grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Entries</h2>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm font-mono bg-transparent border border-[#C9BFA8] rounded px-2 py-1"
            >
              <option value="all">All</option>
              <option value="income">Income only</option>
              <option value="expense">Expenses only</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{ background: "#FFFDF8", border: "1px solid #E4DAC0" }}
            className="rounded-md shadow-sm"
          >
            {filteredEntries.length === 0 && (
              <div className="p-6 text-sm text-center opacity-60">
                Nothing here. Add an entry to get started.
              </div>
            )}
            {filteredEntries.map((e) => (
              <div
                key={e.id}
                className="ledger-row flex items-center justify-between px-4 py-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: catMap[e.category]?.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">{e.desc}</div>
                    <div className="text-xs opacity-60 font-mono">
                      {e.date} · {catMap[e.category]?.label}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: e.amount < 0 ? "#B5502E" : "#2F6B54" }}
                  >
                    {formatMoney(e.amount)}
                  </span>
                  <button
                    onClick={() => removeEntry(e.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Delete ${e.desc}`}
                  >
                    <Trash2 size={14} className="text-[#B5502E]" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {chartData.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-lg font-semibold mb-3">Spending by category</h3>
              <div
                style={{ background: "#FFFDF8", border: "1px solid #E4DAC0" }}
                className="rounded-md p-4"
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4DAC0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#6B6558" }}
                      axisLine={{ stroke: "#E4DAC0" }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6B6558" }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      formatter={(v) => [`$${v.toFixed(2)}`, "Spent"]}
                      contentStyle={{
                        background: "#1B3A2F",
                        border: "none",
                        borderRadius: 6,
                        color: "#F6F0E4",
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h2 className="font-display text-xl font-semibold mb-4">Add entry</h2>
          <form
            onSubmit={addEntry}
            style={{ background: "#FFFDF8", border: "1px solid #E4DAC0" }}
            className="rounded-md p-5 flex flex-col gap-4"
          >
            <div className="flex rounded-md overflow-hidden border border-[#E4DAC0]">
              <button
                type="button"
                onClick={() => setType("expense")}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{
                  background: type === "expense" ? "#1B3A2F" : "transparent",
                  color: type === "expense" ? "#F6F0E4" : "#1A1A16",
                }}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className="flex-1 py-2 text-sm font-medium transition-colors"
                style={{
                  background: type === "income" ? "#1B3A2F" : "transparent",
                  color: type === "income" ? "#F6F0E4" : "#1A1A16",
                }}
              >
                Income
              </button>
            </div>

            <label className="text-xs uppercase tracking-wide opacity-70 -mb-2">
              Description
            </label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Groceries, invoice #42"
              className="border border-[#E4DAC0] rounded px-3 py-2 text-sm bg-transparent"
            />

            <label className="text-xs uppercase tracking-wide opacity-70 -mb-2">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              inputMode="decimal"
              className="border border-[#E4DAC0] rounded px-3 py-2 text-sm bg-transparent font-mono"
            />

            {type === "expense" && (
              <>
                <label className="text-xs uppercase tracking-wide opacity-70 -mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-[#E4DAC0] rounded px-3 py-2 text-sm bg-transparent"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: "#C9A227", color: "#1B3A2F" }}
            >
              <Plus size={16} />
              Record entry
            </button>
          </form>

          <div className="mt-6 text-xs leading-relaxed opacity-60">
            Entries live in this session only — refreshing clears the ledger. Everything here is
            sample data to start you off.
          </div>
        </div>
      </div>
    </div>
  );
}