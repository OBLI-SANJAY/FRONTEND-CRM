import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import "../leads/Lead.css";
import "./Customer.css";

function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const customers = [
    {
      id: 1,
      name: "Saran Manohar",
      role: "Marketing Coordinator",
      email: "perusu@gmail.com",
      phone: "+91 12345678",
      company: "GOOGLE",
      location: "San Francisco, CA",
      avatar: "https://i.pravatar.cc/150?img=33",
      status: "Active",

      orders: {
        totalOrders: 12,
        totalValue: 450000,
        deliveredValue: 380000,
        paidAmount: 350000,
      },
    },
    {
      id: 2,
      name: "Sukumar Parida",
      role: "Business Consultant",
      email: "bot@gmail.com",
      phone: "+91 1234567890",
      company: "META",
      location: "New York, NY",
      avatar: "https://i.pravatar.cc/150?img=11",
      status: "Inactive",

      orders: {
        totalOrders: 18,
        totalValue: 820000,
        deliveredValue: 820000,
        paidAmount: 780000,
      },
    },
    {
      id: 3,
      name: "Thejas",
      role: "Legal Secretary",
      email: "mallu@gmail.com",
      phone: "+91 123456789",
      company: "ROCKSTAR GAMES",
      location: "Chicago, IL",
      avatar: "https://i.pravatar.cc/150?img=14",
      status: "Active",

      orders: {
        totalOrders: 9,
        totalValue: 310000,
        deliveredValue: 270000,
        paidAmount: 210000,
      },
    },
  ];

  const customer = customers.find((c) => c.id === Number(id));

  if (!customer) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Customer not found</h2>
        <button onClick={() => navigate("/customers")}>
          Back to Customers
        </button>
      </div>
    );
  }

  const outstanding =
    customer.orders.totalValue - customer.orders.paidAmount;

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-content">
        <div className="page-top">
          <div className="breadcrumb">
            Customers <span>›</span> {customer.name}
          </div>

          <div className="page-actions">
            <button
              className="back-btn"
              onClick={() => navigate("/customers")}
            >
              ← Back
            </button>

            <Link to={`/customers/${customer.id}/edit`}>
              <button className="edit-btn">✎ Edit Customer</button>
            </Link>
          </div>
        </div>

        <h1 className="page-title">Customer Details</h1>
        <p className="subtitle">
          Overview of customer profile, orders, and payments
        </p>

        <div className="details-grid">
          <div className="profile-card">
            <img
              src={customer.avatar}
              alt={customer.name}
              className="profile-img"
            />

            <h3>{customer.name}</h3>
            <p className="role">{customer.role}</p>

            <div className="badges">
              <span className="badge">Customer</span>
              <span
                className={`badge ${
                  customer.status === "Active" ? "active" : ""
                }`}
              >
                {customer.status}
              </span>
            </div>
          </div>

          <div className="card">
            <h4>Contact Information</h4>

            <div className="info-item">
              <label>Email</label>
              <p>{customer.email}</p>
            </div>

            <div className="info-item">
              <label>Phone</label>
              <p>{customer.phone}</p>
            </div>

            <div className="info-item">
              <label>Company</label>
              <p>{customer.company}</p>
            </div>

            <div className="info-item">
              <label>Location</label>
              <p>{customer.location}</p>
            </div>
          </div>

          <div className="billing-card">
            <h4>Orders & Payments Summary</h4>

            <div className="billing-grid">
              <div className="billing-item">
                <p>Total Orders</p>
                <h3>{customer.orders.totalOrders}</h3>
              </div>

              <div className="billing-item">
                <p>Total Order Value</p>
                <h3>₹{customer.orders.totalValue.toLocaleString()}</h3>
              </div>

              <div className="billing-item">
                <p>Delivered Value</p>
                <h3>₹{customer.orders.deliveredValue.toLocaleString()}</h3>
              </div>

              <div className="billing-item paid">
                <p>Amount Paid</p>
                <h3>₹{customer.orders.paidAmount.toLocaleString()}</h3>
              </div>

              <div className="billing-item due">
                <p>Outstanding Due</p>
                <h3>₹{outstanding.toLocaleString()}</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerDetails;
