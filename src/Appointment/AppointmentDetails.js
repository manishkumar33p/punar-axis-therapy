import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./AppointmentDetails.css";

function AppointmentDetails() {
  const doctors = [
    {
      id: "DOC001",
      name: "Dr. Rahul Sharma",
      specialization: "Physiotherapist",
      slots: [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "04:00 PM",
        "05:00 PM",
      ],
    },
    {
      id: "DOC002",
      name: "Dr. Neha Verma",
      specialization: "Rehabilitation Therapist",
      slots: [
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "03:00 PM",
        "04:00 PM",
      ],
    },
  ];

  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Date filter
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Reschedule
  const [rescheduleAppointment, setRescheduleAppointment] =
    useState(null);
  const [newDate, setNewDate] = useState("");
  const [newSlot, setNewSlot] = useState("");
  const [rescheduleError, setRescheduleError] = useState("");

  useEffect(() => {
    const savedAppointments = localStorage.getItem(
      "clinic_appointments"
    );

    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error(
          "Unable to load appointments:",
          error
        );
      }
    }
  }, []);

  /* =========================
     BASIC STATISTICS
  ========================= */

  const totalAppointments = appointments.length;

  const confirmedAppointments = appointments.filter(
    (appointment) =>
      appointment.status !== "Cancelled"
  ).length;

  const cancelledAppointments = appointments.filter(
    (appointment) =>
      appointment.status === "Cancelled"
  ).length;

  const dateStats = useMemo(() => {
    const stats = {};

    appointments.forEach((appointment) => {
      if (!appointment.date) return;

      if (!stats[appointment.date]) {
        stats[appointment.date] = {
          total: 0,
          confirmed: 0,
          cancelled: 0,
        };
      }

      stats[appointment.date].total += 1;

      if (appointment.status === "Cancelled") {
        stats[appointment.date].cancelled += 1;
      } else {
        stats[appointment.date].confirmed += 1;
      }
    });

    return Object.entries(stats)
      .sort(([dateA], [dateB]) =>
        dateA.localeCompare(dateB)
      )
      .map(([date, values]) => ({
        date,
        ...values,
      }));
  }, [appointments]);

  /* =========================
     SEARCH + DATE FILTER
  ========================= */

  const filteredAppointments = useMemo(() => {
    const value = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesDate =
        !selectedDate ||
        appointment.date === selectedDate;

      const matchesSearch =
        !value ||
        String(appointment.id)
          .toLowerCase()
          .includes(value) ||
        appointment.name
          ?.toLowerCase()
          .includes(value) ||
        appointment.phone
          ?.toLowerCase()
          .includes(value) ||
        appointment.email
          ?.toLowerCase()
          .includes(value) ||
        appointment.doctorName
          ?.toLowerCase()
          .includes(value) ||
        appointment.treatment
          ?.toLowerCase()
          .includes(value) ||
        appointment.date
          ?.toLowerCase()
          .includes(value);

      return matchesDate && matchesSearch;
    });
  }, [appointments, search, selectedDate]);

  /* =========================
     PAGINATION
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAppointments.length /
        itemsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedAppointments =
    filteredAppointments.slice(
      (safeCurrentPage - 1) * itemsPerPage,
      safeCurrentPage * itemsPerPage
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedDate, itemsPerPage]);

  /* =========================
     DATE CLICK
  ========================= */

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSearch("");
    setCurrentPage(1);

    setTimeout(() => {
      const element =
        document.getElementById(
          "date-appointments"
        );

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const clearDateFilter = () => {
    setSelectedDate("");
    setCurrentPage(1);
  };

  /* =========================
     CANCEL
  ========================= */

  const cancelAppointment = (id) => {
    const updatedAppointments =
      appointments.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: "Cancelled",
            }
          : appointment
      );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "clinic_appointments",
      JSON.stringify(updatedAppointments)
    );

    if (
      selectedAppointment?.id === id
    ) {
      setSelectedAppointment({
        ...selectedAppointment,
        status: "Cancelled",
      });
    }
  };

  /* =========================
     DELETE
  ========================= */

  const deleteAppointment = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    const updatedAppointments =
      appointments.filter(
        (appointment) =>
          appointment.id !== id
      );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "clinic_appointments",
      JSON.stringify(updatedAppointments)
    );

    setSelectedAppointment(null);
  };

  /* =========================
     RESCHEDULE
  ========================= */

  const openReschedule = (appointment) => {
    setRescheduleAppointment(appointment);
    setNewDate(appointment.date || "");
    setNewSlot(appointment.slot || "");
    setRescheduleError("");
  };

  const closeReschedule = () => {
    setRescheduleAppointment(null);
    setNewDate("");
    setNewSlot("");
    setRescheduleError("");
  };

  const selectedDoctor = useMemo(() => {
    if (!rescheduleAppointment) {
      return null;
    }

    return doctors.find(
      (doctor) =>
        doctor.name ===
        rescheduleAppointment.doctorName
    );
  }, [rescheduleAppointment]);

  const availableSlots =
    selectedDoctor?.slots || [];

  const isSlotBooked = (
    date,
    slot,
    appointmentId
  ) => {
    return appointments.some(
      (appointment) =>
        appointment.id !== appointmentId &&
        appointment.date === date &&
        appointment.slot === slot &&
        appointment.doctorName ===
          rescheduleAppointment?.doctorName &&
        appointment.status !== "Cancelled"
    );
  };

  const confirmReschedule = () => {
    if (!newDate || !newSlot) {
      setRescheduleError(
        "Please select date and time slot."
      );
      return;
    }

    if (
      isSlotBooked(
        newDate,
        newSlot,
        rescheduleAppointment.id
      )
    ) {
      setRescheduleError(
        "This time slot is already booked."
      );
      return;
    }

    const updatedAppointments =
      appointments.map((appointment) =>
        appointment.id ===
        rescheduleAppointment.id
          ? {
              ...appointment,
              date: newDate,
              slot: newSlot,
              status: "Confirmed",
            }
          : appointment
      );

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "clinic_appointments",
      JSON.stringify(updatedAppointments)
    );

    const updatedAppointment =
      updatedAppointments.find(
        (appointment) =>
          appointment.id ===
          rescheduleAppointment.id
      );

    if (selectedAppointment?.id ===
      rescheduleAppointment.id) {
      setSelectedAppointment(
        updatedAppointment
      );
    }

    closeReschedule();
  };

  /* =========================
     DATE FORMAT
  ========================= */

  const formatDate = (date) => {
    if (!date) return "-";

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const localDate = new Date(
      year,
      month,
      day
    );

    return localDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================
     PDF
  ========================= */

  const generatePDF = (appointment) => {
    const doc = new jsPDF();

    const green = [22, 76, 56];

    doc.setFillColor(
      green[0],
      green[1],
      green[2]
    );

    doc.rect(
      0,
      0,
      210,
      35,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(
      "PUNAR AXIS THERAPY",
      20,
      16
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Appointment Confirmation Slip",
      20,
      25
    );

    doc.setTextColor(
      30,
      30,
      30
    );

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");

    doc.text(
      `Appointment ID: APP-${appointment.id}`,
      20,
      50
    );

    doc.setDrawColor(
      210,
      220,
      215
    );

    doc.line(
      20,
      55,
      190,
      55
    );

    let y = 70;

    const addRow = (
      label,
      value
    ) => {
      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.text(
        label,
        20,
        y
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.text(
        String(value || "-"),
        75,
        y
      );

      y += 12;
    };

    addRow(
      "Patient Name",
      appointment.name
    );

    addRow(
      "Mobile",
      appointment.phone
    );

    addRow(
      "Email",
      appointment.email
    );

    addRow(
      "Age",
      appointment.age
    );

    addRow(
      "Gender",
      appointment.gender
    );

    addRow(
      "Doctor",
      appointment.doctorName
    );

    addRow(
      "Appointment Date",
      formatDate(
        appointment.date
      )
    );

    addRow(
      "Time Slot",
      appointment.slot
    );

    addRow(
      "Treatment",
      appointment.treatment
    );

    addRow(
      "Status",
      appointment.status
    );

    y += 5;

    doc.setFont(
      "helvetica",
      "bold"
    );

    doc.text(
      "Patient Notes",
      20,
      y
    );

    y += 8;

    doc.setFont(
      "helvetica",
      "normal"
    );

    const notes =
      appointment.notes ||
      "No notes added.";

    const splitNotes =
      doc.splitTextToSize(
        notes,
        170
      );

    doc.text(
      splitNotes,
      20,
      y
    );

    y +=
      splitNotes.length * 6 +
      15;

    doc.setDrawColor(
      210,
      220,
      215
    );

    doc.line(
      20,
      y,
      190,
      y
    );

    y += 12;

    doc.setFontSize(9);
    doc.setTextColor(
      100,
      110,
      105
    );

    doc.text(
      "Thank you for choosing Punar Axis Therapy.",
      20,
      y
    );

    doc.save(
      `Appointment-APP-${appointment.id}.pdf`
    );
  };

  /* =========================
     PRINT
  ========================= */

  const printAppointment = (
    appointment
  ) => {
    const printWindow =
      window.open(
        "",
        "_blank",
        "width=800,height=900"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the appointment."
      );
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>
            Appointment APP-${appointment.id}
          </title>

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              color: #222;
            }

            .header {
              background: #164c38;
              color: white;
              padding: 22px;
              border-radius: 10px;
              margin-bottom: 25px;
            }

            h1 {
              margin: 0 0 6px;
            }

            .id {
              font-size: 13px;
              opacity: .9;
            }

            .section {
              margin-top: 25px;
            }

            .section h2 {
              color: #164c38;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }

            .row {
              display: flex;
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }

            .label {
              width: 180px;
              font-weight: bold;
            }

            .notes {
              background: #f6f9f7;
              padding: 15px;
              border-radius: 8px;
              line-height: 1.6;
            }

            .footer {
              margin-top: 40px;
              color: #777;
              font-size: 12px;
            }
          </style>
        </head>

        <body>

          <div class="header">
            <h1>PUNAR AXIS THERAPY</h1>
            <div class="id">
              Appointment ID:
              APP-${appointment.id}
            </div>
          </div>

          <div class="section">
            <h2>Patient Information</h2>

            <div class="row">
              <div class="label">
                Patient Name
              </div>
              <div>
                ${appointment.name || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Mobile
              </div>
              <div>
                ${appointment.phone || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Email
              </div>
              <div>
                ${appointment.email || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Age
              </div>
              <div>
                ${appointment.age || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Gender
              </div>
              <div>
                ${appointment.gender || "-"}
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Appointment Information</h2>

            <div class="row">
              <div class="label">
                Doctor
              </div>
              <div>
                ${appointment.doctorName || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Date
              </div>
              <div>
                ${formatDate(appointment.date)}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Time
              </div>
              <div>
                ${appointment.slot || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Treatment
              </div>
              <div>
                ${appointment.treatment || "-"}
              </div>
            </div>

            <div class="row">
              <div class="label">
                Status
              </div>
              <div>
                ${appointment.status || "-"}
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Patient Notes</h2>

            <div class="notes">
              ${appointment.notes || "No notes added."}
            </div>
          </div>

          <div class="footer">
            Thank you for choosing Punar Axis Therapy.
          </div>

        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 400);
  };

  return (
    <div className="appointment-details-page">

      {/* HEADER */}

      <div className="details-header">

        <div>
          <h1>
            Appointment Details
          </h1>

          <p>
            Search and manage all clinic appointments
          </p>
        </div>

        <div className="total-box">
          <strong>
            {appointments.length}
          </strong>

          <span>
            Total Appointments
          </span>
        </div>

      </div>


      {/* STATISTICS */}

      <div className="stats-cards">

        <div className="stat-card">
          <span>Total</span>
          <strong>
            {totalAppointments}
          </strong>
          <small>
            All Appointments
          </small>
        </div>

        <div className="stat-card">
          <span>Confirmed</span>
          <strong>
            {confirmedAppointments}
          </strong>
          <small>
            Active Appointments
          </small>
        </div>

        <div className="stat-card">
          <span>Cancelled</span>
          <strong>
            {cancelledAppointments}
          </strong>
          <small>
            Cancelled Appointments
          </small>
        </div>

        <div className="stat-card">
          <span>Dates</span>
          <strong>
            {dateStats.length}
          </strong>
          <small>
            Appointment Dates
          </small>
        </div>

      </div>


      {/* DATE CHART */}

      <div className="date-chart-card">

        <div className="chart-heading">

          <div>
            <h2>
              Date-wise Appointment Statistics
            </h2>

            <p>
              Click any date point to view patients
            </p>
          </div>

        </div>

        {dateStats.length === 0 ? (

          <div className="chart-empty">
            No appointment data available.
          </div>

        ) : (

          <div className="chart-scroll">

            <div className="chart-area">

              {(() => {

                const chartWidth =
                  Math.max(
                    750,
                    dateStats.length * 100
                  );

                const chartHeight = 320;

                const paddingLeft = 50;
                const paddingRight = 30;
                const paddingTop = 30;
                const paddingBottom = 65;

                const graphWidth =
                  chartWidth -
                  paddingLeft -
                  paddingRight;

                const graphHeight =
                  chartHeight -
                  paddingTop -
                  paddingBottom;

                const maxValue =
                  Math.max(
                    ...dateStats.map(
                      (item) =>
                        item.total
                    ),
                    1
                  );

                const points =
                  dateStats.map(
                    (item, index) => {

                      const x =
                        paddingLeft +
                        (index /
                          Math.max(
                            dateStats.length - 1,
                            1
                          )) *
                          graphWidth;

                      const y =
                        paddingTop +
                        graphHeight -
                        (item.total /
                          maxValue) *
                          graphHeight;

                      return {
                        ...item,
                        x,
                        y,
                      };
                    }
                  );

                const linePoints =
                  points
                    .map(
                      (point) =>
                        `${point.x},${point.y}`
                    )
                    .join(" ");

                return (
                  <svg
                    width={chartWidth}
                    height={chartHeight}
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="appointment-chart"
                  >

                    {/* GRID */}

                    {[0, 25, 50, 75, 100].map(
                      (percent) => {

                        const y =
                          paddingTop +
                          graphHeight -
                          (percent / 100) *
                            graphHeight;

                        const value =
                          Math.round(
                            (percent / 100) *
                              maxValue
                          );

                        return (
                          <g key={percent}>

                            <line
                              x1={
                                paddingLeft
                              }
                              y1={y}
                              x2={
                                chartWidth -
                                paddingRight
                              }
                              y2={y}
                              className="chart-grid"
                            />

                            <text
                              x={
                                paddingLeft - 12
                              }
                              y={y + 4}
                              textAnchor="end"
                              className="chart-y-label"
                            >
                              {value}
                            </text>

                          </g>
                        );
                      }
                    )}

                    {/* LINE */}

                    {points.length > 1 && (
                      <polyline
                        points={linePoints}
                        fill="none"
                        className="chart-line"
                      />
                    )}

                    {/* CLICKABLE POINTS */}

                    {points.map(
                      (point) => (

                        <g
                          key={point.date}
                          className="chart-date-group"
                          onClick={() =>
                            handleDateClick(
                              point.date
                            )
                          }
                        >

                          <circle
                            cx={point.x}
                            cy={point.y}
                            r="7"
                            className="chart-point"
                          />

                          <text
                            x={point.x}
                            y={
                              point.y - 15
                            }
                            textAnchor="middle"
                            className="chart-value"
                          >
                            {point.total}
                          </text>

                          <text
                            x={point.x}
                            y={
                              chartHeight - 30
                            }
                            textAnchor="middle"
                            className="chart-x-label"
                          >
                            {formatDate(
                              point.date
                            )}
                          </text>

                          <title>
                            {formatDate(
                              point.date
                            )} -{" "}
                            {point.total}{" "}
                            appointments
                            {"\n"}
                            Click to view patients
                          </title>

                        </g>

                      )
                    )}

                  </svg>
                );

              })()}

            </div>

          </div>

        )}

      </div>


      {/* SEARCH */}

      <div className="search-card">

        <label>
          Search Appointment
        </label>

        <input
          type="text"
          placeholder="Search by name, mobile, email, doctor, treatment or appointment ID..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* SELECTED DATE */}

      {selectedDate && (

        <div className="selected-date-banner">

          <div>

            <span>
              Selected Date
            </span>

            <strong>
              {formatDate(
                selectedDate
              )}
            </strong>

            <small>
              {
                appointments.filter(
                  (item) =>
                    item.date ===
                    selectedDate
                ).length
              } appointment(s)
            </small>

          </div>

          <button
            onClick={clearDateFilter}
          >
            Show All Dates
          </button>

        </div>

      )}


      {/* APPOINTMENT LIST */}

      <div
        className="appointment-details-card"
        id="date-appointments"
      >

        <div className="list-header">

          <div>
            <h2>
              {selectedDate
                ? `Appointments for ${formatDate(
                    selectedDate
                  )}`
                : "Appointments"}
            </h2>

            <p>
              {filteredAppointments.length} result(s)
              found
            </p>
          </div>

          <div className="pagination-size">

            <label>
              Show
            </label>

            <select
              value={itemsPerPage}
              onChange={(e) =>
                setItemsPerPage(
                  Number(e.target.value)
                )
              }
            >
              <option value={10}>
                10
              </option>

              <option value={20}>
                20
              </option>

              <option value={50}>
                50
              </option>

              <option value={100}>
                100
              </option>
            </select>

            <span>
              per page
            </span>

          </div>

        </div>


        {paginatedAppointments.length ===
        0 ? (

          <div className="no-results">

            <h3>
              No Appointment Found
            </h3>

            <p>
              Try another search or select another date.
            </p>

          </div>

        ) : (

          <div className="details-list">

            {paginatedAppointments.map(
              (appointment) => (

                <div
                  className="appointment-item"
                  key={appointment.id}
                >

                  <div className="patient-info">

                    <div className="patient-avatar">
                      {appointment.name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <h3>
                        {appointment.name}
                      </h3>

                      <p>
                        {appointment.phone}
                      </p>

                      <small>
                        Appointment ID:
                        {" "}
                        APP-{appointment.id}
                      </small>

                    </div>

                  </div>


                  <div className="appointment-info">

                    <div>
                      <span>
                        Doctor
                      </span>

                      <strong>
                        {appointment.doctorName}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Date
                      </span>

                      <strong>
                        {formatDate(
                          appointment.date
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Time
                      </span>

                      <strong>
                        {appointment.slot}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Treatment
                      </span>

                      <strong>
                        {appointment.treatment ||
                          "-"}
                      </strong>
                    </div>

                  </div>


                  <div className="appointment-actions">

                    <span
                      className={`appointment-status ${
                        appointment.status ===
                        "Cancelled"
                          ? "cancelled"
                          : ""
                      }`}
                    >
                      {appointment.status}
                    </span>

                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedAppointment(
                          appointment
                        )
                      }
                    >
                      View
                    </button>

                    {appointment.status !==
                      "Cancelled" && (

                      <button
                        className="reschedule-btn"
                        onClick={() =>
                          openReschedule(
                            appointment
                          )
                        }
                      >
                        Reschedule
                      </button>

                    )}

                    {appointment.status !==
                      "Cancelled" && (

                      <button
                        className="cancel-btn"
                        onClick={() =>
                          cancelAppointment(
                            appointment.id
                          )
                        }
                      >
                        Cancel
                      </button>

                    )}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteAppointment(
                          appointment.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}


        {/* PAGINATION */}

        {filteredAppointments.length >
          0 && (

          <div className="pagination">

            <button
              disabled={
                safeCurrentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  safeCurrentPage - 1
                )
              }
            >
              ← Previous
            </button>

            <span>
              Page{" "}
              <strong>
                {safeCurrentPage}
              </strong>{" "}
              of{" "}
              <strong>
                {totalPages}
              </strong>
            </span>

            <button
              disabled={
                safeCurrentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  safeCurrentPage + 1
                )
              }
            >
              Next →
            </button>

          </div>

        )}

      </div>


      {/* DETAILS MODAL */}

      {selectedAppointment && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedAppointment(
              null
            )
          }
        >

          <div
            className="appointment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  Appointment Details
                </h2>

                <p>
                  APP-
                  {selectedAppointment.id}
                </p>

              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setSelectedAppointment(
                    null
                  )
                }
              >
                ×
              </button>

            </div>


            <div className="modal-status">

              <span
                className={
                  selectedAppointment.status ===
                  "Cancelled"
                    ? "cancelled"
                    : ""
                }
              >
                {selectedAppointment.status}
              </span>

            </div>


            <div className="details-section">

              <h3>
                Patient Information
              </h3>

              <div className="details-grid">

                <div>
                  <span>
                    Name
                  </span>

                  <strong>
                    {selectedAppointment.name}
                  </strong>
                </div>

                <div>
                  <span>
                    Mobile
                  </span>

                  <strong>
                    {selectedAppointment.phone}
                  </strong>
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {selectedAppointment.email ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>
                    Age
                  </span>

                  <strong>
                    {selectedAppointment.age ||
                      "-"}
                  </strong>
                </div>

                <div>
                  <span>
                    Gender
                  </span>

                  <strong>
                    {selectedAppointment.gender ||
                      "-"}
                  </strong>
                </div>

              </div>

            </div>


            <div className="details-section">

              <h3>
                Appointment Information
              </h3>

              <div className="details-grid">

                <div>
                  <span>
                    Doctor
                  </span>

                  <strong>
                    {selectedAppointment.doctorName}
                  </strong>
                </div>

                <div>
                  <span>
                    Date
                  </span>

                  <strong>
                    {formatDate(
                      selectedAppointment.date
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Time Slot
                  </span>

                  <strong>
                    {selectedAppointment.slot}
                  </strong>
                </div>

                <div>
                  <span>
                    Treatment
                  </span>

                  <strong>
                    {selectedAppointment.treatment ||
                      "-"}
                  </strong>
                </div>

              </div>

            </div>


            <div className="details-section">

              <h3>
                Patient Notes
              </h3>

              <div className="notes-box">
                {selectedAppointment.notes ||
                  "No notes added."}
              </div>

            </div>


            <div className="modal-actions">

              <button
                className="pdf-btn"
                onClick={() =>
                  generatePDF(
                    selectedAppointment
                  )
                }
              >
                Generate PDF
              </button>

              <button
                className="print-btn"
                onClick={() =>
                  printAppointment(
                    selectedAppointment
                  )
                }
              >
                Print
              </button>

              {selectedAppointment.status !==
                "Cancelled" && (

                <button
                  className="reschedule-btn"
                  onClick={() =>
                    openReschedule(
                      selectedAppointment
                    )
                  }
                >
                  Reschedule
                </button>

              )}

              {selectedAppointment.status !==
                "Cancelled" && (

                <button
                  className="modal-cancel"
                  onClick={() =>
                    cancelAppointment(
                      selectedAppointment.id
                    )
                  }
                >
                  Cancel Appointment
                </button>

              )}

              <button
                className="modal-delete"
                onClick={() =>
                  deleteAppointment(
                    selectedAppointment.id
                  )
                }
              >
                Delete Appointment
              </button>

            </div>

          </div>

        </div>

      )}


      {/* RESCHEDULE MODAL */}

      {rescheduleAppointment && (

        <div
          className="modal-overlay"
          onClick={closeReschedule}
        >

          <div
            className="reschedule-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>
                <h2>
                  Reschedule Appointment
                </h2>

                <p>
                  APP-
                  {rescheduleAppointment.id}
                </p>
              </div>

              <button
                className="close-btn"
                onClick={
                  closeReschedule
                }
              >
                ×
              </button>

            </div>


            <div className="reschedule-patient">

              <strong>
                {rescheduleAppointment.name}
              </strong>

              <span>
                {rescheduleAppointment.doctorName}
              </span>

            </div>


            <div className="reschedule-fields">

              <div>
                <label>
                  New Date
                </label>

                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(
                      e.target.value
                    );
                    setNewSlot("");
                    setRescheduleError("");
                  }}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                />
              </div>


              <div>

                <label>
                  New Time Slot
                </label>

                <div className="reschedule-slots">

                  {availableSlots.map(
                    (slot) => {

                      const booked =
                        newDate &&
                        isSlotBooked(
                          newDate,
                          slot,
                          rescheduleAppointment.id
                        );

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={booked}
                          className={`reschedule-slot ${
                            newSlot === slot
                              ? "selected"
                              : ""
                          } ${
                            booked
                              ? "booked"
                              : ""
                          }`}
                          onClick={() => {
                            setNewSlot(slot);
                            setRescheduleError("");
                          }}
                        >
                          {slot}

                          {booked && (
                            <small>
                              Booked
                            </small>
                          )}
                        </button>
                      );
                    }
                  )}

                </div>

              </div>

            </div>


            {rescheduleError && (

              <div className="reschedule-error">
                {rescheduleError}
              </div>

            )}


            <div className="reschedule-actions">

              <button
                className="secondary-modal-btn"
                onClick={
                  closeReschedule
                }
              >
                Close
              </button>

              <button
                className="confirm-reschedule-btn"
                onClick={
                  confirmReschedule
                }
              >
                Confirm Reschedule
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AppointmentDetails;