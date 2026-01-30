import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "./Lead.css";

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const leads = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Product Manager",
      company: "TechFlow Inc.",
      email: "sarah@techflow.com",
      phone: "+1 555 123 4567",
      location: "San Francisco, CA",
      status: "New",
      netWorth: "$1.2M",
      expectedDeal: "$45,000",
      usefulness:
        "Decision maker with strong influence on SaaS purchases. High probability of long-term partnership.",
      engagement: "High",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 2,
      name: "Mike Ross",
      role: "Legal Consultant",
      company: "Pearson Hardman",
      email: "mross@pearson.com",
      phone: "+1 555 987 6543",
      location: "New York, NY",
      status: "Negotiation",
      netWorth: "$3.5M",
      expectedDeal: "$120,000",
      usefulness:
        "Represents multiple enterprise clients. Potential gateway to bulk contracts.",
      engagement: "Medium",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  ];

  const lead = leads.find((l) => l.id === Number(id));

  if (!lead) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Lead not found</h2>
        <button onClick={() => navigate("/leads")}>Back to Leads</button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <div className="page-top">
          <div className="breadcrumb">
            Leads <span>›</span> {lead.name}
          </div>

          <button className="back-btn" onClick={() => navigate("/leads")}>
            ← Back to Leads
          </button>
        </div>

        <h1 className="page-title">Lead Details</h1>
        <p className="subtitle">Business potential and engagement overview</p>

        <div className="details-grid">
          <div className="profile-card">
            <img src={lead.avatar} alt={lead.name} className="profile-img" />
            <h3>{lead.name}</h3>
            <p className="role">{lead.role}</p>

            <span className={`badge ${lead.status.toLowerCase()}`}>
              {lead.status}
            </span>

            <div className="stats-row">
              <div>
                <p>Net Worth</p>
                <h4>{lead.netWorth}</h4>
              </div>
              <div>
                <p>Expected Deal</p>
                <h4>{lead.expectedDeal}</h4>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Lead Information</h4>

            <div className="info-item">
              <label>Company</label>
              <p>{lead.company}</p>
            </div>

            <div className="info-item">
              <label>Email</label>
              <p>{lead.email}</p>
            </div>

            <div className="info-item">
              <label>Phone</label>
              <p>{lead.phone}</p>
            </div>

            <div className="info-item">
              <label>Location</label>
              <p>{lead.location}</p>
            </div>

            <div className="info-item">
              <label>Engagement Level</label>
              <p>{lead.engagement}</p>
            </div>
          </div>

          <div className="activity-card">
            <h4>Why This Lead Is Valuable</h4>
            <p className="lead-note">{lead.usefulness}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LeadDetails;
