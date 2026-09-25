
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientLogin.css";

function PatientLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/patient-dashboard";

  const getPatients = () => {
    try {
      const data = localStorage.getItem("clinic_patients");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  };

  const handleLogin = (event) => {
    event.preventDefault();

    setError("");

    if (!loginValue.trim() || !password.trim()) {
      setError("Please enter Patient ID / Mobile Number and Password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const patients = getPatients();

      const enteredLogin = loginValue.trim().toLowerCase();

      const patient = patients.find((item) => {
        const patientId = String(item.patientId || item.id || "").toLowerCase();
        const mobile = String(item.mobile || "").replace(/\D/g, "");
        const enteredMobile = enteredLogin.replace(/\D/g, "");

        return (
          patientId === enteredLogin ||
          (mobile && mobile === enteredMobile)
        );
      });

      if (!patient) {
        setError("Patient record not found.");
        setLoading(false);
        return;
      }

      /*
        Password priority:
        1. patient.password
        2. patient.loginPassword
        3. default 123456 for existing records
      */
      const patientPassword =
        patient.password ||
        patient.loginPassword ||
        "123456";

      if (password !== String(patientPassword)) {
        setError("Incorrect password. Please try again.");
        setLoading(false);
        return;
      }

      const session = {
        authenticated: true,
        patientId: patient.patientId || patient.id,
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem(
        "clinic_patient_auth",
        JSON.stringify(session)
      );

      navigate(from, { replace: true });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="patient-login-page">

      <div className="patient-login-left">
        <div className="patient-login-brand">
          <div className="patient-brand-icon">P</div>

          <div>
            <h1>PUNAR AXIS</h1>
            <span>THERAPY</span>
          </div>
        </div>

        <div className="patient-login-hero">
          <span className="patient-small-label">
            PATIENT PORTAL
          </span>

          <h2>
            Your complete
            <br />
            <strong>health journey</strong>
            <br />
            in one place.
          </h2>

          <p>
            View your appointments, treatment history, progress,
            bills, reports and future treatment plan from your
            personal patient dashboard.
          </p>

          <div className="patient-login-features">
            <div>
              <span>✓</span>
              <p>Appointments & schedule</p>
            </div>

            <div>
              <span>✓</span>
              <p>Treatment & medical history</p>
            </div>

            <div>
              <span>✓</span>
              <p>Bills, reports & documents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="patient-login-right">

        <div className="patient-login-card">

          <button
            type="button"
            className="patient-back-home"
            onClick={() => navigate("/")}
          >
            ← Back to website
          </button>

          <div className="patient-login-icon">
            👤
          </div>

          <div className="patient-login-heading">
            <span>WELCOME BACK</span>
            <h2>Patient Login</h2>
            <p>
              Login to access your personal health dashboard.
            </p>
          </div>

          <form
            className="patient-login-form"
            onSubmit={handleLogin}
          >

            <div className="patient-login-field">
              <label>Patient ID / Mobile Number</label>

              <div className="patient-login-input">
                <span>👤</span>

                <input
                  type="text"
                  placeholder="PAT-0001 or mobile number"
                  value={loginValue}
                  onChange={(event) =>
                    setLoginValue(event.target.value)
                  }
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="patient-login-field">
              <label>Password</label>

              <div className="patient-login-input">
                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="patient-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="patient-login-error">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="patient-login-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Login to Patient Portal"}

              {!loading && <span>→</span>}
            </button>

          </form>

          <div className="patient-login-help">
            <div>🔐</div>

            <div>
              <strong>Patient access</strong>
              <p>
                Use the Patient ID provided by the clinic.
                Existing patients without a password can use
                the temporary password <b>123456</b>.
              </p>
            </div>
          </div>

          <div className="patient-login-secure">
            🔒 Your patient portal is for authorized access only.
          </div>

        </div>

      </div>

    </div>
  );
}

export default PatientLogin;

