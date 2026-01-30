import React, { createContext, useContext, useState } from "react";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("role") || "Employee"
  );

  const loginAs = (role) => {
    setUserRole(role);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setUserRole("Employee");
    localStorage.removeItem("role");
  };

  return (
    <RoleContext.Provider value={{ userRole, loginAs, logout }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
