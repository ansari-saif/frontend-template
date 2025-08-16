import { TodoRead } from "@/client";

export interface TodoState {
  todos: TodoRead[];
  editingTodo: TodoRead | null;
  showEditDialog: boolean;
}

export interface TodoActions {
  getTodos: () => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  editTodo: (todo: TodoRead) => void;
  setShowEditDialog: (show: boolean) => void;
}

export interface TodoTableProps {
  todos: TodoRead[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (todo: TodoRead) => void;
}

export interface SaveTodoDialogProps {
  onSave: () => void;
  todo?: TodoRead | null;
  mode?: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
} 