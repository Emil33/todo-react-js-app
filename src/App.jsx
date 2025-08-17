import React, { useState, useEffect } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

const FILTERS = {
  all: () => true,
  active: (todo) => !todo.completed,
  completed: (todo) => todo.completed,
};

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  // Track which filter tab is active
  const [filter, setFilter] = useState("all");

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

  // Apply the selected filter
  const filteredTodos = todos.filter(FILTERS[filter]);

  const activeCount = todos.filter((todo) => !todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-b to-slate-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-6 border-slate-100">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Smart To-Do Manager
        </h1>
        <ul></ul>
        <p className="text-center text-slate-500 mb-6">
          {activeCount === 0
            ? "Nothing pending"
            : `${activeCount} ${activeCount > 1 ? "tasks" : "task"} pending`}
        </p>
        <AddTodo onAdd={addTodo} />

        <div
          role="tablist"
          aria-label="Filter tasks"
          className="mb-4 flex items-center justify-between gap-2 flex-wrap"
        >
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
            {["all", "active", "completed"].map((key) => {
              const isActive = filter === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setFilter(key)}
                  className={
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition " +
                    (isActive
                      ? "bg-white text-slate-900 shadow"
                      : "text-slate-600 hover:text-slate-800 hover:bg-white/70")
                  }
                >
                  {key[0].toUpperCase() + key.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Task State Counts*/}
          <div className="flex gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 rounded bg-slate-50 border border-slate-200">
              All: {todos.length}
            </span>
            <span className="px-2 py-1 rounded bg-slate-50 border border-slate-200">
              Active: {todos.filter(FILTERS.active).length}
            </span>
            <span className="px-2 py-1 rounded bg-slate-50 border border-slate-200">
              Completed: {todos.filter(FILTERS.completed).length}
            </span>
          </div>
        </div>

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
}

export default App;
