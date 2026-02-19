import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import KanbanTasks from "./KanbanTasks";
import taskService from "../../services/taskService";
import { getRole, getEmail } from "../../utils/auth";
import "../kanban/Kanban.css";
import "./TaskList.css";

const STAGE_MAP = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

function TaskList() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [viewMode, setViewMode] = useState("table");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const role = getRole();
  const email = getEmail();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      console.log("Tasks Response:", data);

      let fetchedTasks = [];
      if (Array.isArray(data)) {
        fetchedTasks = data;
      } else if (data && Array.isArray(data.content)) {
        fetchedTasks = data.content;
      } else {
        console.warn("Unexpected tasks format:", data);
      }
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = React.useMemo(() => {
    if (selectedStage === "ALL") return tasks;
    return tasks.filter((task) => {
      let status = (task.status || task.stage || "TODO").toUpperCase();
      if (status === "PENDING") status = "TODO";
      if (status === "REVIEW") status = "TODO";
      return status === selectedStage;
    });
  }, [tasks, selectedStage]);

  const visibleTasks = filteredTasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.subtitle && t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
      setOpenMenu(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task.");
    }
  };

  const getPriorityBadgeClass = (priority) => {
    if (!priority) return "bg-secondary";
    switch (priority.toUpperCase()) {
      case "HIGH": return "bg-danger";
      case "MEDIUM": return "bg-warning text-dark";
      case "LOW": return "bg-success";
      default: return "bg-secondary";
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return "bg-secondary";
    // Handle both old 'stage' and new 'status' values just in case
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === "TODO" || normalizedStatus === "PENDING") return "bg-secondary";
    if (normalizedStatus === "IN_PROGRESS") return "bg-primary";
    if (normalizedStatus === "COMPLETED") return "bg-success";
    if (normalizedStatus === "REVIEW") return "bg-info text-dark";
    return "bg-secondary";
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return "No Date";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container-fluid task-list-wrapper">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h1 className="h3 mb-1">Tasks</h1>
          <p className="text-secondary mb-0">Manage your daily activities</p>
        </div>

        {role !== "EMPLOYEE" && (
          <Link to="/tasks/new" className="btn btn-primary d-flex align-items-center gap-2 shadow-sm px-4 py-2">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            <span className="fw-bold">Add New Task</span>
          </Link>
        )}
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        {viewMode === "table" && (
          <div className="btn-group-custom">
            {[
              { id: "ALL", label: "All Tasks", class: "all", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> },
              { id: "TODO", label: STAGE_MAP.TODO, class: "todo", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg> },
              { id: "IN_PROGRESS", label: STAGE_MAP.IN_PROGRESS, class: "in-progress", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
              { id: "COMPLETED", label: STAGE_MAP.COMPLETED, class: "completed", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> }
            ].map((f) => (
              <button
                key={f.id}
                className={`btn-custom ${f.class} ${selectedStage === f.id ? "active" : ""}`}
                onClick={() => setSelectedStage(f.id)}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
        )}
        {viewMode === "kanban" && <div className="flex-grow-1"></div>}

        <div className="w-100 w-md-25 search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            className="form-control"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="btn-group-custom mb-4">
        <button
          className={`btn-custom view ${viewMode === "table" ? "active" : ""}`}
          onClick={() => setViewMode("table")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
          Table View
        </button>
        <button
          className={`btn-custom view ${viewMode === "kanban" ? "active" : ""}`}
          onClick={() => setViewMode("kanban")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3z"></path><path d="M14 3h7v7h-7z"></path><path d="M14 14h7v7h-7z"></path><path d="M3 14h7v7H3z"></path></svg>
          Kanban View
        </button>
      </div>

      {loading && <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        viewMode === "table" ? (
          <div className="list-group mb-4">
            {visibleTasks.map((task) => (
              <div key={task.id} className="list-group-item list-group-item-action d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3">
                <div className="d-flex align-items-center mb-2 mb-md-0">
                  <div className="form-check me-3">
                    <input className="form-check-input" type="checkbox" />
                  </div>
                  <div>
                    <h5 className="mb-1 task-list-title">{task.title}</h5>
                    <p className="mb-0 small task-list-desc">{task.description}</p>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`badge ${getStatusBadgeClass(task.status || task.stage)}`}>
                    {STAGE_MAP[(task.status || task.stage || "").toUpperCase()] || (task.status || task.stage)}
                  </span>
                  <span className="small text-secondary">{formatDate(task.dueDate)}</span>

                  <div className="position-relative">
                    <button
                      className="btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() =>
                        setOpenMenu(openMenu === task.id ? null : task.id)
                      }
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>

                    {openMenu === task.id && (
                      <div className="position-absolute end-0 top-100 bg-white text-dark rounded shadow p-2" style={{ zIndex: 1000, minWidth: "150px" }}>


                        {/* Delete - Admin only */}
                        {role === "ADMIN" && (
                          <button
                            className="btn btn-sm btn-danger w-100 text-start"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {visibleTasks.length === 0 && (
              <div className="text-center p-4 text-secondary">
                No tasks found.
              </div>
            )}
          </div>
        ) : (
          <KanbanTasks
            tasks={tasks.filter(t =>
              t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
            )}
            onRefresh={fetchTasks}
          />
        )
      )}
    </div>
  );
}

export default TaskList;
