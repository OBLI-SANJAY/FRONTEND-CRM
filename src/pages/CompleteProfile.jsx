import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import { showError } from "../utils/alert";
import "../components/auth/auth.css";

function CompleteProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName || !formData.phone || !formData.address) {
            setError("All fields are required.");
            return;
        }

        setLoading(true);

        try {
            const result = await userService.updateProfile(formData);
            console.log("Update profile response:", result);
            const oldUserStr = localStorage.getItem("user");
            if (oldUserStr) {
                const user = JSON.parse(oldUserStr);
                user.profileCompleted = true;
                user.fullName = formData.fullName;
                user.phone = formData.phone;
                user.address = formData.address;
                localStorage.setItem("user", JSON.stringify(user));
            }

            navigate("/dashboard");
        } catch (err) {
            let errorMsg = "Failed to update profile.";
            if (err.response?.data) {
                const d = err.response.data;
                if (typeof d === "string") {
                    errorMsg = d;
                } else if (d && typeof d === "object" && typeof d.message === "string") {
                    errorMsg = d.message;
                }
            } else if (err.message && typeof err.message === "string") {
                errorMsg = err.message;
            }
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-wrapper">
            <div className="forgot-center">
                <div className="brand-center">
                    <div className="brand-dot"></div>
                    <h2 className="title" style={{ margin: 0 }}>ClientConnect</h2>
                </div>

                <div className="forgot-card">
                    <h3 className="title" style={{ fontSize: "24px", marginBottom: "8px" }}>Complete Your Profile</h3>
                    <p className="subtitle" style={{ fontSize: "14px", marginBottom: "24px" }}>
                        Please provide your details before accessing the dashboard.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: "32px" }}>
                            <label>Address</label>
                            <input
                                type="text"
                                placeholder="123 Main St, City"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <button type="submit" className="reset-btn" disabled={loading}>
                            {loading ? "Saving..." : "Save and Continue →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CompleteProfile;
