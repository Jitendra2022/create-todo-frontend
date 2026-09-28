import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import api from "../api";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import TaskInput from "../components/TaskInput";
import TaskFilters from "../components/TaskFilters";
import TaskItem from "../components/TaskItem";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";

// Initial sample tasks for offline / demo mode
const INITIAL_DEMO_TASKS = [
  {
    _id: "demo-task-1",
    title: "Design high-fidelity dashboard wireframes & UI system",
    completed: false,
    priority: "high",
    category: "Work",
    starred: true,
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    _id: "demo-task-2",
    title: "Refactor MongoDB schemas and API route authentication",
    completed: true,
    priority: "high",
    category: "Work",
    starred: false,
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: "demo-task-3",
    title: "Morning 5km run & hydration session",
    completed: true,
    priority: "medium",
    category: "Health",
    starred: true,
    dueDate: new Date().toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: "demo-task-4",
    title: "Read Chapter 4 of System Design Interview book",
    completed: false,
    priority: "low",
    category: "Study",
    starred: false,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    _id: "demo-task-5",
    title: "Review monthly subscriptions and export expense report",
    completed: false,
    priority: "medium",
    category: "Finance",
    starred: false,
    dueDate: null,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [isDemoMode, setIsDemoMode] = useState(
    () => localStorage.getItem("isDemoMode") === "true" || !localStorage.getItem("token")
  );

  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user") ||
      JSON.stringify({ name: "Alex Morgan", email: "alex.morgan@taskpulse.io" })
  );

  // Synchronize theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toast Helper
  const showToast = (message, type = "success", title = "") => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isDemoMode");
    navigate("/login");
  };

  const toggleDemoMode = () => {
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    localStorage.setItem("isDemoMode", nextMode ? "true" : "false");
    showToast(
      nextMode
        ? "Switched to Offline Demo Mode (local state)"
        : "Switched to Live API Mode (connecting to backend)",
      "info",
      "Mode Changed"
    );
  };

  // Trigger celebration confetti
  const triggerConfetti = (intense = false) => {
    try {
      if (intense) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } else {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch {
      // fallback if canvas not available
    }
  };

  // Load Tasks
  const loadTasks = async () => {
    if (isDemoMode) {
      const stored = localStorage.getItem("demo_tasks");
      if (stored) {
        try {
          setTasks(JSON.parse(stored));
        } catch {
          setTasks(INITIAL_DEMO_TASKS);
        }
      } else {
        setTasks(INITIAL_DEMO_TASKS);
        localStorage.setItem("demo_tasks", JSON.stringify(INITIAL_DEMO_TASKS));
      }
      return;
    }

    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      // If network fails or unauthorized, offer seamless demo mode
      console.warn("API request failed, falling back to Demo Mode:", err);
      setIsDemoMode(true);
      localStorage.setItem("isDemoMode", "true");
      const stored = localStorage.getItem("demo_tasks");
      const fallbackTasks = stored ? JSON.parse(stored) : INITIAL_DEMO_TASKS;
      setTasks(fallbackTasks);
      showToast(
        "Live backend unreachable. Seamlessly active in Demo Mode!",
        "info",
        "Offline Preview"
      );
    }
  };

  useEffect(() => {
    loadTasks();
  }, [isDemoMode]);

  // Persist demo tasks to localStorage when in demo mode
  const syncDemoTasks = (newTasks) => {
    setTasks(newTasks);
    if (isDemoMode) {
      localStorage.setItem("demo_tasks", JSON.stringify(newTasks));
    }
  };

  // Add Task
  const handleAddTask = async (taskData) => {
    if (isDemoMode) {
      const newTask = {
        _id: "demo-" + Date.now(),
        title: taskData.title,
        completed: false,
        priority: taskData.priority || "medium",
        category: taskData.category || "General",
        starred: false,
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString()
      };
      syncDemoTasks([newTask, ...tasks]);
      showToast(`Task "${taskData.title.slice(0, 24)}..." created!`, "success", "Task Added");
      return;
    }

    try {
      const { data } = await api.post("/tasks", {
        title: taskData.title,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate
      });
      setTasks([data, ...tasks]);
      showToast(`Task created!`, "success", "Added");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add task", "error", "Error");
    }
  };

  // Toggle Completion
  const handleToggle = async (t) => {
    const nextCompleted = !t.completed;

    if (isDemoMode) {
      const updated = tasks.map((x) =>
        x._id === t._id ? { ...x, completed: nextCompleted } : x
      );
      syncDemoTasks(updated);

      if (nextCompleted) {
        triggerConfetti(false);
        showToast("Task completed! Keep up the momentum! 🎉", "success");
      }
      return;
    }

    try {
      const { data } = await api.put(`/tasks/${t._id}`, { completed: nextCompleted });
      const updated = tasks.map((x) => (x._id === t._id ? { ...x, ...data, completed: nextCompleted } : x));
      setTasks(updated);

      if (nextCompleted) {
        triggerConfetti(false);
        showToast("Task marked complete! 🎉", "success");
      }
    } catch (err) {
      showToast("Failed to update status", "error");
    }
  };

  // Toggle Star / Importance
  const handleToggleStar = (t) => {
    const updated = tasks.map((x) =>
      x._id === t._id ? { ...x, starred: !x.starred } : x
    );
    syncDemoTasks(updated);
    showToast(t.starred ? "Removed from starred" : "Task starred as important! ⭐", "info");
  };

  // Update Task Title (inline edit)
  const handleUpdateTitle = async (id, newTitle) => {
    if (isDemoMode) {
      const updated = tasks.map((x) => (x._id === id ? { ...x, title: newTitle } : x));
      syncDemoTasks(updated);
      showToast("Task updated successfully", "success");
      return;
    }

    try {
      const { data } = await api.put(`/tasks/${id}`, { title: newTitle });
      setTasks(tasks.map((x) => (x._id === id ? { ...x, ...data, title: newTitle } : x)));
      showToast("Task title updated", "success");
    } catch (err) {
      showToast("Failed to update task", "error");
    }
  };

  // Delete Task
  const handleDelete = async (id) => {
    if (isDemoMode) {
      const updated = tasks.filter((x) => x._id !== id);
      syncDemoTasks(updated);
      showToast("Task deleted", "info");
      return;
    }

    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((x) => x._id !== id));
      showToast("Task deleted", "info");
    } catch (err) {
      showToast("Failed to delete task", "error");
    }
  };

  // Clear Completed
  const handleClearCompleted = () => {
    const remaining = tasks.filter((t) => !t.completed);
    syncDemoTasks(remaining);
    showToast("All completed tasks cleared", "info");
  };

  // Filter & Search Logic
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.category && t.category.toLowerCase().includes(query)) ||
          (t.priority && t.priority.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (activeFilter === "pending") {
      result = result.filter((t) => !t.completed);
    } else if (activeFilter === "completed") {
      result = result.filter((t) => t.completed);
    } else if (activeFilter === "starred") {
      result = result.filter((t) => t.starred);
    }

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    // Sorting
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => {
      if (sortBy === "priority") {
        const weightA = priorityWeight[a.priority] || 2;
        const weightB = priorityWeight[b.priority] || 2;
        return weightB - weightA;
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortBy === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      // default: newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  }, [tasks, searchQuery, activeFilter, activeCategory, sortBy]);

  // Unique categories in tasks
  const availableCategories = useMemo(() => {
    const set = new Set(["Work", "Personal", "Health", "Study", "Finance"]);
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [tasks]);

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    starred: tasks.filter((t) => t.starred).length
  };

  const hasCompletedTasks = taskCounts.completed > 0;

  return (
    <div className="app-layout" data-theme={theme}>
      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Floating ambient glow effects */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={logout}
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDemoMode={isDemoMode}
        onToggleDemoMode={toggleDemoMode}
      />

      {/* Main Content Dashboard */}
      <main className="main-content-container">
        {/* Productivity Analytics & KPI Cards */}
        <StatsCards tasks={tasks} />

        {/* Task Creation Bar */}
        <TaskInput onAddTask={handleAddTask} />

        {/* Filter Controls & Search Status */}
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={availableCategories}
          sortBy={sortBy}
          onSortChange={setSortBy}
          taskCounts={taskCounts}
          onClearCompleted={handleClearCompleted}
          hasCompletedTasks={hasCompletedTasks}
        />

        {/* Task List Header with Count */}
        <div className="task-list-header">
          <div className="task-list-title-group">
            <h3 className="section-title">
              {activeFilter === "all" && "All Tasks"}
              {activeFilter === "pending" && "Active Tasks"}
              {activeFilter === "completed" && "Completed Tasks"}
              {activeFilter === "starred" && "Starred & Important"}
            </h3>
            <span className="results-count-pill">
              Showing {filteredAndSortedTasks.length} of {tasks.length}
            </span>
          </div>

          {searchQuery && (
            <button
              className="btn-clear-search-pill"
              onClick={() => setSearchQuery("")}
            >
              Filtering by: "{searchQuery}" ✕
            </button>
          )}
        </div>

        {/* Task Items List */}
        <div className="tasks-cards-list">
          {filteredAndSortedTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdateTitle={handleUpdateTitle}
              onToggleStar={handleToggleStar}
            />
          ))}

          {/* Empty State */}
          {filteredAndSortedTasks.length === 0 && (
            <EmptyState
              filter={activeFilter}
              searchQuery={searchQuery}
              onResetSearch={() => setSearchQuery("")}
              onAddQuickSample={() => {
                syncDemoTasks(INITIAL_DEMO_TASKS);
                showToast("Sample starter tasks loaded!", "success");
              }}
            />
          )}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span>TaskPulse Studio</span>
            <span className="footer-dot">•</span>
            <span>MERN Stack Modern Architecture</span>
          </div>
          <div className="footer-right">
            <span>Keyboard shortcuts: <kbd>/</kbd> to search, <kbd>Enter</kbd> to add</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
