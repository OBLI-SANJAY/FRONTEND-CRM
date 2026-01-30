import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Customer.css";

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customers = [
    {
      id: 1,
      name: "Saran Manohar",
      role: "Marketing Coordinator",
      status: "Active",
      priority: "High",
      email: "perusu@gmail.com",
      phone: "+91 12345678",
      company: "GOOGLE",
      location: "San Francisco, CA",
    },
    {
      id: 2,
      name: "Sukumar Parida",
      role: "Business Consultant",
      status: "Inactive",
      priority: "Medium",
      email: "bot@gmail.com",
      phone: "+91 1234567890",
      company: "META",
      location: "New York, NY",
    },
    {
      id: 3,
      name: "Thejas",
      role: "Legal Secretary",
      status: "Active",
      priority: "Low",
      email: "mallu@gmail.com",
      phone: "+91 123456789",
      company: "ROCKSTAR GAMES",
      location: "Chicago, IL",
    },
  ];

  const selectedCustomer = customers.find(
    (c) => c.id === Number(id)
  );

  const [form, setForm] = useState(
    selectedCustomer || {}
  );

  if (!selectedCustomer) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Customer not found</h2>
        <button onClick={() => navigate("/customers")}>
          Back to Customers
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="edit-wrapper">
      <div className="edit-top">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ←
        </button>
        <h3>Edit Customer</h3>
        <button
          className="cancel-btn"
          onClick={() => navigate(`/customers/${id}`)}
        >
          Cancel
        </button>
      </div>

      <div className="edit-form">
        <h4>Basic Information</h4>

        <label>Full Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Job Title</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <label>Priority</label>
        <div className="priority-row">
          {["Low", "Medium", "High"].map((p) => (
            <button
              key={p}
              type="button"
              className={form.priority === p ? "active" : ""}
              onClick={() =>
                setForm({ ...form, priority: p })
              }
            >
              {p}
            </button>
          ))}
        </div>

        <h4>Contact Information</h4>

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <label>Company</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
        />

        <label>Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        />
      </div>

      <button
        className="save-btn"
        style={{ display: 'block', margin: '30px auto', width: '300px' }}
        onClick={() => navigate(`/customers/${id}`)}
      >
        ✔ Save Changes
      </button>
    </div>
  );
}

export default EditCustomer;
