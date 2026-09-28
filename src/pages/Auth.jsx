import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import {
  SparklesIcon,
  MailIcon,
  LockIcon,
  UserIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SunIcon,
  MoonIcon
} from "../components/Icons";

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.removeItem("isDemoMode");
      navigate("/");
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        (err.code === "ERR_NETWORK"
          ? "Backend server is unreachable. You can click 'Instant Demo Mode' below to test the UI immediately!"
          : "Something went wrong. Please check your credentials.");
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Demo Login Handler for instant frictionless preview
  const handleDemoLogin = () => {
    const demoUser = {
      _id: "demo-user-1",
      name: "Alex Morgan",
      email: "alex.morgan@taskpulse.io"
    };
    localStorage.setItem("token", "demo-token-12345");
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("isDemoMode", "true");
    navigate("/");
  };

  return (
    <div className="auth-page-wrapper" data-theme={theme}>
      {/* Background ambient glowing orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>

      {/* Top bar with theme toggle */}
      <div className="auth-top-bar">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title="Toggle light/dark theme"
        >
          {theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>

      <div className="auth-container">
        {/* Left Side: Brand & Feature Showcase */}
        <div className="auth-hero-panel">
          <div className="hero-brand">
            <div className="brand-logo-glow">
              <div className="brand-icon">
                <SparklesIcon size={24} />
              </div>
            </div>
            <span className="hero-brand-name">
              Task<span className="brand-gradient">Pulse</span>
            </span>
          </div>

          <h1 className="hero-heading">
            Design your day with clarity and effortless focus.
          </h1>
          <p className="hero-subtext">
            Experience next-generation task management with real-time analytics, intuitive priority grouping, and seamless cloud sync.
          </p>

          <div className="hero-features-list">
            <div className="hero-feature-item">
              <div className="feature-icon-bubble">
                <CheckCircleIcon size={16} />
              </div>
              <div>
                <strong>Smart Prioritization</strong>
                <p>Categorize with High, Medium, and Low urgency badges.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-bubble">
                <SparklesIcon size={16} />
              </div>
              <div>
                <strong>Productivity Pulse & Streaks</strong>
                <p>Track your daily completion percentage with interactive meters.</p>
              </div>
            </div>

            <div className="hero-feature-item">
              <div className="feature-icon-bubble">
                <CheckCircleIcon size={16} />
              </div>
              <div>
                <strong>Fluid Dark & Light Modes</strong>
                <p>Custom tailored glassmorphism built for maximum visual comfort.</p>
              </div>
            </div>
          </div>

          <div className="hero-footer-badge">
            <span className="pulsing-dot"></span>
            <span>Used by high-performing teams & creators worldwide</span>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="auth-card-panel glass-card">
          {/* Tabs for Login / Register */}
          <div className="auth-tabs">
            <Link
              to="/login"
              className={`auth-tab ${isLogin ? "active" : ""}`}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className={`auth-tab ${!isLogin ? "active" : ""}`}
            >
              Create Account
            </Link>
          </div>

          <div className="auth-card-header">
            <h2 className="auth-title">
              {isLogin ? "Welcome back" : "Get started with TaskPulse"}
            </h2>
            <p className="auth-subtitle">
              {isLogin
                ? "Enter your credentials to access your dashboard"
                : "Create your free account in under 30 seconds"}
            </p>
          </div>

          {error && (
            <div className="auth-error-banner">
              <span className="error-dot">!</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <UserIcon size={18} className="field-icon" />
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Sarah Connor"
                    value={form.name}
                    onChange={change}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="form-input-wrapper">
                <MailIcon size={18} className="field-icon" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={change}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrapper">
                <LockIcon size={18} className="field-icon" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={change}
                  required
                  minLength={6}
                  className="form-input"
                />
                <button
                  type="button"
                  className="btn-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-spinner"></span>
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Workspace" : "Create My Account"}</span>
                  <ArrowRightIcon size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Mode Access Button */}
          <div className="demo-divider">
            <span>OR TRY INSTANTLY</span>
          </div>

          <button
            type="button"
            className="btn-demo-mode"
            onClick={handleDemoLogin}
          >
            <SparklesIcon size={16} />
            <span>Launch Guest Demo Mode (No Setup Required)</span>
          </button>

          <div className="auth-footer-prompt">
            {isLogin ? (
              <p>
                Don't have an account yet?{" "}
                <Link to="/register" className="auth-link">
                  Create one now
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/login" className="auth-link">
                  Sign in
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
