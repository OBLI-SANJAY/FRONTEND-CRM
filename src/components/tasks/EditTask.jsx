import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Task.css";

function EditTask() {
  const { id } = useParams();

  const tasks = [
    {
      id: 1,
      title: "Finalize Q3 contract with Acme Corp",
      description: "Client: John Doe (Acme Corp)",
      priority: "HIGH",
      status: "PENDING",
      date: "Today",
    },
    {
      id: 2,
      title: "Prepare sales deck for upcoming demo",
      description: "Lead: Sarah Smith (TechFlow)",
      priority: "MEDIUM",
      status: "PENDING",
      date: "Oct 26",
    },
    {
      id: 3,
      title: "Update customer contact details",
      description: "Client: Michael Brown",
      priority: "LOW",
      status: "COMPLETED",
      date: "Oct 28",
    },
    {
      id: 4,
      title: "Call new lead from webinar",
      description: "Overdue by 2 days",
      priority: "HIGH",
      status: "PENDING",
      date: "Oct 22",
    },
  ];

  const task = tasks.find((t) => t.id === Number(id));

  const [form, setForm] = useState(
    task || {
      title: "",
      description: "",
      priority: "LOW",
      status: "PENDING",
      date: "",
    }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!task) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Task not found</h2>
        <Link to="/tasks">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="edit-task-wrapper">
      <div className="edit-task-header">
        <Link to="/tasks" className="back-btn">
          ←
        </Link>
        <h2>Edit Task</h2>
        <Link to="/tasks" className="cancel-btn">
          Cancel
        </Link>
      </div>

      <div className="edit-task-form">
        <label>Task Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <label>Priority</label>
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <label>Due Date</label>
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <Link 
        to="/tasks" 
        className="save-btn"
        style={{ display: 'block', textAlign: 'center', maxWidth: '300px', margin: '30px auto' }}
      >
        ✔ Save Changes
      </Link>
    </div>
  );
}

export default EditTask;
