import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (todos.length === 0) return <p>No Tasks yet, add your first one!</p>;

  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

export default TodoList;
