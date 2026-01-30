export const isAuthenticated = () => {
  return localStorage.getItem("role") !== null;
};

export const getRole = () => {
  return localStorage.getItem("role") || "Employee";
};

export const getEmail = () => {
  return localStorage.getItem("email") || "";
};

export const setAuthData = (role, email) => {
  localStorage.setItem("role", role);
  localStorage.setItem("email", email);
};

export const clearAuthData = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("email");
};

export const getRoleFromEmail = (email) => {
  if (email.includes("admin")) {
    return "Admin";
  } else if (email.includes("manager")) {
    return "Manager";
  }
  return "Employee";
};
