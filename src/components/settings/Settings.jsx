import React, { useState, useEffect } from "react";
import userService from "../../services/userService";
import { showSuccess, showError } from "../../utils/alert";

function Settings() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    // Try to pre-fill from localStorage immediately
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const localUser = JSON.parse(storedUser);
        setFormData({
          fullName: localUser.fullName || "",
          email: localUser.email || "",
          phone: localUser.phone || "",
          address: localUser.address || "",
          role: localUser.role || ""
        });
      } catch (_) { }
    }

    // Then try to fetch fresh data from the backend
    try {
      const user = await userService.getCurrentUser();
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || ""
      });
    } catch (err) {
      // If API fails but we have localStorage data, show a soft warning instead of error
      if (!storedUser) {
        setMessage({ type: "error", text: "Failed to load profile data." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await userService.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address
      });

      showSuccess("Profile updated successfully!");

      // Update local storage
      const oldUserStr = localStorage.getItem("user");
      if (oldUserStr) {
        const user = JSON.parse(oldUserStr);
        user.fullName = formData.fullName;
        user.phone = formData.phone;
        user.address = formData.address;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      showError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4"><p>Loading settings...</p></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-main">Account Settings</h2>

      <div className="card max-w-2xl">
        <div className="card-body p-4">
          <h4 className="card-title mb-4">Profile Information</h4>

          <form onSubmit={handleSubmit}>
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
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-control"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
