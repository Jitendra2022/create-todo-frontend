import React, { useState } from "react";
import {
  CheckIcon,
  TrashIcon,
  EditIcon,
  StarIcon,
  FlameIcon,
  CalendarIcon,
  TagIcon
} from "./Icons";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onUpdateTitle,
  onToggleStar
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = () => {
    if (editTitle.trim() && editTitle.trim() !== task.title) {
      onUpdateTitle(task._id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  // Due date format
  const formatDue = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) return { label: "Due Today", isUrgent: true };
    if (dateStr < today) return { label: `Overdue (${dateStr})`, isOverdue: true };
    return { label: `Due: ${dateStr}`, isUrgent: false };
  };

  const dueInfo = formatDue(task.dueDate);

  return (
    <div
      className={`task-item-card glass-card ${task.completed ? "task-completed" : ""} ${
        task.starred ? "task-starred" : ""
      } priority-${task.priority || "medium"}`}
    >
      {/* Checkbox */}
      <button
        type="button"
        className={`custom-checkbox ${task.completed ? "checked" : ""}`}
        onClick={() => onToggle(task)}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        title={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        <CheckIcon size={14} className="check-svg" />
      </button>

      {/* Main content */}
      <div className="task-content-area">
        {isEditing ? (
          <div className="inline-edit-wrapper">
            <input
              type="text"
              className="inline-edit-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              autoFocus
            />
            <div className="edit-hints">Press Enter to save, Esc to cancel</div>
          </div>
        ) : (
          <div
            className={`task-title-text ${task.completed ? "text-done" : ""}`}
            onDoubleClick={() => !task.completed && setIsEditing(true)}
            title="Double-click to edit"
          >
            {task.title}
          </div>
        )}

        {/* Task Metadata Chips */}
        <div className="task-meta-bar">
          {/* Priority Badge */}
          <span className={`priority-badge badge-${task.priority || "medium"}`}>
            {task.priority === "high" && <FlameIcon size={12} />}
            {task.priority ? task.priority.toUpperCase() : "MEDIUM"}
          </span>

          {/* Category Chip */}
          {task.category && (
            <span className="task-category-chip">
              <TagIcon size={12} />
              {task.category}
            </span>
          )}

          {/* Due date badge */}
          {dueInfo && (
            <span
              className={`task-due-chip ${dueInfo.isOverdue ? "due-overdue" : ""} ${
                dueInfo.isUrgent ? "due-today" : ""
              }`}
            >
              <CalendarIcon size={12} />
              {dueInfo.label}
            </span>
          )}

          {/* Timestamp or created indicator */}
          {task.createdAt && (
            <span className="task-time-chip">
              {new Date(task.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric"
              })}
            </span>
          )}
        </div>
      </div>

      {/* Action Controls */}
      <div className="task-actions">
        {/* Star Button */}
        <button
          type="button"
          className={`action-btn btn-star ${task.starred ? "starred" : ""}`}
          onClick={() => onToggleStar(task)}
          title={task.starred ? "Unstar" : "Star as important"}
          aria-label="Star task"
        >
          <StarIcon size={16} filled={task.starred} />
        </button>

        {/* Edit Button */}
        {!task.completed && (
          <button
            type="button"
            className="action-btn btn-edit"
            onClick={() => setIsEditing(!isEditing)}
            title="Edit task"
            aria-label="Edit task"
          >
            <EditIcon size={16} />
          </button>
        )}

        {/* Delete Button */}
        <button
          type="button"
          className="action-btn btn-delete"
          onClick={() => onDelete(task._id)}
          title="Delete task"
          aria-label="Delete task"
        >
          <TrashIcon size={16} />
        </button>
      </div>
    </div>
  );
}
