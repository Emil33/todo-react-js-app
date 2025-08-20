import React, { useState, useEffect, useRef } from "react";

function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setDraft(todo.text);
  }, [todo.text, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Action handlers
  const startEdit = () => {
    setDraft(todo.text);
    setIsEditing(true);
  };

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== todo.text) {
      onUpdate(todo.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(todo.text);
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 accent-blue-6 cursor-pointer"
      />
      {!isEditing ? (
        <button
          type="button"
          onDoubleClick={startEdit}
          className={`flex-1 text-left truncate ${
            todo.completed ? "line-through text-slate-400" : "text-slate-800"
          }`}
          title="Double-click to edit"
        >
          {todo.text}
        </button>
      ) : (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={onKeyDown}
          className="flex-1 rounded-md border border-slate-300 ..."
        />
      )}
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
