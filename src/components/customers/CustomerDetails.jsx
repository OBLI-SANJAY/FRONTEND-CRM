import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import customerService from "../../services/customerService";
import saranImg from "../../assets/images/saran.jpg";
import Sukuimg from "../../assets/images/sukumar.jpg";
import mallu from "../../assets/images/mallu.jpeg";

function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await customerService.getCustomerById(id);

        const enrichedData = {
          ...data,
          avatar: data.avatar || [saranImg, Sukuimg, mallu][Math.floor(Math.random() * 3)],
          role: data.role || ["CEO", "Manager", "Director"][Math.floor(Math.random() * 3)],
          products: data.products || Math.floor(Math.random() * 20) + 1,
          totalCost: data.totalCost || Math.floor(Math.random() * 500000) + 10000,
          paidAmount: data.paidAmount || Math.floor(Math.random() * 400000),
          address: data.address || "123 Business Rd, Tech City",

          ownerName: data.ownerName || ["Alice Smith", "Bob Johnson", "Charlie Brown"][Math.floor(Math.random() * 3)],
          ownerRole: data.ownerRole || ["Sales Manager", "Account Executive", "Customer Success"][Math.floor(Math.random() * 3)]
        };

        setCustomer(enrichedData);
      } catch (err) {
        console.error("Failed to fetch customer details:", err);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleEmailClick = () => {
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${customer.email}`, "_blank");
  };

  if (!customer) {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center h-100 text-white">
        <h2>Loading or Customer not found...</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/customers")}>
          Back to Customers
        </button>
      </div>
    );
  }

  const remainingDue = customer.totalCost - customer.paidAmount;
  const paymentStatus = remainingDue > 0 ? "Pending Payment" : "Paid";
  const statusBadgeClass = remainingDue > 0 ? "bg-warning text-dark" : "bg-success";

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link to="/customers" className="text-muted">Customers</Link>
              </li>
              <li className="breadcrumb-item active text-white" aria-current="page">
                {customer.name}
              </li>
            </ol>
          </nav>
          <h1 className="h2 mb-0">Customer Details</h1>
        </div>

        <button className="btn btn-outline-secondary" onClick={() => navigate("/customers")}>
          ← Back
        </button>
      </div>

      <div className="row g-4">

        <div className="col-12 col-lg-4">
          <div className="card h-100">
            <div className="card-body text-center p-4">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="rounded-circle mb-3 border border-secondary"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <h3 className="h4 mb-1">{customer.name}</h3>
              <p className="text-primary mb-4">{customer.role}</p>

              <div className="text-start mt-4">
                <hr className="border-secondary my-3" />
                <div className="mb-3">
                  <label className="text-muted small">Email</label>
                  <p className="mb-0">
                    <span
                      className="text-primary cursor-pointer text-decoration-underline"
                      onClick={handleEmailClick}
                      style={{ cursor: "pointer" }}
                    >
                      {customer.email}
                    </span>
                  </p>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Phone</label>
                  <p className="mb-0">{customer.phone}</p>
                </div>
                <div className="mb-3">
                  <label className="text-muted small">Company</label>
                  <p className="mb-0">{customer.company}</p>
                </div>
                <div>
                  <label className="text-muted small">Address</label>
                  <p className="mb-0">{customer.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card h-100">
            <div className="card-header border-secondary">
              <h4 className="h5 mb-0">Billing & Payment Information</h4>
            </div>
            <div className="card-body p-4">
              <div className="row g-4 mb-5">

                <div className="col-md-6">
                  <div className="p-3 rounded bg-sidebar border border-secondary h-100">
                    <p className="text-muted small mb-1">Total Products</p>
                    <h3 className="display-6 fw-bold mb-0">{customer.products}</h3>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded bg-sidebar border border-secondary h-100 d-flex flex-column justify-content-center">
                    <p className="text-muted small mb-1">Payment Status</p>
                    <div>
                      <span className={`badge ${statusBadgeClass} fs-6`}>
                        {paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Detailed Breakdown</h5>
              <div className="table-responsive">
                <table className="table table-dark table-borderless align-middle mb-0">
                  <tbody>
                    <tr>
                      <td className="text-muted py-3">Total Cost</td>
                      <td className="text-end py-3 fs-5">₹{customer.totalCost.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="text-muted py-3">Amount Paid</td>
                      <td className="text-end py-3 fs-5 text-success">
                        - ₹{customer.paidAmount.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-top border-secondary">
                      <td className="py-3 fw-bold">Remaining Due</td>
                      <td className={`text-end py-3 fw-bold fs-4 ${remainingDue > 0 ? "text-danger" : "text-success"}`}>
                        ₹{remainingDue.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
