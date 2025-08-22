import React from "react";
import TodoItem from "./TodoItem";
import { Droppable, Draggable } from "@hello-pangea/dnd";

function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (todos.length === 0) return <p>No Tasks yet, add your first one!</p>;

  return (
    <Droppable droppableId="todos">
      {(provided, snapshot) => (
        <ul
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`space-y-2 transition ${
            snapshot.isDraggingOver ? "bg-slate-50 p-2 sm:p-3 rounded-xl" : ""
          }`}
        >
          {todos.map((todo, index) => (
            <Draggable
              key={todo.id}
              draggableId={String(todo.id)}
              index={index}
            >
              {(dragProvided, dragSnapshot) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  dragRef={dragProvided.innerRef}
                  dragProps={dragProvided.draggableProps}
                  dragHandleProps={dragProvided.dragHandleProps}
                  isDragging={dragSnapshot.isDragging}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
}

export default TodoList;
