import React from 'react';
import { TodoRead } from '../client';

interface TodoItemProps {
  todo: TodoRead;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.is_completed}
          onChange={() => onToggle(todo.id)}
          className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
        />
        <span className={`text-lg ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {todo.title}
        </span>
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 focus:outline-none transition duration-300 ease-in-out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default TodoItem;
