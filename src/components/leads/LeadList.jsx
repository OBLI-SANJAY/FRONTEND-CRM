import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "./Lead.css";

function LeadList() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  const leads = [
    {
      id: 1,
      name: "Sarah Jenkins",
      company: "TechFlow Inc.",
      status: "New",
      email: "sarah@techflow.com",
      contacted: "2 days ago",
      owner: "manager@clientconnect.com",
    },
    {
      id: 2,
      name: "Mike Ross",
      company: "Pearson Hardman",
      status: "Negotiation",
      email: "mross@pearson.com",
      contacted: "1 day ago",
      owner: "employee@clientconnect.com",
    },
    {
      id: 3,
      name: "Jessica Pearson",
      company: "Pearson Hardman",
      status: "Qualified",
      email: "jessica@pearson.com",
      contacted: "5 days ago",
      owner: "admin@clientconnect.com",
    },
    {
      id: 4,
      name: "Saul Goodman",
      company: "McGill",
      status: "Qualified",
      email: "saul@mcgill.com",
      contacted: "2 days ago",
      owner: "admin@clientconnect.com",
    },
    {
      id: 5,
      name: "Walter White",
      company: "Heisenberg",
      status: "Qualified",
      email: "walter@heisenberg.com",
      contacted: "2 days ago",
      owner: "admin@clientconnect.com",
    },
  ];

  let visibleLeads = [];

  if (role === "Admin") {
    visibleLeads = leads;
  } else if (role === "Manager") {
    visibleLeads = leads.filter(
      lead => lead.owner !== "admin@clientconnect.com"
    );
  } else {
    visibleLeads = leads.filter(
      lead => lead.owner === email
    );
  }

  const handleDelete = (id) => {
    setOpenMenu(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <header className="topbar">
          <h3>Leads</h3>
          <input className="search-top" placeholder="Search leads..." />
        </header>

        <div className="leads-header">
          <div>
            <h2>Manage your leads</h2>
            <p>Track and convert potential clients.</p>
          </div>

          {role !== "Employee" && (
            <Link to="/leads/new">
              <button className="add-lead-btn">+ Add New Lead</button>
            </Link>
          )}
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Email</th>
                <th>Last Contacted</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {visibleLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.company}</td>
                  <td>
                    <span className={`badge ${lead.status.toLowerCase()}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td>{lead.email}</td>
                  <td>{lead.contacted}</td>

                  <td className="actions-cell">
                    <span
                      className="dots"
                      onClick={() =>
                        setOpenMenu(openMenu === lead.id ? null : lead.id)
                      }
                    >
                      ⋮
                    </span>

                    {openMenu === lead.id && (
                      <div className="action-menu">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                        >
                          Details
                        </button>

                        {(role === "Admin" || role === "Manager") && (
                          <button
                            className="danger"
                            onClick={() => handleDelete(lead.id)}
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

          {visibleLeads.length === 0 && (
            <p className="table-footer" style={{ opacity: 0.6 }}>
              No leads available.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default LeadList;
