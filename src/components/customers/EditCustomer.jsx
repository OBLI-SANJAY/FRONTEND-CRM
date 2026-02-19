import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center h-100 text-white">
        <h2>Customer not found</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/customers")}>
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
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="h3 mb-0">Edit Customer</h3>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="card text-white border-secondary p-4 mx-auto shadow-lg" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div className="card-body p-4">
          <h4 className="h5 mb-3 border-bottom border-secondary pb-2">Basic Information</h4>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control bg-dark text-white border-secondary"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input
              className="form-control bg-dark text-white border-secondary"
              name="role"
              value={form.role}
              onChange={handleChange}
            />
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">Status</label>
              <select
                className="form-select bg-dark text-white border-secondary"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label d-block">Priority</label>
              <div className="btn-group w-100" role="group">
                {["Low", "Medium", "High"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`btn ${form.priority === p ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() =>
                      setForm({ ...form, priority: p })
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <h4 className="h5 mt-4 mb-3 border-bottom border-secondary pb-2">Contact Information</h4>

          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">Email</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">Company</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                name="company"
                value={form.company}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(`/customers/${id}`)}
            >
              Cancel
            </button>
            <button
              className="edit-btn px-5"
              onClick={() => navigate(`/customers/${id}`)}
            >
              ✔ Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditCustomer;
