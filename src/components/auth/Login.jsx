import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuthData } from "../../utils/auth";
import api from "../../services/api";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password.trim()) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    setGeneralError("");
    if (!validate()) return;

    setLoading(true);
    try {
      const token = await api.post("/auth/login", { email, password });

      const isValidJWT = typeof token === "string" && token.split(".").length === 3;

      if (isValidJWT) {
        setAuthData(token);

        // Fetch current user details immediately after login
        try {
          // Dynamic import to avoid circular dependencies if any
          const { default: userService } = await import("../../services/userService");
          const user = await userService.getCurrentUser();
          localStorage.setItem("user", JSON.stringify(user));

          if (!user.profileCompleted && (user.role === "MANAGER" || user.role === "EMPLOYEE")) {
            navigate("/complete-profile");
          } else {
            navigate("/dashboard");
          }
        } catch (profileErr) {
          console.error("Failed to fetch user profile", profileErr);
          navigate("/dashboard"); // Fallback
        }
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Invalid email or password";

      setGeneralError(backendMessage);
    } finally {
      setLoading(false);
    }
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

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="user@clientconnect.com"
              className={fieldErrors.email ? "input-error" : ""}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
              }}
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className={fieldErrors.password ? "input-error" : ""}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
              }}
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          {generalError && <div className="error-message text-danger mb-3">{generalError}</div>}

          <label className="remember">
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </label>

          <button className="login-btn" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Log in →"}
          </button>



          <p className="signup">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
