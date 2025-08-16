import React, { useState } from 'react';
import { TodoService } from '../client';

interface AddTodoFormProps {
  onAdd: () => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    TodoService.createTodoApiV1TodoPost({ requestBody: { title } })
      .then(() => {
        setTitle('');
        onAdd();
      })
      .catch(console.error);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col pd-5 m-5 space-y-4">
        <label htmlFor="todo-title" className="text-gray-700">Title</label>
        <input
          id="todo-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default AddTodoForm;
