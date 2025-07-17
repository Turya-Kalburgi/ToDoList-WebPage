import { useEffect, useState } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/todos")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setTodos(data.todos || []))
      .catch((err) => {
        console.error("Error fetching todos:", err);
        setError("Failed to connect to backend");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("attachment", file);

    const res = await fetch("http://localhost:8000/todos", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setTodos([data.todo, ...todos]);

    setTitle("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📋 Todo Manager</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-4 rounded-xl max-w-xl mx-auto space-y-3 mb-6"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 rounded bg-gray-700 text-white"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 rounded bg-gray-700 text-white"
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-gray-300"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
        >
          Add Task
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-center text-red-400 mb-4">{error}</p>
      )}

      {/* Task List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="bg-gray-800 p-4 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold">{todo.title}</h2>
            <p className="text-sm text-gray-300">{todo.description}</p>

            {todo.file && (
              <a
                href={`http://localhost:8000/uploads/${todo.file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-blue-400 underline text-sm"
              >
                📎 View Attachment
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
