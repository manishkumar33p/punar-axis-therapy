import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInManagement } from "../auth";
import { isFirebaseConfigured } from "../firebase";
import "./ManagementLogin.css";

function ManagementLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/management-dashboard";

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!userId.trim() || !password.trim()) {
      setError("Please enter Login ID and Password.");
      return;
    }

    setLoading(true);

    try {
      await signInManagement(userId.trim(), password);
      navigate(from, { replace: true });
    } catch (loginError) {
      const message = String(loginError?.message || "");
      setError(
        message.includes("auth/invalid-credential") ||
          message.includes("auth/wrong-password") ||
          message.includes("auth/user-not-found")
          ? "Invalid Login ID or Password."
          : message || "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
          <p>Secure access to clinic management modules and patient records.</p>
        </div>

        <form onSubmit={handleLogin} className="management-login-form">
          <div className="login-field">
            <label>{isFirebaseConfigured ? "Admin Email" : "Login ID"}</label>
            <div className="login-input-wrap">
              <span>👤</span>
              <input
                type={isFirebaseConfigured ? "email" : "text"}
                placeholder={isFirebaseConfigured ? "admin@example.com" : "Enter Login ID"}
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
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
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="management-login-error">⚠️ {error}</div>}

          <button type="submit" className="management-login-btn" disabled={loading}>
            {loading ? "Signing In..." : "Login to Management"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <div className="management-login-footer">
          <span>🔒</span>
          <p>
            {isFirebaseConfigured
              ? "Protected by Firebase Authentication"
              : "Local fallback mode — configure Firebase for production access"}
          </p>
        </div>

        <button className="back-home-btn" onClick={() => navigate("/")}>← Back to Website</button>
      </div>
    </div>
  );
}

export default ManagementLogin;
