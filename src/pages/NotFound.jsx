import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-dark text-white">
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="text-secondary mb-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="btn btn-success rounded-pill px-4">
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;
