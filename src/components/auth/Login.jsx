import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuthData, getRoleFromEmail } from "../../utils/auth";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    const role = getRoleFromEmail(email);
    setAuthData(role, email);
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="left-panel">
        <div className="branding">
          <div className="logo"></div>
          <h1>
            Manage Your <br /> Relationships Smarter
          </h1>
          <p>
            Join thousands of businesses using ClientConnect to streamline
            their sales pipeline and nurture customer relationships.
          </p>
          <div className="rating">⭐⭐⭐⭐⭐ Trusted by top teams</div>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-box">
          <h2>Welcome back</h2>
          <p className="subtitle">Please enter your details to sign in.</p>

          <label>Email Address</label>
          <input
            type="email"
            placeholder="user@clientconnect.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input type="password" placeholder="Enter your password" />

          <label className="remember">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </label>

          <button className="login-btn" onClick={handleLogin}>
            Log in →
          </button>

          <div className="divider">Or continue with</div>

          <div className="social-login">
            <button>Google</button>
            <button>Apple</button>
          </div>

          <p className="signup">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
