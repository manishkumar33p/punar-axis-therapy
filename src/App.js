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
import CommonLayout from "./CommonNavbar/CommonLayout";

const router = createBrowserRouter([
  // =================================
  // PUBLIC WEBSITE
  // =================================
  {
  path: "/",
  element: (
    <CommonLayout>
      <Home />
    </CommonLayout>
  ),
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
    <CommonLayout>
      <ProtectedRoute>
        <ManagementDashboard />
      </ProtectedRoute>
    </CommonLayout>
  ),
},

  {
  path: "/appointment",
  element: (
    <CommonLayout>
      <ProtectedRoute>
        <Appointment />
      </ProtectedRoute>
    </CommonLayout>
  ),
},

 {
  path: "/appointment-details",
  element: (
    <CommonLayout>
      <ProtectedRoute>
        <AppointmentDetails />
      </ProtectedRoute>
    </CommonLayout>
  ),
},

  {
  path: "/patient-management",
  element: (
    <CommonLayout>
      <ProtectedRoute>
        <PatientManagement />
      </ProtectedRoute>
    </CommonLayout>
  ),
},

 {
  path: "/employee-attendance",
  element: (
    <CommonLayout>
      <ProtectedRoute>
        <EmployeeAttendance />
      </ProtectedRoute>
    </CommonLayout>
  ),
},

 {
  path: "/inventory",
  element: (
    <CommonLayout>
      <ProtectedRoute>
        <Inventory />
      </ProtectedRoute>
    </CommonLayout>
  ),
},
  {
  path: "/owner-dashboard",
  element: (
    <CommonLayout>
      <ProtectedRoute>
        <OwnerDashboard />
      </ProtectedRoute>
    </CommonLayout>
  ),
},

  // =================================
  // PATIENT PORTAL LOGIN
  // =================================
 {
  path: "/patient-login",
  element: (
    <CommonLayout>
      <PatientLogin />
    </CommonLayout>
  ),
},

  // =================================
  // PROTECTED PATIENT DASHBOARD
  // =================================
 {
  path: "/patient-dashboard",
  element: (
    <CommonLayout>
      <PatientProtectedRoute>
        <PatientDashboard />
      </PatientProtectedRoute>
    </CommonLayout>
  ),
},
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;



