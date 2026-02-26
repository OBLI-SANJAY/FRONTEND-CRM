import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../services/userService";

function StaffDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        role: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const user = await userService.getUserById(id);
                setFormData({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    phone: user.phone || "",
                    address: user.address || "",
                    role: user.role || ""
                });
            } catch (err) {
                console.error("Failed to fetch staff details:", err);
                setError("Failed to load staff details.");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    if (loading) {
        return <div className="p-4"><p>Loading settings...</p></div>;
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                {error}
            </div>
        );
    }

    return (
        <div className="container py-4">
            <button
                className="btn btn-outline-secondary btn-sm mb-3"
                onClick={() => navigate("/staffs")}
            >
                ← Back to Staff List
            </button>

            <h2 className="mb-4 text-main">Account Settings</h2>

            <div className="card max-w-2xl">
                <div className="card-body p-4">
                    <h4 className="card-title mb-4">Profile Information</h4>

                    <form>
                        <div className="mb-3">
                            <label className="form-label">Email Address (Read-only)</label>
                            <input type="email" className="form-control" value={formData.email} disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Role (Read-only)</label>
                            <input type="text" className="form-control" value={formData.role} disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.fullName}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.phone}
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.address}
                                disabled
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StaffDetail;
