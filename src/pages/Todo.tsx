import React, { useEffect, useState } from 'react';
import { TodoService, TodoRead } from '../client';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/Sidebar';
import { TodoTable } from '@/components/TodoTable';
import SaveTodoDialog from '@/components/SaveTodoDialog';

const Todo: React.FC = () => {
  const [todos, setTodo] = useState<TodoRead[]>([]);
  const [editingTodo, setEditingTodo] = useState<TodoRead | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
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

  const handleEdit = (todo: TodoRead) => {
    setEditingTodo(todo);
    setShowEditDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                ← Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
              <p className="text-muted-foreground mt-2">
                Organize and track your daily tasks efficiently
              </p>
            </div>
          </div>

          
          {/* Table */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">All Tasks</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your tasks with advanced filtering and sorting
                </p>
              </div>
              <SaveTodoDialog onSave={getTodo} mode="add" />
            </div>
            <TodoTable 
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onAddNew={() => {}} // This will be handled by the dialog
            />
            
            {/* Edit Dialog */}
            <SaveTodoDialog 
              onSave={() => {
                getTodo();
                setEditingTodo(null);
                setShowEditDialog(false);
              }} 
              todo={editingTodo}
              mode="edit"
              open={showEditDialog}
              onOpenChange={setShowEditDialog}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
