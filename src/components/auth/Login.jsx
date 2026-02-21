import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setAuthData } from "../../utils/auth";
import api from "../../services/api";
import { showError } from "../../utils/alert";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = "Email is required";
    if (!password.trim()) errors.password = "Password is required";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const responseData = await api.post("/auth/login", { email, password });


      console.log("Login response.data:", responseData);


      let rawToken = null;
      if (typeof responseData === "string") {
        rawToken = responseData;
      } else if (responseData && typeof responseData === "object" && typeof responseData.token === "string") {
        rawToken = responseData.token;
      }

      const isValidJWT =
        typeof rawToken === "string" && rawToken.split(".").length === 3;

      if (isValidJWT) {
        setAuthData(rawToken);


        try {
          const { default: userService } = await import("../../services/userService");
          const user = await userService.getCurrentUser();
          console.log("Current user:", user);
          localStorage.setItem("user", JSON.stringify(user));

          if (
            !user.profileCompleted &&
            (user.role === "MANAGER" || user.role === "EMPLOYEE")
          ) {
            navigate("/complete-profile");
          } else {
            navigate("/dashboard");
          }
        } catch (profileErr) {
          console.error("Failed to fetch user profile", profileErr);
          navigate("/dashboard");
        }
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err) {

      let backendMessage = "Invalid email or password";

      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === "string") {
          backendMessage = d;
        } else if (d && typeof d === "object" && typeof d.message === "string") {
          backendMessage = d.message;
        }
      } else if (err.message && typeof err.message === "string") {
        backendMessage = err.message;
      }

      showError(backendMessage);
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
