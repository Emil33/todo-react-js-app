import React, { useState, useEffect } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // setTodos((prevTodos) => {
  //   const updated = prevTodos.filter((todo) => todo.id !== id);
  //   return updated;
  // });

  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b to-slate-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 border-slate-100">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Smart To-Do Manager
        </h1>
        <p className="text-center text-slate-500 mb-6">
          {activeCount === 0
            ? "Nothing pending"
            : `${activeCount} ${activeCount > 1 ? "tasks" : "task"} pending`}
        </p>
        <AddTodo onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </div>
    </div>
  );
}

export default App;
