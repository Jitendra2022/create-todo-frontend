import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Tasks from "./pages/Tasks.jsx";

const Private = ({ children }) =>
  localStorage.getItem("token") ? children : <Navigate to="/login" />;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Auth mode="login" />} />
      <Route path="/register" element={<Auth mode="register" />} />
      <Route path="/" element={<Private><Tasks /></Private>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
