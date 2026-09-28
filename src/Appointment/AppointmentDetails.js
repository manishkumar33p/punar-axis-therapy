import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./AppointmentDetails.css";

const STORAGE_KEY = "clinic_appointments";

const DOCTORS = [
  {
    id: "DOC001",
    name: "Dr. Vikas",
    specialization: "Physiotherapist",
    startHour: 8,
    startMinute: 0,
    endHour: 14,
    endMinute: 0,
  },
  {
    id: "DOC002",
    name: "Dr. Shahnaz",
    specialization: "Physiotherapist",
    startHour: 14,
    startMinute: 0,
    endHour: 19,
    endMinute: 0,
  },
  {
    id: "DOC003",
    name: "Dr. Ankush",
    specialization: "Ayurvedic Specialist",
    startHour: 9,
    startMinute: 30,
    endHour: 17,
    endMinute: 30,
  },
];

const generateSlots = (
  startHour,
  startMinute,
  endHour,
  endMinute
) => {
  const slots = [];

  let current = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  while (current < end) {
    const hour = Math.floor(current / 60);
    const minute = current % 60;

    const date = new Date();
    date.setHours(hour);
    date.setMinutes(minute);
    date.setSeconds(0);
    date.setMilliseconds(0);

    slots.push(
      date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );

    current += 15;
  }

  return slots;
};

const getDoctorById = (id) => {
  return DOCTORS.find((doctor) => doctor.id === id);
};

const getDoctorByName = (name) => {
  if (!name) return null;

  return DOCTORS.find(
    (doctor) =>
      doctor.name.toLowerCase() === String(name).toLowerCase()
  );
};

const normalizeAppointment = (appointment, index) => {
  let doctorId =
    appointment.doctorId ||
    appointment.doctorID ||
    appointment.doctor_id ||
    "";

  let doctorName =
    appointment.doctorName ||
    appointment.doctor_name ||
    "";

  const doctorValue = appointment.doctor || "";

  if (!doctorId && doctorValue) {
    const doctorById = getDoctorById(doctorValue);

    if (doctorById) {
      doctorId = doctorById.id;
      doctorName = doctorById.name;
    } else {
      const doctorByName = getDoctorByName(doctorValue);

      if (doctorByName) {
        doctorId = doctorByName.id;
        doctorName = doctorByName.name;
      } else {
        doctorName = doctorValue;
      }
    }
  }

  if (doctorId && !doctorName) {
    const doctor = getDoctorById(doctorId);

    if (doctor) {
      doctorName = doctor.name;
    }
  }

  if (doctorName && !doctorId) {
    const doctor = getDoctorByName(doctorName);

    if (doctor) {
      doctorId = doctor.id;
      doctorName = doctor.name;
    }
  }

  return {
    ...appointment,

    id:
      appointment.id ||
      appointment.appointmentId ||
      appointment.appointmentID ||
      `APT-${Date.now()}-${index}`,

    name:
      appointment.name ||
      appointment.patientName ||
      appointment.patient ||
      appointment.fullName ||
      "Unknown Patient",

    phone:
      appointment.phone ||
      appointment.mobile ||
      appointment.mobileNumber ||
      appointment.contact ||
      "",

    email:
      appointment.email ||
      appointment.patientEmail ||
      "",

    age:
      appointment.age ||
      appointment.patientAge ||
      "",

    gender:
      appointment.gender ||
      appointment.patientGender ||
      "",

    city:
      appointment.city ||
      "",

    treatment:
      appointment.treatment ||
      appointment.service ||
      appointment.problem ||
      appointment.reason ||
      "",

    date:
      appointment.date ||
      appointment.appointmentDate ||
      "",

    slot:
      appointment.slot ||
      appointment.time ||
      appointment.appointmentTime ||
      "",

    doctorId,
    doctorName: doctorName || "Doctor Not Assigned",

    status:
      appointment.status ||
      appointment.appointmentStatus ||
      "Confirmed",

    createdAt:
      appointment.createdAt ||
      appointment.created_at ||
      new Date().toISOString(),
  };
};

const loadAppointments = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item, index) =>
      normalizeAppointment(item, index)
    );
  } catch (error) {
    console.error("Appointment loading error:", error);
    return [];
  }
};

const saveAppointments = (appointments) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(appointments)
    );

    window.dispatchEvent(
      new Event("clinicAppointmentsUpdated")
    );

    return true;
  } catch (error) {
    console.error("Appointment saving error:", error);
    return false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "Not Available";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCreatedAt = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (value.includes("cancel")) {
    return "cancelled";
  }

  if (value.includes("complete")) {
    return "completed";
  }

  if (value.includes("pending")) {
    return "pending";
  }

  return "confirmed";
};

const isSlotBooked = (
  appointments,
  date,
  slot,
  doctorId,
  doctorName,
  currentAppointmentId = null
) => {
  return appointments.some((appointment) => {
    if (
      currentAppointmentId &&
      appointment.id === currentAppointmentId
    ) {
      return false;
    }

    const status = String(
      appointment.status || ""
    ).toLowerCase();

    if (status.includes("cancel")) {
      return false;
    }

    if (appointment.date !== date) {
      return false;
    }

    if (appointment.slot !== slot) {
      return false;
    }

    return (
      appointment.doctorId === doctorId ||
      appointment.doctorName === doctorName
    );
  });
};

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

function AppointmentDetails() {
  const [appointments, setAppointments] = useState([]);

  const [search, setSearch] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [rescheduleAppointment, setRescheduleAppointment] =
    useState(null);

  const [rescheduleDate, setRescheduleDate] = useState("");

  const [rescheduleSlot, setRescheduleSlot] = useState("");

  const [showDetails, setShowDetails] = useState(false);

  const [showReschedule, setShowReschedule] =
    useState(false);

  const itemsPerPage = 10;

  const refreshAppointments = () => {
    const data = loadAppointments();
    setAppointments(data);
  };

  useEffect(() => {
    refreshAppointments();

    const handleStorage = (event) => {
      if (
        !event.key ||
        event.key === STORAGE_KEY
      ) {
        refreshAppointments();
      }
    };

    const handleCustomUpdate = () => {
      refreshAppointments();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "clinicAppointmentsUpdated",
      handleCustomUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "clinicAppointmentsUpdated",
        handleCustomUpdate
      );
    };
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length;

    const confirmed = appointments.filter(
      (appointment) =>
        !String(
          appointment.status || ""
        )
          .toLowerCase()
          .includes("cancel")
    ).length;

    const cancelled = appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        )
          .toLowerCase()
          .includes("cancel")
    ).length;

    const completed = appointments.filter(
      (appointment) =>
        String(
          appointment.status || ""
        )
          .toLowerCase()
          .includes("complete")
    ).length;

    const dates = new Set(
      appointments
        .map((appointment) => appointment.date)
        .filter(Boolean)
    ).size;

    return {
      total,
      confirmed,
      cancelled,
      completed,
      dates,
    };
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return appointments
      .filter((appointment) => {
        if (!searchValue) {
          return true;
        }

        return [
          appointment.name,
          appointment.phone,
          appointment.email,
          appointment.doctorName,
          appointment.doctorId,
          appointment.treatment,
          appointment.id,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(searchValue)
        );
      })
      .filter((appointment) => {
        if (!selectedDate) {
          return true;
        }

        return appointment.date === selectedDate;
      })
      .filter((appointment) => {
        if (statusFilter === "All") {
          return true;
        }

        return (
          String(
            appointment.status || ""
          ).toLowerCase() ===
          statusFilter.toLowerCase()
        );
      });
  }, [
    appointments,
    search,
    selectedDate,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAppointments.length / itemsPerPage
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedAppointments =
    filteredAppointments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
    setCurrentPage(1);
  };

  const openDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
  };

  const handleCancel = (appointment) => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel the appointment of ${appointment.name}?`
    );

    if (!confirmed) {
      return;
    }

    const updated = appointments.map((item) =>
      item.id === appointment.id
        ? {
            ...item,
            status: "Cancelled",
            cancelledAt:
              new Date().toISOString(),
          }
        : item
    );

    setAppointments(updated);
    saveAppointments(updated);

    if (
      selectedAppointment &&
      selectedAppointment.id === appointment.id
    ) {
      setSelectedAppointment({
        ...appointment,
        status: "Cancelled",
      });
    }
  };

  const handleDelete = (appointment) => {
    const confirmed = window.confirm(
      `Delete appointment of ${appointment.name}?`
    );

    if (!confirmed) {
      return;
    }

    const updated = appointments.filter(
      (item) => item.id !== appointment.id
    );

    setAppointments(updated);
    saveAppointments(updated);

    if (
      selectedAppointment &&
      selectedAppointment.id === appointment.id
    ) {
      closeDetails();
    }
  };

  const openReschedule = (appointment) => {
    setRescheduleAppointment(appointment);

    setRescheduleDate(
      appointment.date || ""
    );

    setRescheduleSlot(
      appointment.slot || ""
    );

    setShowReschedule(true);
    setShowDetails(false);
  };

  const closeReschedule = () => {
    setShowReschedule(false);
    setRescheduleAppointment(null);
    setRescheduleDate("");
    setRescheduleSlot("");
  };

  const selectedDoctorForReschedule =
    rescheduleAppointment
      ? getDoctorById(
          rescheduleAppointment.doctorId
        ) ||
        getDoctorByName(
          rescheduleAppointment.doctorName
        )
      : null;

  const availableRescheduleSlots =
    selectedDoctorForReschedule
      ? generateSlots(
          selectedDoctorForReschedule.startHour,
          selectedDoctorForReschedule.startMinute,
          selectedDoctorForReschedule.endHour,
          selectedDoctorForReschedule.endMinute
        )
      : [];

  const handleRescheduleSave = () => {
    if (!rescheduleAppointment) {
      return;
    }

    if (!rescheduleDate) {
      alert("Please select appointment date.");
      return;
    }

    if (!rescheduleSlot) {
      alert("Please select appointment slot.");
      return;
    }

    const doctorId =
      rescheduleAppointment.doctorId ||
      selectedDoctorForReschedule?.id ||
      "";

    const doctorName =
      rescheduleAppointment.doctorName ||
      selectedDoctorForReschedule?.name ||
      "";

    const booked = isSlotBooked(
      appointments,
      rescheduleDate,
      rescheduleSlot,
      doctorId,
      doctorName,
      rescheduleAppointment.id
    );

    if (booked) {
      alert(
        "This time slot is already booked for this doctor."
      );
      return;
    }

    const updated = appointments.map(
      (appointment) => {
        if (
          appointment.id !==
          rescheduleAppointment.id
        ) {
          return appointment;
        }

        return {
          ...appointment,
          date: rescheduleDate,
          slot: rescheduleSlot,
          doctorId,
          doctorName,
          status: "Confirmed",
          rescheduledAt:
            new Date().toISOString(),
        };
      }
    );

    setAppointments(updated);
    saveAppointments(updated);

    closeReschedule();

    alert(
      "Appointment rescheduled successfully."
    );
  };

  const getAppointmentPdfData = (
    appointment
  ) => {
    return [
      [
        "Appointment ID",
        appointment.id,
      ],
      [
        "Patient Name",
        appointment.name,
      ],
      [
        "Phone",
        appointment.phone,
      ],
      [
        "Email",
        appointment.email || "N/A",
      ],
      [
        "Age",
        appointment.age || "N/A",
      ],
      [
        "Gender",
        appointment.gender || "N/A",
      ],
      [
        "City",
        appointment.city || "N/A",
      ],
      [
        "Doctor",
        appointment.doctorName,
      ],
      [
        "Specialization",
        getDoctorById(
          appointment.doctorId
        )?.specialization ||
          "N/A",
      ],
      [
        "Appointment Date",
        formatDate(
          appointment.date
        ),
      ],
      [
        "Appointment Time",
        appointment.slot ||
          "N/A",
      ],
      [
        "Treatment / Reason",
        appointment.treatment ||
          "N/A",
      ],
      [
        "Status",
        appointment.status,
      ],
      [
        "Booked On",
        formatCreatedAt(
          appointment.createdAt
        ),
      ],
    ];
  };

  const generatePDF = (appointment) => {
    const doc = new jsPDF({
      unit: "mm",
      format: "a4",
    });

    const pageWidth =
      doc.internal.pageSize.getWidth();

    const pageHeight =
      doc.internal.pageSize.getHeight();

    let y = 105;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);

    doc.text(
      "Appointment Details",
      pageWidth / 2,
      y,
      {
        align: "center",
      }
    );

    y += 12;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const data =
      getAppointmentPdfData(
        appointment
      );

    data.forEach(([label, value]) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        y = 25;
      }

      doc.setFont("helvetica", "bold");

      doc.text(
        `${label}:`,
        20,
        y
      );

      doc.setFont("helvetica", "normal");

      const text = String(
        value || "N/A"
      );

      const wrapped =
        doc.splitTextToSize(
          text,
          125
        );

      doc.text(
        wrapped,
        65,
        y
      );

      y +=
        Math.max(
          7,
          wrapped.length * 5
        );
    });

    y += 10;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    doc.text(
      "This appointment record is generated from the clinic appointment system.",
      20,
      y
    );

    doc.save(
      `Appointment-${appointment.id}.pdf`
    );
  };

  const printAppointment = (
    appointment
  ) => {
    const popup =
      window.open(
        "",
        "_blank",
        "width=900,height=800"
      );

    if (!popup) {
      alert(
        "Please allow popups to print the appointment."
      );
      return;
    }

    const rows =
      getAppointmentPdfData(
        appointment
      )
        .map(
          ([label, value]) =>
            `
              <tr>
                <td class="label">${escapeHtml(
                  label
                )}</td>
                <td>${escapeHtml(
                  value
                )}</td>
              </tr>
            `
        )
        .join("");

    popup.document.open();

    popup.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Details</title>

          <style>
            @page {
              size: A4;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              min-height: 100%;
              font-family: Arial, sans-serif;
              color: #111;
            }

            body {
              padding-top: 100mm;
              padding-left: 18mm;
              padding-right: 18mm;
              padding-bottom: 15mm;
            }

            h1 {
              text-align: center;
              font-size: 20px;
              margin: 0 0 15px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
            }

            td {
              border: 1px solid #333;
              padding: 8px;
              vertical-align: top;
            }

            td.label {
              width: 32%;
              font-weight: bold;
              background: #f3f3f3;
            }

            .note {
              margin-top: 20px;
              font-size: 10px;
            }

            @media print {
              body {
                padding-top: 100mm;
              }
            }
          </style>
        </head>

        <body>
          <h1>Appointment Details</h1>

          <table>
            ${rows}
          </table>

          <div class="note">
            Appointment record generated from clinic appointment system.
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };

            window.onafterprint = function() {
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    popup.document.close();
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedDate("");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="appointment-details-page">
      <div className="appointment-details-header">
        <div>
          <h1>Appointment Details</h1>

          <p>
            Manage all patient appointments
            from one place.
          </p>
        </div>

        <button
          type="button"
          className="refresh-btn"
          onClick={refreshAppointments}
        >
          ↻ Refresh
        </button>
      </div>

      <div className="appointment-stats">
        <div className="appointment-stat-card">
          <span>Total Appointments</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="appointment-stat-card">
          <span>Confirmed</span>
          <strong>{stats.confirmed}</strong>
        </div>

        <div className="appointment-stat-card">
          <span>Completed</span>
          <strong>{stats.completed}</strong>
        </div>

        <div className="appointment-stat-card">
          <span>Cancelled</span>
          <strong>{stats.cancelled}</strong>
        </div>

        <div className="appointment-stat-card">
          <span>Appointment Dates</span>
          <strong>{stats.dates}</strong>
        </div>
      </div>

      <div className="appointment-filters">
        <input
          type="text"
          placeholder="Search patient, phone, doctor..."
          value={search}
          onChange={handleSearchChange}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />

        <select
          value={statusFilter}
          onChange={handleStatusChange}
        >
          <option value="All">
            All Status
          </option>

          <option value="Confirmed">
            Confirmed
          </option>

          <option value="Completed">
            Completed
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Cancelled">
            Cancelled
          </option>
        </select>

        <button
          type="button"
          onClick={resetFilters}
          className="clear-filter-btn"
        >
          Clear
        </button>
      </div>

      <div className="appointment-table-wrapper">
        <table className="appointment-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Phone</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginatedAppointments.length ===
            0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="no-appointments"
                >
                  <div>
                    <strong>
                      No appointments found
                    </strong>

                    <p>
                      Book an appointment from
                      the Appointment page and
                      it will appear here.
                    </p>

                    <button
                      type="button"
                      onClick={
                        refreshAppointments
                      }
                    >
                      Refresh Appointments
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAppointments.map(
                (appointment, index) => (
                  <tr
                    key={
                      appointment.id
                    }
                  >
                    <td>
                      {(currentPage -
                        1) *
                        itemsPerPage +
                        index +
                        1}
                    </td>

                    <td>
                      <div className="patient-name">
                        {appointment.name}
                      </div>

                      {appointment.email && (
                        <small>
                          {
                            appointment.email
                          }
                        </small>
                      )}
                    </td>

                    <td>
                      {appointment.phone ||
                        "N/A"}
                    </td>

                    <td>
                      <div>
                        {
                          appointment.doctorName
                        }
                      </div>

                      <small>
                        {
                          appointment.doctorId
                        }
                      </small>
                    </td>

                    <td>
                      {formatDate(
                        appointment.date
                      )}
                    </td>

                    <td>
                      {appointment.slot ||
                        "N/A"}
                    </td>

                    <td>
                      <span
                        className={`appointment-status ${getStatusClass(
                          appointment.status
                        )}`}
                      >
                        {
                          appointment.status
                        }
                      </span>
                    </td>

                    <td>
                      <div className="appointment-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openDetails(
                              appointment
                            )
                          }
                        >
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openReschedule(
                              appointment
                            )
                          }
                        >
                          Reschedule
                        </button>

                        {!String(
                          appointment.status ||
                            ""
                        )
                          .toLowerCase()
                          .includes(
                            "cancel"
                          ) && (
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                              handleCancel(
                                appointment
                              )
                            }
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              appointment
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {filteredAppointments.length >
        0 && (
        <div className="appointment-pagination">
          <button
            type="button"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  Math.max(
                    1,
                    page - 1
                  )
              )
            }
          >
            Previous
          </button>

          <span>
            Page {currentPage} of{" "}
            {totalPages}
          </span>

          <button
            type="button"
            disabled={
              currentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
              )
            }
          >
            Next
          </button>
        </div>
      )}

      {showDetails &&
        selectedAppointment && (
          <div
            className="appointment-modal-overlay"
            onClick={closeDetails}
          >
            <div
              className="appointment-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >
              <div className="appointment-modal-header">
                <h2>
                  Appointment Details
                </h2>

                <button
                  type="button"
                  onClick={
                    closeDetails
                  }
                >
                  ×
                </button>
              </div>

              <div className="appointment-detail-grid">
                <div>
                  <label>
                    Appointment ID
                  </label>

                  <strong>
                    {
                      selectedAppointment.id
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Patient Name
                  </label>

                  <strong>
                    {
                      selectedAppointment.name
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Phone
                  </label>

                  <strong>
                    {
                      selectedAppointment.phone ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Email
                  </label>

                  <strong>
                    {
                      selectedAppointment.email ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Age
                  </label>

                  <strong>
                    {
                      selectedAppointment.age ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Gender
                  </label>

                  <strong>
                    {
                      selectedAppointment.gender ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Doctor
                  </label>

                  <strong>
                    {
                      selectedAppointment.doctorName
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Specialization
                  </label>

                  <strong>
                    {
                      getDoctorById(
                        selectedAppointment.doctorId
                      )
                        ?.specialization ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Date
                  </label>

                  <strong>
                    {formatDate(
                      selectedAppointment.date
                    )}
                  </strong>
                </div>

                <div>
                  <label>
                    Time
                  </label>

                  <strong>
                    {
                      selectedAppointment.slot ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Treatment
                  </label>

                  <strong>
                    {
                      selectedAppointment.treatment ||
                      "N/A"
                    }
                  </strong>
                </div>

                <div>
                  <label>
                    Status
                  </label>

                  <strong>
                    {
                      selectedAppointment.status
                    }
                  </strong>
                </div>
              </div>

              <div className="appointment-modal-actions">
                <button
                  type="button"
                  onClick={() =>
                    generatePDF(
                      selectedAppointment
                    )
                  }
                >
                  Download PDF
                </button>

                <button
                  type="button"
                  onClick={() =>
                    printAppointment(
                      selectedAppointment
                    )
                  }
                >
                  Print
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openReschedule(
                      selectedAppointment
                    )
                  }
                >
                  Reschedule
                </button>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(
                      selectedAppointment
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      {showReschedule &&
        rescheduleAppointment && (
          <div className="appointment-modal-overlay">
            <div className="appointment-modal reschedule-modal">
              <div className="appointment-modal-header">
                <h2>
                  Reschedule Appointment
                </h2>

                <button
                  type="button"
                  onClick={
                    closeReschedule
                  }
                >
                  ×
                </button>
              </div>

              <div className="reschedule-patient-info">
                <strong>
                  {
                    rescheduleAppointment.name
                  }
                </strong>

                <span>
                  {
                    rescheduleAppointment.doctorName
                  }
                </span>
              </div>

              <div className="reschedule-fields">
                <div>
                  <label>
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    value={
                      rescheduleDate
                    }
                    onChange={(event) => {
                      setRescheduleDate(
                        event.target.value
                      );

                      setRescheduleSlot(
                        ""
                      );
                    }}
                  />
                </div>

                <div>
                  <label>
                    Appointment Time
                  </label>

                  <select
                    value={
                      rescheduleSlot
                    }
                    onChange={(event) =>
                      setRescheduleSlot(
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select Time
                    </option>

                    {availableRescheduleSlots.map(
                      (slot) => {
                        const booked =
                          isSlotBooked(
                            appointments,
                            rescheduleDate,
                            slot,
                            rescheduleAppointment.doctorId,
                            rescheduleAppointment.doctorName,
                            rescheduleAppointment.id
                          );

                        return (
                          <option
                            key={slot}
                            value={slot}
                            disabled={
                              booked
                            }
                          >
                            {slot}
                            {booked
                              ? " - Booked"
                              : ""}
                          </option>
                        );
                      }
                    )}
                  </select>
                </div>
              </div>

              <div className="reschedule-actions">
                <button
                  type="button"
                  onClick={
                    closeReschedule
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="save-reschedule-btn"
                  onClick={
                    handleRescheduleSave
                  }
                >
                  Save Reschedule
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default AppointmentDetails;