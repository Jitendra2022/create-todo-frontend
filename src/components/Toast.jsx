import React from "react";
import { CheckCircleIcon, AlertCircleIcon, CloseIcon, SparklesIcon } from "./Icons";

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";
        return (
          <div key={toast.id} className={`toast-item toast-${toast.type || "info"}`}>
            <div className="toast-icon">
              {isSuccess && <CheckCircleIcon size={18} />}
              {isError && <AlertCircleIcon size={18} />}
              {!isSuccess && !isError && <SparklesIcon size={18} />}
            </div>
            <div className="toast-content">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              <CloseIcon size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
