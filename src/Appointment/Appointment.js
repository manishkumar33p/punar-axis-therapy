
// import React, { useEffect, useMemo, useState } from "react";
// import "./Appointment.css";

// function Appointment() {
//   const doctors = [
//     {
//       id: "DOC001",
//       name: "Dr. Rahul Sharma",
//       specialty: "Physiotherapist",
//       slots: ["09:00 AM", "10:00 AM", "11:00 AM", "04:00 PM", "05:00 PM"],
//     },
//     {
//       id: "DOC002",
//       name: "Dr. Neha Verma",
//       specialty: "Rehabilitation Therapist",
//       slots: ["10:00 AM", "11:00 AM", "12:00 PM", "03:00 PM", "04:00 PM"],
//     },
//   ];

//   const inventory = [
//     { id: 1, name: "Therapy Band", stock: 25, unit: "Pieces" },
//     { id: 2, name: "Hot Pack", stock: 12, unit: "Pieces" },
//     { id: 3, name: "Cold Pack", stock: 8, unit: "Pieces" },
//     { id: 4, name: "Therapy Gel", stock: 18, unit: "Tubes" },
//   ];

//   const [appointments, setAppointments] = useState([]);
//   const [selectedDoctor, setSelectedDoctor] = useState("");
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [selectedSlot, setSelectedSlot] = useState("");

//   const [patient, setPatient] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     age: "",
//     gender: "",
//     treatment: "",
//     notes: "",
//   });

//   useEffect(() => {
//     const savedAppointments = localStorage.getItem(
//       "clinic_appointments"
//     );

//     if (savedAppointments) {
//       setAppointments(JSON.parse(savedAppointments));
//     }
//   }, []);

//   const doctor = doctors.find(
//     (item) => item.id === selectedDoctor
//   );

//   const bookedSlots = useMemo(() => {
//     return appointments
//       .filter(
//         (appointment) =>
//           appointment.doctorId === selectedDoctor &&
//           appointment.date === selectedDate
//       )
//       .map((appointment) => appointment.slot);
//   }, [appointments, selectedDoctor, selectedDate]);

//   const bookAppointment = (e) => {
//     e.preventDefault();

//     if (!selectedDoctor) {
//       alert("Please select a doctor.");
//       return;
//     }

//     if (!selectedSlot) {
//       alert("Please select an appointment slot.");
//       return;
//     }

//     if (!patient.name || !patient.phone) {
//       alert("Please enter patient name and mobile number.");
//       return;
//     }

//     const alreadyBooked = appointments.some(
//       (appointment) =>
//         appointment.doctorId === selectedDoctor &&
//         appointment.date === selectedDate &&
//         appointment.slot === selectedSlot
//     );

//     if (alreadyBooked) {
//       alert("This slot is already booked.");
//       return;
//     }

//     const newAppointment = {
//       id: Date.now(),
//       doctorId: selectedDoctor,
//       doctorName: doctor.name,
//       date: selectedDate,
//       slot: selectedSlot,
//       ...patient,
//       status: "Confirmed",
//     };

//     const updatedAppointments = [
//       ...appointments,
//       newAppointment,
//     ];

//     setAppointments(updatedAppointments);

//     localStorage.setItem(
//       "clinic_appointments",
//       JSON.stringify(updatedAppointments)
//     );

//     alert("Appointment booked successfully!");

//     setPatient({
//       name: "",
//       phone: "",
//       email: "",
//       age: "",
//       gender: "",
//       treatment: "",
//       notes: "",
//     });

//     setSelectedSlot("");
//   };

//   const cancelAppointment = (id) => {
//     const updatedAppointments = appointments.filter(
//       (appointment) => appointment.id !== id
//     );

//     setAppointments(updatedAppointments);

//     localStorage.setItem(
//       "clinic_appointments",
//       JSON.stringify(updatedAppointments)
//     );
//   };

//   return (
//     <div className="clinic-page">

//       <div className="clinic-header">
//         <div>
//           <h1>Clinic Management</h1>
//           <p>Appointment & Inventory Management</p>
//         </div>

//         <div className="clinic-date">
//           {new Date().toLocaleDateString("en-IN", {
//             weekday: "long",
//             day: "numeric",
//             month: "long",
//             year: "numeric",
//           })}
//         </div>
//       </div>

//       <div className="clinic-grid">

//         {/* APPOINTMENT FORM */}

//         <div className="clinic-card">

//           <h2>Book Appointment</h2>

//           <form onSubmit={bookAppointment}>

//             <div className="form-grid">

//               <div>
//                 <label>Patient Name</label>

//                 <input
//                   type="text"
//                   placeholder="Enter patient name"
//                   value={patient.name}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       name: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Mobile Number</label>

//                 <input
//                   type="tel"
//                   placeholder="Enter mobile number"
//                   value={patient.phone}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       phone: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Email</label>

//                 <input
//                   type="email"
//                   placeholder="Email address"
//                   value={patient.email}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       email: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Age</label>

//                 <input
//                   type="number"
//                   placeholder="Age"
//                   value={patient.age}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       age: e.target.value,
//                     })
//                   }
//                 />
//               </div>

//               <div>
//                 <label>Gender</label>

//                 <select
//                   value={patient.gender}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       gender: e.target.value,
//                     })
//                   }
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               <div>
//                 <label>Treatment / Session</label>

//                 <select
//                   value={patient.treatment}
//                   onChange={(e) =>
//                     setPatient({
//                       ...patient,
//                       treatment: e.target.value,
//                     })
//                   }
//                 >
//                   <option value="">Select Treatment</option>
//                   <option value="Physiotherapy">
//                     Physiotherapy
//                   </option>
//                   <option value="Rehabilitation">
//                     Rehabilitation
//                   </option>
//                   <option value="Pain Management">
//                     Pain Management
//                   </option>
//                   <option value="Exercise Therapy">
//                     Exercise Therapy
//                   </option>
//                 </select>
//               </div>

//             </div>

//             <div className="full-field">

//               <label>Doctor</label>

//               <select
//                 value={selectedDoctor}
//                 onChange={(e) => {
//                   setSelectedDoctor(e.target.value);
//                   setSelectedSlot("");
//                 }}
//               >
//                 <option value="">Select Doctor</option>

//                 {doctors.map((doctor) => (
//                   <option
//                     key={doctor.id}
//                     value={doctor.id}
//                   >
//                     {doctor.name} - {doctor.specialty}
//                   </option>
//                 ))}
//               </select>

//             </div>

//             <div className="full-field">

//               <label>Appointment Date</label>

//               <input
//                 type="date"
//                 value={selectedDate}
//                 min={new Date()
//                   .toISOString()
//                   .split("T")[0]}
//                 onChange={(e) => {
//                   setSelectedDate(e.target.value);
//                   setSelectedSlot("");
//                 }}
//               />

//             </div>

//             {/* SLOTS */}

//             {doctor && (
//               <div className="slot-section">

//                 <label>Available Doctor Slots</label>

//                 <div className="slot-grid">

//                   {doctor.slots.map((slot) => {

//                     const isBooked =
//                       bookedSlots.includes(slot);

//                     return (
//                       <button
//                         type="button"
//                         key={slot}
//                         disabled={isBooked}
//                         className={`slot ${
//                           selectedSlot === slot
//                             ? "selected"
//                             : ""
//                         } ${
//                           isBooked
//                             ? "booked"
//                             : ""
//                         }`}
//                         onClick={() =>
//                           setSelectedSlot(slot)
//                         }
//                       >
//                         {slot}

//                         {isBooked && (
//                           <small>Booked</small>
//                         )}
//                       </button>
//                     );
//                   })}

//                 </div>

//               </div>
//             )}

//             <div className="full-field">

//               <label>Notes</label>

//               <textarea
//                 placeholder="Patient notes / additional information"
//                 value={patient.notes}
//                 onChange={(e) =>
//                   setPatient({
//                     ...patient,
//                     notes: e.target.value,
//                   })
//                 }
//               />

//             </div>

//             <button
//               type="submit"
//               className="primary-btn"
//             >
//               Confirm Appointment
//             </button>

//           </form>

//         </div>

//         {/* INVENTORY */}

//         <div className="clinic-card">

//           <div className="card-heading">

//             <div>
//               <h2>Inventory</h2>
//               <p>Clinic stock overview</p>
//             </div>

//             <button className="secondary-btn">
//               + Add Item
//             </button>

//           </div>

//           <div className="inventory-list">

//             {inventory.map((item) => (

//               <div
//                 className="inventory-item"
//                 key={item.id}
//               >

//                 <div>
//                   <h4>{item.name}</h4>
//                   <span>{item.unit}</span>
//                 </div>

//                 <div
//                   className={
//                     item.stock <= 10
//                       ? "low-stock"
//                       : "stock"
//                   }
//                 >
//                   {item.stock}

//                   <small>
//                     {item.stock <= 10
//                       ? "Low Stock"
//                       : "In Stock"}
//                   </small>
//                 </div>

//               </div>

//             ))}

//           </div>

//         </div>

//       </div>

//       {/* APPOINTMENT LIST */}

//       <div className="clinic-card appointment-card">

//         <div className="card-heading">

//           <div>
//             <h2>Appointments</h2>
//             <p>Upcoming clinic appointments</p>
//           </div>

//           <div className="appointment-count">
//             {appointments.length} Appointments
//           </div>

//         </div>

//         {appointments.length === 0 ? (

//           <div className="empty-state">
//             No appointments booked yet.
//           </div>

//         ) : (

//           <div className="appointment-table">

//             <div className="table-header">
//               <span>Patient</span>
//               <span>Doctor</span>
//               <span>Date</span>
//               <span>Time</span>
//               <span>Treatment</span>
//               <span>Status</span>
//               <span>Action</span>
//             </div>

//             {appointments.map((appointment) => (

//               <div
//                 className="table-row"
//                 key={appointment.id}
//               >

//                 <span>
//                   <strong>
//                     {appointment.name}
//                   </strong>

//                   <small>
//                     {appointment.phone}
//                   </small>
//                 </span>

//                 <span>
//                   {appointment.doctorName}
//                 </span>

//                 <span>
//                   {appointment.date}
//                 </span>

//                 <span>
//                   {appointment.slot}
//                 </span>

//                 <span>
//                   {appointment.treatment || "-"}
//                 </span>

//                 <span>
//                   <b className="status">
//                     {appointment.status}
//                   </b>
//                 </span>

//                 <span>

//                   <button
//                     className="cancel-btn"
//                     onClick={() =>
//                       cancelAppointment(
//                         appointment.id
//                       )
//                     }
//                   >
//                     Cancel
//                   </button>

//                 </span>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>

//     </div>
//   );
// }

// export default Appointment;


import React, { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import "./Appointment.css";

function Appointment() {
  const doctors = [
    {
      id: "DOC001",
      name: "Dr. Rahul Sharma",
      specialty: "Physiotherapist",
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
      specialty: "Rehabilitation Therapist",
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
    notes: "",
  });

  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    const savedAppointments = localStorage.getItem(
      "clinic_appointments"
    );

    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error("Unable to load appointments:", error);
      }
    }
  }, []);

  const doctor = doctors.find(
    (item) => item.id === selectedDoctor
  );

  const bookedSlots = useMemo(() => {
    return appointments
      .filter(
        (appointment) =>
          appointment.doctorId === selectedDoctor &&
          appointment.date === selectedDate &&
          appointment.status !== "Cancelled"
      )
      .map((appointment) => appointment.slot);
  }, [appointments, selectedDoctor, selectedDate]);

  /* --------------------------------
     PDF GENERATION
  -------------------------------- */

  const generatePDF = (appointment) => {
    if (!appointment) return;

    const pdf = new jsPDF();

    const pageWidth = pdf.internal.pageSize.getWidth();

    /* HEADER */

    pdf.setFillColor(33, 102, 91);
    pdf.rect(0, 0, pageWidth, 38, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(21);

    pdf.text(
      "PUNAR AXIS THERAPY",
      pageWidth / 2,
      15,
      { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    pdf.text(
      "Ayurveda & Physiotherapy",
      pageWidth / 2,
      23,
      { align: "center" }
    );

    pdf.text(
      "Appointment Confirmation Slip",
      pageWidth / 2,
      31,
      { align: "center" }
    );

    /* APPOINTMENT ID */

    pdf.setTextColor(33, 102, 91);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);

    pdf.text(
      `Appointment ID: ${appointment.id}`,
      15,
      52
    );

    pdf.setDrawColor(220, 220, 220);
    pdf.line(15, 58, pageWidth - 15, 58);

    /* PATIENT DETAILS */

    pdf.setTextColor(40, 40, 40);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);

    pdf.text("Patient Details", 15, 70);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    let y = 80;

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

    /* APPOINTMENT DETAILS */

    y += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);

    pdf.text(
      "Appointment Details",
      15,
      y
    );

    y += 10;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(
      `Doctor: ${appointment.doctorName || "-"}`,
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

    /* NOTES */

    y += 20;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);

    pdf.text(
      "Notes",
      15,
      y
    );

    y += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    const notes =
      appointment.notes ||
      "No additional notes provided.";

    const wrappedNotes = pdf.splitTextToSize(
      notes,
      pageWidth - 30
    );

    pdf.text(
      wrappedNotes,
      15,
      y
    );

    /* CONFIRMATION BOX */

    y += wrappedNotes.length * 6 + 18;

    pdf.setFillColor(239, 248, 245);
    pdf.roundedRect(
      15,
      y,
      pageWidth - 30,
      27,
      4,
      4,
      "F"
    );

    pdf.setTextColor(33, 102, 91);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);

    pdf.text(
      "Appointment Status: CONFIRMED",
      pageWidth / 2,
      y + 11,
      { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    pdf.text(
      "Please carry this appointment slip during your visit.",
      pageWidth / 2,
      y + 19,
      { align: "center" }
    );

    /* FOOTER */

    const footerY =
      pdf.internal.pageSize.getHeight() - 18;

    pdf.setDrawColor(220, 220, 220);

    pdf.line(
      15,
      footerY - 6,
      pageWidth - 15,
      footerY - 6
    );

    pdf.setTextColor(110, 110, 110);
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
      { align: "right" }
    );

    pdf.save(
      `Punar-Axis-Appointment-${appointment.id}.pdf`
    );
  };

  /* --------------------------------
     PRINT SLIP
  -------------------------------- */

  const printAppointment = (appointment) => {
    if (!appointment) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=800,height=900"
    );

    if (!printWindow) {
      alert("Please allow pop-ups to print the appointment slip.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Appointment Slip - ${appointment.id}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 30px;
              font-family: Arial, sans-serif;
              color: #252525;
              background: #ffffff;
            }

            .slip {
              max-width: 720px;
              margin: auto;
              border: 1px solid #dfe7e4;
              border-radius: 14px;
              overflow: hidden;
            }

            .header {
              background: #21665b;
              color: white;
              text-align: center;
              padding: 28px 20px;
            }

            .header h1 {
              margin: 0;
              font-size: 24px;
            }

            .header p {
              margin: 7px 0 0;
              font-size: 13px;
            }

            .content {
              padding: 28px;
            }

            .appointment-id {
              color: #21665b;
              font-weight: bold;
              margin-bottom: 22px;
            }

            .section {
              margin-bottom: 25px;
            }

            .section h3 {
              margin: 0 0 14px;
              color: #21665b;
              font-size: 16px;
              border-bottom: 1px solid #e5e5e5;
              padding-bottom: 8px;
            }

            .row {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 18px;
              margin-bottom: 12px;
            }

            .label {
              font-size: 11px;
              color: #777;
              margin-bottom: 4px;
            }

            .value {
              font-size: 14px;
              font-weight: 600;
            }

            .status {
              background: #eaf7f2;
              color: #21665b;
              padding: 15px;
              border-radius: 10px;
              text-align: center;
              font-weight: bold;
            }

            .notes {
              background: #f7f9f8;
              padding: 14px;
              border-radius: 8px;
              line-height: 1.5;
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
                Appointment ID: ${appointment.id}
              </div>

              <div class="section">
                <h3>Patient Details</h3>

                <div class="row">
                  <div>
                    <div class="label">Patient Name</div>
                    <div class="value">
                      ${appointment.name || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">Mobile Number</div>
                    <div class="value">
                      ${appointment.phone || "-"}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div>
                    <div class="label">Email</div>
                    <div class="value">
                      ${appointment.email || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">Age / Gender</div>
                    <div class="value">
                      ${appointment.age || "-"} /
                      ${appointment.gender || "-"}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div>
                    <div class="label">Treatment</div>
                    <div class="value">
                      ${appointment.treatment || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">Status</div>
                    <div class="value">
                      ${appointment.status || "Confirmed"}
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3>Appointment Details</h3>

                <div class="row">
                  <div>
                    <div class="label">Doctor</div>
                    <div class="value">
                      ${appointment.doctorName || "-"}
                    </div>
                  </div>

                  <div>
                    <div class="label">Date</div>
                    <div class="value">
                      ${appointment.date || "-"}
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div>
                    <div class="label">Time</div>
                    <div class="value">
                      ${appointment.slot || "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div class="section">
                <h3>Notes</h3>

                <div class="notes">
                  ${
                    appointment.notes ||
                    "No additional notes provided."
                  }
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

  /* --------------------------------
     BOOK APPOINTMENT
  -------------------------------- */

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

    if (!patient.name || !patient.phone) {
      alert("Please enter patient name and mobile number.");
      return;
    }

    const alreadyBooked = appointments.some(
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
      date: selectedDate,
      slot: selectedSlot,
      ...patient,
      status: "Confirmed",
    };

    const updatedAppointments = [
      ...appointments,
      newAppointment,
    ];

    setAppointments(updatedAppointments);

    localStorage.setItem(
      "clinic_appointments",
      JSON.stringify(updatedAppointments)
    );

    setBookingSuccess(newAppointment);

    setPatient({
      name: "",
      phone: "",
      email: "",
      age: "",
      gender: "",
      treatment: "",
      notes: "",
    });

    setSelectedSlot("");
  };

  const closeSuccess = () => {
    setBookingSuccess(null);
  };

  return (
    <div className="clinic-page">

      {/* HEADER */}

      <div className="clinic-header">

        <div>
          <div className="brand-title">
            Punar Axis Therapy
          </div>

          <h1>Book Appointment</h1>

          <p>
            Ayurveda & Physiotherapy · Appointment Management
          </p>
        </div>

        <div className="clinic-date">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>

      </div>

      {/* FORM */}

      <div className="clinic-grid">

        <div className="clinic-card appointment-form-card">

          <div className="card-heading">
            <div>
              <h2>Patient Appointment</h2>
              <p>
                Enter patient details and select an available
                appointment slot.
              </p>
            </div>

            <div className="form-badge">
              New Appointment
            </div>
          </div>

          <form onSubmit={bookAppointment}>

            <div className="form-grid">

              <div>
                <label>Patient Name</label>

                <input
                  type="text"
                  placeholder="Enter patient name"
                  value={patient.name}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>Mobile Number</label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  value={patient.phone}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  type="email"
                  placeholder="Email address"
                  value={patient.email}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      email: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>Age</label>

                <input
                  type="number"
                  placeholder="Age"
                  value={patient.age}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      age: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>Gender</label>

                <select
                  value={patient.gender}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      gender: e.target.value,
                    })
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
                <label>Treatment / Session</label>

                <select
                  value={patient.treatment}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      treatment: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Select Treatment
                  </option>

                  <option value="Physiotherapy">
                    Physiotherapy
                  </option>

                  <option value="Rehabilitation">
                    Rehabilitation
                  </option>

                  <option value="Pain Management">
                    Pain Management
                  </option>

                  <option value="Exercise Therapy">
                    Exercise Therapy
                  </option>
                </select>
              </div>

            </div>

            {/* DOCTOR */}

            <div className="full-field">

              <label>Doctor</label>

              <select
                value={selectedDoctor}
                onChange={(e) => {
                  setSelectedDoctor(e.target.value);
                  setSelectedSlot("");
                }}
              >
                <option value="">
                  Select Doctor
                </option>

                {doctors.map((doctorItem) => (
                  <option
                    key={doctorItem.id}
                    value={doctorItem.id}
                  >
                    {doctorItem.name} -{" "}
                    {doctorItem.specialty}
                  </option>
                ))}
              </select>

            </div>

            {/* DATE */}

            <div className="full-field">

              <label>Appointment Date</label>

              <input
                type="date"
                value={selectedDate}
                min={new Date()
                  .toISOString()
                  .split("T")[0]}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot("");
                }}
              />

            </div>

            {/* SLOTS */}

            {doctor && (
              <div className="slot-section">

                <label>
                  Available Doctor Slots
                </label>

                <div className="slot-grid">

                  {doctor.slots.map((slot) => {

                    const isBooked =
                      bookedSlots.includes(slot);

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
                          setSelectedSlot(slot)
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
                  })}

                </div>

              </div>
            )}

            {/* NOTES */}

            <div className="full-field">

              <label>Notes</label>

              <textarea
                placeholder="Patient notes / additional information"
                value={patient.notes}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    notes: e.target.value,
                  })
                }
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              className="primary-btn"
            >
              Confirm Appointment
            </button>

          </form>

        </div>

      </div>

      {/* SUCCESS MODAL */}

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
              The appointment has been successfully
              booked.
            </p>

            <div className="appointment-summary">

              <div>
                <span>Appointment ID</span>
                <strong>
                  {bookingSuccess.id}
                </strong>
              </div>

              <div>
                <span>Patient</span>
                <strong>
                  {bookingSuccess.name}
                </strong>
              </div>

              <div>
                <span>Doctor</span>
                <strong>
                  {bookingSuccess.doctorName}
                </strong>
              </div>

              <div>
                <span>Date & Time</span>
                <strong>
                  {bookingSuccess.date} ·{" "}
                  {bookingSuccess.slot}
                </strong>
              </div>

            </div>

            <div className="pdf-actions">

              <button
                className="pdf-btn"
                onClick={() =>
                  generatePDF(bookingSuccess)
                }
              >
                Generate PDF
              </button>

              <button
                className="print-btn"
                onClick={() =>
                  printAppointment(bookingSuccess)
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