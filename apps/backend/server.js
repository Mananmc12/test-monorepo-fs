import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));
app.use(express.json());

let items = [
  { id: "1", text: "First item from API" },
  { id: "2", text: "Second item from API" },
];

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "backend" });
});

app.get("/api/items", (_req, res) => {
  res.json({ items });
});

app.post("/api/items", (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  if (!text) {
    return res.status(400).json({ error: "Missing or empty text" });
  }
  const id = String(Date.now());
  const item = { id, text };
  items = [...items, item];
  res.status(201).json({ item });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
