import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getRole, clearAuthData } from "../../utils/auth";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

function Sidebar() {
  const location = useLocation();
  const role = getRole();
  const storedUser = localStorage.getItem("user");
  const fullName = storedUser ? (JSON.parse(storedUser).fullName || "User") : "User";
  const avatarLetter = fullName.charAt(0).toUpperCase();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "text-secondary";
  };

  const handleLogout = () => {
    clearAuthData();
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-sidebar h-100 border-end border-soft" style={{ width: "300px" }}>
      <div className="d-flex align-items-center justify-content-between mb-4 w-100">
        <span className="fs-5 fw-bold" style={{ color: "var(--success)" }}>ClientConnect</span>
        <ThemeToggle />
      </div>
      <hr className="text-muted" />
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
            <span className="me-2">📊</span> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/leads" className={`nav-link ${isActive("/leads")}`}>
            <span className="me-2">👥</span> Leads
          </Link>
        </li>
        {(role === "ADMIN" || role === "MANAGER" || role === "EMPLOYEE") && (
          <li>
            <Link to="/customers" className={`nav-link ${isActive("/customers")}`}>
              <span className="me-2">👤</span> Customers
            </Link>
          </li>
        )}
        <li>
          <Link to="/tasks" className={`nav-link ${isActive("/tasks")}`}>
            <span className="me-2">✅</span> Tasks
          </Link>
        </li>
        {role !== "ADMIN" && (
          <li>
            <Link to="/settings" className={`nav-link ${isActive("/settings")}`}>
              <span className="me-2">⚙️</span> Settings
            </Link>
          </li>
        )}
      </ul>
      <hr className="text-muted" />
      <div className="dropdown">
        <div className="d-flex align-items-center text-decoration-none">
          <div
            className="rounded-circle bg-success d-flex justify-content-center align-items-center me-2 text-white"
            style={{ width: "32px", height: "32px" }}
          >
            <strong>{avatarLetter}</strong>
          </div>
          <div>
            <strong className="text-main">{fullName}</strong>
            <div className="small text-muted">{role}</div>
          </div>
        </div>
        <Link to="/login" className="btn btn-outline-danger btn-sm w-100 mt-3" onClick={handleLogout}>
          Log out
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
