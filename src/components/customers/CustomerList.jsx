import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "../leads/Lead.css";
import "./Customer.css";

function CustomerList() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const role = localStorage.getItem("role") || "Employee";

  const allCustomers = [
    {
      id: 1,
      name: "Saran Manohar",
      company: "MICROSOFT",
      status: "Active",
      email: "perusu@gmail.com",
      joined: "2 months ago",
    },
    {
      id: 2,
      name: "Sukumar Parida",
      company: "META",
      status: "Inactive",
      email: "bot@gmail.com",
      joined: "1 year ago",
    },
    {
      id: 3,
      name: "Thejas",
      company: "ROCKSTAR GAMES",
      status: "Active",
      email: "mallu@gmail.com",
      joined: "6 months ago",
    },
  ];

  const filteredCustomers =
    role === "Admin"
      ? allCustomers
      : role === "Manager"
      ? allCustomers.slice(0, 2)
      : allCustomers.slice(0, 1);

  const [customers, setCustomers] = useState(filteredCustomers);

  const handleDelete = (id) => {
    setCustomers(customers.filter((c) => c.id !== id));
    setOpenMenu(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <header className="topbar">
          <h3>Customers</h3>
          <input
            className="search-top"
            type="text"
            placeholder="Search customers..."
          />
        </header>

        <div className="leads-header">
          <div>
            <h2>Manage your customers</h2>
            <p>View and manage your existing customer relationships.</p>
          </div>
        </div>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.company}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === "Active" ? "qualified" : "new"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.joined}</td>
                  <td className="actions-cell">
                    <span
                      className="dots"
                      onClick={() =>
                        setOpenMenu(openMenu === c.id ? null : c.id)
                      }
                    >
                      ⋮
                    </span>

                    {openMenu === c.id && (
                      <div className="action-menu">
                        <button
                          onClick={() => navigate(`/customers/${c.id}`)}
                        >
                          View Details
                        </button>

                        {role !== "Employee" && (
                          <button
                            className="danger"
                            onClick={() => handleDelete(c.id)}
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

          <p className="table-footer">
            Showing {customers.length} customer(s)
          </p>
        </div>
      </main>
    </div>
  );
}

export default CustomerList;
