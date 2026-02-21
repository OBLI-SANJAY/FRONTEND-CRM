import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import leadService from "../../services/leadService";
import { showCalling } from "../../utils/alert";

function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      setIsLoading(true);
      const data = await leadService.getLeadById(id);
      setLead(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch lead details.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailClick = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${lead.email}`, "_blank");
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };


  const getValueBadge = (netWorth) => {
    if (netWorth >= 10000000) {
      return <span className="badge bg-success">High Value Lead</span>;
    } else if (netWorth >= 2500000) {
      return <span className="badge bg-warning text-dark">Medium Value Lead</span>;
    } else {
      return <span className="badge bg-secondary">Low Value Lead</span>;
    }
  };

  const getStatusClass = (status) => {
    const s = status ? status.toUpperCase() : "";
    switch (s) {
      case "NEW": return "bg-primary";
      case "CONTACTED": return "bg-info text-dark";
      case "FOLLOW_UP": return "bg-warning text-dark";
      case "QUALIFIED": return "bg-success";
      case "WON": return "bg-success";
      case "LOST": return "bg-danger";
      default: return "bg-secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="container-fluid d-flex justify-content-center align-items-center h-100">
        <div className="text-primary h4">Loading lead details...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container-fluid text-center mt-5">
        <h2 className="text-primary">Lead Not Found</h2>
        <p className="text-secondary">The lead you are looking for does not exist or has been removed.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/leads")}>
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/leads" className="text-decoration-none text-secondary">Leads</Link>
            </li>
            <li className="breadcrumb-item active text-white" aria-current="page">
              {lead.name}
            </li>
          </ol>
        </nav>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate("/leads")}>
          ← Back
        </button>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 card bg-dark border-secondary p-4">
        <div>
          <h1 className="h3 mb-1 text-white">{lead.name}</h1>
          <div className="d-flex gap-2 align-items-center mt-2">
            <span className={`badge ${getStatusClass(lead.stage)}`}>{lead.stage}</span>
            <span className={`badge ${lead.priority === 'HOT' ? 'bg-danger' : lead.priority === 'WARM' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
              {lead.priority || 'NORMAL'} Priority
            </span>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button onClick={handleEmailClick} className="btn btn-primary">Email</button>
          <button className="btn btn-outline-light" onClick={() => showCalling(lead.name)}>Call</button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card h-100 bg-dark border-secondary">
            <div className="card-header border-secondary bg-transparent">
              <h5 className="mb-0 text-white">Personal Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small d-block">Full Name</label>
                  <span className="fw-medium text-white">{lead.name}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small d-block">Email Address</label>
                  <span className="fw-medium text-white">{lead.email}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small d-block">Phone Number</label>
                  <span className="fw-medium text-white">{lead.phone}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small d-block">Company</label>
                  <span className="fw-medium text-white">{lead.company}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card h-100 bg-dark border-secondary">
            <div className="card-header border-secondary bg-transparent">
              <h5 className="mb-0 text-white">Assignment Details</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="text-muted small d-block">Assigned To</label>
                  <span className="fw-medium text-white">{lead.assignedTo || "Unassigned"}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small d-block">Assigned By</label>
                  <span className="fw-medium text-white">{lead.assignedBy || "System"}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small d-block">Role</label>
                  <span className="fw-medium text-white">{lead.assignedRole || "N/A"}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-muted small d-block">Created At</label>
                  <span className="fw-medium text-white">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-dark border-secondary">
            <div className="card-body">
              <h6 className="text-muted text-uppercase small mb-3">System Notes</h6>
              <p className="mb-0 text-secondary">
                {lead.notes || "No additional notes for this lead."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;
