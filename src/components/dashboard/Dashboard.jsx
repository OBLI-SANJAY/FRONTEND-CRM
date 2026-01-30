import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const role = localStorage.getItem("role") || "Employee";

  const statsByRole = {
    Admin: {
      revenue: "$45,231.89",
      revenueTrend: "+20.1% from last month",
      clients: "573",
      clientsTrend: "+12 new this week",
      tasks: "12",
      tasksTrend: "3 due today",
      conversion: "3.2%",
      conversionTrend: "-0.4% from last week",
    },
    Manager: {
      revenue: "$18,450.20",
      revenueTrend: "+8.3% from last month",
      clients: "214",
      clientsTrend: "+5 new this week",
      tasks: "7",
      tasksTrend: "2 due today",
      conversion: "2.1%",
      conversionTrend: "-0.2% from last week",
    },
    Employee: {
      revenue: "$1,120.00",
      revenueTrend: "+2.1% from last month",
      clients: "68",
      clientsTrend: "+1 new this week",
      tasks: "3",
      tasksTrend: "1 due today",
      conversion: "1.2%",
      conversionTrend: "-0.1% from last week",
    },
  };

  const stats = statsByRole[role];

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <header className="topbar">
          <h3>Dashboard Overview</h3>
          <input
            type="text"
            placeholder="Search clients..."
            className="search-input"
          />
        </header>

        <div className="welcome-section">
          <h1 className="welcome-title">Welcome back, Sanjay 👋</h1>
          <p className="welcome-subtitle">
            Here is what is happening with your clients today.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Revenue</p>
            <h2>{stats.revenue}</h2>
            <span className="positive">{stats.revenueTrend}</span>
          </div>

          <div className="stat-card">
            <p>Active Clients</p>
            <h2>{stats.clients}</h2>
            <span className="positive">{stats.clientsTrend}</span>
          </div>

          <div className="stat-card">
            <p>Pending Tasks</p>
            <h2>{stats.tasks}</h2>
            <span className="warning">{stats.tasksTrend}</span>
          </div>

          <div className="stat-card">
            <p>Conversion Rate</p>
            <h2>{stats.conversion}</h2>
            <span className="negative">{stats.conversionTrend}</span>
          </div>
        </div>

        <div className="section-header">
          <h3>Quick Actions</h3>
          <div className="divider"></div>
        </div>

        <div className="actions-grid">
          <Link to="/leads" className="action-link">
            <div className="action-card">
              <div className="action-icon">📋</div>
              <h4>Manage Leads</h4>
              <p>View pending leads.</p>
            </div>
          </Link>

          {(role === "Admin" || role === "Manager") && (
            <Link to="/customers" className="action-link">
              <div className="action-card">
                <div className="action-icon">👥</div>
                <h4>Customers</h4>
                <p>Customer database.</p>
              </div>
            </Link>
          )}

          <Link to="/tasks" className="action-link">
            <div className="action-card">
              <div className="action-icon">✅</div>
              <h4>My Tasks</h4>
              <p>Assigned tasks.</p>
            </div>
          </Link>
        </div>

        <div className="bottom-section">
          <div className="recent-activity">
            <h3>Recent Activity</h3>
            <ul>
              <li>Email sent to Sarah Connor</li>
              <li>Task completed – Review onboarding docs</li>
              <li>New lead added – John Wick</li>
            </ul>
          </div>

          <div className="meeting-card">
            <p className="meeting-time">TODAY, 2:00 PM</p>
            <h3>Product Demo with TechGiant Inc.</h3>
            <button className="join-call-btn">Join Call</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
