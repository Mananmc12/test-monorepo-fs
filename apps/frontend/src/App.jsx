import { useEffect, useState } from "react";

// Backend URL (Express on port 5000)
const API = process.env.VITE_BACKEND_URL;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  // Load todos when the page opens
  async function loadTodos() {
    try {
      const res = await fetch(`${API}/todos`);
      if (!res.ok) throw new Error("Failed to load todos");
      const data = await res.json();
      setTasks(data);
      setError("");
    } catch (e) {
      setError(e.message || "Could not reach the server. Is the backend running?");
    }
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    try {
      const res = await fetch(`${API}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add task");
      }

      setInput("");
      await loadTodos();
    } catch (e) {
      setError(e.message || "Could not add task");
    }
  }

  async function deleteTask(id) {
    try {
      const res = await fetch(`${API}/todos/${id}`, { method: "DELETE" });
      if (res.status === 404) throw new Error("Task not found");
      if (!res.ok) throw new Error("Failed to delete");

      await loadTodos();
      setError("");
    } catch (e) {
      setError(e.message || "Could not delete task");
    }
  }

  return (
    <div className="app">
      <h1>Todo List</h1>

      {error ? <p className="error">{error}</p> : null}

      <form onSubmit={addTask} className="row">
        <input
          type="text"
          placeholder="New task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="New task"
        />
        <button type="submit">Add</button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add one above.</p>
      ) : (
        <ul>
          {tasks.map((t) => (
            <li key={t.id}>
              <span>{t.text}</span>
              <button type="button" className="danger" onClick={() => deleteTask(t.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
