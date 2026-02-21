import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import userService from "../../services/userService";
import { getRole } from "../../utils/auth";

function AddCustomer({ onCustomerAdded }) {
    const navigate = useNavigate();
    const role = getRole();

    const [formData, setFormData] = useState({
        name: "",
        company: "",
        email: "",
        phone: "",
        industry: "",
        status: "Active",
        assignedTo: ""
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingUsers, setFetchingUsers] = useState(false);
    const [error, setError] = useState(null);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const payload = { ...formData };

            if (role === "ADMIN" && !formData.assignedTo) {
                throw new Error("Admin must assign customer to a Manager");
            }

            await customerService.createCustomer(payload);
            if (onCustomerAdded) onCustomerAdded();
            navigate("/customers");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to create customer");
        } finally {
            setLoading(false);
        }
    };

    if (role === "EMPLOYEE") {
        return (
            <div className="alert alert-warning">
                You do not have permission to create customers.
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0">
            <div className="card-body p-4">
                <h3 className="card-title mb-4">Add New Customer</h3>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Customer Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Company</label>
                            <input
                                type="text"
                                name="company"
                                className="form-control"
                                required
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="Company Name"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="email@example.com"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+1 234 567 890"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Industry</label>
                            <input
                                type="text"
                                name="industry"
                                className="form-control"
                                value={formData.industry}
                                onChange={handleChange}
                                placeholder="e.g. Technology, Finance"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-bold">Assign To ({role === "ADMIN" ? "Managers" : "Employees"})</label>
                            <select
                                name="assignedTo"
                                className="form-select"
                                required={role === "ADMIN"}
                                value={formData.assignedTo}
                                onChange={handleChange}
                                disabled={fetchingUsers}
                            >
                                <option value="">Select User...</option>
                                {users.map(u => (
                                    <option key={u.email} value={u.email}>
                                        {u.fullName || u.email || u.name}
                                    </option>
                                ))}
                            </select>
                            {fetchingUsers && <small className="text-muted text-muted-compact">Loading users...</small>}
                        </div>
                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            className="btn btn-light border"
                            onClick={() => navigate("/customers")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-4"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Customer"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCustomer;
