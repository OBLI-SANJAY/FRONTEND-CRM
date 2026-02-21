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
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in email and password fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSignup = async () => {
    if (!email || !password || !fullName || !phone || !address) {
      setError("Please fill in all the required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", { email, password, role, fullName, phone, address });
      setSuccess("Account created successfully! You can now sign in.");
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setPhone("");
      setAddress("");
      setStep(1);
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

          {step === 1 ? (
            <>
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

              <button className="login-btn" onClick={handleNext}>
                Next Step →
              </button>
            </>
          ) : (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <label>Phone Number</label>
              <input
                type="text"
                placeholder="+1 234 567 890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label>Address</label>
              <input
                type="text"
                placeholder="123 Main St, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="login-btn"
                  onClick={() => setStep(1)}
                  style={{ backgroundColor: '#ccc', color: '#333' }}
                >
                  ← Back
                </button>
                <button className="login-btn" onClick={handleSignup} disabled={loading}>
                  {loading ? "Signing up..." : "Sign up"}
                </button>
              </div>
            </>
          )}

          <p className="signup" style={{ marginTop: '20px' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
