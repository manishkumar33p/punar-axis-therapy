import React, { useEffect, useMemo, useState } from "react";
import "./ClientManagement.css";

const CLIENT_STORAGE_KEY = "clinic_clients";
const APPOINTMENT_STORAGE_KEY = "clinic_appointments";

const doctors = [
  {
    id: "DOC001",
    name: "Dr. Rahul Sharma",
    designation: "Physiotherapist",
  },
  {
    id: "DOC002",
    name: "Dr. Neha Verma",
    designation: "Rehabilitation Therapist",
  },
];

const emptyForm = {
  name: "",
  mobile: "",
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
  diagnosis: "",
  treatmentPlan: "",
  assignedDoctor: "",
  firstVisitDate: "",
  nextFollowUpDate: "",
  status: "Active",
  allergies: "",
  medications: "",
  medicalHistory: "",
  notes: "",
};

function generateClientId(clients) {
  let number = clients.length + 1;

  while (
    clients.some(
      (client) =>
        client.clientId === `CL-${String(number).padStart(4, "0")}`
    )
  ) {
    number++;
  }

  return `CL-${String(number).padStart(4, "0")}`;
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [activeProfileTab, setActiveProfileTab] = useState("overview");

  const [clientNotes, setClientNotes] = useState("");
  const [profileNotes, setProfileNotes] = useState([]);

  useEffect(() => {
    try {
      const savedClients = JSON.parse(
        localStorage.getItem(CLIENT_STORAGE_KEY) || "[]"
      );

      const savedAppointments = JSON.parse(
        localStorage.getItem(APPOINTMENT_STORAGE_KEY) || "[]"
      );

      setClients(Array.isArray(savedClients) ? savedClients : []);
      setAppointments(
        Array.isArray(savedAppointments) ? savedAppointments : []
      );
    } catch (error) {
      console.error("Client data loading error:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CLIENT_STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const getClientAppointments = (client) => {
    if (!client) return [];

    return appointments
      .filter((appointment) => {
        const mobileMatch =
          client.mobile &&
          appointment.phone &&
          String(appointment.phone).replace(/\D/g, "") ===
            String(client.mobile).replace(/\D/g, "");

        const emailMatch =
          client.email &&
          appointment.email &&
          String(appointment.email).toLowerCase() ===
            String(client.email).toLowerCase();

        const nameMatch =
          client.name &&
          appointment.name &&
          String(appointment.name).trim().toLowerCase() ===
            String(client.name).trim().toLowerCase();

        return mobileMatch || emailMatch || nameMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date || ""}T00:00:00`).getTime();
        const dateB = new Date(`${b.date || ""}T00:00:00`).getTime();

        return dateB - dateA;
      });
  };

  const filteredClients = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return clients.filter((client) => {
      const matchesSearch =
        !keyword ||
        String(client.clientId || "").toLowerCase().includes(keyword) ||
        String(client.name || "").toLowerCase().includes(keyword) ||
        String(client.mobile || "").toLowerCase().includes(keyword) ||
        String(client.email || "").toLowerCase().includes(keyword) ||
        String(client.diagnosis || "").toLowerCase().includes(keyword) ||
        String(client.assignedDoctor || "").toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All" || client.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [clients, search, statusFilter]);

  const totalClients = clients.length;

  const activeClients = clients.filter(
    (client) => client.status === "Active"
  ).length;

  const inactiveClients = clients.filter(
    (client) => client.status === "Inactive"
  ).length;

  const completedClients = clients.filter(
    (client) => client.status === "Completed"
  ).length;

  const followUps = clients.filter(
    (client) =>
      client.nextFollowUpDate &&
      client.nextFollowUpDate >= getToday() &&
      client.status === "Active"
  ).length;

  const handleInput = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setEditingClient(null);

    setForm({
      ...emptyForm,
      firstVisitDate: getToday(),
    });

    setShowForm(true);
  };

  const openEditForm = (client) => {
    setEditingClient(client);

    setForm({
      ...emptyForm,
      ...client,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingClient(null);
    setForm(emptyForm);
  };

  const saveClient = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter client name.");
      return;
    }

    if (!form.mobile.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (!form.gender) {
      alert("Please select gender.");
      return;
    }

    if (editingClient) {
      const updatedClient = {
        ...editingClient,
        ...form,
        updatedAt: new Date().toISOString(),
      };

      setClients((prev) =>
        prev.map((client) =>
          client.clientId === editingClient.clientId
            ? updatedClient
            : client
        )
      );

      if (
        selectedClient &&
        selectedClient.clientId === editingClient.clientId
      ) {
        setSelectedClient(updatedClient);
      }

      alert("Client details updated successfully.");
    } else {
      const newClient = {
        ...form,
        clientId: generateClientId(clients),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setClients((prev) => [...prev, newClient]);

      alert(
        `Client created successfully.\nClient ID: ${newClient.clientId}`
      );
    }

    closeForm();
  };

  const deleteClient = (clientId) => {
    const client = clients.find((item) => item.clientId === clientId);

    if (!client) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.name}?\n\nThis will permanently remove this client profile from this browser.`
    );

    if (!confirmed) return;

    setClients((prev) =>
      prev.filter((item) => item.clientId !== clientId)
    );

    if (
      selectedClient &&
      selectedClient.clientId === clientId
    ) {
      setSelectedClient(null);
      setShowProfile(false);
    }
  };

  const openProfile = (client) => {
    setSelectedClient(client);
    setActiveProfileTab("overview");
    setClientNotes("");
    setProfileNotes(
      JSON.parse(
        localStorage.getItem(
          `clinic_client_notes_${client.clientId}`
        ) || "[]"
      )
    );
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
    setSelectedClient(null);
    setClientNotes("");
  };

  const saveClientNote = () => {
    if (!selectedClient || !clientNotes.trim()) {
      alert("Please enter a note.");
      return;
    }

    const newNote = {
      id: Date.now(),
      note: clientNotes.trim(),
      date: getToday(),
      time: new Date().toLocaleTimeString(),
    };

    const updatedNotes = [newNote, ...profileNotes];

    setProfileNotes(updatedNotes);

    localStorage.setItem(
      `clinic_client_notes_${selectedClient.clientId}`,
      JSON.stringify(updatedNotes)
    );

    setClientNotes("");
  };

  const deleteClientNote = (noteId) => {
    const updatedNotes = profileNotes.filter(
      (note) => note.id !== noteId
    );

    setProfileNotes(updatedNotes);

    if (selectedClient) {
      localStorage.setItem(
        `clinic_client_notes_${selectedClient.clientId}`,
        JSON.stringify(updatedNotes)
      );
    }
  };

  const calculateClientStats = (client) => {
    const clientAppointments = getClientAppointments(client);

    const completed = clientAppointments.filter(
      (item) =>
        String(item.status || "").toLowerCase() === "completed"
    ).length;

    const cancelled = clientAppointments.filter(
      (item) =>
        String(item.status || "").toLowerCase() === "cancelled"
    ).length;

    const confirmed = clientAppointments.filter(
      (item) =>
        String(item.status || "").toLowerCase() === "confirmed"
    ).length;

    return {
      total: clientAppointments.length,
      completed,
      cancelled,
      confirmed,
    };
  };

  const renderStatusBadge = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "active") {
      return <span className="cm-badge cm-active">Active</span>;
    }

    if (normalized === "inactive") {
      return <span className="cm-badge cm-inactive">Inactive</span>;
    }

    if (normalized === "completed") {
      return <span className="cm-badge cm-completed">Completed</span>;
    }

    return <span className="cm-badge">{status || "-"}</span>;
  };

  return (
    <div className="client-page">
      <div className="client-container">

        {/* HEADER */}
        <div className="client-header">
          <div>
            <div className="client-eyebrow">
              PUNAR AXIS THERAPY
            </div>

            <h1>Client Management</h1>

            <p>
              Manage complete client profiles, treatment details,
              appointments, follow-ups and clinical notes.
            </p>
          </div>

          <button
            className="cm-primary-btn"
            onClick={openAddForm}
          >
            + Add New Client
          </button>
        </div>

        {/* SUMMARY */}
        <div className="cm-summary-grid">

          <div className="cm-summary-card">
            <div className="cm-summary-icon">👥</div>
            <div>
              <span>Total Clients</span>
              <strong>{totalClients}</strong>
            </div>
          </div>

          <div className="cm-summary-card">
            <div className="cm-summary-icon">✓</div>
            <div>
              <span>Active Clients</span>
              <strong>{activeClients}</strong>
            </div>
          </div>

          <div className="cm-summary-card">
            <div className="cm-summary-icon">📅</div>
            <div>
              <span>Follow-ups</span>
              <strong>{followUps}</strong>
            </div>
          </div>

          <div className="cm-summary-card">
            <div className="cm-summary-icon">✓</div>
            <div>
              <span>Completed</span>
              <strong>{completedClients}</strong>
            </div>
          </div>

          <div className="cm-summary-card">
            <div className="cm-summary-icon">○</div>
            <div>
              <span>Inactive</span>
              <strong>{inactiveClients}</strong>
            </div>
          </div>

        </div>

        {/* SEARCH */}
        <div className="cm-toolbar">

          <div className="cm-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search by client name, ID, mobile, email, diagnosis..."
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
            className="cm-light-btn"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Reset
          </button>

        </div>

        {/* CLIENT TABLE */}
        <div className="cm-card">

          <div className="cm-card-header">
            <div>
              <h2>Client Directory</h2>
              <p>
                {filteredClients.length} client
                {filteredClients.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="cm-empty">
              <div className="cm-empty-icon">👤</div>

              <h3>No clients found</h3>

              <p>
                Add a new client to start managing client records.
              </p>

              <button
                className="cm-primary-btn"
                onClick={openAddForm}
              >
                + Add Client
              </button>
            </div>
          ) : (
            <div className="cm-table-wrapper">

              <table className="cm-table">

                <thead>
                  <tr>
                    <th>Client ID</th>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Diagnosis / Problem</th>
                    <th>Doctor / Therapist</th>
                    <th>Next Follow-up</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredClients.map((client) => {
                    const stats = calculateClientStats(client);

                    return (
                      <tr key={client.clientId}>

                        <td>
                          <strong className="cm-client-id">
                            {client.clientId}
                          </strong>
                        </td>

                        <td>
                          <div className="cm-client-name">
                            <div className="cm-avatar">
                              {client.name
                                ?.charAt(0)
                                ?.toUpperCase() || "C"}
                            </div>

                            <div>
                              <strong>{client.name}</strong>

                              <small>
                                {client.gender || "-"}
                                {client.age
                                  ? ` • ${client.age} yrs`
                                  : ""}
                              </small>

                              <small>
                                {stats.total} appointment
                                {stats.total !== 1 ? "s" : ""}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="cm-contact">
                            <span>{client.mobile || "-"}</span>

                            {client.email && (
                              <small>{client.email}</small>
                            )}
                          </div>
                        </td>

                        <td>
                          <span className="cm-diagnosis">
                            {client.diagnosis || "Not added"}
                          </span>
                        </td>

                        <td>
                          {client.assignedDoctor || "Not assigned"}
                        </td>

                        <td>
                          {client.nextFollowUpDate
                            ? formatDate(client.nextFollowUpDate)
                            : "-"}
                        </td>

                        <td>
                          {renderStatusBadge(client.status)}
                        </td>

                        <td>
                          <div className="cm-actions">

                            <button
                              className="cm-view-btn"
                              onClick={() => openProfile(client)}
                            >
                              View
                            </button>

                            <button
                              className="cm-edit-btn"
                              onClick={() => openEditForm(client)}
                            >
                              Edit
                            </button>

                            <button
                              className="cm-delete-btn"
                              onClick={() =>
                                deleteClient(client.clientId)
                              }
                            >
                              Delete
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

      {/* ADD / EDIT MODAL */}
      {showForm && (
        <div
          className="cm-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeForm();
            }
          }}
        >
          <div className="cm-modal cm-large-modal">

            <div className="cm-modal-header">
              <div>
                <span className="cm-modal-label">
                  CLIENT RECORD
                </span>

                <h2>
                  {editingClient
                    ? "Edit Client"
                    : "Add New Client"}
                </h2>
              </div>

              <button
                className="cm-close"
                onClick={closeForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={saveClient}>

              {/* PERSONAL INFORMATION */}
              <div className="cm-form-section">

                <div className="cm-section-title">
                  <span>01</span>
                  <div>
                    <h3>Personal Information</h3>
                    <p>Basic client details</p>
                  </div>
                </div>

                <div className="cm-form-grid">

                  <div className="cm-field cm-full">
                    <label>
                      Client Name *
                    </label>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleInput}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Mobile Number *</label>

                    <input
                      name="mobile"
                      value={form.mobile}
                      onChange={handleInput}
                      placeholder="Enter mobile number"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInput}
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Date of Birth</label>

                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Age</label>

                    <input
                      type="number"
                      min="0"
                      name="age"
                      value={form.age}
                      onChange={handleInput}
                      placeholder="Age"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Gender *</label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleInput}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="cm-field">
                    <label>Blood Group</label>

                    <select
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={handleInput}
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

                  <div className="cm-field">
                    <label>Occupation</label>

                    <input
                      name="occupation"
                      value={form.occupation}
                      onChange={handleInput}
                      placeholder="Occupation"
                    />
                  </div>

                </div>

              </div>

              {/* ADDRESS */}
              <div className="cm-form-section">

                <div className="cm-section-title">
                  <span>02</span>
                  <div>
                    <h3>Address Information</h3>
                    <p>Client contact address</p>
                  </div>
                </div>

                <div className="cm-form-grid">

                  <div className="cm-field cm-full">
                    <label>Address</label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleInput}
                      placeholder="Enter complete address"
                      rows="3"
                    />
                  </div>

                  <div className="cm-field">
                    <label>City</label>

                    <input
                      name="city"
                      value={form.city}
                      onChange={handleInput}
                      placeholder="City"
                    />
                  </div>

                  <div className="cm-field">
                    <label>State</label>

                    <input
                      name="state"
                      value={form.state}
                      onChange={handleInput}
                      placeholder="State"
                    />
                  </div>

                  <div className="cm-field">
                    <label>PIN Code</label>

                    <input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleInput}
                      placeholder="PIN Code"
                    />
                  </div>

                </div>

              </div>

              {/* EMERGENCY CONTACT */}
              <div className="cm-form-section">

                <div className="cm-section-title">
                  <span>03</span>
                  <div>
                    <h3>Emergency Contact</h3>
                    <p>Contact person in case of emergency</p>
                  </div>
                </div>

                <div className="cm-form-grid">

                  <div className="cm-field">
                    <label>Contact Name</label>

                    <input
                      name="emergencyName"
                      value={form.emergencyName}
                      onChange={handleInput}
                      placeholder="Emergency contact name"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Mobile Number</label>

                    <input
                      name="emergencyMobile"
                      value={form.emergencyMobile}
                      onChange={handleInput}
                      placeholder="Emergency mobile"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Relation</label>

                    <input
                      name="emergencyRelation"
                      value={form.emergencyRelation}
                      onChange={handleInput}
                      placeholder="Father / Mother / Spouse..."
                    />
                  </div>

                </div>

              </div>

              {/* CLINICAL INFORMATION */}
              <div className="cm-form-section">

                <div className="cm-section-title">
                  <span>04</span>
                  <div>
                    <h3>Clinical Information</h3>
                    <p>Treatment and medical information</p>
                  </div>
                </div>

                <div className="cm-form-grid">

                  <div className="cm-field cm-full">
                    <label>Diagnosis / Main Problem</label>

                    <textarea
                      name="diagnosis"
                      value={form.diagnosis}
                      onChange={handleInput}
                      placeholder="Enter diagnosis, pain/problem, condition..."
                      rows="3"
                    />
                  </div>

                  <div className="cm-field cm-full">
                    <label>Treatment Plan</label>

                    <textarea
                      name="treatmentPlan"
                      value={form.treatmentPlan}
                      onChange={handleInput}
                      placeholder="Enter treatment plan / therapy plan..."
                      rows="3"
                    />
                  </div>

                  <div className="cm-field">
                    <label>Assigned Doctor / Therapist</label>

                    <select
                      name="assignedDoctor"
                      value={form.assignedDoctor}
                      onChange={handleInput}
                    >
                      <option value="">
                        Select Doctor / Therapist
                      </option>

                      {doctors.map((doctor) => (
                        <option
                          key={doctor.id}
                          value={doctor.name}
                        >
                          {doctor.name} - {doctor.designation}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="cm-field">
                    <label>First Visit Date</label>

                    <input
                      type="date"
                      name="firstVisitDate"
                      value={form.firstVisitDate}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Next Follow-up Date</label>

                    <input
                      type="date"
                      name="nextFollowUpDate"
                      value={form.nextFollowUpDate}
                      onChange={handleInput}
                    />
                  </div>

                  <div className="cm-field">
                    <label>Client Status</label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleInput}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                </div>

              </div>

              {/* MEDICAL HISTORY */}
              <div className="cm-form-section">

                <div className="cm-section-title">
                  <span>05</span>
                  <div>
                    <h3>Medical History</h3>
                    <p>Important medical information</p>
                  </div>
                </div>

                <div className="cm-form-grid">

                  <div className="cm-field cm-full">
                    <label>Allergies</label>

                    <textarea
                      name="allergies"
                      value={form.allergies}
                      onChange={handleInput}
                      placeholder="Medicine / food / other allergies..."
                      rows="3"
                    />
                  </div>

                  <div className="cm-field cm-full">
                    <label>Current Medications</label>

                    <textarea
                      name="medications"
                      value={form.medications}
                      onChange={handleInput}
                      placeholder="Current medicines..."
                      rows="3"
                    />
                  </div>

                  <div className="cm-field cm-full">
                    <label>Previous Medical History</label>

                    <textarea
                      name="medicalHistory"
                      value={form.medicalHistory}
                      onChange={handleInput}
                      placeholder="Previous surgery, injury, illness, treatment..."
                      rows="4"
                    />
                  </div>

                  <div className="cm-field cm-full">
                    <label>Important Notes</label>

                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleInput}
                      placeholder="Additional client notes..."
                      rows="4"
                    />
                  </div>

                </div>

              </div>

              <div className="cm-form-footer">

                <button
                  type="button"
                  className="cm-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="cm-primary-btn"
                >
                  {editingClient
                    ? "Update Client"
                    : "Create Client"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* CLIENT PROFILE MODAL */}
      {showProfile && selectedClient && (
        <div className="cm-modal-overlay">

          <div className="cm-modal cm-profile-modal">

            <div className="cm-profile-header">

              <div className="cm-profile-person">

                <div className="cm-big-avatar">
                  {selectedClient.name
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}
                </div>

                <div>
                  <span className="cm-profile-id">
                    {selectedClient.clientId}
                  </span>

                  <h2>{selectedClient.name}</h2>

                  <p>
                    {selectedClient.gender || "-"}
                    {selectedClient.age
                      ? ` • ${selectedClient.age} years`
                      : ""}
                    {selectedClient.mobile
                      ? ` • ${selectedClient.mobile}`
                      : ""}
                  </p>
                </div>

              </div>

              <div className="cm-profile-actions">

                <button
                  className="cm-edit-btn"
                  onClick={() => {
                    closeProfile();
                    openEditForm(selectedClient);
                  }}
                >
                  Edit
                </button>

                <button
                  className="cm-close"
                  onClick={closeProfile}
                >
                  ×
                </button>

              </div>

            </div>

            <div className="cm-profile-tabs">

              <button
                className={
                  activeProfileTab === "overview"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab("overview")
                }
              >
                Overview
              </button>

              <button
                className={
                  activeProfileTab === "appointments"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab("appointments")
                }
              >
                Appointments
              </button>

              <button
                className={
                  activeProfileTab === "medical"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab("medical")
                }
              >
                Medical
              </button>

              <button
                className={
                  activeProfileTab === "notes"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab("notes")
                }
              >
                Notes
              </button>

            </div>

            <div className="cm-profile-body">

              {/* OVERVIEW */}
              {activeProfileTab === "overview" && (
                <div>

                  <div className="cm-profile-stats">

                    <div>
                      <span>Total Appointments</span>
                      <strong>
                        {
                          calculateClientStats(
                            selectedClient
                          ).total
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Completed</span>
                      <strong>
                        {
                          calculateClientStats(
                            selectedClient
                          ).completed
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Confirmed</span>
                      <strong>
                        {
                          calculateClientStats(
                            selectedClient
                          ).confirmed
                        }
                      </strong>
                    </div>

                    <div>
                      <span>Cancelled</span>
                      <strong>
                        {
                          calculateClientStats(
                            selectedClient
                          ).cancelled
                        }
                      </strong>
                    </div>

                  </div>

                  <div className="cm-info-grid">

                    <div className="cm-info-box">
                      <h4>Personal Information</h4>

                      <p>
                        <span>Client ID</span>
                        <strong>
                          {selectedClient.clientId}
                        </strong>
                      </p>

                      <p>
                        <span>Mobile</span>
                        <strong>
                          {selectedClient.mobile || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Email</span>
                        <strong>
                          {selectedClient.email || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Date of Birth</span>
                        <strong>
                          {formatDate(selectedClient.dob)}
                        </strong>
                      </p>

                      <p>
                        <span>Age</span>
                        <strong>
                          {selectedClient.age || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Gender</span>
                        <strong>
                          {selectedClient.gender || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Blood Group</span>
                        <strong>
                          {selectedClient.bloodGroup || "-"}
                        </strong>
                      </p>

                    </div>

                    <div className="cm-info-box">
                      <h4>Contact Information</h4>

                      <p>
                        <span>Address</span>
                        <strong>
                          {selectedClient.address || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>City</span>
                        <strong>
                          {selectedClient.city || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>State</span>
                        <strong>
                          {selectedClient.state || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>PIN Code</span>
                        <strong>
                          {selectedClient.pincode || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Emergency Contact</span>
                        <strong>
                          {selectedClient.emergencyName || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Emergency Mobile</span>
                        <strong>
                          {selectedClient.emergencyMobile || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Relation</span>
                        <strong>
                          {selectedClient.emergencyRelation || "-"}
                        </strong>
                      </p>

                    </div>

                    <div className="cm-info-box">

                      <h4>Treatment Information</h4>

                      <p>
                        <span>Diagnosis</span>
                        <strong>
                          {selectedClient.diagnosis || "-"}
                        </strong>
                      </p>

                      <p>
                        <span>Doctor / Therapist</span>
                        <strong>
                          {selectedClient.assignedDoctor ||
                            "-"}
                        </strong>
                      </p>

                      <p>
                        <span>First Visit</span>
                        <strong>
                          {formatDate(
                            selectedClient.firstVisitDate
                          )}
                        </strong>
                      </p>

                      <p>
                        <span>Next Follow-up</span>
                        <strong>
                          {formatDate(
                            selectedClient.nextFollowUpDate
                          )}
                        </strong>
                      </p>

                      <p>
                        <span>Status</span>
                        <strong>
                          {renderStatusBadge(
                            selectedClient.status
                          )}
                        </strong>
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* APPOINTMENTS */}
              {activeProfileTab === "appointments" && (
                <div>

                  <div className="cm-tab-heading">
                    <div>
                      <h3>Appointment History</h3>
                      <p>
                        All appointments linked with this client.
                      </p>
                    </div>
                  </div>

                  {getClientAppointments(selectedClient)
                    .length === 0 ? (
                    <div className="cm-small-empty">
                      No appointment history found.
                    </div>
                  ) : (
                    <div className="cm-appointment-list">

                      {getClientAppointments(
                        selectedClient
                      ).map((appointment) => (
                        <div
                          className="cm-appointment-row"
                          key={appointment.id}
                        >

                          <div className="cm-appointment-date">
                            <strong>
                              {formatDate(
                                appointment.date
                              )}
                            </strong>

                            <span>
                              {appointment.slot || "-"}
                            </span>
                          </div>

                          <div>
                            <strong>
                              {appointment.treatment ||
                                "Treatment / Session"}
                            </strong>

                            <small>
                              {appointment.doctorName ||
                                "Doctor not available"}
                            </small>
                          </div>

                          <span
                            className={`cm-appointment-status ${
                              String(
                                appointment.status || ""
                              ).toLowerCase()
                            }`}
                          >
                            {appointment.status || "-"}
                          </span>

                        </div>
                      ))}

                    </div>
                  )}

                </div>
              )}

              {/* MEDICAL */}
              {activeProfileTab === "medical" && (
                <div className="cm-medical-grid">

                  <div className="cm-medical-box">
                    <span>Diagnosis / Main Problem</span>
                    <p>
                      {selectedClient.diagnosis ||
                        "No diagnosis added."}
                    </p>
                  </div>

                  <div className="cm-medical-box">
                    <span>Treatment Plan</span>
                    <p>
                      {selectedClient.treatmentPlan ||
                        "No treatment plan added."}
                    </p>
                  </div>

                  <div className="cm-medical-box">
                    <span>Allergies</span>
                    <p>
                      {selectedClient.allergies ||
                        "No allergies recorded."}
                    </p>
                  </div>

                  <div className="cm-medical-box">
                    <span>Current Medications</span>
                    <p>
                      {selectedClient.medications ||
                        "No medications recorded."}
                    </p>
                  </div>

                  <div className="cm-medical-box cm-full">
                    <span>Previous Medical History</span>
                    <p>
                      {selectedClient.medicalHistory ||
                        "No previous medical history recorded."}
                    </p>
                  </div>

                  <div className="cm-medical-box cm-full">
                    <span>Important Notes</span>
                    <p>
                      {selectedClient.notes ||
                        "No important notes added."}
                    </p>
                  </div>

                </div>
              )}

              {/* NOTES */}
              {activeProfileTab === "notes" && (
                <div>

                  <div className="cm-note-input">

                    <textarea
                      value={clientNotes}
                      onChange={(e) =>
                        setClientNotes(e.target.value)
                      }
                      placeholder="Add a new client note, treatment observation, follow-up note..."
                      rows="4"
                    />

                    <button
                      className="cm-primary-btn"
                      onClick={saveClientNote}
                    >
                      + Add Note
                    </button>

                  </div>

                  <div className="cm-notes-list">

                    {profileNotes.length === 0 ? (
                      <div className="cm-small-empty">
                        No notes added yet.
                      </div>
                    ) : (
                      profileNotes.map((note) => (
                        <div
                          className="cm-note-card"
                          key={note.id}
                        >

                          <div>
                            <p>{note.note}</p>

                            <small>
                              {formatDate(note.date)} •{" "}
                              {note.time}
                            </small>
                          </div>

                          <button
                            onClick={() =>
                              deleteClientNote(note.id)
                            }
                          >
                            Delete
                          </button>

                        </div>
                      ))
                    )}

                  </div>

                </div>
              )}

            </div>

            <div className="cm-profile-footer">

              <button
                className="cm-delete-btn large"
                onClick={() =>
                  deleteClient(selectedClient.clientId)
                }
              >
                Delete Client
              </button>

              <button
                className="cm-cancel-btn"
                onClick={closeProfile}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ClientManagement;