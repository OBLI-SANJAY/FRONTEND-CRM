import React from "react";
import { RoleProvider } from "./context/RoleContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <RoleProvider>
      <AppRoutes />
    </RoleProvider>
  );
}

export default App;
