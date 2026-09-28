import React from "react";
import { SparklesIcon, SearchIcon, CheckCircleIcon, PlusIcon } from "./Icons";

export default function EmptyState({
  filter,
  searchQuery,
  onResetSearch,
  onAddQuickSample
}) {
  if (searchQuery) {
    return (
      <div className="empty-state-card glass-card">
        <div className="empty-state-icon-glow">
          <SearchIcon size={32} />
        </div>
        <h3 className="empty-state-title">No matching tasks found</h3>
        <p className="empty-state-desc">
          No tasks matched your search for "<strong>{searchQuery}</strong>". Try searching for a different keyword or category.
        </p>
        <button className="btn-secondary" onClick={onResetSearch}>
          Clear Search
        </button>
      </div>
    );
  }

  if (filter === "completed") {
    return (
      <div className="empty-state-card glass-card">
        <div className="empty-state-icon-glow icon-green">
          <CheckCircleIcon size={32} />
        </div>
        <h3 className="empty-state-title">No completed tasks yet</h3>
        <p className="empty-state-desc">
          Check off items from your active list to see them marked as done here!
        </p>
      </div>
    );
  }

  if (filter === "starred") {
    return (
      <div className="empty-state-card glass-card">
        <div className="empty-state-icon-glow icon-amber">
          <SparklesIcon size={32} />
        </div>
        <h3 className="empty-state-title">No starred tasks</h3>
        <p className="empty-state-desc">
          Click the star icon on any task to pin it as a high priority item.
        </p>
      </div>
    );
  }

  return (
    <div className="empty-state-card glass-card">
      <div className="empty-state-icon-glow icon-purple">
        <SparklesIcon size={36} />
      </div>
      <h3 className="empty-state-title">Your workspace is clear & ready</h3>
      <p className="empty-state-desc">
        Start by creating your first task above, or load sample starter tasks to explore features!
      </p>
      <button className="btn-primary" onClick={onAddQuickSample}>
        <PlusIcon size={16} />
        <span>Load Starter Tasks</span>
      </button>
    </div>
  );
}
