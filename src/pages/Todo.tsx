import React, { useEffect, useState } from 'react';
import TodoItem from '../components/TodoItem';
import { TodoService, TodoRead } from '../client';
import AddTodoForm from '@/components/AddTodoForm';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Todo: React.FC = () => {
  const [todos, setTodo] = useState<TodoRead[]>([]);
  const getTodo = ()=>{
    TodoService.listAllTodoApiV1TodoGet()
      .then(setTodo)
      .catch(console.error);
  }
  useEffect(() => {
    getTodo()
  }, []);

  const handleToggle = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      is_completed: !todo.is_completed,
    };

    TodoService.updateTodoApiV1TodoTodoIdPut({
      todoId: id,
      requestBody: updatedTodo,
    })
      .then((updated) => {
        setTodo((prev) =>
          prev.map((t) => (t.id === id ? updated : t))
        );
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    TodoService.deleteTodoApiV1TodoTodoIdDelete({ todoId: id })
      .then(() => {
        setTodo((prev) => prev.filter((t) => t.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <Link to="/" className="ml-4 bg-transparent border border-black px-6 py-3 rounded-md text-black hover:bg-white hover:text-indigo-600">
        Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">ToDo</h1>
          <AddTodoForm onAdd={getTodo} />
          <div className="mt-6 space-y-4">
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Todo;
