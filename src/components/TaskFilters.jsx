import React from "react";
import { FilterIcon, StarIcon, CheckCircleIcon, ClockIcon, TrashIcon } from "./Icons";

export default function TaskFilters({
  activeFilter,
  onFilterChange,
  activeCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortChange,
  taskCounts,
  onClearCompleted,
  hasCompletedTasks
}) {
  return (
    <div className="filters-container glass-card">
      <div className="filters-top-row">
        {/* Status segmented controls */}
        <div className="filter-segmented-control">
          <button
            className={`filter-segment-btn ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => onFilterChange("all")}
          >
            <span>All</span>
            <span className="filter-badge">{taskCounts.all}</span>
          </button>

          <button
            className={`filter-segment-btn ${activeFilter === "pending" ? "active" : ""}`}
            onClick={() => onFilterChange("pending")}
          >
            <ClockIcon size={14} />
            <span>Active</span>
            <span className="filter-badge badge-pending">{taskCounts.pending}</span>
          </button>

          <button
            className={`filter-segment-btn ${activeFilter === "completed" ? "active" : ""}`}
            onClick={() => onFilterChange("completed")}
          >
            <CheckCircleIcon size={14} />
            <span>Completed</span>
            <span className="filter-badge badge-completed">{taskCounts.completed}</span>
          </button>

          <button
            className={`filter-segment-btn ${activeFilter === "starred" ? "active" : ""}`}
            onClick={() => onFilterChange("starred")}
          >
            <StarIcon size={14} filled={activeFilter === "starred"} />
            <span>Important</span>
            <span className="filter-badge badge-starred">{taskCounts.starred}</span>
          </button>
        </div>

        {/* Action button */}
        {hasCompletedTasks && (
          <button
            className="btn-clear-completed"
            onClick={onClearCompleted}
            title="Clean up all finished tasks"
          >
            <TrashIcon size={14} />
            <span>Clear Completed</span>
          </button>
        )}
      </div>

      <div className="filters-bottom-row">
        {/* Category Pills */}
        <div className="category-chips-list">
          <span className="filter-label">Category:</span>
          <button
            className={`category-chip ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => onCategoryChange("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${activeCategory === cat ? "active" : ""}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="sort-group">
          <label className="sort-label">Sort by:</label>
          <select
            className="select-sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
