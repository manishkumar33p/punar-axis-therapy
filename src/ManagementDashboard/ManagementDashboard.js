// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase";
// import "./ManagementDashboard.css";

// const read = (key) => {
//   try {
//     const value = JSON.parse(localStorage.getItem(key) || "[]");
//     return Array.isArray(value) ? value : [];
//   } catch {
//     return [];
//   }
// };

// const today = () => new Date().toISOString().split("T")[0];

// function ManagementDashboard() {
//   const navigate = useNavigate();
//   const [tick, setTick] = useState(0);
//   const [loggingOut, setLoggingOut] = useState(false);

//   useEffect(() => {
//     const refresh = () => setTick((value) => value + 1);

//     window.addEventListener("clinic-cloud-update", refresh);
//     window.addEventListener("storage", refresh);

//     return () => {
//       window.removeEventListener("clinic-cloud-update", refresh);
//       window.removeEventListener("storage", refresh);
//     };
//   }, []);

//   const data = useMemo(() => {
//     const appointments = read("clinic_appointments");
//     const patients = read("clinic_patients");
//     const employees = read("clinic_employees");
//     const attendance = read("clinic_employee_attendance");
//     const inventory = read("clinic_inventory_items");
//     const clients = read("clinic_clients");

//     const date = today();

//     const todayAppointments = appointments.filter(
//       (item) =>
//         String(item.date || "").split("T")[0] === date &&
//         item.status !== "Cancelled"
//     );

//     const upcoming = appointments.filter(
//       (item) =>
//         String(item.date || "").split("T")[0] >= date &&
//         item.status !== "Cancelled"
//     );

//     const revenue = appointments
//       .filter((item) => item.status !== "Cancelled")
//       .reduce((sum, item) => sum + Number(item.amount || 0), 0);

//     const present = attendance.filter(
//       (item) =>
//         item.date === date &&
//         item.type === "Present"
//     ).length;

//     const lowStock = inventory.filter(
//       (item) =>
//         Number(item.stock || 0) <= Number(item.minimumStock || 0)
//     );

//     return {
//       appointments,
//       patients,
//       employees,
//       clients,
//       todayAppointments,
//       upcoming,
//       revenue,
//       present,
//       lowStock,
//     };
//   }, [tick]);

//   /*
//   |--------------------------------------------------------------------------
//   | FIREBASE ADMIN LOGOUT
//   |--------------------------------------------------------------------------
//   */

//   const handleLogout = async () => {
//     if (loggingOut) return;

//     try {
//       setLoggingOut(true);

//       // Firebase Admin session completely sign out
//       await signOut(auth);

//       // Go to management login
//       navigate("/management-login", {
//         replace: true,
//       });
//     } catch (error) {
//       console.error("Firebase logout error:", error);

//       alert(
//         error?.message ||
//           "Logout failed. Please try again."
//       );

//       setLoggingOut(false);
//     }
//   };

//   const cards = [
//     [
//       "Today’s Appointments",
//       data.todayAppointments.length,
//       "Confirmed / active bookings",
//       "/appointment-details",
//       "📅",
//     ],
//     [
//       "Total Patients",
//       data.patients.length,
//       "Central patient records",
//       "/patient-management",
//       "👤",
//     ],
//     [
//       "Upcoming",
//       data.upcoming.length,
//       "Future active appointments",
//       "/appointment-details",
//       "🗓️",
//     ],
//     [
//       "Appointment Value",
//       `₹${data.revenue.toLocaleString("en-IN")}`,
//       "Across active appointments",
//       "/appointment-details",
//       "₹",
//     ],
//     [
//       "Employees Present",
//       data.present,
//       "Today’s attendance",
//       "/employee-attendance",
//       "✓",
//     ],
//     [
//       "Low Stock",
//       data.lowStock.length,
//       "Inventory attention needed",
//       "/inventory",
//       "📦",
//     ],
//   ];

//   return (
//     <div className="management-dashboard-page">

//       {/* ============================================================
//           HEADER
//       ============================================================ */}

//       <header className="management-dashboard-header">

//         <div>
//           <span className="management-eyebrow">
//             PUNAR AXIS THERAPY
//           </span>

//           <h1>Management Overview</h1>

//           <p>
//             Central clinic control room • cloud-connected workspace
//           </p>
//         </div>

//         <div className="management-header-actions">

//           <span className="cloud-live-pill">
//             <i />
//             Cloud database
//           </span>

//           <button
//             type="button"
//             onClick={handleLogout}
//             disabled={loggingOut}
//           >
//             {loggingOut ? "Signing out..." : "Sign out"}
//           </button>

//         </div>

//       </header>

//       {/* ============================================================
//           MAIN
//       ============================================================ */}

//       <main className="management-dashboard-content">

//         {/* HERO */}

//         <section className="management-hero-card">

//           <div>
//             <span>CLINIC CONTROL CENTER</span>

//             <h2>
//               Everything important, at a glance.
//             </h2>

//             <p>
//               Appointments, patients, team activity and inventory
//               are connected to the same clinic workspace.
//             </p>
//           </div>

//           <div className="management-hero-date">

//             <strong>
//               {new Date().toLocaleDateString(
//                 "en-IN",
//                 {
//                   weekday: "long",
//                 }
//               )}
//             </strong>

//             <span>
//               {new Date().toLocaleDateString(
//                 "en-IN",
//                 {
//                   day: "2-digit",
//                   month: "long",
//                   year: "numeric",
//                 }
//               )}
//             </span>

//           </div>

//         </section>

//         {/* ============================================================
//             STATISTICS
//         ============================================================ */}

//         <section className="management-stat-grid">

//           {cards.map(
//             ([title, value, sub, href, icon]) => (

//               <Link
//                 className="management-stat-card"
//                 to={href}
//                 key={title}
//               >

//                 <div className="management-stat-icon">
//                   {icon}
//                 </div>

//                 <div>

//                   <span>{title}</span>

//                   <strong>{value}</strong>

//                   <small>{sub}</small>

//                 </div>

//               </Link>

//             )
//           )}

//         </section>

//         {/* ============================================================
//             DASHBOARD GRID
//         ============================================================ */}

//         <section className="management-dashboard-grid">

//           {/* UPCOMING APPOINTMENTS */}

//           <div className="management-panel">

//             <div className="management-panel-heading">

//               <div>
//                 <span>UPCOMING</span>
//                 <h3>Next appointments</h3>
//               </div>

//               <Link to="/appointment-details">
//                 View all →
//               </Link>

//             </div>

//             <div className="management-list">

//               {data.upcoming
//                 .slice(0, 6)
//                 .map((appointment) => (

//                   <div
//                     className="management-list-row"
//                     key={
//                       String(
//                         appointment.id ||
//                         appointment.firestoreId ||
//                         Math.random()
//                       )
//                     }
//                   >

//                     <div className="list-avatar">
//                       {String(
//                         appointment.name || "P"
//                       )
//                         .charAt(0)
//                         .toUpperCase()}
//                     </div>

//                     <div className="list-main">

//                       <strong>
//                         {appointment.name || "Patient"}
//                       </strong>

//                       <span>
//                         {appointment.doctorName || "Doctor"}
//                         {" • "}
//                         {appointment.treatment || "Treatment"}
//                       </span>

//                     </div>

//                     <div className="list-meta">

//                       <strong>
//                         {appointment.date || "-"}
//                       </strong>

//                       <span>
//                         {appointment.slot || "-"}
//                       </span>

//                     </div>

//                   </div>

//                 ))}

//               {!data.upcoming.length && (
//                 <div className="management-empty">
//                   No upcoming appointments yet.
//                 </div>
//               )}

//             </div>

//           </div>

//           {/* QUICK ACCESS */}

//           <div className="management-panel quick-panel">

//             <div className="management-panel-heading">

//               <div>
//                 <span>QUICK ACCESS</span>
//                 <h3>Clinic modules</h3>
//               </div>

//             </div>

//             <div className="quick-links">

//               <Link to="/appointment">
//                 + New appointment
//               </Link>

//               <Link to="/patient-management">
//                 Patient management
//               </Link>

//               <Link to="/client-management">
//                 Client management
//               </Link>

//               <Link to="/employee-attendance">
//                 Employee attendance
//               </Link>

//               <Link to="/inventory">
//                 Inventory & stock
//               </Link>

//               <Link to="/patient-login">
//                 Patient portal
//               </Link>

//             </div>

//             <div className="quick-summary">

//               <strong>
//                 {data.clients.length}
//               </strong>

//               <span>
//                 client records
//               </span>

//               <strong>
//                 {data.employees.length}
//               </strong>

//               <span>
//                 employees
//               </span>

//             </div>

//           </div>

//         </section>

//       </main>

//     </div>
//   );
// }

// export default ManagementDashboard;


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "./ManagementDashboard.css";

const today = () => {
  return new Date().toISOString().split("T")[0];
};

function ManagementDashboard() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | FIRESTORE REALTIME DATA
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let loaded = 0;

    const markLoaded = () => {
      loaded += 1;

      if (loaded >= 6) {
        setLoading(false);
      }
    };

    const handleError = (name, error) => {
      console.error(`Firestore ${name} error:`, error);
      markLoaded();
    };

    // ---------------------------------------------------------
    // APPOINTMENTS
    // ---------------------------------------------------------

    const unsubscribeAppointments = onSnapshot(
      collection(db, "appointments"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          firestoreId: item.id,
          ...item.data(),
        }));

        setAppointments(data);
        markLoaded();
      },
      (error) => handleError("appointments", error)
    );

    // ---------------------------------------------------------
    // PATIENTS
    // ---------------------------------------------------------

    const unsubscribePatients = onSnapshot(
      collection(db, "patients"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          firestoreId: item.id,
          ...item.data(),
        }));

        setPatients(data);
        markLoaded();
      },
      (error) => handleError("patients", error)
    );

    // ---------------------------------------------------------
    // EMPLOYEES
    // ---------------------------------------------------------

    const unsubscribeEmployees = onSnapshot(
      collection(db, "employees"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          firestoreId: item.id,
          ...item.data(),
        }));

        setEmployees(data);
        markLoaded();
      },
      (error) => handleError("employees", error)
    );

    // ---------------------------------------------------------
    // ATTENDANCE
    // ---------------------------------------------------------

    const unsubscribeAttendance = onSnapshot(
      collection(db, "employeeAttendance"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          firestoreId: item.id,
          ...item.data(),
        }));

        setAttendance(data);
        markLoaded();
      },
      (error) => handleError("employeeAttendance", error)
    );

    // ---------------------------------------------------------
    // INVENTORY
    // ---------------------------------------------------------

    const unsubscribeInventory = onSnapshot(
      collection(db, "inventoryItems"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          firestoreId: item.id,
          ...item.data(),
        }));

        setInventory(data);
        markLoaded();
      },
      (error) => handleError("inventoryItems", error)
    );

    // ---------------------------------------------------------
    // CLIENTS
    // ---------------------------------------------------------

    const unsubscribeClients = onSnapshot(
      collection(db, "clients"),
      (snapshot) => {
        const data = snapshot.docs.map((item) => ({
          firestoreId: item.id,
          ...item.data(),
        }));

        setClients(data);
        markLoaded();
      },
      (error) => handleError("clients", error)
    );

    return () => {
      unsubscribeAppointments();
      unsubscribePatients();
      unsubscribeEmployees();
      unsubscribeAttendance();
      unsubscribeInventory();
      unsubscribeClients();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD CALCULATIONS
  |--------------------------------------------------------------------------
  */

  const date = today();

  const todayAppointments = appointments.filter((item) => {
    const appointmentDate = String(item.date || "").split("T")[0];

    return (
      appointmentDate === date &&
      item.status !== "Cancelled"
    );
  });

  const upcoming = appointments
    .filter((item) => {
      const appointmentDate = String(item.date || "").split("T")[0];

      return (
        appointmentDate >= date &&
        item.status !== "Cancelled"
      );
    })
    .sort((a, b) => {
      const dateA = `${a.date || ""} ${a.slot || ""}`;
      const dateB = `${b.date || ""} ${b.slot || ""}`;

      return dateA.localeCompare(dateB);
    });

  const revenue = appointments
    .filter((item) => item.status !== "Cancelled")
    .reduce((sum, item) => {
      return sum + Number(item.amount || 0);
    }, 0);

  const present = attendance.filter((item) => {
    const attendanceDate = String(
      item.date || ""
    ).split("T")[0];

    const type = String(
      item.type ||
      item.status ||
      item.attendanceStatus ||
      ""
    ).toLowerCase();

    return (
      attendanceDate === date &&
      (
        type === "present" ||
        type === "checked-in" ||
        type === "check-in"
      )
    );
  }).length;

  const lowStock = inventory.filter((item) => {
    const stock = Number(
      item.stock ??
      item.currentStock ??
      item.quantity ??
      0
    );

    const minimumStock = Number(
      item.minimumStock ??
      item.minStock ??
      item.minimum ??
      0
    );

    return stock <= minimumStock;
  });

  /*
  |--------------------------------------------------------------------------
  | FIREBASE LOGOUT
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await signOut(auth);

      navigate("/management-login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);

      alert(
        error?.message ||
          "Logout failed. Please try again."
      );

      setLoggingOut(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STAT CARDS
  |--------------------------------------------------------------------------
  */

  const cards = [
    {
      title: "Today’s Appointments",
      value: todayAppointments.length,
      sub: "Confirmed / active bookings",
      href: "/appointment-details",
      icon: "📅",
    },
    {
      title: "Total Patients",
      value: patients.length,
      sub: "Central patient records",
      href: "/patient-management",
      icon: "👤",
    },
    {
      title: "Upcoming",
      value: upcoming.length,
      sub: "Future active appointments",
      href: "/appointment-details",
      icon: "🗓️",
    },
    {
      title: "Appointment Value",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      sub: "Across active appointments",
      href: "/appointment-details",
      icon: "₹",
    },
    {
      title: "Employees Present",
      value: present,
      sub: "Today’s attendance",
      href: "/employee-attendance",
      icon: "✓",
    },
    {
      title: "Low Stock",
      value: lowStock.length,
      sub: "Inventory attention needed",
      href: "/inventory",
      icon: "📦",
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | LOADING SCREEN
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f4ef",
          color: "#1d3b36",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 34,
              marginBottom: 14,
            }}
          >
            ✦
          </div>

          <strong
            style={{
              fontSize: 18,
            }}
          >
            Loading clinic dashboard...
          </strong>

          <div
            style={{
              marginTop: 8,
              opacity: 0.7,
              fontSize: 14,
            }}
          >
            Connecting to cloud database
          </div>
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DASHBOARD
  |--------------------------------------------------------------------------
  */

  return (
    <div className="management-dashboard-page">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="management-dashboard-header">

        <div>
          <span className="management-eyebrow">
            PUNAR AXIS THERAPY
          </span>

          <h1>
            Management Overview
          </h1>

          <p>
            Central clinic control room • cloud-connected workspace
          </p>
        </div>

        <div className="management-header-actions">

          <span className="cloud-live-pill">
            <i />
            Cloud database
          </span>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut
              ? "Signing out..."
              : "Sign out"}
          </button>

        </div>

      </header>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main className="management-dashboard-content">

        {/* HERO */}

        <section className="management-hero-card">

          <div>

            <span>
              CLINIC CONTROL CENTER
            </span>

            <h2>
              Everything important, at a glance.
            </h2>

            <p>
              Appointments, patients, team activity
              and inventory are connected to the
              same clinic workspace.
            </p>

          </div>

          <div className="management-hero-date">

            <strong>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                }
              )}
            </strong>

            <span>
              {new Date().toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>

          </div>

        </section>

        {/* =========================================================
            STATISTICS
        ========================================================= */}

        <section className="management-stat-grid">

          {cards.map((card) => (

            <Link
              className="management-stat-card"
              to={card.href}
              key={card.title}
            >

              <div className="management-stat-icon">
                {card.icon}
              </div>

              <div>

                <span>
                  {card.title}
                </span>

                <strong>
                  {card.value}
                </strong>

                <small>
                  {card.sub}
                </small>

              </div>

            </Link>

          ))}

        </section>

        {/* =========================================================
            DASHBOARD LOWER SECTION
        ========================================================= */}

        <section className="management-dashboard-grid">

          {/* =======================================================
              UPCOMING APPOINTMENTS
          ======================================================= */}

          <div className="management-panel">

            <div className="management-panel-heading">

              <div>

                <span>
                  UPCOMING
                </span>

                <h3>
                  Next appointments
                </h3>

              </div>

              <Link to="/appointment-details">
                View all →
              </Link>

            </div>

            <div className="management-list">

              {upcoming
                .slice(0, 6)
                .map((appointment) => {

                  const appointmentKey =
                    appointment.firestoreId ||
                    appointment.id ||
                    `${appointment.name}-${appointment.date}-${appointment.slot}`;

                  return (
                    <div
                      className="management-list-row"
                      key={String(appointmentKey)}
                    >

                      <div className="list-avatar">

                        {String(
                          appointment.name ||
                          "P"
                        )
                          .charAt(0)
                          .toUpperCase()}

                      </div>

                      <div className="list-main">

                        <strong>
                          {appointment.name ||
                            "Patient"}
                        </strong>

                        <span>
                          {appointment.doctorName ||
                            "Doctor"}

                          {" • "}

                          {appointment.treatment ||
                            "Treatment"}
                        </span>

                      </div>

                      <div className="list-meta">

                        <strong>
                          {appointment.date ||
                            "-"}
                        </strong>

                        <span>
                          {appointment.slot ||
                            "-"}
                        </span>

                      </div>

                    </div>
                  );
                })}

              {!upcoming.length && (
                <div className="management-empty">
                  No upcoming appointments yet.
                </div>
              )}

            </div>

          </div>

          {/* =======================================================
              QUICK ACCESS
          ======================================================= */}

          <div className="management-panel quick-panel">

            <div className="management-panel-heading">

              <div>

                <span>
                  QUICK ACCESS
                </span>

                <h3>
                  Clinic modules
                </h3>

              </div>

            </div>

            <div className="quick-links">

              <Link to="/appointment">
                + New appointment
              </Link>

              <Link to="/patient-management">
                Patient management
              </Link>

              <Link to="/client-management">
                Client management
              </Link>

              <Link to="/employee-attendance">
                Employee attendance
              </Link>

              <Link to="/inventory">
                Inventory & stock
              </Link>

              <Link to="/patient-login">
                Patient portal
              </Link>

            </div>

            <div className="quick-summary">

              <strong>
                {clients.length}
              </strong>

              <span>
                client records
              </span>

              <strong>
                {employees.length}
              </strong>

              <span>
                employees
              </span>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default ManagementDashboard;