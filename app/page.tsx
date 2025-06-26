"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "./components/ui";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function SimpleTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("simple-tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("simple-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const createTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    toast.success("Task created!");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
    toast.success("Task updated!");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    toast.success("Task deleted!");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white font-geistSans">
            Simple Tasks
          </h1>
          <p className="text-[#FFFFFF80]">
            A basic task manager demonstrating CRUD operations
          </p>
        </div>

        {/* Add New Task */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold text-white">Add New Task</h2>
          <div className="flex gap-4">
            <Input
              placeholder="Enter task title..."
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
          </div>
        </Card>

        {/* Tasks List */}
        <Card className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">
              Tasks ({tasks.length})
            </h2>
            <div className="text-sm text-[#FFFFFF80]">
              {tasks.filter((t) => t.completed).length} completed
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12 text-[#FFFFFF80]">
              No tasks yet. Create your first task above!
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    task.completed
                      ? "bg-[#1a1a1a] border-green-500/30"
                      : "bg-[#1a1a1a] border-[#333]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        task.completed
                          ? "text-[#FFFFFF60] line-through"
                          : "text-white"
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="text-sm text-[#FFFFFF40]">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => deleteTask(task.id)}
                    className="px-3 py-1 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {tasks.length}
              </div>
              <div className="text-sm text-[#FFFFFF80]">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {tasks.filter((t) => t.completed).length}
              </div>
              <div className="text-sm text-[#FFFFFF80]">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-500">
                {tasks.filter((t) => !t.completed).length}
              </div>
              <div className="text-sm text-[#FFFFFF80]">Pending</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
