import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "./Lead.css";

function AddLead() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <div className="breadcrumb">
          Leads <span>›</span> New Lead
        </div>

        <h1 className="page-title">Add New Lead</h1>

        <div className="form-card">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="e.g. John Doe" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Company</label>
              <input type="text" placeholder="e.g. Tech Solutions Inc." />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select>
                <option>New Lead</option>
                <option>Qualified</option>
                <option>Negotiation</option>
                <option>Contacted</option>
              </select>
            </div>
          </div>

          <h4 className="section-title">Contact Details</h4>

          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@example.com" />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="form-group">
            <label>Additional Notes</label>
            <textarea placeholder="Add any relevant details..." />
          </div>

          <div className="form-actions">
            <button
              className="cancel-btn"
              onClick={() => navigate("/leads")}
            >
              Cancel
            </button>

            <button
              className="save-btn"
              onClick={() => navigate("/leads")}
            >
              Save Lead
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AddLead;
