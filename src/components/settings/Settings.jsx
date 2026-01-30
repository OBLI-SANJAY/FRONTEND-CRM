import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import { clearAuthData } from "../../utils/auth";
import "../leads/Lead.css";
import "./Settings.css";

function Settings() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [profile, setProfile] = useState({
    firstName: "Sanjay",
    lastName: "Sanjay",
    email: "sanjay@clientconnect.com",
    bio: "Results-driven CRM administrator with over 5 years of experience in managing client relationships.",
    photo: null,
    photoPreview: null,
  });

  useEffect(() => {
    if (role === "Admin") {
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

  const handleDeleteAccount = () => {
    clearAuthData();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <h1 className="page-title">Profile Settings</h1>

        <div className="settings-card">
          <h2>General Information</h2>
          <p className="subtitle">
            Update your photo and personal details here.
          </p>

          <div className="photo-row">
            <div className="photo-preview">
              {profile.photoPreview ? (
                <img src={profile.photoPreview} alt="Profile" />
              ) : (
                <div className="photo-placeholder">👤</div>
              )}
            </div>

            <div className="photo-actions">
              <label className="upload-btn">
                Upload New
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoUpload}
                />
              </label>

              <button
                className="remove-btn"
                onClick={handleRemovePhoto}
              >
                Remove
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Email Address</label>
              <input
                name="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full">
              <label>Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>

            <button className="save-btn">
              Save Changes
            </button>
          </div>
        </div>

        <div className="danger-card">
          <h3>Delete Account</h3>
          <p>
            Once you delete your account, there is no going back.
            Please be certain.
          </p>

          <button
            className="delete-account-btn"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </main>
    </div>
  );
}

export default Settings;
