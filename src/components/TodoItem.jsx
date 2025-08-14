import React from "react";

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 accent-blue-6 cursor-pointer"
      />
      <span
        // style={{ textDecoration: todo.completed ? "line-through" : "none" }}
        className={`flex-1 text-slate-800 ${
          todo.completed ? "line-through text-slate-400" : ""
        }`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-600 hover:text-red-700 text-sm font-medium"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;
