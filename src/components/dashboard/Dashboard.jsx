import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRole } from "../../utils/auth";
import customerService from "../../services/customerService";
import taskService from "../../services/taskService";
import { showConfirm } from "../../utils/alert";


function Dashboard() {
  const role = getRole() || "EMPLOYEE";

  const handleJoinCall = async () => {
    const confirmed = await showConfirm(
      "You are about to join the Product Demo meeting with TechGiant Inc.",
      "Join Meeting?"
    );
    if (confirmed) {
      window.open("https://zoom.us/test", "_blank");
    }
  };


  const [dynamicStats, setDynamicStats] = useState({
    activeClients: 0,
    pendingTasks: 0,
    totalRevenue: 0,
    loading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [customers, tasks] = await Promise.all([
          customerService.getAllCustomers(),
          taskService.getAllTasks()
        ]);

        const activeClientsCount = (customers || []).filter(c =>
          c.status === "Active" || !c.status
        ).length;

        const pendingTasksCount = (tasks || []).filter(t =>
          t.stage !== "Completed"
        ).length;


        const totalRevenue = (customers || []).reduce((sum, customer) => {
          return sum + (customer.amountPaid || 0);
        }, 0);

        setDynamicStats({
          activeClients: activeClientsCount,
          pendingTasks: pendingTasksCount,
          totalRevenue: totalRevenue,
          loading: false
        });

      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
        setDynamicStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  const statsByRole = {
    ADMIN: {
      revenue: `$${dynamicStats.totalRevenue.toLocaleString()}`,
      revenueTrend: "+20.1% from last month",
      clients: dynamicStats.activeClients.toString(),
      clientsTrend: "+12 new this week",
      tasks: dynamicStats.pendingTasks.toString(),
      tasksTrend: "3 due today",
      conversion: "3.2%",
      conversionTrend: "-0.4% from last week",
    },
    MANAGER: {
      revenue: `$${dynamicStats.totalRevenue.toLocaleString()}`,
      revenueTrend: "+8.3% from last month",
      clients: dynamicStats.activeClients.toString(),
      clientsTrend: "+5 new this week",
      tasks: dynamicStats.pendingTasks.toString(),
      tasksTrend: "2 due today",
      conversion: "2.1%",
      conversionTrend: "-0.2% from last week",
    },
    EMPLOYEE: {
      revenue: `$${dynamicStats.totalRevenue.toLocaleString()}`,
      revenueTrend: "+2.1% from last month",
      clients: dynamicStats.activeClients.toString(),
      clientsTrend: "+1 new this week",
      tasks: dynamicStats.pendingTasks.toString(),
      tasksTrend: "1 due today",
      conversion: "1.2%",
      conversionTrend: "-0.1% from last week",
    },
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-danger';
      case 'MANAGER': return 'bg-warning text-dark';
      default: return 'bg-info';
    }
  };

  const stats = statsByRole[role] || statsByRole["EMPLOYEE"];

  return (
    <div className="container-fluid">

      <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="h2 mb-1 text-main">Dashboard</h1>
          <p className="text-secondary mb-0">Welcome back, <span className="fw-bold text-main">{role}</span>. Here's what's happening today.</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className={`badge ${getRoleBadge(role)} shadow rounded-pill px-4 py-2 fw-bold letter-spacing-1`}>{role} Account</span>
          <button className="btn bg-white text-dark shadow border-0 fw-bold px-4 py-2 rounded-pill d-flex align-items-center highlight-hover">
            <span className="me-2 text-secondary">📅</span> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </button>
        </div>
      </header>


      <div className="row g-4 mb-5">
        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-2 rounded bg-success-subtle text-success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <span className="badge bg-success-subtle text-success">+20.1%</span>
              </div>
              <p className="card-title text-secondary mb-1 small uppercase fw-bold ls-1">Total Revenue</p>
              <h2 className="card-text h1 mb-0 tracking-tight text-main" style={{ color: 'var(--text-main) !important' }}>{stats.revenue}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-2 rounded bg-primary-subtle text-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <span className="badge bg-success-subtle text-success">{stats.clientsTrend}</span>
              </div>
              <p className="card-title text-secondary mb-1 small uppercase fw-bold ls-1">Active Clients</p>
              <h2 className="card-text h1 mb-0 tracking-tight text-main" style={{ color: 'var(--text-main) !important' }}>{stats.clients}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-2 rounded bg-warning-subtle text-warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <span className="badge bg-warning-subtle text-warning">{stats.tasksTrend}</span>
              </div>
              <p className="card-title text-secondary mb-1 small uppercase fw-bold ls-1">Pending Tasks</p>
              <h2 className="card-text h1 mb-0 tracking-tight text-main" style={{ color: 'var(--text-main) !important' }}>{stats.tasks}</h2>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6 col-lg-3">
          <div className="card h-100 p-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-2 rounded bg-danger-subtle text-danger">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                </div>
                <span className="badge bg-danger-subtle text-danger">{stats.conversionTrend}</span>
              </div>
              <p className="card-title text-secondary mb-1 small uppercase fw-bold ls-1">Conversion Rate</p>
              <h2 className="card-text h1 mb-0 tracking-tight text-main" style={{ color: 'var(--text-main) !important' }}>{stats.conversion}</h2>
            </div>
          </div>
        </div>
      </div>


      <div className="mb-5">
        <div className="d-flex align-items-center mb-4">
          <h3 className="h5 mb-0 me-3 fw-bold">Quick Actions</h3>
          <div className="flex-grow-1 border-bottom border-soft"></div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <Link to="/leads" className="text-decoration-none">
              <div className="card h-100 highlight-hover shadow border-0 p-2 tooltip-container">
                <div className="custom-tooltip">View and manage your sales pipeline</div>
                <div className="card-body text-center p-4">
                  <div className="d-inline-flex align-items-center justify-content-center p-3 bg-primary-subtle text-primary rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                  </div>
                  <h4 className="card-title h5">Manage Leads</h4>
                  <p className="card-text text-secondary small">Track prospects and pipeline.</p>
                </div>
              </div>
            </Link>
          </div>

          {(role === "ADMIN" || role === "MANAGER" || role === "EMPLOYEE") && (
            <div className="col-12 col-md-4">
              <Link to="/customers" className="text-decoration-none">
                <div className="card h-100 highlight-hover shadow border-0 p-2 tooltip-container">
                  <div className="custom-tooltip">Access your complete client database</div>
                  <div className="card-body text-center p-4">
                    <div className="d-inline-flex align-items-center justify-content-center p-3 bg-info-subtle text-info rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <h4 className="card-title h5">Customers</h4>
                    <p className="card-text text-secondary small">View client database.</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          <div className="col-12 col-md-4">
            <Link to="/tasks" className="text-decoration-none">
              <div className="card h-100 highlight-hover shadow border-0 p-2 tooltip-container">
                <div className="custom-tooltip">Organize your daily to-dos</div>
                <div className="card-body text-center p-4">
                  <div className="d-inline-flex align-items-center justify-content-center p-3 bg-success-subtle text-success rounded-circle mb-3" style={{ width: '64px', height: '64px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                  </div>
                  <h4 className="card-title h5">My Tasks</h4>
                  <p className="card-text text-secondary small">Manage daily workflow.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="row g-4 align-items-stretch">
        <div className="col-12 col-md-6">
          <div className="card h-100 shadow border-0">
            <div className="card-header border-bottom border-soft py-3">
              <h3 className="h5 mb-0 fw-bold text-main" style={{ color: 'var(--text-main) !important' }}>Recent Activity</h3>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item border-light py-3 opacity-75">
                <span className="badge bg-primary-subtle text-primary me-2 rounded-pill">Email</span> Sent to Sarah Jenkins – Contract follow-up
              </li>
              <li className="list-group-item border-light py-3 opacity-75">
                <span className="badge bg-success-subtle text-success me-2 rounded-pill">Task</span> Review onboarding docs for Meta
              </li>
              <li className="list-group-item border-light py-3 opacity-75">
                <span className="badge bg-info-subtle text-info me-2 rounded-pill">Lead</span> New lead added – Thomas Shelby
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card bg-success text-white border-0 h-100 overflow-hidden position-relative shadow">
            <div className="position-absolute top-0 end-0 p-3 opacity-25">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div className="card-body d-flex flex-column justify-content-between p-4 position-relative z-1">
              <div>
                <p className="small mb-2 fw-bold opacity-75 letter-spacing-2">UPCOMING MEETING</p>
                <h3 className="h4 card-title mb-1">Product Demo</h3>
                <p className="mb-4 opacity-90">TechGiant Inc.</p>
                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className="badge bg-white text-success px-3 py-2">Today, 2:00 PM</span>
                </div>
              </div>
              <button
                className="btn btn-light w-100 fw-bold shadow-sm"
                onClick={handleJoinCall}
              >
                Join Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
