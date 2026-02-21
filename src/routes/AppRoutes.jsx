import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/common/Layout";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";


import Dashboard from "../components/dashboard/Dashboard";

import LeadList from "../components/leads/LeadList";
import AddLead from "../components/leads/AddLead";
import LeadDetails from "../components/leads/LeadDetails";
import Leads from "../pages/Leads";

import Customers from "../pages/Customers";
import AddCustomer from "../components/customers/AddCustomer";
import CustomerDetails from "../components/customers/CustomerDetails";
import EditCustomer from "../components/customers/EditCustomer";

import TaskList from "../components/tasks/TaskList";
import AddTask from "../components/tasks/AddTask";

import Settings from "../components/settings/Settings";
import CompleteProfile from "../pages/CompleteProfile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute allowedRoles={["MANAGER", "EMPLOYEE"]}>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />


      <Route element={<Layout />}>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/new"
          element={
            <ProtectedRoute>
              <AddLead />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <LeadDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/add"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AddCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <ProtectedRoute>
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers/:id/edit"
          element={
            <ProtectedRoute>
              <EditCustomer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/page/:pageNo"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />


        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["MANAGER", "EMPLOYEE"]}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
