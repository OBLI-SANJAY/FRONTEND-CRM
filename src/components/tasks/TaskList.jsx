import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import KanbanBoard from "../kanban/KanbanBoard";
import "../kanban/Kanban.css";
import "../leads/Lead.css";
import "./Task.css";

const TASK_STATUSES = ["To Do", "In Progress", "Completed"];
const STORAGE_KEY = "crm_tasks";

const defaultTasks = [
  {
    id: 1,
    title: "Finalize Q3 contract with Acme Corp",
    subtitle: "Client: John Doe (Acme Corp)",
    priority: "HIGH",
    status: "To Do",
    date: "Today",
    assignedTo: "admin@clientconnect.com",
  },
  {
    id: 2,
    title: "Prepare sales deck for upcoming demo",
    subtitle: "Lead: Sarah Smith (TechFlow)",
    priority: "MEDIUM",
    status: "In Progress",
    date: "Oct 26",
    assignedTo: "manager@clientconnect.com",
  },
  {
    id: 3,
    title: "Update customer contact details",
    subtitle: "Client: Michael Brown",
    priority: "LOW",
    status: "Completed",
    date: "Oct 28",
    assignedTo: "employee@clientconnect.com",
  },
  {
    id: 4,
    title: "Call new lead from webinar",
    subtitle: "Overdue by 2 days",
    priority: "HIGH",
    status: "To Do",
    date: "Oct 22",
    assignedTo: "manager@clientconnect.com",
  },
];

function TaskList() {
  const { pageNo } = useParams();
  const navigate = useNavigate();
  const currentPage = Number(pageNo) || 1;
  const [openMenu, setOpenMenu] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultTasks;
  });

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const roleBasedTasks =
    role === "Admin"
      ? tasks
      : tasks.filter((task) => task.assignedTo === email);

  const filteredTasks =
    filter === "ALL"
      ? roleBasedTasks
      : roleBasedTasks.filter((t) => t.status === filter);

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    setOpenMenu(null);
  };

  const canEdit = role === "Admin" || role === "Manager";

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
              className={filter === "To Do" ? "active" : ""}
              onClick={() => setFilter("To Do")}
            >
              To Do
            </button>
            <button
              className={filter === "In Progress" ? "active" : ""}
              onClick={() => setFilter("In Progress")}
            >
              In Progress
            </button>
            <button
              className={filter === "Completed" ? "active" : ""}
              onClick={() => setFilter("Completed")}
            >
              Completed
            </button>
          </div>

          <input className="search-top" placeholder="Search tasks..." />
        </div>

        <div className="view-toggle">
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            className={viewMode === "kanban" ? "active" : ""}
            onClick={() => setViewMode("kanban")}
          >
            Kanban View
          </button>
        </div>

        {viewMode === "table" ? (
          <>
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
                    <span className={`status-badge ${task.status.toLowerCase().replace(/\s+/g, "-")}`}>
                      {task.status}
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
                            <button className="danger" onClick={() => handleDelete(task.id)}>Delete</button>
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
          </>
        ) : (
          <KanbanBoard
            items={roleBasedTasks}
            columns={TASK_STATUSES}
            type="task"
            statusOptions={TASK_STATUSES}
            onStatusChange={handleStatusChange}
            canEdit={canEdit}
          />
        )}
      </main>
    </div>
  );
}

export default TaskList;
