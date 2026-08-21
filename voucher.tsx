import React, { useState } from "react";

const VOUCHERS = [
  { code: "SAVE10", discount: 10 },
  { code: "SAVE20", discount: 20 },
  { code: "FREESHIP", discount: 5 },
];

export default function VoucherApp() {
  const [input, setInput] = useState("");
  const [applied, setApplied] = useState(null);
  const [error, setError] = useState("");
  const [total] = useState(100);

  const handleApply = () => {
    const found = VOUCHERS.find(
      (v) => v.code.toLowerCase() === input.trim().toLowerCase()
    );
    if (found) {
      setApplied(found);
      setError("");
    } else {
      setApplied(null);
      setError("Invalid voucher code");
    }
  };

  const handleRemove = () => {
    setApplied(null);
    setInput("");
    setError("");
  };

  const finalPrice = applied
    ? total - (total * applied.discount) / 100
    : total;

  return (
    <div style={styles.container}>
      <h2>Voucher Checkout</h2>
      <p>Order Total: ${total.toFixed(2)}</p>

      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Enter voucher code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        {applied ? (
          <button onClick={handleRemove} style={styles.buttonRemove}>
            Remove
          </button>
        ) : (
          <button onClick={handleApply} style={styles.button}>
            Apply
          </button>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {applied && (
        <p style={styles.success}>
          Voucher "{applied.code}" applied: {applied.discount}% off
        </p>
      )}

      <h3>Final Price: ${finalPrice.toFixed(2)}</h3>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 8,
    fontFamily: "sans-serif",
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    padding: 8,
    border: "1px solid #ccc",
    borderRadius: 4,
  },
  button: {
    padding: "8px 12px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  buttonRemove: {
    padding: "8px 12px",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};