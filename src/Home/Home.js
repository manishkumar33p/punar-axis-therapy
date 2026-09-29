
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./Home.css";

// const services = [
//   {
//     icon: "🦴",
//     title: "Physiotherapy",
//     text: "Personalized therapy sessions designed around the patient's condition and recovery goals.",
//   },
//   {
//     icon: "🌿",
//     title: "Ayurveda",
//     text: "Traditional wellness approaches combined with a patient-focused treatment experience.",
//   },
//   {
//     icon: "💪",
//     title: "Rehabilitation",
//     text: "Structured rehabilitation support to help patients improve movement, strength and daily function.",
//   },
//   {
//     icon: "🧘",
//     title: "Pain Management",
//     text: "A guided approach focused on improving comfort, mobility and quality of life.",
//   },
// ];

// const features = [
//   {
//     number: "01",
//     title: "Easy Appointment",
//     text: "Book your consultation or therapy session through the appointment system.",
//   },
//   {
//     number: "02",
//     title: "Personalized Care",
//     text: "Treatment information and sessions can be organized according to each patient's needs.",
//   },
//   {
//     number: "03",
//     title: "Track Your Progress",
//     text: "Patients can access their appointment and treatment history through the patient portal.",
//   },
// ];

// const treatments = [
//   {
//     icon: "🦵",
//     title: "Orthopedic Physiotherapy",
//     text: "Support for movement, strength, mobility and recovery.",
//   },
//   {
//     icon: "🧠",
//     title: "Neurological Rehabilitation",
//     text: "Structured rehabilitation focused on improving daily function.",
//   },
//   {
//     icon: "🏃",
//     title: "Sports Rehabilitation",
//     text: "Recovery support for sports injuries and physical performance.",
//   },
//   {
//     icon: "❤️",
//     title: "Pain & Mobility Care",
//     text: "Personalized care focused on comfort and better movement.",
//   },
// ];

// function Home() {
//   const [managementOpen, setManagementOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const scrollToSection = (id) => {
//     const section = document.getElementById(id);

//     if (section) {
//       section.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }

//     setMobileMenuOpen(false);
//     setManagementOpen(false);
//   };

//   const toggleManagement = () => {
//     setManagementOpen((prev) => !prev);
//   };

//   const closeMobileMenu = () => {
//     setMobileMenuOpen(false);
//     setManagementOpen(false);
//   };

//   return (
//     <div className="home-page">

//       {/* ================================
//           NAVBAR
//       ================================= */}



// <div className="portal-welcome">

//   <span className="portal-welcome-label">
//     PUNAR AXIS THERAPY
//   </span>

//   <h1>
//     Welcome to the Admin Portal
//   </h1>

//   <p>
//     Manage appointments, patients, attendance,
//     inventory and clinic operations from one place.
//   </p>

// </div>
//       {/* ================================
//           HERO
//       ================================= */}

      


//       {/* ================================
//           FOOTER
//       ================================= */}


//     </div>
//   );
// }

// export default Home;



import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="admin-home">

      <section className="portal-welcome">

        <span className="portal-welcome-label">
          PUNAR AXIS THERAPY
        </span>

        <h1>
          Welcome to the Admin Portal
        </h1>

        <p>
          Manage your clinic activities from one place.
        </p>

        <div className="admin-quick-links">

          <Link to="/appointment">
            <span>📅</span>
            <strong>Appointments</strong>
            <small>View and manage appointments</small>
          </Link>

          <Link to="/patient-management">
            <span>👤</span>
            <strong>Patients</strong>
            <small>Manage patient records</small>
          </Link>

          <Link to="/employee-attendance">
            <span>🧑</span>
            <strong>Attendance</strong>
            <small>Check employee attendance</small>
          </Link>

          <Link to="/inventory">
            <span>📦</span>
            <strong>Inventory</strong>
            <small>Manage clinic stock</small>
          </Link>

        </div>

        <div className="portal-bottom-text">
          <span>🔐 Secure Admin Access</span>
          <span>•</span>
          <span>Manage Clinic Operations</span>
        </div>

      </section>

    </div>
  );
}

export default Home;

