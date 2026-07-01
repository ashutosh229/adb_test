import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000/todos/";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch TODOs.");
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedDescription = description.trim();

    if (!trimmedDescription) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: trimmedDescription,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create TODO.");
      }

      setDescription("");
      await fetchTodos();
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="App">
      <div>
        <h1>List of TODOs</h1>

        {loading ? (
          <p>Loading TODOs...</p>
        ) : todos.length === 0 ? (
          <p>No TODOs found.</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo._id}>{todo.description}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h1>Create a TODO</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="todo">TODO: </label>

            <input
              id="todo"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter a TODO"
            />
          </div>

          <div style={{ marginTop: "5px" }}>
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add TODO"}
            </button>
          </div>
        </form>

        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}
