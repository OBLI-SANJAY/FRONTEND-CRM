import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import KanbanBoard from "../kanban/KanbanBoard";
import "../kanban/Kanban.css";
import "./Lead.css";

const LEAD_STATUSES = ["New", "Contacted", "Follow Up", "Converted", "Lost"];
const STORAGE_KEY = "crm_leads";

const defaultLeads = [
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
    status: "Contacted",
    email: "mross@pearson.com",
    contacted: "1 day ago",
    owner: "employee@clientconnect.com",
  },
  {
    id: 3,
    name: "Jessica Pearson",
    company: "Pearson Hardman",
    status: "Follow Up",
    email: "jessica@pearson.com",
    contacted: "5 days ago",
    owner: "admin@clientconnect.com",
  },
  {
    id: 4,
    name: "Saul Goodman",
    company: "McGill",
    status: "Converted",
    email: "saul@mcgill.com",
    contacted: "2 days ago",
    owner: "admin@clientconnect.com",
  },
  {
    id: 5,
    name: "Walter White",
    company: "Heisenberg",
    status: "New",
    email: "walter@heisenberg.com",
    contacted: "2 days ago",
    owner: "admin@clientconnect.com",
  },
];

function LeadList() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [leads, setLeads] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultLeads;
  });

  const role = localStorage.getItem("role");
  const email = localStorage.getItem("email");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

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
    setLeads(leads.filter(lead => lead.id !== id));
    setOpenMenu(null);
  };

  const handleStatusChange = (id, newStatus) => {
    setLeads(leads.map(lead =>
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
  };

  const canEdit = role === "Admin" || role === "Manager";

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

        <div className="view-toggle">
          <button
            className={viewMode === "table" ? "active" : ""}
            onClick={() => setViewMode("table")}
          >
            Table View
          </button>
          <button
            className={viewMode === "kanban" ? "active" : ""}
            onClick={() => setViewMode("kanban")}
          >
            Kanban View
          </button>
        </div>

        {viewMode === "table" ? (
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
                      <span className={`badge ${lead.status.toLowerCase().replace(/\s+/g, "-")}`}>
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
        ) : (
          <KanbanBoard
            items={visibleLeads}
            columns={LEAD_STATUSES}
            type="lead"
            statusOptions={LEAD_STATUSES}
            onStatusChange={handleStatusChange}
            canEdit={canEdit}
          />
        )}
      </main>
    </div>
  );
}

export default LeadList;
