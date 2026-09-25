// import React, { useEffect, useMemo, useRef, useState } from "react";
// import "./EmployeeAttendance.css";

// function EmployeeAttendance() {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState([]);

//   const [activeTab, setActiveTab] = useState("attendance");

//   const [showEmployeeForm, setShowEmployeeForm] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationStatus, setLocationStatus] = useState(
//     "Location not captured"
//   );

//   const [faceImage, setFaceImage] = useState("");

//   const [employeeForm, setEmployeeForm] = useState({
//     name: "",
//     mobile: "",
//     department: "",
//     designation: "",
//     salary: "",
//     joiningDate: "",
//   });

//   const [selectedMonth, setSelectedMonth] = useState(
//     new Date().toISOString().slice(0, 7)
//   );

//   /* =========================
//      LOAD DATA
//   ========================= */

//   useEffect(() => {
//     const savedEmployees =
//       localStorage.getItem("clinic_employees");

//     const savedAttendance =
//       localStorage.getItem("clinic_employee_attendance");

//     if (savedEmployees) {
//       try {
//         setEmployees(JSON.parse(savedEmployees));
//       } catch {
//         setEmployees([]);
//       }
//     }

//     if (savedAttendance) {
//       try {
//         setAttendance(JSON.parse(savedAttendance));
//       } catch {
//         setAttendance([]);
//       }
//     }
//   }, []);

//   /* =========================
//      SAVE EMPLOYEES
//   ========================= */

//   useEffect(() => {
//     localStorage.setItem(
//       "clinic_employees",
//       JSON.stringify(employees)
//     );
//   }, [employees]);

//   /* =========================
//      SAVE ATTENDANCE
//   ========================= */

//   useEffect(() => {
//     localStorage.setItem(
//       "clinic_employee_attendance",
//       JSON.stringify(attendance)
//     );
//   }, [attendance]);

//   /* =========================
//      EMPLOYEE ID
//   ========================= */

//   const generateEmployeeId = () => {
//     const nextNumber = employees.length + 1;

//     return `EMP-${String(nextNumber).padStart(4, "0")}`;
//   };

//   /* =========================
//      EMPLOYEE FORM
//   ========================= */

//   const handleEmployeeChange = (e) => {
//     setEmployeeForm({
//       ...employeeForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const saveEmployee = () => {
//     if (!employeeForm.name.trim()) {
//       alert("Please enter employee name.");
//       return;
//     }

//     if (!employeeForm.mobile.trim()) {
//       alert("Please enter mobile number.");
//       return;
//     }

//     if (!employeeForm.salary) {
//       alert("Please enter monthly salary.");
//       return;
//     }

//     const newEmployee = {
//       id: generateEmployeeId(),
//       name: employeeForm.name.trim(),
//       mobile: employeeForm.mobile.trim(),
//       department: employeeForm.department,
//       designation: employeeForm.designation,
//       salary: Number(employeeForm.salary),
//       joiningDate: employeeForm.joiningDate,
//       faceImage: "",
//       createdAt: new Date().toISOString(),
//     };

//     setEmployees((prev) => [
//       ...prev,
//       newEmployee,
//     ]);

//     setEmployeeForm({
//       name: "",
//       mobile: "",
//       department: "",
//       designation: "",
//       salary: "",
//       joiningDate: "",
//     });

//     setShowEmployeeForm(false);

//     alert(
//       `Employee created successfully.\nEmployee ID: ${newEmployee.id}`
//     );
//   };

//   /* =========================
//      CAMERA
//   ========================= */

//   const startCamera = async (employee) => {
//     setSelectedEmployee(employee);
//     setShowCamera(true);

//     try {
//       const stream =
//         await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: "user",
//           },
//           audio: false,
//         });

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error(error);

//       alert(
//         "Camera permission is required."
//       );
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       videoRef.current.srcObject
//         .getTracks()
//         .forEach((track) =>
//           track.stop()
//         );

//       videoRef.current.srcObject = null;
//     }

//     setShowCamera(false);
//   };

//   /* =========================
//      CAPTURE FACE
//   ========================= */

//   const captureFace = () => {
//     if (!videoRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context =
//       canvas.getContext("2d");

//     context.drawImage(
//       video,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//     const image =
//       canvas.toDataURL(
//         "image/jpeg",
//         0.8
//       );

//     setFaceImage(image);

//     if (selectedEmployee) {
//       setEmployees((prev) =>
//         prev.map((employee) =>
//           employee.id ===
//           selectedEmployee.id
//             ? {
//                 ...employee,
//                 faceImage: image,
//               }
//             : employee
//         )
//       );
//     }

//     stopCamera();

//     alert(
//       "Face image registered successfully."
//     );
//   };

//   /* =========================
//      LOCATION
//   ========================= */

//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationStatus(
//         "Geolocation is not supported."
//       );
//       return;
//     }

//     setLocationStatus(
//       "Getting your location..."
//     );

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const latitude =
//           position.coords.latitude;

//         const longitude =
//           position.coords.longitude;

//         setCurrentLocation({
//           latitude,
//           longitude,
//           accuracy:
//             position.coords.accuracy,
//           capturedAt:
//             new Date().toISOString(),
//         });

//         setLocationStatus(
//           "Location captured successfully"
//         );
//       },
//       (error) => {
//         console.error(error);

//         setLocationStatus(
//           "Unable to get location. Please allow GPS permission."
//         );
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );
//   };

//   const getMapLink = (
//     latitude,
//     longitude
//   ) => {
//     return `https://www.google.com/maps?q=${latitude},${longitude}`;
//   };

//   /* =========================
//      TODAY
//   ========================= */

//   const today = new Date()
//     .toISOString()
//     .slice(0, 10);

//   /* =========================
//      MARK ATTENDANCE
//   ========================= */

//   const markAttendance = (
//     employee,
//     type = "Present"
//   ) => {
//     const alreadyMarked =
//       attendance.find(
//         (item) =>
//           item.employeeId ===
//             employee.id &&
//           item.date === today
//       );

//     if (alreadyMarked) {
//       alert(
//         "Attendance already marked for today."
//       );
//       return;
//     }

//     if (!currentLocation) {
//       alert(
//         "Please capture your current location first."
//       );
//       return;
//     }

//     if (!employee.faceImage) {
//       alert(
//         "Employee face is not registered yet."
//       );
//       return;
//     }

//     const now = new Date();

//     const record = {
//       id: Date.now(),
//       employeeId: employee.id,
//       employeeName: employee.name,
//       date: today,
//       time: now.toLocaleTimeString(
//         "en-IN",
//         {
//           hour: "2-digit",
//           minute: "2-digit",
//         }
//       ),
//       type,
//       latitude:
//         currentLocation.latitude,
//       longitude:
//         currentLocation.longitude,
//       accuracy:
//         currentLocation.accuracy,
//       faceVerified: true,
//       locationVerified: true,
//       createdAt:
//         now.toISOString(),
//     };

//     setAttendance((prev) => [
//       ...prev,
//       record,
//     ]);

//     alert(
//       `${employee.name}'s attendance marked successfully.`
//     );
//   };

//   /* =========================
//      MONTH DATA
//   ========================= */

//   const monthAttendance =
//     useMemo(() => {
//       return attendance.filter(
//         (item) =>
//           item.date.slice(0, 7) ===
//           selectedMonth
//       );
//     }, [attendance, selectedMonth]);

//   /* =========================
//      SALARY CALCULATION
//   ========================= */

//   const calculateSalary = (
//     employee
//   ) => {
//     const salary =
//       Number(employee.salary) || 0;

//     const year = Number(
//       selectedMonth.split("-")[0]
//     );

//     const month =
//       Number(
//         selectedMonth.split("-")[1]
//       ) - 1;

//     const daysInMonth =
//       new Date(
//         year,
//         month + 1,
//         0
//       ).getDate();

//     const employeeAttendance =
//       monthAttendance.filter(
//         (item) =>
//           item.employeeId ===
//           employee.id
//       );

//     const presentDays =
//       employeeAttendance.filter(
//         (item) =>
//           item.type === "Present"
//       ).length;

//     const halfDays =
//       employeeAttendance.filter(
//         (item) =>
//           item.type === "Half Day"
//       ).length;

//     /*
//       Leave policy:

//       First 2 leave days = no deduction

//       3rd leave onward =
//       half-day salary deduction

//       For salary calculation:
//       per day salary =
//       monthly salary / days in month

//       half-day deduction =
//       per day salary / 2
//     */

//     const absentDays = Math.max(
//       0,
//       daysInMonth -
//         presentDays -
//         halfDays
//     );

//     const freeLeaveDays =
//       Math.min(
//         absentDays,
//         2
//       );

//     const paidDeductionLeave =
//       Math.max(
//         0,
//         absentDays - 2
//       );

//     const perDaySalary =
//       salary / daysInMonth;

//     const halfDayDeduction =
//       halfDays *
//       (perDaySalary / 2);

//     const leaveDeduction =
//       paidDeductionLeave *
//       (perDaySalary / 2);

//     const totalDeduction =
//       halfDayDeduction +
//       leaveDeduction;

//     const payableSalary =
//       Math.max(
//         0,
//         salary - totalDeduction
//       );

//     return {
//       daysInMonth,
//       presentDays,
//       halfDays,
//       absentDays,
//       freeLeaveDays,
//       paidDeductionLeave,
//       perDaySalary,
//       halfDayDeduction,
//       leaveDeduction,
//       totalDeduction,
//       payableSalary,
//     };
//   };

//   /* =========================
//      DELETE EMPLOYEE
//   ========================= */

//   const deleteEmployee = (
//     employeeId
//   ) => {
//     const confirmDelete =
//       window.confirm(
//         "Delete this employee?"
//       );

//     if (!confirmDelete) return;

//     setEmployees((prev) =>
//       prev.filter(
//         (employee) =>
//           employee.id !==
//           employeeId
//       )
//     );
//   };

//   /* =========================
//      ATTENDANCE STATUS
//   ========================= */

//   const getEmployeeTodayStatus =
//     (employeeId) => {
//       const record =
//         attendance.find(
//           (item) =>
//             item.employeeId ===
//               employeeId &&
//             item.date === today
//         );

//       return record
//         ? record.type
//         : "Not Marked";
//     };

//   return (
//     <div className="employee-attendance-page">

//       {/* HEADER */}

//       <div className="attendance-header">

//         <div>
//           <h1>
//             Employee Attendance
//           </h1>

//           <p>
//             Employee attendance, face verification,
//             GPS location & salary management
//           </p>
//         </div>

//         <button
//           className="primary-btn"
//           onClick={() =>
//             setShowEmployeeForm(true)
//           }
//         >
//           + Add Employee
//         </button>

//       </div>


//       {/* TABS */}

//       <div className="attendance-tabs">

//         <button
//           className={
//             activeTab === "attendance"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setActiveTab("attendance")
//           }
//         >
//           Attendance
//         </button>

//         <button
//           className={
//             activeTab === "employees"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setActiveTab("employees")
//           }
//         >
//           Employees
//         </button>

//         <button
//           className={
//             activeTab === "salary"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setActiveTab("salary")
//           }
//         >
//           Salary
//         </button>

//         <button
//           className={
//             activeTab === "terms"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setActiveTab("terms")
//           }
//         >
//           Terms & Conditions
//         </button>

//       </div>


//       {/* =========================
//           ATTENDANCE
//       ========================= */}

//       {activeTab === "attendance" && (
//         <>

//           <div className="attendance-summary">

//             <div className="summary-card">
//               <span>
//                 Employees
//               </span>
//               <strong>
//                 {employees.length}
//               </strong>
//             </div>

//             <div className="summary-card">
//               <span>
//                 Present Today
//               </span>
//               <strong>
//                 {
//                   attendance.filter(
//                     (item) =>
//                       item.date ===
//                         today &&
//                       item.type ===
//                         "Present"
//                   ).length
//                 }
//               </strong>
//             </div>

//             <div className="summary-card">
//               <span>
//                 Half Day
//               </span>
//               <strong>
//                 {
//                   attendance.filter(
//                     (item) =>
//                       item.date ===
//                         today &&
//                       item.type ===
//                         "Half Day"
//                   ).length
//                 }
//               </strong>
//             </div>

//             <div className="summary-card">
//               <span>
//                 Not Marked
//               </span>
//               <strong>
//                 {
//                   employees.filter(
//                     (employee) =>
//                       getEmployeeTodayStatus(
//                         employee.id
//                       ) ===
//                       "Not Marked"
//                   ).length
//                 }
//               </strong>
//             </div>

//           </div>


//           {/* LOCATION */}

//           <div className="location-card">

//             <div>
//               <h3>
//                 Attendance Location
//               </h3>

//               <p>
//                 {locationStatus}
//               </p>

//               {currentLocation && (
//                 <small>
//                   Latitude:{" "}
//                   {currentLocation.latitude}
//                   {" | "}
//                   Longitude:{" "}
//                   {currentLocation.longitude}
//                   {" | "}
//                   Accuracy:{" "}
//                   {Math.round(
//                     currentLocation.accuracy
//                   )}
//                   m
//                 </small>
//               )}
//             </div>

//             <div className="location-actions">

//               <button
//                 className="location-btn"
//                 onClick={
//                   getCurrentLocation
//                 }
//               >
//                 📍 Get Current Location
//               </button>

//               {currentLocation && (
//                 <a
//                   href={getMapLink(
//                     currentLocation.latitude,
//                     currentLocation.longitude
//                   )}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="map-btn"
//                 >
//                   Open Google Maps
//                 </a>
//               )}

//             </div>

//           </div>


//           {/* EMPLOYEE ATTENDANCE */}

//           <div className="attendance-table-card">

//             <div className="section-heading">

//               <div>
//                 <h2>
//                   Today's Attendance
//                 </h2>

//                 <p>
//                   {today}
//                 </p>
//               </div>

//             </div>

//             {employees.length === 0 ? (

//               <div className="empty-state">
//                 <h3>
//                   No employees added
//                 </h3>

//                 <p>
//                   Add an employee to start attendance.
//                 </p>
//               </div>

//             ) : (

//               <div className="employee-list">

//                 {employees.map(
//                   (employee) => {

//                     const status =
//                       getEmployeeTodayStatus(
//                         employee.id
//                       );

//                     return (
//                       <div
//                         className="employee-row"
//                         key={employee.id}
//                       >

//                         <div className="employee-main">

//                           <div className="employee-avatar">
//                             {employee.name
//                               .charAt(0)
//                               .toUpperCase()}
//                           </div>

//                           <div>
//                             <h3>
//                               {employee.name}
//                             </h3>

//                             <p>
//                               {employee.id}
//                               {" • "}
//                               {employee.designation ||
//                                 "Employee"}
//                             </p>
//                           </div>

//                         </div>


//                         <div className="employee-status">

//                           <span
//                             className={`status-badge ${
//                               status
//                                 .toLowerCase()
//                                 .replace(
//                                   " ",
//                                   "-"
//                                 )
//                             }`}
//                           >
//                             {status}
//                           </span>

//                         </div>


//                         <div className="employee-actions">

//                           {!employee.faceImage ? (
//                             <button
//                               className="face-btn"
//                               onClick={() =>
//                                 startCamera(
//                                   employee
//                                 )
//                               }
//                             >
//                               📷 Register Face
//                             </button>
//                           ) : (
//                             <span className="face-registered">
//                               ✓ Face Registered
//                             </span>
//                           )}

//                           {status ===
//                             "Not Marked" && (

//                             <button
//                               className="mark-btn"
//                               onClick={() =>
//                                 markAttendance(
//                                   employee,
//                                   "Present"
//                                 )
//                               }
//                             >
//                               Mark Present
//                             </button>

//                           )}

//                           {status ===
//                             "Not Marked" && (

//                             <button
//                               className="halfday-btn"
//                               onClick={() =>
//                                 markAttendance(
//                                   employee,
//                                   "Half Day"
//                                 )
//                               }
//                             >
//                               Half Day
//                             </button>

//                           )}

//                         </div>

//                       </div>
//                     );
//                   }
//                 )}

//               </div>

//             )}

//           </div>

//         </>
//       )}


//       {/* =========================
//           EMPLOYEES
//       ========================= */}

//       {activeTab === "employees" && (

//         <div className="employee-management">

//           <div className="section-heading">

//             <div>
//               <h2>
//                 Employee Management
//               </h2>

//               <p>
//                 Manage employee profile and face registration
//               </p>
//             </div>

//             <button
//               className="primary-btn"
//               onClick={() =>
//                 setShowEmployeeForm(true)
//               }
//             >
//               + Add Employee
//             </button>

//           </div>


//           <div className="employee-grid">

//             {employees.map(
//               (employee) => (

//                 <div
//                   className="employee-card"
//                   key={employee.id}
//                 >

//                   <div className="employee-card-top">

//                     <div className="large-avatar">

//                       {employee.name
//                         .charAt(0)
//                         .toUpperCase()}

//                     </div>

//                     <div>
//                       <h3>
//                         {employee.name}
//                       </h3>

//                       <span>
//                         {employee.id}
//                       </span>
//                     </div>

//                   </div>


//                   <div className="employee-details">

//                     <div>
//                       <span>
//                         Mobile
//                       </span>
//                       <strong>
//                         {employee.mobile}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>
//                         Department
//                       </span>
//                       <strong>
//                         {employee.department ||
//                           "-"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>
//                         Designation
//                       </span>
//                       <strong>
//                         {employee.designation ||
//                           "-"}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>
//                         Monthly Salary
//                       </span>
//                       <strong>
//                         ₹
//                         {Number(
//                           employee.salary
//                         ).toLocaleString(
//                           "en-IN"
//                         )}
//                       </strong>
//                     </div>

//                   </div>


//                   <div className="employee-card-actions">

//                     <button
//                       className="face-btn"
//                       onClick={() =>
//                         startCamera(
//                           employee
//                         )
//                       }
//                     >
//                       📷
//                       {employee.faceImage
//                         ? " Update Face"
//                         : " Register Face"}
//                     </button>

//                     <button
//                       className="delete-employee-btn"
//                       onClick={() =>
//                         deleteEmployee(
//                           employee.id
//                         )
//                       }
//                     >
//                       Delete
//                     </button>

//                   </div>

//                 </div>

//               )
//             )}

//           </div>

//         </div>

//       )}


//       {/* =========================
//           SALARY
//       ========================= */}

//       {activeTab === "salary" && (

//         <div className="salary-section">

//           <div className="section-heading">

//             <div>
//               <h2>
//                 Monthly Salary
//               </h2>

//               <p>
//                 Attendance-based salary calculation
//               </p>
//             </div>

//             <input
//               type="month"
//               value={selectedMonth}
//               onChange={(e) =>
//                 setSelectedMonth(
//                   e.target.value
//                 )
//               }
//             />

//           </div>


//           <div className="salary-rule-banner">

//             <strong>
//               Salary Rule
//             </strong>

//             <span>
//               First 2 leave days = No deduction
//             </span>

//             <span>
//               3rd leave onward = Half-day salary deduction
//             </span>

//           </div>


//           <div className="salary-table-wrapper">

//             <table className="salary-table">

//               <thead>
//                 <tr>
//                   <th>
//                     Employee
//                   </th>

//                   <th>
//                     Salary
//                   </th>

//                   <th>
//                     Present
//                   </th>

//                   <th>
//                     Half Day
//                   </th>

//                   <th>
//                     Leave
//                   </th>

//                   <th>
//                     Free Leave
//                   </th>

//                   <th>
//                     Deduction
//                   </th>

//                   <th>
//                     Payable Salary
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {employees.map(
//                   (employee) => {

//                     const salary =
//                       calculateSalary(
//                         employee
//                       );

//                     return (
//                       <tr
//                         key={employee.id}
//                       >

//                         <td>
//                           <strong>
//                             {employee.name}
//                           </strong>

//                           <small>
//                             {employee.id}
//                           </small>
//                         </td>

//                         <td>
//                           ₹
//                           {Number(
//                             employee.salary
//                           ).toLocaleString(
//                             "en-IN"
//                           )}
//                         </td>

//                         <td>
//                           {salary.presentDays}
//                         </td>

//                         <td>
//                           {salary.halfDays}
//                         </td>

//                         <td>
//                           {salary.absentDays}
//                         </td>

//                         <td>
//                           {salary.freeLeaveDays}
//                         </td>

//                         <td className="deduction">
//                           ₹
//                           {Math.round(
//                             salary.totalDeduction
//                           ).toLocaleString(
//                             "en-IN"
//                           )}
//                         </td>

//                         <td className="payable">
//                           ₹
//                           {Math.round(
//                             salary.payableSalary
//                           ).toLocaleString(
//                             "en-IN"
//                           )}
//                         </td>

//                       </tr>
//                     );
//                   }
//                 )}

//               </tbody>

//             </table>

//           </div>

//         </div>

//       )}


//       {/* =========================
//           TERMS
//       ========================= */}

//       {activeTab === "terms" && (

//         <div className="terms-card">

//           <h2>
//             Employee Attendance Terms & Conditions
//           </h2>

//           <div className="terms-list">

//             <div>
//               <strong>
//                 1. Attendance
//               </strong>

//               <p>
//                 Employee attendance must be marked
//                 through the designated attendance
//                 system.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 2. Face Verification
//               </strong>

//               <p>
//                 Employee face registration may be
//                 required for attendance verification.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 3. Location Verification
//               </strong>

//               <p>
//                 Attendance may capture the device's
//                 GPS coordinates with employee permission.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 4. First Two Leave Days
//               </strong>

//               <p>
//                 The first two leave/absence days in
//                 a salary month will not result in salary
//                 deduction under this policy.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 5. Third Leave Day
//               </strong>

//               <p>
//                 From the third leave/absence day onward,
//                 a half-day salary deduction will apply
//                 according to the configured salary rule.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 6. Half Day
//               </strong>

//               <p>
//                 A separately marked Half Day will be
//                 calculated as half-day salary deduction.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 7. Attendance Correction
//               </strong>

//               <p>
//                 Any attendance correction should be
//                 approved by the authorized administrator.
//               </p>
//             </div>


//             <div>
//               <strong>
//                 8. Privacy
//               </strong>

//               <p>
//                 Face and location information should
//                 only be collected, stored and processed
//                 with appropriate notice, consent and
//                 access controls.
//               </p>
//             </div>

//           </div>

//         </div>

//       )}


//       {/* =========================
//           EMPLOYEE FORM MODAL
//       ========================= */}

//       {showEmployeeForm && (

//         <div className="modal-overlay">

//           <div className="employee-form-modal">

//             <div className="modal-heading">

//               <div>
//                 <h2>
//                   Add New Employee
//                 </h2>

//                 <p>
//                   Employee ID will be generated automatically.
//                 </p>
//               </div>

//               <button
//                 onClick={() =>
//                   setShowEmployeeForm(false)
//                 }
//               >
//                 ×
//               </button>

//             </div>


//             <div className="form-grid">

//               <div className="form-field full">
//                 <label>
//                   Employee Name *
//                 </label>

//                 <input
//                   name="name"
//                   value={employeeForm.name}
//                   onChange={
//                     handleEmployeeChange
//                   }
//                   placeholder="Enter employee name"
//                 />
//               </div>


//               <div className="form-field">
//                 <label>
//                   Mobile Number *
//                 </label>

//                 <input
//                   name="mobile"
//                   value={employeeForm.mobile}
//                   onChange={
//                     handleEmployeeChange
//                   }
//                   placeholder="Enter mobile number"
//                 />
//               </div>


//               <div className="form-field">
//                 <label>
//                   Joining Date
//                 </label>

//                 <input
//                   type="date"
//                   name="joiningDate"
//                   value={
//                     employeeForm.joiningDate
//                   }
//                   onChange={
//                     handleEmployeeChange
//                   }
//                 />
//               </div>


//               <div className="form-field">
//                 <label>
//                   Department
//                 </label>

//                 <input
//                   name="department"
//                   value={
//                     employeeForm.department
//                   }
//                   onChange={
//                     handleEmployeeChange
//                   }
//                   placeholder="Physiotherapy"
//                 />
//               </div>


//               <div className="form-field">
//                 <label>
//                   Designation
//                 </label>

//                 <input
//                   name="designation"
//                   value={
//                     employeeForm.designation
//                   }
//                   onChange={
//                     handleEmployeeChange
//                   }
//                   placeholder="Therapist"
//                 />
//               </div>


//               <div className="form-field">
//                 <label>
//                   Monthly Salary *
//                 </label>

//                 <input
//                   type="number"
//                   name="salary"
//                   value={
//                     employeeForm.salary
//                   }
//                   onChange={
//                     handleEmployeeChange
//                   }
//                   placeholder="₹ 25000"
//                 />
//               </div>

//             </div>


//             <div className="form-actions">

//               <button
//                 className="secondary-btn"
//                 onClick={() =>
//                   setShowEmployeeForm(false)
//                 }
//               >
//                 Cancel
//               </button>

//               <button
//                 className="primary-btn"
//                 onClick={saveEmployee}
//               >
//                 Create Employee
//               </button>

//             </div>

//           </div>

//         </div>

//       )}


//       {/* =========================
//           CAMERA MODAL
//       ========================= */}

//       {showCamera && (

//         <div className="modal-overlay">

//           <div className="camera-modal">

//             <div className="modal-heading">

//               <div>
//                 <h2>
//                   Face Registration
//                 </h2>

//                 <p>
//                   {selectedEmployee?.name}
//                 </p>
//               </div>

//               <button
//                 onClick={stopCamera}
//               >
//                 ×
//               </button>

//             </div>


//             <div className="camera-container">

//               <video
//                 ref={videoRef}
//                 autoPlay
//                 playsInline
//                 muted
//               />

//               <div className="face-guide">
//                 Place face inside this area
//               </div>

//             </div>


//             <canvas
//               ref={canvasRef}
//               style={{
//                 display: "none",
//               }}
//             />


//             <div className="camera-info">
//               <p>
//                 Please look directly at the camera
//                 before capturing the face.
//               </p>
//             </div>


//             <div className="form-actions">

//               <button
//                 className="secondary-btn"
//                 onClick={stopCamera}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="primary-btn"
//                 onClick={captureFace}
//               >
//                 Capture Face
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }

// export default EmployeeAttendance;

// import React, { useEffect, useMemo, useState } from "react";
// import "./EmployeeAttendance.css";

// const EMPLOYEE_KEY = "clinic_employees";
// const ATTENDANCE_KEY = "clinic_employee_attendance";

// const getToday = () => new Date().toISOString().split("T")[0];

// const getTime = () =>
//   new Date().toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// function EmployeeAttendance() {
//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState([]);

//   const [mode, setMode] = useState("employee");
//   const [adminLoggedIn, setAdminLoggedIn] = useState(false);
//   const [employeeLoggedIn, setEmployeeLoggedIn] = useState(false);
//   const [loggedEmployee, setLoggedEmployee] = useState(null);

//   const [loginId, setLoginId] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");

//   const [showEmployeeModal, setShowEmployeeModal] = useState(false);
//   const [showFaceModal, setShowFaceModal] = useState(false);

//   const [cameraStream, setCameraStream] = useState(null);
//   const [faceImage, setFaceImage] = useState("");

//   const [location, setLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const [employeeForm, setEmployeeForm] = useState({
//     name: "",
//     mobile: "",
//     department: "",
//     designation: "",
//     salary: "",
//     joiningDate: getToday(),
//     password: "",
//   });

//   useEffect(() => {
//     const savedEmployees = JSON.parse(
//       localStorage.getItem(EMPLOYEE_KEY) || "[]"
//     );

//     const savedAttendance = JSON.parse(
//       localStorage.getItem(ATTENDANCE_KEY) || "[]"
//     );

//     setEmployees(savedEmployees);
//     setAttendance(savedAttendance);
//   }, []);

//   const saveEmployees = (data) => {
//     setEmployees(data);
//     localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data));
//   };

//   const saveAttendance = (data) => {
//     setAttendance(data);
//     localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
//   };

//   const generateEmployeeId = () => {
//     const numbers = employees
//       .map((employee) => {
//         const match = String(employee.id).match(/EMP-(\d+)/);
//         return match ? Number(match[1]) : 0;
//       })
//       .filter(Boolean);

//     const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1;

//     return `EMP-${String(nextNumber).padStart(4, "0")}`;
//   };

//   const handleAdminLogin = () => {
//     if (loginId === "admin" && loginPassword === "admin123") {
//       setAdminLoggedIn(true);
//       setLoginId("");
//       setLoginPassword("");
//     } else {
//       alert("Invalid Admin ID or Password");
//     }
//   };

//   const handleEmployeeLogin = () => {
//     const employee = employees.find(
//       (item) =>
//         String(item.id).toLowerCase() === loginId.trim().toLowerCase() &&
//         String(item.password) === loginPassword
//     );

//     if (!employee) {
//       alert("Invalid Employee ID or Password");
//       return;
//     }

//     setLoggedEmployee(employee);
//     setEmployeeLoggedIn(true);
//     setLoginId("");
//     setLoginPassword("");
//   };

//   const logout = () => {
//     setAdminLoggedIn(false);
//     setEmployeeLoggedIn(false);
//     setLoggedEmployee(null);
//     setMode("employee");
//   };

//   const handleEmployeeForm = (e) => {
//     setEmployeeForm({
//       ...employeeForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const createEmployee = (e) => {
//     e.preventDefault();

//     if (
//       !employeeForm.name ||
//       !employeeForm.mobile ||
//       !employeeForm.salary ||
//       !employeeForm.password
//     ) {
//       alert("Please fill all required fields");
//       return;
//     }

//     const newEmployee = {
//       ...employeeForm,
//       id: generateEmployeeId(),
//       salary: Number(employeeForm.salary),
//       faceImage: "",
//       createdAt: new Date().toISOString(),
//     };

//     saveEmployees([...employees, newEmployee]);

//     alert(`Employee Created Successfully\nEmployee ID: ${newEmployee.id}`);

//     setEmployeeForm({
//       name: "",
//       mobile: "",
//       department: "",
//       designation: "",
//       salary: "",
//       joiningDate: getToday(),
//       password: "",
//     });

//     setShowEmployeeModal(false);
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "user",
//           width: 640,
//           height: 480,
//         },
//         audio: false,
//       });

//       setCameraStream(stream);
//     } catch (error) {
//       alert("Camera permission required.");
//     }
//   };

//   const stopCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//       setCameraStream(null);
//     }
//   };

//   const captureFace = () => {
//     const video = document.getElementById("employeeCamera");

//     if (!video || !video.videoWidth) {
//       alert("Camera is not ready.");
//       return;
//     }

//     const canvas = document.createElement("canvas");

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext("2d");

//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const image = canvas.toDataURL("image/jpeg", 0.8);

//     setFaceImage(image);

//     stopCamera();
//     setShowFaceModal(false);

//     alert("Face captured successfully.");
//   };

//   useEffect(() => {
//     if (showFaceModal) {
//       startCamera();
//     }

//     return () => {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showFaceModal]);

//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Location is not supported by this browser.");
//       return;
//     }

//     setLocationLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const data = {
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           capturedAt: new Date().toISOString(),
//         };

//         setLocation(data);
//         setLocationLoading(false);
//       },
//       () => {
//         setLocationLoading(false);
//         alert("Please allow location permission.");
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

//   const markAttendance = (type = "Present") => {
//     if (!loggedEmployee) return;

//     const today = getToday();

//     const alreadyMarked = attendance.some(
//       (item) =>
//         item.employeeId === loggedEmployee.id && item.date === today
//     );

//     if (alreadyMarked) {
//       alert("Today's attendance is already marked.");
//       return;
//     }

//     if (!faceImage && !loggedEmployee.faceImage) {
//       alert("Please capture your face first.");
//       return;
//     }

//     if (!location) {
//       alert("Please capture your current location first.");
//       return;
//     }

//     const record = {
//       id: Date.now(),
//       employeeId: loggedEmployee.id,
//       employeeName: loggedEmployee.name,
//       date: today,
//       time: getTime(),
//       type,
//       latitude: location.latitude,
//       longitude: location.longitude,
//       accuracy: location.accuracy,
//       faceCaptured: true,
//       locationCaptured: true,
//       mapsUrl: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
//       createdAt: new Date().toISOString(),
//     };

//     saveAttendance([...attendance, record]);

//     alert("Attendance marked successfully.");

//     setFaceImage("");
//     setLocation(null);
//   };

//   const updateEmployeeFace = () => {
//     if (!loggedEmployee || !faceImage) return;

//     const updatedEmployees = employees.map((employee) =>
//       employee.id === loggedEmployee.id
//         ? {
//             ...employee,
//             faceImage,
//           }
//         : employee
//     );

//     saveEmployees(updatedEmployees);

//     const updatedEmployee = updatedEmployees.find(
//       (employee) => employee.id === loggedEmployee.id
//     );

//     setLoggedEmployee(updatedEmployee);
//     setFaceImage("");
//   };

//   const deleteEmployee = (id) => {
//     if (!window.confirm("Delete this employee?")) return;

//     const updated = employees.filter((employee) => employee.id !== id);

//     saveEmployees(updated);

//     const updatedAttendance = attendance.filter(
//       (item) => item.employeeId !== id
//     );

//     saveAttendance(updatedAttendance);
//   };

//   const todayAttendance = useMemo(
//     () => attendance.filter((item) => item.date === getToday()),
//     [attendance]
//   );

//   const employeeHistory = useMemo(() => {
//     if (!loggedEmployee) return [];

//     return attendance
//       .filter((item) => item.employeeId === loggedEmployee.id)
//       .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
//   }, [attendance, loggedEmployee]);

//   const calculateSalary = (employee) => {
//     const currentDate = new Date();

//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const employeeRecords = attendance.filter(
//       (item) =>
//         item.employeeId === employee.id &&
//         new Date(item.date).getMonth() === month &&
//         new Date(item.date).getFullYear() === year
//     );

//     const presentDays = employeeRecords.filter(
//       (item) => item.type === "Present"
//     ).length;

//     const halfDays = employeeRecords.filter(
//       (item) => item.type === "Half Day"
//     ).length;

//     const absentDays = Math.max(
//       0,
//       daysInMonth - presentDays - halfDays
//     );

//     const freeLeaves = Math.min(absentDays, 2);

//     const deductedLeaves = Math.max(0, absentDays - 2);

//     const dailySalary = Number(employee.salary || 0) / daysInMonth;

//     const leaveDeduction = deductedLeaves * dailySalary * 0.5;

//     const halfDayDeduction = halfDays * dailySalary * 0.5;

//     const totalDeduction = leaveDeduction + halfDayDeduction;

//     const payableSalary = Math.max(
//       0,
//       Number(employee.salary || 0) - totalDeduction
//     );

//     return {
//       daysInMonth,
//       presentDays,
//       halfDays,
//       absentDays,
//       freeLeaves,
//       deductedLeaves,
//       dailySalary,
//       totalDeduction,
//       payableSalary,
//     };
//   };

//   if (!adminLoggedIn && !employeeLoggedIn) {
//     return (
//       <div className="attendance-page">
//         <div className="attendance-login-card">
//           <div className="attendance-logo">
//             P
//           </div>

//           <h1>Employee Attendance</h1>
//           <p>Secure Employee Attendance Portal</p>

//           <div className="login-tabs">
//             <button
//               className={mode === "employee" ? "active" : ""}
//               onClick={() => setMode("employee")}
//             >
//               Employee Login
//             </button>

//             <button
//               className={mode === "admin" ? "active" : ""}
//               onClick={() => setMode("admin")}
//             >
//               Admin Login
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder={
//               mode === "admin" ? "Admin ID" : "Employee ID"
//             }
//             value={loginId}
//             onChange={(e) => setLoginId(e.target.value)}
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={loginPassword}
//             onChange={(e) => setLoginPassword(e.target.value)}
//           />

//           <button
//             className="primary-btn login-btn"
//             onClick={
//               mode === "admin"
//                 ? handleAdminLogin
//                 : handleEmployeeLogin
//             }
//           >
//             Login
//           </button>

//           {mode === "admin" && (
//             <small className="login-hint">
//               Default Admin: admin / admin123
//             </small>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (employeeLoggedIn && loggedEmployee) {
//     const alreadyMarked = employeeHistory.some(
//       (item) => item.date === getToday()
//     );

//     const todayRecord = employeeHistory.find(
//       (item) => item.date === getToday()
//     );

//     return (
//       <div className="attendance-page">
//         <header className="attendance-header">
//           <div>
//             <h1>Employee Portal</h1>
//             <p>Welcome, {loggedEmployee.name}</p>
//           </div>

//           <button className="logout-btn" onClick={logout}>
//             Logout
//           </button>
//         </header>

//         <main className="employee-dashboard">
//           <div className="employee-welcome-card">
//             <div>
//               <span>Employee ID</span>
//               <strong>{loggedEmployee.id}</strong>
//             </div>

//             <div>
//               <span>Employee Name</span>
//               <strong>{loggedEmployee.name}</strong>
//             </div>

//             <div>
//               <span>Department</span>
//               <strong>
//                 {loggedEmployee.department || "—"}
//               </strong>
//             </div>

//             <div>
//               <span>Today</span>
//               <strong>{getToday()}</strong>
//             </div>
//           </div>

//           <section className="checkin-card">
//             <div className="section-heading">
//               <div>
//                 <h2>Today's Attendance</h2>
//                 <p>
//                   Capture your face and current location before
//                   marking attendance.
//                 </p>
//               </div>

//               <div className="today-status">
//                 {alreadyMarked ? "✓ Marked" : "Not Marked"}
//               </div>
//             </div>

//             {todayRecord ? (
//               <div className="attendance-success">
//                 <div className="success-icon">✓</div>

//                 <h2>Attendance Marked</h2>

//                 <p>
//                   {todayRecord.type} at {todayRecord.time}
//                 </p>

//                 <a
//                   href={todayRecord.mapsUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   📍 View Check-in Location
//                 </a>
//               </div>
//             ) : (
//               <>
//                 <div className="verification-grid">
//                   <div className="verification-box">
//                     <div className="verification-icon">📸</div>

//                     <h3>Face</h3>

//                     <p>
//                       {faceImage || loggedEmployee.faceImage
//                         ? "Face Captured"
//                         : "Face not captured"}
//                     </p>

//                     <button
//                       className="secondary-btn"
//                       onClick={() => setShowFaceModal(true)}
//                     >
//                       Capture Face
//                     </button>
//                   </div>

//                   <div className="verification-box">
//                     <div className="verification-icon">📍</div>

//                     <h3>Location</h3>

//                     <p>
//                       {location
//                         ? "Location Captured"
//                         : "Location not captured"}
//                     </p>

//                     <button
//                       className="secondary-btn"
//                       onClick={getLocation}
//                       disabled={locationLoading}
//                     >
//                       {locationLoading
//                         ? "Getting Location..."
//                         : "Capture Location"}
//                     </button>

//                     {location && (
//                       <a
//                         className="map-link"
//                         href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Open Google Maps
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 <div className="attendance-actions">
//                   <button
//                     className="primary-btn"
//                     onClick={() => markAttendance("Present")}
//                   >
//                     ✓ Mark Present
//                   </button>

//                   <button
//                     className="halfday-btn"
//                     onClick={() => markAttendance("Half Day")}
//                   >
//                     Mark Half Day
//                   </button>
//                 </div>
//               </>
//             )}
//           </section>

//           <section className="my-history-card">
//             <div className="section-heading">
//               <div>
//                 <h2>My Attendance</h2>
//                 <p>Only your attendance history is visible here.</p>
//               </div>
//             </div>

//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th>Location</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {employeeHistory.length === 0 ? (
//                     <tr>
//                       <td colSpan="4" className="empty-cell">
//                         No attendance records found.
//                       </td>
//                     </tr>
//                   ) : (
//                     employeeHistory.map((record) => (
//                       <tr key={record.id}>
//                         <td>{record.date}</td>
//                         <td>{record.time}</td>

//                         <td>
//                           <span
//                             className={`status ${
//                               record.type === "Present"
//                                 ? "present"
//                                 : "halfday"
//                             }`}
//                           >
//                             {record.type}
//                           </span>
//                         </td>

//                         <td>
//                           <a
//                             href={record.mapsUrl}
//                             target="_blank"
//                             rel="noreferrer"
//                           >
//                             View Map
//                           </a>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </main>

//         {showFaceModal && (
//           <div className="modal-overlay">
//             <div className="camera-modal">
//               <button
//                 className="modal-close"
//                 onClick={() => {
//                   stopCamera();
//                   setShowFaceModal(false);
//                 }}
//               >
//                 ×
//               </button>

//               <h2>Face Capture</h2>

//               <video
//                 id="employeeCamera"
//                 autoPlay
//                 playsInline
//                 muted
//                 ref={(video) => {
//                   if (video && cameraStream) {
//                     video.srcObject = cameraStream;
//                   }
//                 }}
//               />

//               <button
//                 className="primary-btn"
//                 onClick={captureFace}
//               >
//                 Capture Face
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="attendance-page">
//       <header className="attendance-header">
//         <div>
//           <h1>Admin Attendance Dashboard</h1>
//           <p>Employee Attendance & Salary Management</p>
//         </div>

//         <button className="logout-btn" onClick={logout}>
//           Logout
//         </button>
//       </header>

//       <main className="admin-dashboard">
//         <div className="admin-actions">
//           <button
//             className="primary-btn"
//             onClick={() => setShowEmployeeModal(true)}
//           >
//             + Create Employee
//           </button>
//         </div>

//         <div className="summary-grid">
//           <div className="summary-card">
//             <span>Total Employees</span>
//             <strong>{employees.length}</strong>
//           </div>

//           <div className="summary-card">
//             <span>Today's Present</span>
//             <strong>
//               {
//                 todayAttendance.filter(
//                   (item) => item.type === "Present"
//                 ).length
//               }
//             </strong>
//           </div>

//           <div className="summary-card">
//             <span>Today's Half Day</span>
//             <strong>
//               {
//                 todayAttendance.filter(
//                   (item) => item.type === "Half Day"
//                 ).length
//               }
//             </strong>
//           </div>

//           <div className="summary-card">
//             <span>Today's Attendance</span>
//             <strong>{todayAttendance.length}</strong>
//           </div>
//         </div>

//         <section className="admin-card">
//           <div className="section-heading">
//             <div>
//               <h2>Employees</h2>
//               <p>Employee master records</p>
//             </div>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Employee ID</th>
//                   <th>Name</th>
//                   <th>Mobile</th>
//                   <th>Department</th>
//                   <th>Designation</th>
//                   <th>Salary</th>
//                   <th>Face</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {employees.length === 0 ? (
//                   <tr>
//                     <td colSpan="8" className="empty-cell">
//                       No employees created.
//                     </td>
//                   </tr>
//                 ) : (
//                   employees.map((employee) => (
//                     <tr key={employee.id}>
//                       <td>
//                         <strong>{employee.id}</strong>
//                       </td>

//                       <td>{employee.name}</td>

//                       <td>{employee.mobile}</td>

//                       <td>{employee.department || "—"}</td>

//                       <td>{employee.designation || "—"}</td>

//                       <td>
//                         ₹
//                         {Number(
//                           employee.salary || 0
//                         ).toLocaleString("en-IN")}
//                       </td>

//                       <td>
//                         {employee.faceImage ? (
//                           <span className="verified">
//                             ✓ Registered
//                           </span>
//                         ) : (
//                           <span className="not-verified">
//                             Not Registered
//                           </span>
//                         )}
//                       </td>

//                       <td>
//                         <button
//                           className="delete-btn"
//                           onClick={() =>
//                             deleteEmployee(employee.id)
//                           }
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <section className="admin-card">
//           <div className="section-heading">
//             <div>
//               <h2>Today's Attendance</h2>
//               <p>Live attendance records</p>
//             </div>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Employee ID</th>
//                   <th>Employee</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                   <th>Status</th>
//                   <th>Face</th>
//                   <th>Location</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {todayAttendance.length === 0 ? (
//                   <tr>
//                     <td colSpan="7" className="empty-cell">
//                       No attendance marked today.
//                     </td>
//                   </tr>
//                 ) : (
//                   todayAttendance.map((record) => (
//                     <tr key={record.id}>
//                       <td>{record.employeeId}</td>
//                       <td>{record.employeeName}</td>
//                       <td>{record.date}</td>
//                       <td>{record.time}</td>

//                       <td>
//                         <span
//                           className={`status ${
//                             record.type === "Present"
//                               ? "present"
//                               : "halfday"
//                           }`}
//                         >
//                           {record.type}
//                         </span>
//                       </td>

//                       <td>
//                         <span className="verified">
//                           ✓ Captured
//                         </span>
//                       </td>

//                       <td>
//                         <a
//                           href={record.mapsUrl}
//                           target="_blank"
//                           rel="noreferrer"
//                         >
//                           📍 View Map
//                         </a>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <section className="admin-card">
//           <div className="section-heading">
//             <div>
//               <h2>Salary Calculation</h2>
//               <p>
//                 First 2 leave days are free. From 3rd leave,
//                 half-day salary deduction applies.
//               </p>
//             </div>
//           </div>

//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Employee</th>
//                   <th>Monthly Salary</th>
//                   <th>Present</th>
//                   <th>Half Day</th>
//                   <th>Absent</th>
//                   <th>Free Leave</th>
//                   <th>Deducted Leave</th>
//                   <th>Total Deduction</th>
//                   <th>Payable Salary</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {employees.map((employee) => {
//                   const salary = calculateSalary(employee);

//                   return (
//                     <tr key={employee.id}>
//                       <td>
//                         <strong>{employee.name}</strong>
//                         <br />
//                         <small>{employee.id}</small>
//                       </td>

//                       <td>
//                         ₹
//                         {Number(
//                           employee.salary || 0
//                         ).toLocaleString("en-IN")}
//                       </td>

//                       <td>{salary.presentDays}</td>

//                       <td>{salary.halfDays}</td>

//                       <td>{salary.absentDays}</td>

//                       <td>{salary.freeLeaves}</td>

//                       <td>{salary.deductedLeaves}</td>

//                       <td>
//                         ₹
//                         {salary.totalDeduction.toLocaleString(
//                           "en-IN",
//                           {
//                             maximumFractionDigits: 2,
//                           }
//                         )}
//                       </td>

//                       <td>
//                         <strong>
//                           ₹
//                           {salary.payableSalary.toLocaleString(
//                             "en-IN",
//                             {
//                               maximumFractionDigits: 2,
//                             }
//                           )}
//                         </strong>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <section className="terms-card">
//           <h2>Terms & Conditions</h2>

//           <ul>
//             <li>
//               Employee must mark attendance through the Employee
//               Portal.
//             </li>

//             <li>
//               Face capture is required before attendance.
//             </li>

//             <li>
//               Current location is captured during attendance.
//             </li>

//             <li>
//               First 2 leave days in a month have no salary
//               deduction.
//             </li>

//             <li>
//               From the 3rd leave day, half-day salary deduction
//               applies for each additional leave day.
//             </li>

//             <li>
//               Every Half Day attendance carries a half-day salary
//               deduction.
//             </li>
//           </ul>
//         </section>
//       </main>

//       {showEmployeeModal && (
//         <div className="modal-overlay">
//           <div className="form-modal">
//             <button
//               className="modal-close"
//               onClick={() => setShowEmployeeModal(false)}
//             >
//               ×
//             </button>

//             <h2>Create Employee</h2>

//             <form onSubmit={createEmployee}>
//               <div className="form-grid">
//                 <div>
//                   <label>Employee Name *</label>
//                   <input
//                     name="name"
//                     value={employeeForm.name}
//                     onChange={handleEmployeeForm}
//                     placeholder="Enter employee name"
//                   />
//                 </div>

//                 <div>
//                   <label>Mobile Number *</label>
//                   <input
//                     name="mobile"
//                     value={employeeForm.mobile}
//                     onChange={handleEmployeeForm}
//                     placeholder="Enter mobile number"
//                   />
//                 </div>

//                 <div>
//                   <label>Department</label>
//                   <input
//                     name="department"
//                     value={employeeForm.department}
//                     onChange={handleEmployeeForm}
//                     placeholder="e.g. Physiotherapy"
//                   />
//                 </div>

//                 <div>
//                   <label>Designation</label>
//                   <input
//                     name="designation"
//                     value={employeeForm.designation}
//                     onChange={handleEmployeeForm}
//                     placeholder="e.g. Therapist"
//                   />
//                 </div>

//                 <div>
//                   <label>Monthly Salary *</label>
//                   <input
//                     type="number"
//                     name="salary"
//                     value={employeeForm.salary}
//                     onChange={handleEmployeeForm}
//                     placeholder="Enter salary"
//                   />
//                 </div>

//                 <div>
//                   <label>Joining Date</label>
//                   <input
//                     type="date"
//                     name="joiningDate"
//                     value={employeeForm.joiningDate}
//                     onChange={handleEmployeeForm}
//                   />
//                 </div>

//                 <div className="full-width">
//                   <label>Employee Login Password *</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={employeeForm.password}
//                     onChange={handleEmployeeForm}
//                     placeholder="Create employee password"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="primary-btn full-submit"
//               >
//                 Create Employee
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default EmployeeAttendance;






// import React, { useEffect, useMemo, useState } from "react";
// import "./EmployeeAttendance.css";

// const EMPLOYEE_KEY = "clinic_employees";
// const ATTENDANCE_KEY = "clinic_employee_attendance";

// const getToday = () => new Date().toISOString().split("T")[0];

// const getTime = () =>
//   new Date().toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// function EmployeeAttendance() {
//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState([]);

//   const [mode, setMode] = useState("employee");
//   const [adminLoggedIn, setAdminLoggedIn] = useState(false);
//   const [employeeLoggedIn, setEmployeeLoggedIn] = useState(false);
//   const [loggedEmployee, setLoggedEmployee] = useState(null);

//   const [loginId, setLoginId] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");

//   const [adminTab, setAdminTab] = useState("dashboard");

//   const [searchDate, setSearchDate] = useState(getToday());
//   const [searchEmployee, setSearchEmployee] = useState("");

//   const [showEmployeeModal, setShowEmployeeModal] = useState(false);
//   const [showFaceModal, setShowFaceModal] = useState(false);

//   const [cameraStream, setCameraStream] = useState(null);
//   const [faceImage, setFaceImage] = useState("");

//   const [location, setLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);

//   const [employeeForm, setEmployeeForm] = useState({
//     name: "",
//     mobile: "",
//     department: "",
//     designation: "",
//     salary: "",
//     joiningDate: getToday(),
//     password: "",
//   });

//   useEffect(() => {
//     setEmployees(
//       JSON.parse(localStorage.getItem(EMPLOYEE_KEY) || "[]")
//     );

//     setAttendance(
//       JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || "[]")
//     );
//   }, []);

//   const saveEmployees = (data) => {
//     setEmployees(data);
//     localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data));
//   };

//   const saveAttendance = (data) => {
//     setAttendance(data);
//     localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
//   };

//   const generateEmployeeId = () => {
//     const numbers = employees
//       .map((employee) => {
//         const match = String(employee.id).match(/EMP-(\d+)/);
//         return match ? Number(match[1]) : 0;
//       })
//       .filter(Boolean);

//     const next = numbers.length ? Math.max(...numbers) + 1 : 1;

//     return `EMP-${String(next).padStart(4, "0")}`;
//   };

//   const handleAdminLogin = () => {
//     if (loginId === "admin" && loginPassword === "admin123") {
//       setAdminLoggedIn(true);
//       setLoginId("");
//       setLoginPassword("");
//     } else {
//       alert("Invalid Admin ID or Password");
//     }
//   };

//   const handleEmployeeLogin = () => {
//     const employee = employees.find(
//       (item) =>
//         String(item.id).toLowerCase() ===
//           loginId.trim().toLowerCase() &&
//         String(item.password) === loginPassword
//     );

//     if (!employee) {
//       alert("Invalid Employee ID or Password");
//       return;
//     }

//     setLoggedEmployee(employee);
//     setEmployeeLoggedIn(true);
//     setLoginId("");
//     setLoginPassword("");
//   };

//   const logout = () => {
//     setAdminLoggedIn(false);
//     setEmployeeLoggedIn(false);
//     setLoggedEmployee(null);
//     setMode("employee");
//     setAdminTab("dashboard");
//   };

//   const handleEmployeeForm = (e) => {
//     setEmployeeForm({
//       ...employeeForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const createEmployee = (e) => {
//     e.preventDefault();

//     if (
//       !employeeForm.name ||
//       !employeeForm.mobile ||
//       !employeeForm.salary ||
//       !employeeForm.password
//     ) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     const newEmployee = {
//       ...employeeForm,
//       id: generateEmployeeId(),
//       salary: Number(employeeForm.salary),
//       faceImage: "",
//       createdAt: new Date().toISOString(),
//     };

//     saveEmployees([...employees, newEmployee]);

//     alert(
//       `Employee Created Successfully!\nEmployee ID: ${newEmployee.id}`
//     );

//     setEmployeeForm({
//       name: "",
//       mobile: "",
//       department: "",
//       designation: "",
//       salary: "",
//       joiningDate: getToday(),
//       password: "",
//     });

//     setShowEmployeeModal(false);
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           facingMode: "user",
//           width: 640,
//           height: 480,
//         },
//         audio: false,
//       });

//       setCameraStream(stream);
//     } catch (error) {
//       alert("Camera permission required.");
//     }
//   };

//   const stopCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//       setCameraStream(null);
//     }
//   };

//   const captureFace = () => {
//     const video = document.getElementById("employeeCamera");

//     if (!video || !video.videoWidth) {
//       alert("Camera is not ready.");
//       return;
//     }

//     const canvas = document.createElement("canvas");

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const context = canvas.getContext("2d");

//     context.drawImage(
//       video,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//     const image = canvas.toDataURL("image/jpeg", 0.8);

//     setFaceImage(image);

//     stopCamera();
//     setShowFaceModal(false);

//     alert("Face captured successfully.");
//   };

//   useEffect(() => {
//     if (showFaceModal) {
//       startCamera();
//     }

//     return () => {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [showFaceModal]);

//   const getLocation = () => {
//     if (!navigator.geolocation) {
//       alert("Location is not supported by this browser.");
//       return;
//     }

//     setLocationLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocation({
//           latitude: position.coords.latitude,
//           longitude: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           capturedAt: new Date().toISOString(),
//         });

//         setLocationLoading(false);
//       },
//       () => {
//         setLocationLoading(false);
//         alert("Please allow location permission.");
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

//   const markAttendance = (type = "Present") => {
//     if (!loggedEmployee) return;

//     const today = getToday();

//     const alreadyMarked = attendance.some(
//       (item) =>
//         item.employeeId === loggedEmployee.id &&
//         item.date === today
//     );

//     if (alreadyMarked) {
//       alert("Today's attendance is already marked.");
//       return;
//     }

//     if (!faceImage && !loggedEmployee.faceImage) {
//       alert("Please capture your face first.");
//       return;
//     }

//     if (!location) {
//       alert("Please capture your current location first.");
//       return;
//     }

//     const record = {
//       id: Date.now(),
//       employeeId: loggedEmployee.id,
//       employeeName: loggedEmployee.name,
//       date: today,
//       time: getTime(),
//       type,
//       latitude: location.latitude,
//       longitude: location.longitude,
//       accuracy: location.accuracy,
//       faceCaptured: true,
//       locationCaptured: true,
//       mapsUrl: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
//       createdAt: new Date().toISOString(),
//     };

//     saveAttendance([...attendance, record]);

//     alert("Attendance marked successfully.");

//     setFaceImage("");
//     setLocation(null);
//   };

//   const updateEmployeeFace = () => {
//     if (!loggedEmployee || !faceImage) return;

//     const updatedEmployees = employees.map((employee) =>
//       employee.id === loggedEmployee.id
//         ? { ...employee, faceImage }
//         : employee
//     );

//     saveEmployees(updatedEmployees);

//     const updatedEmployee = updatedEmployees.find(
//       (employee) => employee.id === loggedEmployee.id
//     );

//     setLoggedEmployee(updatedEmployee);
//     setFaceImage("");

//     alert("Face registered successfully.");
//   };

//   const deleteEmployee = (id) => {
//     if (!window.confirm("Delete this employee?")) return;

//     saveEmployees(
//       employees.filter((employee) => employee.id !== id)
//     );

//     saveAttendance(
//       attendance.filter((item) => item.employeeId !== id)
//     );
//   };

//   const todayAttendance = useMemo(
//     () =>
//       attendance.filter(
//         (item) => item.date === getToday()
//       ),
//     [attendance]
//   );

//   const filteredDateAttendance = useMemo(() => {
//     let result = attendance.filter(
//       (item) => item.date === searchDate
//     );

//     if (searchEmployee.trim()) {
//       const search = searchEmployee.trim().toLowerCase();

//       result = result.filter(
//         (item) =>
//           String(item.employeeName)
//             .toLowerCase()
//             .includes(search) ||
//           String(item.employeeId)
//             .toLowerCase()
//             .includes(search)
//       );
//     }

//     return result;
//   }, [attendance, searchDate, searchEmployee]);

//   const selectedEmployee = searchEmployee
//     ? employees.find(
//         (employee) =>
//           employee.name
//             .toLowerCase()
//             .includes(searchEmployee.toLowerCase()) ||
//           employee.id
//             .toLowerCase()
//             .includes(searchEmployee.toLowerCase())
//       )
//     : null;

//   const selectedEmployeeHistory = selectedEmployee
//     ? attendance
//         .filter(
//           (item) =>
//             item.employeeId === selectedEmployee.id
//         )
//         .sort((a, b) =>
//           `${b.date}${b.time}`.localeCompare(
//             `${a.date}${a.time}`
//           )
//         )
//     : [];

//   const calculateEmployeeDayStatus = (employee, date) => {
//     const record = attendance.find(
//       (item) =>
//         item.employeeId === employee.id &&
//         item.date === date
//     );

//     if (!record) {
//       return {
//         status: "Absent / Not Marked",
//         type: "Absent",
//         record: null,
//       };
//     }

//     return {
//       status: record.type,
//       type: record.type,
//       record,
//     };
//   };

//   const getMonthDates = () => {
//     const selected = new Date(`${searchDate}T00:00:00`);
//     const year = selected.getFullYear();
//     const month = selected.getMonth();
//     const totalDays = new Date(
//       year,
//       month + 1,
//       0
//     ).getDate();

//     return Array.from({ length: totalDays }, (_, index) => {
//       const day = index + 1;

//       return `${year}-${String(month + 1).padStart(
//         2,
//         "0"
//       )}-${String(day).padStart(2, "0")}`;
//     });
//   };

//   const employeeMonthlyHistory = selectedEmployee
//     ? getMonthDates().map((date) => ({
//         date,
//         ...calculateEmployeeDayStatus(
//           selectedEmployee,
//           date
//         ),
//       }))
//     : [];

//   const calculateSalary = (employee) => {
//     const currentDate = new Date();

//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     const daysInMonth = new Date(
//       year,
//       month + 1,
//       0
//     ).getDate();

//     const employeeRecords = attendance.filter(
//       (item) => {
//         const itemDate = new Date(
//           `${item.date}T00:00:00`
//         );

//         return (
//           item.employeeId === employee.id &&
//           itemDate.getMonth() === month &&
//           itemDate.getFullYear() === year
//         );
//       }
//     );

//     const presentDays = employeeRecords.filter(
//       (item) => item.type === "Present"
//     ).length;

//     const halfDays = employeeRecords.filter(
//       (item) => item.type === "Half Day"
//     ).length;

//     const absentDays = Math.max(
//       0,
//       daysInMonth - presentDays - halfDays
//     );

//     const freeLeaves = Math.min(absentDays, 2);

//     const deductedLeaves = Math.max(
//       0,
//       absentDays - 2
//     );

//     const dailySalary =
//       Number(employee.salary || 0) / daysInMonth;

//     const leaveDeduction =
//       deductedLeaves * dailySalary * 0.5;

//     const halfDayDeduction =
//       halfDays * dailySalary * 0.5;

//     const totalDeduction =
//       leaveDeduction + halfDayDeduction;

//     const payableSalary = Math.max(
//       0,
//       Number(employee.salary || 0) -
//         totalDeduction
//     );

//     return {
//       daysInMonth,
//       presentDays,
//       halfDays,
//       absentDays,
//       freeLeaves,
//       deductedLeaves,
//       dailySalary,
//       totalDeduction,
//       payableSalary,
//     };
//   };

//   if (!adminLoggedIn && !employeeLoggedIn) {
//     return (
//       <div className="attendance-page">
//         <div className="attendance-login-card">
//           <div className="attendance-logo">P</div>

//           <h1>Employee Attendance</h1>
//           <p>Secure Employee Attendance Portal</p>

//           <div className="login-tabs">
//             <button
//               className={
//                 mode === "employee" ? "active" : ""
//               }
//               onClick={() => setMode("employee")}
//             >
//               Employee Login
//             </button>

//             <button
//               className={
//                 mode === "admin" ? "active" : ""
//               }
//               onClick={() => setMode("admin")}
//             >
//               Admin Login
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder={
//               mode === "admin"
//                 ? "Admin ID"
//                 : "Employee ID"
//             }
//             value={loginId}
//             onChange={(e) =>
//               setLoginId(e.target.value)
//             }
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={loginPassword}
//             onChange={(e) =>
//               setLoginPassword(e.target.value)
//             }
//           />

//           <button
//             className="primary-btn login-btn"
//             onClick={
//               mode === "admin"
//                 ? handleAdminLogin
//                 : handleEmployeeLogin
//             }
//           >
//             Login
//           </button>

//           {mode === "admin" && (
//             <small className="login-hint">
//               Default Admin: admin / admin123
//             </small>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (employeeLoggedIn && loggedEmployee) {
//     const todayRecord = attendance.find(
//       (item) =>
//         item.employeeId === loggedEmployee.id &&
//         item.date === getToday()
//     );

//     return (
//       <div className="attendance-page">
//         <header className="attendance-header">
//           <div>
//             <h1>Employee Portal</h1>
//             <p>
//               Welcome, {loggedEmployee.name}
//             </p>
//           </div>

//           <button
//             className="logout-btn"
//             onClick={logout}
//           >
//             Logout
//           </button>
//         </header>

//         <main className="employee-dashboard">
//           <div className="employee-welcome-card">
//             <div>
//               <span>Employee ID</span>
//               <strong>{loggedEmployee.id}</strong>
//             </div>

//             <div>
//               <span>Employee Name</span>
//               <strong>{loggedEmployee.name}</strong>
//             </div>

//             <div>
//               <span>Department</span>
//               <strong>
//                 {loggedEmployee.department || "—"}
//               </strong>
//             </div>

//             <div>
//               <span>Today</span>
//               <strong>{getToday()}</strong>
//             </div>
//           </div>

//           <section className="checkin-card">
//             <div className="section-heading">
//               <div>
//                 <h2>Today's Attendance</h2>
//                 <p>
//                   Face + current location required.
//                 </p>
//               </div>

//               <div className="today-status">
//                 {todayRecord
//                   ? "✓ Marked"
//                   : "Not Marked"}
//               </div>
//             </div>

//             {todayRecord ? (
//               <div className="attendance-success">
//                 <div className="success-icon">
//                   ✓
//                 </div>

//                 <h2>Attendance Marked</h2>

//                 <p>
//                   {todayRecord.type} at{" "}
//                   {todayRecord.time}
//                 </p>

//                 <a
//                   href={todayRecord.mapsUrl}
//                   target="_blank"
//                   rel="noreferrer"
//                 >
//                   📍 View Check-in Location
//                 </a>
//               </div>
//             ) : (
//               <>
//                 <div className="verification-grid">
//                   <div className="verification-box">
//                     <div className="verification-icon">
//                       📸
//                     </div>

//                     <h3>Face</h3>

//                     <p>
//                       {faceImage ||
//                       loggedEmployee.faceImage
//                         ? "Face Captured"
//                         : "Face not captured"}
//                     </p>

//                     <button
//                       className="secondary-btn"
//                       onClick={() =>
//                         setShowFaceModal(true)
//                       }
//                     >
//                       Capture Face
//                     </button>

//                     {faceImage && (
//                       <button
//                         className="secondary-btn face-save-btn"
//                         onClick={updateEmployeeFace}
//                       >
//                         Save Face
//                       </button>
//                     )}
//                   </div>

//                   <div className="verification-box">
//                     <div className="verification-icon">
//                       📍
//                     </div>

//                     <h3>Location</h3>

//                     <p>
//                       {location
//                         ? "Location Captured"
//                         : "Location not captured"}
//                     </p>

//                     <button
//                       className="secondary-btn"
//                       onClick={getLocation}
//                       disabled={locationLoading}
//                     >
//                       {locationLoading
//                         ? "Getting Location..."
//                         : "Capture Location"}
//                     </button>

//                     {location && (
//                       <a
//                         className="map-link"
//                         href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
//                         target="_blank"
//                         rel="noreferrer"
//                       >
//                         Open Google Maps
//                       </a>
//                     )}
//                   </div>
//                 </div>

//                 <div className="attendance-actions">
//                   <button
//                     className="primary-btn"
//                     onClick={() =>
//                       markAttendance("Present")
//                     }
//                   >
//                     ✓ Mark Present
//                   </button>

//                   <button
//                     className="halfday-btn"
//                     onClick={() =>
//                       markAttendance("Half Day")
//                     }
//                   >
//                     Mark Half Day
//                   </button>
//                 </div>
//               </>
//             )}
//           </section>

//           <section className="my-history-card">
//             <div className="section-heading">
//               <div>
//                 <h2>My Attendance</h2>
//                 <p>
//                   Only your attendance is visible.
//                 </p>
//               </div>
//             </div>

//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Time</th>
//                     <th>Status</th>
//                     <th>Location</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {attendance
//                     .filter(
//                       (item) =>
//                         item.employeeId ===
//                         loggedEmployee.id
//                     )
//                     .sort((a, b) =>
//                       `${b.date}${b.time}`.localeCompare(
//                         `${a.date}${a.time}`
//                       )
//                     )
//                     .map((record) => (
//                       <tr key={record.id}>
//                         <td>{record.date}</td>
//                         <td>{record.time}</td>

//                         <td>
//                           <span
//                             className={`status ${
//                               record.type ===
//                               "Present"
//                                 ? "present"
//                                 : "halfday"
//                             }`}
//                           >
//                             {record.type}
//                           </span>
//                         </td>

//                         <td>
//                           <a
//                             href={
//                               record.mapsUrl
//                             }
//                             target="_blank"
//                             rel="noreferrer"
//                           >
//                             View Map
//                           </a>
//                         </td>
//                       </tr>
//                     ))}

//                   {attendance.filter(
//                     (item) =>
//                       item.employeeId ===
//                       loggedEmployee.id
//                   ).length === 0 && (
//                     <tr>
//                       <td
//                         colSpan="4"
//                         className="empty-cell"
//                       >
//                         No attendance records found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </main>

//         {showFaceModal && (
//           <div className="modal-overlay">
//             <div className="camera-modal">
//               <button
//                 className="modal-close"
//                 onClick={() => {
//                   stopCamera();
//                   setShowFaceModal(false);
//                 }}
//               >
//                 ×
//               </button>

//               <h2>Face Capture</h2>

//               <video
//                 id="employeeCamera"
//                 autoPlay
//                 playsInline
//                 muted
//                 ref={(video) => {
//                   if (video && cameraStream) {
//                     video.srcObject =
//                       cameraStream;
//                   }
//                 }}
//               />

//               <button
//                 className="primary-btn"
//                 onClick={captureFace}
//               >
//                 Capture Face
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="attendance-page">
//       <header className="attendance-header">
//         <div>
//           <h1>Admin Attendance Dashboard</h1>
//           <p>
//             Employee Attendance & Salary Management
//           </p>
//         </div>

//         <button
//           className="logout-btn"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </header>

//       <div className="admin-tabs">
//         <button
//           className={
//             adminTab === "dashboard"
//               ? "active"
//               : ""
//           }
//           onClick={() => setAdminTab("dashboard")}
//         >
//           Dashboard
//         </button>

//         <button
//           className={
//             adminTab === "attendance"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setAdminTab("attendance")
//           }
//         >
//           Date-wise Attendance
//         </button>

//         <button
//           className={
//             adminTab === "employees"
//               ? "active"
//               : ""
//           }
//           onClick={() =>
//             setAdminTab("employees")
//           }
//         >
//           Employees
//         </button>

//         <button
//           className={
//             adminTab === "salary"
//               ? "active"
//               : ""
//           }
//           onClick={() => setAdminTab("salary")}
//         >
//           Salary
//         </button>
//       </div>

//       <main className="admin-dashboard">
//         {adminTab === "dashboard" && (
//           <>
//             <div className="admin-actions">
//               <button
//                 className="primary-btn"
//                 onClick={() =>
//                   setShowEmployeeModal(true)
//                 }
//               >
//                 + Create Employee
//               </button>
//             </div>

//             <div className="summary-grid">
//               <div className="summary-card">
//                 <span>Total Employees</span>
//                 <strong>
//                   {employees.length}
//                 </strong>
//               </div>

//               <div className="summary-card">
//                 <span>Today's Present</span>
//                 <strong>
//                   {
//                     todayAttendance.filter(
//                       (item) =>
//                         item.type === "Present"
//                     ).length
//                   }
//                 </strong>
//               </div>

//               <div className="summary-card">
//                 <span>Today's Half Day</span>
//                 <strong>
//                   {
//                     todayAttendance.filter(
//                       (item) =>
//                         item.type === "Half Day"
//                     ).length
//                   }
//                 </strong>
//               </div>

//               <div className="summary-card">
//                 <span>Today's Attendance</span>
//                 <strong>
//                   {todayAttendance.length}
//                 </strong>
//               </div>
//             </div>

//             <section className="admin-card">
//               <div className="section-heading">
//                 <div>
//                   <h2>Today's Attendance</h2>
//                   <p>
//                     Employee location and check-in
//                     details.
//                   </p>
//                 </div>
//               </div>

//               <div className="table-wrapper">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Employee ID</th>
//                       <th>Employee</th>
//                       <th>Date</th>
//                       <th>Time</th>
//                       <th>Status</th>
//                       <th>Face</th>
//                       <th>Location</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {todayAttendance.length ===
//                     0 ? (
//                       <tr>
//                         <td
//                           colSpan="7"
//                           className="empty-cell"
//                         >
//                           No attendance marked
//                           today.
//                         </td>
//                       </tr>
//                     ) : (
//                       todayAttendance.map(
//                         (record) => (
//                           <tr
//                             key={record.id}
//                           >
//                             <td>
//                               {record.employeeId}
//                             </td>

//                             <td>
//                               {
//                                 record.employeeName
//                               }
//                             </td>

//                             <td>
//                               {record.date}
//                             </td>

//                             <td>
//                               {record.time}
//                             </td>

//                             <td>
//                               <span
//                                 className={`status ${
//                                   record.type ===
//                                   "Present"
//                                     ? "present"
//                                     : "halfday"
//                                 }`}
//                               >
//                                 {record.type}
//                               </span>
//                             </td>

//                             <td>
//                               <span className="verified">
//                                 ✓ Captured
//                               </span>
//                             </td>

//                             <td>
//                               <a
//                                 href={
//                                   record.mapsUrl
//                                 }
//                                 target="_blank"
//                                 rel="noreferrer"
//                               >
//                                 📍 View Location
//                               </a>
//                             </td>
//                           </tr>
//                         )
//                       )
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>
//           </>
//         )}

//         {adminTab === "attendance" && (
//           <>
//             <section className="admin-card">
//               <div className="section-heading">
//                 <div>
//                   <h2>Date-wise Attendance</h2>
//                   <p>
//                     Select a date to see who was
//                     present.
//                   </p>
//                 </div>
//               </div>

//               <div className="attendance-filter">
//                 <div>
//                   <label>Select Date</label>

//                   <input
//                     type="date"
//                     value={searchDate}
//                     onChange={(e) =>
//                       setSearchDate(
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>

//                 <div>
//                   <label>
//                     Search Employee
//                   </label>

//                   <input
//                     type="text"
//                     placeholder="Name or Employee ID"
//                     value={searchEmployee}
//                     onChange={(e) =>
//                       setSearchEmployee(
//                         e.target.value
//                       )
//                     }
//                   />
//                 </div>

//                 <button
//                   className="secondary-btn clear-btn"
//                   onClick={() => {
//                     setSearchDate(getToday());
//                     setSearchEmployee("");
//                   }}
//                 >
//                   Clear
//                 </button>
//               </div>

//               <div className="filter-result-box">
//                 <strong>
//                   {filteredDateAttendance.length}
//                 </strong>

//                 <span>
//                   attendance record(s) on{" "}
//                   {searchDate}
//                 </span>
//               </div>

//               <div className="table-wrapper">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Employee ID</th>
//                       <th>Employee</th>
//                       <th>Date</th>
//                       <th>Time</th>
//                       <th>Status</th>
//                       <th>Face</th>
//                       <th>Location</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {filteredDateAttendance.length ===
//                     0 ? (
//                       <tr>
//                         <td
//                           colSpan="7"
//                           className="empty-cell"
//                         >
//                           No attendance record found
//                           for this date.
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredDateAttendance.map(
//                         (record) => (
//                           <tr
//                             key={record.id}
//                           >
//                             <td>
//                               {record.employeeId}
//                             </td>

//                             <td>
//                               {
//                                 record.employeeName
//                               }
//                             </td>

//                             <td>
//                               {record.date}
//                             </td>

//                             <td>
//                               {record.time}
//                             </td>

//                             <td>
//                               <span
//                                 className={`status ${
//                                   record.type ===
//                                   "Present"
//                                     ? "present"
//                                     : "halfday"
//                                 }`}
//                               >
//                                 {record.type}
//                               </span>
//                             </td>

//                             <td>
//                               <span className="verified">
//                                 ✓ Captured
//                               </span>
//                             </td>

//                             <td>
//                               <a
//                                 href={
//                                   record.mapsUrl
//                                 }
//                                 target="_blank"
//                                 rel="noreferrer"
//                               >
//                                 📍 View Map
//                               </a>
//                             </td>
//                           </tr>
//                         )
//                       )
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </section>

//             <section className="admin-card">
//               <div className="section-heading">
//                 <div>
//                   <h2>Employee Attendance Search</h2>
//                   <p>
//                     Search by name to see present,
//                     half-day and absent days.
//                   </p>
//                 </div>
//               </div>

//               {selectedEmployee ? (
//                 <>
//                   <div className="employee-search-summary">
//                     <div>
//                       <span>Employee</span>
//                       <strong>
//                         {selectedEmployee.name}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Employee ID</span>
//                       <strong>
//                         {selectedEmployee.id}
//                       </strong>
//                     </div>

//                     <div>
//                       <span>Monthly Records</span>
//                       <strong>
//                         {selectedEmployeeHistory.length}
//                       </strong>
//                     </div>
//                   </div>

//                   <div className="table-wrapper">
//                     <table>
//                       <thead>
//                         <tr>
//                           <th>Date</th>
//                           <th>Status</th>
//                           <th>Time</th>
//                           <th>Location</th>
//                         </tr>
//                       </thead>

//                       <tbody>
//                         {employeeMonthlyHistory.map(
//                           (day) => (
//                             <tr key={day.date}>
//                               <td>{day.date}</td>

//                               <td>
//                                 <span
//                                   className={`status ${
//                                     day.type ===
//                                     "Present"
//                                       ? "present"
//                                       : day.type ===
//                                         "Half Day"
//                                       ? "halfday"
//                                       : "absent"
//                                   }`}
//                                 >
//                                   {day.status}
//                                 </span>
//                               </td>

//                               <td>
//                                 {day.record
//                                   ? day.record.time
//                                   : "—"}
//                               </td>

//                               <td>
//                                 {day.record ? (
//                                   <a
//                                     href={
//                                       day.record
//                                         .mapsUrl
//                                     }
//                                     target="_blank"
//                                     rel="noreferrer"
//                                   >
//                                     📍 View Map
//                                   </a>
//                                 ) : (
//                                   "—"
//                                 )}
//                               </td>
//                             </tr>
//                           )
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </>
//               ) : (
//                 <div className="empty-state">
//                   Enter an employee name or ID above
//                   to see their complete attendance
//                   calendar.
//                 </div>
//               )}
//             </section>
//           </>
//         )}

//         {adminTab === "employees" && (
//           <section className="admin-card">
//             <div className="admin-actions">
//               <button
//                 className="primary-btn"
//                 onClick={() =>
//                   setShowEmployeeModal(true)
//                 }
//               >
//                 + Create Employee
//               </button>
//             </div>

//             <div className="section-heading">
//               <div>
//                 <h2>Employees</h2>
//                 <p>
//                   Employee master records.
//                 </p>
//               </div>
//             </div>

//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Employee ID</th>
//                     <th>Name</th>
//                     <th>Mobile</th>
//                     <th>Department</th>
//                     <th>Designation</th>
//                     <th>Salary</th>
//                     <th>Face</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {employees.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="8"
//                         className="empty-cell"
//                       >
//                         No employees created.
//                       </td>
//                     </tr>
//                   ) : (
//                     employees.map((employee) => (
//                       <tr key={employee.id}>
//                         <td>
//                           <strong>
//                             {employee.id}
//                           </strong>
//                         </td>

//                         <td>{employee.name}</td>

//                         <td>{employee.mobile}</td>

//                         <td>
//                           {employee.department ||
//                             "—"}
//                         </td>

//                         <td>
//                           {employee.designation ||
//                             "—"}
//                         </td>

//                         <td>
//                           ₹
//                           {Number(
//                             employee.salary || 0
//                           ).toLocaleString(
//                             "en-IN"
//                           )}
//                         </td>

//                         <td>
//                           {employee.faceImage ? (
//                             <span className="verified">
//                               ✓ Registered
//                             </span>
//                           ) : (
//                             <span className="not-verified">
//                               Not Registered
//                             </span>
//                           )}
//                         </td>

//                         <td>
//                           <button
//                             className="delete-btn"
//                             onClick={() =>
//                               deleteEmployee(
//                                 employee.id
//                               )
//                             }
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         )}

//         {adminTab === "salary" && (
//           <section className="admin-card">
//             <div className="section-heading">
//               <div>
//                 <h2>Salary Calculation</h2>
//                 <p>
//                   First 2 leave days are free. From
//                   3rd leave, half-day salary
//                   deduction applies.
//                 </p>
//               </div>
//             </div>

//             <div className="table-wrapper">
//               <table>
//                 <thead>
//                   <tr>
//                     <th>Employee</th>
//                     <th>Monthly Salary</th>
//                     <th>Present</th>
//                     <th>Half Day</th>
//                     <th>Absent</th>
//                     <th>Free Leave</th>
//                     <th>Deducted Leave</th>
//                     <th>Total Deduction</th>
//                     <th>Payable Salary</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {employees.map((employee) => {
//                     const salary =
//                       calculateSalary(employee);

//                     return (
//                       <tr key={employee.id}>
//                         <td>
//                           <strong>
//                             {employee.name}
//                           </strong>
//                           <br />
//                           <small>
//                             {employee.id}
//                           </small>
//                         </td>

//                         <td>
//                           ₹
//                           {Number(
//                             employee.salary || 0
//                           ).toLocaleString(
//                             "en-IN"
//                           )}
//                         </td>

//                         <td>
//                           {salary.presentDays}
//                         </td>

//                         <td>
//                           {salary.halfDays}
//                         </td>

//                         <td>
//                           {salary.absentDays}
//                         </td>

//                         <td>
//                           {salary.freeLeaves}
//                         </td>

//                         <td>
//                           {salary.deductedLeaves}
//                         </td>

//                         <td>
//                           ₹
//                           {salary.totalDeduction.toLocaleString(
//                             "en-IN",
//                             {
//                               maximumFractionDigits: 2,
//                             }
//                           )}
//                         </td>

//                         <td>
//                           <strong>
//                             ₹
//                             {salary.payableSalary.toLocaleString(
//                               "en-IN",
//                               {
//                                 maximumFractionDigits: 2,
//                               }
//                             )}
//                           </strong>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         )}
//       </main>

//       {showEmployeeModal && (
//         <div className="modal-overlay">
//           <div className="form-modal">
//             <button
//               className="modal-close"
//               onClick={() =>
//                 setShowEmployeeModal(false)
//               }
//             >
//               ×
//             </button>

//             <h2>Create Employee</h2>

//             <form onSubmit={createEmployee}>
//               <div className="form-grid">
//                 <div>
//                   <label>Employee Name *</label>

//                   <input
//                     name="name"
//                     value={employeeForm.name}
//                     onChange={handleEmployeeForm}
//                     placeholder="Enter employee name"
//                   />
//                 </div>

//                 <div>
//                   <label>Mobile Number *</label>

//                   <input
//                     name="mobile"
//                     value={employeeForm.mobile}
//                     onChange={handleEmployeeForm}
//                     placeholder="Enter mobile number"
//                   />
//                 </div>

//                 <div>
//                   <label>Department</label>

//                   <input
//                     name="department"
//                     value={
//                       employeeForm.department
//                     }
//                     onChange={handleEmployeeForm}
//                     placeholder="e.g. Physiotherapy"
//                   />
//                 </div>

//                 <div>
//                   <label>Designation</label>

//                   <input
//                     name="designation"
//                     value={
//                       employeeForm.designation
//                     }
//                     onChange={handleEmployeeForm}
//                     placeholder="e.g. Therapist"
//                   />
//                 </div>

//                 <div>
//                   <label>Monthly Salary *</label>

//                   <input
//                     type="number"
//                     name="salary"
//                     value={employeeForm.salary}
//                     onChange={handleEmployeeForm}
//                     placeholder="Enter salary"
//                   />
//                 </div>

//                 <div>
//                   <label>Joining Date</label>

//                   <input
//                     type="date"
//                     name="joiningDate"
//                     value={
//                       employeeForm.joiningDate
//                     }
//                     onChange={handleEmployeeForm}
//                   />
//                 </div>

//                 <div className="full-width">
//                   <label>
//                     Employee Login Password *
//                   </label>

//                   <input
//                     type="password"
//                     name="password"
//                     value={
//                       employeeForm.password
//                     }
//                     onChange={handleEmployeeForm}
//                     placeholder="Create employee password"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="primary-btn full-submit"
//               >
//                 Create Employee
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default EmployeeAttendance;



import React, { useEffect, useMemo, useRef, useState } from "react";
import "./EmployeeAttendance.css";

const EMPLOYEE_KEY = "clinic_employees";
const ATTENDANCE_KEY = "clinic_employee_attendance";

const getToday = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (date = new Date()) => {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const generateEmployeeId = (employees) => {
  const numbers = employees
    .map((employee) =>
      Number(String(employee.id || "").replace("EMP-", ""))
    )
    .filter((number) => !Number.isNaN(number));

  const nextNumber =
    numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `EMP-${String(nextNumber).padStart(4, "0")}`;
};

function EmployeeAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loginMode, setLoginMode] = useState("employee");
  const [loggedEmployee, setLoggedEmployee] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("dashboard");

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);

  const [faceImage, setFaceImage] = useState("");
  const [capturedLocation, setCapturedLocation] = useState(null);

  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendanceError, setAttendanceError] = useState("");

  const [searchDate, setSearchDate] = useState(getToday());
  const [searchEmployee, setSearchEmployee] = useState("");

  const [selectedSalaryEmployee, setSelectedSalaryEmployee] =
    useState("");

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    mobile: "",
    department: "",
    designation: "",
    salary: "",
    joiningDate: getToday(),
    password: "",
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const savedEmployees = localStorage.getItem(EMPLOYEE_KEY);
    const savedAttendance = localStorage.getItem(ATTENDANCE_KEY);

    if (savedEmployees) {
      try {
        setEmployees(JSON.parse(savedEmployees));
      } catch {
        setEmployees([]);
      }
    }

    if (savedAttendance) {
      try {
        setAttendance(JSON.parse(savedAttendance));
      } catch {
        setAttendance([]);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const today = getToday();

  const todayAttendance = useMemo(() => {
    return attendance.filter((item) => item.date === today);
  }, [attendance, today]);

  const presentToday = todayAttendance.filter(
    (item) => item.type === "Present"
  ).length;

  const halfDayToday = todayAttendance.filter(
    (item) => item.type === "Half Day"
  ).length;

  const getEmployeeAttendance = (employeeId) => {
    return attendance.filter(
      (item) => item.employeeId === employeeId
    );
  };

  const filteredDateAttendance = useMemo(() => {
    const search = searchEmployee.trim().toLowerCase();

    return attendance.filter((item) => {
      const dateMatch = item.date === searchDate;

      const employeeMatch =
        !search ||
        item.employeeName?.toLowerCase().includes(search) ||
        item.employeeId?.toLowerCase().includes(search);

      return dateMatch && employeeMatch;
    });
  }, [attendance, searchDate, searchEmployee]);

  const selectedEmployeeForCalendar = employees.find(
    (employee) => employee.id === searchEmployee
  );

  const searchedEmployeeRecords = useMemo(() => {
    const value = searchEmployee.trim().toLowerCase();

    if (!value) return [];

    const employee = employees.find(
      (item) =>
        item.id.toLowerCase() === value ||
        item.name.toLowerCase().includes(value)
    );

    if (!employee) return [];

    return attendance.filter(
      (item) => item.employeeId === employee.id
    );
  }, [attendance, employees, searchEmployee]);

  const handleLogin = (e) => {
    e.preventDefault();

    setLoginError("");

    if (loginMode === "admin") {
      if (
        loginId.trim() === "admin" &&
        loginPassword === "admin123"
      ) {
        setIsAdminLoggedIn(true);
        setLoggedEmployee(null);
        setLoginId("");
        setLoginPassword("");
        return;
      }

      setLoginError("Invalid admin username or password.");
      return;
    }

    const employee = employees.find(
      (item) =>
        item.id.toLowerCase() === loginId.trim().toLowerCase() &&
        item.password === loginPassword
    );

    if (!employee) {
      setLoginError("Invalid Employee ID or password.");
      return;
    }

    setLoggedEmployee(employee);
    setIsAdminLoggedIn(false);
    setLoginId("");
    setLoginPassword("");
  };

  const logout = () => {
    setLoggedEmployee(null);
    setIsAdminLoggedIn(false);
    setLoginId("");
    setLoginPassword("");
    setLoginError("");
    setActiveTab("dashboard");
    stopCamera();
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;

    setNewEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createEmployee = (e) => {
    e.preventDefault();

    if (!newEmployee.name.trim()) {
      alert("Employee name is required.");
      return;
    }

    if (!newEmployee.password.trim()) {
      alert("Employee password is required.");
      return;
    }

    const employee = {
      ...newEmployee,
      id: generateEmployeeId(employees),
      name: newEmployee.name.trim(),
      salary: Number(newEmployee.salary || 0),
      createdAt: new Date().toISOString(),
      faceImage: "",
    };

    const updatedEmployees = [...employees, employee];

    setEmployees(updatedEmployees);

    localStorage.setItem(
      EMPLOYEE_KEY,
      JSON.stringify(updatedEmployees)
    );

    setNewEmployee({
      name: "",
      mobile: "",
      department: "",
      designation: "",
      salary: "",
      joiningDate: getToday(),
      password: "",
    });

    setShowEmployeeModal(false);

    alert(
      `Employee created successfully.\nEmployee ID: ${employee.id}`
    );
  };

  const deleteEmployee = (employeeId) => {
    const employee = employees.find(
      (item) => item.id === employeeId
    );

    if (!employee) return;

    const confirmed = window.confirm(
      `Delete employee ${employee.name} (${employee.id})?`
    );

    if (!confirmed) return;

    const updatedEmployees = employees.filter(
      (item) => item.id !== employeeId
    );

    setEmployees(updatedEmployees);

    localStorage.setItem(
      EMPLOYEE_KEY,
      JSON.stringify(updatedEmployees)
    );
  };

  const startCamera = async () => {
    setAttendanceError("");
    setAttendanceMessage("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setAttendanceError(
          "Camera is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: 640,
            height: 480,
          },
          audio: false,
        });

      setCameraStream(stream);
      setShowCameraModal(true);
    } catch (error) {
      setAttendanceError(
        "Camera permission is required to capture attendance photo."
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }

    setCameraStream(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) {
      setAttendanceError("Camera is not ready.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image = canvas.toDataURL("image/jpeg", 0.85);

    setFaceImage(image);

    stopCamera();
    setShowCameraModal(false);

    setAttendanceMessage(
      "Photo captured successfully. Now capture location."
    );
  };

  const captureLocation = () => {
    setAttendanceError("");
    setAttendanceMessage("");

    if (!navigator.geolocation) {
      setAttendanceError(
        "Location is not supported by this browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        const locationData = {
          latitude,
          longitude,
          accuracy,
          capturedAt: new Date().toISOString(),
          mapsUrl,
        };

        setCapturedLocation(locationData);

        setAttendanceMessage(
          `Location captured successfully. Accuracy: ${Math.round(
            accuracy
          )} meters.`
        );
      },
      () => {
        setAttendanceError(
          "Location permission is required to mark attendance."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const markAttendance = (type = "Present") => {
    setAttendanceError("");
    setAttendanceMessage("");

    if (!loggedEmployee) {
      setAttendanceError("Employee login required.");
      return;
    }

    const alreadyMarked = attendance.some(
      (item) =>
        item.employeeId === loggedEmployee.id &&
        item.date === today
    );

    if (alreadyMarked) {
      setAttendanceError(
        "Today's attendance is already marked."
      );
      return;
    }

    if (!faceImage) {
      setAttendanceError(
        "Please capture your attendance photo first."
      );
      return;
    }

    if (!capturedLocation) {
      setAttendanceError(
        "Please capture your location first."
      );
      return;
    }

    const now = new Date();

    const attendanceRecord = {
      id: Date.now(),
      employeeId: loggedEmployee.id,
      employeeName: loggedEmployee.name,

      date: today,
      time: formatTime(now),

      type,

      // Attendance photo
      faceImage,

      // Location captured at the same attendance event
      latitude: capturedLocation.latitude,
      longitude: capturedLocation.longitude,
      accuracy: capturedLocation.accuracy,
      locationCapturedAt:
        capturedLocation.capturedAt,

      // Google Maps
      mapsUrl: capturedLocation.mapsUrl,

      // Metadata
      faceCaptured: true,
      locationCaptured: true,
      createdAt: now.toISOString(),
    };

    const updatedAttendance = [
      ...attendance,
      attendanceRecord,
    ];

    setAttendance(updatedAttendance);

    localStorage.setItem(
      ATTENDANCE_KEY,
      JSON.stringify(updatedAttendance)
    );

    // Also save latest captured face with employee
    const updatedEmployees = employees.map((employee) =>
      employee.id === loggedEmployee.id
        ? {
            ...employee,
            faceImage:
              employee.faceImage || faceImage,
          }
        : employee
    );

    setEmployees(updatedEmployees);

    localStorage.setItem(
      EMPLOYEE_KEY,
      JSON.stringify(updatedEmployees)
    );

    setLoggedEmployee({
      ...loggedEmployee,
      faceImage:
        loggedEmployee.faceImage || faceImage,
    });

    setFaceImage("");
    setCapturedLocation(null);

    setAttendanceMessage(
      `Attendance marked successfully for ${formatDate(today)} at ${formatTime(
        now
      )}.`
    );
  };

  const getEmployeeRecordForDate = (
    employeeId,
    date
  ) => {
    return attendance.find(
      (item) =>
        item.employeeId === employeeId &&
        item.date === date
    );
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const salaryData = useMemo(() => {
    if (!selectedSalaryEmployee) return null;

    const employee = employees.find(
      (item) => item.id === selectedSalaryEmployee
    );

    if (!employee) return null;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = getDaysInMonth(year, month);

    const records = attendance.filter(
      (item) =>
        item.employeeId === employee.id &&
        new Date(`${item.date}T00:00:00`).getFullYear() ===
          year &&
        new Date(`${item.date}T00:00:00`).getMonth() ===
          month
    );

    const presentDays = records.filter(
      (item) => item.type === "Present"
    ).length;

    const halfDays = records.filter(
      (item) => item.type === "Half Day"
    ).length;

    const markedDays = records.length;

    const absentDays = Math.max(
      0,
      daysInMonth - markedDays
    );

    const freeLeaves = Math.min(2, absentDays);

    const deductedLeaves = Math.max(
      0,
      absentDays - 2
    );

    const monthlySalary = Number(employee.salary || 0);

    const dailySalary =
      daysInMonth > 0
        ? monthlySalary / daysInMonth
        : 0;

    const halfDayDeduction =
      dailySalary / 2;

    const leaveDeduction =
      deductedLeaves * halfDayDeduction;

    const halfDaySalaryDeduction =
      halfDays * halfDayDeduction;

    const totalDeduction =
      leaveDeduction +
      halfDaySalaryDeduction;

    const payableSalary = Math.max(
      0,
      monthlySalary - totalDeduction
    );

    return {
      employee,
      daysInMonth,
      presentDays,
      halfDays,
      markedDays,
      absentDays,
      freeLeaves,
      deductedLeaves,
      monthlySalary,
      dailySalary,
      halfDayDeduction,
      leaveDeduction,
      halfDaySalaryDeduction,
      totalDeduction,
      payableSalary,
    };
  }, [
    selectedSalaryEmployee,
    employees,
    attendance,
  ]);

  const openPhoto = (photo) => {
    if (!photo) return;

    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setShowPhotoModal(false);
  };

  const resetEmployeeAttendanceCapture = () => {
    setFaceImage("");
    setCapturedLocation(null);
    setAttendanceError("");
    setAttendanceMessage("");
  };

  const renderLocationInfo = (item) => {
    if (
      item.latitude === undefined ||
      item.longitude === undefined
    ) {
      return (
        <span className="location-not-found">
          Not captured
        </span>
      );
    }

    return (
      <div className="location-info">
        <div>
          <strong>GPS</strong>
          <span>
            {Number(item.latitude).toFixed(6)},{" "}
            {Number(item.longitude).toFixed(6)}
          </span>
        </div>

        <small>
          Accuracy:{" "}
          {item.accuracy
            ? `${Math.round(item.accuracy)} m`
            : "-"}
        </small>

        {item.mapsUrl && (
          <a
            href={item.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="map-link"
          >
            View on Google Maps
          </a>
        )}
      </div>
    );
  };

  if (!loggedEmployee && !isAdminLoggedIn) {
    return (
      <div className="attendance-page login-page">
        <div className="login-card">
          <div className="clinic-logo">
            PA
          </div>

          <h1>Employee Attendance</h1>

          <p className="login-subtitle">
            Secure attendance portal
          </p>

          <div className="login-tabs">
            <button
              className={
                loginMode === "employee"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLoginMode("employee")
              }
            >
              Employee Login
            </button>

            <button
              className={
                loginMode === "admin"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setLoginMode("admin")
              }
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <label>
              {loginMode === "employee"
                ? "Employee ID"
                : "Admin Username"}
            </label>

            <input
              type="text"
              value={loginId}
              placeholder={
                loginMode === "employee"
                  ? "EMP-0001"
                  : "admin"
              }
              onChange={(e) =>
                setLoginId(e.target.value)
              }
            />

            <label>Password</label>

            <input
              type="password"
              value={loginPassword}
              placeholder="Enter password"
              onChange={(e) =>
                setLoginPassword(e.target.value)
              }
            />

            {loginError && (
              <div className="error-message">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="primary-btn login-btn"
            >
              Login
            </button>
          </form>

          {loginMode === "admin" && (
            <div className="demo-login">
              <strong>Demo Admin Login</strong>
              <span>Username: admin</span>
              <span>Password: admin123</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loggedEmployee) {
    const myAttendance = getEmployeeAttendance(
      loggedEmployee.id
    );

    const alreadyMarkedToday = myAttendance.some(
      (item) => item.date === today
    );

    return (
      <div className="attendance-page">
        <header className="employee-header">
          <div>
            <span className="brand-small">
              PUNAR AXIS THERAPY
            </span>

            <h1>Employee Attendance Portal</h1>
          </div>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <main className="employee-content">
          <section className="employee-welcome-card">
            <div className="employee-avatar-large">
              {loggedEmployee.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>
              <span>Welcome</span>
              <h2>{loggedEmployee.name}</h2>
              <p>
                {loggedEmployee.id}{" "}
                {loggedEmployee.designation
                  ? `• ${loggedEmployee.designation}`
                  : ""}
              </p>
            </div>
          </section>

          <section className="employee-info-grid">
            <div className="info-card">
              <span>Employee ID</span>
              <strong>{loggedEmployee.id}</strong>
            </div>

            <div className="info-card">
              <span>Department</span>
              <strong>
                {loggedEmployee.department || "-"}
              </strong>
            </div>

            <div className="info-card">
              <span>Designation</span>
              <strong>
                {loggedEmployee.designation || "-"}
              </strong>
            </div>
          </section>

          <section className="attendance-mark-card">
            <div className="section-title">
              <div>
                <h2>Mark Today's Attendance</h2>
                <p>
                  Photo and GPS location are captured
                  with this attendance.
                </p>
              </div>

              <div className="today-date">
                {formatDate(today)}
              </div>
            </div>

            {alreadyMarkedToday ? (
              <div className="already-marked">
                <div className="success-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Today's attendance is already
                    marked
                  </h3>

                  <p>
                    You cannot mark attendance twice
                    on the same day.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="capture-grid">
                  <div className="capture-card">
                    <div className="capture-icon">
                      📸
                    </div>

                    <h3>Attendance Photo</h3>

                    <p>
                      Capture your photo before
                      marking attendance.
                    </p>

                    {faceImage ? (
                      <div className="captured-preview">
                        <img
                          src={faceImage}
                          alt="Attendance"
                        />

                        <span className="captured-badge">
                          ✓ Photo Captured
                        </span>
                      </div>
                    ) : (
                      <div className="empty-capture">
                        No photo captured
                      </div>
                    )}

                    <button
                      className="secondary-btn"
                      onClick={startCamera}
                    >
                      {faceImage
                        ? "Retake Photo"
                        : "Capture Photo"}
                    </button>
                  </div>

                  <div className="capture-card">
                    <div className="capture-icon">
                      📍
                    </div>

                    <h3>Attendance Location</h3>

                    <p>
                      Capture GPS location where
                      attendance is marked.
                    </p>

                    {capturedLocation ? (
                      <div className="location-captured">
                        <strong>
                          ✓ Location Captured
                        </strong>

                        <span>
                          Lat:{" "}
                          {capturedLocation.latitude.toFixed(
                            6
                          )}
                        </span>

                        <span>
                          Long:{" "}
                          {capturedLocation.longitude.toFixed(
                            6
                          )}
                        </span>

                        <span>
                          Accuracy:{" "}
                          {Math.round(
                            capturedLocation.accuracy
                          )}{" "}
                          m
                        </span>
                      </div>
                    ) : (
                      <div className="empty-capture">
                        No location captured
                      </div>
                    )}

                    <button
                      className="secondary-btn"
                      onClick={captureLocation}
                    >
                      {capturedLocation
                        ? "Recapture Location"
                        : "Capture Location"}
                    </button>
                  </div>
                </div>

                {attendanceMessage && (
                  <div className="success-message">
                    {attendanceMessage}
                  </div>
                )}

                {attendanceError && (
                  <div className="error-message">
                    {attendanceError}
                  </div>
                )}

                <div className="attendance-buttons">
                  <button
                    className="primary-btn"
                    disabled={
                      !faceImage ||
                      !capturedLocation
                    }
                    onClick={() =>
                      markAttendance("Present")
                    }
                  >
                    ✓ Mark Present
                  </button>

                  <button
                    className="half-day-btn"
                    disabled={
                      !faceImage ||
                      !capturedLocation
                    }
                    onClick={() =>
                      markAttendance("Half Day")
                    }
                  >
                    Mark Half Day
                  </button>

                  <button
                    className="reset-btn"
                    onClick={
                      resetEmployeeAttendanceCapture
                    }
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="employee-history-card">
            <div className="section-title">
              <div>
                <h2>My Attendance History</h2>
                <p>
                  Your attendance records only.
                </p>
              </div>
            </div>

            {myAttendance.length === 0 ? (
              <div className="empty-state">
                No attendance records found.
              </div>
            ) : (
              <div className="attendance-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Photo</th>
                      <th>Location</th>
                    </tr>
                  </thead>

                  <tbody>
                    {[...myAttendance]
                      .reverse()
                      .map((item) => (
                        <tr key={item.id}>
                          <td>
                            {formatDate(item.date)}
                          </td>

                          <td>{item.time}</td>

                          <td>
                            <span
                              className={`status-badge ${item.type
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )}`}
                            >
                              {item.type}
                            </span>
                          </td>

                          <td>
                            {item.faceImage ? (
                              <button
                                className="photo-view-btn"
                                onClick={() =>
                                  openPhoto(
                                    item.faceImage
                                  )
                                }
                              >
                                View Photo
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {renderLocationInfo(item)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {showCameraModal && (
          <div className="camera-overlay">
            <div className="camera-modal">
              <div className="camera-header">
                <div>
                  <h2>Capture Attendance Photo</h2>
                  <p>
                    Keep your face clearly visible.
                  </p>
                </div>

                <button
                  className="close-btn"
                  onClick={() => {
                    stopCamera();
                    setShowCameraModal(false);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="camera-preview">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                />
              </div>

              <canvas
                ref={canvasRef}
                style={{ display: "none" }}
              />

              <div className="camera-actions">
                <button
                  className="primary-btn"
                  onClick={capturePhoto}
                >
                  📸 Capture Photo
                </button>

                <button
                  className="reset-btn"
                  onClick={() => {
                    stopCamera();
                    setShowCameraModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showPhotoModal && selectedPhoto && (
          <div
            className="photo-overlay"
            onClick={closePhoto}
          >
            <div
              className="photo-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <button
                className="photo-close-btn"
                onClick={closePhoto}
              >
                ×
              </button>

              <img
                src={selectedPhoto}
                alt="Employee attendance"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="attendance-page admin-page">
      <header className="admin-header">
        <div>
          <span className="brand-small">
            PUNAR AXIS THERAPY
          </span>

          <h1>Admin Attendance Dashboard</h1>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <main className="admin-content">
        <div className="admin-tabs">
          <button
            className={
              activeTab === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("dashboard")
            }
          >
            Dashboard
          </button>

          <button
            className={
              activeTab === "datewise"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("datewise")
            }
          >
            Date-wise Attendance
          </button>

          <button
            className={
              activeTab === "employees"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("employees")
            }
          >
            Employees
          </button>

          <button
            className={
              activeTab === "salary"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("salary")
            }
          >
            Salary
          </button>
        </div>

        {activeTab === "dashboard" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span>Total Employees</span>
                <strong>{employees.length}</strong>
              </div>

              <div className="stat-card">
                <span>Present Today</span>
                <strong>{presentToday}</strong>
              </div>

              <div className="stat-card">
                <span>Half Day Today</span>
                <strong>{halfDayToday}</strong>
              </div>

              <div className="stat-card">
                <span>Not Marked</span>
                <strong>
                  {Math.max(
                    0,
                    employees.length -
                      todayAttendance.length
                  )}
                </strong>
              </div>
            </section>

            <section className="admin-card">
              <div className="section-title">
                <div>
                  <h2>Today's Attendance</h2>
                  <p>
                    Photo, date, time and location
                    captured during attendance.
                  </p>
                </div>

                <span className="date-pill">
                  {formatDate(today)}
                </span>
              </div>

              {todayAttendance.length === 0 ? (
                <div className="empty-state">
                  No attendance marked today.
                </div>
              ) : (
                <div className="attendance-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Photo</th>
                        <th>Location</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...todayAttendance]
                        .reverse()
                        .map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>
                                {item.employeeName}
                              </strong>

                              <small className="table-sub">
                                {item.employeeId}
                              </small>
                            </td>

                            <td>
                              {formatDate(item.date)}
                            </td>

                            <td>{item.time}</td>

                            <td>
                              <span
                                className={`status-badge ${item.type
                                  .toLowerCase()
                                  .replace(
                                    " ",
                                    "-"
                                  )}`}
                              >
                                {item.type}
                              </span>
                            </td>

                            <td>
                              {item.faceImage ? (
                                <button
                                  className="photo-view-btn"
                                  onClick={() =>
                                    openPhoto(
                                      item.faceImage
                                    )
                                  }
                                >
                                  📸 View Photo
                                </button>
                              ) : (
                                "-"
                              )}
                            </td>

                            <td>
                              {renderLocationInfo(
                                item
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "datewise" && (
          <>
            <section className="filter-card">
              <div>
                <label>Select Date</label>

                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) =>
                    setSearchDate(e.target.value)
                  }
                />
              </div>

              <div>
                <label>
                  Search Employee
                </label>

                <input
                  type="text"
                  placeholder="Name or Employee ID..."
                  value={searchEmployee}
                  onChange={(e) =>
                    setSearchEmployee(
                      e.target.value
                    )
                  }
                />
              </div>
            </section>

            <section className="admin-card">
              <div className="section-title">
                <div>
                  <h2>
                    Attendance for{" "}
                    {formatDate(searchDate)}
                  </h2>

                  <p>
                    {filteredDateAttendance.length}{" "}
                    attendance record(s)
                  </p>
                </div>
              </div>

              {filteredDateAttendance.length ===
              0 ? (
                <div className="empty-state">
                  No attendance found for this
                  date/search.
                </div>
              ) : (
                <div className="attendance-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                        <th>Photo</th>
                        <th>GPS Location</th>
                        <th>Map</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredDateAttendance.map(
                        (item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>
                                {item.employeeName}
                              </strong>

                              <small className="table-sub">
                                {item.employeeId}
                              </small>
                            </td>

                            <td>
                              {formatDate(
                                item.date
                              )}
                            </td>

                            <td>{item.time}</td>

                            <td>
                              <span
                                className={`status-badge ${item.type
                                  .toLowerCase()
                                  .replace(
                                    " ",
                                    "-"
                                  )}`}
                              >
                                {item.type}
                              </span>
                            </td>

                            <td>
                              {item.faceImage ? (
                                <button
                                  className="photo-view-btn"
                                  onClick={() =>
                                    openPhoto(
                                      item.faceImage
                                    )
                                  }
                                >
                                  View Photo
                                </button>
                              ) : (
                                "No Photo"
                              )}
                            </td>

                            <td>
                              <div className="gps-box">
                                <span>
                                  Lat:{" "}
                                  {Number(
                                    item.latitude
                                  ).toFixed(6)}
                                </span>

                                <span>
                                  Long:{" "}
                                  {Number(
                                    item.longitude
                                  ).toFixed(6)}
                                </span>

                                <span>
                                  Accuracy:{" "}
                                  {item.accuracy
                                    ? `${Math.round(
                                        item.accuracy
                                      )} m`
                                    : "-"}
                                </span>
                              </div>
                            </td>

                            <td>
                              {item.mapsUrl ? (
                                <a
                                  href={
                                    item.mapsUrl
                                  }
                                  target="_blank"
                                  rel="noreferrer"
                                  className="map-button"
                                >
                                  🗺️ Open Map
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="admin-card employee-search-card">
              <div className="section-title">
                <div>
                  <h2>
                    Employee Attendance Search
                  </h2>

                  <p>
                    Search an employee to see
                    date-wise attendance.
                  </p>
                </div>
              </div>

              <div className="employee-search-input">
                <input
                  type="text"
                  placeholder="Search employee name or ID, e.g. Manish Kumar Singh"
                  value={searchEmployee}
                  onChange={(e) =>
                    setSearchEmployee(
                      e.target.value
                    )
                  }
                />
              </div>

              {searchEmployee.trim() && (
                <>
                  {searchedEmployeeRecords.length ===
                  0 ? (
                    <div className="empty-state">
                      No employee attendance found.
                    </div>
                  ) : (
                    <div className="attendance-table-wrapper">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Photo</th>
                            <th>Location</th>
                          </tr>
                        </thead>

                        <tbody>
                          {[
                            ...searchedEmployeeRecords,
                          ]
                            .sort(
                              (a, b) =>
                                new Date(
                                  b.date
                                ) -
                                new Date(a.date)
                            )
                            .map((item) => (
                              <tr key={item.id}>
                                <td>
                                  {formatDate(
                                    item.date
                                  )}
                                </td>

                                <td>{item.time}</td>

                                <td>
                                  <span
                                    className={`status-badge ${item.type
                                      .toLowerCase()
                                      .replace(
                                        " ",
                                        "-"
                                      )}`}
                                  >
                                    {item.type}
                                  </span>
                                </td>

                                <td>
                                  {item.faceImage ? (
                                    <button
                                      className="photo-view-btn"
                                      onClick={() =>
                                        openPhoto(
                                          item.faceImage
                                        )
                                      }
                                    >
                                      View Photo
                                    </button>
                                  ) : (
                                    "-"
                                  )}
                                </td>

                                <td>
                                  {renderLocationInfo(
                                    item
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}

        {activeTab === "employees" && (
          <section className="admin-card">
            <div className="section-title">
              <div>
                <h2>Employee Management</h2>
                <p>
                  Add employees and automatically
                  generate Employee IDs.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowEmployeeModal(true)
                }
              >
                + Add Employee
              </button>
            </div>

            {employees.length === 0 ? (
              <div className="empty-state">
                No employees added yet.
              </div>
            ) : (
              <div className="attendance-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee</th>
                      <th>Mobile</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Salary</th>
                      <th>Face</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((employee) => (
                      <tr key={employee.id}>
                        <td>
                          <strong>
                            {employee.id}
                          </strong>
                        </td>

                        <td>{employee.name}</td>

                        <td>
                          {employee.mobile || "-"}
                        </td>

                        <td>
                          {employee.department ||
                            "-"}
                        </td>

                        <td>
                          {employee.designation ||
                            "-"}
                        </td>

                        <td>
                          ₹
                          {Number(
                            employee.salary || 0
                          ).toLocaleString("en-IN")}
                        </td>

                        <td>
                          {employee.faceImage ? (
                            <button
                              className="photo-view-btn"
                              onClick={() =>
                                openPhoto(
                                  employee.faceImage
                                )
                              }
                            >
                              View Face
                            </button>
                          ) : (
                            "Not Registered"
                          )}
                        </td>

                        <td>
                          <button
                            className="delete-employee-btn"
                            onClick={() =>
                              deleteEmployee(
                                employee.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === "salary" && (
          <section className="admin-card">
            <div className="section-title">
              <div>
                <h2>Salary Management</h2>
                <p>
                  First 2 leave days have no salary
                  deduction. From 3rd leave, half-day
                  salary is deducted.
                </p>
              </div>
            </div>

            <div className="salary-selector">
              <label>Select Employee</label>

              <select
                value={selectedSalaryEmployee}
                onChange={(e) =>
                  setSelectedSalaryEmployee(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} -{" "}
                    {employee.id}
                  </option>
                ))}
              </select>
            </div>

            {salaryData && (
              <div className="salary-section">
                <div className="salary-header-card">
                  <div>
                    <span>Employee</span>
                    <h2>
                      {salaryData.employee.name}
                    </h2>
                    <p>
                      {salaryData.employee.id}
                    </p>
                  </div>

                  <div>
                    <span>Monthly Salary</span>
                    <strong>
                      ₹
                      {salaryData.monthlySalary.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits: 2,
                        }
                      )}
                    </strong>
                  </div>
                </div>

                <div className="salary-stats">
                  <div>
                    <span>Present Days</span>
                    <strong>
                      {salaryData.presentDays}
                    </strong>
                  </div>

                  <div>
                    <span>Half Days</span>
                    <strong>
                      {salaryData.halfDays}
                    </strong>
                  </div>

                  <div>
                    <span>Absent Days</span>
                    <strong>
                      {salaryData.absentDays}
                    </strong>
                  </div>

                  <div>
                    <span>Free Leaves</span>
                    <strong>
                      {salaryData.freeLeaves}
                    </strong>
                  </div>

                  <div>
                    <span>Deducted Leaves</span>
                    <strong>
                      {salaryData.deductedLeaves}
                    </strong>
                  </div>
                </div>

                <div className="salary-calculation">
                  <div>
                    <span>
                      Half-day salary deduction
                    </span>
                    <strong>
                      ₹
                      {salaryData.halfDayDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Leave deduction
                    </span>
                    <strong>
                      ₹
                      {salaryData.leaveDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Half-day deductions
                    </span>
                    <strong>
                      ₹
                      {salaryData.halfDaySalaryDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div className="total-deduction">
                    <span>Total Deduction</span>
                    <strong>
                      ₹
                      {salaryData.totalDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div className="payable-salary">
                    <span>Payable Salary</span>
                    <strong>
                      ₹
                      {salaryData.payableSalary.toFixed(
                        2
                      )}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="employee-modal">
            <div className="modal-header">
              <div>
                <h2>Add New Employee</h2>
                <p>
                  Employee ID will be generated
                  automatically.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowEmployeeModal(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={createEmployee}>
              <div className="form-grid">
                <div>
                  <label>Employee Name</label>

                  <input
                    name="name"
                    value={newEmployee.name}
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Employee full name"
                  />
                </div>

                <div>
                  <label>Mobile Number</label>

                  <input
                    name="mobile"
                    value={newEmployee.mobile}
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Mobile number"
                  />
                </div>

                <div>
                  <label>Department</label>

                  <input
                    name="department"
                    value={
                      newEmployee.department
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Department"
                  />
                </div>

                <div>
                  <label>Designation</label>

                  <input
                    name="designation"
                    value={
                      newEmployee.designation
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Designation"
                  />
                </div>

                <div>
                  <label>Monthly Salary</label>

                  <input
                    type="number"
                    name="salary"
                    value={newEmployee.salary}
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Monthly salary"
                  />
                </div>

                <div>
                  <label>Joining Date</label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={
                      newEmployee.joiningDate
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                  />
                </div>

                <div className="full-width">
                  <label>
                    Employee Login Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      newEmployee.password
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Create employee password"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="reset-btn"
                  onClick={() =>
                    setShowEmployeeModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPhotoModal && selectedPhoto && (
        <div
          className="photo-overlay"
          onClick={closePhoto}
        >
          <div
            className="photo-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="photo-close-btn"
              onClick={closePhoto}
            >
              ×
            </button>

            <img
              src={selectedPhoto}
              alt="Attendance"
            />

            <div className="photo-modal-caption">
              Attendance Photo
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeAttendance;