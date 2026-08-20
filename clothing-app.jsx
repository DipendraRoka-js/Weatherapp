import { useState, useMemo } from "react";
import { ShoppingBag, X, Plus, Minus, Search } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Wool Overcoat", category: "Outerwear", price: 248, color: "Charcoal", size: ["S", "M", "L"] },
  { id: 2, name: "Cotton Poplin Shirt", category: "Tops", price: 68, color: "Ecru", size: ["XS", "S", "M", "L"] },
  { id: 3, name: "Straight Leg Trouser", category: "Bottoms", price: 96, color: "Olive", size: ["28", "30", "32", "34"] },
  { id: 4, name: "Ribbed Knit Sweater", category: "Tops", price: 88, color: "Rust", size: ["S", "M", "L"] },
  { id: 5, name: "Selvedge Denim", category: "Bottoms", price: 134, color: "Indigo", size: ["28", "30", "32"] },
  { id: 6, name: "Linen Blazer", category: "Outerwear", price: 178, color: "Sand", size: ["S", "M", "L"] },
  { id: 7, name: "Silk Slip Dress", category: "Dresses", price: 142, color: "Bone", size: ["XS", "S", "M"] },
  { id: 8, name: "Canvas Field Jacket", category: "Outerwear", price: 164, color: "Moss", size: ["S", "M", "L", "XL"] },
  { id: 9, name: "Merino Turtleneck", category: "Tops", price: 74, color: "Ink", size: ["XS", "S", "M", "L"] },
  { id: 10, name: "Pleated Midi Skirt", category: "Dresses", price: 92, color: "Clay", size: ["XS", "S", "M"] },
];

const CATEGORIES = ["All", "Outerwear", "Tops", "Bottoms", "Dresses"];

export default function ClothingApp() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(id, delta) {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div style={{ background: "#F6F4EF", minHeight: "100vh", color: "#1C1B19" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Work Sans', sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Header */}
      <header
        className="font-body"
        style={{
          borderBottom: "1px solid #DAD5CB",
          position: "sticky",
          top: 0,
          background: "#F6F4EF",
          zIndex: 20,
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 className="font-display" style={{ fontSize: 26, fontWeight: 600, letterSpacing: "0.01em" }}>
            Fold
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#8A8478" }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="font-body"
                style={{
                  paddingLeft: 32,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  fontSize: 14,
                  border: "1px solid #DAD5CB",
                  background: "transparent",
                  outline: "none",
                  width: 160,
                }}
              />
            </div>
            <button
              onClick={() => setCartOpen(true)}
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: 6 }}
              aria-label="Open cart"
            >
              <ShoppingBag size={20} color="#1C1B19" />
              {itemCount > 0 && (
                <span
                  className="font-mono"
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    background: "#2F4538",
                    color: "#F6F4EF",
                    fontSize: 10,
                    borderRadius: "999px",
                    width: 16,
                    height: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Category filter rail */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 0" }}>
        <div className="font-mono" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              style={{
                fontSize: 12,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                padding: "6px 14px",
                borderRadius: 999,
                border: category === c ? "1px solid #2F4538" : "1px solid #DAD5CB",
                background: category === c ? "#2F4538" : "transparent",
                color: category === c ? "#F6F4EF" : "#4A463E",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid — swing-tag cards */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 80px" }}>
        {filtered.length === 0 ? (
          <p className="font-body" style={{ color: "#8A8478", padding: "60px 0", textAlign: "center" }}>
            Nothing matches — try another search or category.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((p) => (
              <div
                key={p.id}
                className="font-body"
                style={{
                  border: "1px solid #DAD5CB",
                  background: "#FCFBF8",
                  padding: 18,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "1px solid #C7C1B4",
                  }}
                />
                <span className="font-mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8A8478" }}>
                  {p.category}
                </span>
                <h3 className="font-display" style={{ fontSize: 19, fontWeight: 500, lineHeight: 1.2 }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: 13, color: "#6B6659" }}>
                  {p.color} · {p.size.join(" / ")}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                  <span className="font-mono" style={{ fontSize: 15 }}>${p.price}</span>
                  <button
                    onClick={() => addToCart(p)}
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      padding: "7px 12px",
                      background: "#1C1B19",
                      color: "#F6F4EF",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Cart drawer */}
      {cartOpen && (
        <div
          onClick={() => setCartOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(28,27,25,0.35)", zIndex: 30 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="font-body"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: 340,
              maxWidth: "90vw",
              background: "#F6F4EF",
              borderLeft: "1px solid #DAD5CB",
              padding: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 className="font-display" style={{ fontSize: 20, fontWeight: 600 }}>Your Bag</h2>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            {cart.length === 0 ? (
              <p style={{ color: "#8A8478", fontSize: 14 }}>Your bag is empty.</p>
            ) : (
              <>
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
                  {cart.map((i) => (
                    <div key={i.id} style={{ borderBottom: "1px solid #E5E1D6", paddingBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{i.name}</span>
                        <span className="font-mono" style={{ fontSize: 13 }}>${i.price * i.qty}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={() => updateQty(i.id, -1)} style={{ border: "1px solid #DAD5CB", background: "none", cursor: "pointer", padding: 3 }}>
                          <Minus size={12} />
                        </button>
                        <span className="font-mono" style={{ fontSize: 13, width: 16, textAlign: "center" }}>{i.qty}</span>
                        <button onClick={() => updateQty(i.id, 1)} style={{ border: "1px solid #DAD5CB", background: "none", cursor: "pointer", padding: 3 }}>
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid #DAD5CB", paddingTop: 16, marginTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <span className="font-body" style={{ fontSize: 14 }}>Total</span>
                    <span className="font-mono" style={{ fontSize: 16 }}>${total}</span>
                  </div>
                  <button
                    className="font-mono"
                    style={{
                      width: "100%",
                      padding: "12px 0",
                      background: "#2F4538",
                      color: "#F6F4EF",
                      border: "none",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      cursor: "pointer",
                    }}
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
