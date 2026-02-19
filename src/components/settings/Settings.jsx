import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearAuthData } from "../../utils/auth";

import api from "../../services/api";

function Settings() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [deleting, setDeleting] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Sanjay",
    lastName: "Sanjay",
    email: "sanjay@clientconnect.com",
    phone: "+1 (555) 123-4567",
    company: "ClientConnect Inc.",
    location: "New York, USA",
    bio: "Results-driven CRM administrator with over 5 years of experience in managing client relationships.",
    photo: null,
    photoPreview: null,
  });

  useEffect(() => {
    if (role === "ADMIN") {
      navigate("/dashboard");
    }
  }, [role, navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfile({
      ...profile,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    });
  };

  const handleRemovePhoto = () => {
    setProfile({ ...profile, photo: null, photoPreview: null });
  };

  const handleCancel = () => {
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    if (deleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete("/auth/delete");

      clearAuthData();
      navigate("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
      const message = err.response?.data?.message || "Failed to delete account";
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1 className="h2">Profile Settings</h1>
        <p className="text-secondary">Update your photo and personal details.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card mb-5">
            <div className="card-header border-bottom">
              <h4 className="h5 mb-0">General Information</h4>
            </div>

            <div className="card-body p-4">
              <div className="d-flex align-items-center gap-4 mb-4 pb-4 border-bottom">
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center overflow-hidden"
                  style={{ width: "80px", height: "80px", fontSize: "2rem" }}
                >
                  {profile.photoPreview ? (
                    <img src={profile.photoPreview} alt="Profile" className="w-100 h-100 object-fit-cover" />
                  ) : (
                    <span>👤</span>
                  )}
                </div>

                <div className="d-flex gap-2">
                  <label className="btn btn-outline-primary btn-sm">
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handlePhotoUpload}
                    />
                  </label>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Company</label>
                  <input
                    className="form-control"
                    name="company"
                    value={profile.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Location</label>
                  <input
                    className="form-control"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button className="btn btn-outline-light" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="edit-btn">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="card border-danger bg-transparent">
            <div className="card-body">
              <h3 className="h5 text-danger">Delete Account</h3>
              <p className="text-secondary small mb-3">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                className="btn btn-danger"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Settings;
