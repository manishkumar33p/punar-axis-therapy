import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./Home/Home";
import Appointment from "./Appointment/Appointment";
import AppointmentDetails from "./Appointment/AppointmentDetails";
import EmployeeAttendance from "./EmployeeAttendance/EmployeeAttendance";
import Inventory from "./Inventory/Inventory";
import OwnerDashboard from "./OwnerDashboard/OwnerDashboard";
import PatientManagement from "./PatientManagement/PatientManagement";

import ManagementLogin from "./ManagementLogin/ManagementLogin";
import ProtectedRoute from "./ProtectedRoute";

import PatientLogin from "./PatientLogin/PatientLogin";
import PatientDashboard from "./PatientDashboard/PatientDashboard";
import PatientProtectedRoute from "./PatientProtectedRoute";
import ManagementDashboard from "./ManagementDashboard/ManagementDashboard";


const router = createBrowserRouter([
  // =================================
  // PUBLIC WEBSITE
  // =================================
  {
    path: "/",
    element: <Home />,
  },
// Vercel Firebase env update
  // =================================
  // MANAGEMENT LOGIN
  // =================================
  {
    path: "/management-login",
    element: <ManagementLogin />,
  },

  // =================================
  // PROTECTED MANAGEMENT
  // =================================
  {
    path: "/management-dashboard",
    element: (
      <ProtectedRoute>
        <ManagementDashboard />
      </ProtectedRoute>
    ),
  },

  {
    path: "/appointment",
    element: (
      <ProtectedRoute>
        <Appointment />
      </ProtectedRoute>
    ),
  },

  {
    path: "/appointment-details",
    element: (
      <ProtectedRoute>
        <AppointmentDetails />
      </ProtectedRoute>
    ),
  },

  {
    path: "/patient-management",
    element: (
      <ProtectedRoute>
        <PatientManagement />
      </ProtectedRoute>
    ),
  },

  {
    path: "/employee-attendance",
    element: (
      <ProtectedRoute>
        <EmployeeAttendance />
      </ProtectedRoute>
    ),
  },

  {
    path: "/inventory",
    element: (
      <ProtectedRoute>
        <Inventory />
      </ProtectedRoute>
    ),
  },

  {
    path: "/owner-dashboard",
    element: (
      <ProtectedRoute>
        <OwnerDashboard />
      </ProtectedRoute>
    ),
  },

  // =================================
  // PATIENT PORTAL LOGIN
  // =================================
  {
    path: "/patient-login",
    element: <PatientLogin />,
  },

  // =================================
  // PROTECTED PATIENT DASHBOARD
  // =================================
  {
    path: "/patient-dashboard",
    element: (
      <PatientProtectedRoute>
        <PatientDashboard />
      </PatientProtectedRoute>
    ),
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;



