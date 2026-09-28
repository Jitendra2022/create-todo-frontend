import React from "react";
import {
  SunIcon,
  MoonIcon,
  LogOutIcon,
  SearchIcon,
  CloseIcon,
  SparklesIcon,
  UserIcon
} from "./Icons";

export default function Navbar({
  user,
  onLogout,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  isDemoMode,
  onToggleDemoMode
}) {
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-logo-glow">
            <div className="brand-icon">
              <SparklesIcon size={20} className="brand-sparkle" />
            </div>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              Task<span className="brand-gradient">Pulse</span>
            </div>
            <div className="brand-tagline">
              Productivity Studio
              {isDemoMode ? (
                <span className="badge-demo" title="Running in instant offline preview mode">Demo Mode</span>
              ) : (
                <span className="badge-live" title="Connected to MERN API">Live API</span>
              )}
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="navbar-search">
          <SearchIcon size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks, categories, or tags... (Press / to search)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            id="global-task-search"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Demo toggle switch button */}
          <button
            className={`demo-toggle-btn ${isDemoMode ? "active" : ""}`}
            onClick={onToggleDemoMode}
            title={isDemoMode ? "Click to use live backend" : "Click to use offline demo mode"}
          >
            <span className="demo-toggle-dot"></span>
            <span className="demo-toggle-text">{isDemoMode ? "Demo Mode" : "API Connected"}</span>
          </button>

          {/* Theme switch */}
          <button
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
          </button>

          {/* User Profile Chip */}
          <div className="user-profile-chip" title={user.email || user.name}>
            <div className="user-avatar">
              {getInitials(user.name)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name || "Productive User"}</span>
              <span className="user-status">Online</span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            className="btn-logout"
            onClick={onLogout}
            title="Sign out of your account"
          >
            <LogOutIcon size={16} />
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
