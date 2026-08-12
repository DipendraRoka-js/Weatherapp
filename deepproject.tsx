import { useState, useMemo } from "react";

const initialTasks = [
  { id: 1, text: "Learn useState", done: true, category: "Study" },
  { id: 2, text: "Learn useMemo", done: false, category: "Study" },
  { id: 3, text: "Buy groceries", done: false, category: "Personal" },
];

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | done

  // Add a new task
  function addTask(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newTask = {
      id: Date.now(),
      text: input,
      done: false,
      category: "General",
    };
    setTasks([...tasks, newTask]);
    setInput("");
  }

  // Toggle done/undone
  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  // Delete a task
  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // Filtered list (recalculated only when tasks/filter change)
  const visibleTasks = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>My Tasks</h2>

      <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Add</button>
      </form>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("done")}>Done</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {visibleTasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "6px 0",
              textDecoration: task.done ? "line-through" : "none",
            }}
          >
            <span onClick={() => toggleTask(task.id)} style={{ cursor: "pointer" }}>
              {task.text} <small>({task.category})</small>
            </span>
            <button onClick={() => deleteTask(task.id)}>✕</button>
          </li>
        ))}
      </ul>

      <p>{remaining} task(s) remaining</p>
    </div>
  );
}