import React from "react";
import { RoleProvider } from "./context/RoleContext";
import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ThemeProvider>
      <RoleProvider>
        <AppRoutes />
      </RoleProvider>
    </ThemeProvider>
  );
}

export default App;
