import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CommonNavbar.css";

function CommonNavbar() {
  const [managementOpen, setManagementOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setManagementOpen(false);
  };

  return (
    <header className="common-navbar">
      <div className="common-nav-container">

        {/* LOGO */}
        <Link
          to="/"
          className="common-logo"
          onClick={closeMenu}
        >
          <div className="common-logo-mark">
            <span>PA</span>
          </div>

          <div className="common-logo-text">
            <strong>PUNAR AXIS</strong>
            <span>THERAPY</span>
          </div>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="common-mobile-btn"
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        {/* NAVIGATION */}
        <nav
          className={`common-nav-menu ${
            mobileMenuOpen ? "common-mobile-open" : ""
          }`}
        >
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <Link to="/appointment" onClick={closeMenu}>
            Appointment
          </Link>

          <Link to="/appointment-details" onClick={closeMenu}>
            Appointment Details
          </Link>

          <div className="common-dropdown">
            <button
              type="button"
              onClick={() => setManagementOpen((prev) => !prev)}
            >
              Management <span>▾</span>
            </button>

            {managementOpen && (
              <div className="common-dropdown-menu">

                <Link
                  to="/patient-management"
                  onClick={closeMenu}
                >
                  👤 Patient Management
                </Link>

                <Link
                  to="/employee-attendance"
                  onClick={closeMenu}
                >
                  🧑 Employee Attendance
                </Link>

                <Link
                  to="/inventory"
                  onClick={closeMenu}
                >
                  📦 Inventory
                </Link>

                <Link
                  to="/owner-dashboard"
                  onClick={closeMenu}
                >
                  🤝 Owner Dashboard
                </Link>

              </div>
            )}
          </div>

          <Link
            to="/patient-login"
            onClick={closeMenu}
          >
            Patient Portal
          </Link>
        </nav>

        {/* BOOK APPOINTMENT */}
        <Link
          to="/appointment"
          className="common-book-btn"
          onClick={closeMenu}
        >
          Book Appointment →
        </Link>

      </div>
    </header>
  );
}

export default CommonNavbar;