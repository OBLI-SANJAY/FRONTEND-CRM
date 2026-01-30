import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="forgot-wrapper">
      <div className="forgot-center">
        <div className="brand-center">
          <span className="brand-dot"></span>
          <h2>ClientConnect</h2>
        </div>

        <h1 className="title">Reset Your Password</h1>

        <p className="subtitle">
          Enter your email address and we'll send you instructions
          to reset your password securely.
        </p>

        <div className="forgot-card">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@clientconnect.com"
            />
          </div>

          <button
            className="reset-btn"
            onClick={() => navigate("/login")}
          >
            Send Reset Link →
          </button>

          <p className="footer-text">
            Remember your password?{" "}
            <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
