import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadService from "../../services/leadService";
import userService from "../../services/userService";
import { getEmail, getRole } from "../../utils/auth";

function AddLead({ onLeadAdded }) {
  const navigate = useNavigate();
  const role = getRole();
  const currentUserEmail = getEmail();

  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [error, setError] = useState(null);
  const [assignableUsers, setAssignableUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    stage: "NEW",
    email: "",
    phone: "",
    notes: "",
    assignedTo: "",
    contacted: "Just now"
  });

  useEffect(() => {
    if (role === "EMPLOYEE") {
      navigate("/leads");
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (role === "ADMIN" || role === "MANAGER") {
        try {
          setFetchingUsers(true);
          const roleToFetch = role === "ADMIN" ? "MANAGER" : "EMPLOYEE";
          const users = await userService.getUsersByRole(roleToFetch);
          setAssignableUsers(users);
        } catch (err) {
          console.error("Failed to fetch assignable users", err);
        } finally {
          setFetchingUsers(false);
        }
      }
    };
    fetchUsers();
  }, [role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((role === "ADMIN" || role === "MANAGER") && !formData.assignedTo) {
      setError(`Please select a ${role === "ADMIN" ? "Manager" : "Employee"} to assign this lead.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        createdBy: currentUserEmail,
        assignedTo: formData.assignedTo
      };

      const newLead = await leadService.createLead(payload);

      if (onLeadAdded) {
        onLeadAdded(newLead);
      } else {
        navigate("/leads");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create lead. Please check your data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (role === "EMPLOYEE") {
    return null;
  }

  return (
    <div className="container-fluid">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/leads" className="text-decoration-none text-secondary">Leads</Link></li>
          <li className="breadcrumb-item active text-white" aria-current="page">New Lead</li>
        </ol>
      </nav>

      <div className="mb-4">
        <h1 className="h3">Add New Lead</h1>
        <p className="text-secondary">Capture details and assign work.</p>
      </div>

      <div className="card text-white border-secondary p-4 mx-auto" style={{ maxWidth: "600px" }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label">Company</label>
                <input
                  className="form-control bg-dark text-white border-secondary"
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Tech Solutions Inc."
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Stage</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                >
                  <option value="NEW">New Lead</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="CONVERTED">Converted</option>
                  <option value="LOST">Lost</option>
                </select>
              </div>
            </div>


            {(role === "ADMIN" || role === "MANAGER") && (
              <div className="mb-3">
                <label className="form-label">
                  Assign to {role === "ADMIN" ? "Manager" : "Employee"}
                </label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select {role === "ADMIN" ? "Manager" : "Employee"}...</option>
                  {fetchingUsers ? (
                    <option disabled>Loading users...</option>
                  ) : (
                    assignableUsers.map(user => (
                      <option key={user.id || user.email} value={user.email}>
                        {user.fullName || user.email || user.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )}

            <h4 className="h5 mt-4 mb-3 border-bottom border-secondary pb-2">Contact Details</h4>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control bg-dark text-white border-secondary"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Add any relevant details..."
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => navigate("/leads")}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="edit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLead;
