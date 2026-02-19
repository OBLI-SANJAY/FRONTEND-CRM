import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./auth.css";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", { email, password, role });
      setSuccess("Account created successfully! You can now sign in.");
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Registration failed";

      setError(backendMessage);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="left-panel">
        <div className="branding">
          <div className="logo"></div>

          <h1>
            Manage Your <br />
            Relationships Smarter
          </h1>

          <p>
            Join thousands of businesses using ClientConnect
            to streamline their sales pipeline and nurture
            customer relationships.
          </p>

          <div className="rating">
            ⭐⭐⭐⭐⭐ Trusted by top teams
          </div>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <h2>Create Account</h2>
          <p className="subtitle">
            Please enter your details to sign in.
          </p>

          {error && <div className="error-message text-danger mb-3">{error}</div>}
          {success && (
            <div className="alert alert-success mb-3" role="alert">
              {success} <Link to="/login" className="alert-link">Sign in here</Link>
            </div>
          )}

          <label>Email Address</label>
          <input
            type="email"
            placeholder="user@clientconnect.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          <label>Password</label>
          <input
            type="password"
            placeholder="Create your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label className="remember">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </label>

          <button className="login-btn" onClick={handleSignup} disabled={loading}>
            {loading ? "Signing up..." : "Sign up →"}
          </button>



          <p className="signup">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
