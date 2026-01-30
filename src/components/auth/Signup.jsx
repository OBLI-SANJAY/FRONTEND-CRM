import React from "react";
import { Link } from "react-router-dom";
import "./auth.css";

function Signup() {
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

          <label>Email Address</label>
          <input type="email" placeholder="user@clientconnect.com" />

          <label>Password</label>
          <input type="password" placeholder="Create your password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" />

          <label className="remember">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </label>

          <Link to="/login">
            <button className="login-btn"> Sign up → </button>
          </Link>

          <div className="divider">Or continue with</div>

          <div className="social-login">
            <button>Google</button>
            <button>Apple</button>
          </div>

          <p className="signup">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
