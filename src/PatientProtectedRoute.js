
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function PatientProtectedRoute({ children }) {
  const location = useLocation();

  const authData = localStorage.getItem("clinic_patient_auth");

  let isLoggedIn = false;

  if (authData) {
    try {
      const parsedData = JSON.parse(authData);

      if (
        parsedData &&
        parsedData.authenticated === true &&
        parsedData.patientId
      ) {
        isLoggedIn = true;
      }
    } catch (error) {
      isLoggedIn = false;
    }
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/patient-login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default PatientProtectedRoute;

