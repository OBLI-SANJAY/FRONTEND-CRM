import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";
import { showSuccess, showError } from "../../utils/alert";

function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    role: "",
    status: "Active",
    priority: "Medium",
    email: "",
    phone: "",
    company: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomerById(id);
        if (data) {
          setForm({
            ...data,
            role: data.role || "CEO", // Fallback for data enrichment if needed
          });
        }
      } catch (err) {
        console.error("Failed to fetch customer:", err);
        showError("Failed to load customer data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await customerService.updateCustomer(id, form);
      showSuccess("Customer updated successfully!");
      navigate(`/customers/${id}`);
    } catch (err) {
      console.error("Failed to update customer:", err);
      showError("Update failed: " + (err.response?.data?.message || "Server error"));
    }
  };

  if (loading) {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center h-100 text-white">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2>Loading customer data...</h2>
      </div>
    );
  }

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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

          <h4 className="h5 mt-4 mb-3 border-bottom border-secondary pb-2">Financial Information</h4>

          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">totalProduct</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                name="totalProduct"
                value={form.totalProduct || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Total Cost (₹)</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                name="totalCost"
                value={form.totalCost || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 mb-3 mb-md-0">
              <label className="form-label">Amount Paid (₹)</label>
              <input
                type="number"
                className="form-control bg-dark text-white border-secondary"
                name="amountPaid"
                value={form.amountPaid || ""}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Remaining Due (₹)</label>
              <input
                className="form-control bg-dark text-white border-secondary"
                value={(form.totalCost - form.amountPaid || 0).toLocaleString()}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label text-muted small">Current Payment Status: </label>
            <span className={`ms-2 badge ${form.totalCost - form.amountPaid > 0 ? "bg-warning text-dark" : "bg-success"}`}>
              {form.totalCost - form.amountPaid > 0 ? "Pending Payment" : "Paid"}
            </span>
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
              onClick={handleSave}
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
