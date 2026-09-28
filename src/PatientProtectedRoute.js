import React from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { getPatientSession } from "./auth";


function PatientProtectedRoute({ children }) {

  const location = useLocation();

  let session = null;

  try {
    session = getPatientSession();
  } catch (error) {
    console.error(
      "Patient session check failed:",
      error
    );
  }

  const isLoggedIn =
    session?.loggedIn === true &&
    Boolean(session?.patient?.patientId);


  console.log(
    "PATIENT PROTECTED ROUTE:",
    {
      pathname: location.pathname,
      isLoggedIn,
      patientId:
        session?.patient?.patientId || null,
      session,
    }
  );


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