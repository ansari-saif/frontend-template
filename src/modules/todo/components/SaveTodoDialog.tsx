import React, { useState, useEffect } from "react"
import { TodoService } from "@/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Plus, Edit } from "lucide-react"
import { SaveTodoDialogProps } from "@/types/TodoModule"

const SaveTodoDialog: React.FC<SaveTodoDialogProps> = ({ 
  onSave, 
  todo = null, 
  trigger, 
  mode = 'add',
  open: externalOpen,
  onOpenChange: externalOnOpenChange
}) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [internalOpen, setInternalOpen] = useState(false)

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = externalOnOpenChange || setInternalOpen

  const isEditMode = mode === 'edit' && todo

  // Reset form when dialog opens/closes or todo changes
  useEffect(() => {
    if (open && isEditMode) {
      setTitle(todo.title || "")
      setDescription(todo.description || "")
      setIsCompleted(todo.is_completed || false)
    } else if (open && !isEditMode) {
      setTitle("")
      setDescription("")
      setIsCompleted(false)
    }
  }, [open, todo, isEditMode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    try {
      if (isEditMode) {
        // Update existing todo
        await TodoService.updateTodoApiV1TodoTodoIdPut({
          todoId: todo.id!,
          requestBody: { 
            title: title.trim(),
            description: description.trim() || undefined,
            is_completed: isCompleted
          } 
        })
      } else {
        // Create new todo
        await TodoService.createTodoApiV1TodoPost({ 
          requestBody: { 
            title: title.trim(),
            description: description.trim() || undefined,
            is_completed: isCompleted
          } 
        })
      }
      
      setTitle("")
      setDescription("")
      setIsCompleted(false)
      setOpen(false)
      onSave()
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} todo:`, error)
    } finally {
      setIsLoading(false)
    }
  }

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
          <DialogTitle>
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Update the task details below.' 
              : 'Create a new task to add to your todo list.'
            } Click save when you're done.
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update Task" : "Create Task")
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default SaveTodoDialog 