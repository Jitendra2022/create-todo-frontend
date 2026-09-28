import React from "react";
import { CheckCircleIcon, ClockIcon, FlameIcon, SparklesIcon } from "./Icons";

export default function StatsCards({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const highPriorityPending = tasks.filter(
    (t) => !t.completed && (t.priority === "high" || t.starred)
  ).length;

  let motivationalQuote = "Ready to start? Plan your day ahead!";
  if (total > 0) {
    if (percentage === 100) motivationalQuote = "All caught up! Outstanding work today! 🏆";
    else if (percentage >= 75) motivationalQuote = "In the home stretch! Finish strong! ⚡";
    else if (percentage >= 40) motivationalQuote = "Consistent progress! Keep moving forward! 🚀";
    else motivationalQuote = "A productive day begins with one completed task! 🔥";
  }

  return (
    <div className="stats-section">
      {/* Progress banner */}
      <div className="productivity-banner glass-card">
        <div className="banner-info">
          <div className="banner-badge">
            <SparklesIcon size={14} />
            <span>Productivity Pulse</span>
          </div>
          <h2 className="banner-headline">{motivationalQuote}</h2>
          <p className="banner-subtext">
            {completed} of {total} tasks completed ({percentage}%)
          </p>
        </div>
        <div className="banner-meter-wrapper">
          <div className="meter-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle-fill"
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage-text">
                {percentage}%
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card glass-card stat-total">
          <div className="stat-header">
            <span className="stat-title">Total Tasks</span>
            <div className="stat-icon-wrapper icon-blue">
              <SparklesIcon size={18} />
            </div>
          </div>
          <div className="stat-value">{total}</div>
          <div className="stat-sub">Tracked in your workspace</div>
        </div>

        <div className="stat-card glass-card stat-pending">
          <div className="stat-header">
            <span className="stat-title">In Progress</span>
            <div className="stat-icon-wrapper icon-amber">
              <ClockIcon size={18} />
            </div>
          </div>
          <div className="stat-value">{pending}</div>
          <div className="stat-sub">Active tasks requiring focus</div>
        </div>

        <div className="stat-card glass-card stat-completed">
          <div className="stat-header">
            <span className="stat-title">Completed</span>
            <div className="stat-icon-wrapper icon-emerald">
              <CheckCircleIcon size={18} />
            </div>
          </div>
          <div className="stat-value">{completed}</div>
          <div className="stat-sub">{percentage}% completion rate</div>
        </div>

        <div className="stat-card glass-card stat-high">
          <div className="stat-header">
            <span className="stat-title">High Priority</span>
            <div className="stat-icon-wrapper icon-rose">
              <FlameIcon size={18} />
            </div>
          </div>
          <div className="stat-value">{highPriorityPending}</div>
          <div className="stat-sub">Urgent & starred items</div>
        </div>
      </div>
    </div>
  );
}
