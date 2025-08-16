# Module Development Guide

A comprehensive guide for developing new modules in this React TypeScript application. This guide is based on the Todo module implementation and provides step-by-step instructions for creating feature-rich modules with CRUD operations, data tables, and modern UI components.

## 📋 Table of Contents

- [Module Architecture Overview](#module-architecture-overview)
- [Prerequisites](#prerequisites)
- [Step-by-Step Module Development](#step-by-step-module-development)
- [API Integration](#api-integration)
- [Component Structure](#component-structure)
- [State Management](#state-management)
- [Data Table Implementation](#data-table-implementation)
- [Form Handling](#form-handling)
- [Best Practices](#best-practices)
- [Example: Todo Module Breakdown](#example-todo-module-breakdown)

## 🏗️ Module Architecture Overview

The application follows a modular architecture with the following structure:

```
src/
├── modules/           # Feature modules
│   ├── todo/         # Todo module (example)
│   │   ├── components/  # Module-specific components
│   │   ├── hooks/       # Custom hooks
│   │   └── types/       # TypeScript types
│   └── [new-module]/  # Your new module
├── pages/            # Page components (main entry points)
├── components/       # Shared UI components
│   └── ui/          # Shadcn/ui components
├── client/          # Auto-generated API client
└── config/          # Application configuration
```

## 📋 Prerequisites

Before developing a new module, ensure you have:

- **API Endpoints**: Backend API with OpenAPI/Swagger specification
- **TypeScript Knowledge**: Understanding of React hooks and TypeScript
- **UI Components**: Familiarity with Shadcn/ui components
- **TanStack Table**: Knowledge of table implementation

## 🚀 Step-by-Step Module Development

### 1. API Client Setup

First, ensure your API client is generated from OpenAPI specification:

```bash
# Update openapi.json with your API spec
# Regenerate client (if using openapi-generator)
npm run generate-client
```

### 2. Create Module Structure

Create the module directory structure:

```bash
mkdir -p src/modules/[module-name]/components
mkdir -p src/modules/[module-name]/hooks
mkdir -p src/modules/[module-name]/types
```

### 3. Define TypeScript Types

Create `src/modules/[module-name]/types/index.ts`:

```typescript
// Example based on Todo types
export interface ModuleItem {
  id?: number;
  title: string;
  description?: string;
  is_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleFormData {
  title: string;
  description: string;
  isCompleted: boolean;
}
```

### 4. Create Custom Hooks

Create `src/modules/[module-name]/hooks/useModule.ts`:

```typescript
import { useState, useEffect } from 'react';
import { ModuleService, ModuleItem } from '@/client';

export const useModule = () => {
  const [items, setItems] = useState<ModuleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const data = await ModuleService.listAllModuleApiV1ModuleGet();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (itemData: Partial<ModuleItem>) => {
    try {
      await ModuleService.createModuleApiV1ModulePost({ requestBody: itemData });
      fetchItems();
    } catch (error) {
      console.error('Failed to create item:', error);
    }
  };

  const updateItem = async (id: number, itemData: Partial<ModuleItem>) => {
    try {
      await ModuleService.updateModuleApiV1ModuleModuleIdPut({ 
        moduleId: id, 
        requestBody: itemData 
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await ModuleService.deleteModuleApiV1ModuleModuleIdDelete({ moduleId: id });
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    isLoading,
    createItem,
    updateItem,
    deleteItem,
    fetchItems
  };
};
```

### 5. Create Main Page Component

Create `src/pages/[ModuleName].tsx`:

```typescript
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ModuleItem } from '@/modules/[module-name]/types';
import { useModule } from '@/modules/[module-name]/hooks/useModule';
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ModulePage: React.FC = () => {
  const { items, createItem, updateItem, deleteItem } = useModule();
  const [showDialog, setShowDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<ModuleItem | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", isCompleted: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: number) => {
    await deleteItem(id);
  };

  const openDialog = (item?: ModuleItem) => {
    setEditingItem(item || null);
    setFormData(item ? { 
      title: item.title || "", 
      description: item.description || "", 
      isCompleted: item.is_completed || false 
    } : { title: "", description: "", isCompleted: false });
    setShowDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    setIsLoading(true);
    try {
      const itemData = { 
        title: formData.title.trim(), 
        description: formData.description.trim() || undefined, 
        is_completed: formData.isCompleted 
      };
      if (editingItem) {
        await updateItem(editingItem.id!, itemData);
      } else {
        await createItem(itemData);
      }
      setShowDialog(false);
    } catch (error) {
      console.error(`Failed to ${editingItem ? 'update' : 'create'} item:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<ModuleItem>[] = [
    { 
      accessorKey: "id", 
      header: "ID", 
      cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div> 
    },
    { 
      accessorKey: "title", 
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Title <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ), 
      cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div> 
    },
    { 
      accessorKey: "description", 
      header: "Description", 
      cell: ({ row }) => (
        <div className="text-muted-foreground max-w-[200px] truncate">
          {row.getValue("description") || "—"}
        </div>
      ) 
    },
    { 
      accessorKey: "is_completed", 
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ), 
      cell: ({ row }) => <div>{row.getValue("is_completed") ? "Completed" : "Pending"}</div> 
    },
    {
      id: "actions", 
      enableHiding: false, 
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => openDialog(row.original)}>
              <Edit className="mr-2 h-4 w-4" />Edit Item
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDelete(row.original.id!)} 
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useReactTable({ 
    data: items, 
    columns, 
    getCoreRowModel: getCoreRowModel(), 
    getPaginationRowModel: getPaginationRowModel(), 
    getSortedRowModel: getSortedRowModel(), 
    getFilteredRowModel: getFilteredRowModel() 
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Module Management</h1>
            <p className="text-muted-foreground mt-2">Manage your module items efficiently</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">All Items</h2>
                <p className="text-sm text-muted-foreground">Manage your items with advanced filtering and sorting</p>
              </div>
              <Button size="sm" onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />Add Item
              </Button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <Input 
                placeholder="Filter items..." 
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
                        <p className="text-muted-foreground">No items found. Add one to get started!</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => table.previousPage()} 
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => table.nextPage()} 
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Update the item details below.' : 'Create a new item to add to your list.'} 
              Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                  placeholder="Enter item title..." 
                  required 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Add a description (optional)..." 
                  rows={3} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="completed" 
                  checked={formData.isCompleted} 
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCompleted: checked as boolean }))} 
                />
                <Label htmlFor="completed">Mark as completed</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDialog(false)} 
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? (editingItem ? "Updating..." : "Creating...") : (editingItem ? "Update Item" : "Create Item")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModulePage;
```

## 🔌 API Integration

### Service Pattern

Each module should have corresponding API services. The services are auto-generated from OpenAPI specification:

```typescript
// Example service usage
import { ModuleService } from '@/client';

// CRUD operations
const items = await ModuleService.listAllModuleApiV1ModuleGet();
const item = await ModuleService.createModuleApiV1ModulePost({ requestBody: data });
const updated = await ModuleService.updateModuleApiV1ModuleModuleIdPut({ moduleId: id, requestBody: data });
await ModuleService.deleteModuleApiV1ModuleModuleIdDelete({ moduleId: id });
```

### Error Handling

Implement proper error handling in your hooks:

```typescript
const handleApiError = (error: any, operation: string) => {
  console.error(`Failed to ${operation}:`, error);
  // Add toast notification or error state management
};
```

## 🧩 Component Structure

### Required Components

1. **Main Page Component**: Entry point with table and forms
2. **Custom Hooks**: Business logic and API calls
3. **Type Definitions**: TypeScript interfaces
4. **Optional Components**: Reusable sub-components

### Component Hierarchy

```
ModulePage (Main)
├── Table (Data Display)
├── Dialog (Create/Edit Form)
├── DropdownMenu (Actions)
└── Custom Hooks (Business Logic)
```

## 📊 State Management

### State Structure

```typescript
// Main state
const [items, setItems] = useState<ModuleItem[]>([]);
const [showDialog, setShowDialog] = useState(false);
const [editingItem, setEditingItem] = useState<ModuleItem | null>(null);
const [formData, setFormData] = useState({ title: "", description: "", isCompleted: false });
const [isLoading, setIsLoading] = useState(false);
```

### State Management Best Practices

1. **Local State**: Use React hooks for component-specific state
2. **Custom Hooks**: Extract business logic into reusable hooks
3. **Immutable Updates**: Always create new objects/arrays when updating state
4. **Loading States**: Provide visual feedback during API operations

## 📋 Data Table Implementation

### TanStack Table Setup

```typescript
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table";

const table = useReactTable({
  data: items,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
});
```

### Column Definitions

```typescript
const columns: ColumnDef<ModuleItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>
  },
  // ... more columns
];
```

## 📝 Form Handling

### Form State Management

```typescript
const [formData, setFormData] = useState({
  title: "",
  description: "",
  isCompleted: false
});

const handleInputChange = (field: string, value: any) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Form Validation

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData.title.trim()) return; // Basic validation
  
  setIsLoading(true);
  try {
    // API call
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);
  }
};
```

## ✅ Best Practices

### Code Organization

1. **Separation of Concerns**: Keep business logic in hooks, UI in components
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Reusability**: Create reusable components and hooks
4. **Consistency**: Follow established patterns and naming conventions

### Performance

1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Implement lazy loading for large datasets
3. **Optimistic Updates**: Update UI immediately, handle errors gracefully
4. **Debouncing**: Debounce search inputs for better performance

### User Experience

1. **Loading States**: Show loading indicators during API calls
2. **Error Handling**: Provide clear error messages
3. **Validation**: Implement client-side validation
4. **Accessibility**: Use proper ARIA labels and keyboard navigation

## 📖 Example: Todo Module Breakdown

The Todo module demonstrates all the patterns described above:

### Key Features Implemented

1. **CRUD Operations**: Create, Read, Update, Delete todos
2. **Data Table**: Sortable, filterable, paginated table
3. **Form Dialog**: Modal for creating/editing todos
4. **Action Menu**: Dropdown with edit/delete actions
5. **Loading States**: Visual feedback during operations
6. **Error Handling**: Console logging and user feedback

### State Management

```typescript
// Todo-specific state
const [todos, setTodos] = useState<TodoRead[]>([]);
const [showDialog, setShowDialog] = useState(false);
const [editingTodo, setEditingTodo] = useState<TodoRead | null>(null);
const [formData, setFormData] = useState({ title: "", description: "", isCompleted: false });
const [isLoading, setIsLoading] = useState(false);
```

### API Integration

```typescript
// Todo service calls
const fetchTodos = async () => setTodos(await TodoService.listAllTodoApiV1TodoGet());
const handleDelete = async (id: number) => {
  await TodoService.deleteTodoApiV1TodoTodoIdDelete({ todoId: id });
  setTodos(prev => prev.filter(t => t.id !== id));
};
```

## 🚀 Next Steps

1. **Customize**: Adapt the patterns to your specific module requirements
2. **Extend**: Add additional features like bulk operations, export functionality
3. **Optimize**: Implement performance optimizations for large datasets
4. **Test**: Add unit tests for your components and hooks
5. **Document**: Update this guide with your module-specific patterns

---

**This guide provides a complete foundation for developing new modules. Follow the patterns established in the Todo module for consistency and maintainability.**
