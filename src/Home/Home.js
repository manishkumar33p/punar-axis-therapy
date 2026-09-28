
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
                    to="/owner-dashboard"
                    onClick={closeMobileMenu}
                  >
                    <span className="dropdown-icon">
                      🤝
                    </span>

                    <div>
                      <strong>
                        Owner Dashboard
                      </strong>

                      <small>
                        Owner information & management
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