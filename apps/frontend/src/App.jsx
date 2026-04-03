import { useCallback, useEffect, useState } from "react";

async function fetchJson(path, options) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || res.statusText || "Request failed");
  }
  return data;
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [healthErr, setHealthErr] = useState(null);
  const [items, setItems] = useState([]);
  const [itemsErr, setItemsErr] = useState(null);
  const [newText, setNewText] = useState("");
  const [posting, setPosting] = useState(false);
  const [postErr, setPostErr] = useState(null);

  const loadHealth = useCallback(async () => {
    setHealthErr(null);
    try {
      const data = await fetchJson("/api/health");
      setHealth(data);
    } catch (e) {
      setHealth(null);
      setHealthErr(e.message);
    }
  }, []);

  const loadItems = useCallback(async () => {
    setItemsErr(null);
    try {
      const data = await fetchJson("/api/items");
      setItems(data.items ?? []);
    } catch (e) {
      setItems([]);
      setItemsErr(e.message);
    }
  }, []);

  useEffect(() => {
    loadHealth();
    loadItems();
  }, [loadHealth, loadItems]);

  async function handleAdd(e) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setPosting(true);
    setPostErr(null);
    try {
      await fetchJson("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setNewText("");
      await loadItems();
    } catch (e) {
      setPostErr(e.message);
    } finally {
      setPosting(false);
    }
  }

  return (
    <>
      <h1>Simple monorepo</h1>
      <p className="lead">Frontend calls three backend routes under /api.</p>

      <section className="card">
        <h2>GET /api/health</h2>
        {healthErr ? (
          <p className="status err">{healthErr}</p>
        ) : health ? (
          <pre className="status">{JSON.stringify(health, null, 2)}</pre>
        ) : (
          <p className="status">Loading…</p>
        )}
        <button type="button" onClick={loadHealth} style={{ marginTop: "0.75rem" }}>
          Refresh health
        </button>
      </section>

      <section className="card">
        <h2>GET /api/items</h2>
        {itemsErr ? (
          <p className="status err">{itemsErr}</p>
        ) : (
          <ul>
            {items.map((it) => (
              <li key={it.id}>{it.text}</li>
            ))}
          </ul>
        )}
        <button type="button" onClick={loadItems} style={{ marginTop: "0.75rem" }}>
          Reload items
        </button>
      </section>

      <section className="card">
        <h2>POST /api/items</h2>
        <form onSubmit={handleAdd}>
          <input
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="New item text"
            aria-label="New item text"
          />
          <button type="submit" disabled={posting}>
            {posting ? "Adding…" : "Add"}
          </button>
        </form>
        {postErr ? <p className="status err" style={{ marginTop: "0.5rem" }}>{postErr}</p> : null}
      </section>
    </>
  );
}
