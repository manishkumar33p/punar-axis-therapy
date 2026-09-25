import React, { useEffect, useMemo, useState } from "react";
import "./PatientManagement.css";

const PATIENTS_KEY = "clinic_patients";
const TREATMENTS_KEY = "clinic_patient_treatments";
const APPOINTMENTS_KEY = "clinic_appointments";

const emptyPatient = {
  name: "",
  mobile: "",
  whatsapp: "",
  email: "",
  dob: "",
  age: "",
  gender: "",
  bloodGroup: "",
  occupation: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  emergencyName: "",
  emergencyMobile: "",
  emergencyRelation: "",
  registrationDate: new Date().toISOString().split("T")[0],
  diagnosis: "",
  previousTreatment: "",
  currentTreatment: "",
  treatmentPlan: "",
  assignedDoctor: "",
  firstVisitDate: "",
  nextFollowUpDate: "",
  status: "Active",
  allergies: "",
  medications: "",
  medicalHistory: "",
  sessionsPlanned: "",
  sessionsCompleted: "",
  notes: "",
};

const emptyTreatment = {
  date: new Date().toISOString().split("T")[0],
  treatment: "",
  doctor: "",
  sessionNumber: "",
  observation: "",
  notes: "",
};

const doctors = [
  "Dr. Rahul Sharma",
  "Dr. Neha Verma",
];

const treatmentOptions = [
  "Physiotherapy",
  "Rehabilitation",
  "Pain Management",
  "Exercise Therapy",
  "Manual Therapy",
  "Electrotherapy",
  "Dry Needling",
  "Other",
];

function generatePatientId(patients) {
  let number = patients.length + 1;

  const existingNumbers = patients
    .map((patient) => {
      const match = String(patient.patientId || "").match(/PAT-(\d+)/);
      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);

  if (existingNumbers.length) {
    number = Math.max(...existingNumbers) + 1;
  }

  return `PAT-${String(number).padStart(4, "0")}`;
}

function normalizeDate(date) {
  if (!date) return "";
  return String(date).split("T")[0];
}

function isFutureDate(date) {
  const today = new Date().toISOString().split("T")[0];
  return normalizeDate(date) >= today;
}

function isPastDate(date) {
  const today = new Date().toISOString().split("T")[0];
  return normalizeDate(date) < today;
}

function formatDate(date) {
  if (!date) return "-";

  const parts = String(date).split("-");
  if (parts.length !== 3) return date;

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function getAppointmentPatientMatch(patient, appointment) {
  const patientMobile = String(patient.mobile || "").replace(/\D/g, "");
  const appointmentMobile = String(appointment.phone || "").replace(
    /\D/g,
    ""
  );

  const patientEmail = String(patient.email || "")
    .trim()
    .toLowerCase();

  const appointmentEmail = String(appointment.email || "")
    .trim()
    .toLowerCase();

  const patientName = String(patient.name || "")
    .trim()
    .toLowerCase();

  const appointmentName = String(appointment.name || "")
    .trim()
    .toLowerCase();

  if (
    patientMobile &&
    appointmentMobile &&
    patientMobile === appointmentMobile
  ) {
    return true;
  }

  if (
    patientEmail &&
    appointmentEmail &&
    patientEmail === appointmentEmail
  ) {
    return true;
  }

  if (
    patientName &&
    appointmentName &&
    patientName === appointmentName
  ) {
    return true;
  }

  return false;
}

function AppointmentsForPatient({ patient, appointments }) {
  const patientAppointments = appointments
    .filter((appointment) =>
      getAppointmentPatientMatch(patient, appointment)
    )
    .sort((a, b) =>
      String(a.date || "").localeCompare(String(b.date || ""))
    );

  if (!patientAppointments.length) {
    return (
      <div className="pm-empty">
        <div className="pm-empty-icon">📅</div>
        <h3>No appointment history</h3>
        <p>
          This patient's appointments will automatically appear here when
          they are booked from the Appointment module.
        </p>
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const upcoming = patientAppointments.filter(
    (item) => normalizeDate(item.date) >= today
  );

  const previous = patientAppointments.filter(
    (item) => normalizeDate(item.date) < today
  );

  return (
    <div className="pm-appointment-section">
      <div className="pm-section-heading">
        <div>
          <h3>Future Appointments</h3>
          <p>Upcoming appointments for this patient</p>
        </div>
        <span className="pm-count-badge">{upcoming.length}</span>
      </div>

      {upcoming.length ? (
        <div className="pm-table-wrap">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Treatment</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.slot || "-"}</td>
                  <td>{appointment.treatment || "-"}</td>
                  <td>{appointment.doctorName || "-"}</td>
                  <td>
                    <span
                      className={`pm-status ${
                        String(appointment.status || "")
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      }`}
                    >
                      {appointment.status || "Confirmed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pm-mini-empty">No future appointment found.</div>
      )}

      <div className="pm-section-heading pm-history-heading">
        <div>
          <h3>Previous Appointments</h3>
          <p>Completed / previous appointment records</p>
        </div>
        <span className="pm-count-badge">{previous.length}</span>
      </div>

      {previous.length ? (
        <div className="pm-table-wrap">
          <table className="pm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Treatment</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...previous].reverse().map((appointment) => (
                <tr key={appointment.id}>
                  <td>{formatDate(appointment.date)}</td>
                  <td>{appointment.slot || "-"}</td>
                  <td>{appointment.treatment || "-"}</td>
                  <td>{appointment.doctorName || "-"}</td>
                  <td>
                    <span className="pm-status completed">
                      {appointment.status || "Completed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="pm-mini-empty">No previous appointment found.</div>
      )}
    </div>
  );
}

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [editingPatient, setEditingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patientForm, setPatientForm] = useState(emptyPatient);
  const [treatmentForm, setTreatmentForm] = useState(emptyTreatment);

  const [profileTab, setProfileTab] = useState("Overview");

  useEffect(() => {
    const savedPatients = JSON.parse(
      localStorage.getItem(PATIENTS_KEY) || "[]"
    );

    const savedTreatments = JSON.parse(
      localStorage.getItem(TREATMENTS_KEY) || "[]"
    );

    const savedAppointments = JSON.parse(
      localStorage.getItem(APPOINTMENTS_KEY) || "[]"
    );

    setPatients(Array.isArray(savedPatients) ? savedPatients : []);
    setTreatments(Array.isArray(savedTreatments) ? savedTreatments : []);
    setAppointments(
      Array.isArray(savedAppointments) ? savedAppointments : []
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(TREATMENTS_KEY, JSON.stringify(treatments));
  }, [treatments]);

  const today = new Date().toISOString().split("T")[0];

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients
      .filter((patient) => {
        if (statusFilter !== "All" && patient.status !== statusFilter) {
          return false;
        }

        if (!query) return true;

        return [
          patient.patientId,
          patient.name,
          patient.mobile,
          patient.email,
          patient.assignedDoctor,
          patient.currentTreatment,
          patient.diagnosis,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query)
        );
      })
      .sort((a, b) =>
        String(a.name || "").localeCompare(String(b.name || ""))
      );
  }, [patients, search, statusFilter]);

  const stats = useMemo(() => {
    const active = patients.filter(
      (patient) => patient.status === "Active"
    ).length;

    const completed = patients.filter(
      (patient) => patient.status === "Completed"
    ).length;

    const todayAppointments = appointments.filter(
      (appointment) => normalizeDate(appointment.date) === today
    ).length;

    const upcomingAppointments = appointments.filter(
      (appointment) => isFutureDate(appointment.date)
    ).length;

    const followUpsDue = patients.filter((patient) => {
      return (
        patient.nextFollowUpDate &&
        normalizeDate(patient.nextFollowUpDate) <= today &&
        patient.status === "Active"
      );
    }).length;

    return {
      total: patients.length,
      active,
      todayAppointments,
      upcomingAppointments,
      followUpsDue,
      completed,
    };
  }, [patients, appointments, today]);

  const updatePatientField = (field, value) => {
    setPatientForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openAddPatient = () => {
    setEditingPatient(null);
    setPatientForm({
      ...emptyPatient,
      registrationDate: today,
    });
    setShowPatientModal(true);
  };

  const openEditPatient = (patient) => {
    setEditingPatient(patient);

    setPatientForm({
      ...emptyPatient,
      ...patient,
    });

    setShowPatientModal(true);
  };

  const closePatientModal = () => {
    setShowPatientModal(false);
    setEditingPatient(null);
    setPatientForm(emptyPatient);
  };

  const savePatient = (e) => {
    e.preventDefault();

    if (!patientForm.name.trim()) {
      alert("Please enter patient name.");
      return;
    }

    if (!patientForm.mobile.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (editingPatient) {
      const updatedPatient = {
        ...editingPatient,
        ...patientForm,
        name: patientForm.name.trim(),
        mobile: patientForm.mobile.trim(),
        updatedAt: new Date().toISOString(),
      };

      setPatients((prev) =>
        prev.map((patient) =>
          patient.patientId === editingPatient.patientId
            ? updatedPatient
            : patient
        )
      );

      if (
        selectedPatient &&
        selectedPatient.patientId === editingPatient.patientId
      ) {
        setSelectedPatient(updatedPatient);
      }

      alert("Patient record updated successfully.");
    } else {
      const newPatient = {
        patientId: generatePatientId(patients),
        ...patientForm,
        name: patientForm.name.trim(),
        mobile: patientForm.mobile.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPatients((prev) => [...prev, newPatient]);

      alert(`Patient created successfully.\nPatient ID: ${newPatient.patientId}`);
    }

    closePatientModal();
  };

  const deletePatient = (patient) => {
    const confirmed = window.confirm(
      `Delete patient ${patient.name} (${patient.patientId})?\n\nThis will also remove treatment history for this patient.`
    );

    if (!confirmed) return;

    setPatients((prev) =>
      prev.filter((item) => item.patientId !== patient.patientId)
    );

    setTreatments((prev) =>
      prev.filter((item) => item.patientId !== patient.patientId)
    );

    if (
      selectedPatient &&
      selectedPatient.patientId === patient.patientId
    ) {
      setSelectedPatient(null);
      setShowProfile(false);
    }
  };

  const openProfile = (patient, tab = "Overview") => {
    setSelectedPatient(patient);
    setProfileTab(tab);
    setShowProfile(true);
  };

  const patientTreatments = selectedPatient
    ? treatments
        .filter(
          (item) => item.patientId === selectedPatient.patientId
        )
        .sort((a, b) =>
          String(b.date || "").localeCompare(String(a.date || ""))
        )
    : [];

  const selectedPatientAppointments = selectedPatient
    ? appointments
        .filter((appointment) =>
          getAppointmentPatientMatch(selectedPatient, appointment)
        )
        .sort((a, b) =>
          String(b.date || "").localeCompare(String(a.date || ""))
        )
    : [];

  const openAddTreatment = (patient) => {
    setSelectedPatient(patient);
    setTreatmentForm({
      ...emptyTreatment,
      date: today,
      doctor: patient.assignedDoctor || "",
      treatment: patient.currentTreatment || "",
    });
    setShowTreatmentModal(true);
  };

  const closeTreatmentModal = () => {
    setShowTreatmentModal(false);
    setTreatmentForm(emptyTreatment);
  };

  const saveTreatment = (e) => {
    e.preventDefault();

    if (!selectedPatient) return;

    if (!treatmentForm.treatment.trim()) {
      alert("Please select / enter treatment.");
      return;
    }

    if (!treatmentForm.doctor.trim()) {
      alert("Please select / enter doctor.");
      return;
    }

    const record = {
      id: Date.now(),
      patientId: selectedPatient.patientId,
      patientName: selectedPatient.name,
      ...treatmentForm,
      treatment: treatmentForm.treatment.trim(),
      doctor: treatmentForm.doctor.trim(),
      createdAt: new Date().toISOString(),
    };

    setTreatments((prev) => [...prev, record]);

    setPatients((prev) =>
      prev.map((patient) => {
        if (patient.patientId !== selectedPatient.patientId) {
          return patient;
        }

        const completed =
          Number(patient.sessionsCompleted || 0) + 1;

        return {
          ...patient,
          sessionsCompleted: completed,
          currentTreatment:
            treatmentForm.treatment || patient.currentTreatment,
          assignedDoctor:
            treatmentForm.doctor || patient.assignedDoctor,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setSelectedPatient((prev) =>
      prev
        ? {
            ...prev,
            sessionsCompleted:
              Number(prev.sessionsCompleted || 0) + 1,
            currentTreatment:
              treatmentForm.treatment || prev.currentTreatment,
            assignedDoctor:
              treatmentForm.doctor || prev.assignedDoctor,
          }
        : prev
    );

    closeTreatmentModal();

    alert("Treatment record added successfully.");
  };

  const syncAppointments = () => {
    const currentPatients = [...patients];

    let added = 0;
    let updated = 0;

    appointments.forEach((appointment) => {
      const matchingIndex = currentPatients.findIndex((patient) =>
        getAppointmentPatientMatch(patient, appointment)
      );

      if (matchingIndex === -1) {
        const newPatient = {
          ...emptyPatient,
          patientId: generatePatientId(currentPatients),
          name: appointment.name || "",
          mobile: appointment.phone || "",
          email: appointment.email || "",
          age: appointment.age || "",
          gender: appointment.gender || "",
          currentTreatment: appointment.treatment || "",
          assignedDoctor: appointment.doctorName || "",
          firstVisitDate: appointment.date || "",
          registrationDate: appointment.date || today,
          status: "Active",
          notes:
            "Patient record created by Appointment Management sync.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        currentPatients.push(newPatient);
        added++;
      } else {
        const patient = currentPatients[matchingIndex];

        currentPatients[matchingIndex] = {
          ...patient,
          name: patient.name || appointment.name || "",
          mobile: patient.mobile || appointment.phone || "",
          email: patient.email || appointment.email || "",
          age: patient.age || appointment.age || "",
          gender: patient.gender || appointment.gender || "",
          currentTreatment:
            patient.currentTreatment || appointment.treatment || "",
          assignedDoctor:
            patient.assignedDoctor || appointment.doctorName || "",
          updatedAt: new Date().toISOString(),
        };

        updated++;
      }
    });

    setPatients(currentPatients);

    alert(
      `Appointment sync completed.\n\nNew patients: ${added}\nUpdated patients: ${updated}`
    );
  };

  const buildTimeline = () => {
    if (!selectedPatient) return [];

    const timeline = [];

    if (selectedPatient.registrationDate) {
      timeline.push({
        id: `registration-${selectedPatient.patientId}`,
        date: selectedPatient.registrationDate,
        type: "Registration",
        title: "Patient Registered",
        description: "Patient record was created.",
        doctor: "",
      });
    }

    selectedPatientAppointments.forEach((appointment) => {
      timeline.push({
        id: `appointment-${appointment.id}`,
        date: appointment.date,
        type: "Appointment",
        title: appointment.treatment || "Appointment",
        description: `${appointment.slot || ""}${
          appointment.status ? ` • ${appointment.status}` : ""
        }`,
        doctor: appointment.doctorName || "",
      });
    });

    patientTreatments.forEach((treatment) => {
      timeline.push({
        id: `treatment-${treatment.id}`,
        date: treatment.date,
        type: "Treatment",
        title: treatment.treatment,
        description:
          treatment.observation ||
          treatment.notes ||
          "Treatment/session completed.",
        doctor: treatment.doctor || "",
      });
    });

    if (selectedPatient.nextFollowUpDate) {
      timeline.push({
        id: `followup-${selectedPatient.patientId}`,
        date: selectedPatient.nextFollowUpDate,
        type: "Follow-up",
        title: "Next Follow-up",
        description: "Scheduled follow-up date.",
        doctor: selectedPatient.assignedDoctor || "",
      });
    }

    return timeline.sort((a, b) =>
      String(b.date || "").localeCompare(String(a.date || ""))
    );
  };

  return (
    <div className="pm-page">
      <div className="pm-container">
        {/* HEADER */}
        <div className="pm-header">
          <div>
            <div className="pm-brand">
              <span className="pm-brand-icon">✚</span>
              Punar Axis Therapy
            </div>

            <h1>Patient Management</h1>

            <p>
              Complete patient profile, treatment history, doctor history,
              appointments and follow-ups.
            </p>
          </div>

          <div className="pm-header-actions">
            <button
              className="pm-btn pm-btn-secondary"
              onClick={syncAppointments}
            >
              🔄 Sync Appointments
            </button>

            <button
              className="pm-btn pm-btn-primary"
              onClick={openAddPatient}
            >
              + Add Patient
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="pm-stats-grid">
          <div className="pm-stat-card">
            <div className="pm-stat-icon">👥</div>
            <div>
              <span>Total Patients</span>
              <strong>{stats.total}</strong>
            </div>
          </div>

          <div className="pm-stat-card">
            <div className="pm-stat-icon">🟢</div>
            <div>
              <span>Active Patients</span>
              <strong>{stats.active}</strong>
            </div>
          </div>

          <div className="pm-stat-card">
            <div className="pm-stat-icon">📅</div>
            <div>
              <span>Today's Appointments</span>
              <strong>{stats.todayAppointments}</strong>
            </div>
          </div>

          <div className="pm-stat-card">
            <div className="pm-stat-icon">⏰</div>
            <div>
              <span>Upcoming Appointments</span>
              <strong>{stats.upcomingAppointments}</strong>
            </div>
          </div>

          <div className="pm-stat-card">
            <div className="pm-stat-icon">🔔</div>
            <div>
              <span>Follow-ups Due</span>
              <strong>{stats.followUpsDue}</strong>
            </div>
          </div>

          <div className="pm-stat-card">
            <div className="pm-stat-icon">✅</div>
            <div>
              <span>Completed Patients</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="pm-filter-card">
          <div className="pm-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search Patient ID, name, mobile, doctor, treatment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            className="pm-btn pm-btn-light"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Reset
          </button>
        </div>

        {/* PATIENT TABLE */}
        <div className="pm-main-card">
          <div className="pm-card-heading">
            <div>
              <h2>Patient Directory</h2>
              <p>
                {filteredPatients.length} patient
                {filteredPatients.length === 1 ? "" : "s"} found
              </p>
            </div>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="pm-empty">
              <div className="pm-empty-icon">👤</div>
              <h3>No patients found</h3>
              <p>
                Add a patient or sync existing appointment records.
              </p>

              <button
                className="pm-btn pm-btn-primary"
                onClick={openAddPatient}
              >
                + Add First Patient
              </button>
            </div>
          ) : (
            <div className="pm-table-wrap">
              <table className="pm-table pm-patient-table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Patient</th>
                    <th>Mobile</th>
                    <th>Diagnosis / Problem</th>
                    <th>Current Treatment</th>
                    <th>Doctor</th>
                    <th>Next Follow-up</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPatients.map((patient) => {
                    const patientAppointmentCount =
                      appointments.filter((appointment) =>
                        getAppointmentPatientMatch(patient, appointment)
                      ).length;

                    return (
                      <tr key={patient.patientId}>
                        <td>
                          <span className="pm-patient-id">
                            {patient.patientId}
                          </span>
                        </td>

                        <td>
                          <div className="pm-patient-cell">
                            <div className="pm-avatar">
                              {String(patient.name || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>{patient.name}</strong>

                              <small>
                                {patient.gender || "-"}
                                {patient.age
                                  ? ` • ${patient.age} yrs`
                                  : ""}
                              </small>

                              <small>
                                {patientAppointmentCount} appointment
                                {patientAppointmentCount === 1
                                  ? ""
                                  : "s"}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>{patient.mobile || "-"}</td>

                        <td>
                          {patient.diagnosis || (
                            <span className="pm-muted">Not added</span>
                          )}
                        </td>

                        <td>
                          {patient.currentTreatment || (
                            <span className="pm-muted">Not added</span>
                          )}
                        </td>

                        <td>
                          {patient.assignedDoctor || (
                            <span className="pm-muted">Not assigned</span>
                          )}
                        </td>

                        <td>
                          {patient.nextFollowUpDate ? (
                            <span
                              className={
                                normalizeDate(
                                  patient.nextFollowUpDate
                                ) <= today
                                  ? "pm-followup-due"
                                  : ""
                              }
                            >
                              {formatDate(patient.nextFollowUpDate)}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          <span
                            className={`pm-status ${String(
                              patient.status || "Active"
                            ).toLowerCase()}`}
                          >
                            {patient.status || "Active"}
                          </span>
                        </td>

                        <td>
                          <div className="pm-action-buttons">
                            <button
                              className="pm-icon-btn"
                              title="View Profile"
                              onClick={() => openProfile(patient)}
                            >
                              👁️
                            </button>

                            <button
                              className="pm-icon-btn"
                              title="Add Treatment"
                              onClick={() =>
                                openAddTreatment(patient)
                              }
                            >
                              ➕
                            </button>

                            <button
                              className="pm-icon-btn"
                              title="Edit"
                              onClick={() =>
                                openEditPatient(patient)
                              }
                            >
                              ✏️
                            </button>

                            <button
                              className="pm-icon-btn pm-delete"
                              title="Delete"
                              onClick={() =>
                                deletePatient(patient)
                              }
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD / EDIT PATIENT MODAL */}
      {showPatientModal && (
        <div
          className="pm-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closePatientModal();
            }
          }}
        >
          <div className="pm-modal pm-large-modal">
            <div className="pm-modal-header">
              <div>
                <h2>
                  {editingPatient
                    ? "Edit Patient"
                    : "Add New Patient"}
                </h2>

                <p>
                  {editingPatient
                    ? `Patient ID: ${editingPatient.patientId}`
                    : "Create complete patient record"}
                </p>
              </div>

              <button
                className="pm-close-btn"
                onClick={closePatientModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={savePatient}>
              <div className="pm-modal-body">
                <div className="pm-form-section">
                  <h3>👤 Personal Information</h3>

                  <div className="pm-form-grid">
                    <div className="pm-field">
                      <label>Patient Name *</label>
                      <input
                        type="text"
                        value={patientForm.name}
                        onChange={(e) =>
                          updatePatientField(
                            "name",
                            e.target.value
                          )
                        }
                        placeholder="Enter patient name"
                        required
                      />
                    </div>

                    <div className="pm-field">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        value={patientForm.mobile}
                        onChange={(e) =>
                          updatePatientField(
                            "mobile",
                            e.target.value
                          )
                        }
                        placeholder="Enter mobile number"
                        required
                      />
                    </div>

                    <div className="pm-field">
                      <label>WhatsApp Number</label>
                      <input
                        type="tel"
                        value={patientForm.whatsapp}
                        onChange={(e) =>
                          updatePatientField(
                            "whatsapp",
                            e.target.value
                          )
                        }
                        placeholder="WhatsApp number"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={patientForm.email}
                        onChange={(e) =>
                          updatePatientField(
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="Email address"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={patientForm.dob}
                        onChange={(e) =>
                          updatePatientField(
                            "dob",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="pm-field">
                      <label>Age</label>
                      <input
                        type="number"
                        min="0"
                        value={patientForm.age}
                        onChange={(e) =>
                          updatePatientField(
                            "age",
                            e.target.value
                          )
                        }
                        placeholder="Age"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Gender</label>
                      <select
                        value={patientForm.gender}
                        onChange={(e) =>
                          updatePatientField(
                            "gender",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="pm-field">
                      <label>Blood Group</label>
                      <select
                        value={patientForm.bloodGroup}
                        onChange={(e) =>
                          updatePatientField(
                            "bloodGroup",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div className="pm-field">
                      <label>Occupation</label>
                      <input
                        type="text"
                        value={patientForm.occupation}
                        onChange={(e) =>
                          updatePatientField(
                            "occupation",
                            e.target.value
                          )
                        }
                        placeholder="Occupation"
                      />
                    </div>
                  </div>
                </div>

                <div className="pm-form-section">
                  <h3>📍 Address & Emergency Contact</h3>

                  <div className="pm-form-grid">
                    <div className="pm-field pm-field-full">
                      <label>Address</label>
                      <textarea
                        value={patientForm.address}
                        onChange={(e) =>
                          updatePatientField(
                            "address",
                            e.target.value
                          )
                        }
                        placeholder="Complete address"
                        rows="2"
                      />
                    </div>

                    <div className="pm-field">
                      <label>City</label>
                      <input
                        type="text"
                        value={patientForm.city}
                        onChange={(e) =>
                          updatePatientField(
                            "city",
                            e.target.value
                          )
                        }
                        placeholder="City"
                      />
                    </div>

                    <div className="pm-field">
                      <label>State</label>
                      <input
                        type="text"
                        value={patientForm.state}
                        onChange={(e) =>
                          updatePatientField(
                            "state",
                            e.target.value
                          )
                        }
                        placeholder="State"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Pincode</label>
                      <input
                        type="text"
                        value={patientForm.pincode}
                        onChange={(e) =>
                          updatePatientField(
                            "pincode",
                            e.target.value
                          )
                        }
                        placeholder="Pincode"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Emergency Contact Name</label>
                      <input
                        type="text"
                        value={patientForm.emergencyName}
                        onChange={(e) =>
                          updatePatientField(
                            "emergencyName",
                            e.target.value
                          )
                        }
                        placeholder="Emergency contact"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Emergency Mobile</label>
                      <input
                        type="tel"
                        value={patientForm.emergencyMobile}
                        onChange={(e) =>
                          updatePatientField(
                            "emergencyMobile",
                            e.target.value
                          )
                        }
                        placeholder="Emergency number"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Relation</label>
                      <input
                        type="text"
                        value={patientForm.emergencyRelation}
                        onChange={(e) =>
                          updatePatientField(
                            "emergencyRelation",
                            e.target.value
                          )
                        }
                        placeholder="Father / Mother / Spouse..."
                      />
                    </div>
                  </div>
                </div>

                <div className="pm-form-section">
                  <h3>🩺 Clinical Information</h3>

                  <div className="pm-form-grid">
                    <div className="pm-field">
                      <label>Registration Date</label>
                      <input
                        type="date"
                        value={patientForm.registrationDate}
                        onChange={(e) =>
                          updatePatientField(
                            "registrationDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="pm-field">
                      <label>First Visit Date</label>
                      <input
                        type="date"
                        value={patientForm.firstVisitDate}
                        onChange={(e) =>
                          updatePatientField(
                            "firstVisitDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="pm-field pm-field-full">
                      <label>Diagnosis / Problem</label>
                      <textarea
                        value={patientForm.diagnosis}
                        onChange={(e) =>
                          updatePatientField(
                            "diagnosis",
                            e.target.value
                          )
                        }
                        placeholder="Patient diagnosis / main problem"
                        rows="3"
                      />
                    </div>

                    <div className="pm-field pm-field-full">
                      <label>Previous Treatment / What Patient Took Before</label>
                      <textarea
                        value={patientForm.previousTreatment}
                        onChange={(e) =>
                          updatePatientField(
                            "previousTreatment",
                            e.target.value
                          )
                        }
                        placeholder="Previous treatment, therapy, medicines, sessions etc."
                        rows="3"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Current Treatment</label>
                      <select
                        value={patientForm.currentTreatment}
                        onChange={(e) =>
                          updatePatientField(
                            "currentTreatment",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Treatment</option>

                        {treatmentOptions.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pm-field">
                      <label>Assigned Doctor / Therapist</label>
                      <select
                        value={patientForm.assignedDoctor}
                        onChange={(e) =>
                          updatePatientField(
                            "assignedDoctor",
                            e.target.value
                          )
                        }
                      >
                        <option value="">
                          Select Doctor / Therapist
                        </option>

                        {doctors.map((doctor) => (
                          <option key={doctor} value={doctor}>
                            {doctor}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pm-field pm-field-full">
                      <label>Current Treatment Plan</label>
                      <textarea
                        value={patientForm.treatmentPlan}
                        onChange={(e) =>
                          updatePatientField(
                            "treatmentPlan",
                            e.target.value
                          )
                        }
                        placeholder="Treatment plan / therapy plan"
                        rows="3"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Sessions Planned</label>
                      <input
                        type="number"
                        min="0"
                        value={patientForm.sessionsPlanned}
                        onChange={(e) =>
                          updatePatientField(
                            "sessionsPlanned",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 10"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Sessions Completed</label>
                      <input
                        type="number"
                        min="0"
                        value={patientForm.sessionsCompleted}
                        onChange={(e) =>
                          updatePatientField(
                            "sessionsCompleted",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 3"
                      />
                    </div>

                    <div className="pm-field">
                      <label>Next Follow-up</label>
                      <input
                        type="date"
                        value={patientForm.nextFollowUpDate}
                        onChange={(e) =>
                          updatePatientField(
                            "nextFollowUpDate",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="pm-field">
                      <label>Patient Status</label>
                      <select
                        value={patientForm.status}
                        onChange={(e) =>
                          updatePatientField(
                            "status",
                            e.target.value
                          )
                        }
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pm-form-section">
                  <h3>💊 Medical Details</h3>

                  <div className="pm-form-grid">
                    <div className="pm-field pm-field-full">
                      <label>Allergies</label>
                      <textarea
                        value={patientForm.allergies}
                        onChange={(e) =>
                          updatePatientField(
                            "allergies",
                            e.target.value
                          )
                        }
                        placeholder="Known allergies"
                        rows="2"
                      />
                    </div>

                    <div className="pm-field pm-field-full">
                      <label>Current Medicines</label>
                      <textarea
                        value={patientForm.medications}
                        onChange={(e) =>
                          updatePatientField(
                            "medications",
                            e.target.value
                          )
                        }
                        placeholder="Current medicines"
                        rows="2"
                      />
                    </div>

                    <div className="pm-field pm-field-full">
                      <label>Medical History</label>
                      <textarea
                        value={patientForm.medicalHistory}
                        onChange={(e) =>
                          updatePatientField(
                            "medicalHistory",
                            e.target.value
                          )
                        }
                        placeholder="Previous medical history, surgeries, injuries etc."
                        rows="3"
                      />
                    </div>

                    <div className="pm-field pm-field-full">
                      <label>General Notes</label>
                      <textarea
                        value={patientForm.notes}
                        onChange={(e) =>
                          updatePatientField(
                            "notes",
                            e.target.value
                          )
                        }
                        placeholder="Additional patient notes"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pm-modal-footer">
                <button
                  type="button"
                  className="pm-btn pm-btn-light"
                  onClick={closePatientModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="pm-btn pm-btn-primary"
                >
                  {editingPatient
                    ? "Save Changes"
                    : "Create Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TREATMENT MODAL */}
      {showTreatmentModal && selectedPatient && (
        <div
          className="pm-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeTreatmentModal();
            }
          }}
        >
          <div className="pm-modal">
            <div className="pm-modal-header">
              <div>
                <h2>Add Treatment Record</h2>

                <p>
                  {selectedPatient.patientId} •{" "}
                  {selectedPatient.name}
                </p>
              </div>

              <button
                className="pm-close-btn"
                onClick={closeTreatmentModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveTreatment}>
              <div className="pm-modal-body">
                <div className="pm-form-grid">
                  <div className="pm-field">
                    <label>Treatment Date *</label>
                    <input
                      type="date"
                      value={treatmentForm.date}
                      onChange={(e) =>
                        setTreatmentForm((prev) => ({
                          ...prev,
                          date: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="pm-field">
                    <label>Treatment / Session *</label>
                    <select
                      value={treatmentForm.treatment}
                      onChange={(e) =>
                        setTreatmentForm((prev) => ({
                          ...prev,
                          treatment: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">
                        Select Treatment
                      </option>

                      {treatmentOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pm-field">
                    <label>Doctor / Therapist *</label>
                    <select
                      value={treatmentForm.doctor}
                      onChange={(e) =>
                        setTreatmentForm((prev) => ({
                          ...prev,
                          doctor: e.target.value,
                        }))
                      }
                      required
                    >
                      <option value="">
                        Select Doctor
                      </option>

                      {doctors.map((doctor) => (
                        <option key={doctor} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pm-field">
                    <label>Session Number</label>
                    <input
                      type="number"
                      min="1"
                      value={treatmentForm.sessionNumber}
                      onChange={(e) =>
                        setTreatmentForm((prev) => ({
                          ...prev,
                          sessionNumber: e.target.value,
                        }))
                      }
                      placeholder="e.g. 4"
                    />
                  </div>

                  <div className="pm-field pm-field-full">
                    <label>Observation</label>
                    <textarea
                      value={treatmentForm.observation}
                      onChange={(e) =>
                        setTreatmentForm((prev) => ({
                          ...prev,
                          observation: e.target.value,
                        }))
                      }
                      placeholder="Treatment observation / patient response"
                      rows="4"
                    />
                  </div>

                  <div className="pm-field pm-field-full">
                    <label>Treatment Notes</label>
                    <textarea
                      value={treatmentForm.notes}
                      onChange={(e) =>
                        setTreatmentForm((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Additional treatment notes"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="pm-modal-footer">
                <button
                  type="button"
                  className="pm-btn pm-btn-light"
                  onClick={closeTreatmentModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="pm-btn pm-btn-primary"
                >
                  Save Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PATIENT PROFILE */}
      {showProfile && selectedPatient && (
        <div
          className="pm-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfile(false);
            }
          }}
        >
          <div className="pm-modal pm-profile-modal">
            <div className="pm-profile-header">
              <div className="pm-profile-person">
                <div className="pm-profile-avatar">
                  {String(selectedPatient.name || "?")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <div className="pm-profile-id">
                    {selectedPatient.patientId}
                  </div>

                  <h2>{selectedPatient.name}</h2>

                  <p>
                    {selectedPatient.mobile || "-"}
                    {selectedPatient.age
                      ? ` • ${selectedPatient.age} years`
                      : ""}
                    {selectedPatient.gender
                      ? ` • ${selectedPatient.gender}`
                      : ""}
                  </p>
                </div>
              </div>

              <div className="pm-profile-header-actions">
                <button
                  className="pm-btn pm-btn-secondary"
                  onClick={() =>
                    openEditPatient(selectedPatient)
                  }
                >
                  ✏️ Edit
                </button>

                <button
                  className="pm-close-btn"
                  onClick={() => setShowProfile(false)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="pm-profile-tabs">
              {[
                "Overview",
                "Treatment History",
                "Appointments",
                "Timeline",
                "Medical",
                "Notes",
              ].map((tab) => (
                <button
                  key={tab}
                  className={
                    profileTab === tab ? "active" : ""
                  }
                  onClick={() => setProfileTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pm-profile-body">
              {/* OVERVIEW */}
              {profileTab === "Overview" && (
                <>
                  <div className="pm-profile-stat-grid">
                    <div>
                      <span>Treatments</span>
                      <strong>{patientTreatments.length}</strong>
                    </div>

                    <div>
                      <span>Appointments</span>
                      <strong>
                        {selectedPatientAppointments.length}
                      </strong>
                    </div>

                    <div>
                      <span>Sessions Completed</span>
                      <strong>
                        {selectedPatient.sessionsCompleted || 0}
                      </strong>
                    </div>

                    <div>
                      <span>Sessions Planned</span>
                      <strong>
                        {selectedPatient.sessionsPlanned || 0}
                      </strong>
                    </div>
                  </div>

                  <div className="pm-info-grid">
                    <div className="pm-info-card">
                      <h3>Personal Information</h3>

                      <InfoRow
                        label="Patient ID"
                        value={selectedPatient.patientId}
                      />
                      <InfoRow
                        label="Name"
                        value={selectedPatient.name}
                      />
                      <InfoRow
                        label="Mobile"
                        value={selectedPatient.mobile}
                      />
                      <InfoRow
                        label="WhatsApp"
                        value={selectedPatient.whatsapp}
                      />
                      <InfoRow
                        label="Email"
                        value={selectedPatient.email}
                      />
                      <InfoRow
                        label="DOB"
                        value={formatDate(selectedPatient.dob)}
                      />
                      <InfoRow
                        label="Age"
                        value={
                          selectedPatient.age
                            ? `${selectedPatient.age} years`
                            : ""
                        }
                      />
                      <InfoRow
                        label="Gender"
                        value={selectedPatient.gender}
                      />
                      <InfoRow
                        label="Blood Group"
                        value={selectedPatient.bloodGroup}
                      />
                    </div>

                    <div className="pm-info-card">
                      <h3>Clinical Information</h3>

                      <InfoRow
                        label="Diagnosis"
                        value={selectedPatient.diagnosis}
                      />
                      <InfoRow
                        label="Current Treatment"
                        value={selectedPatient.currentTreatment}
                      />
                      <InfoRow
                        label="Doctor"
                        value={selectedPatient.assignedDoctor}
                      />
                      <InfoRow
                        label="First Visit"
                        value={formatDate(
                          selectedPatient.firstVisitDate
                        )}
                      />
                      <InfoRow
                        label="Next Follow-up"
                        value={formatDate(
                          selectedPatient.nextFollowUpDate
                        )}
                      />
                      <InfoRow
                        label="Status"
                        value={selectedPatient.status}
                      />
                      <InfoRow
                        label="Registration"
                        value={formatDate(
                          selectedPatient.registrationDate
                        )}
                      />
                    </div>

                    <div className="pm-info-card">
                      <h3>Emergency Contact</h3>

                      <InfoRow
                        label="Name"
                        value={selectedPatient.emergencyName}
                      />
                      <InfoRow
                        label="Mobile"
                        value={selectedPatient.emergencyMobile}
                      />
                      <InfoRow
                        label="Relation"
                        value={selectedPatient.emergencyRelation}
                      />
                    </div>

                    <div className="pm-info-card">
                      <h3>Address</h3>

                      <p className="pm-address-text">
                        {selectedPatient.address || "Not added"}
                      </p>

                      <InfoRow
                        label="City"
                        value={selectedPatient.city}
                      />
                      <InfoRow
                        label="State"
                        value={selectedPatient.state}
                      />
                      <InfoRow
                        label="Pincode"
                        value={selectedPatient.pincode}
                      />
                    </div>
                  </div>

                  <div className="pm-profile-bottom-actions">
                    <button
                      className="pm-btn pm-btn-primary"
                      onClick={() =>
                        openAddTreatment(selectedPatient)
                      }
                    >
                      + Add Treatment Record
                    </button>

                    <button
                      className="pm-btn pm-btn-secondary"
                      onClick={() =>
                        setProfileTab("Appointments")
                      }
                    >
                      📅 View Appointments
                    </button>
                  </div>
                </>
              )}

              {/* TREATMENT HISTORY */}
              {profileTab === "Treatment History" && (
                <div>
                  <div className="pm-section-heading">
                    <div>
                      <h3>Treatment History</h3>
                      <p>
                        Every treatment/session with doctor and
                        observation
                      </p>
                    </div>

                    <button
                      className="pm-btn pm-btn-primary"
                      onClick={() =>
                        openAddTreatment(selectedPatient)
                      }
                    >
                      + Add Treatment
                    </button>
                  </div>

                  {patientTreatments.length === 0 ? (
                    <div className="pm-empty">
                      <div className="pm-empty-icon">🩺</div>
                      <h3>No treatment records</h3>
                      <p>
                        Add the patient's first treatment/session
                        record.
                      </p>
                    </div>
                  ) : (
                    <div className="pm-treatment-list">
                      {patientTreatments.map((item) => (
                        <div
                          className="pm-treatment-card"
                          key={item.id}
                        >
                          <div className="pm-treatment-date">
                            <strong>
                              {formatDate(item.date)}
                            </strong>

                            {item.sessionNumber && (
                              <span>
                                Session #{item.sessionNumber}
                              </span>
                            )}
                          </div>

                          <div className="pm-treatment-content">
                            <h3>{item.treatment}</h3>

                            <p className="pm-treatment-doctor">
                              👨‍⚕️ {item.doctor}
                            </p>

                            {item.observation && (
                              <p>
                                <strong>Observation:</strong>{" "}
                                {item.observation}
                              </p>
                            )}

                            {item.notes && (
                              <p>
                                <strong>Notes:</strong>{" "}
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* APPOINTMENTS */}
              {profileTab === "Appointments" && (
                <AppointmentsForPatient
                  patient={selectedPatient}
                  appointments={appointments}
                />
              )}

              {/* TIMELINE */}
              {profileTab === "Timeline" && (
                <div>
                  <div className="pm-section-heading">
                    <div>
                      <h3>Complete Patient Timeline</h3>
                      <p>
                        Registration → Appointment → Treatment →
                        Follow-up
                      </p>
                    </div>
                  </div>

                  {buildTimeline().length === 0 ? (
                    <div className="pm-empty">
                      <div className="pm-empty-icon">🕐</div>
                      <h3>No timeline data</h3>
                    </div>
                  ) : (
                    <div className="pm-timeline">
                      {buildTimeline().map((item) => (
                        <div
                          className="pm-timeline-item"
                          key={item.id}
                        >
                          <div className="pm-timeline-dot" />

                          <div className="pm-timeline-card">
                            <div className="pm-timeline-top">
                              <span className="pm-timeline-type">
                                {item.type}
                              </span>

                              <span>
                                {formatDate(item.date)}
                              </span>
                            </div>

                            <h3>{item.title}</h3>

                            <p>{item.description}</p>

                            {item.doctor && (
                              <small>
                                👨‍⚕️ {item.doctor}
                              </small>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* MEDICAL */}
              {profileTab === "Medical" && (
                <div className="pm-info-grid">
                  <div className="pm-info-card pm-info-card-full">
                    <h3>Previous Treatment</h3>
                    <p className="pm-long-text">
                      {selectedPatient.previousTreatment ||
                        "No previous treatment information added."}
                    </p>
                  </div>

                  <div className="pm-info-card">
                    <h3>Allergies</h3>
                    <p className="pm-long-text">
                      {selectedPatient.allergies || "None added"}
                    </p>
                  </div>

                  <div className="pm-info-card">
                    <h3>Current Medicines</h3>
                    <p className="pm-long-text">
                      {selectedPatient.medications ||
                        "None added"}
                    </p>
                  </div>

                  <div className="pm-info-card pm-info-card-full">
                    <h3>Medical History</h3>
                    <p className="pm-long-text">
                      {selectedPatient.medicalHistory ||
                        "No medical history added."}
                    </p>
                  </div>

                  <div className="pm-info-card pm-info-card-full">
                    <h3>Current Treatment Plan</h3>
                    <p className="pm-long-text">
                      {selectedPatient.treatmentPlan ||
                        "No treatment plan added."}
                    </p>
                  </div>
                </div>
              )}

              {/* NOTES */}
              {profileTab === "Notes" && (
                <div className="pm-notes-view">
                  <div className="pm-note-card">
                    <div className="pm-note-icon">📝</div>

                    <div>
                      <h3>Patient Notes</h3>

                      <p>
                        {selectedPatient.notes ||
                          "No additional notes available for this patient."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="pm-info-row">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}