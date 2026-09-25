
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = () => {
    try {
      const authData = localStorage.getItem("clinic_patient_auth");
      const patientsData = localStorage.getItem("clinic_patients");
      const appointmentsData = localStorage.getItem(
        "clinic_appointments"
      );
      const treatmentsData = localStorage.getItem(
        "clinic_patient_treatments"
      );

      if (!authData) {
        navigate("/patient-login", { replace: true });
        return;
      }

      const auth = JSON.parse(authData);
      const patients = patientsData
        ? JSON.parse(patientsData)
        : [];
      const allAppointments = appointmentsData
        ? JSON.parse(appointmentsData)
        : [];
      const allTreatments = treatmentsData
        ? JSON.parse(treatmentsData)
        : [];

      const currentPatient = patients.find(
        (item) =>
          String(item.patientId || item.id) ===
          String(auth.patientId)
      );

      if (!currentPatient) {
        localStorage.removeItem("clinic_patient_auth");
        navigate("/patient-login", { replace: true });
        return;
      }

      const patientMobile = String(
        currentPatient.mobile || ""
      ).replace(/\D/g, "");

      const patientEmail = String(
        currentPatient.email || ""
      ).toLowerCase();

      const patientName = String(
        currentPatient.name ||
          currentPatient.patientName ||
          ""
      )
        .trim()
        .toLowerCase();

      const patientAppointments = allAppointments.filter(
        (appointment) => {
          const appointmentMobile = String(
            appointment.mobile ||
              appointment.patientMobile ||
              ""
          ).replace(/\D/g, "");

          const appointmentEmail = String(
            appointment.email || ""
          ).toLowerCase();

          const appointmentName = String(
            appointment.patientName ||
              appointment.name ||
              ""
          )
            .trim()
            .toLowerCase();

          return (
            (patientMobile &&
              appointmentMobile &&
              patientMobile === appointmentMobile) ||
            (patientEmail &&
              appointmentEmail &&
              patientEmail === appointmentEmail) ||
            (patientName &&
              appointmentName &&
              patientName === appointmentName)
          );
        }
      );

      const patientTreatments = allTreatments.filter(
        (treatment) => {
          const treatmentPatientId = String(
            treatment.patientId || ""
          );

          const treatmentMobile = String(
            treatment.mobile ||
              treatment.patientMobile ||
              ""
          ).replace(/\D/g, "");

          return (
            treatmentPatientId ===
              String(
                currentPatient.patientId ||
                  currentPatient.id
              ) ||
            (patientMobile &&
              treatmentMobile &&
              patientMobile === treatmentMobile)
          );
        }
      );

      setPatient(currentPatient);
      setAppointments(patientAppointments);
      setTreatments(patientTreatments);
    } catch (error) {
      console.error("Patient dashboard error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("clinic_patient_auth");
    navigate("/patient-login", { replace: true });
  };

  const getDateValue = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date;
  };

  const formatDate = (value) => {
    const date = getDateValue(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "—";

    return String(value);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const date = getDateValue(appointment.date);

        if (!date) return false;

        date.setHours(0, 0, 0, 0);

        return (
          date >= today &&
          String(appointment.status || "")
            .toLowerCase() !== "cancelled"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.date) - new Date(b.date)
      );
  }, [appointments]);

  const completedAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const status = String(
        appointment.status || ""
      ).toLowerCase();

      return (
        status === "completed" ||
        status === "complete"
      );
    });
  }, [appointments]);

  const nextAppointment = upcomingAppointments[0];

  const currentTreatment =
    patient?.currentTreatment ||
    patient?.treatment ||
    patient?.currentTreatmentName ||
    "No active treatment";

  const doctor =
    patient?.doctor ||
    patient?.doctorName ||
    patient?.therapist ||
    nextAppointment?.doctorName ||
    "—";

  const totalSessions = Number(
    patient?.totalSessions ||
      patient?.plannedSessions ||
      patient?.sessionsPlanned ||
      0
  );

  const completedSessions = Number(
    patient?.completedSessions ||
      patient?.sessionsCompleted ||
      0
  );

  const calculatedProgress =
    totalSessions > 0
      ? Math.min(
          100,
          Math.round(
            (completedSessions / totalSessions) * 100
          )
        )
      : 0;

  const progress =
    Number(patient?.treatmentProgress) ||
    calculatedProgress;

  const patientName =
    patient?.name ||
    patient?.patientName ||
    "Patient";

  const patientId =
    patient?.patientId ||
    patient?.id ||
    "—";

  const renderOverview = () => (
    <>
      <div className="patient-section-grid">

        <div className="patient-info-card appointment-card">
          <div className="patient-card-top">
            <div>
              <span className="patient-card-label">
                NEXT APPOINTMENT
              </span>

              <h3>
                {nextAppointment
                  ? formatDate(nextAppointment.date)
                  : "No appointment"}
              </h3>
            </div>

            <div className="patient-card-icon">📅</div>
          </div>

          {nextAppointment ? (
            <>
              <p className="patient-card-main">
                {formatTime(nextAppointment.slot)}
              </p>

              <p className="patient-card-sub">
                {nextAppointment.doctorName ||
                  doctor}
              </p>

              <span className="patient-status confirmed">
                {nextAppointment.status || "Confirmed"}
              </span>
            </>
          ) : (
            <p className="patient-empty-small">
              No upcoming appointment found.
            </p>
          )}
        </div>

        <div className="patient-info-card treatment-card">
          <div className="patient-card-top">
            <div>
              <span className="patient-card-label">
                CURRENT TREATMENT
              </span>

              <h3>{currentTreatment}</h3>
            </div>

            <div className="patient-card-icon">🩺</div>
          </div>

          <p className="patient-card-sub">
            {doctor}
          </p>

          {totalSessions > 0 ? (
            <>
              <div className="patient-progress">
                <div className="patient-progress-head">
                  <span>Treatment Progress</span>
                  <strong>{progress}%</strong>
                </div>

                <div className="patient-progress-track">
                  <div
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              </div>

              <small>
                {completedSessions} of {totalSessions} sessions
              </small>
            </>
          ) : (
            <small>
              Treatment session details will appear here.
            </small>
          )}
        </div>

      </div>

      <div className="patient-stats-grid">

        <div className="patient-stat-card">
          <span>🗓️</span>
          <div>
            <strong>{appointments.length}</strong>
            <p>Total Appointments</p>
          </div>
        </div>

        <div className="patient-stat-card">
          <span>✓</span>
          <div>
            <strong>
              {completedAppointments.length}
            </strong>
            <p>Completed Visits</p>
          </div>
        </div>

        <div className="patient-stat-card">
          <span>🩺</span>
          <div>
            <strong>{treatments.length}</strong>
            <p>Treatment Records</p>
          </div>
        </div>

        <div className="patient-stat-card">
          <span>🔄</span>
          <div>
            <strong>
              {upcomingAppointments.length}
            </strong>
            <p>Upcoming Visits</p>
          </div>
        </div>

      </div>

      <div className="patient-content-card">
        <div className="patient-content-title">
          <div>
            <span>RECENT ACTIVITY</span>
            <h3>Your Recent Appointments</h3>
          </div>

          <button
            onClick={() => setActiveTab("appointments")}
          >
            View All →
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="patient-empty-state">
            <div>📅</div>
            <h4>No appointment history</h4>
            <p>
              Your appointment history will appear here.
            </p>
          </div>
        ) : (
          <div className="patient-table-wrap">
            <table className="patient-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Treatment</th>
                  <th>Doctor</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.date) -
                      new Date(a.date)
                  )
                  .slice(0, 5)
                  .map((appointment, index) => (
                    <tr key={appointment.id || index}>
                      <td>
                        {formatDate(appointment.date)}
                      </td>

                      <td>
                        {appointment.treatment ||
                          appointment.treatmentName ||
                          "—"}
                      </td>

                      <td>
                        {appointment.doctorName ||
                          "—"}
                      </td>

                      <td>
                        <span className="patient-status">
                          {appointment.status ||
                            "Confirmed"}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );

  const renderAppointments = () => (
    <div className="patient-content-card">
      <div className="patient-content-title">
        <div>
          <span>MY APPOINTMENTS</span>
          <h3>Appointments & Schedule</h3>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="patient-empty-state">
          <div>📅</div>
          <h4>No appointments found</h4>
          <p>
            Your appointments will appear here once
            they are added by the clinic.
          </p>
        </div>
      ) : (
        <div className="patient-appointment-list">
          {appointments
            .slice()
            .sort(
              (a, b) =>
                new Date(b.date) -
                new Date(a.date)
            )
            .map((appointment, index) => (
              <div
                className="patient-appointment-item"
                key={appointment.id || index}
              >
                <div className="patient-appointment-date">
                  <strong>
                    {getDateValue(appointment.date)
                      ?.getDate() || "—"}
                  </strong>

                  <span>
                    {getDateValue(appointment.date)
                      ?.toLocaleDateString("en-IN", {
                        month: "short",
                      }) || ""}
                  </span>
                </div>

                <div className="patient-appointment-info">
                  <h4>
                    {appointment.treatment ||
                      appointment.treatmentName ||
                      "Therapy Session"}
                  </h4>

                  <p>
                    {appointment.doctorName ||
                      "Therapist"}{" "}
                    •{" "}
                    {formatTime(appointment.slot)}
                  </p>

                  <small>
                    {formatDate(appointment.date)}
                  </small>
                </div>

                <span className="patient-status">
                  {appointment.status ||
                    "Confirmed"}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderTreatments = () => (
    <div className="patient-content-card">
      <div className="patient-content-title">
        <div>
          <span>TREATMENT JOURNEY</span>
          <h3>Current & Past Treatments</h3>
        </div>
      </div>

      <div className="patient-current-treatment">
        <div className="patient-treatment-icon">
          🩺
        </div>

        <div>
          <span>ACTIVE TREATMENT</span>
          <h3>{currentTreatment}</h3>
          <p>
            Therapist: {doctor}
          </p>
        </div>

        <div className="patient-treatment-progress">
          <strong>{progress}%</strong>
          <span>Progress</span>
        </div>
      </div>

      <div className="patient-history-heading">
        <h4>Treatment History</h4>
      </div>

      {treatments.length === 0 ? (
        <div className="patient-empty-state">
          <div>🩺</div>
          <h4>No treatment history</h4>
          <p>
            Treatment records added by your therapist
            will appear here.
          </p>
        </div>
      ) : (
        <div className="patient-treatment-list">
          {treatments
            .slice()
            .sort(
              (a, b) =>
                new Date(b.date) -
                new Date(a.date)
            )
            .map((treatment, index) => (
              <div
                className="patient-treatment-item"
                key={treatment.id || index}
              >
                <div className="patient-treatment-dot">
                  ✓
                </div>

                <div className="patient-treatment-details">
                  <div className="patient-treatment-row">
                    <h4>
                      {treatment.treatment ||
                        treatment.treatmentName ||
                        "Therapy"}
                    </h4>

                    <span>
                      {formatDate(treatment.date)}
                    </span>
                  </div>

                  <p>
                    {treatment.doctor ||
                      treatment.doctorName ||
                      doctor}
                  </p>

                  {treatment.sessionNumber && (
                    <small>
                      Session {treatment.sessionNumber}
                    </small>
                  )}

                  {treatment.observation && (
                    <div className="patient-observation">
                      <strong>Observation:</strong>{" "}
                      {treatment.observation}
                    </div>
                  )}

                  {treatment.notes && (
                    <div className="patient-observation">
                      <strong>Notes:</strong>{" "}
                      {treatment.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );

  const renderBills = () => (
    <div className="patient-content-card">
      <div className="patient-content-title">
        <div>
          <span>FINANCIAL</span>
          <h3>Bills & Payments</h3>
        </div>
      </div>

      <div className="patient-empty-state">
        <div>💳</div>
        <h4>Billing section ready</h4>
        <p>
          Bills, payment status, receipts and invoices
          will appear here when billing records are
          connected to the patient account.
        </p>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="patient-content-card">
      <div className="patient-content-title">
        <div>
          <span>DOCUMENTS</span>
          <h3>Reports & Prescriptions</h3>
        </div>
      </div>

      <div className="patient-empty-state">
        <div>📄</div>
        <h4>No documents available</h4>
        <p>
          Prescriptions, medical reports and treatment
          documents uploaded by the clinic will appear
          here.
        </p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="patient-content-card">
      <div className="patient-content-title">
        <div>
          <span>MY INFORMATION</span>
          <h3>Patient Profile</h3>
        </div>
      </div>

      <div className="patient-profile-grid">

        <div>
          <label>Patient ID</label>
          <strong>{patientId}</strong>
        </div>

        <div>
          <label>Patient Name</label>
          <strong>{patientName}</strong>
        </div>

        <div>
          <label>Mobile Number</label>
          <strong>
            {patient?.mobile || "—"}
          </strong>
        </div>

        <div>
          <label>Email</label>
          <strong>
            {patient?.email || "—"}
          </strong>
        </div>

        <div>
          <label>Age</label>
          <strong>
            {patient?.age || "—"}
          </strong>
        </div>

        <div>
          <label>Gender</label>
          <strong>
            {patient?.gender || "—"}
          </strong>
        </div>

        <div>
          <label>Blood Group</label>
          <strong>
            {patient?.bloodGroup || "—"}
          </strong>
        </div>

        <div>
          <label>Registration Date</label>
          <strong>
            {formatDate(
              patient?.registrationDate ||
                patient?.createdAt
            )}
          </strong>
        </div>

        <div className="patient-profile-full">
          <label>Address</label>
          <strong>
            {patient?.address || "—"}
          </strong>
        </div>

        <div>
          <label>Emergency Contact</label>
          <strong>
            {patient?.emergencyContact || "—"}
          </strong>
        </div>

        <div>
          <label>Emergency Person</label>
          <strong>
            {patient?.emergencyName || "—"}
          </strong>
        </div>

      </div>

      <div className="patient-medical-box">
        <span>MEDICAL INFORMATION</span>

        <div className="patient-medical-grid">

          <div>
            <label>Medical History</label>
            <p>
              {patient?.medicalHistory || "No information"}
            </p>
          </div>

          <div>
            <label>Allergies</label>
            <p>
              {patient?.allergies || "No known allergies"}
            </p>
          </div>

          <div>
            <label>Current Medication</label>
            <p>
              {patient?.medications ||
                patient?.currentMedication ||
                "No information"}
            </p>
          </div>

          <div>
            <label>Previous Treatment</label>
            <p>
              {patient?.previousTreatment ||
                "No information"}
            </p>
          </div>

        </div>
      </div>
    </div>
  );

  if (!patient) {
    return (
      <div className="patient-dashboard-loading">
        <div className="patient-loader"></div>
        <p>Loading your patient portal...</p>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">

      <header className="patient-dashboard-header">
        <div className="patient-dashboard-brand">
          <div className="patient-dashboard-logo">
            P
          </div>

          <div>
            <strong>PUNAR AXIS</strong>
            <span>THERAPY • PATIENT PORTAL</span>
          </div>
        </div>

        <div className="patient-header-actions">
          <div className="patient-header-id">
            <span>Patient ID</span>
            <strong>{patientId}</strong>
          </div>

          <button
            className="patient-logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="patient-dashboard-main">

        <section className="patient-welcome">

          <div>
            <span className="patient-welcome-label">
              PATIENT DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <strong>{patientName}</strong> 👋
            </h1>

            <p>
              Everything about your therapy journey,
              appointments and treatment plan is here.
            </p>
          </div>

          <div className="patient-welcome-id">
            <span>YOUR PATIENT ID</span>
            <strong>{patientId}</strong>
          </div>

        </section>

        <nav className="patient-tabs">

          <button
            className={
              activeTab === "overview"
                ? "active"
                : ""
            }
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>

          <button
            className={
              activeTab === "appointments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("appointments")
            }
          >
            Appointments
          </button>

          <button
            className={
              activeTab === "treatments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("treatments")
            }
          >
            Treatments
          </button>

          <button
            className={
              activeTab === "bills"
                ? "active"
                : ""
            }
            onClick={() => setActiveTab("bills")}
          >
            Bills
          </button>

          <button
            className={
              activeTab === "reports"
                ? "active"
                : ""
            }
            onClick={() => setActiveTab("reports")}
          >
            Reports
          </button>

          <button
            className={
              activeTab === "profile"
                ? "active"
                : ""
            }
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>

        </nav>

        <section className="patient-dashboard-content">

          {activeTab === "overview" &&
            renderOverview()}

          {activeTab === "appointments" &&
            renderAppointments()}

          {activeTab === "treatments" &&
            renderTreatments()}

          {activeTab === "bills" &&
            renderBills()}

          {activeTab === "reports" &&
            renderReports()}

          {activeTab === "profile" &&
            renderProfile()}

        </section>

      </main>

      <footer className="patient-dashboard-footer">
        <div>
          <strong>PUNAR AXIS THERAPY</strong>
          <span>
            Patient Portal • Your care, your journey
          </span>
        </div>

        <p>
          For assistance, please contact the clinic.
        </p>
      </footer>

    </div>
  );
}

export default PatientDashboard;