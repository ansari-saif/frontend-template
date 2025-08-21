import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { TodoService, TodoRead } from '@/client';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<TodoRead[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoRead | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", isCompleted: false });
  const [isLoading, setIsLoading] = useState(false);

  const fetchTodos = async () => setTodos(await TodoService.listAllTodoApiV1TodoGet());
  const handleDelete = async (id: number) => {
    await TodoService.deleteTodoApiV1TodoTodoIdDelete({ todoId: id });
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const openDialog = (todo?: TodoRead) => {
    setEditingTodo(todo || null);
    setFormData(todo ? { title: todo.title || "", description: todo.description || "", isCompleted: todo.is_completed || false } : { title: "", description: "", isCompleted: false });
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsLoading(true);
    try {
      const todoData = { title: formData.title.trim(), description: formData.description.trim() || undefined, is_completed: formData.isCompleted };
      if (editingTodo) {
        await TodoService.updateTodoApiV1TodoTodoIdPut({ todoId: editingTodo.id!, requestBody: todoData });
      } else {
        await TodoService.createTodoApiV1TodoPost({ requestBody: todoData });
      }
      setShowDialog(false);
      fetchTodos();
    } catch (error) {
      console.error(`Failed to ${editingTodo ? 'update' : 'create'} todo:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<TodoRead>[] = [
    { accessorKey: "id", header: "ID", cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div> },
    { accessorKey: "title", header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Title <ArrowUpDown className="ml-2 h-4 w-4" /></Button>, cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div> },
    { accessorKey: "description", header: "Description", cell: ({ row }) => <div className="text-muted-foreground max-w-[200px] truncate">{row.getValue("description") || "—"}</div> },
    { accessorKey: "is_completed", header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status <ArrowUpDown className="ml-2 h-4 w-4" /></Button>, cell: ({ row }) => <div>{row.getValue("is_completed") ? "Completed" : "Pending"}</div> },
    {
      id: "actions", enableHiding: false, cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openDialog(row.original)}><Edit className="mr-2 h-4 w-4" />Edit Task</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDelete(row.original.id!)} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete Task</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({ data: todos, columns, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(), getFilteredRowModel: getFilteredRowModel() });

  useEffect(() => { fetchTodos(); }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Management</h1>
            <p className="text-muted-foreground mt-2">Organize and track your daily tasks efficiently</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">All Tasks</h2>
                <p className="text-sm text-muted-foreground">Manage your tasks with advanced filtering and sorting</p>
              </div>
              <Button size="sm" onClick={() => openDialog()}><Plus className="mr-2 h-4 w-4" />Add Task</Button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Input placeholder="Filter tasks..." value={(table.getColumn("title")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)} className="max-w-sm" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="outline" size="sm">Columns <ChevronDown className="ml-2 h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>{column.id}</DropdownMenuCheckboxItem>
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
                        <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        <p className="text-muted-foreground">No tasks found. Add one to get started!</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTodo ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            <DialogDescription>{editingTodo ? 'Update the task details below.' : 'Create a new task to add to your todo list.'} Click save when you're done.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter task title..." required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Add a description (optional)..." rows={3} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="completed" checked={formData.isCompleted} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCompleted: checked as boolean }))} />
                <Label htmlFor="completed">Mark as completed</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)} disabled={isLoading}>Cancel</Button>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? (editingTodo ? "Updating..." : "Creating...") : (editingTodo ? "Update Task" : "Create Task")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoPage;
