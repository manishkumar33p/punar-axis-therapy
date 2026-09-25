// import React from "react";
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

// function Home() {
//   const scrollToSection = (id) => {
//     const section = document.getElementById(id);

//     if (section) {
//       section.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   const [managementOpen, setManagementOpen] = React.useState(false);

//   return (
//     <div className="home-page">
//       {/* ================= NAVBAR ================= */}
//       {/* <header className="home-navbar">
//         <div className="home-nav-container">
//           <Link to="/" className="home-logo">
//             <div className="home-logo-mark">
//               <span>PA</span>
//             </div>

//             <div className="home-logo-text">
//               <strong>PUNAR AXIS</strong>
//               <span>THERAPY</span>
//             </div>
//           </Link>

//           <nav className="home-nav-menu">
//             <button onClick={() => scrollToSection("home")}>Home</button>

//             <button onClick={() => scrollToSection("about")}>
//               About Us
//             </button>

//             <button onClick={() => scrollToSection("services")}>
//               Services
//             </button>

//             <button onClick={() => scrollToSection("treatments")}>
//               Treatments
//             </button>

//             <button onClick={() => scrollToSection("process")}>
//               How It Works
//             </button>

//             <button onClick={() => scrollToSection("contact")}>
//               Contact
//             </button>

//             <Link to="/patient-login" className="nav-patient-link">
//               Patient Portal
//             </Link>
//           </nav>

//           <Link to="/appointment" className="nav-book-btn">
//             Book Appointment
//             <span>↗</span>
//           </Link>

//           <button
//             className="mobile-menu-btn"
//             onClick={() => scrollToSection("mobile-menu")}
//             aria-label="Open menu"
//           >
//             ☰
//           </button>
//         </div>
//       </header> */}

//       <header className="home-navbar">
//   <div className="home-nav-container">

//     <Link to="/" className="home-logo">
//       <div className="home-logo-mark">
//         <span>PA</span>
//       </div>

//       <div className="home-logo-text">
//         <strong>PUNAR AXIS</strong>
//         <span>THERAPY</span>
//       </div>
//     </Link>

//     <nav className="home-nav-menu">

//       <button onClick={() => scrollToSection("home")}>
//         Home
//       </button>

//       <button onClick={() => scrollToSection("about")}>
//         About Us
//       </button>

//       <button onClick={() => scrollToSection("services")}>
//         Services
//       </button>

//       <button onClick={() => scrollToSection("treatments")}>
//         Treatments
//       </button>

//       {/* MANAGEMENT DROPDOWN */}
//       <div className="nav-dropdown">
//         <button
//           className="nav-dropdown-trigger"
//           onClick={() =>
//             setManagementOpen(!managementOpen)
//           }
//         >
//           Management
//           <span className={managementOpen ? "arrow-up" : ""}>
//             ▾
//           </span>
//         </button>

//         {managementOpen && (
//           <div className="nav-dropdown-menu">

//             <div className="dropdown-heading">
//               <span>CLINIC MANAGEMENT</span>
//             </div>

//             <Link to="/appointment">
//               <span className="dropdown-icon">📅</span>
//               <div>
//                 <strong>Appointment</strong>
//                 <small>Book new appointment</small>
//               </div>
//             </Link>

//             <Link to="/appointment-details">
//               <span className="dropdown-icon">📋</span>
//               <div>
//                 <strong>Appointment Details</strong>
//                 <small>View & manage appointments</small>
//               </div>
//             </Link>

//             <Link to="/patient-management">
//               <span className="dropdown-icon">👤</span>
//               <div>
//                 <strong>Patient Management</strong>
//                 <small>Patient records & treatment</small>
//               </div>
//             </Link>

//             <Link to="/employee-attendance">
//               <span className="dropdown-icon">🧑</span>
//               <div>
//                 <strong>Employee Attendance</strong>
//                 <small>Attendance & employee records</small>
//               </div>
//             </Link>

//             <Link to="/inventory">
//               <span className="dropdown-icon">📦</span>
//               <div>
//                 <strong>Inventory</strong>
//                 <small>Stock & inventory management</small>
//               </div>
//             </Link>

//             <Link to="/client-management">
//               <span className="dropdown-icon">🤝</span>
//               <div>
//                 <strong>Client Management</strong>
//                 <small>Client information & history</small>
//               </div>
//             </Link>

//             <div className="dropdown-divider"></div>

//             <div className="dropdown-heading">
//               <span>PATIENT PORTAL</span>
//             </div>

//             <Link
//               to="/patient-login"
//               className="patient-dropdown-link"
//             >
//               <span className="dropdown-icon">🔐</span>

//               <div>
//                 <strong>Patient Login</strong>
//                 <small>History, treatment & future plan</small>
//               </div>

//               <span className="dropdown-arrow">→</span>
//             </Link>

//           </div>
//         )}
//       </div>

//       <button onClick={() => scrollToSection("contact")}>
//         Contact
//       </button>

//     </nav>

//     <Link to="/appointment" className="nav-book-btn">
//       Book Appointment
//       <span>↗</span>
//     </Link>

//   </div>
// </header>

//       {/* ================= HERO ================= */}
//       <main>
//         <section id="home" className="hero-section">
//           <div className="hero-background-shape shape-one"></div>
//           <div className="hero-background-shape shape-two"></div>

//           <div className="hero-container">
//             <div className="hero-content">
//               <div className="hero-badge">
//                 <span className="pulse-dot"></span>
//                 Patient-Centered Therapy & Wellness
//               </div>

//               <h1>
//                 Move Better.
//                 <br />
//                 <span>Live Better.</span>
//               </h1>

//               <p className="hero-description">
//                 A modern therapy experience focused on personalized care,
//                 rehabilitation, mobility and long-term wellness.
//               </p>

//               <div className="hero-buttons">
//                 <Link to="/appointment" className="primary-btn">
//                   Book an Appointment
//                   <span>→</span>
//                 </Link>

//                 <button
//                   className="secondary-btn"
//                   onClick={() => scrollToSection("services")}
//                 >
//                   Explore Services
//                   <span>↓</span>
//                 </button>
//               </div>

//               <div className="hero-trust">
//                 <div className="trust-item">
//                   <strong>01</strong>
//                   <span>Personalized<br />Care</span>
//                 </div>

//                 <div className="trust-line"></div>

//                 <div className="trust-item">
//                   <strong>02</strong>
//                   <span>Structured<br />Treatment</span>
//                 </div>

//                 <div className="trust-line"></div>

//                 <div className="trust-item">
//                   <strong>03</strong>
//                   <span>Patient<br />Portal</span>
//                 </div>
//               </div>
//             </div>

//             <div className="hero-visual">
//               <div className="hero-image-card">
//                 <div className="hero-image-placeholder">
//                   <div className="hero-image-overlay"></div>

//                   <div className="hero-image-content">
//                     <span className="image-small-label">
//                       PUNAR AXIS THERAPY
//                     </span>

//                     <h3>
//                       Your Recovery,
//                       <br />
//                       Our Focus.
//                     </h3>
//                   </div>
//                 </div>

//                 <div className="floating-card appointment-floating">
//                   <div className="floating-icon">✓</div>
//                   <div>
//                     <small>Care Experience</small>
//                     <strong>Patient Focused</strong>
//                   </div>
//                 </div>

//                 <div className="floating-card treatment-floating">
//                   <div className="floating-icon">✦</div>
//                   <div>
//                     <small>Therapy</small>
//                     <strong>Personalized Plan</strong>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ================= QUICK ACCESS ================= */}
//         <section className="quick-access-section">
//           <div className="quick-access-container">
//             <div className="quick-intro">
//               <span>QUICK ACCESS</span>
//               <h2>Your care, one place.</h2>
//             </div>

//             <Link to="/appointment" className="quick-card">
//               <div className="quick-card-icon">📅</div>
//               <div>
//                 <strong>Appointments</strong>
//                 <span>Book & manage sessions</span>
//               </div>
//               <b>→</b>
//             </Link>

//             <Link to="/patient-login" className="quick-card">
//               <div className="quick-card-icon">👤</div>
//               <div>
//                 <strong>Patient Portal</strong>
//                 <span>View your treatment history</span>
//               </div>
//               <b>→</b>
//             </Link>

//             <Link to="/patient-management" className="quick-card">
//               <div className="quick-card-icon">📋</div>
//               <div>
//                 <strong>Patient Management</strong>
//                 <span>Clinical patient records</span>
//               </div>
//               <b>→</b>
//             </Link>
//           </div>
//         </section>

//         {/* ================= ABOUT ================= */}
//         <section id="about" className="about-section">
//           <div className="section-container about-grid">
//             <div className="about-visual">
//               <div className="about-main-card">
//                 <div className="about-pattern"></div>

//                 <div className="about-circle">
//                   <span>PA</span>
//                 </div>

//                 <div className="about-card-bottom">
//                   <span>ESTABLISHED FOR</span>
//                   <strong>BETTER CARE</strong>
//                 </div>
//               </div>

//               <div className="about-stat-card">
//                 <strong>360°</strong>
//                 <span>Patient Care<br />Experience</span>
//               </div>
//             </div>

//             <div className="about-content">
//               <div className="section-label">
//                 <span></span>
//                 ABOUT PUNAR AXIS
//               </div>

//               <h2>
//                 A modern approach to
//                 <em> therapy & wellness.</em>
//               </h2>

//               <p>
//                 Punar Axis Therapy is designed around a simple idea — make
//                 healthcare more organized, personal and convenient for every
//                 patient.
//               </p>

//               <p>
//                 From appointment booking to treatment history and future
//                 sessions, the digital experience is being structured so that
//                 patients and the clinical team can stay connected.
//               </p>

//               <div className="about-highlights">
//                 <div>
//                   <span>✓</span>
//                   <strong>Personalized Treatment</strong>
//                 </div>

//                 <div>
//                   <span>✓</span>
//                   <strong>Organized Patient Records</strong>
//                 </div>

//                 <div>
//                   <span>✓</span>
//                   <strong>Easy Appointment Access</strong>
//                 </div>

//                 <div>
//                   <span>✓</span>
//                   <strong>Digital Patient Experience</strong>
//                 </div>
//               </div>

//               <button
//                 className="text-arrow-btn"
//                 onClick={() => scrollToSection("services")}
//               >
//                 Explore Our Services <span>→</span>
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* ================= SERVICES ================= */}
//         <section id="services" className="services-section">
//           <div className="section-container">
//             <div className="section-heading-row">
//               <div>
//                 <div className="section-label">
//                   <span></span>
//                   WHAT WE OFFER
//                 </div>

//                 <h2>
//                   Care designed around
//                   <br />
//                   <em>your recovery.</em>
//                 </h2>
//               </div>

//               <p>
//                 Explore the core areas of care and therapy that can be
//                 organized through your Punar Axis experience.
//               </p>
//             </div>

//             <div className="services-grid">
//               {services.map((service, index) => (
//                 <article className="service-card" key={service.title}>
//                   <div className="service-top">
//                     <span className="service-number">
//                       0{index + 1}
//                     </span>

//                     <div className="service-icon">{service.icon}</div>
//                   </div>

//                   <h3>{service.title}</h3>

//                   <p>{service.text}</p>

//                   <button
//                     onClick={() => scrollToSection("treatments")}
//                     className="service-link"
//                   >
//                     Learn More <span>↗</span>
//                   </button>
//                 </article>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ================= TREATMENTS ================= */}
//         <section id="treatments" className="treatments-section">
//           <div className="section-container">
//             <div className="treatment-heading">
//               <div className="section-label light-label">
//                 <span></span>
//                 TREATMENT EXPERIENCE
//               </div>

//               <h2>
//                 From first consultation
//                 <br />
//                 to ongoing recovery.
//               </h2>

//               <p>
//                 Keep your treatment journey organized with appointments,
//                 sessions, observations and follow-up information in one
//                 connected system.
//               </p>
//             </div>

//             <div className="treatment-flow">
//               <div className="treatment-step">
//                 <div className="step-circle">01</div>
//                 <h3>Assessment</h3>
//                 <p>Understand the patient's needs and treatment goals.</p>
//               </div>

//               <div className="flow-line"></div>

//               <div className="treatment-step">
//                 <div className="step-circle">02</div>
//                 <h3>Treatment Plan</h3>
//                 <p>Create a structured plan according to the patient's needs.</p>
//               </div>

//               <div className="flow-line"></div>

//               <div className="treatment-step">
//                 <div className="step-circle">03</div>
//                 <h3>Therapy Sessions</h3>
//                 <p>Maintain session-wise treatment and progress information.</p>
//               </div>

//               <div className="flow-line"></div>

//               <div className="treatment-step">
//                 <div className="step-circle">04</div>
//                 <h3>Follow-up</h3>
//                 <p>Keep upcoming appointments and future treatment visible.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ================= PATIENT PORTAL ================= */}
//         <section className="portal-section">
//           <div className="section-container portal-grid">
//             <div className="portal-content">
//               <div className="section-label">
//                 <span></span>
//                 PATIENT PORTAL
//               </div>

//               <h2>
//                 Your complete
//                 <br />
//                 <em>treatment journey.</em>
//               </h2>

//               <p>
//                 Patients will be able to securely access their own digital
//                 dashboard to view appointments, treatment history, current
//                 sessions and future treatment information.
//               </p>

//               <div className="portal-features">
//                 <div>
//                   <span>01</span>
//                   <div>
//                     <strong>Appointment History</strong>
//                     <p>See previous and upcoming appointments.</p>
//                   </div>
//                 </div>

//                 <div>
//                   <span>02</span>
//                   <div>
//                     <strong>Treatment History</strong>
//                     <p>View completed sessions and treatment records.</p>
//                   </div>
//                 </div>

//                 <div>
//                   <span>03</span>
//                   <div>
//                     <strong>Future Treatment Plan</strong>
//                     <p>See planned sessions and follow-up information.</p>
//                   </div>
//                 </div>
//               </div>

//               <Link to="/patient-login" className="primary-btn">
//                 Open Patient Portal
//                 <span>→</span>
//               </Link>
//             </div>

//             <div className="portal-dashboard">
//               <div className="dashboard-topbar">
//                 <div>
//                   <small>Patient Dashboard</small>
//                   <strong>Welcome Back</strong>
//                 </div>

//                 <div className="dashboard-avatar">P</div>
//               </div>

//               <div className="dashboard-welcome">
//                 <span>MY HEALTH JOURNEY</span>
//                 <h3>Your Treatment Overview</h3>
//               </div>

//               <div className="dashboard-stats">
//                 <div>
//                   <small>Sessions</small>
//                   <strong>12</strong>
//                   <span>Completed</span>
//                 </div>

//                 <div>
//                   <small>Upcoming</small>
//                   <strong>03</strong>
//                   <span>Sessions</span>
//                 </div>

//                 <div>
//                   <small>Follow-up</small>
//                   <strong>01</strong>
//                   <span>Due</span>
//                 </div>
//               </div>

//               <div className="dashboard-treatment">
//                 <div className="dash-treatment-header">
//                   <span>Current Treatment</span>
//                   <b>Active</b>
//                 </div>

//                 <h4>Physiotherapy & Rehabilitation</h4>

//                 <div className="treatment-progress">
//                   <div>
//                     <span>Progress</span>
//                     <strong>75%</strong>
//                   </div>

//                   <div className="progress-bar">
//                     <span></span>
//                   </div>
//                 </div>

//                 <div className="next-session">
//                   <span>Next Session</span>
//                   <strong>Upcoming Appointment</strong>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ================= PROCESS ================= */}
//         <section id="process" className="process-section">
//           <div className="section-container">
//             <div className="process-heading">
//               <div className="section-label">
//                 <span></span>
//                 HOW IT WORKS
//               </div>

//               <h2>
//                 Simple for patients.
//                 <br />
//                 <em>Organized for care.</em>
//               </h2>
//             </div>

//             <div className="process-grid">
//               {features.map((feature) => (
//                 <div className="process-card" key={feature.number}>
//                   <span>{feature.number}</span>
//                   <h3>{feature.title}</h3>
//                   <p>{feature.text}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ================= APPOINTMENT CTA ================= */}
//         <section className="appointment-cta">
//           <div className="cta-pattern"></div>

//           <div className="section-container cta-content">
//             <div>
//               <span className="cta-small">READY TO GET STARTED?</span>

//               <h2>
//                 Your next step
//                 <br />
//                 starts here.
//               </h2>

//               <p>
//                 Schedule your appointment and begin your personalized care
//                 journey.
//               </p>
//             </div>

//             <Link to="/appointment" className="cta-white-btn">
//               Book Appointment
//               <span>↗</span>
//             </Link>
//           </div>
//         </section>

//         {/* ================= CONTACT ================= */}
//         <section id="contact" className="contact-section">
//           <div className="section-container">
//             <div className="contact-grid">
//               <div className="contact-content">
//                 <div className="section-label">
//                   <span></span>
//                   CONTACT US
//                 </div>

//                 <h2>
//                   Let's take the
//                   <br />
//                   next step <em>together.</em>
//                 </h2>

//                 <p>
//                   Have a question or want to schedule a therapy session?
//                   Reach out to Punar Axis Therapy.
//                 </p>

//                 <div className="contact-details">
//                   <div className="contact-detail">
//                     <div>📍</div>
//                     <div>
//                       <span>LOCATION</span>
//                       <strong>Sector 141, Noida</strong>
//                     </div>
//                   </div>

//                   <div className="contact-detail">
//                     <div>📞</div>
//                     <div>
//                       <span>PHONE</span>
//                       <strong>Contact Clinic</strong>
//                     </div>
//                   </div>

//                   <div className="contact-detail">
//                     <div>✉</div>
//                     <div>
//                       <span>EMAIL</span>
//                       <strong>Contact Us</strong>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="contact-card">
//                 <div className="contact-card-top">
//                   <span>GET IN TOUCH</span>
//                   <div>✦</div>
//                 </div>

//                 <h3>Book your appointment</h3>

//                 <p>
//                   Choose your preferred appointment slot and start your
//                   treatment journey.
//                 </p>

//                 <Link to="/appointment" className="contact-book-btn">
//                   Schedule Appointment
//                   <span>→</span>
//                 </Link>

//                 <button
//                   className="contact-scroll-btn"
//                   onClick={() => scrollToSection("home")}
//                 >
//                   Back to top ↑
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       {/* ================= FOOTER ================= */}
//       <footer className="home-footer">
//         <div className="section-container footer-main">
//           <div className="footer-brand">
//             <Link to="/" className="home-logo footer-logo">
//               <div className="home-logo-mark">
//                 <span>PA</span>
//               </div>

//               <div className="home-logo-text">
//                 <strong>PUNAR AXIS</strong>
//                 <span>THERAPY</span>
//               </div>
//             </Link>

//             <p>
//               A connected digital experience for modern therapy,
//               rehabilitation and patient care.
//             </p>
//           </div>

//           <div className="footer-column">
//             <h4>Navigation</h4>

//             <button onClick={() => scrollToSection("home")}>Home</button>
//             <button onClick={() => scrollToSection("about")}>About Us</button>
//             <button onClick={() => scrollToSection("services")}>
//               Services
//             </button>
//             <button onClick={() => scrollToSection("treatments")}>
//               Treatments
//             </button>
//           </div>

//           <div className="footer-column">
//             <h4>Patient</h4>

//             <Link to="/appointment">Appointment</Link>
//             <Link to="/patient-login">Patient Portal</Link>
//             <Link to="/patient-management">Patient Management</Link>
//             <Link to="/appointment-details">Appointment Details</Link>
//           </div>

//           <div className="footer-column">
//             <h4>Management</h4>

//             <Link to="/employee-attendance">Employee Attendance</Link>
//             <Link to="/inventory">Inventory</Link>
//             <Link to="/client-management">Client Management</Link>
//           </div>
//         </div>

//         <div className="footer-bottom">
//           <div className="section-container footer-bottom-inner">
//             <span>
//               © {new Date().getFullYear()} Punar Axis Therapy. All rights
//               reserved.
//             </span>

//             <span>Designed for better patient experience.</span>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default Home;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const services = [
  {
    icon: "🦴",
    title: "Physiotherapy",
    text: "Personalized therapy sessions designed around the patient's condition and recovery goals.",
  },
  {
    icon: "🌿",
    title: "Ayurveda",
    text: "Traditional wellness approaches combined with a patient-focused treatment experience.",
  },
  {
    icon: "💪",
    title: "Rehabilitation",
    text: "Structured rehabilitation support to help patients improve movement, strength and daily function.",
  },
  {
    icon: "🧘",
    title: "Pain Management",
    text: "A guided approach focused on improving comfort, mobility and quality of life.",
  },
];

const features = [
  {
    number: "01",
    title: "Easy Appointment",
    text: "Book your consultation or therapy session through the appointment system.",
  },
  {
    number: "02",
    title: "Personalized Care",
    text: "Treatment information and sessions can be organized according to each patient's needs.",
  },
  {
    number: "03",
    title: "Track Your Progress",
    text: "Patients can access their appointment and treatment history through the patient portal.",
  },
];

const treatments = [
  {
    icon: "🦵",
    title: "Orthopedic Physiotherapy",
    text: "Support for movement, strength, mobility and recovery.",
  },
  {
    icon: "🧠",
    title: "Neurological Rehabilitation",
    text: "Structured rehabilitation focused on improving daily function.",
  },
  {
    icon: "🏃",
    title: "Sports Rehabilitation",
    text: "Recovery support for sports injuries and physical performance.",
  },
  {
    icon: "❤️",
    title: "Pain & Mobility Care",
    text: "Personalized care focused on comfort and better movement.",
  },
];

function Home() {
  const [managementOpen, setManagementOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMobileMenuOpen(false);
    setManagementOpen(false);
  };

  const toggleManagement = () => {
    setManagementOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setManagementOpen(false);
  };

  return (
    <div className="home-page">

      {/* ================================
          NAVBAR
      ================================= */}

      <header className="home-navbar">

        <div className="home-nav-container">

          {/* LOGO */}

          <Link
            to="/"
            className="home-logo"
            onClick={closeMobileMenu}
          >
            <div className="home-logo-mark">
              <span>PA</span>
            </div>

            <div className="home-logo-text">
              <strong>PUNAR AXIS</strong>
              <span>THERAPY</span>
            </div>
          </Link>


          {/* MOBILE MENU BUTTON */}

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            aria-label="Toggle navigation menu"
            type="button"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>


          {/* NAVIGATION */}

          <nav
            className={`home-nav-menu ${
              mobileMenuOpen
                ? "mobile-menu-open"
                : ""
            }`}
          >

            <button
              type="button"
              onClick={() => scrollToSection("home")}
            >
              Home
            </button>


            <button
              type="button"
              onClick={() => scrollToSection("about")}
            >
              About Us
            </button>


            <button
              type="button"
              onClick={() => scrollToSection("services")}
            >
              Services
            </button>


            <button
              type="button"
              onClick={() => scrollToSection("treatments")}
            >
              Treatments
            </button>


            {/* MANAGEMENT DROPDOWN */}

            <div className="nav-dropdown">

              <button
                type="button"
                className="nav-dropdown-trigger"
                onClick={toggleManagement}
              >
                <span>Management</span>

                <span
                  className={
                    managementOpen
                      ? "arrow-up"
                      : ""
                  }
                >
                  ▾
                </span>
              </button>


              {managementOpen && (
                <div className="nav-dropdown-menu">

                  <div className="dropdown-heading">
                    <span>CLINIC MANAGEMENT</span>
                  </div>


                  <Link
                    to="/appointment"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      📅
                    </span>

                    <div>
                      <strong>Appointment</strong>
                      <small>
                        Book new appointment
                      </small>
                    </div>
                  </Link>


                  <Link
                    to="/appointment-details"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      📋
                    </span>

                    <div>
                      <strong>
                        Appointment Details
                      </strong>

                      <small>
                        View & manage appointments
                      </small>
                    </div>
                  </Link>


                  <Link
                    to="/patient-management"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      👤
                    </span>

                    <div>
                      <strong>
                        Patient Management
                      </strong>

                      <small>
                        Patient records & treatment
                      </small>
                    </div>
                  </Link>


                  <Link
                    to="/employee-attendance"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      🧑
                    </span>

                    <div>
                      <strong>
                        Employee Attendance
                      </strong>

                      <small>
                        Attendance & employee records
                      </small>
                    </div>
                  </Link>


                  <Link
                    to="/inventory"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      📦
                    </span>

                    <div>
                      <strong>Inventory</strong>

                      <small>
                        Stock & inventory management
                      </small>
                    </div>
                  </Link>


                  <Link
                    to="/client-management"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      🤝
                    </span>

                    <div>
                      <strong>
                        Client Management
                      </strong>

                      <small>
                        Client information & history
                      </small>
                    </div>
                  </Link>


                  <div className="dropdown-divider"></div>


                  <div className="dropdown-heading">
                    <span>PATIENT PORTAL</span>
                  </div>


                  <Link
                    to="/patient-login"
                    className="patient-dropdown-link"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      🔐
                    </span>

                    <div>
                      <strong>
                        Patient Login
                      </strong>

                      <small>
                        History, treatment & future plan
                      </small>
                    </div>

                    <span className="dropdown-arrow">
                      →
                    </span>
                  </Link>

                </div>
              )}

            </div>


            <button
              type="button"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>

          </nav>


          {/* BOOK APPOINTMENT */}

          <Link
            to="/appointment"
            className="nav-book-btn"
          >
            Book Appointment
            <span>↗</span>
          </Link>

        </div>

      </header>


      {/* ================================
          HERO
      ================================= */}

      <main>

        <section
          id="home"
          className="hero-section"
        >

          <div className="hero-background-shape shape-one"></div>
          <div className="hero-background-shape shape-two"></div>

          <div className="hero-container">

            <div className="hero-content">

              <span className="eyebrow">
                PUNAR AXIS THERAPY
              </span>

              <h1>
                Better Movement.
                <br />
                Better Recovery.
                <br />

                <span>
                  Better Life.
                </span>
              </h1>

              <p>
                A modern therapy experience focused on
                personalized care, rehabilitation, mobility
                and long-term wellness.
              </p>


              <div className="hero-actions">

                <Link
                  to="/appointment"
                  className="hero-primary-btn"
                >
                  Book an Appointment
                  <span>→</span>
                </Link>


                <button
                  type="button"
                  className="hero-secondary-btn"
                  onClick={() =>
                    scrollToSection("services")
                  }
                >
                  Explore Services
                  <span>↓</span>
                </button>

              </div>

            </div>


            <div className="hero-visual">

              <div className="hero-image-card">

                <div className="hero-image-placeholder">
                  <span>PA</span>
                  <small>
                    PUNAR AXIS THERAPY
                  </small>
                </div>

              </div>

              <div className="hero-floating-card">
                <strong>Patient First</strong>
                <span>
                  Personalized Therapy
                </span>
              </div>

            </div>

          </div>

        </section>


        {/* ================================
            QUICK ACCESS
        ================================= */}

        <section className="quick-access-section">

          <div className="quick-access-container">

            {features.map((item) => (
              <div
                className="quick-access-item"
                key={item.number}
              >

                <span className="quick-number">
                  {item.number}
                </span>

                <div>
                  <strong>
                    {item.title}
                  </strong>

                  <p>
                    {item.text}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </section>


        {/* ================================
            ABOUT
        ================================= */}

        <section
          id="about"
          className="about-section"
        >

          <div className="section-container">

            <div className="about-grid">

              <div className="about-content">

                <span className="section-label">
                  ABOUT US
                </span>

                <h2>
                  Care Designed Around
                  Your Recovery
                </h2>

                <p>
                  Punar Axis Therapy focuses on
                  patient-centered therapy and
                  rehabilitation designed around
                  individual needs.
                </p>

                <p>
                  From your first consultation to
                  ongoing treatment and follow-up,
                  the goal is to make every stage of
                  your recovery organized and easy
                  to understand.
                </p>


                <div className="about-points">

                  <div>
                    <strong>
                      ✓ Personalized Care
                    </strong>

                    <span>
                      Treatment planned around
                      individual requirements.
                    </span>
                  </div>


                  <div>
                    <strong>
                      ✓ Structured Treatment
                    </strong>

                    <span>
                      Clear sessions and treatment
                      planning.
                    </span>
                  </div>


                  <div>
                    <strong>
                      ✓ Progress Tracking
                    </strong>

                    <span>
                      Follow your appointments and
                      treatment progress.
                    </span>
                  </div>

                </div>

              </div>


              <div className="about-visual">

                <div className="about-card">

                  <div className="about-icon">
                    ❤️
                  </div>

                  <h3>
                    Patient-Centered Therapy
                  </h3>

                  <p>
                    Every patient has different
                    requirements. Our approach keeps
                    those requirements at the center
                    of treatment planning.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            SERVICES
        ================================= */}

        <section
          id="services"
          className="services-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <span>
                OUR SERVICES
              </span>

              <h2>
                Therapy & Rehabilitation
                Services
              </h2>

              <p>
                Professional care focused on
                movement, recovery, rehabilitation
                and overall well-being.
              </p>

            </div>


            <div className="services-grid">

              {services.map((service) => (
                <div
                  className="service-card"
                  key={service.title}
                >

                  <div className="service-icon">
                    {service.icon}
                  </div>

                  <h3>
                    {service.title}
                  </h3>

                  <p>
                    {service.text}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      scrollToSection("contact")
                    }
                  >
                    Learn More →
                  </button>

                </div>
              ))}

            </div>

          </div>

        </section>


        {/* ================================
            TREATMENTS
        ================================= */}

        <section
          id="treatments"
          className="treatments-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <span>
                TREATMENTS
              </span>

              <h2>
                Treatment Plans Built
                Around You
              </h2>

              <p>
                Treatment can be organized into
                current sessions, follow-ups and
                future treatment plans.
              </p>

            </div>


            <div className="treatments-grid">

              {treatments.map((treatment) => (
                <div
                  className="treatment-card"
                  key={treatment.title}
                >

                  <div className="treatment-icon">
                    {treatment.icon}
                  </div>

                  <h3>
                    {treatment.title}
                  </h3>

                  <p>
                    {treatment.text}
                  </p>

                </div>
              ))}

            </div>

          </div>

        </section>


        {/* ================================
            PATIENT PORTAL
        ================================= */}

        <section className="portal-section">

          <div className="section-container">

            <div className="portal-grid">

              <div className="portal-content">

                <span className="section-label">
                  PATIENT PORTAL
                </span>

                <h2>
                  Your Treatment
                  Information In One Place
                </h2>

                <p>
                  Patients can access their own
                  appointments, treatment history,
                  medical records, future treatment
                  plans and other available information
                  through the secure patient portal.
                </p>


                <div className="portal-features">

                  <div>
                    <span>📅</span>
                    <strong>
                      Appointments
                    </strong>
                  </div>

                  <div>
                    <span>📋</span>
                    <strong>
                      Treatment History
                    </strong>
                  </div>

                  <div>
                    <span>💳</span>
                    <strong>
                      Bills & Payments
                    </strong>
                  </div>

                  <div>
                    <span>📈</span>
                    <strong>
                      Progress
                    </strong>
                  </div>

                  <div>
                    <span>📁</span>
                    <strong>
                      Medical Records
                    </strong>
                  </div>

                  <div>
                    <span>🔮</span>
                    <strong>
                      Future Treatment Plan
                    </strong>
                  </div>

                </div>


                <Link
                  to="/patient-login"
                  className="portal-btn"
                >
                  Patient Login →
                </Link>

              </div>


              <div className="portal-card">

                <div className="portal-card-header">
                  <span>
                    PATIENT DASHBOARD
                  </span>

                  <span className="portal-status">
                    ● Active
                  </span>
                </div>


                <div className="portal-patient">
                  <div className="portal-avatar">
                    PA
                  </div>

                  <div>
                    <strong>
                      Patient Portal
                    </strong>

                    <span>
                      Your treatment overview
                    </span>
                  </div>
                </div>


                <div className="portal-stat-grid">

                  <div>
                    <span>
                      Next Appointment
                    </span>

                    <strong>
                      View Details
                    </strong>
                  </div>


                  <div>
                    <span>
                      Treatment
                    </span>

                    <strong>
                      Current Plan
                    </strong>
                  </div>


                  <div>
                    <span>
                      Progress
                    </span>

                    <strong>
                      Track Progress
                    </strong>
                  </div>


                  <div>
                    <span>
                      Records
                    </span>

                    <strong>
                      View Records
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            PROCESS
        ================================= */}

        <section
          className="process-section"
        >

          <div className="section-container">

            <div className="section-heading">

              <span>
                OUR PROCESS
              </span>

              <h2>
                A Simple Journey From
                Consultation to Recovery
              </h2>

              <p>
                We keep the treatment journey
                organized so patients know what
                comes next.
              </p>

            </div>


            <div className="process-grid">

              <div className="process-card">

                <div className="process-number">
                  01
                </div>

                <h3>
                  Consultation
                </h3>

                <p>
                  Understand the patient's
                  condition, requirements and
                  treatment goals.
                </p>

              </div>


              <div className="process-card">

                <div className="process-number">
                  02
                </div>

                <h3>
                  Treatment Plan
                </h3>

                <p>
                  Organize therapy sessions,
                  treatment approach and
                  follow-up requirements.
                </p>

              </div>


              <div className="process-card">

                <div className="process-number">
                  03
                </div>

                <h3>
                  Therapy Sessions
                </h3>

                <p>
                  Continue structured sessions
                  according to the patient's
                  treatment plan.
                </p>

              </div>


              <div className="process-card">

                <div className="process-number">
                  04
                </div>

                <h3>
                  Progress & Follow-up
                </h3>

                <p>
                  Review progress and organize
                  future treatment or follow-up
                  as required.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ================================
            APPOINTMENT CTA
        ================================= */}

        <section className="appointment-cta">

          <div className="section-container">

            <div className="appointment-cta-content">

              <span>
                READY TO GET STARTED?
              </span>

              <h2>
                Start Your Recovery
                Journey
              </h2>

              <p>
                Book an appointment and take the
                next step toward better movement
                and recovery.
              </p>

              <Link
                to="/appointment"
                className="cta-button"
              >
                Book an Appointment →
              </Link>

            </div>

          </div>

        </section>


        {/* ================================
            CONTACT
        ================================= */}

        <section
          id="contact"
          className="contact-section"
        >

          <div className="section-container">

            <div className="contact-grid">

              <div className="contact-content">

                <span className="section-label">
                  CONTACT US
                </span>

                <h2>
                  We're Here To Help
                </h2>

                <p>
                  Have a question about appointments,
                  treatment or the patient portal?
                  Get in touch with Punar Axis Therapy.
                </p>


                <div className="contact-details">

                  <div>
                    <span>📞</span>

                    <div>
                      <strong>
                        Phone
                      </strong>

                      <p>
                        Contact Clinic
                      </p>
                    </div>
                  </div>


                  <div>
                    <span>📍</span>

                    <div>
                      <strong>
                        Clinic
                      </strong>

                      <p>
                        Punar Axis Therapy
                      </p>
                    </div>
                  </div>


                  <div>
                    <span>🕒</span>

                    <div>
                      <strong>
                        Working Hours
                      </strong>

                      <p>
                        Please contact clinic
                        for appointment timings.
                      </p>
                    </div>
                  </div>

                </div>

              </div>


              <div className="contact-card">

                <h3>
                  Quick Access
                </h3>

                <p>
                  Choose an option to continue.
                </p>


                <Link
                  to="/appointment"
                  className="contact-action"
                >
                  📅 Book Appointment
                  <span>→</span>
                </Link>


                <Link
                  to="/patient-login"
                  className="contact-action"
                >
                  🔐 Patient Login
                  <span>→</span>
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* ================================
          FOOTER
      ================================= */}

      <footer className="home-footer">

        <div className="footer-container">

          <div className="footer-brand">

            <Link
              to="/"
              className="home-logo"
            >
              <div className="home-logo-mark">
                <span>PA</span>
              </div>

              <div className="home-logo-text">
                <strong>PUNAR AXIS</strong>
                <span>THERAPY</span>
              </div>
            </Link>

            <p>
              Personalized therapy, rehabilitation
              and patient-focused care.
            </p>

          </div>


          <div className="footer-column">

            <h3>
              Quick Links
            </h3>

            <button
              type="button"
              onClick={() => scrollToSection("home")}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about")}
            >
              About Us
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("services")}
            >
              Services
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </button>

          </div>


          <div className="footer-column">

            <h3>
              Patient Portal
            </h3>

            <Link to="/patient-login">
              Patient Login
            </Link>

            <Link to="/appointment">
              Book Appointment
            </Link>

          </div>


          <div className="footer-column">

            <h3>
              Management
            </h3>

            <Link to="/management-login">
              Management Login
            </Link>

            <Link to="/patient-management">
              Patient Management
            </Link>

          </div>

        </div>


        <div className="footer-bottom">

          <span>
            © 2026 Punar Axis Therapy.
            All Rights Reserved.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default Home;