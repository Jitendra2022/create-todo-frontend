import React, { useState } from "react";
import { PlusIcon, FlameIcon, TagIcon, CalendarIcon, SparklesIcon } from "./Icons";

const CATEGORIES = ["General", "Work", "Personal", "Health", "Study", "Finance"];
const PRESETS = [
  { title: "Review product roadmap & deliverables", priority: "high", category: "Work" },
  { title: "30-min cardio workout & hydration", priority: "medium", category: "Health" },
  { title: "Respond to urgent client feedback", priority: "high", category: "Work" },
  { title: "Read 20 pages of tech book", priority: "low", category: "Study" }
];

export default function TaskInput({ onAddTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("Work");
  const [dueDate, setDueDate] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      priority,
      category,
      dueDate: dueDate || null
    });

    setTitle("");
    // keep default priority/category or reset
  };

  const handleApplyPreset = (preset) => {
    onAddTask({
      title: preset.title,
      priority: preset.priority,
      category: preset.category,
      dueDate: new Date().toISOString().split("T")[0]
    });
  };

  return (
    <div className="task-input-section glass-card">
      <form onSubmit={handleSubmit} className="task-input-form">
        <div className="input-main-row">
          <div className="input-field-wrapper">
            <span className="input-prefix-icon">
              <SparklesIcon size={18} />
            </span>
            <input
              type="text"
              className="task-main-input"
              placeholder="What needs to get done today? (Type task and press Enter)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
            />
          </div>
          <button
            type="submit"
            className="btn-add-task"
            disabled={!title.trim()}
          >
            <PlusIcon size={18} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Options Row (Priority, Category, Due Date, Presets) */}
        <div className={`input-options-drawer ${isExpanded || title ? "expanded" : ""}`}>
          <div className="options-left">
            {/* Priority Selector */}
            <div className="option-group">
              <label className="option-label">
                <FlameIcon size={14} /> Priority:
              </label>
              <div className="priority-pill-selector">
                <button
                  type="button"
                  className={`pill-btn pill-low ${priority === "low" ? "selected" : ""}`}
                  onClick={() => setPriority("low")}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`pill-btn pill-medium ${priority === "medium" ? "selected" : ""}`}
                  onClick={() => setPriority("medium")}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`pill-btn pill-high ${priority === "high" ? "selected" : ""}`}
                  onClick={() => setPriority("high")}
                >
                  High
                </button>
              </div>
            </div>

            {/* Category Selector */}
            <div className="option-group">
              <label className="option-label">
                <TagIcon size={14} /> Category:
              </label>
              <select
                className="select-custom"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div className="option-group">
              <label className="option-label">
                <CalendarIcon size={14} /> Due:
              </label>
              <input
                type="date"
                className="date-input-custom"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Quick presets pills */}
          <div className="quick-presets">
            <span className="presets-label">Quick Suggestions:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip"
                onClick={() => handleApplyPreset(p)}
                title={`Add: ${p.title}`}
              >
                + {p.title.slice(0, 24)}...
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
