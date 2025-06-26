"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "./components/ui";
import { toast } from "sonner";

interface Task {
  _id?: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function SimpleTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Load tasks from API
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tasks");
      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
        toast.success(`${result.count} tasks loaded from NotDatabase!`);
      } else {
        toast.error(result.error || "Failed to load tasks");
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          completed: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTasks([...tasks, result.data]);
        setNewTaskTitle("");
        toast.success("Task created successfully!");
      } else {
        toast.error(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task");
    }
  };

  // Create multiple sample tasks
  const createSampleTasks = async () => {
    try {
      const sampleTasks = [
        { title: "Learn NotDatabase", completed: false },
        { title: "Build awesome app", completed: false },
        { title: "Deploy to production", completed: false },
      ];

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sampleTasks),
      });

      const result = await response.json();

      if (result.success) {
        loadTasks(); // Reload all tasks
        toast.success(`${sampleTasks.length} sample tasks created!`);
      } else {
        toast.error(result.error || "Failed to create sample tasks");
      }
    } catch (error) {
      console.error("Error creating sample tasks:", error);
      toast.error("Failed to create sample tasks");
    }
  };

  // Toggle task completion
  const toggleTask = async (task: Task) => {
    if (!task._id) return;

    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTasks(
          tasks.map((t) =>
            t._id === task._id ? { ...t, completed: !t.completed } : t
          )
        );
        toast.success("Task updated!");
      } else {
        toast.error(result.error || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setTasks(tasks.filter((t) => t._id !== taskId));
        toast.success("Task deleted!");
      } else {
        toast.error(result.error || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🚀 NotDatabase Tasks
          </h1>
          <p className="text-[#FFFFFF80] text-lg">
            Simple CRUD app powered by NotDatabase API
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-white">{tasks.length}</div>
            <div className="text-[#FFFFFF80]">Total</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {completedCount}
            </div>
            <div className="text-[#FFFFFF80]">Completed</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {pendingCount}
            </div>
            <div className="text-[#FFFFFF80]">Pending</div>
          </Card>
        </div>

        {/* Add Task Form */}
        <Card className="mb-8">
          <div className="flex gap-4">
            <Input
              placeholder="Enter a new task..."
              value={newTaskTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewTaskTitle(e.target.value)
              }
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                e.key === "Enter" && createTask()
              }
              className="flex-1"
            />
            <Button variant="primary" onClick={createTask}>
              Add Task
            </Button>
            <Button variant="secondary" onClick={createSampleTasks}>
              Add Samples
            </Button>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <Card className="text-center text-[#FFFFFF80]">
            Loading tasks from NotDatabase...
          </Card>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task._id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                  className="w-5 h-5 rounded border-2 border-[#333] bg-transparent checked:bg-blue-500"
                />
                <span
                  className={`${
                    task.completed
                      ? "line-through text-[#FFFFFF60]"
                      : "text-white"
                  }`}
                >
                  {task.title}
                </span>
                {task.createdAt && (
                  <span className="text-xs text-[#FFFFFF40]">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              <Button
                variant="secondary"
                onClick={() => task._id && deleteTask(task._id)}
                className="px-3 py-1 text-sm hover:bg-red-600"
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!loading && tasks.length === 0 && (
          <Card className="text-center text-[#FFFFFF80] py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl text-white mb-2">No tasks yet!</h3>
            <p>Add your first task or create some samples to get started.</p>
          </Card>
        )}

        {/* API Info */}
        <Card className="mt-8 text-center">
          <h3 className="text-white mb-2">
            🔥 NotDatabase CRUD Operations Tested:
          </h3>
          <div className="text-[#FFFFFF80] text-sm">
            ✅ INSERT (single & bulk) • ✅ FIND • ✅ UPDATE • ✅ DELETE • ✅
            COUNT
          </div>
        </Card>
      </div>
    </div>
  );
}
