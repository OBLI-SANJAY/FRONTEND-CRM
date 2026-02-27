import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { getRole } from "../../utils/auth";
import api from "../../services/api";
import { showSuccess, showError } from "../../utils/alert";

function StaffList() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openMenu, setOpenMenu] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const currentRole = getRole();

    // ADMIN manages MANAGERs, MANAGER manages EMPLOYEEs
    const targetRole = currentRole === "ADMIN" ? "MANAGER" : "EMPLOYEE";
    const newMemberRole = targetRole; // role to assign when creating
    const addLabel = currentRole === "ADMIN" ? "Add Manager" : "Add Employee";
    const createLabel = currentRole === "ADMIN" ? "Create Manager" : "Create Employee";
    const pageTitle = currentRole === "ADMIN" ? "Staffs" : "My Team";

    // ── Add form state ──────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [saving, setSaving] = useState(false);

    const resetForm = () => {
        setStep(1);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setPhone("");
        setAddress("");
    };

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const data = await userService.getUsersByRole(targetRole);
            setEmployees(data || []);
        } catch (err) {
            console.error("Failed to fetch staff:", err);
            setError("Failed to load staff list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleNext = () => {
        if (!email || !password || !confirmPassword) {
            showError("Please fill in email and password fields");
            return;
        }
        if (password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }
        setStep(2);
    };

    const handleSignup = async () => {
        if (!email || !password || !fullName || !phone || !address) {
            showError("Please fill in all the required fields");
            return;
        }
        if (password !== confirmPassword) {
            showError("Passwords do not match");
            return;
        }

        setSaving(true);
        try {
            const responseData = await api.post("/auth/register", {
                email,
                password,
                role: newMemberRole,
                fullName,
                phone,
                address,
            });

            let successMsg = `${newMemberRole === "MANAGER" ? "Manager" : "Employee"} account created successfully!`;
            if (responseData && typeof responseData === "object" && typeof responseData.message === "string") {
                successMsg = responseData.message;
            } else if (typeof responseData === "string" && responseData) {
                successMsg = responseData;
            }

            showSuccess(successMsg);
            resetForm();
            setShowAddForm(false);
            await fetchEmployees();
        } catch (err) {
            let backendMessage = "Registration failed";
            if (err.response?.data) {
                const d = err.response.data;
                if (typeof d === "string") backendMessage = d;
                else if (d && typeof d === "object" && typeof d.message === "string") backendMessage = d.message;
            } else if (err.message) {
                backendMessage = err.message;
            }
            showError(backendMessage);
        } finally {
            setSaving(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        if (role === "MANAGER") return "bg-warning text-dark";
        if (role === "EMPLOYEE") return "bg-success text-white";
        return "bg-secondary text-white";
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1">{pageTitle}</h4>
                    <p className="text-muted mb-0 small">
                        {employees.length} {targetRole.toLowerCase()}{employees.length !== 1 ? "s" : ""} found
                    </p>
                </div>

                <button
                    className={`btn btn-sm ${showAddForm ? "btn-outline-secondary" : "btn-success"} shadow-sm`}
                    onClick={() => {
                        resetForm();
                        setShowAddForm(!showAddForm);
                    }}
                >
                    {showAddForm ? "← Back to List" : (
                        <>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-1">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            {addLabel}
                        </>
                    )}
                </button>
            </div>

            {/* ── Inline Add Form ── */}
            {showAddForm && (
                <div className="card border-0 shadow-sm mb-4" style={{ maxWidth: "520px" }}>
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-1">{createLabel} Account</h5>
                        <p className="text-muted small mb-4">
                            Step {step} of 2 — {step === 1 ? "Credentials" : "Personal Details"}
                        </p>

                        {step === 1 ? (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="user@clientconnect.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Role (Fixed)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newMemberRole}
                                        disabled
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>

                                <button className="btn btn-success w-100" onClick={handleNext}>
                                    Next Step →
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="+1 234 567 890"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="123 Main St, City"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-outline-secondary flex-fill"
                                        onClick={() => setStep(1)}
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        className="btn btn-success flex-fill"
                                        onClick={handleSignup}
                                        disabled={saving}
                                    >
                                        {saving ? "Creating..." : createLabel}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* ── Staff Table ── */}
            {!showAddForm && (
                employees.length === 0 ? (
                    <div className="text-center text-muted py-5">
                        <div style={{ fontSize: "3rem" }}>👥</div>
                        <p className="mt-3">No {targetRole.toLowerCase()}s found.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr className="text-muted small text-uppercase">
                                    <th style={{ width: "48px" }}></th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Phone</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp) => {
                                    const initials = emp.fullName
                                        ? emp.fullName.charAt(0).toUpperCase()
                                        : "?";
                                    return (
                                        <tr key={emp._id || emp.id}>
                                            <td>
                                                <div
                                                    className="rounded-circle bg-success d-flex justify-content-center align-items-center text-white fw-bold mx-auto"
                                                    style={{ width: "36px", height: "36px", fontSize: "14px" }}
                                                >
                                                    {initials}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="fw-semibold">{emp.fullName || "—"}</div>
                                            </td>
                                            <td className="text-muted">{emp.email || "—"}</td>
                                            <td>
                                                <span className={`badge rounded-pill ${getRoleBadgeClass(emp.role)}`}>
                                                    {emp.role}
                                                </span>
                                            </td>
                                            <td className="text-muted">{emp.phone || "—"}</td>
                                            <td className="text-end position-relative">
                                                <button
                                                    className="btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                                    style={{ width: "32px", height: "32px" }}
                                                    onClick={() => setOpenMenu(openMenu === (emp._id || emp.id) ? null : (emp._id || emp.id))}
                                                >
                                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="12" cy="5" r="1"></circle>
                                                        <circle cx="12" cy="19" r="1"></circle>
                                                    </svg>
                                                </button>
                                                {openMenu === (emp._id || emp.id) && (
                                                    <div className="position-absolute end-0 bg-white text-dark rounded shadow p-2 top-100 mt-1" style={{ zIndex: 9999, width: "150px" }}>
                                                        <button
                                                            className="btn btn-sm btn-light w-100 text-start"
                                                            onClick={() => navigate(`/staffs/${emp._id || emp.id}`)}
                                                        >
                                                            Details
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
}

export default StaffList;
