import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInPatient } from "../auth";

function PatientLogin() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("PAT-0002");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePatientIdChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .trimStart();

    setPatientId(value);

    if (error) {
      setError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, "")
      .slice(0, 4);

    setPassword(value);

    if (error) {
      setError("");
    }
  };

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    setError("");

    const cleanPatientId = patientId
      .trim()
      .toUpperCase();

    const cleanPassword = password
      .replace(/\D/g, "");

    if (!cleanPatientId) {
      setError("Please enter Patient ID.");
      return;
    }

    if (!cleanPatientId.startsWith("PAT-")) {
      setError(
        "Invalid Patient ID. Example: PAT-0002."
      );
      return;
    }

    if (!cleanPassword) {
      setError("Please enter password.");
      return;
    }

    if (cleanPassword.length !== 4) {
      setError(
        "Password must be the last 4 digits of your registered mobile number."
      );
      return;
    }

    try {
      setLoading(true);

      console.log("PATIENT LOGIN STARTED");

      const session = await signInPatient(
        cleanPatientId,
        cleanPassword
      );

      console.log(
        "PATIENT LOGIN RESPONSE:",
        session
      );

      if (
        session &&
        session.loggedIn === true &&
        session.patient &&
        session.patient.patientId
      ) {
        console.log(
          "PATIENT SESSION SAVED:",
          localStorage.getItem(
            "patientSession"
          )
        );

        console.log(
          "NAVIGATING TO PATIENT DASHBOARD"
        );

        navigate(
          "/patient-dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      setError(
        "Login failed. Please try again."
      );

    } catch (err) {
      console.error(
        "PATIENT LOGIN ERROR:",
        err
      );

      setError(
        err?.message ||
        "Incorrect Patient ID or password."
      );

    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <div style={styles.header}>

          <div style={styles.icon}>
            🏥
          </div>

          <h2 style={styles.title}>
            Patient Login
          </h2>

          <p style={styles.subtitle}>
            Access your patient portal
          </p>

        </div>

        <div style={styles.form}>

          {/* PATIENT ID */}

          <div style={styles.field}>

            <label style={styles.label}>
              Patient ID
            </label>

            <input
              type="text"
              value={patientId}
              onChange={handlePatientIdChange}
              onKeyDown={handleKeyDown}
              placeholder="PAT-0002"
              autoComplete="username"
              disabled={loading}
              style={styles.input}
            />

          </div>


          {/* PASSWORD */}

          <div style={styles.field}>

            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyDown={handleKeyDown}
              placeholder="Last 4 digits of mobile"
              inputMode="numeric"
              maxLength={4}
              autoComplete="current-password"
              disabled={loading}
              style={styles.input}
            />

            <small style={styles.helpText}>
              Use the last 4 digits of your
              registered mobile number.
            </small>

          </div>


          {/* ERROR */}

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}


          {/* LOGIN BUTTON */}

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading
                ? styles.buttonDisabled
                : {}),
            }}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </div>


        {/* EXAMPLE */}

        <div style={styles.example}>

          <strong>
            Example
          </strong>

          <div>
            Patient ID:{" "}
            <b>PAT-0002</b>
          </div>

          <div>
            Password:{" "}
            <b>6789</b>
          </div>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f7fb",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "32px",
    boxSizing: "border-box",
    boxShadow:
      "0 10px 35px rgba(0,0,0,0.10)",
  },

  header: {
    textAlign: "center",
    marginBottom: "28px",
  },

  icon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#eef4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    fontSize: "28px",
  },

  title: {
    margin: "0",
    fontSize: "26px",
    fontWeight: "700",
    color: "#172033",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#6b7280",
    fontSize: "14px",
  },

  form: {
    width: "100%",
  },

  field: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#273142",
  },

  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    boxSizing: "border-box",
    border: "1px solid #d7dce5",
    borderRadius: "9px",
    outline: "none",
    fontSize: "15px",
    background: "#ffffff",
  },

  helpText: {
    display: "block",
    marginTop: "7px",
    color: "#737b8c",
    fontSize: "12px",
    lineHeight: "1.4",
  },

  error: {
    width: "100%",
    boxSizing: "border-box",
    padding: "11px 12px",
    marginBottom: "16px",
    borderRadius: "8px",
    background: "#fff1f1",
    border: "1px solid #ffcaca",
    color: "#c62828",
    fontSize: "13px",
    lineHeight: "1.4",
  },

  button: {
    width: "100%",
    height: "48px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },

  example: {
    marginTop: "24px",
    padding: "14px",
    borderRadius: "9px",
    background: "#f7f8fa",
    color: "#626b7a",
    fontSize: "12px",
    lineHeight: "1.7",
  },
};

export default PatientLogin;