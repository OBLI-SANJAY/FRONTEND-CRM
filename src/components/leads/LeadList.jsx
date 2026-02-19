import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import KanbanLeads from "./KanbanLeads";
import { getRole, getEmail } from "../../utils/auth";
import leadService from "../../services/leadService";
import "./KanbanLeads.css";


const LEAD_STATUSES = ["NEW", "CONTACTED", "FOLLOW_UP", "CONVERTED", "LOST"];
const STAGE_DISPLAY_MAP = {
  "NEW": "New",
  "CONTACTED": "Contacted",
  "FOLLOW_UP": "Follow Up",
  "CONVERTED": "Converted",
  "LOST": "Lost"
};
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
    industry: "SaaS",
    source: "Website",
    netWorth: 12000000,
    monthlyIncome: 850000,
    businessValue: 45000000,
    expectedDealValue: 1200000,
  },
  {
    id: 2,
    name: "Mike Ross",
    company: "Pearson Hardman",
    status: "Contacted",
    email: "mross@pearson.com",
    contacted: "1 day ago",
    owner: "employee@clientconnect.com",
    industry: "Legal",
    source: "Referral",
    netWorth: 35000000,
    monthlyIncome: 2500000,
    businessValue: 150000000,
    expectedDealValue: 5000000,
  },
  {
    id: 6,
    name: "Thomas Shelby",
    company: "Shelby Company Limited",
    status: "New",
    email: "thomas@shelby.com",
    contacted: "Just now",
    owner: "employee@clientconnect.com",
    industry: "Logistics",
    source: "Direct",
    netWorth: 95000000,
    monthlyIncome: 6000000,
    businessValue: 500000000,
    expectedDealValue: 25000000,
  },
  {
    id: 7,
    name: "Harvey Specter",
    company: "Pearson Spectre Litt",
    status: "Follow Up",
    email: "harvey@psl.com",
    contacted: "3 hours ago",
    owner: "employee@clientconnect.com",
    industry: "Legal",
    source: "Ads",
    netWorth: 1500000,
    monthlyIncome: 120000,
    businessValue: 4000000,
    expectedDealValue: 200000,
  },
  {
    id: 3,
    name: "Jessica Pearson",
    company: "Pearson Hardman",
    status: "Follow Up",
    email: "jessica@pearson.com",
    contacted: "5 days ago",
    owner: "admin@clientconnect.com",
    industry: "Legal",
    source: "Referral",
    netWorth: 120000000,
    monthlyIncome: 15000000,
    businessValue: 800000000,
    expectedDealValue: 100000000,
  },
  {
    id: 4,
    name: "Saul Goodman",
    company: "McGill",
    status: "Converted",
    email: "saul@mcgill.com",
    contacted: "2 days ago",
    owner: "admin@clientconnect.com",
    industry: "Legal",
    source: "Ads",
    netWorth: 500000,
    monthlyIncome: 45000,
    businessValue: 1500000,
    expectedDealValue: 100000,
  },
  {
    id: 5,
    name: "Walter White",
    company: "Heisenberg",
    status: "New",
    email: "walter@heisenberg.com",
    contacted: "2 days ago",
    owner: "admin@clientconnect.com",
    industry: "Pharmaceuticals",
    source: "Direct",
    netWorth: 75000000,
    monthlyIncome: 5000000,
    businessValue: 250000000,
    expectedDealValue: 12000000,
  },
];

function LeadList({ leads: propsLeads, onRefresh, loading: parentLoading, searchKeyword, onSearchChange, isSearching }) {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [localLeads, setLocalLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = getRole();
  const email = getEmail();
  const [statusFilter, setStatusFilter] = useState("All");
  const leads = propsLeads || localLeads;
  const isListLoading = parentLoading !== undefined ? parentLoading : loading;

  useEffect(() => {
    if (!propsLeads && !searchKeyword) {
      fetchLeads();
    }
  }, [propsLeads, searchKeyword]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await leadService.getAllLeads();
      setLocalLeads(data || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const internalRefresh = onRefresh || fetchLeads;

  let visibleLeads = [];

  if (isListLoading && leads.length === 0) {
  } else if (role === "ADMIN") {
    visibleLeads = leads;
  } else if (role === "MANAGER") {
    visibleLeads = leads.filter(
      lead => lead.assignedTo !== "admin@clientconnect.com"
    );
  } else {
    visibleLeads = leads.filter(
      lead => lead.assignedTo === email
    );
  }
  if (statusFilter !== "All") {
    visibleLeads = visibleLeads.filter(lead =>
      (lead.stage || lead.status || "").toUpperCase() === statusFilter.toUpperCase()
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await leadService.deleteLead(id);
        await internalRefresh();
        setOpenMenu(null);
      } catch (err) {
        alert("Failed to delete lead. Please try again.");
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    console.log(`Status change for ${id} to ${newStatus}`);
  };

  const canEdit = true;

  const getStatusBadgeClass = (status) => {
    const s = status ? status.toUpperCase() : "";
    switch (s) {
      case "NEW": return "bg-primary";
      case "CONTACTED": return "bg-info text-dark";
      case "FOLLOW_UP": return "bg-warning text-dark";
      case "CONVERTED": return "bg-success";
      case "LOST": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="container-fluid">
      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h3 className="mb-3 mb-md-0">Leads</h3>
        <div className="w-100 w-md-25 search-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            className="form-control"
            placeholder="Search leads..."
            value={searchKeyword || ""}
            onChange={onSearchChange}
          />
        </div>
      </header>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
        <div className="mb-3 mb-md-0">
          <h2 className="h4">
            {isSearching ? `Search results for "${searchKeyword}"` : "Manage your leads"}
          </h2>
          <p className="text-secondary mb-0">
            {isSearching ? `${visibleLeads.length} matches found.` : "Track and convert potential clients."}
          </p>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="btn-group-custom">
          <button
            className={`btn-custom view ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
            Table View
          </button>
          <button
            className={`btn-custom view ${viewMode === "kanban" ? "active" : ""}`}
            onClick={() => setViewMode("kanban")}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h7v7H3z"></path><path d="M14 3h7v7h-7z"></path><path d="M14 14h7v7h-7z"></path><path d="M3 14h7v7H3z"></path></svg>
            Kanban View
          </button>
        </div>

        {viewMode === "kanban" && (
          <div className="filter-chips-container d-flex flex-wrap gap-2 py-1">
            <button
              onClick={() => setStatusFilter("All")}
              className={`filter-chip ${statusFilter === "All" ? "active" : ""}`}
            >
              All
            </button>
            {LEAD_STATUSES.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`filter-chip ${statusFilter === status ? "active" : ""}`}
              >
                {STAGE_DISPLAY_MAP[status] || status}
              </button>
            ))}
          </div>
        )}
      </div>

      {isListLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">{isSearching ? "Searching leads..." : "Loading leads..."}</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-sm btn-outline-danger ms-3" onClick={internalRefresh}>Retry</button>
        </div>
      ) : viewMode === "table" ? (
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Email</th>
                  <th>Last Contacted</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleLeads.map((lead, index) => (
                  <tr key={lead.id}>
                    <td>
                      <Link to={`/leads/${lead.id}`} className="text-main text-decoration-none fw-bold hover-primary">
                        {lead.name}
                      </Link>
                    </td>
                    <td>{lead.company}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(lead.stage)}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td>{lead.email}</td>
                    <td>{lead.contacted}</td>

                    <td className="text-end position-relative">
                      <button
                        className="btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() =>
                          setOpenMenu(openMenu === lead.id ? null : lead.id)
                        }
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                      </button>

                      {openMenu === lead.id && (
                        <div className={`position-absolute end-0 bg-white text-dark rounded shadow p-2 ${index >= visibleLeads.length - 3 ? "bottom-100 mb-1" : "top-100"}`} style={{ zIndex: 1000, width: "150px" }}>
                          <button
                            className="btn btn-sm btn-light w-100 text-start mb-1"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                          >
                            Details
                          </button>
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-light w-100 text-start mb-1 text-decoration-none"
                          >
                            Email
                          </a>
                          <button
                            className="btn btn-sm btn-light w-100 text-start mb-1"
                            onClick={() => alert(`Calling ${lead.name}...`)}
                          >
                            Call
                          </button>

                          <button
                            className="btn btn-sm btn-danger w-100 text-start"
                            onClick={() => handleDelete(lead.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleLeads.length === 0 && (
            <div className="card-body text-center text-secondary py-5">
              {isSearching ? (
                <>
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-25"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  <h4>No leads found</h4>
                  <p>We couldn't find any leads matching "{searchKeyword}".</p>
                  <button className="btn btn-link" onClick={() => onSearchChange({ target: { value: "" } })}>Clear search</button>
                </>
              ) : "No leads available."}
            </div>
          )}
        </div>
      ) : (
        <KanbanLeads
          leads={visibleLeads}
          onRefresh={internalRefresh}
        />
      )}
    </div>
  );
}

export default LeadList;
