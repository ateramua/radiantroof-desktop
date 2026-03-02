import { useState, useEffect } from "react";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/todos") // make sure this endpoint exists
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data);
        } else {
          console.error("Expected array, got:", data);
          setTodos([]);
        }
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load todos");
        setTodos([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {todos.length === 0 ? (
        <li>No todos yet</li>
      ) : (
        todos.map(todo => <li key={todo.id}>{todo.title}</li>)
      )}
    </ul>
  );
}

export default Todos;