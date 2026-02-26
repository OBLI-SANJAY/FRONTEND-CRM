import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const role = getRole();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (!user.profileCompleted && (user.role === "MANAGER" || user.role === "EMPLOYEE" || user.role === "EMPLOYEE")) {
        if (window.location.pathname !== "/complete-profile") {
          return <Navigate to="/complete-profile" replace />;
        }
      } else if (user.profileCompleted && window.location.pathname === "/complete-profile") {
        return <Navigate to="/dashboard" replace />;
      }
    } catch (e) { }
  }

  return children;
}

export default ProtectedRoute;
