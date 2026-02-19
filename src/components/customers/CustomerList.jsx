import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRole } from "../../utils/auth";
import customerService from "../../services/customerService";
import userService from "../../services/userService";

function CustomerList({ customers, onRefresh, loading, searchKeyword, onSearchChange, isSearching }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [users, setUsers] = useState([]);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  const role = getRole() || "EMPLOYEE";

  useEffect(() => {
    if (role === "ADMIN" || role === "MANAGER") {
      fetchAvailableUsers();
    }
  }, [role]);

  const fetchAvailableUsers = async () => {
    try {
      setFetchingUsers(true);
      const targetRole = role === "ADMIN" ? "MANAGER" : "EMPLOYEE";
      const data = await userService.getUsersByRole(targetRole);
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users for selection:", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      try {
        await customerService.deleteCustomer(id);
        if (onRefresh) onRefresh();
        setOpenMenu(null);
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.message || "Server error"));
      }
    }
  };

  const handleAssign = async (id, userEmail) => {
    try {
      const assignedRole = role === "ADMIN" ? "MANAGER" : "EMPLOYEE";
      await customerService.assignCustomer(id, userEmail, assignedRole);
      alert("Successfully assigned.");
      if (onRefresh) onRefresh();
      setOpenMenu(null);
    } catch (err) {
      alert("Assignment failed: " + (err.response?.data?.message || "Check permissions"));
    }
  };

  if (loading && customers.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-secondary">Retrieving your customer list...</p>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="card border-0 shadow-sm" style={{ overflow: 'visible' }}>
        <div className="table-responsive" style={{ overflow: 'visible' }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Client Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Contact info</th>
                <th>Owner</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, index) => (
                <tr key={c.id}>
                  <td className="ps-4">
                    <Link to={`/customers/${c.id}`} className="text-main text-decoration-none fw-bold hover-primary">
                      {c.name}
                    </Link>
                  </td>
                  <td>{c.company}</td>
                  <td>
                    <span className={`badge rounded-pill ${c.status === "Active" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                      {c.status || "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="small text-secondary">{c.email}</div>
                    <div className="small text-muted">{c.phone}</div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm bg-info-subtle text-info rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: 10 }}>
                        {(c.assignedTo || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="small">{c.assignedTo || "Unassigned"}</span>
                    </div>
                  </td>
                  <td className="text-end position-relative">
                    <button
                      className="btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                    </button>

                    {openMenu === c.id && (
                      <div className="position-absolute end-0 bg-white text-dark rounded shadow p-2 top-100 mt-1" style={{ zIndex: 9999, width: "150px" }}>
                        <button
                          className="btn btn-sm btn-light w-100 text-start mb-1"
                          onClick={() => navigate(`/customers/${c.id}`)}
                        >
                          Details
                        </button>


                        {role === "ADMIN" && (
                          <button
                            className="btn btn-sm btn-danger w-100 text-start"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {customers.length === 0 && (
          <div className="text-center py-5">
            <h5 className="text-muted">No customers found</h5>
            <p className="small text-secondary">Try adjusting your filters or adding a new client.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;
