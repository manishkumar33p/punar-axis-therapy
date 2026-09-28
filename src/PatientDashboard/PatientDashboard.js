

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";

// import { db } from "../firebase";
// import {
//   getPatientSession,
//   logoutPatient,
// } from "../auth";

// import "./PatientDashboard.css";

// /*
// =========================================================
// BILLING COLLECTION SETUP
// =========================================================

// IMPORTANT:

// Your current available source code does not expose the
// exact Firestore collection name used by your existing
// billing module.

// So keep the existing billing collection name here.

// If your Firebase collection is:

//     bills

// leave it as it is.

// If your existing billing collection is:

//     billing

// change it to:

//     const BILLING_COLLECTION = "billing";

// Only this one line needs to change.
// =========================================================
// */

// const BILLING_COLLECTION = "bills";

// function PatientDashboard() {
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
//   const [appointments, setAppointments] = useState([]);
//   const [treatments, setTreatments] = useState([]);
//   const [bills, setBills] = useState([]);

//   const [activeTab, setActiveTab] = useState("overview");
//   const [loading, setLoading] = useState(true);

//   /*
//   ========================================================
//   DATE HELPERS
//   ========================================================
//   */

//   const getDateValue = useCallback((value) => {
//     if (!value) return null;

//     if (
//       typeof value === "object" &&
//       value?.toDate
//     ) {
//       const date = value.toDate();

//       if (!Number.isNaN(date.getTime())) {
//         return date;
//       }

//       return null;
//     }

//     const date = new Date(value);

//     if (Number.isNaN(date.getTime())) {
//       return null;
//     }

//     return date;
//   }, []);

//   const formatDate = useCallback(
//     (value) => {
//       const date = getDateValue(value);

//       if (!date) return "—";

//       return date.toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       });
//     },
//     [getDateValue]
//   );

//   const formatTime = useCallback((value) => {
//     if (!value) return "—";

//     return String(value);
//   }, []);

//   const formatCurrency = useCallback((value) => {
//     const number = Number(value);

//     if (Number.isNaN(number)) {
//       return "₹0";
//     }

//     return `₹${number.toLocaleString("en-IN")}`;
//   }, []);

//   /*
//   ========================================================
//   LOAD PATIENT DATA
//   ========================================================
//   */

//   const loadPatientData = useCallback(async () => {
//     try {
//       setLoading(true);

//       /*
//       ------------------------------------------------------
//       Get logged-in patient session
//       ------------------------------------------------------
//       */

//       const session = getPatientSession();

//       if (
//         !session ||
//         session.loggedIn !== true ||
//         !session.patient?.patientId
//       ) {
//         navigate("/patient-login", {
//           replace: true,
//         });

//         return;
//       }

//       const patientId = String(
//         session.patient.patientId
//       )
//         .trim()
//         .toUpperCase();

//       /*
//       ------------------------------------------------------
//       Patient profile
//       ------------------------------------------------------
//       */

//       let patientData = {
//         ...session.patient,
//         patientId,
//       };

//       try {
//         const patientRef = query(
//           collection(db, "patients"),
//           where("patientId", "==", patientId)
//         );

//         const patientSnapshot =
//           await getDocs(patientRef);

//         if (!patientSnapshot.empty) {
//           const patientDoc =
//             patientSnapshot.docs[0];

//           patientData = {
//             ...patientData,
//             id: patientDoc.id,
//             ...patientDoc.data(),
//             patientId,
//           };
//         }
//       } catch (error) {
//         console.warn(
//           "Patient profile could not be refreshed:",
//           error
//         );
//       }

//       /*
//       ------------------------------------------------------
//       APPOINTMENTS

//       Existing collection:

//           appointments

//       Matching:

//           patientId == logged-in patient ID
//       ------------------------------------------------------
//       */

//       let appointmentData = [];

//       try {
//         const appointmentQuery = query(
//           collection(db, "appointments"),
//           where("patientId", "==", patientId)
//         );

//         const appointmentSnapshot =
//           await getDocs(appointmentQuery);

//         appointmentData =
//           appointmentSnapshot.docs.map(
//             (item) => ({
//               id: item.id,
//               ...item.data(),
//             })
//           );
//       } catch (error) {
//         console.error(
//           "Appointment loading error:",
//           error
//         );

//         appointmentData = [];
//       }

//       /*
//       ------------------------------------------------------
//       TREATMENTS

//       Existing collection:

//           patientTreatments

//       Matching:

//           patientId == logged-in patient ID
//       ------------------------------------------------------
//       */

//       let treatmentData = [];

//       try {
//         const treatmentQuery = query(
//           collection(db, "patientTreatments"),
//           where("patientId", "==", patientId)
//         );

//         const treatmentSnapshot =
//           await getDocs(treatmentQuery);

//         treatmentData =
//           treatmentSnapshot.docs.map(
//             (item) => ({
//               id: item.id,
//               ...item.data(),
//             })
//           );
//       } catch (error) {
//         console.warn(
//           "Treatment loading error:",
//           error
//         );

//         treatmentData = [];
//       }

//       /*
//       ------------------------------------------------------
//       BILLS

//       Existing billing collection is configured above:

//           BILLING_COLLECTION

//       Primary matching:

//           patientId == logged-in patient ID

//       We also try common existing field names so that
//       existing billing records can be connected without
//       changing the billing records themselves.
//       ------------------------------------------------------
//       */

//       let billData = [];

//       try {
//         /*
//         ----------------------------------------------------
//         FIRST:
//         Try the same patientId structure.
//         ----------------------------------------------------
//         */

//         const billQuery = query(
//           collection(
//             db,
//             BILLING_COLLECTION
//           ),
//           where(
//             "patientId",
//             "==",
//             patientId
//           )
//         );

//         const billSnapshot =
//           await getDocs(billQuery);

//         billData =
//           billSnapshot.docs.map(
//             (item) => ({
//               id: item.id,
//               ...item.data(),
//             })
//           );

//         /*
//         ----------------------------------------------------
//         If no records were found, try patientID.

//         This helps if the existing billing module uses
//         patientID instead of patientId.
//         ----------------------------------------------------
//         */

//         if (billData.length === 0) {
//           try {
//             const alternateQuery =
//               query(
//                 collection(
//                   db,
//                   BILLING_COLLECTION
//                 ),
//                 where(
//                   "patientID",
//                   "==",
//                   patientId
//                 )
//               );

//             const alternateSnapshot =
//               await getDocs(
//                 alternateQuery
//               );

//             billData =
//               alternateSnapshot.docs.map(
//                 (item) => ({
//                   id: item.id,
//                   ...item.data(),
//                 })
//               );
//           } catch (alternateError) {
//             console.warn(
//               "Alternate bill patientID lookup failed:",
//               alternateError
//             );
//           }
//         }
//       } catch (error) {
//         /*
//         ----------------------------------------------------
//         IMPORTANT:

//         If bills collection does not exist or Firestore
//         rules do not allow access, the rest of dashboard
//         should continue working.
//         ----------------------------------------------------
//         */

//         console.warn(
//           `Billing data could not be loaded from "${BILLING_COLLECTION}".`,
//           error
//         );

//         billData = [];
//       }

//       /*
//       ------------------------------------------------------
//       Save everything
//       ------------------------------------------------------
//       */

//       setPatient(patientData);
//       setAppointments(appointmentData);
//       setTreatments(treatmentData);
//       setBills(billData);
//     } catch (error) {
//       console.error(
//         "Patient dashboard loading error:",
//         error
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [navigate]);

//   /*
//   ========================================================
//   INITIAL LOAD
//   ========================================================
//   */

//   useEffect(() => {
//     loadPatientData();
//   }, [loadPatientData]);

//   /*
//   ========================================================
//   LOGOUT
//   ========================================================
//   */

//   const logout = async () => {
//     try {
//       await logoutPatient();
//     } catch (error) {
//       console.warn(
//         "Patient logout warning:",
//         error
//       );
//     }

//     navigate("/patient-login", {
//       replace: true,
//     });
//   };

//   /*
//   ========================================================
//   TODAY
//   ========================================================
//   */

//   const today = useMemo(() => {
//     const date = new Date();

//     date.setHours(
//       0,
//       0,
//       0,
//       0
//     );

//     return date;
//   }, []);

//   /*
//   ========================================================
//   APPOINTMENT CALCULATIONS
//   ========================================================
//   */

//   const upcomingAppointments = useMemo(() => {
//     return appointments
//       .filter((appointment) => {
//         const date = getDateValue(
//           appointment.date
//         );

//         if (!date) return false;

//         date.setHours(
//           0,
//           0,
//           0,
//           0
//         );

//         const status = String(
//           appointment.status || ""
//         ).toLowerCase();

//         return (
//           date >= today &&
//           status !== "cancelled" &&
//           status !== "canceled"
//         );
//       })
//       .sort(
//         (a, b) =>
//           getDateValue(a.date) -
//           getDateValue(b.date)
//       );
//   }, [
//     appointments,
//     getDateValue,
//     today,
//   ]);

//   const completedAppointments =
//     useMemo(() => {
//       return appointments.filter(
//         (appointment) => {
//           const status =
//             String(
//               appointment.status || ""
//             ).toLowerCase();

//           return (
//             status === "completed" ||
//             status === "complete"
//           );
//         }
//       );
//     }, [appointments]);

//   const nextAppointment =
//     upcomingAppointments[0] || null;

//   /*
//   ========================================================
//   PATIENT INFORMATION
//   ========================================================
//   */

//   const currentTreatment =
//     patient?.currentTreatment ||
//     patient?.treatment ||
//     patient?.currentTreatmentName ||
//     "No active treatment";

//   const doctor =
//     patient?.doctor ||
//     patient?.doctorName ||
//     patient?.assignedDoctor ||
//     patient?.therapist ||
//     nextAppointment?.doctorName ||
//     "—";

//   const totalSessions = Number(
//     patient?.totalSessions ||
//       patient?.plannedSessions ||
//       patient?.sessionsPlanned ||
//       0
//   );

//   const completedSessions =
//     Number(
//       patient?.completedSessions ||
//         patient?.sessionsCompleted ||
//         0
//     );

//   const calculatedProgress =
//     totalSessions > 0
//       ? Math.min(
//           100,
//           Math.round(
//             (completedSessions /
//               totalSessions) *
//               100
//           )
//         )
//       : 0;

//   const progress =
//     Number(
//       patient?.treatmentProgress
//     ) || calculatedProgress;

//   const patientName =
//     patient?.name ||
//     patient?.patientName ||
//     "Patient";

//   const patientId =
//     patient?.patientId ||
//     patient?.id ||
//     "—";

//   /*
//   ========================================================
//   BILL CALCULATIONS
//   ========================================================
//   */

//   const getBillAmount = useCallback(
//     (bill) => {
//       return Number(
//         bill?.amount ??
//           bill?.totalAmount ??
//           bill?.grandTotal ??
//           bill?.netAmount ??
//           bill?.billAmount ??
//           bill?.total ??
//           0
//       );
//     },
//     []
//   );

//   const totalBillAmount = useMemo(() => {
//     return bills.reduce(
//       (total, bill) =>
//         total + getBillAmount(bill),
//       0
//     );
//   }, [bills, getBillAmount]);

//   const paidBillAmount = useMemo(() => {
//     return bills.reduce(
//       (total, bill) => {
//         const status = String(
//           bill?.paymentStatus ||
//             bill?.status ||
//             ""
//         ).toLowerCase();

//         const paid =
//           status === "paid" ||
//           status === "completed" ||
//           status === "success";

//         return paid
//           ? total + getBillAmount(bill)
//           : total;
//       },
//       0
//     );
//   }, [bills, getBillAmount]);

//   const pendingBillAmount =
//     Math.max(
//       0,
//       totalBillAmount -
//         paidBillAmount
//     );

//   /*
//   ========================================================
//   BILL HELPERS
//   ========================================================
//   */

//   const getBillDate = useCallback(
//     (bill) => {
//       return (
//         bill?.date ||
//         bill?.billDate ||
//         bill?.invoiceDate ||
//         bill?.createdAt ||
//         bill?.issuedAt
//       );
//     },
//     []
//   );

//   const getBillNumber = useCallback(
//     (bill) => {
//       return (
//         bill?.invoiceNumber ||
//         bill?.invoiceNo ||
//         bill?.billNumber ||
//         bill?.billNo ||
//         bill?.receiptNumber ||
//         bill?.receiptNo ||
//         bill?.id ||
//         "—"
//       );
//     },
//     []
//   );

//   const getBillDescription =
//     useCallback((bill) => {
//       return (
//         bill?.description ||
//         bill?.service ||
//         bill?.serviceName ||
//         bill?.treatment ||
//         bill?.treatmentName ||
//         bill?.particular ||
//         bill?.particulars ||
//         "Clinic Service"
//       );
//     }, []);

//   const getBillStatus =
//     useCallback((bill) => {
//       return (
//         bill?.paymentStatus ||
//         bill?.status ||
//         "Pending"
//       );
//     }, []);

//   /*
//   ========================================================
//   OVERVIEW
//   ========================================================
//   */

//   const renderOverview = () => (
//     <>
//       <div className="patient-section-grid">
//         <div className="patient-info-card appointment-card">
//           <div className="patient-card-top">
//             <div>
//               <span className="patient-card-label">
//                 NEXT APPOINTMENT
//               </span>

//               <h3>
//                 {nextAppointment
//                   ? formatDate(
//                       nextAppointment.date
//                     )
//                   : "No appointment"}
//               </h3>
//             </div>

//             <div className="patient-card-icon">
//               📅
//             </div>
//           </div>

//           {nextAppointment ? (
//             <>
//               <p className="patient-card-main">
//                 {formatTime(
//                   nextAppointment.slot ||
//                     nextAppointment.time
//                 )}
//               </p>

//               <p className="patient-card-sub">
//                 {nextAppointment.doctorName ||
//                   nextAppointment.doctor ||
//                   doctor}
//               </p>

//               <span className="patient-status confirmed">
//                 {nextAppointment.status ||
//                   "Confirmed"}
//               </span>
//             </>
//           ) : (
//             <p className="patient-empty-small">
//               No upcoming appointment found.
//             </p>
//           )}
//         </div>

//         <div className="patient-info-card treatment-card">
//           <div className="patient-card-top">
//             <div>
//               <span className="patient-card-label">
//                 CURRENT TREATMENT
//               </span>

//               <h3>
//                 {currentTreatment}
//               </h3>
//             </div>

//             <div className="patient-card-icon">
//               🩺
//             </div>
//           </div>

//           <p className="patient-card-sub">
//             {doctor}
//           </p>

//           {totalSessions > 0 ? (
//             <>
//               <div className="patient-progress">
//                 <div className="patient-progress-head">
//                   <span>
//                     Treatment Progress
//                   </span>

//                   <strong>
//                     {progress}%
//                   </strong>
//                 </div>

//                 <div className="patient-progress-track">
//                   <div
//                     style={{
//                       width: `${progress}%`,
//                     }}
//                   />
//                 </div>
//               </div>

//               <small>
//                 {completedSessions} of{" "}
//                 {totalSessions} sessions
//               </small>
//             </>
//           ) : (
//             <small>
//               Treatment session details
//               will appear here.
//             </small>
//           )}
//         </div>
//       </div>

//       <div className="patient-stats-grid">
//         <div className="patient-stat-card">
//           <span>🗓️</span>

//           <div>
//             <strong>
//               {appointments.length}
//             </strong>

//             <p>Total Appointments</p>
//           </div>
//         </div>

//         <div className="patient-stat-card">
//           <span>✓</span>

//           <div>
//             <strong>
//               {completedAppointments.length}
//             </strong>

//             <p>Completed Visits</p>
//           </div>
//         </div>

//         <div className="patient-stat-card">
//           <span>🩺</span>

//           <div>
//             <strong>
//               {treatments.length}
//             </strong>

//             <p>Treatment Records</p>
//           </div>
//         </div>

//         <div className="patient-stat-card">
//           <span>💰</span>

//           <div>
//             <strong>
//               {bills.length}
//             </strong>

//             <p>Total Bills</p>
//           </div>
//         </div>
//       </div>

//       <div className="patient-content-card">
//         <div className="patient-content-title">
//           <div>
//             <span>
//               RECENT ACTIVITY
//             </span>

//             <h3>
//               Your Recent Appointments
//             </h3>
//           </div>

//           <button
//             onClick={() =>
//               setActiveTab(
//                 "appointments"
//               )
//             }
//           >
//             View All →
//           </button>
//         </div>

//         {appointments.length === 0 ? (
//           <div className="patient-empty-state">
//             <div>📅</div>

//             <h4>
//               No appointment history
//             </h4>

//             <p>
//               Your appointment history
//               will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="patient-table-wrap">
//             <table className="patient-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Treatment</th>
//                   <th>Doctor</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {appointments
//                   .slice()
//                   .sort(
//                     (a, b) =>
//                       getDateValue(
//                         b.date
//                       ) -
//                       getDateValue(
//                         a.date
//                       )
//                   )
//                   .slice(0, 5)
//                   .map(
//                     (
//                       appointment,
//                       index
//                     ) => (
//                       <tr
//                         key={
//                           appointment.id ||
//                           index
//                         }
//                       >
//                         <td>
//                           {formatDate(
//                             appointment.date
//                           )}
//                         </td>

//                         <td>
//                           {appointment.treatment ||
//                             appointment.treatmentName ||
//                             "—"}
//                         </td>

//                         <td>
//                           {appointment.doctorName ||
//                             appointment.doctor ||
//                             "—"}
//                         </td>

//                         <td>
//                           <span className="patient-status">
//                             {appointment.status ||
//                               "Confirmed"}
//                           </span>
//                         </td>
//                       </tr>
//                     )
//                   )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       <div className="patient-content-card">
//         <div className="patient-content-title">
//           <div>
//             <span>
//               BILLING SUMMARY
//             </span>

//             <h3>
//               Your Bills & Payments
//             </h3>
//           </div>

//           <button
//             onClick={() =>
//               setActiveTab("bills")
//             }
//           >
//             View Bills →
//           </button>
//         </div>

//         <div className="patient-stats-grid">
//           <div className="patient-stat-card">
//             <span>🧾</span>

//             <div>
//               <strong>
//                 {bills.length}
//               </strong>

//               <p>Total Bills</p>
//             </div>
//           </div>

//           <div className="patient-stat-card">
//             <span>💰</span>

//             <div>
//               <strong>
//                 {formatCurrency(
//                   totalBillAmount
//                 )}
//               </strong>

//               <p>Total Amount</p>
//             </div>
//           </div>

//           <div className="patient-stat-card">
//             <span>✓</span>

//             <div>
//               <strong>
//                 {formatCurrency(
//                   paidBillAmount
//                 )}
//               </strong>

//               <p>Paid</p>
//             </div>
//           </div>

//           <div className="patient-stat-card">
//             <span>⏳</span>

//             <div>
//               <strong>
//                 {formatCurrency(
//                   pendingBillAmount
//                 )}
//               </strong>

//               <p>Pending</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   /*
//   ========================================================
//   APPOINTMENTS
//   ========================================================
//   */

//   const renderAppointments = () => (
//     <div className="patient-content-card">
//       <div className="patient-content-title">
//         <div>
//           <span>
//             MY APPOINTMENTS
//           </span>

//           <h3>
//             Appointments & Schedule
//           </h3>
//         </div>
//       </div>

//       {appointments.length === 0 ? (
//         <div className="patient-empty-state">
//           <div>📅</div>

//           <h4>
//             No appointments found
//           </h4>

//           <p>
//             Your appointments will
//             appear here once they are
//             added by the clinic.
//           </p>
//         </div>
//       ) : (
//         <div className="patient-appointment-list">
//           {appointments
//             .slice()
//             .sort(
//               (a, b) =>
//                 getDateValue(
//                   b.date
//                 ) -
//                 getDateValue(
//                   a.date
//                 )
//             )
//             .map(
//               (
//                 appointment,
//                 index
//               ) => (
//                 <div
//                   className="patient-appointment-item"
//                   key={
//                     appointment.id ||
//                     index
//                   }
//                 >
//                   <div className="patient-appointment-date">
//                     <strong>
//                       {getDateValue(
//                         appointment.date
//                       )?.getDate() ||
//                         "—"}
//                     </strong>

//                     <span>
//                       {getDateValue(
//                         appointment.date
//                       )?.toLocaleDateString(
//                         "en-IN",
//                         {
//                           month:
//                             "short",
//                         }
//                       ) || ""}
//                     </span>
//                   </div>

//                   <div className="patient-appointment-info">
//                     <h4>
//                       {appointment.treatment ||
//                         appointment.treatmentName ||
//                         "Therapy Session"}
//                     </h4>

//                     <p>
//                       {appointment.doctorName ||
//                         appointment.doctor ||
//                         "Therapist"}{" "}
//                       •{" "}
//                       {formatTime(
//                         appointment.slot ||
//                           appointment.time
//                       )}
//                     </p>

//                     <small>
//                       {formatDate(
//                         appointment.date
//                       )}
//                     </small>
//                   </div>

//                   <span className="patient-status">
//                     {appointment.status ||
//                       "Confirmed"}
//                   </span>
//                 </div>
//               )
//             )}
//         </div>
//       )}
//     </div>
//   );

//   /*
//   ========================================================
//   TREATMENTS
//   ========================================================
//   */

//   const renderTreatments = () => (
//     <div className="patient-content-card">
//       <div className="patient-content-title">
//         <div>
//           <span>
//             TREATMENT JOURNEY
//           </span>

//           <h3>
//             Current & Past Treatments
//           </h3>
//         </div>
//       </div>

//       <div className="patient-current-treatment">
//         <div className="patient-treatment-icon">
//           🩺
//         </div>

//         <div>
//           <span>
//             ACTIVE TREATMENT
//           </span>

//           <h3>
//             {currentTreatment}
//           </h3>

//           <p>
//             Therapist: {doctor}
//           </p>
//         </div>

//         <div className="patient-treatment-progress">
//           <strong>
//             {progress}%
//           </strong>

//           <span>
//             Progress
//           </span>
//         </div>
//       </div>

//       <div className="patient-history-heading">
//         <h4>
//           Treatment History
//         </h4>
//       </div>

//       {treatments.length === 0 ? (
//         <div className="patient-empty-state">
//           <div>🩺</div>

//           <h4>
//             No treatment history
//           </h4>

//           <p>
//             Treatment records added
//             by your therapist will
//             appear here.
//           </p>
//         </div>
//       ) : (
//         <div className="patient-treatment-list">
//           {treatments
//             .slice()
//             .sort(
//               (a, b) =>
//                 getDateValue(
//                   b.date
//                 ) -
//                 getDateValue(
//                   a.date
//                 )
//             )
//             .map(
//               (
//                 treatment,
//                 index
//               ) => (
//                 <div
//                   className="patient-treatment-item"
//                   key={
//                     treatment.id ||
//                     index
//                   }
//                 >
//                   <div className="patient-treatment-dot">
//                     ✓
//                   </div>

//                   <div className="patient-treatment-details">
//                     <div className="patient-treatment-row">
//                       <h4>
//                         {treatment.treatment ||
//                           treatment.treatmentName ||
//                           "Therapy"}
//                       </h4>

//                       <span>
//                         {formatDate(
//                           treatment.date
//                         )}
//                       </span>
//                     </div>

//                     <p>
//                       {treatment.doctor ||
//                         treatment.doctorName ||
//                         doctor}
//                     </p>

//                     {treatment.sessionNumber && (
//                       <small>
//                         Session{" "}
//                         {
//                           treatment.sessionNumber
//                         }
//                       </small>
//                     )}

//                     {treatment.observation && (
//                       <div className="patient-observation">
//                         <strong>
//                           Observation:
//                         </strong>{" "}
//                         {
//                           treatment.observation
//                         }
//                       </div>
//                     )}

//                     {treatment.notes && (
//                       <div className="patient-observation">
//                         <strong>
//                           Notes:
//                         </strong>{" "}
//                         {
//                           treatment.notes
//                         }
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )
//             )}
//         </div>
//       )}
//     </div>
//   );

//   /*
//   ========================================================
//   BILLS
//   ========================================================
//   */

//   const renderBills = () => (
//     <div className="patient-content-card">
//       <div className="patient-content-title">
//         <div>
//           <span>
//             FINANCIAL
//           </span>

//           <h3>
//             Bills & Payments
//           </h3>
//         </div>
//       </div>

//       <div className="patient-stats-grid">
//         <div className="patient-stat-card">
//           <span>🧾</span>

//           <div>
//             <strong>
//               {bills.length}
//             </strong>

//             <p>Total Bills</p>
//           </div>
//         </div>

//         <div className="patient-stat-card">
//           <span>💰</span>

//           <div>
//             <strong>
//               {formatCurrency(
//                 totalBillAmount
//               )}
//             </strong>

//             <p>Total Amount</p>
//           </div>
//         </div>

//         <div className="patient-stat-card">
//           <span>✓</span>

//           <div>
//             <strong>
//               {formatCurrency(
//                 paidBillAmount
//               )}
//             </strong>

//             <p>Paid Amount</p>
//           </div>
//         </div>

//         <div className="patient-stat-card">
//           <span>⏳</span>

//           <div>
//             <strong>
//               {formatCurrency(
//                 pendingBillAmount
//               )}
//             </strong>

//             <p>Pending Amount</p>
//           </div>
//         </div>
//       </div>

//       {bills.length === 0 ? (
//         <div className="patient-empty-state">
//           <div>💳</div>

//           <h4>
//             No bills found
//           </h4>

//           <p>
//             No billing records were
//             found for Patient ID{" "}
//             <strong>
//               {patientId}
//             </strong>
//             .
//           </p>

//           <small>
//             Billing collection:
//             {" "}
//             {BILLING_COLLECTION}
//           </small>
//         </div>
//       ) : (
//         <div className="patient-table-wrap">
//           <table className="patient-table">
//             <thead>
//               <tr>
//                 <th>
//                   Bill / Invoice
//                 </th>

//                 <th>Date</th>

//                 <th>
//                   Description
//                 </th>

//                 <th>
//                   Amount
//                 </th>

//                 <th>
//                   Status
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {bills
//                 .slice()
//                 .sort(
//                   (a, b) =>
//                     getDateValue(
//                       getBillDate(b)
//                     ) -
//                     getDateValue(
//                       getBillDate(a)
//                     )
//                 )
//                 .map(
//                   (
//                     bill,
//                     index
//                   ) => {
//                     const status =
//                       getBillStatus(
//                         bill
//                       );

//                     const normalizedStatus =
//                       String(
//                         status
//                       ).toLowerCase();

//                     const isPaid =
//                       normalizedStatus ===
//                         "paid" ||
//                       normalizedStatus ===
//                         "completed" ||
//                       normalizedStatus ===
//                         "success";

//                     return (
//                       <tr
//                         key={
//                           bill.id ||
//                           index
//                         }
//                       >
//                         <td>
//                           <strong>
//                             {getBillNumber(
//                               bill
//                             )}
//                           </strong>
//                         </td>

//                         <td>
//                           {formatDate(
//                             getBillDate(
//                               bill
//                             )
//                           )}
//                         </td>

//                         <td>
//                           {getBillDescription(
//                             bill
//                           )}
//                         </td>

//                         <td>
//                           <strong>
//                             {formatCurrency(
//                               getBillAmount(
//                                 bill
//                               )
//                             )}
//                           </strong>
//                         </td>

//                         <td>
//                           <span
//                             className={`patient-status ${
//                               isPaid
//                                 ? "confirmed"
//                                 : ""
//                             }`}
//                           >
//                             {status}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   }
//                 )}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   /*
//   ========================================================
//   REPORTS
//   ========================================================
//   */

//   const renderReports = () => (
//     <div className="patient-content-card">
//       <div className="patient-content-title">
//         <div>
//           <span>
//             DOCUMENTS
//           </span>

//           <h3>
//             Reports & Prescriptions
//           </h3>
//         </div>
//       </div>

//       <div className="patient-empty-state">
//         <div>📄</div>

//         <h4>
//           No documents available
//         </h4>

//         <p>
//           Prescriptions, medical
//           reports and treatment
//           documents uploaded by the
//           clinic will appear here.
//         </p>
//       </div>
//     </div>
//   );

//   /*
//   ========================================================
//   PROFILE
//   ========================================================
//   */

//   const renderProfile = () => (
//     <div className="patient-content-card">
//       <div className="patient-content-title">
//         <div>
//           <span>
//             MY INFORMATION
//           </span>

//           <h3>
//             Patient Profile
//           </h3>
//         </div>
//       </div>

//       <div className="patient-profile-grid">
//         <div>
//           <label>
//             Patient ID
//           </label>

//           <strong>
//             {patientId}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Patient Name
//           </label>

//           <strong>
//             {patientName}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Mobile Number
//           </label>

//           <strong>
//             {patient?.mobile ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Email
//           </label>

//           <strong>
//             {patient?.email ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Age
//           </label>

//           <strong>
//             {patient?.age ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Gender
//           </label>

//           <strong>
//             {patient?.gender ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Blood Group
//           </label>

//           <strong>
//             {patient?.bloodGroup ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Registration Date
//           </label>

//           <strong>
//             {formatDate(
//               patient?.registrationDate ||
//                 patient?.createdAt
//             )}
//           </strong>
//         </div>

//         <div className="patient-profile-full">
//           <label>
//             Address
//           </label>

//           <strong>
//             {patient?.address ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Emergency Contact
//           </label>

//           <strong>
//             {patient?.emergencyContact ||
//               patient?.emergencyMobile ||
//               "—"}
//           </strong>
//         </div>

//         <div>
//           <label>
//             Emergency Person
//           </label>

//           <strong>
//             {patient?.emergencyName ||
//               "—"}
//           </strong>
//         </div>
//       </div>

//       <div className="patient-medical-box">
//         <span>
//           MEDICAL INFORMATION
//         </span>

//         <div className="patient-medical-grid">
//           <div>
//             <label>
//               Medical History
//             </label>

//             <p>
//               {patient?.medicalHistory ||
//                 "No information"}
//             </p>
//           </div>

//           <div>
//             <label>
//               Allergies
//             </label>

//             <p>
//               {patient?.allergies ||
//                 "No known allergies"}
//             </p>
//           </div>

//           <div>
//             <label>
//               Current Medication
//             </label>

//             <p>
//               {patient?.medications ||
//                 patient?.currentMedication ||
//                 "No information"}
//             </p>
//           </div>

//           <div>
//             <label>
//               Previous Treatment
//             </label>

//             <p>
//               {patient?.previousTreatment ||
//                 "No information"}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   /*
//   ========================================================
//   LOADING
//   ========================================================
//   */

//   if (loading) {
//     return (
//       <div className="patient-dashboard-loading">
//         <div className="patient-loader"></div>

//         <p>
//           Loading your patient portal...
//         </p>
//       </div>
//     );
//   }

//   /*
//   ========================================================
//   NO PATIENT
//   ========================================================
//   */

//   if (!patient) {
//     return (
//       <div className="patient-dashboard-loading">
//         <p>
//           Patient session not found.
//         </p>
//       </div>
//     );
//   }

//   /*
//   ========================================================
//   MAIN UI
//   ========================================================
//   */

//   return (
//     <div className="patient-dashboard">
//       <header className="patient-dashboard-header">
//         <div className="patient-dashboard-brand">
//           <div className="patient-dashboard-logo">
//             P
//           </div>

//           <div>
//             <strong>
//               PUNAR AXIS
//             </strong>

//             <span>
//               THERAPY • PATIENT PORTAL
//             </span>
//           </div>
//         </div>

//         <div className="patient-header-actions">
//           <div className="patient-header-id">
//             <span>
//               Patient ID
//             </span>

//             <strong>
//               {patientId}
//             </strong>
//           </div>

//           <button
//             className="patient-logout-btn"
//             onClick={logout}
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="patient-dashboard-main">
//         <section className="patient-welcome">
//           <div>
//             <span className="patient-welcome-label">
//               PATIENT DASHBOARD
//             </span>

//             <h1>
//               Welcome back,{" "}
//               <strong>
//                 {patientName}
//               </strong>{" "}
//               👋
//             </h1>

//             <p>
//               Everything about your therapy
//               journey, appointments and
//               treatment plan is here.
//             </p>
//           </div>

//           <div className="patient-welcome-id">
//             <span>
//               YOUR PATIENT ID
//             </span>

//             <strong>
//               {patientId}
//             </strong>
//           </div>
//         </section>

//         <nav className="patient-tabs">
//           <button
//             className={
//               activeTab === "overview"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "overview"
//               )
//             }
//           >
//             Overview
//           </button>

//           <button
//             className={
//               activeTab === "appointments"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "appointments"
//               )
//             }
//           >
//             Appointments
//           </button>

//           <button
//             className={
//               activeTab === "treatments"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "treatments"
//               )
//             }
//           >
//             Treatments
//           </button>

//           <button
//             className={
//               activeTab === "bills"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab("bills")
//             }
//           >
//             Bills
//           </button>

//           <button
//             className={
//               activeTab === "reports"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "reports"
//               )
//             }
//           >
//             Reports
//           </button>

//           <button
//             className={
//               activeTab === "profile"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "profile"
//               )
//             }
//           >
//             My Profile
//           </button>
//         </nav>

//         <section className="patient-dashboard-content">
//           {activeTab === "overview" &&
//             renderOverview()}

//           {activeTab === "appointments" &&
//             renderAppointments()}

//           {activeTab === "treatments" &&
//             renderTreatments()}

//           {activeTab === "bills" &&
//             renderBills()}

//           {activeTab === "reports" &&
//             renderReports()}

//           {activeTab === "profile" &&
//             renderProfile()}
//         </section>
//       </main>

//       <footer className="patient-dashboard-footer">
//         <div>
//           <strong>
//             PUNAR AXIS THERAPY
//           </strong>

//           <span>
//             Patient Portal • Your care,
//             your journey
//           </span>
//         </div>

//         <p>
//           For assistance, please contact
//           the clinic.
//         </p>
//       </footer>
//     </div>
//   );
// }

// export default PatientDashboard;


import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

import { db } from "../firebase";

import {
  getPatientSession,
  logoutPatient,
} from "../auth";

import "./PatientDashboard.css";

/*
=========================================================
FIRESTORE COLLECTIONS
=========================================================
*/

const PATIENTS_COLLECTION = "patients";
const APPOINTMENTS_COLLECTION = "appointments";
const TREATMENTS_COLLECTION = "patientTreatments";

/*
 IMPORTANT:
 Agar aapki billing collection ka actual naam
 "billing" hai to neeche "bills" ko "billing" kar dein.
*/
const BILLING_COLLECTION = "bills";


function PatientDashboard() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);

  const [appointments, setAppointments] = useState([]);

  const [treatments, setTreatments] = useState([]);

  const [bills, setBills] = useState([]);

  const [activeTab, setActiveTab] =
    useState("overview");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /*
  =======================================================
  LOAD PATIENT DATA
  =======================================================
  */

  const loadPatientData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const session =
          getPatientSession();

        if (
          !session?.loggedIn ||
          !session?.patient?.patientId
        ) {
          navigate(
            "/patient-login",
            { replace: true }
          );

          return;
        }

        const patientId =
          String(
            session.patient.patientId
          )
            .trim()
            .toUpperCase();


        /*
        ---------------------------------------------------
        PATIENT PROFILE
        ---------------------------------------------------
        */

        const patientRef = doc(
          db,
          PATIENTS_COLLECTION,
          patientId
        );

        const patientSnapshot =
          await getDoc(patientRef);


        let currentPatient = null;


        if (patientSnapshot.exists()) {
          currentPatient = {
            id: patientSnapshot.id,
            ...patientSnapshot.data(),
            patientId,
          };
        } else {
          /*
          Fallback:
          Session ke andar saved patient data use karein.
          */

          currentPatient = {
            ...session.patient,
            patientId,
          };
        }


        if (!currentPatient) {
          throw new Error(
            "Patient profile could not be loaded."
          );
        }


        /*
        ---------------------------------------------------
        APPOINTMENTS
        ---------------------------------------------------
        Existing appointments collection only.
        No new appointment system.
        ---------------------------------------------------
        */

        let appointmentData = [];

        try {
          const appointmentQuery =
            query(
              collection(
                db,
                APPOINTMENTS_COLLECTION
              ),
              where(
                "patientId",
                "==",
                patientId
              )
            );

          const appointmentSnapshot =
            await getDocs(
              appointmentQuery
            );

          appointmentData =
            appointmentSnapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );
        } catch (appointmentError) {
          console.warn(
            "Patient appointments could not be loaded:",
            appointmentError
          );

          /*
          Fallback to login session
          */

          appointmentData =
            Array.isArray(
              session.appointmentHistory
            )
              ? session.appointmentHistory
              : [];
        }


        /*
        ---------------------------------------------------
        TREATMENT HISTORY
        ---------------------------------------------------
        */

        let treatmentData = [];

        try {
          const treatmentQuery =
            query(
              collection(
                db,
                TREATMENTS_COLLECTION
              ),
              where(
                "patientId",
                "==",
                patientId
              )
            );

          const treatmentSnapshot =
            await getDocs(
              treatmentQuery
            );

          treatmentData =
            treatmentSnapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );
        } catch (treatmentError) {
          console.warn(
            "Patient treatments could not be loaded:",
            treatmentError
          );

          treatmentData =
            Array.isArray(
              session.treatmentHistory
            )
              ? session.treatmentHistory
              : [];
        }


        /*
        ---------------------------------------------------
        BILLING
        ---------------------------------------------------
        */

        let billingData = [];

        try {
          const billQuery =
            query(
              collection(
                db,
                BILLING_COLLECTION
              ),
              where(
                "patientId",
                "==",
                patientId
              )
            );

          const billSnapshot =
            await getDocs(
              billQuery
            );

          billingData =
            billSnapshot.docs.map(
              (item) => ({
                id: item.id,
                ...item.data(),
              })
            );
        } catch (billError) {
          console.warn(
            "Billing records could not be loaded:",
            billError
          );

          billingData = [];
        }


        /*
        ---------------------------------------------------
        SET DATA
        ---------------------------------------------------
        */

        setPatient(
          currentPatient
        );

        setAppointments(
          appointmentData
        );

        setTreatments(
          treatmentData
        );

        setBills(
          billingData
        );

      } catch (loadError) {
        console.error(
          "Patient dashboard error:",
          loadError
        );

        setError(
          loadError?.message ||
            "Unable to load patient dashboard."
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );


  /*
  =======================================================
  INITIAL LOAD
  =======================================================
  */

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);


  /*
  =======================================================
  LOGOUT
  =======================================================
  */

  const logout = async () => {
    try {
      await logoutPatient();
    } catch (error) {
      console.error(
        "Patient logout error:",
        error
      );
    }

    navigate(
      "/patient-login",
      { replace: true }
    );
  };


  /*
  =======================================================
  DATE HELPERS
  =======================================================
  */

  const getDateValue = (value) => {
    if (!value) {
      return null;
    }

    if (
      typeof value === "object" &&
      typeof value.toDate === "function"
    ) {
      const converted =
        value.toDate();

      return Number.isNaN(
        converted.getTime()
      )
        ? null
        : converted;
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date;
  };


  const normalizeDate = (value) => {
    const date =
      getDateValue(value);

    if (!date) {
      return "";
    }

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };


  const formatDate = (value) => {
    const date =
      getDateValue(value);

    if (!date) {
      return "—";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  const formatTime = (value) => {
    if (!value) {
      return "—";
    }

    return String(value);
  };


  /*
  =======================================================
  TODAY
  =======================================================
  */

  const today = useMemo(() => {
    const date =
      new Date();

    date.setHours(
      0,
      0,
      0,
      0
    );

    return date;
  }, []);


  /*
  =======================================================
  UPCOMING APPOINTMENTS
  =======================================================
  */

  const upcomingAppointments =
    useMemo(() => {
      return appointments
        .filter((appointment) => {
          const date =
            getDateValue(
              appointment.date
            );

          if (!date) {
            return false;
          }

          date.setHours(
            0,
            0,
            0,
            0
          );

          const status =
            String(
              appointment.status ||
                ""
            ).toLowerCase();

          if (
            status === "cancelled" ||
            status === "canceled"
          ) {
            return false;
          }

          return date >= today;
        })
        .sort((a, b) => {
          const dateA =
            getDateValue(a.date);

          const dateB =
            getDateValue(b.date);

          return (
            dateA - dateB
          );
        });
    }, [
      appointments,
      today,
    ]);


  /*
  =======================================================
  NEXT APPOINTMENT
  =======================================================
  */

  const nextAppointment =
    upcomingAppointments[0] ||
    null;


  /*
  =======================================================
  NEXT FOLLOW-UP
  =======================================================
  PatientManagement stores this as:
  patient.nextFollowUpDate
  =======================================================
  */

  const nextFollowUpDate =
    patient?.nextFollowUpDate ||
    "";


  /*
  =======================================================
  COMPLETED APPOINTMENTS
  =======================================================
  */

  const completedAppointments =
    useMemo(() => {
      return appointments.filter(
        (appointment) => {
          const status =
            String(
              appointment.status ||
                ""
            ).toLowerCase();

          return (
            status === "completed" ||
            status === "complete"
          );
        }
      );
    }, [appointments]);


  /*
  =======================================================
  TREATMENT DATA
  =======================================================
  */

  const currentTreatment =
    patient?.currentTreatment ||
    patient?.treatment ||
    patient?.currentTreatmentName ||
    "No active treatment";


  const doctor =
    patient?.assignedDoctor ||
    patient?.doctor ||
    patient?.doctorName ||
    patient?.therapist ||
    nextAppointment?.doctorName ||
    "—";


  const totalSessions =
    Number(
      patient?.totalSessions ||
        patient?.plannedSessions ||
        patient?.sessionsPlanned ||
        0
    );


  const completedSessions =
    Number(
      patient?.completedSessions ||
        patient?.sessionsCompleted ||
        0
    );


  const calculatedProgress =
    totalSessions > 0
      ? Math.min(
          100,
          Math.round(
            (completedSessions /
              totalSessions) *
              100
          )
        )
      : 0;


  const progress =
    Number(
      patient?.treatmentProgress
    ) ||
    calculatedProgress;


  /*
  =======================================================
  PATIENT BASIC DATA
  =======================================================
  */

  const patientName =
    patient?.name ||
    patient?.patientName ||
    "Patient";


  const patientId =
    patient?.patientId ||
    patient?.id ||
    "—";


  /*
  =======================================================
  BILL CALCULATIONS
  =======================================================
  */

  const billSummary =
    useMemo(() => {
      let total = 0;
      let paid = 0;

      bills.forEach((bill) => {
        const billTotal =
          Number(
            bill.total ||
              bill.amount ||
              bill.grandTotal ||
              bill.totalAmount ||
              0
          );

        const billPaid =
          Number(
            bill.paid ||
              bill.paidAmount ||
              bill.amountPaid ||
              0
          );

        total += billTotal;
        paid += billPaid;
      });

      return {
        total,
        paid,
        pending:
          Math.max(
            0,
            total - paid
          ),
      };
    }, [bills]);


  /*
  =======================================================
  OVERVIEW
  =======================================================
  */

  const renderOverview = () => (
    <>
      <div className="patient-section-grid">

        {/* NEXT APPOINTMENT */}

        <div className="patient-info-card appointment-card">

          <div className="patient-card-top">

            <div>

              <span className="patient-card-label">
                NEXT APPOINTMENT
              </span>

              <h3>
                {nextAppointment
                  ? formatDate(
                      nextAppointment.date
                    )
                  : "No appointment"}
              </h3>

            </div>

            <div className="patient-card-icon">
              📅
            </div>

          </div>


          {nextAppointment ? (
            <>
              <p className="patient-card-main">
                {formatTime(
                  nextAppointment.slot ||
                    nextAppointment.time
                )}
              </p>

              <p className="patient-card-sub">
                {nextAppointment.treatment ||
                  nextAppointment.treatmentName ||
                  "Therapy Session"}
              </p>

              <p className="patient-card-sub">
                Doctor:{" "}
                {nextAppointment.doctorName ||
                  doctor}
              </p>

              <span className="patient-status confirmed">
                {nextAppointment.status ||
                  "Confirmed"}
              </span>
            </>
          ) : (
            <p className="patient-empty-small">
              No upcoming appointment found.
            </p>
          )}

        </div>


        {/* NEXT FOLLOW-UP */}

        <div className="patient-info-card treatment-card">

          <div className="patient-card-top">

            <div>

              <span className="patient-card-label">
                NEXT FOLLOW-UP
              </span>

              <h3>
                {nextFollowUpDate
                  ? formatDate(
                      nextFollowUpDate
                    )
                  : "Not scheduled"}
              </h3>

            </div>

            <div className="patient-card-icon">
              🔄
            </div>

          </div>


          {nextFollowUpDate ? (
            <>
              <p className="patient-card-main">
                Follow-up Visit
              </p>

              <p className="patient-card-sub">
                Your clinic has scheduled a
                follow-up for this date.
              </p>

              <span className="patient-status">
                Scheduled
              </span>
            </>
          ) : (
            <p className="patient-empty-small">
              No follow-up date has been added yet.
            </p>
          )}

        </div>

      </div>


      {/* CURRENT TREATMENT */}

      <div className="patient-content-card">

        <div className="patient-content-title">

          <div>

            <span>
              CURRENT CARE
            </span>

            <h3>
              Current Treatment
            </h3>

          </div>

        </div>


        <div className="patient-current-treatment">

          <div className="patient-treatment-icon">
            🩺
          </div>

          <div>

            <span>
              ACTIVE TREATMENT
            </span>

            <h3>
              {currentTreatment}
            </h3>

            <p>
              Therapist / Doctor:{" "}
              {doctor}
            </p>

          </div>


          {totalSessions > 0 && (
            <div className="patient-treatment-progress">

              <strong>
                {progress}%
              </strong>

              <span>
                Progress
              </span>

            </div>
          )}

        </div>

      </div>


      {/* STATS */}

      <div className="patient-stats-grid">

        <div className="patient-stat-card">

          <span>🗓️</span>

          <div>

            <strong>
              {appointments.length}
            </strong>

            <p>
              Total Appointments
            </p>

          </div>

        </div>


        <div className="patient-stat-card">

          <span>✓</span>

          <div>

            <strong>
              {completedAppointments.length}
            </strong>

            <p>
              Completed Visits
            </p>

          </div>

        </div>


        <div className="patient-stat-card">

          <span>🩺</span>

          <div>

            <strong>
              {treatments.length}
            </strong>

            <p>
              Treatment Records
            </p>

          </div>

        </div>


        <div className="patient-stat-card">

          <span>💳</span>

          <div>

            <strong>
              ₹
              {billSummary.pending.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Pending Bills
            </p>

          </div>

        </div>

      </div>


      {/* RECENT APPOINTMENTS */}

      <div className="patient-content-card">

        <div className="patient-content-title">

          <div>

            <span>
              APPOINTMENTS
            </span>

            <h3>
              Your Recent Appointments
            </h3>

          </div>

          <button
            onClick={() =>
              setActiveTab(
                "appointments"
              )
            }
          >
            View All →
          </button>

        </div>


        {appointments.length === 0 ? (
          <div className="patient-empty-state">

            <div>
              📅
            </div>

            <h4>
              No appointment history
            </h4>

            <p>
              Your appointments will appear
              here once they are added by
              the clinic.
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
                      getDateValue(
                        b.date
                      ) -
                      getDateValue(
                        a.date
                      )
                  )
                  .slice(0, 5)
                  .map(
                    (
                      appointment,
                      index
                    ) => (
                      <tr
                        key={
                          appointment.id ||
                          index
                        }
                      >

                        <td>
                          {formatDate(
                            appointment.date
                          )}
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
                    )
                  )}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </>
  );


  /*
  =======================================================
  APPOINTMENTS
  =======================================================
  */

  const renderAppointments = () => {

    /*
    Follow-up ko appointment-style item ke roop mein
    dikhaya ja raha hai, lekin Firestore mein
    koi fake appointment create nahi hota.
    */

    const hasFollowUp =
      Boolean(
        nextFollowUpDate
      );


    return (
      <div className="patient-content-card">

        <div className="patient-content-title">

          <div>

            <span>
              MY APPOINTMENTS
            </span>

            <h3>
              Appointments & Schedule
            </h3>

          </div>

        </div>


        {/* NEXT APPOINTMENT HIGHLIGHT */}

        <div
          style={{
            marginBottom: "24px",
            padding: "20px",
            borderRadius: "16px",
            background:
              "rgba(37, 99, 235, 0.06)",
            border:
              "1px solid rgba(37, 99, 235, 0.12)",
          }}
        >

          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing:
                "0.08em",
            }}
          >
            NEXT APPOINTMENT
          </span>


          {nextAppointment ? (
            <div
              style={{
                marginTop: "10px",
              }}
            >

              <h3>
                {formatDate(
                  nextAppointment.date
                )}
              </h3>

              <p>
                {formatTime(
                  nextAppointment.slot ||
                    nextAppointment.time
                )}
                {" • "}
                {nextAppointment.treatment ||
                  nextAppointment.treatmentName ||
                  "Therapy Session"}
              </p>

              <p>
                Doctor:{" "}
                {nextAppointment.doctorName ||
                  doctor}
              </p>

            </div>
          ) : (
            <p>
              No upcoming appointment found.
            </p>
          )}

        </div>


        {/* NEXT FOLLOW-UP */}

        {hasFollowUp && (
          <div
            style={{
              marginBottom: "24px",
              padding: "20px",
              borderRadius: "16px",
              background:
                "rgba(16, 185, 129, 0.06)",
              border:
                "1px solid rgba(16, 185, 129, 0.12)",
            }}
          >

            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing:
                  "0.08em",
              }}
            >
              NEXT FOLLOW-UP
            </span>

            <h3>
              {formatDate(
                nextFollowUpDate
              )}
            </h3>

            <p>
              Follow-up visit scheduled by
              the clinic.
            </p>

          </div>
        )}


        {appointments.length === 0 &&
        !hasFollowUp ? (
          <div className="patient-empty-state">

            <div>
              📅
            </div>

            <h4>
              No appointments found
            </h4>

            <p>
              Your appointments will appear
              here once they are added by
              the clinic.
            </p>

          </div>
        ) : (
          <div className="patient-appointment-list">

            {hasFollowUp && (
              <div
                className="patient-appointment-item"
              >

                <div className="patient-appointment-date">

                  <strong>
                    {getDateValue(
                      nextFollowUpDate
                    )?.getDate() || "—"}
                  </strong>

                  <span>
                    {getDateValue(
                      nextFollowUpDate
                    )?.toLocaleDateString(
                      "en-IN",
                      {
                        month: "short",
                      }
                    ) || ""}
                  </span>

                </div>


                <div className="patient-appointment-info">

                  <h4>
                    Follow-up Visit
                  </h4>

                  <p>
                    {doctor}
                  </p>

                  <small>
                    {formatDate(
                      nextFollowUpDate
                    )}
                  </small>

                </div>


                <span className="patient-status">
                  Follow-up
                </span>

              </div>
            )}


            {appointments
              .slice()
              .sort(
                (a, b) =>
                  getDateValue(
                    b.date
                  ) -
                  getDateValue(
                    a.date
                  )
              )
              .map(
                (
                  appointment,
                  index
                ) => (

                  <div
                    className="patient-appointment-item"
                    key={
                      appointment.id ||
                      index
                    }
                  >

                    <div className="patient-appointment-date">

                      <strong>
                        {getDateValue(
                          appointment.date
                        )?.getDate() ||
                          "—"}
                      </strong>

                      <span>
                        {getDateValue(
                          appointment.date
                        )?.toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                          }
                        ) || ""}
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
                          "Therapist"}
                        {" • "}
                        {formatTime(
                          appointment.slot ||
                            appointment.time
                        )}
                      </p>

                      <small>
                        {formatDate(
                          appointment.date
                        )}
                      </small>

                    </div>


                    <span className="patient-status">

                      {appointment.status ||
                        "Confirmed"}

                    </span>

                  </div>
                )
              )}

          </div>
        )}

      </div>
    );
  };


  /*
  =======================================================
  TREATMENTS
  =======================================================
  */

  const renderTreatments = () => (
    <div className="patient-content-card">

      <div className="patient-content-title">

        <div>

          <span>
            TREATMENT JOURNEY
          </span>

          <h3>
            Current & Past Treatments
          </h3>

        </div>

      </div>


      <div className="patient-current-treatment">

        <div className="patient-treatment-icon">
          🩺
        </div>

        <div>

          <span>
            ACTIVE TREATMENT
          </span>

          <h3>
            {currentTreatment}
          </h3>

          <p>
            Therapist: {doctor}
          </p>

        </div>


        <div className="patient-treatment-progress">

          <strong>
            {progress}%
          </strong>

          <span>
            Progress
          </span>

        </div>

      </div>


      <div className="patient-history-heading">

        <h4>
          Treatment History
        </h4>

      </div>


      {treatments.length === 0 ? (
        <div className="patient-empty-state">

          <div>
            🩺
          </div>

          <h4>
            No treatment history
          </h4>

          <p>
            Treatment records added by your
            therapist will appear here.
          </p>

        </div>
      ) : (
        <div className="patient-treatment-list">

          {treatments
            .slice()
            .sort(
              (a, b) =>
                getDateValue(
                  b.date
                ) -
                getDateValue(
                  a.date
                )
            )
            .map(
              (
                treatment,
                index
              ) => (

                <div
                  className="patient-treatment-item"
                  key={
                    treatment.id ||
                    index
                  }
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
                        {formatDate(
                          treatment.date
                        )}
                      </span>

                    </div>


                    <p>
                      {treatment.doctor ||
                        treatment.doctorName ||
                        doctor}
                    </p>


                    {treatment.sessionNumber && (
                      <small>
                        Session{" "}
                        {treatment.sessionNumber}
                      </small>
                    )}


                    {treatment.observation && (
                      <div className="patient-observation">

                        <strong>
                          Observation:
                        </strong>{" "}

                        {treatment.observation}

                      </div>
                    )}


                    {treatment.notes && (
                      <div className="patient-observation">

                        <strong>
                          Notes:
                        </strong>{" "}

                        {treatment.notes}

                      </div>
                    )}

                  </div>

                </div>
              )
            )}

        </div>
      )}

    </div>
  );


  /*
  =======================================================
  BILLS
  =======================================================
  */

  const renderBills = () => (
    <div className="patient-content-card">

      <div className="patient-content-title">

        <div>

          <span>
            FINANCIAL
          </span>

          <h3>
            Bills & Payments
          </h3>

        </div>

      </div>


      <div className="patient-stats-grid">

        <div className="patient-stat-card">

          <span>
            💰
          </span>

          <div>

            <strong>
              ₹
              {billSummary.total.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Total Bills
            </p>

          </div>

        </div>


        <div className="patient-stat-card">

          <span>
            ✓
          </span>

          <div>

            <strong>
              ₹
              {billSummary.paid.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Paid
            </p>

          </div>

        </div>


        <div className="patient-stat-card">

          <span>
            ⏳
          </span>

          <div>

            <strong>
              ₹
              {billSummary.pending.toLocaleString(
                "en-IN"
              )}
            </strong>

            <p>
              Pending
            </p>

          </div>

        </div>

      </div>


      {bills.length === 0 ? (
        <div className="patient-empty-state">

          <div>
            💳
          </div>

          <h4>
            No billing records found
          </h4>

          <p>
            Your bills and payment records
            will appear here when they are
            added by the clinic.
          </p>

        </div>
      ) : (
        <div className="patient-table-wrap">

          <table className="patient-table">

            <thead>

              <tr>
                <th>Date</th>
                <th>Invoice</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>

            </thead>


            <tbody>

              {bills.map(
                (
                  bill,
                  index
                ) => {

                  const amount =
                    Number(
                      bill.total ||
                        bill.amount ||
                        bill.grandTotal ||
                        bill.totalAmount ||
                        0
                    );

                  const paid =
                    Number(
                      bill.paid ||
                        bill.paidAmount ||
                        bill.amountPaid ||
                        0
                    );

                  const status =
                    bill.status ||
                    (
                      paid >= amount
                        ? "Paid"
                        : "Pending"
                    );

                  return (
                    <tr
                      key={
                        bill.id ||
                        index
                      }
                    >

                      <td>
                        {formatDate(
                          bill.date ||
                            bill.createdAt
                        )}
                      </td>

                      <td>
                        {bill.invoiceNumber ||
                          bill.invoiceNo ||
                          bill.billNumber ||
                          bill.id ||
                          "—"}
                      </td>

                      <td>
                        ₹
                        {amount.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>

                        <span className="patient-status">
                          {status}
                        </span>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );


  /*
  =======================================================
  REPORTS
  =======================================================
  */

  const renderReports = () => (
    <div className="patient-content-card">

      <div className="patient-content-title">

        <div>

          <span>
            DOCUMENTS
          </span>

          <h3>
            Reports & Prescriptions
          </h3>

        </div>

      </div>


      <div className="patient-empty-state">

        <div>
          📄
        </div>

        <h4>
          No documents available
        </h4>

        <p>
          Prescriptions, medical reports and
          treatment documents uploaded by the
          clinic will appear here.
        </p>

      </div>

    </div>
  );


  /*
  =======================================================
  PROFILE
  =======================================================
  */

  const renderProfile = () => (
    <div className="patient-content-card">

      <div className="patient-content-title">

        <div>

          <span>
            MY INFORMATION
          </span>

          <h3>
            Patient Profile
          </h3>

        </div>

      </div>


      <div className="patient-profile-grid">

        <div>
          <label>
            Patient ID
          </label>

          <strong>
            {patientId}
          </strong>
        </div>


        <div>
          <label>
            Patient Name
          </label>

          <strong>
            {patientName}
          </strong>
        </div>


        <div>
          <label>
            Mobile Number
          </label>

          <strong>
            {patient?.mobile ||
              "—"}
          </strong>
        </div>


        <div>
          <label>
            Email
          </label>

          <strong>
            {patient?.email ||
              "—"}
          </strong>
        </div>


        <div>
          <label>
            Age
          </label>

          <strong>
            {patient?.age ||
              "—"}
          </strong>
        </div>


        <div>
          <label>
            Gender
          </label>

          <strong>
            {patient?.gender ||
              "—"}
          </strong>
        </div>


        <div>
          <label>
            Blood Group
          </label>

          <strong>
            {patient?.bloodGroup ||
              "—"}
          </strong>
        </div>


        <div>
          <label>
            Registration Date
          </label>

          <strong>
            {formatDate(
              patient?.registrationDate ||
                patient?.createdAt
            )}
          </strong>
        </div>


        <div className="patient-profile-full">

          <label>
            Address
          </label>

          <strong>
            {patient?.address ||
              "—"}
          </strong>

        </div>


        <div>
          <label>
            Emergency Contact
          </label>

          <strong>
            {patient?.emergencyContact ||
              "—"}
          </strong>
        </div>


        <div>
          <label>
            Emergency Person
          </label>

          <strong>
            {patient?.emergencyName ||
              "—"}
          </strong>
        </div>

      </div>


      <div className="patient-medical-box">

        <span>
          MEDICAL INFORMATION
        </span>


        <div className="patient-medical-grid">

          <div>

            <label>
              Medical History
            </label>

            <p>
              {patient?.medicalHistory ||
                "No information"}
            </p>

          </div>


          <div>

            <label>
              Allergies
            </label>

            <p>
              {patient?.allergies ||
                "No known allergies"}
            </p>

          </div>


          <div>

            <label>
              Current Medication
            </label>

            <p>
              {patient?.medications ||
                patient?.currentMedication ||
                "No information"}
            </p>

          </div>


          <div>

            <label>
              Previous Treatment
            </label>

            <p>
              {patient?.previousTreatment ||
                "No information"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );


  /*
  =======================================================
  LOADING
  =======================================================
  */

  if (loading) {
    return (
      <div className="patient-dashboard-loading">

        <div className="patient-loader"></div>

        <p>
          Loading your patient portal...
        </p>

      </div>
    );
  }


  /*
  =======================================================
  ERROR
  =======================================================
  */

  if (
    error &&
    !patient
  ) {
    return (
      <div className="patient-dashboard-loading">

        <h3>
          Unable to load patient portal
        </h3>

        <p>
          {error}
        </p>

        <button
          onClick={() =>
            navigate(
              "/patient-login",
              { replace: true }
            )
          }
        >
          Back to Login
        </button>

      </div>
    );
  }


  /*
  =======================================================
  MAIN UI
  =======================================================
  */

  return (
    <div className="patient-dashboard">

      {/* HEADER */}

      <header className="patient-dashboard-header">

        <div className="patient-dashboard-brand">

          <div className="patient-dashboard-logo">
            P
          </div>

          <div>

            <strong>
              PUNAR AXIS
            </strong>

            <span>
              THERAPY • PATIENT PORTAL
            </span>

          </div>

        </div>


        <div className="patient-header-actions">

          <div className="patient-header-id">

            <span>
              Patient ID
            </span>

            <strong>
              {patientId}
            </strong>

          </div>


          <button
            className="patient-logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="patient-dashboard-main">

        {/* WELCOME */}

        <section className="patient-welcome">

          <div>

            <span className="patient-welcome-label">
              PATIENT DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <strong>
                {patientName}
              </strong>{" "}
              👋
            </h1>

            <p>
              Everything about your therapy
              journey, appointments and
              treatment plan is here.
            </p>

          </div>


          <div className="patient-welcome-id">

            <span>
              YOUR PATIENT ID
            </span>

            <strong>
              {patientId}
            </strong>

          </div>

        </section>


        {/* TABS */}

        <nav className="patient-tabs">

          <button
            className={
              activeTab ===
              "overview"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "overview"
              )
            }
          >
            Overview
          </button>


          <button
            className={
              activeTab ===
              "appointments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "appointments"
              )
            }
          >
            Appointments
          </button>


          <button
            className={
              activeTab ===
              "treatments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "treatments"
              )
            }
          >
            Treatments
          </button>


          <button
            className={
              activeTab ===
              "bills"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "bills"
              )
            }
          >
            Bills
          </button>


          <button
            className={
              activeTab ===
              "reports"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "reports"
              )
            }
          >
            Reports
          </button>


          <button
            className={
              activeTab ===
              "profile"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab(
                "profile"
              )
            }
          >
            My Profile
          </button>

        </nav>


        {/* CONTENT */}

        <section className="patient-dashboard-content">

          {activeTab ===
            "overview" &&
            renderOverview()}


          {activeTab ===
            "appointments" &&
            renderAppointments()}


          {activeTab ===
            "treatments" &&
            renderTreatments()}


          {activeTab ===
            "bills" &&
            renderBills()}


          {activeTab ===
            "reports" &&
            renderReports()}


          {activeTab ===
            "profile" &&
            renderProfile()}

        </section>

      </main>


      {/* FOOTER */}

      <footer className="patient-dashboard-footer">

        <div>

          <strong>
            PUNAR AXIS THERAPY
          </strong>

          <span>
            Patient Portal • Your care,
            your journey
          </span>

        </div>

        <p>
          For assistance, please contact
          the clinic.
        </p>

      </footer>

    </div>
  );
}


export default PatientDashboard;