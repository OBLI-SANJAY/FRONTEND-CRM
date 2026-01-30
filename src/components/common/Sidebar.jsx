import React from "react";
import { Link, useLocation } from "react-router-dom";
import { getRole, clearAuthData } from "../../utils/auth";

function Sidebar() {
  const location = useLocation();
  const role = getRole();

  const isActive = (path) => {
    return location.pathname.startsWith(path) ? "active" : "";
  };

  const handleLogout = () => {
    clearAuthData();
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-header">
        <span className="logo-dot"></span>
        <h2>ClientConnect</h2>
      </div>

      <nav className="menu">
        <Link to="/dashboard" className={isActive("/dashboard")}>
          📊 Dashboard
        </Link>
        <Link to="/leads" className={isActive("/leads")}>
          👥 Leads
        </Link>
        {(role === "Admin" || role === "Manager" || role === "Employee") && (
          <Link to="/customers" className={isActive("/customers")}>
            👤 Customers
          </Link>
        )}
        <Link to="/tasks" className={isActive("/tasks")}>
          ✅ Tasks
        </Link>
        {role !== "Admin" && (
          <Link to="/settings" className={isActive("/settings")}>
            ⚙️ Settings
          </Link>
        )}
      </nav>

      <div className="sidebar-footer">
        <Link to="/login">
          <button className="logout-btn" onClick={handleLogout}>
            ← Log out
          </button>
        </Link>

        <div className="user-info">
          <div className="avatar">S</div>
          <div>
            <p className="name">Sanjay</p>
            <span className="role">{role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
