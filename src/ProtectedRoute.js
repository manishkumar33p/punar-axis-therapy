
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const auth = localStorage.getItem("clinic_management_auth");

  let isAuthenticated = false;

  try {
    const data = auth ? JSON.parse(auth) : null;
    isAuthenticated = data?.authenticated === true;
  } catch (error) {
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/management-login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;

