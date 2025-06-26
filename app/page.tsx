"use client";

import { useState, useEffect } from "react";
import { Button, Input, Card } from "./components/ui";
import { toast } from "sonner";
import {
  Rocket,
  BarChart3,
  CheckCircle2,
  Clock,
  Plus,
  Target,
  Loader2,
  Check,
  Trash2,
  FileText,
  Database,
  Search,
  Edit3,
  Calendar,
  Hash,
} from "lucide-react";

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
  const [creatingTask, setCreatingTask] = useState(false);
  const [creatingSamples, setCreatingSamples] = useState(false);
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set());

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
    if (!newTaskTitle.trim() || creatingTask) return;

    try {
      setCreatingTask(true);
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
    } finally {
      setCreatingTask(false);
    }
  };

  // Create multiple sample tasks
  const createSampleTasks = async () => {
    if (creatingSamples) return;

    try {
      setCreatingSamples(true);
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
    } finally {
      setCreatingSamples(false);
    }
  };

  // Toggle task completion
  const toggleTask = async (task: Task) => {
    if (!task._id || updatingTasks.has(task._id)) return;

    try {
      setUpdatingTasks((prev) => new Set(prev).add(task._id!));
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
    } finally {
      setUpdatingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(task._id!);
        return newSet;
      });
    }
  };

  // Delete a task
  const deleteTask = async (taskId: string) => {
    if (deletingTasks.has(taskId)) return;

    try {
      setDeletingTasks((prev) => new Set(prev).add(taskId));
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
    } finally {
      setDeletingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Modern Header */}
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                NotDatabase
              </h1>
            </div>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed px-4">
              Modern task management powered by{" "}
              <span className="font-semibold text-purple-300">
                TypeScript-first
              </span>{" "}
              schema database
            </p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-full border border-slate-700">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Connected to NotDB</span>
            </div>
          </div>

          {/* Modern Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 lg:p-8 text-center hover:border-slate-600/50 transition-all duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {tasks.length}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
                  Total Tasks
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 lg:p-8 text-center hover:border-slate-600/50 transition-all duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">
                  {completedCount}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
                  Completed
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </div>

            <div className="group relative sm:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 lg:p-8 text-center hover:border-slate-600/50 transition-all duration-300">
                <div className="text-3xl lg:text-4xl font-bold text-amber-400 mb-2">
                  {pendingCount}
                </div>
                <div className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider">
                  Pending
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Modern Task Creation Form */}
          <div className="group relative mb-8 lg:mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 lg:p-8 hover:border-slate-600/50 transition-all duration-300">
              <div className="flex flex-col gap-4 lg:flex-row">
                <div className="flex-1 relative">
                  <Input
                    placeholder="What needs to be done?"
                    value={newTaskTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewTaskTitle(e.target.value)
                    }
                    onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) =>
                      e.key === "Enter" && createTask()
                    }
                    disabled={creatingTask}
                    className="w-full bg-slate-900/50 border-slate-600/50 rounded-xl px-4 lg:px-6 py-3 lg:py-4 text-white placeholder-slate-400 focus:border-purple-500/50 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="primary"
                    onClick={createTask}
                    disabled={creatingTask || !newTaskTitle.trim()}
                    className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
                  >
                    {creatingTask ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    {creatingTask ? "Creating..." : "Add Task"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={createSampleTasks}
                    disabled={creatingSamples}
                    className="px-4 lg:px-6 py-3 lg:py-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {creatingSamples ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4" />
                    )}
                    {creatingSamples ? "Creating..." : "Samples"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 lg:p-8 text-center">
                <div className="inline-flex items-center gap-3">
                  <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                  <span className="text-slate-300">
                    Loading tasks from NotDatabase...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Modern Tasks List */}
          <div className="space-y-3 lg:space-y-4">
            {tasks.map((task, index) => (
              <div
                key={task._id}
                className="group relative"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-slate-400/5 rounded-2xl blur-sm group-hover:from-purple-500/10 group-hover:to-cyan-500/10 transition-all duration-300"></div>
                <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-4 lg:p-6 hover:border-slate-600/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 lg:gap-6 flex-1 min-w-0">
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTask(task)}
                          disabled={updatingTasks.has(task._id!)}
                          className="w-5 h-5 lg:w-6 lg:h-6 rounded-lg border-2 border-slate-600 bg-slate-800 checked:bg-gradient-to-r checked:from-purple-500 checked:to-cyan-500 checked:border-transparent transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {updatingTasks.has(task._id!) ? (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 text-purple-400 animate-spin" />
                          </div>
                        ) : (
                          task.completed && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                            </div>
                          )
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-base lg:text-lg font-medium transition-all duration-300 block truncate ${
                            task.completed
                              ? "line-through text-slate-500"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </span>
                        {task.createdAt && (
                          <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 lg:gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span className="text-xs text-slate-500">
                                {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {task._id && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3 text-slate-600 flex-shrink-0" />
                                <span className="text-xs text-slate-600 font-mono">
                                  {task._id.slice(-8)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => task._id && deleteTask(task._id)}
                      disabled={deletingTasks.has(task._id!)}
                      className="px-3 lg:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 group/delete flex-shrink-0 disabled:opacity-50"
                    >
                      {deletingTasks.has(task._id!) ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 group-hover/delete:animate-pulse" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Empty State */}
          {!loading && tasks.length === 0 && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-slate-400/5 rounded-3xl blur-xl"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-3xl p-12 lg:p-16 text-center">
                <div className="w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-6 lg:mb-8 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 lg:w-12 lg:h-12 text-slate-400" />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4">
                  Ready to get started?
                </h3>
                <p className="text-slate-400 text-base lg:text-lg max-w-md mx-auto px-4">
                  Add your first task or create some samples to experience the
                  power of NotDatabase.
                </p>
              </div>
            </div>
          )}

          {/* Modern API Info Footer */}
          <div className="mt-12 lg:mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-2xl blur-xl"></div>
            <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-6 lg:p-8 text-center">
              <h3 className="text-sm lg:text-xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                <Database className="w-5 h-5" />
                NotDatabase CRUD Operations
              </h3>
              <div className="flex flex-wrap justify-center gap-2 lg:gap-3 text-sm">
                {[
                  { op: "INSERT", icon: Plus, color: "text-green-400" },
                  { op: "FIND", icon: Search, color: "text-blue-400" },
                  { op: "UPDATE", icon: Edit3, color: "text-amber-400" },
                  { op: "DELETE", icon: Trash2, color: "text-red-400" },
                  { op: "COUNT", icon: BarChart3, color: "text-purple-400" },
                ].map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.op}
                      className={`inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-slate-700/30 rounded-lg ${item.color}`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium text-xs lg:text-sm">
                        {item.op}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
