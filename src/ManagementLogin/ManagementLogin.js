
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ManagementLogin.css";

const MANAGEMENT_USER = "admin";
const MANAGEMENT_PASSWORD = "admin123";

function ManagementLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/appointment";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter Login ID and Password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        userId.trim() === MANAGEMENT_USER &&
        password === MANAGEMENT_PASSWORD
      ) {
        localStorage.setItem(
          "clinic_management_auth",
          JSON.stringify({
            authenticated: true,
            userId: userId.trim(),
            loginTime: new Date().toISOString(),
          })
        );

        navigate(from, { replace: true });
      } else {
        setError("Invalid Login ID or Password.");
      }

      setLoading(false);
    }, 400);
  };

  return (
    <div className="management-login-page">
      <div className="management-login-card">

        <div className="management-login-logo">
          <div className="management-logo-icon">P</div>
          <div>
            <h1>PUNAR AXIS</h1>
            <span>THERAPY</span>
          </div>
        </div>

        <div className="management-login-header">
          <div className="lock-icon">🔐</div>
          <h2>Management Login</h2>
          <p>
            Authorized clinic staff only. Please login to access
            management modules.
          </p>
        </div>

        <form onSubmit={handleLogin} className="management-login-form">

          <div className="login-field">
            <label>Login ID</label>
            <div className="login-input-wrap">
              <span>👤</span>
              <input
                type="text"
                placeholder="Enter Login ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="login-input-wrap">
              <span>🔑</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="management-login-error">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="management-login-btn"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login to Management"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <div className="management-login-footer">
          <span>🔒</span>
          <p>Authorized access only</p>
        </div>

        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Website
        </button>

      </div>
    </div>
  );
}

export default ManagementLogin;

