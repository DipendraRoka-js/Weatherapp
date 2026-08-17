import React, { useState } from "react";

const MOVIES = [
  { id: 1, title: "Inception", year: 2010, genre: "Sci-Fi", rating: 8.8, poster: "🌀" },
  { id: 2, title: "The Dark Knight", year: 2008, genre: "Action", rating: 9.0, poster: "🦇" },
  { id: 3, title: "Interstellar", year: 2014, genre: "Sci-Fi", rating: 8.6, poster: "🚀" },
  { id: 4, title: "Parasite", year: 2019, genre: "Thriller", rating: 8.6, poster: "🏠" },
  { id: 5, title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy", rating: 8.1, poster: "🏨" },
  { id: 6, title: "Whiplash", year: 2014, genre: "Drama", rating: 8.5, poster: "🥁" },
  { id: 7, title: "Get Out", year: 2017, genre: "Horror", rating: 7.7, poster: "🌀" },
  { id: 8, title: "La La Land", year: 2016, genre: "Musical", rating: 8.0, poster: "🎹" },
];

const GENRES = ["All", ...new Set(MOVIES.map((m) => m.genre))];

export default function MovieApp() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filtered = MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(query.toLowerCase()) &&
      (genre === "All" || m.genre === genre)
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🎬 Movie App</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {filtered.map((movie) => (
          <div
            key={movie.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 10,
              padding: 16,
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48 }}>{movie.poster}</div>
            <h3 style={{ margin: "8px 0 4px" }}>{movie.title}</h3>
            <p style={{ margin: 0, color: "#666" }}>{movie.year} • {movie.genre}</p>
            <p style={{ margin: "4px 0" }}>⭐ {movie.rating}</p>
            <button
              onClick={() => toggleFavorite(movie.id)}
              style={{
                marginTop: 8,
                padding: "6px 12px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: favorites.includes(movie.id) ? "#e63946" : "#ddd",
                color: favorites.includes(movie.id) ? "#fff" : "#333",
              }}
            >
              {favorites.includes(movie.id) ? "❤️ Favorited" : "🤍 Favorite"}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p>No movies found.</p>}
      </div>
    </div>
  );
}