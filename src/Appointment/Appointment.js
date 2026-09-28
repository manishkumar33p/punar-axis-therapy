

import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./Appointment.css";

/* =========================================================
   SLOT GENERATOR
   End time itself is NOT a bookable slot.
   Example:
   08:00 AM - 02:00 PM
   => 08:00, 08:15 ... 01:45 PM
   ========================================================= */

const generateSlots = (startHour, startMinute, endHour, endMinute) => {
  const slots = [];

  let current = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  while (current < end) {
    const hour24 = Math.floor(current / 60);
    const minute = current % 60;

    const hour12 = hour24 % 12 || 12;
    const period = hour24 >= 12 ? "PM" : "AM";

    const formattedMinute = String(minute).padStart(2, "0");

    slots.push(
      `${String(hour12).padStart(2, "0")}:${formattedMinute} ${period}`
    );

    current += 15;
  }

  return slots;
};

/* =========================================================
   DOCTORS
   ========================================================= */

const DOCTORS = [
  {
    id: "DOC001",
    name: "Dr. Vikas",
    specialty: "Physiotherapist",
    startTime: "8:00 AM",
    endTime: "2:00 PM",
    slots: generateSlots(8, 0, 14, 0),
  },
  {
    id: "DOC002",
    name: "Dr. Shahnaz",
    specialty: "Physiotherapist",
    startTime: "2:00 PM",
    endTime: "7:00 PM",
    slots: generateSlots(14, 0, 19, 0),
  },
  {
    id: "DOC003",
    name: "Dr. Ankush",
    specialty: "Ayurvedic Specialist",
    startTime: "9:30 AM",
    endTime: "5:30 PM",
    slots: generateSlots(9, 30, 17, 30),
  },
];

/* =========================================================
   TREATMENTS
   ========================================================= */

const TREATMENTS = [
  "Physiotherapy",
  "Integrated Physiotherapy",
  "Ayurveda",
  "Integrated Ayurveda",
  "Sports Rehab",
];

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

function Appointment() {
  const [appointments, setAppointments] = useState([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [selectedSlot, setSelectedSlot] = useState("");

  const [patient, setPatient] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    treatment: "",
    amount: "",
  });

  const [bookingSuccess, setBookingSuccess] = useState(null);

  /* =======================================================
     LOAD APPOINTMENTS
     ======================================================= */

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

  /* =======================================================
     SELECTED DOCTOR
     ======================================================= */

  const doctor = DOCTORS.find(
    (item) => item.id === selectedDoctor
  );

  /* =======================================================
     BOOKED SLOTS
     ======================================================= */

  const bookedSlots = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.doctorId === selectedDoctor &&
          appointment.date === selectedDate &&
          appointment.status !== "Cancelled"
      )
      .map((appointment) => appointment.slot);
  }, [
    appointments,
    selectedDoctor,
    selectedDate,
  ]);

  /* =======================================================
     HANDLE PATIENT INPUT
     ======================================================= */

  const updatePatient = (field, value) => {
    setPatient((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =======================================================
     PDF GENERATION
     ======================================================= */

  const generatePDF = (appointment) => {
    if (!appointment) return;

    const pdf = new jsPDF();

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const pageHeight =
      pdf.internal.pageSize.getHeight();

    /* HEADER */

    pdf.setFillColor(15, 107, 91);

    pdf.rect(
      0,
      0,
      pageWidth,
      42,
      "F"
    );

    pdf.setTextColor(255, 255, 255);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(21);

    pdf.text(
      "PUNAR AXIS THERAPY",
      pageWidth / 2,
      15,
      {
        align: "center",
      }
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10);

    pdf.text(
      "Ayurveda & Physiotherapy",
      pageWidth / 2,
      24,
      {
        align: "center",
      }
    );

    pdf.text(
      "Appointment Confirmation Slip",
      pageWidth / 2,
      33,
      {
        align: "center",
      }
    );

    /* APPOINTMENT ID */

    pdf.setTextColor(
      15,
      107,
      91
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(12);

    pdf.text(
      `Appointment ID: ${appointment.id}`,
      15,
      55
    );

    pdf.setDrawColor(
      220,
      228,
      225
    );

    pdf.line(
      15,
      61,
      pageWidth - 15,
      61
    );

    /* PATIENT DETAILS */

    pdf.setTextColor(
      35,
      55,
      50
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(13);

    pdf.text(
      "Patient Details",
      15,
      74
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10.5);

    let y = 84;

    pdf.text(
      `Patient Name: ${appointment.name || "-"}`,
      15,
      y
    );

    pdf.text(
      `Mobile: ${appointment.phone || "-"}`,
      110,
      y
    );

    y += 9;

    pdf.text(
      `Email: ${appointment.email || "-"}`,
      15,
      y
    );

    pdf.text(
      `Age: ${appointment.age || "-"}`,
      110,
      y
    );

    y += 9;

    pdf.text(
      `Gender: ${appointment.gender || "-"}`,
      15,
      y
    );

    pdf.text(
      `Treatment: ${appointment.treatment || "-"}`,
      110,
      y
    );

    y += 9;

    pdf.text(
      `Treatment Amount: ₹${appointment.amount || "0"}`,
      15,
      y
    );

    /* APPOINTMENT DETAILS */

    y += 20;

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(13);

    pdf.text(
      "Appointment Details",
      15,
      y
    );

    y += 10;

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(10.5);

    pdf.text(
      `Doctor: ${appointment.doctorName || "-"}`,
      15,
      y
    );

    y += 9;

    pdf.text(
      `Specialty: ${appointment.doctorSpecialty || "-"}`,
      15,
      y
    );

    y += 9;

    pdf.text(
      `Date: ${appointment.date || "-"}`,
      15,
      y
    );

    pdf.text(
      `Time: ${appointment.slot || "-"}`,
      110,
      y
    );

    y += 9;

    pdf.text(
      `Status: ${appointment.status || "Confirmed"}`,
      15,
      y
    );

    /* AMOUNT BOX */

    y += 17;

    pdf.setFillColor(
      239,
      248,
      245
    );

    pdf.roundedRect(
      15,
      y,
      pageWidth - 30,
      30,
      4,
      4,
      "F"
    );

    pdf.setTextColor(
      15,
      107,
      91
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(11);

    pdf.text(
      "Treatment Amount",
      pageWidth / 2,
      y + 11,
      {
        align: "center",
      }
    );

    pdf.setFontSize(16);

    pdf.text(
      `₹${appointment.amount || "0"}`,
      pageWidth / 2,
      y + 22,
      {
        align: "center",
      }
    );

    /* CONFIRMATION */

    y += 43;

    pdf.setFillColor(
      15,
      107,
      91
    );

    pdf.roundedRect(
      15,
      y,
      pageWidth - 30,
      27,
      4,
      4,
      "F"
    );

    pdf.setTextColor(
      255,
      255,
      255
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(11);

    pdf.text(
      "APPOINTMENT CONFIRMED",
      pageWidth / 2,
      y + 11,
      {
        align: "center",
      }
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(9);

    pdf.text(
      "Please carry this appointment slip during your visit.",
      pageWidth / 2,
      y + 19,
      {
        align: "center",
      }
    );

    /* FOOTER */

    const footerY =
      pageHeight - 18;

    pdf.setDrawColor(
      220,
      220,
      220
    );

    pdf.line(
      15,
      footerY - 6,
      pageWidth - 15,
      footerY - 6
    );

    pdf.setTextColor(
      110,
      110,
      110
    );

    pdf.setFontSize(8);

    pdf.text(
      "Punar Axis Therapy",
      15,
      footerY
    );

    pdf.text(
      "www.punaraxistherapy.in",
      pageWidth - 15,
      footerY,
      {
        align: "right",
      }
    );

    pdf.save(
      `Punar-Axis-Appointment-${appointment.id}.pdf`
    );
  };

  /* =======================================================
     PRINT APPOINTMENT
     ======================================================= */

  const printAppointment = (appointment) => {
    if (!appointment) return;

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=800,height=900"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the appointment slip."
      );
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>
            Appointment Slip - ${appointment.id}
          </title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, sans-serif;
              color: #17312c;
              background: #ffffff;
            }

            .slip {
              max-width: 720px;
              margin: auto;
              border: 1px solid #dce8e4;
              border-radius: 18px;
              overflow: hidden;
            }

            .header {
              background:
                linear-gradient(
                  135deg,
                  #0f7665,
                  #084f43
                );
              color: white;
              text-align: center;
              padding: 30px 20px;
            }

            .header h1 {
              margin: 0;
              font-size: 25px;
            }

            .header p {
              margin: 7px 0 0;
              font-size: 13px;
            }

            .content {
              padding: 30px;
            }

            .appointment-id {
              color: #0f6b5b;
              font-weight: bold;
              margin-bottom: 24px;
            }

            .section {
              margin-bottom: 25px;
            }

            .section h3 {
              margin: 0 0 15px;
              color: #0f6b5b;
              font-size: 16px;
              border-bottom: 1px solid #e5eeeb;
              padding-bottom: 9px;
            }

            .row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
              margin-bottom: 14px;
            }

            .label {
              font-size: 11px;
              color: #778783;
              margin-bottom: 5px;
            }

            .value {
              font-size: 14px;
              font-weight: 600;
            }

            .amount {
              margin-top: 20px;
              padding: 18px;
              border-radius: 12px;
              background: #edf8f4;
              text-align: center;
            }

            .amount-label {
              font-size: 11px;
              color: #6d807a;
              margin-bottom: 5px;
            }

            .amount-value {
              font-size: 24px;
              color: #0f6b5b;
              font-weight: 800;
            }

            .status {
              margin-top: 20px;
              background: #0f6b5b;
              color: white;
              padding: 16px;
              border-radius: 10px;
              text-align: center;
              font-weight: bold;
            }

            .footer {
              text-align: center;
              border-top: 1px solid #e5e5e5;
              padding: 18px;
              color: #777;
              font-size: 11px;
            }

            @media print {
              body {
                padding: 0;
              }

              .slip {
                border: none;
              }
            }

            @media(max-width:600px) {
              body {
                padding: 10px;
              }

              .content {
                padding: 20px;
              }

              .row {
                grid-template-columns: 1fr;
                gap: 10px;
              }
            }
          </style>
        </head>

        <body>

          <div class="slip">

            <div class="header">
              <h1>PUNAR AXIS THERAPY</h1>
              <p>Ayurveda & Physiotherapy</p>
              <p>Appointment Confirmation Slip</p>
            </div>

            <div class="content">

              <div class="appointment-id">
                Appointment ID:
                ${appointment.id}
              </div>

              <div class="section">

                <h3>
                  Patient Details
                </h3>

                <div class="row">

                  <div>
                    <div class="label">
                      Patient Name
                    </div>

                    <div class="value">
                      ${appointment.name || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">
                      Mobile Number
                    </div>

                    <div class="value">
                      ${appointment.phone || "-"}
                    </div>
                  </div>

                </div>

                <div class="row">

                  <div>
                    <div class="label">
                      Email
                    </div>

                    <div class="value">
                      ${appointment.email || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">
                      Age / Gender
                    </div>

                    <div class="value">
                      ${appointment.age || "-"} /
                      ${appointment.gender || "-"}
                    </div>
                  </div>

                </div>

                <div class="row">

                  <div>
                    <div class="label">
                      Treatment
                    </div>

                    <div class="value">
                      ${appointment.treatment || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">
                      Status
                    </div>

                    <div class="value">
                      ${appointment.status || "Confirmed"}
                    </div>
                  </div>

                </div>

              </div>

              <div class="section">

                <h3>
                  Appointment Details
                </h3>

                <div class="row">

                  <div>
                    <div class="label">
                      Doctor
                    </div>

                    <div class="value">
                      ${appointment.doctorName || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">
                      Specialty
                    </div>

                    <div class="value">
                      ${appointment.doctorSpecialty || "-"}
                    </div>
                  </div>

                </div>

                <div class="row">

                  <div>
                    <div class="label">
                      Date
                    </div>

                    <div class="value">
                      ${appointment.date || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">
                      Time
                    </div>

                    <div class="value">
                      ${appointment.slot || "-"}
                    </div>
                  </div>

                </div>

              </div>

              <div class="amount">

                <div class="amount-label">
                  TREATMENT AMOUNT
                </div>

                <div class="amount-value">
                  ₹${appointment.amount || "0"}
                </div>

              </div>

              <div class="status">
                APPOINTMENT CONFIRMED
              </div>

            </div>

            <div class="footer">
              Punar Axis Therapy ·
              www.punaraxistherapy.in
            </div>

          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  /* =======================================================
     BOOK APPOINTMENT
     ======================================================= */

  const bookAppointment = (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }

    if (!selectedSlot) {
      alert("Please select an appointment slot.");
      return;
    }

    if (!patient.name.trim()) {
      alert("Please enter patient name.");
      return;
    }

    if (!patient.phone.trim()) {
      alert("Please enter mobile number.");
      return;
    }

    if (!patient.treatment) {
      alert("Please select treatment.");
      return;
    }

    if (
      patient.amount === "" ||
      Number(patient.amount) < 0
    ) {
      alert("Please enter a valid treatment amount.");
      return;
    }

    const alreadyBooked =
      appointments.some(
        (appointment) =>
          appointment.doctorId === selectedDoctor &&
          appointment.date === selectedDate &&
          appointment.slot === selectedSlot &&
          appointment.status !== "Cancelled"
      );

    if (alreadyBooked) {
      alert("This slot is already booked.");
      return;
    }

    const newAppointment = {
      id: Date.now(),

      doctorId: selectedDoctor,

      doctorName: doctor.name,

      doctorSpecialty: doctor.specialty,

      doctorStartTime: doctor.startTime,

      doctorEndTime: doctor.endTime,

      date: selectedDate,

      slot: selectedSlot,

      name: patient.name.trim(),

      phone: patient.phone.trim(),

      email: patient.email.trim(),

      age: patient.age,

      gender: patient.gender,

      treatment: patient.treatment,

      amount: Number(patient.amount),

      status: "Confirmed",

      createdAt: new Date().toISOString(),
    };

    const updatedAppointments = [
      ...appointments,
      newAppointment,
    ];

    setAppointments(
      updatedAppointments
    );

    localStorage.setItem(
      "clinic_appointments",
      JSON.stringify(
        updatedAppointments
      )
    );

    setBookingSuccess(
      newAppointment
    );

    setPatient({
      name: "",
      phone: "",
      email: "",
      age: "",
      gender: "",
      treatment: "",
      amount: "",
    });

    setSelectedSlot("");
  };

  /* =======================================================
     CLOSE SUCCESS
     ======================================================= */

  const closeSuccess = () => {
    setBookingSuccess(null);
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div className="clinic-page">

      {/* ===================================================
          HEADER
          =================================================== */}

      <div className="clinic-header">

        <div>

          <div className="brand-title">
            Punar Axis Therapy
          </div>

          <h1>
            Book Appointment
          </h1>

          <p>
            Ayurveda & Physiotherapy ·
            Appointment Management
          </p>

        </div>

        <div className="clinic-date">

          {new Date().toLocaleDateString(
            "en-IN",
            {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}

        </div>

      </div>

      {/* ===================================================
          FORM
          =================================================== */}

      <div className="clinic-grid">

        <div className="clinic-card appointment-form-card">

          <div className="card-heading">

            <div>

              <h2>
                Patient Appointment
              </h2>

              <p>
                Enter patient details,
                select treatment and choose
                an available doctor slot.
              </p>

            </div>

            <div className="form-badge">
              New Appointment
            </div>

          </div>

          <form
            onSubmit={bookAppointment}
          >

            {/* =============================================
                PATIENT INFORMATION
                ============================================= */}

            <div className="form-grid">

              <div>

                <label>
                  Patient Name *
                </label>

                <input
                  type="text"
                  placeholder="Enter patient name"
                  value={patient.name}
                  onChange={(e) =>
                    updatePatient(
                      "name",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Mobile Number *
                </label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={patient.phone}
                  onChange={(e) =>
                    updatePatient(
                      "phone",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Email
                </label>

                <input
                  type="email"
                  placeholder="Email address"
                  value={patient.email}
                  onChange={(e) =>
                    updatePatient(
                      "email",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Age
                </label>

                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Age"
                  value={patient.age}
                  onChange={(e) =>
                    updatePatient(
                      "age",
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Gender
                </label>

                <select
                  value={patient.gender}
                  onChange={(e) =>
                    updatePatient(
                      "gender",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div>

                <label>
                  Treatment *
                </label>

                <select
                  value={patient.treatment}
                  onChange={(e) =>
                    updatePatient(
                      "treatment",
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select Treatment
                  </option>

                  {TREATMENTS.map(
                    (treatment) => (
                      <option
                        key={treatment}
                        value={treatment}
                      >
                        {treatment}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* =============================================
                AMOUNT
                ============================================= */}

            <div className="full-field">

              <label>
                Treatment Amount (₹) *
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter treatment amount"
                value={patient.amount}
                onChange={(e) =>
                  updatePatient(
                    "amount",
                    e.target.value
                  )
                }
              />

            </div>

            {/* =============================================
                DOCTOR
                ============================================= */}

            <div className="full-field">

              <label>
                Doctor *
              </label>

              <select
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(
                    e.target.value
                  );

                  setSelectedSlot("");
                }}
              >

                <option value="">
                  Select Doctor
                </option>

                {DOCTORS.map(
                  (doctorItem) => (
                    <option
                      key={doctorItem.id}
                      value={doctorItem.id}
                    >
                      {doctorItem.name} -{" "}
                      {doctorItem.specialty}
                    </option>
                  )
                )}

              </select>

            </div>

            {/* =============================================
                DOCTOR TIMING
                ============================================= */}

            {doctor && (
              <div className="full-field">

                <div
                  style={{
                    padding: "13px 15px",
                    borderRadius: "13px",
                    background:
                      "#eef8f5",
                    border:
                      "1px solid #d3e9e2",
                    color: "#0f6b5b",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {doctor.name} ·{" "}
                  {doctor.specialty}
                  {" — "}
                  {doctor.startTime} to{" "}
                  {doctor.endTime}
                  {" · 15-minute slots"}
                </div>

              </div>
            )}

            {/* =============================================
                DATE
                ============================================= */}

            <div className="full-field">

              <label>
                Appointment Date *
              </label>

              <input
                type="date"
                value={selectedDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => {

                  setSelectedDate(
                    e.target.value
                  );

                  setSelectedSlot("");
                }}
              />

            </div>

            {/* =============================================
                SLOTS
                ============================================= */}

            {doctor && (
              <div className="slot-section">

                <label>
                  Available Doctor Slots
                </label>

                <div className="slot-grid">

                  {doctor.slots.map(
                    (slot) => {

                      const isBooked =
                        bookedSlots.includes(
                          slot
                        );

                      return (
                        <button
                          type="button"
                          key={slot}
                          disabled={isBooked}
                          className={`slot ${
                            selectedSlot === slot
                              ? "selected"
                              : ""
                          } ${
                            isBooked
                              ? "booked"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedSlot(
                              slot
                            )
                          }
                        >

                          {slot}

                          {isBooked && (
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
            )}

            {/* =============================================
                SUBMIT
                ============================================= */}

            <button
              type="submit"
              className="primary-btn"
            >
              Confirm Appointment
            </button>

          </form>

        </div>

      </div>

      {/* ===================================================
          SUCCESS MODAL
          =================================================== */}

      {bookingSuccess && (
        <div className="pdf-modal-overlay">

          <div className="pdf-success-modal">

            <div className="success-icon">
              ✓
            </div>

            <h2>
              Appointment Confirmed
            </h2>

            <p>
              The appointment has been
              successfully booked.
            </p>

            <div className="appointment-summary">

              <div>

                <span>
                  Appointment ID
                </span>

                <strong>
                  {bookingSuccess.id}
                </strong>

              </div>

              <div>

                <span>
                  Patient
                </span>

                <strong>
                  {bookingSuccess.name}
                </strong>

              </div>

              <div>

                <span>
                  Doctor
                </span>

                <strong>
                  {bookingSuccess.doctorName}
                </strong>

              </div>

              <div>

                <span>
                  Treatment
                </span>

                <strong>
                  {bookingSuccess.treatment}
                </strong>

              </div>

              <div>

                <span>
                  Date & Time
                </span>

                <strong>
                  {bookingSuccess.date}
                  {" · "}
                  {bookingSuccess.slot}
                </strong>

              </div>

              <div>

                <span>
                  Treatment Amount
                </span>

                <strong>
                  ₹
                  {bookingSuccess.amount}
                </strong>

              </div>

            </div>

            <div className="pdf-actions">

              <button
                className="pdf-btn"
                onClick={() =>
                  generatePDF(
                    bookingSuccess
                  )
                }
              >
                Generate PDF
              </button>

              <button
                className="print-btn"
                onClick={() =>
                  printAppointment(
                    bookingSuccess
                  )
                }
              >
                Print Slip
              </button>

            </div>

            <button
              className="close-success-btn"
              onClick={closeSuccess}
            >
              Done
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Appointment;