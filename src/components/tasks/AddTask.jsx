import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import taskService from "../../services/taskService";
import userService from "../../services/userService";
import { getRole, getEmail } from "../../utils/auth";
import { showError } from "../../utils/alert";

function AddTask() {
  const navigate = useNavigate();
  const role = getRole();
  const userEmail = getEmail();

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "To Do",
    dueDate: "",
    assignedTo: "",
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (role === "EMPLOYEE") {
      setError("You do not have permission to create tasks.");
      return;
    }

    const fetchAssignableUsers = async () => {
      setFetchingUsers(true);
      try {
        let roleToFetch = "";
        if (role === "ADMIN") roleToFetch = "MANAGER";
        if (role === "MANAGER") roleToFetch = "EMPLOYEE";

        if (roleToFetch) {
          const data = await userService.getUsersByRole(roleToFetch);
          setUsers(data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setFetchingUsers(false);
      }
    };

    fetchAssignableUsers();
  }, [role]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...task,
        assignedTo: task.assignedTo || userEmail,
        status: mapStatusToBackend(task.status)
      };

      const createdTask = await taskService.createTask(payload);
      console.log("Task Created Successfully:", createdTask);
      navigate("/tasks");
    } catch (err) {
      console.error("Error creating task:", err);
      showError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const mapStatusToBackend = (status) => {
    switch (status) {
      case "To Do": return "TODO";
      case "In Progress": return "IN_PROGRESS";
      case "Completed": return "COMPLETED";
      default: return "TODO";
    }
  };

  if (role === "EMPLOYEE") {
    return (
      <div className="container mt-5">
        <p className="text-warning">⚠ You do not have permission to access this page.</p>
        <Link to="/tasks" className="btn btn-secondary">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/tasks" className="text-decoration-none text-secondary">Tasks</Link></li>
          <li className="breadcrumb-item active text-white" aria-current="page">New Task</li>
        </ol>
      </nav>

      <div className="mb-4">
        <h1 className="h3">Add New Task</h1>
        <p className="text-secondary">
          Fill in the details below to create a new task.
        </p>
      </div>

      <div className="card text-white border-secondary p-4 mx-auto shadow-lg" style={{ maxWidth: "600px" }}>
        <div className="card-body p-4">

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Task Title</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                name="title"
                placeholder="e.g. Follow up call"
                value={task.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control bg-dark text-white border-secondary"
                rows="4"
                name="description"
                placeholder="Add details about the task..."
                value={task.description}
                onChange={handleChange}
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Priority</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  name="priority"
                  value={task.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
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

            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Assigned To</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                name="assignedTo"
                value={task.assignedTo}
                onChange={handleChange}
                disabled={fetchingUsers}
              >
                <option value="">Assign to me ({userEmail})</option>
                {users.map(u => (
                  <option key={u.email} value={u.email}>{u.fullName || u.email || u.name}</option>
                ))}
              </select>
              {fetchingUsers && <small className="text-secondary">Loading users...</small>}
            </div>

            <div className="d-flex justify-content-end gap-2">
              <Link to="/tasks" className="btn btn-outline-light">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
