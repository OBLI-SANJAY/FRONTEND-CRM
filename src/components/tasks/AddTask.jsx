import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "../leads/Lead.css";
import "./Task.css";

function AddTask() {
  const [task, setTask] = useState({
    title: "",
    description: "",
    related: "",
    priority: "Medium",
    status: "To Do",
    date: "",
    assigned: "Jane Cooper (Me)",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <div className="add-task-wrapper">
          <p className="breadcrumb">
            Tasks <span>›</span> New Task
          </p>

          <h1>Add New Task</h1>
          <p className="subtitle">
            Fill in the details below to create a new task.
          </p>

          <div className="add-task-form">
            <label>Task Title</label>
            <input
              name="title"
              placeholder="e.g. Follow up call"
              value={task.title}
              onChange={handleChange}
            />

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Add details about the task..."
              value={task.description}
              onChange={handleChange}
            />

            <label>Related Lead / Customer</label>
            <select name="related" onChange={handleChange}>
              <option>Select Lead or Customer</option>
              <option>John Doe (Acme Corp)</option>
              <option>Sarah Smith (TechFlow)</option>
            </select>

            <div className="two-col">
              <div>
                <label>Priority</label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={task.status}
                  onChange={handleChange}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <label>Due Date</label>
            <input
              type="date"
              name="date"
              value={task.date}
              onChange={handleChange}
            />

            <label>Assigned To</label>
            <select
              name="assigned"
              value={task.assigned}
              onChange={handleChange}
            >
              <option>Jane Cooper (Me)</option>
              <option>Alex Morgan</option>
            </select>
          </div>

          <div className="task-form-actions">
            <Link to="/tasks" className="cancel-btn">
              Cancel
            </Link>

            <Link to="/tasks" className="save-btn">
              Save Task
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddTask;
