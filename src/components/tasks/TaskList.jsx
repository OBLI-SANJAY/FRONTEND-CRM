import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "../leads/Lead.css";
import "./Task.css";

function TaskList() {
  const { pageNo } = useParams();
  const navigate = useNavigate();
  const currentPage = Number(pageNo) || 1;
  const [openMenu, setOpenMenu] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const tasks = [
    {
      id: 1,
      title: "Finalize Q3 contract with Acme Corp",
      subtitle: "Client: John Doe (Acme Corp)",
      priority: "HIGH",
      status: "PENDING",
      date: "Today",
      assignedTo: "admin@clientconnect.com",
    },
    {
      id: 2,
      title: "Prepare sales deck for upcoming demo",
      subtitle: "Lead: Sarah Smith (TechFlow)",
      priority: "MEDIUM",
      status: "PENDING",
      date: "Oct 26",
      assignedTo: "manager@clientconnect.com",
    },
    {
      id: 3,
      title: "Update customer contact details",
      subtitle: "Client: Michael Brown",
      priority: "LOW",
      status: "COMPLETED",
      date: "Oct 28",
      assignedTo: "employee@clientconnect.com",
    },
    {
      id: 4,
      title: "Call new lead from webinar",
      subtitle: "Overdue by 2 days",
      priority: "HIGH",
      status: "PENDING",
      date: "Oct 22",
      assignedTo: "manager@clientconnect.com",
    },
  ];

  const roleBasedTasks =
    role === "Admin"
      ? tasks
      : tasks.filter((task) => task.assignedTo === email);

  const filteredTasks =
    filter === "ALL"
      ? roleBasedTasks
      : roleBasedTasks.filter((t) => t.status === filter);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <div className="tasks-header">
          <div>
            <h1>Tasks</h1>
            <p>Manage your daily activities</p>
          </div>

          {role !== "Employee" && (
            <Link to="/tasks/new" className="add-task-btn">
              + Add New Task
            </Link>
          )}
        </div>

        <div className="task-filters">
          <div className="filter-buttons">
            <button
              className={filter === "ALL" ? "active" : ""}
              onClick={() => setFilter("ALL")}
            >
              All Tasks
            </button>
            <button
              className={filter === "PENDING" ? "active" : ""}
              onClick={() => setFilter("PENDING")}
            >
              Pending
            </button>
            <button
              className={filter === "COMPLETED" ? "active" : ""}
              onClick={() => setFilter("COMPLETED")}
            >
              Completed
            </button>
          </div>

          <input className="search-top" placeholder="Search tasks..." />
        </div>

        <div className="task-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="task-left">
                <label className="task-checkbox">
                  <input type="checkbox" />
                  <span></span>
                </label>

                <div>
                  <h4>{task.title}</h4>
                  <p>{task.subtitle}</p>
                </div>
              </div>

              <div className="task-right">
                <span className={`priority ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <span className="date">{task.date}</span>
                {role !== "Employee" && (
                  <div className="actions-cell">
                    <span
                      className="dots"
                      onClick={() =>
                        setOpenMenu(openMenu === task.id ? null : task.id)
                      }
                    >
                      ⋮
                    </span>

                    {openMenu === task.id && (
                      <div className="action-menu">
                        <Link to={`/tasks/${task.id}/edit`}>Edit</Link>
                        <button className="danger">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <p style={{ opacity: 0.6 }}>No tasks assigned to you.</p>
          )}
        </div>

        <div className="pagination">
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className={currentPage === p ? "active" : ""}
              onClick={() => navigate(`/tasks/page/${p}`)}
            >
              {p}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TaskList;
