import { useState } from 'react';
import { TodoService, TodoRead } from '@/client';
import { TodoState, TodoActions } from '@/types/TodoModule';

export const useTodo = (): TodoState & TodoActions => {
  const [todos, setTodos] = useState<TodoRead[]>([]);
  const [editingTodo, setEditingTodo] = useState<TodoRead | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const getTodos = async () => {
    try {
      const result = await TodoService.listAllTodoApiV1TodoGet();
      setTodos(result);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const updatedTodo = {
      ...todo,
      is_completed: !todo.is_completed,
    };

    try {
      const updated = await TodoService.updateTodoApiV1TodoTodoIdPut({
        todoId: id,
        requestBody: updatedTodo,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await TodoService.deleteTodoApiV1TodoTodoIdDelete({ todoId: id });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const editTodo = (todo: TodoRead) => {
    setEditingTodo(todo);
    setShowEditDialog(true);
  };

  return {
    todos,
    editingTodo,
    showEditDialog,
    getTodos,
    toggleTodo,
    deleteTodo,
    editTodo,
    setShowEditDialog,
  };
}; 