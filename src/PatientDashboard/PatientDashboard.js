

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";

// import { useNavigate } from "react-router-dom";

// import { db } from "../firebase";

// import {
//   getPatientSession,
//   logoutPatient,
// } from "../auth";

// import "./PatientDashboard.css";

// /*
// =========================================================
// FIRESTORE COLLECTIONS
// =========================================================
// */

// const PATIENTS_COLLECTION = "patients";
// const APPOINTMENTS_COLLECTION = "appointments";
// const TREATMENTS_COLLECTION = "patientTreatments";

// /*
//  IMPORTANT:
//  Agar aapki billing collection ka actual naam
//  "billing" hai to neeche "bills" ko "billing" kar dein.
// */
// const BILLING_COLLECTION = "bills";


// function PatientDashboard() {
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);

//   const [appointments, setAppointments] = useState([]);

//   const [treatments, setTreatments] = useState([]);

//   const [bills, setBills] = useState([]);

//   const [activeTab, setActiveTab] =
//     useState("overview");

//   const [loading, setLoading] =
//     useState(true);

//   const [error, setError] =
//     useState("");


//   /*
//   =======================================================
//   LOAD PATIENT DATA
//   =======================================================
//   */

//   const loadPatientData = useCallback(
//     async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const session =
//           getPatientSession();

//         if (
//           !session?.loggedIn ||
//           !session?.patient?.patientId
//         ) {
//           navigate(
//             "/patient-login",
//             { replace: true }
//           );

//           return;
//         }

//         const patientId =
//           String(
//             session.patient.patientId
//           )
//             .trim()
//             .toUpperCase();


//         /*
//         ---------------------------------------------------
//         PATIENT PROFILE
//         ---------------------------------------------------
//         */

//         const patientRef = doc(
//           db,
//           PATIENTS_COLLECTION,
//           patientId
//         );

//         const patientSnapshot =
//           await getDoc(patientRef);


//         let currentPatient = null;


//         if (patientSnapshot.exists()) {
//           currentPatient = {
//             id: patientSnapshot.id,
//             ...patientSnapshot.data(),
//             patientId,
//           };
//         } else {
//           /*
//           Fallback:
//           Session ke andar saved patient data use karein.
//           */

//           currentPatient = {
//             ...session.patient,
//             patientId,
//           };
//         }


//         if (!currentPatient) {
//           throw new Error(
//             "Patient profile could not be loaded."
//           );
//         }


//         /*
//         ---------------------------------------------------
//         APPOINTMENTS
//         ---------------------------------------------------
//         Existing appointments collection only.
//         No new appointment system.
//         ---------------------------------------------------
//         */

//         let appointmentData = [];

//         try {
//           const appointmentQuery =
//             query(
//               collection(
//                 db,
//                 APPOINTMENTS_COLLECTION
//               ),
//               where(
//                 "patientId",
//                 "==",
//                 patientId
//               )
//             );

//           const appointmentSnapshot =
//             await getDocs(
//               appointmentQuery
//             );

//           appointmentData =
//             appointmentSnapshot.docs.map(
//               (item) => ({
//                 id: item.id,
//                 ...item.data(),
//               })
//             );
//         } catch (appointmentError) {
//           console.warn(
//             "Patient appointments could not be loaded:",
//             appointmentError
//           );

//           /*
//           Fallback to login session
//           */

//           appointmentData =
//             Array.isArray(
//               session.appointmentHistory
//             )
//               ? session.appointmentHistory
//               : [];
//         }


//         /*
//         ---------------------------------------------------
//         TREATMENT HISTORY
//         ---------------------------------------------------
//         */

//         let treatmentData = [];

//         try {
//           const treatmentQuery =
//             query(
//               collection(
//                 db,
//                 TREATMENTS_COLLECTION
//               ),
//               where(
//                 "patientId",
//                 "==",
//                 patientId
//               )
//             );

//           const treatmentSnapshot =
//             await getDocs(
//               treatmentQuery
//             );

//           treatmentData =
//             treatmentSnapshot.docs.map(
//               (item) => ({
//                 id: item.id,
//                 ...item.data(),
//               })
//             );
//         } catch (treatmentError) {
//           console.warn(
//             "Patient treatments could not be loaded:",
//             treatmentError
//           );

//           treatmentData =
//             Array.isArray(
//               session.treatmentHistory
//             )
//               ? session.treatmentHistory
//               : [];
//         }


//         /*
//         ---------------------------------------------------
//         BILLING
//         ---------------------------------------------------
//         */

//         let billingData = [];

//         try {
//           const billQuery =
//             query(
//               collection(
//                 db,
//                 BILLING_COLLECTION
//               ),
//               where(
//                 "patientId",
//                 "==",
//                 patientId
//               )
//             );

//           const billSnapshot =
//             await getDocs(
//               billQuery
//             );

//           billingData =
//             billSnapshot.docs.map(
//               (item) => ({
//                 id: item.id,
//                 ...item.data(),
//               })
//             );
//         } catch (billError) {
//           console.warn(
//             "Billing records could not be loaded:",
//             billError
//           );

//           billingData = [];
//         }


//         /*
//         ---------------------------------------------------
//         SET DATA
//         ---------------------------------------------------
//         */

//         setPatient(
//           currentPatient
//         );

//         setAppointments(
//           appointmentData
//         );

//         setTreatments(
//           treatmentData
//         );

//         setBills(
//           billingData
//         );

//       } catch (loadError) {
//         console.error(
//           "Patient dashboard error:",
//           loadError
//         );

//         setError(
//           loadError?.message ||
//             "Unable to load patient dashboard."
//         );
//       } finally {
//         setLoading(false);
//       }
//     },
//     [navigate]
//   );


//   /*
//   =======================================================
//   INITIAL LOAD
//   =======================================================
//   */

//   useEffect(() => {
//     loadPatientData();
//   }, [loadPatientData]);


//   /*
//   =======================================================
//   LOGOUT
//   =======================================================
//   */

//   const logout = async () => {
//     try {
//       await logoutPatient();
//     } catch (error) {
//       console.error(
//         "Patient logout error:",
//         error
//       );
//     }

//     navigate(
//       "/patient-login",
//       { replace: true }
//     );
//   };


//   /*
//   =======================================================
//   DATE HELPERS
//   =======================================================
//   */

//   const getDateValue = (value) => {
//     if (!value) {
//       return null;
//     }

//     if (
//       typeof value === "object" &&
//       typeof value.toDate === "function"
//     ) {
//       const converted =
//         value.toDate();

//       return Number.isNaN(
//         converted.getTime()
//       )
//         ? null
//         : converted;
//     }

//     const date =
//       new Date(value);

//     if (
//       Number.isNaN(
//         date.getTime()
//       )
//     ) {
//       return null;
//     }

//     return date;
//   };


//   const normalizeDate = (value) => {
//     const date =
//       getDateValue(value);

//     if (!date) {
//       return "";
//     }

//     const year =
//       date.getFullYear();

//     const month = String(
//       date.getMonth() + 1
//     ).padStart(2, "0");

//     const day = String(
//       date.getDate()
//     ).padStart(2, "0");

//     return `${year}-${month}-${day}`;
//   };


//   const formatDate = (value) => {
//     const date =
//       getDateValue(value);

//     if (!date) {
//       return "—";
//     }

//     return date.toLocaleDateString(
//       "en-IN",
//       {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       }
//     );
//   };


//   const formatTime = (value) => {
//     if (!value) {
//       return "—";
//     }

//     return String(value);
//   };


//   /*
//   =======================================================
//   TODAY
//   =======================================================
//   */

//   const today = useMemo(() => {
//     const date =
//       new Date();

//     date.setHours(
//       0,
//       0,
//       0,
//       0
//     );

//     return date;
//   }, []);


//   /*
//   =======================================================
//   UPCOMING APPOINTMENTS
//   =======================================================
//   */

//   const upcomingAppointments =
//     useMemo(() => {
//       return appointments
//         .filter((appointment) => {
//           const date =
//             getDateValue(
//               appointment.date
//             );

//           if (!date) {
//             return false;
//           }

//           date.setHours(
//             0,
//             0,
//             0,
//             0
//           );

//           const status =
//             String(
//               appointment.status ||
//                 ""
//             ).toLowerCase();

//           if (
//             status === "cancelled" ||
//             status === "canceled"
//           ) {
//             return false;
//           }

//           return date >= today;
//         })
//         .sort((a, b) => {
//           const dateA =
//             getDateValue(a.date);

//           const dateB =
//             getDateValue(b.date);

//           return (
//             dateA - dateB
//           );
//         });
//     }, [
//       appointments,
//       today,
//     ]);


//   /*
//   =======================================================
//   NEXT APPOINTMENT
//   =======================================================
//   */

//   const nextAppointment =
//     upcomingAppointments[0] ||
//     null;


//   /*
//   =======================================================
//   NEXT FOLLOW-UP
//   =======================================================
//   PatientManagement stores this as:
//   patient.nextFollowUpDate
//   =======================================================
//   */

//   const nextFollowUpDate =
//     patient?.nextFollowUpDate ||
//     "";


//   /*
//   =======================================================
//   COMPLETED APPOINTMENTS
//   =======================================================
//   */

//   const completedAppointments =
//     useMemo(() => {
//       return appointments.filter(
//         (appointment) => {
//           const status =
//             String(
//               appointment.status ||
//                 ""
//             ).toLowerCase();

//           return (
//             status === "completed" ||
//             status === "complete"
//           );
//         }
//       );
//     }, [appointments]);


//   /*
//   =======================================================
//   TREATMENT DATA
//   =======================================================
//   */

//   const currentTreatment =
//     patient?.currentTreatment ||
//     patient?.treatment ||
//     patient?.currentTreatmentName ||
//     "No active treatment";


//   const doctor =
//     patient?.assignedDoctor ||
//     patient?.doctor ||
//     patient?.doctorName ||
//     patient?.therapist ||
//     nextAppointment?.doctorName ||
//     "—";


//   const totalSessions =
//     Number(
//       patient?.totalSessions ||
//         patient?.plannedSessions ||
//         patient?.sessionsPlanned ||
//         0
//     );


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
//     ) ||
//     calculatedProgress;


//   /*
//   =======================================================
//   PATIENT BASIC DATA
//   =======================================================
//   */

//   const patientName =
//     patient?.name ||
//     patient?.patientName ||
//     "Patient";


//   const patientId =
//     patient?.patientId ||
//     patient?.id ||
//     "—";


//   /*
//   =======================================================
//   BILL CALCULATIONS
//   =======================================================
//   */

//   const billSummary =
//     useMemo(() => {
//       let total = 0;
//       let paid = 0;

//       bills.forEach((bill) => {
//         const billTotal =
//           Number(
//             bill.total ||
//               bill.amount ||
//               bill.grandTotal ||
//               bill.totalAmount ||
//               0
//           );

//         const billPaid =
//           Number(
//             bill.paid ||
//               bill.paidAmount ||
//               bill.amountPaid ||
//               0
//           );

//         total += billTotal;
//         paid += billPaid;
//       });

//       return {
//         total,
//         paid,
//         pending:
//           Math.max(
//             0,
//             total - paid
//           ),
//       };
//     }, [bills]);


//   /*
//   =======================================================
//   OVERVIEW
//   =======================================================
//   */

//   const renderOverview = () => (
//     <>
//       <div className="patient-section-grid">

//         {/* NEXT APPOINTMENT */}

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
//                 {nextAppointment.treatment ||
//                   nextAppointment.treatmentName ||
//                   "Therapy Session"}
//               </p>

//               <p className="patient-card-sub">
//                 Doctor:{" "}
//                 {nextAppointment.doctorName ||
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


//         {/* NEXT FOLLOW-UP */}

//         <div className="patient-info-card treatment-card">

//           <div className="patient-card-top">

//             <div>

//               <span className="patient-card-label">
//                 NEXT FOLLOW-UP
//               </span>

//               <h3>
//                 {nextFollowUpDate
//                   ? formatDate(
//                       nextFollowUpDate
//                     )
//                   : "Not scheduled"}
//               </h3>

//             </div>

//             <div className="patient-card-icon">
//               🔄
//             </div>

//           </div>


//           {nextFollowUpDate ? (
//             <>
//               <p className="patient-card-main">
//                 Follow-up Visit
//               </p>

//               <p className="patient-card-sub">
//                 Your clinic has scheduled a
//                 follow-up for this date.
//               </p>

//               <span className="patient-status">
//                 Scheduled
//               </span>
//             </>
//           ) : (
//             <p className="patient-empty-small">
//               No follow-up date has been added yet.
//             </p>
//           )}

//         </div>

//       </div>


//       {/* CURRENT TREATMENT */}

//       <div className="patient-content-card">

//         <div className="patient-content-title">

//           <div>

//             <span>
//               CURRENT CARE
//             </span>

//             <h3>
//               Current Treatment
//             </h3>

//           </div>

//         </div>


//         <div className="patient-current-treatment">

//           <div className="patient-treatment-icon">
//             🩺
//           </div>

//           <div>

//             <span>
//               ACTIVE TREATMENT
//             </span>

//             <h3>
//               {currentTreatment}
//             </h3>

//             <p>
//               Therapist / Doctor:{" "}
//               {doctor}
//             </p>

//           </div>


//           {totalSessions > 0 && (
//             <div className="patient-treatment-progress">

//               <strong>
//                 {progress}%
//               </strong>

//               <span>
//                 Progress
//               </span>

//             </div>
//           )}

//         </div>

//       </div>


//       {/* STATS */}

//       <div className="patient-stats-grid">

//         <div className="patient-stat-card">

//           <span>🗓️</span>

//           <div>

//             <strong>
//               {appointments.length}
//             </strong>

//             <p>
//               Total Appointments
//             </p>

//           </div>

//         </div>


//         <div className="patient-stat-card">

//           <span>✓</span>

//           <div>

//             <strong>
//               {completedAppointments.length}
//             </strong>

//             <p>
//               Completed Visits
//             </p>

//           </div>

//         </div>


//         <div className="patient-stat-card">

//           <span>🩺</span>

//           <div>

//             <strong>
//               {treatments.length}
//             </strong>

//             <p>
//               Treatment Records
//             </p>

//           </div>

//         </div>


//         <div className="patient-stat-card">

//           <span>💳</span>

//           <div>

//             <strong>
//               ₹
//               {billSummary.pending.toLocaleString(
//                 "en-IN"
//               )}
//             </strong>

//             <p>
//               Pending Bills
//             </p>

//           </div>

//         </div>

//       </div>


//       {/* RECENT APPOINTMENTS */}

//       <div className="patient-content-card">

//         <div className="patient-content-title">

//           <div>

//             <span>
//               APPOINTMENTS
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

//             <div>
//               📅
//             </div>

//             <h4>
//               No appointment history
//             </h4>

//             <p>
//               Your appointments will appear
//               here once they are added by
//               the clinic.
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
//     </>
//   );


//   /*
//   =======================================================
//   APPOINTMENTS
//   =======================================================
//   */

//   const renderAppointments = () => {

//     /*
//     Follow-up ko appointment-style item ke roop mein
//     dikhaya ja raha hai, lekin Firestore mein
//     koi fake appointment create nahi hota.
//     */

//     const hasFollowUp =
//       Boolean(
//         nextFollowUpDate
//       );


//     return (
//       <div className="patient-content-card">

//         <div className="patient-content-title">

//           <div>

//             <span>
//               MY APPOINTMENTS
//             </span>

//             <h3>
//               Appointments & Schedule
//             </h3>

//           </div>

//         </div>


//         {/* NEXT APPOINTMENT HIGHLIGHT */}

//         <div
//           style={{
//             marginBottom: "24px",
//             padding: "20px",
//             borderRadius: "16px",
//             background:
//               "rgba(37, 99, 235, 0.06)",
//             border:
//               "1px solid rgba(37, 99, 235, 0.12)",
//           }}
//         >

//           <span
//             style={{
//               fontSize: "12px",
//               fontWeight: "700",
//               letterSpacing:
//                 "0.08em",
//             }}
//           >
//             NEXT APPOINTMENT
//           </span>


//           {nextAppointment ? (
//             <div
//               style={{
//                 marginTop: "10px",
//               }}
//             >

//               <h3>
//                 {formatDate(
//                   nextAppointment.date
//                 )}
//               </h3>

//               <p>
//                 {formatTime(
//                   nextAppointment.slot ||
//                     nextAppointment.time
//                 )}
//                 {" • "}
//                 {nextAppointment.treatment ||
//                   nextAppointment.treatmentName ||
//                   "Therapy Session"}
//               </p>

//               <p>
//                 Doctor:{" "}
//                 {nextAppointment.doctorName ||
//                   doctor}
//               </p>

//             </div>
//           ) : (
//             <p>
//               No upcoming appointment found.
//             </p>
//           )}

//         </div>


//         {/* NEXT FOLLOW-UP */}

//         {hasFollowUp && (
//           <div
//             style={{
//               marginBottom: "24px",
//               padding: "20px",
//               borderRadius: "16px",
//               background:
//                 "rgba(16, 185, 129, 0.06)",
//               border:
//                 "1px solid rgba(16, 185, 129, 0.12)",
//             }}
//           >

//             <span
//               style={{
//                 fontSize: "12px",
//                 fontWeight: "700",
//                 letterSpacing:
//                   "0.08em",
//               }}
//             >
//               NEXT FOLLOW-UP
//             </span>

//             <h3>
//               {formatDate(
//                 nextFollowUpDate
//               )}
//             </h3>

//             <p>
//               Follow-up visit scheduled by
//               the clinic.
//             </p>

//           </div>
//         )}


//         {appointments.length === 0 &&
//         !hasFollowUp ? (
//           <div className="patient-empty-state">

//             <div>
//               📅
//             </div>

//             <h4>
//               No appointments found
//             </h4>

//             <p>
//               Your appointments will appear
//               here once they are added by
//               the clinic.
//             </p>

//           </div>
//         ) : (
//           <div className="patient-appointment-list">

//             {hasFollowUp && (
//               <div
//                 className="patient-appointment-item"
//               >

//                 <div className="patient-appointment-date">

//                   <strong>
//                     {getDateValue(
//                       nextFollowUpDate
//                     )?.getDate() || "—"}
//                   </strong>

//                   <span>
//                     {getDateValue(
//                       nextFollowUpDate
//                     )?.toLocaleDateString(
//                       "en-IN",
//                       {
//                         month: "short",
//                       }
//                     ) || ""}
//                   </span>

//                 </div>


//                 <div className="patient-appointment-info">

//                   <h4>
//                     Follow-up Visit
//                   </h4>

//                   <p>
//                     {doctor}
//                   </p>

//                   <small>
//                     {formatDate(
//                       nextFollowUpDate
//                     )}
//                   </small>

//                 </div>


//                 <span className="patient-status">
//                   Follow-up
//                 </span>

//               </div>
//             )}


//             {appointments
//               .slice()
//               .sort(
//                 (a, b) =>
//                   getDateValue(
//                     b.date
//                   ) -
//                   getDateValue(
//                     a.date
//                   )
//               )
//               .map(
//                 (
//                   appointment,
//                   index
//                 ) => (

//                   <div
//                     className="patient-appointment-item"
//                     key={
//                       appointment.id ||
//                       index
//                     }
//                   >

//                     <div className="patient-appointment-date">

//                       <strong>
//                         {getDateValue(
//                           appointment.date
//                         )?.getDate() ||
//                           "—"}
//                       </strong>

//                       <span>
//                         {getDateValue(
//                           appointment.date
//                         )?.toLocaleDateString(
//                           "en-IN",
//                           {
//                             month: "short",
//                           }
//                         ) || ""}
//                       </span>

//                     </div>


//                     <div className="patient-appointment-info">

//                       <h4>
//                         {appointment.treatment ||
//                           appointment.treatmentName ||
//                           "Therapy Session"}
//                       </h4>

//                       <p>
//                         {appointment.doctorName ||
//                           "Therapist"}
//                         {" • "}
//                         {formatTime(
//                           appointment.slot ||
//                             appointment.time
//                         )}
//                       </p>

//                       <small>
//                         {formatDate(
//                           appointment.date
//                         )}
//                       </small>

//                     </div>


//                     <span className="patient-status">

//                       {appointment.status ||
//                         "Confirmed"}

//                     </span>

//                   </div>
//                 )
//               )}

//           </div>
//         )}

//       </div>
//     );
//   };


//   /*
//   =======================================================
//   TREATMENTS
//   =======================================================
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

//           <div>
//             🩺
//           </div>

//           <h4>
//             No treatment history
//           </h4>

//           <p>
//             Treatment records added by your
//             therapist will appear here.
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
//                         {treatment.sessionNumber}
//                       </small>
//                     )}


//                     {treatment.observation && (
//                       <div className="patient-observation">

//                         <strong>
//                           Observation:
//                         </strong>{" "}

//                         {treatment.observation}

//                       </div>
//                     )}


//                     {treatment.notes && (
//                       <div className="patient-observation">

//                         <strong>
//                           Notes:
//                         </strong>{" "}

//                         {treatment.notes}

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
//   =======================================================
//   BILLS
//   =======================================================
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

//           <span>
//             💰
//           </span>

//           <div>

//             <strong>
//               ₹
//               {billSummary.total.toLocaleString(
//                 "en-IN"
//               )}
//             </strong>

//             <p>
//               Total Bills
//             </p>

//           </div>

//         </div>


//         <div className="patient-stat-card">

//           <span>
//             ✓
//           </span>

//           <div>

//             <strong>
//               ₹
//               {billSummary.paid.toLocaleString(
//                 "en-IN"
//               )}
//             </strong>

//             <p>
//               Paid
//             </p>

//           </div>

//         </div>


//         <div className="patient-stat-card">

//           <span>
//             ⏳
//           </span>

//           <div>

//             <strong>
//               ₹
//               {billSummary.pending.toLocaleString(
//                 "en-IN"
//               )}
//             </strong>

//             <p>
//               Pending
//             </p>

//           </div>

//         </div>

//       </div>


//       {bills.length === 0 ? (
//         <div className="patient-empty-state">

//           <div>
//             💳
//           </div>

//           <h4>
//             No billing records found
//           </h4>

//           <p>
//             Your bills and payment records
//             will appear here when they are
//             added by the clinic.
//           </p>

//         </div>
//       ) : (
//         <div className="patient-table-wrap">

//           <table className="patient-table">

//             <thead>

//               <tr>
//                 <th>Date</th>
//                 <th>Invoice</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//               </tr>

//             </thead>


//             <tbody>

//               {bills.map(
//                 (
//                   bill,
//                   index
//                 ) => {

//                   const amount =
//                     Number(
//                       bill.total ||
//                         bill.amount ||
//                         bill.grandTotal ||
//                         bill.totalAmount ||
//                         0
//                     );

//                   const paid =
//                     Number(
//                       bill.paid ||
//                         bill.paidAmount ||
//                         bill.amountPaid ||
//                         0
//                     );

//                   const status =
//                     bill.status ||
//                     (
//                       paid >= amount
//                         ? "Paid"
//                         : "Pending"
//                     );

//                   return (
//                     <tr
//                       key={
//                         bill.id ||
//                         index
//                       }
//                     >

//                       <td>
//                         {formatDate(
//                           bill.date ||
//                             bill.createdAt
//                         )}
//                       </td>

//                       <td>
//                         {bill.invoiceNumber ||
//                           bill.invoiceNo ||
//                           bill.billNumber ||
//                           bill.id ||
//                           "—"}
//                       </td>

//                       <td>
//                         ₹
//                         {amount.toLocaleString(
//                           "en-IN"
//                         )}
//                       </td>

//                       <td>

//                         <span className="patient-status">
//                           {status}
//                         </span>

//                       </td>

//                     </tr>
//                   );
//                 }
//               )}

//             </tbody>

//           </table>

//         </div>
//       )}

//     </div>
//   );


//   /*
//   =======================================================
//   REPORTS
//   =======================================================
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

//         <div>
//           📄
//         </div>

//         <h4>
//           No documents available
//         </h4>

//         <p>
//           Prescriptions, medical reports and
//           treatment documents uploaded by the
//           clinic will appear here.
//         </p>

//       </div>

//     </div>
//   );


//   /*
//   =======================================================
//   PROFILE
//   =======================================================
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
//   =======================================================
//   LOADING
//   =======================================================
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
//   =======================================================
//   ERROR
//   =======================================================
//   */

//   if (
//     error &&
//     !patient
//   ) {
//     return (
//       <div className="patient-dashboard-loading">

//         <h3>
//           Unable to load patient portal
//         </h3>

//         <p>
//           {error}
//         </p>

//         <button
//           onClick={() =>
//             navigate(
//               "/patient-login",
//               { replace: true }
//             )
//           }
//         >
//           Back to Login
//         </button>

//       </div>
//     );
//   }


//   /*
//   =======================================================
//   MAIN UI
//   =======================================================
//   */

//   return (
//     <div className="patient-dashboard">

//       {/* HEADER */}

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


//       {/* MAIN */}

//       <main className="patient-dashboard-main">

//         {/* WELCOME */}

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


//         {/* TABS */}

//         <nav className="patient-tabs">

//           <button
//             className={
//               activeTab ===
//               "overview"
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
//               activeTab ===
//               "appointments"
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
//               activeTab ===
//               "treatments"
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
//               activeTab ===
//               "bills"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab(
//                 "bills"
//               )
//             }
//           >
//             Bills
//           </button>


//           <button
//             className={
//               activeTab ===
//               "reports"
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
//               activeTab ===
//               "profile"
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


//         {/* CONTENT */}

//         <section className="patient-dashboard-content">

//           {activeTab ===
//             "overview" &&
//             renderOverview()}


//           {activeTab ===
//             "appointments" &&
//             renderAppointments()}


//           {activeTab ===
//             "treatments" &&
//             renderTreatments()}


//           {activeTab ===
//             "bills" &&
//             renderBills()}


//           {activeTab ===
//             "reports" &&
//             renderReports()}


//           {activeTab ===
//             "profile" &&
//             renderProfile()}

//         </section>

//       </main>


//       {/* FOOTER */}

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

import jsPDF from "jspdf";

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


/*
=========================================================
HTML ESCAPE HELPER
=========================================================
*/

const escapeHtml = (value) => {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};


/*
=========================================================
SAFE NUMBER
=========================================================
*/

const getNumber = (...values) => {
  for (const value of values) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
};


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


  // const normalizeDate = (value) => {
  //   const date =
  //     getDateValue(value);

  //   if (!date) {
  //     return "";
  //   }

  //   const year =
  //     date.getFullYear();

  //   const month = String(
  //     date.getMonth() + 1
  //   ).padStart(2, "0");

  //   const day = String(
  //     date.getDate()
  //   ).padStart(2, "0");

  //   return `${year}-${month}-${day}`;
  // };


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
          getNumber(
            bill.total,
            bill.amount,
            bill.grandTotal,
            bill.totalAmount
          );

        const billPaid =
          getNumber(
            bill.paid,
            bill.paidAmount,
            bill.amountPaid
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
  BILL HELPER
  =======================================================
  */

  const getBillDetails = (bill) => {
    const amount =
      getNumber(
        bill?.total,
        bill?.amount,
        bill?.grandTotal,
        bill?.totalAmount
      );

    const paid =
      getNumber(
        bill?.paid,
        bill?.paidAmount,
        bill?.amountPaid
      );

    const pending =
      Math.max(
        0,
        amount - paid
      );

    const status =
      bill?.status ||
      (
        paid >= amount &&
        amount > 0
          ? "Paid"
          : "Pending"
      );

    const invoiceNumber =
      bill?.invoiceNumber ||
      bill?.invoiceNo ||
      bill?.billNumber ||
      bill?.billNo ||
      bill?.invoice ||
      bill?.id ||
      "—";

    const date =
      bill?.date ||
      bill?.billingDate ||
      bill?.billDate ||
      bill?.createdAt ||
      "";

    return {
      amount,
      paid,
      pending,
      status,
      invoiceNumber,
      date,
    };
  };


  /*
  =======================================================
  GENERATE BILL PDF
  =======================================================
  */

  const generateBillPDF = (bill) => {
    if (!bill) {
      return;
    }

    const details =
      getBillDetails(bill);

    const pdf =
      new jsPDF();

    const clinicName =
      "PUNAR AXIS THERAPY";

    const clinicSubtitle =
      "Physiotherapy & Ayurveda";

    const billDate =
      formatDate(details.date);

    /*
    ---------------------------------------------------
    HEADER
    ---------------------------------------------------
    */

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(22);

    pdf.text(
      clinicName,
      105,
      18,
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
      clinicSubtitle,
      105,
      25,
      {
        align: "center",
      }
    );

    pdf.setDrawColor(
      180,
      180,
      180
    );

    pdf.line(
      15,
      32,
      195,
      32
    );


    /*
    ---------------------------------------------------
    BILL TITLE
    ---------------------------------------------------
    */

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(17);

    pdf.text(
      "BILL / PAYMENT RECEIPT",
      15,
      45
    );


    /*
    ---------------------------------------------------
    BILL INFORMATION
    ---------------------------------------------------
    */

    pdf.setFontSize(10);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "Invoice No:",
      15,
      57
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      String(
        details.invoiceNumber
      ),
      48,
      57
    );


    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "Bill Date:",
      115,
      57
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      billDate,
      145,
      57
    );


    /*
    ---------------------------------------------------
    PATIENT DETAILS BOX
    ---------------------------------------------------
    */

    pdf.setFillColor(
      245,
      248,
      250
    );

    pdf.roundedRect(
      15,
      68,
      180,
      48,
      3,
      3,
      "F"
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(12);

    pdf.text(
      "Patient Details",
      22,
      79
    );

    pdf.setFontSize(10);

    pdf.text(
      "Patient ID:",
      22,
      90
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      String(patientId),
      58,
      90
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "Patient Name:",
      22,
      101
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      String(patientName),
      58,
      101
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "Mobile:",
      110,
      90
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      String(
        patient?.mobile ||
        patient?.phone ||
        bill?.mobile ||
        bill?.phone ||
        "—"
      ),
      135,
      90
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "Treatment:",
      110,
      101
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      String(
        bill?.treatment ||
        bill?.treatmentName ||
        currentTreatment ||
        "—"
      ),
      142,
      101
    );


    /*
    ---------------------------------------------------
    BILL BREAKDOWN
    ---------------------------------------------------
    */

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(13);

    pdf.text(
      "Payment Details",
      15,
      132
    );


    /*
    Table Header
    */

    pdf.setFillColor(
      235,
      238,
      240
    );

    pdf.rect(
      15,
      140,
      180,
      12,
      "F"
    );

    pdf.setFontSize(9);

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      "DESCRIPTION",
      20,
      148
    );

    pdf.text(
      "AMOUNT",
      175,
      148,
      {
        align: "right",
      }
    );


    /*
    Total
    */

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "Total Bill Amount",
      20,
      162
    );

    pdf.text(
      `Rs. ${details.amount.toFixed(2)}`,
      175,
      162,
      {
        align: "right",
      }
    );


    /*
    Paid
    */

    pdf.text(
      "Amount Paid",
      20,
      173
    );

    pdf.text(
      `Rs. ${details.paid.toFixed(2)}`,
      175,
      173,
      {
        align: "right",
      }
    );


    /*
    Pending
    */

    pdf.text(
      "Pending Amount",
      20,
      184
    );

    pdf.text(
      `Rs. ${details.pending.toFixed(2)}`,
      175,
      184,
      {
        align: "right",
      }
    );


    /*
    Status Box
    */

    pdf.setFillColor(
      245,
      245,
      245
    );

    pdf.roundedRect(
      15,
      197,
      180,
      22,
      3,
      3,
      "F"
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.setFontSize(11);

    pdf.text(
      "Payment Status",
      22,
      211
    );

    pdf.setFontSize(13);

    pdf.text(
      String(details.status),
      185,
      211,
      {
        align: "right",
      }
    );


    /*
    ---------------------------------------------------
    ADDITIONAL BILL INFORMATION
    ---------------------------------------------------
    */

    let extraY = 235;

    const billDescription =
      bill?.description ||
      bill?.service ||
      bill?.particulars ||
      "";

    const paymentMode =
      bill?.paymentMode ||
      bill?.paymentMethod ||
      bill?.mode ||
      "";

    if (billDescription) {
      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(10);

      pdf.text(
        "Description:",
        15,
        extraY
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      const descriptionLines =
        pdf.splitTextToSize(
          String(billDescription),
          140
        );

      pdf.text(
        descriptionLines,
        55,
        extraY
      );

      extraY +=
        descriptionLines.length *
        6;
    }

    if (paymentMode) {
      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.text(
        "Payment Mode:",
        15,
        extraY + 7
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.text(
        String(paymentMode),
        55,
        extraY + 7
      );
    }


    /*
    ---------------------------------------------------
    FOOTER
    ---------------------------------------------------
    */

    pdf.setDrawColor(
      200,
      200,
      200
    );

    pdf.line(
      15,
      275,
      195,
      275
    );

    pdf.setFontSize(8);

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      "Punar Axis Therapy",
      15,
      283
    );

    pdf.text(
      "Billing document generated electronically",
      195,
      283,
      {
        align: "right",
      }
    );


    /*
    ---------------------------------------------------
    SAVE
    ---------------------------------------------------
    */

    const safeInvoice =
      String(
        details.invoiceNumber
      )
        .replace(
          /[^a-zA-Z0-9-_]/g,
          "-"
        );

    pdf.save(
      `Punar-Axis-Bill-${safeInvoice}.pdf`
    );
  };


  /*
  =======================================================
  PRINT BILL SLIP
  =======================================================
  */

  const printBillSlip = (bill) => {
    if (!bill) {
      return;
    }

    const details =
      getBillDetails(bill);

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=850,height=900"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the bill."
      );

      return;
    }

    const mobile =
      patient?.mobile ||
      patient?.phone ||
      bill?.mobile ||
      bill?.phone ||
      "—";

    const treatment =
      bill?.treatment ||
      bill?.treatmentName ||
      currentTreatment ||
      "—";

    const paymentMode =
      bill?.paymentMode ||
      bill?.paymentMethod ||
      bill?.mode ||
      "—";

    const description =
      bill?.description ||
      bill?.service ||
      bill?.particulars ||
      "—";


    const html = `
      <!DOCTYPE html>

      <html>

      <head>

        <title>
          Bill - ${escapeHtml(
            details.invoiceNumber
          )}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            background: #ffffff;
            color: #222;
          }

          .container {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            border: 1px solid #ddd;
            border-radius: 14px;
            overflow: hidden;
          }

          .header {
            text-align: center;
            padding: 28px 20px;
            border-bottom: 1px solid #ddd;
          }

          .header h1 {
            margin: 0;
            font-size: 27px;
            letter-spacing: 1px;
          }

          .header p {
            margin: 8px 0 0;
            color: #666;
            font-size: 14px;
          }

          .bill-title {
            padding: 20px;
            text-align: center;
          }

          .bill-title h2 {
            margin: 0;
            font-size: 20px;
          }

          .bill-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            padding: 0 20px 20px;
          }

          .meta-box {
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 14px;
          }

          .meta-label {
            display: block;
            font-size: 11px;
            color: #777;
            font-weight: bold;
            margin-bottom: 5px;
            text-transform: uppercase;
          }

          .meta-value {
            font-size: 15px;
            font-weight: bold;
          }

          .section {
            padding: 0 20px 20px;
          }

          .section h3 {
            font-size: 16px;
            margin: 8px 0 14px;
            padding-bottom: 8px;
            border-bottom: 1px solid #ddd;
          }

          .row {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .label {
            font-weight: bold;
          }

          .amount-box {
            margin: 5px 20px 25px;
            padding: 18px;
            background: #f5f5f5;
            border-radius: 10px;
          }

          .amount-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
            font-size: 15px;
          }

          .amount-row.total {
            font-weight: bold;
            font-size: 18px;
            border-top: 1px solid #ddd;
            margin-top: 7px;
            padding-top: 12px;
          }

          .status {
            margin-top: 12px;
            padding: 10px;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #ddd;
          }

          .footer {
            border-top: 1px solid #ddd;
            padding: 15px 20px;
            text-align: center;
            color: #777;
            font-size: 11px;
          }

          @media print {

            body {
              padding: 0;
            }

            .container {
              border: none;
              max-width: none;
            }

          }

        </style>

      </head>

      <body>

        <div class="container">

          <div class="header">

            <h1>
              PUNAR AXIS THERAPY
            </h1>

            <p>
              Physiotherapy & Ayurveda
            </p>

          </div>


          <div class="bill-title">

            <h2>
              BILL / PAYMENT RECEIPT
            </h2>

          </div>


          <div class="bill-meta">

            <div class="meta-box">

              <span class="meta-label">
                Invoice Number
              </span>

              <span class="meta-value">
                ${escapeHtml(
                  details.invoiceNumber
                )}
              </span>

            </div>


            <div class="meta-box">

              <span class="meta-label">
                Bill Date
              </span>

              <span class="meta-value">
                ${escapeHtml(
                  formatDate(
                    details.date
                  )
                )}
              </span>

            </div>

          </div>


          <div class="section">

            <h3>
              Patient Details
            </h3>


            <div class="row">

              <div class="label">
                Patient ID
              </div>

              <div>
                ${escapeHtml(
                  patientId
                )}
              </div>

            </div>


            <div class="row">

              <div class="label">
                Patient Name
              </div>

              <div>
                ${escapeHtml(
                  patientName
                )}
              </div>

            </div>


            <div class="row">

              <div class="label">
                Mobile
              </div>

              <div>
                ${escapeHtml(
                  mobile
                )}
              </div>

            </div>


            <div class="row">

              <div class="label">
                Treatment
              </div>

              <div>
                ${escapeHtml(
                  treatment
                )}
              </div>

            </div>

          </div>


          <div class="section">

            <h3>
              Billing Details
            </h3>


            <div class="row">

              <div class="label">
                Description
              </div>

              <div>
                ${escapeHtml(
                  description
                )}
              </div>

            </div>


            <div class="row">

              <div class="label">
                Payment Mode
              </div>

              <div>
                ${escapeHtml(
                  paymentMode
                )}
              </div>

            </div>

          </div>


          <div class="amount-box">

            <div class="amount-row">

              <span>
                Total Bill
              </span>

              <span>
                Rs. ${details.amount.toFixed(2)}
              </span>

            </div>


            <div class="amount-row">

              <span>
                Amount Paid
              </span>

              <span>
                Rs. ${details.paid.toFixed(2)}
              </span>

            </div>


            <div class="amount-row">

              <span>
                Pending Amount
              </span>

              <span>
                Rs. ${details.pending.toFixed(2)}
              </span>

            </div>


            <div class="amount-row total">

              <span>
                Status
              </span>

              <span>
                ${escapeHtml(
                  details.status
                )}
              </span>

            </div>

          </div>


          <div class="footer">

            Punar Axis Therapy —
            Billing document generated electronically.

          </div>

        </div>


        <script>

          window.onload = function () {
            window.print();
          };

        </script>

      </body>

      </html>
    `;


    printWindow.document.open();

    printWindow.document.write(
      html
    );

    printWindow.document.close();
  };


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

                  <th>
                    Date
                  </th>

                  <th>
                    Treatment
                  </th>

                  <th>
                    Doctor
                  </th>

                  <th>
                    Status
                  </th>

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


      {/* BILL SUMMARY */}

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


      {/* BILL LIST */}

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

                <th>
                  Date
                </th>

                <th>
                  Invoice
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Status
                </th>

                <th>
                  Documents
                </th>

              </tr>

            </thead>


            <tbody>

              {bills.map(
                (
                  bill,
                  index
                ) => {

                  const details =
                    getBillDetails(
                      bill
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
                          details.date
                        )}
                      </td>


                      <td>
                        {details.invoiceNumber}
                      </td>


                      <td>
                        ₹
                        {details.amount.toLocaleString(
                          "en-IN"
                        )}
                      </td>


                      <td>

                        <span className="patient-status">
                          {details.status}
                        </span>

                      </td>


                      <td>

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "8px",
                            flexWrap:
                              "wrap",
                            alignItems:
                              "center",
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              generateBillPDF(
                                bill
                              )
                            }
                            style={{
                              border:
                                "none",
                              borderRadius:
                                "8px",
                              padding:
                                "8px 12px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "600",
                              background:
                                "#eef4ff",
                              color:
                                "#2563eb",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            📄 View PDF
                          </button>


                          <button
                            type="button"
                            onClick={() =>
                              printBillSlip(
                                bill
                              )
                            }
                            style={{
                              border:
                                "none",
                              borderRadius:
                                "8px",
                              padding:
                                "8px 12px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "600",
                              background:
                                "#f1f5f9",
                              color:
                                "#334155",
                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            🖨️ Print Slip
                          </button>

                        </div>

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
              patient?.phone ||
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