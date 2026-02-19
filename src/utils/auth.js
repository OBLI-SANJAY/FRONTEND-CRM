import { jwtDecode } from "jwt-decode";

const normalizeRole = (role) => {
  if (!role) return "EMPLOYEE";
  // Convert arrays or objects to string for searching
  const r = JSON.stringify(role).toUpperCase();
  if (r.includes("ADMIN")) return "ADMIN";
  if (r.includes("MANAGER")) return "MANAGER";
  return "EMPLOYEE";
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    console.log("Full Decoded Token:", decoded);
    // Check all common role/authority fields
    const rawRole = decoded.role || decoded.roles || decoded.authorities || decoded.scope || decoded.scp;
    return normalizeRole(rawRole);
  } catch (e) {
    return null;
  }
};

export const getEmail = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  try {
    const decoded = jwtDecode(token);
    return decoded.sub || decoded.email; // Assuming sub or email is in token
  } catch (e) {
    return "";
  }
};

export const setAuthData = (token) => {
  localStorage.setItem("token", token);
  try {
    const decoded = jwtDecode(token);
    const rawRole = decoded.role || decoded.roles || decoded.authorities || decoded.scope || decoded.scp;
    const role = normalizeRole(rawRole);
    const email = decoded.sub || decoded.email || "";

    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    console.log("Saved Normalized Role:", role);
  } catch (e) {
    console.error("Invalid token", e);
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
};
