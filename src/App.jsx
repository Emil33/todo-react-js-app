import React, { useState, useEffect } from "react";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";
import { DragDropContext } from "@hello-pangea/dnd";

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

  // Helpers
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const splicedArray = result.splice(startIndex, 1);
    const moved = splicedArray[0];
    result.splice(endIndex, 0, moved);
    return result;
  };

  // Action handlers
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
  // setTodos((prevTodos) => {
  //   const updated = prevTodos.filter((todo) => todo.id !== id);
  //   return updated;
  // });

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const deleteCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const updateTodo = (id, newText) => {
    const text = newText.trim();
    if (!text) return; // ignore empty saves
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text } : todo))
    );
  };

  const handleDragEnd = (result) => {
    console.log(result.source.index, "->", result.destination?.index);
    const { source, destination } = result;
    if (!destination) return; // dropped outside list
    if (source.index === destination.index) return; // no change

    setTodos((prev) => {
      // Build the *current* visible slice from prev using the active filter
      const visible = prev.filter(FILTERS[filter]);
      const reorderedVisible = reorder(
        visible,
        source.index,
        destination.index
      );

      // Put the reordered visible items back into their original slots,
      // while leaving non-visible (hidden by filter) items untouched.
      const visibleIds = new Set(visible.map((t) => t.id));
      let visIdx = 0;
      return prev.map((t) =>
        visibleIds.has(t.id) ? reorderedVisible[visIdx++] : t
      );
    });
  };

  const filteredTodos = todos.filter(FILTERS[filter]); // Apply the selected filter
  const activeCount = todos.filter((todo) => !todo.completed).length;
  const hasCompleted = todos.some((todo) => todo.completed); //Check if there are any completed tasks

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

          <button
            type="button"
            onClick={deleteCompleted}
            disabled={!hasCompleted}
            className={
              "ml-2 text-xs font-medium rounded-lg border px-3 py-1.5 transition border-red-200 text-red-600 hover:bg-red-50 active:scale-[0.99] disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
            }
          >
            Clear Completed
          </button>

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

        <DragDropContext onDragEnd={handleDragEnd}>
          <TodoList
            todos={filteredTodos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </DragDropContext>

        <div className="mt-6 text-center text-xs text-slate-400">
          <span className="inline-block px-2 py-1 rounded bg-slate-50 border border-slate-200">
            Drag items by the handle to reorder
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
