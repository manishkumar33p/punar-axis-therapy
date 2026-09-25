// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


// import Home from "./Home/Home";

// function App() {
//   return <Home />;
// }

// export default App;

// import { RouterProvider } from "react-router-dom";
// import { createBrowserRouter } from "react-router-dom";
// import Inventory from "./Inventory/Inventory";
// import Home from "./Home/Home";
// import Appointment from "./Appointment/Appointment";
// import AppointmentDetails from "./Appointment/AppointmentDetails";
// import EmployeeAttendance from "./EmployeeAttendance/EmployeeAttendance";
// import ClientManagement from "./ClientManagement/ClientManagement";
// import PatientManagement from "./PatientManagement/PatientManagement";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Home />,
//   },
//   {
//     path: "/appointment",
//     element: <Appointment />,
//   },
//   {
//     path: "/appointment-details",
//     element: <AppointmentDetails />,
//   },
//   {
//     path: "/employee-attendance",
//     element: <EmployeeAttendance />,
//   },

//     {
//     path: "/inventory",
//     element: <Inventory />,
//   },

//     {
//     path: "/client-management",
//     element: <ClientManagement />,
//   },

//    {
//     path: "/patient-management",
//     element: <PatientManagement />,
//   },
  
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;





import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from "./Home/Home";

import Appointment from "./Appointment/Appointment";
import AppointmentDetails from "./Appointment/AppointmentDetails";
import EmployeeAttendance from "./EmployeeAttendance/EmployeeAttendance";
import Inventory from "./Inventory/Inventory";
import ClientManagement from "./ClientManagement/ClientManagement";
import PatientManagement from "./PatientManagement/PatientManagement";

import ManagementLogin from "./ManagementLogin/ManagementLogin";
import ProtectedRoute from "./ProtectedRoute";

import PatientLogin from "./PatientLogin/PatientLogin";
import PatientDashboard from "./PatientDashboard/PatientDashboard";
import PatientProtectedRoute from "./PatientProtectedRoute";


const router = createBrowserRouter([
  // =================================
  // PUBLIC WEBSITE
  // =================================
  {
    path: "/",
    element: <Home />,
  },

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
    path: "/client-management",
    element: (
      <ProtectedRoute>
        <ClientManagement />
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



