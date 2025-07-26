import React, { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { TodoTable } from './TodoTable';
import SaveTodoDialog from './SaveTodoDialog';
import { useTodo } from '../hooks/useTodo';

export const TodoView: React.FC = () => {
  const {
    todos,
    editingTodo,
    showEditDialog,
    getTodos,
    toggleTodo,
    deleteTodo,
    editTodo,
    setShowEditDialog,
  } = useTodo();

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-4">
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
              <SaveTodoDialog onSave={getTodos} mode="add" />
            </div>
            <TodoTable
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />

            {/* Edit Dialog */}
            <SaveTodoDialog
              onSave={() => {
                getTodos();
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