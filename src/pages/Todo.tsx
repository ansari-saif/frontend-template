import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { TodoService, TodoRead } from '@/client';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Custom hook for todo management
const useTodo = () => {
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

    try {
      const updated = await TodoService.updateTodoApiV1TodoTodoIdPut({
        todoId: id,
        requestBody: { ...todo, is_completed: !todo.is_completed },
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

// Todo Dialog Component
const TodoDialog: React.FC<{
  onSave: () => void;
  todo?: TodoRead | null;
  mode?: 'add' | 'edit';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}> = ({ onSave, todo = null, trigger, mode = 'add', open: externalOpen, onOpenChange: externalOnOpenChange }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const isEditMode = mode === 'edit' && todo;

  useEffect(() => {
    if (open && isEditMode) {
      setTitle(todo.title || "");
      setDescription(todo.description || "");
      setIsCompleted(todo.is_completed || false);
    } else if (open && !isEditMode) {
      setTitle("");
      setDescription("");
      setIsCompleted(false);
    }
  }, [open, todo, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const todoData = {
        title: title.trim(),
        description: description.trim() || undefined,
        is_completed: isCompleted
      };

      if (isEditMode) {
        await TodoService.updateTodoApiV1TodoTodoIdPut({
          todoId: todo.id!,
          requestBody: todoData
        });
      } else {
        await TodoService.createTodoApiV1TodoPost({ requestBody: todoData });
      }
      
      setTitle("");
      setDescription("");
      setIsCompleted(false);
      setOpen(false);
      onSave();
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} todo:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(trigger || mode === 'add') && (
        <DialogTrigger asChild>
          {trigger || (
            <Button size="sm" variant={isEditMode ? "outline" : "default"}>
              {isEditMode ? (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Task
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the task details below.' : 'Create a new task to add to your todo list.'} Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description (optional)..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={isCompleted}
                onCheckedChange={(checked) => setIsCompleted(checked as boolean)}
              />
              <Label htmlFor="completed">Mark as completed</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Task" : "Create Task")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Table Columns
const columns: ColumnDef<TodoRead>[] = [
  {
    accessorKey: "id",
    header: () => <div>ID</div>,
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return <div className="text-muted-foreground max-w-[200px] truncate">{description || "—"}</div>;
    },
  },
  {
    accessorKey: "is_completed",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("is_completed") ? "Completed" : "Pending"}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const todo = row.original;
      const meta = table.options.meta as { onDelete: (id: number) => void; onEdit: (todo: TodoRead) => void };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta?.onEdit(todo)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onDelete(todo.id!)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Todo Table Component
const TodoTable: React.FC<{ todos: TodoRead[]; onDelete: (id: number) => void; onEdit: (todo: TodoRead) => void }> = ({ todos, onDelete, onEdit }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: todos,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { sorting, columnFilters, columnVisibility },
    meta: { onDelete, onEdit },
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <p className="text-muted-foreground">No tasks found. Add one to get started!</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  );
};

// Main Todo Page Component
const TodoPage: React.FC = () => {
  const { todos, editingTodo, showEditDialog, getTodos, deleteTodo, editTodo, setShowEditDialog } = useTodo();

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
              <p className="text-muted-foreground mt-2">Organize and track your daily tasks efficiently</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">All Tasks</h2>
                <p className="text-sm text-muted-foreground">Manage your tasks with advanced filtering and sorting</p>
              </div>
              <TodoDialog onSave={getTodos} mode="add" />
            </div>
            <TodoTable todos={todos} onDelete={deleteTodo} onEdit={editTodo} />

            <TodoDialog
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

export default TodoPage;
