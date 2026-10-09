// import React, { useEffect, useMemo, useRef, useState } from "react";
// import "./EmployeeAttendance.css";

// const EMPLOYEE_KEY = "clinic_employees";
// const ATTENDANCE_KEY = "clinic_employee_attendance";

// const getToday = () => {
//   const d = new Date();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${d.getFullYear()}-${month}-${day}`;
// };

// const formatDate = (dateString) => {
//   if (!dateString) return "-";

//   const date = new Date(`${dateString}T00:00:00`);

//   return date.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };

// const formatTime = (date = new Date()) => {
//   return date.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });
// };

// const generateEmployeeId = (employees) => {
//   const numbers = employees
//     .map((employee) =>
//       Number(String(employee.id || "").replace("EMP-", ""))
//     )
//     .filter((number) => !Number.isNaN(number));

//   const nextNumber =
//     numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

//   return `EMP-${String(nextNumber).padStart(4, "0")}`;
// };

// function EmployeeAttendance() {
//   const [employees, setEmployees] = useState([]);
//   const [attendance, setAttendance] = useState([]);

//   const [loginMode, setLoginMode] = useState("employee");
//   const [loggedEmployee, setLoggedEmployee] = useState(null);
//   const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

//   const [loginId, setLoginId] = useState("");
//   const [loginPassword, setLoginPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const [activeTab, setActiveTab] = useState("dashboard");

//   const [showEmployeeModal, setShowEmployeeModal] = useState(false);
//   const [showCameraModal, setShowCameraModal] = useState(false);
//   const [showPhotoModal, setShowPhotoModal] = useState(false);

//   const [selectedPhoto, setSelectedPhoto] = useState(null);
//   const [cameraStream, setCameraStream] = useState(null);

//   const [faceImage, setFaceImage] = useState("");
//   const [capturedLocation, setCapturedLocation] = useState(null);

//   const [attendanceMessage, setAttendanceMessage] = useState("");
//   const [attendanceError, setAttendanceError] = useState("");

//   const [searchDate, setSearchDate] = useState(getToday());
//   const [searchEmployee, setSearchEmployee] = useState("");

//   const [selectedSalaryEmployee, setSelectedSalaryEmployee] =
//     useState("");

//   const [newEmployee, setNewEmployee] = useState({
//     name: "",
//     mobile: "",
//     department: "",
//     designation: "",
//     salary: "",
//     joiningDate: getToday(),
//     password: "",
//   });

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const savedEmployees = localStorage.getItem(EMPLOYEE_KEY);
//     const savedAttendance = localStorage.getItem(ATTENDANCE_KEY);

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

//   useEffect(() => {
//     return () => {
//       if (cameraStream) {
//         cameraStream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, [cameraStream]);

//   useEffect(() => {
//     if (cameraStream && videoRef.current) {
//       videoRef.current.srcObject = cameraStream;
//     }
//   }, [cameraStream]);

//   const today = getToday();

//   const todayAttendance = useMemo(() => {
//     return attendance.filter((item) => item.date === today);
//   }, [attendance, today]);

//   const presentToday = todayAttendance.filter(
//     (item) => item.type === "Present"
//   ).length;

//   const halfDayToday = todayAttendance.filter(
//     (item) => item.type === "Half Day"
//   ).length;

//   const getEmployeeAttendance = (employeeId) => {
//     return attendance.filter(
//       (item) => item.employeeId === employeeId
//     );
//   };

//   const filteredDateAttendance = useMemo(() => {
//     const search = searchEmployee.trim().toLowerCase();

//     return attendance.filter((item) => {
//       const dateMatch = item.date === searchDate;

//       const employeeMatch =
//         !search ||
//         item.employeeName?.toLowerCase().includes(search) ||
//         item.employeeId?.toLowerCase().includes(search);

//       return dateMatch && employeeMatch;
//     });
//   }, [attendance, searchDate, searchEmployee]);

//   // const selectedEmployeeForCalendar = employees.find(
//   //   (employee) => employee.id === searchEmployee
//   // );

//   const searchedEmployeeRecords = useMemo(() => {
//     const value = searchEmployee.trim().toLowerCase();

//     if (!value) return [];

//     const employee = employees.find(
//       (item) =>
//         item.id.toLowerCase() === value ||
//         item.name.toLowerCase().includes(value)
//     );

//     if (!employee) return [];

//     return attendance.filter(
//       (item) => item.employeeId === employee.id
//     );
//   }, [attendance, employees, searchEmployee]);

//   const handleLogin = (e) => {
//     e.preventDefault();

//     setLoginError("");

//     if (loginMode === "admin") {
//       if (
//         loginId.trim() === "admin" &&
//         loginPassword === "admin123"
//       ) {
//         setIsAdminLoggedIn(true);
//         setLoggedEmployee(null);
//         setLoginId("");
//         setLoginPassword("");
//         return;
//       }

//       setLoginError("Invalid admin username or password.");
//       return;
//     }

//     const employee = employees.find(
//       (item) =>
//         item.id.toLowerCase() === loginId.trim().toLowerCase() &&
//         item.password === loginPassword
//     );

//     if (!employee) {
//       setLoginError("Invalid Employee ID or password.");
//       return;
//     }

//     setLoggedEmployee(employee);
//     setIsAdminLoggedIn(false);
//     setLoginId("");
//     setLoginPassword("");
//   };

//   const logout = () => {
//     setLoggedEmployee(null);
//     setIsAdminLoggedIn(false);
//     setLoginId("");
//     setLoginPassword("");
//     setLoginError("");
//     setActiveTab("dashboard");
//     stopCamera();
//   };

//   const handleNewEmployeeChange = (e) => {
//     const { name, value } = e.target;

//     setNewEmployee((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const createEmployee = (e) => {
//     e.preventDefault();

//     if (!newEmployee.name.trim()) {
//       alert("Employee name is required.");
//       return;
//     }

//     if (!newEmployee.password.trim()) {
//       alert("Employee password is required.");
//       return;
//     }

//     const employee = {
//       ...newEmployee,
//       id: generateEmployeeId(employees),
//       name: newEmployee.name.trim(),
//       salary: Number(newEmployee.salary || 0),
//       createdAt: new Date().toISOString(),
//       faceImage: "",
//     };

//     const updatedEmployees = [...employees, employee];

//     setEmployees(updatedEmployees);

//     localStorage.setItem(
//       EMPLOYEE_KEY,
//       JSON.stringify(updatedEmployees)
//     );

//     setNewEmployee({
//       name: "",
//       mobile: "",
//       department: "",
//       designation: "",
//       salary: "",
//       joiningDate: getToday(),
//       password: "",
//     });

//     setShowEmployeeModal(false);

//     alert(
//       `Employee created successfully.\nEmployee ID: ${employee.id}`
//     );
//   };

//   const deleteEmployee = (employeeId) => {
//     const employee = employees.find(
//       (item) => item.id === employeeId
//     );

//     if (!employee) return;

//     const confirmed = window.confirm(
//       `Delete employee ${employee.name} (${employee.id})?`
//     );

//     if (!confirmed) return;

//     const updatedEmployees = employees.filter(
//       (item) => item.id !== employeeId
//     );

//     setEmployees(updatedEmployees);

//     localStorage.setItem(
//       EMPLOYEE_KEY,
//       JSON.stringify(updatedEmployees)
//     );
//   };

//   const startCamera = async () => {
//     setAttendanceError("");
//     setAttendanceMessage("");

//     try {
//       if (!navigator.mediaDevices?.getUserMedia) {
//         setAttendanceError(
//           "Camera is not supported by this browser."
//         );
//         return;
//       }

//       const stream =
//         await navigator.mediaDevices.getUserMedia({
//           video: {
//             facingMode: "user",
//             width: 640,
//             height: 480,
//           },
//           audio: false,
//         });

//       setCameraStream(stream);
//       setShowCameraModal(true);
//     } catch (error) {
//       setAttendanceError(
//         "Camera permission is required to capture attendance photo."
//       );
//     }
//   };

//   const stopCamera = () => {
//     if (cameraStream) {
//       cameraStream.getTracks().forEach((track) => track.stop());
//     }

//     setCameraStream(null);
//   };

//   const capturePhoto = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       setAttendanceError("Camera is not ready.");
//       return;
//     }

//     const video = videoRef.current;
//     const canvas = canvasRef.current;

//     canvas.width = video.videoWidth || 640;
//     canvas.height = video.videoHeight || 480;

//     const context = canvas.getContext("2d");

//     context.drawImage(
//       video,
//       0,
//       0,
//       canvas.width,
//       canvas.height
//     );

//     const image = canvas.toDataURL("image/jpeg", 0.85);

//     setFaceImage(image);

//     stopCamera();
//     setShowCameraModal(false);

//     setAttendanceMessage(
//       "Photo captured successfully. Now capture location."
//     );
//   };

//   const captureLocation = () => {
//     setAttendanceError("");
//     setAttendanceMessage("");

//     if (!navigator.geolocation) {
//       setAttendanceError(
//         "Location is not supported by this browser."
//       );
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const latitude = position.coords.latitude;
//         const longitude = position.coords.longitude;
//         const accuracy = position.coords.accuracy;

//         const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

//         const locationData = {
//           latitude,
//           longitude,
//           accuracy,
//           capturedAt: new Date().toISOString(),
//           mapsUrl,
//         };

//         setCapturedLocation(locationData);

//         setAttendanceMessage(
//           `Location captured successfully. Accuracy: ${Math.round(
//             accuracy
//           )} meters.`
//         );
//       },
//       () => {
//         setAttendanceError(
//           "Location permission is required to mark attendance."
//         );
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 15000,
//         maximumAge: 0,
//       }
//     );
//   };

//   const markAttendance = (type = "Present") => {
//     setAttendanceError("");
//     setAttendanceMessage("");

//     if (!loggedEmployee) {
//       setAttendanceError("Employee login required.");
//       return;
//     }

//     const alreadyMarked = attendance.some(
//       (item) =>
//         item.employeeId === loggedEmployee.id &&
//         item.date === today
//     );

//     if (alreadyMarked) {
//       setAttendanceError(
//         "Today's attendance is already marked."
//       );
//       return;
//     }

//     if (!faceImage) {
//       setAttendanceError(
//         "Please capture your attendance photo first."
//       );
//       return;
//     }

//     if (!capturedLocation) {
//       setAttendanceError(
//         "Please capture your location first."
//       );
//       return;
//     }

//     const now = new Date();

//     const attendanceRecord = {
//       id: Date.now(),
//       employeeId: loggedEmployee.id,
//       employeeName: loggedEmployee.name,

//       date: today,
//       time: formatTime(now),

//       type,

//       // Attendance photo
//       faceImage,

//       // Location captured at the same attendance event
//       latitude: capturedLocation.latitude,
//       longitude: capturedLocation.longitude,
//       accuracy: capturedLocation.accuracy,
//       locationCapturedAt:
//         capturedLocation.capturedAt,

//       // Google Maps
//       mapsUrl: capturedLocation.mapsUrl,

//       // Metadata
//       faceCaptured: true,
//       locationCaptured: true,
//       createdAt: now.toISOString(),
//     };

//     const updatedAttendance = [
//       ...attendance,
//       attendanceRecord,
//     ];

//     setAttendance(updatedAttendance);

//     localStorage.setItem(
//       ATTENDANCE_KEY,
//       JSON.stringify(updatedAttendance)
//     );

//     // Also save latest captured face with employee
//     const updatedEmployees = employees.map((employee) =>
//       employee.id === loggedEmployee.id
//         ? {
//             ...employee,
//             faceImage:
//               employee.faceImage || faceImage,
//           }
//         : employee
//     );

//     setEmployees(updatedEmployees);

//     localStorage.setItem(
//       EMPLOYEE_KEY,
//       JSON.stringify(updatedEmployees)
//     );

//     setLoggedEmployee({
//       ...loggedEmployee,
//       faceImage:
//         loggedEmployee.faceImage || faceImage,
//     });

//     setFaceImage("");
//     setCapturedLocation(null);

//     setAttendanceMessage(
//       `Attendance marked successfully for ${formatDate(today)} at ${formatTime(
//         now
//       )}.`
//     );
//   };

//   // const getEmployeeRecordForDate = (
//   //   employeeId,
//   //   date
//   // ) => {
//   //   return attendance.find(
//   //     (item) =>
//   //       item.employeeId === employeeId &&
//   //       item.date === date
//   //   );
//   // };

//   const getDaysInMonth = (year, month) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const salaryData = useMemo(() => {
//     if (!selectedSalaryEmployee) return null;

//     const employee = employees.find(
//       (item) => item.id === selectedSalaryEmployee
//     );

//     if (!employee) return null;

//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     const daysInMonth = getDaysInMonth(year, month);

//     const records = attendance.filter(
//       (item) =>
//         item.employeeId === employee.id &&
//         new Date(`${item.date}T00:00:00`).getFullYear() ===
//           year &&
//         new Date(`${item.date}T00:00:00`).getMonth() ===
//           month
//     );

//     const presentDays = records.filter(
//       (item) => item.type === "Present"
//     ).length;

//     const halfDays = records.filter(
//       (item) => item.type === "Half Day"
//     ).length;

//     const markedDays = records.length;

//     const absentDays = Math.max(
//       0,
//       daysInMonth - markedDays
//     );

//     const freeLeaves = Math.min(2, absentDays);

//     const deductedLeaves = Math.max(
//       0,
//       absentDays - 2
//     );

//     const monthlySalary = Number(employee.salary || 0);

//     const dailySalary =
//       daysInMonth > 0
//         ? monthlySalary / daysInMonth
//         : 0;

//     const halfDayDeduction =
//       dailySalary / 2;

//     const leaveDeduction =
//       deductedLeaves * halfDayDeduction;

//     const halfDaySalaryDeduction =
//       halfDays * halfDayDeduction;

//     const totalDeduction =
//       leaveDeduction +
//       halfDaySalaryDeduction;

//     const payableSalary = Math.max(
//       0,
//       monthlySalary - totalDeduction
//     );

//     return {
//       employee,
//       daysInMonth,
//       presentDays,
//       halfDays,
//       markedDays,
//       absentDays,
//       freeLeaves,
//       deductedLeaves,
//       monthlySalary,
//       dailySalary,
//       halfDayDeduction,
//       leaveDeduction,
//       halfDaySalaryDeduction,
//       totalDeduction,
//       payableSalary,
//     };
//   }, [
//     selectedSalaryEmployee,
//     employees,
//     attendance,
//   ]);

//   const openPhoto = (photo) => {
//     if (!photo) return;

//     setSelectedPhoto(photo);
//     setShowPhotoModal(true);
//   };

//   const closePhoto = () => {
//     setSelectedPhoto(null);
//     setShowPhotoModal(false);
//   };

//   const resetEmployeeAttendanceCapture = () => {
//     setFaceImage("");
//     setCapturedLocation(null);
//     setAttendanceError("");
//     setAttendanceMessage("");
//   };

//   const renderLocationInfo = (item) => {
//     if (
//       item.latitude === undefined ||
//       item.longitude === undefined
//     ) {
//       return (
//         <span className="location-not-found">
//           Not captured
//         </span>
//       );
//     }

//     return (
//       <div className="location-info">
//         <div>
//           <strong>GPS</strong>
//           <span>
//             {Number(item.latitude).toFixed(6)},{" "}
//             {Number(item.longitude).toFixed(6)}
//           </span>
//         </div>

//         <small>
//           Accuracy:{" "}
//           {item.accuracy
//             ? `${Math.round(item.accuracy)} m`
//             : "-"}
//         </small>

//         {item.mapsUrl && (
//           <a
//             href={item.mapsUrl}
//             target="_blank"
//             rel="noreferrer"
//             className="map-link"
//           >
//             View on Google Maps
//           </a>
//         )}
//       </div>
//     );
//   };

//   if (!loggedEmployee && !isAdminLoggedIn) {
//     return (
//       <div className="attendance-page login-page">
//         <div className="login-card">
//           <div className="clinic-logo">
//             PA
//           </div>

//           <h1>Employee Attendance</h1>

//           <p className="login-subtitle">
//             Secure attendance portal
//           </p>

//           <div className="login-tabs">
//             <button
//               className={
//                 loginMode === "employee"
//                   ? "active"
//                   : ""
//               }
//               onClick={() =>
//                 setLoginMode("employee")
//               }
//             >
//               Employee Login
//             </button>

//             <button
//               className={
//                 loginMode === "admin"
//                   ? "active"
//                   : ""
//               }
//               onClick={() =>
//                 setLoginMode("admin")
//               }
//             >
//               Admin Login
//             </button>
//           </div>

//           <form onSubmit={handleLogin}>
//             <label>
//               {loginMode === "employee"
//                 ? "Employee ID"
//                 : "Admin Username"}
//             </label>

//             <input
//               type="text"
//               value={loginId}
//               placeholder={
//                 loginMode === "employee"
//                   ? "EMP-0001"
//                   : "admin"
//               }
//               onChange={(e) =>
//                 setLoginId(e.target.value)
//               }
//             />

//             <label>Password</label>

//             <input
//               type="password"
//               value={loginPassword}
//               placeholder="Enter password"
//               onChange={(e) =>
//                 setLoginPassword(e.target.value)
//               }
//             />

//             {loginError && (
//               <div className="error-message">
//                 {loginError}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="primary-btn login-btn"
//             >
//               Login
//             </button>
//           </form>

//           {loginMode === "admin" && (
//             <div className="demo-login">
//               <strong>Demo Admin Login</strong>
//               <span>Username: admin</span>
//               <span>Password: admin123</span>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   if (loggedEmployee) {
//     const myAttendance = getEmployeeAttendance(
//       loggedEmployee.id
//     );

//     const alreadyMarkedToday = myAttendance.some(
//       (item) => item.date === today
//     );

//     return (
//       <div className="attendance-page">
//         <header className="employee-header">
//           <div>
//             <span className="brand-small">
//               PUNAR AXIS THERAPY
//             </span>

//             <h1>Employee Attendance Portal</h1>
//           </div>

//           <button
//             className="logout-btn"
//             onClick={logout}
//           >
//             Logout
//           </button>
//         </header>

//         <main className="employee-content">
//           <section className="employee-welcome-card">
//             <div className="employee-avatar-large">
//               {loggedEmployee.name
//                 ?.charAt(0)
//                 ?.toUpperCase()}
//             </div>

//             <div>
//               <span>Welcome</span>
//               <h2>{loggedEmployee.name}</h2>
//               <p>
//                 {loggedEmployee.id}{" "}
//                 {loggedEmployee.designation
//                   ? `• ${loggedEmployee.designation}`
//                   : ""}
//               </p>
//             </div>
//           </section>

//           <section className="employee-info-grid">
//             <div className="info-card">
//               <span>Employee ID</span>
//               <strong>{loggedEmployee.id}</strong>
//             </div>

//             <div className="info-card">
//               <span>Department</span>
//               <strong>
//                 {loggedEmployee.department || "-"}
//               </strong>
//             </div>

//             <div className="info-card">
//               <span>Designation</span>
//               <strong>
//                 {loggedEmployee.designation || "-"}
//               </strong>
//             </div>
//           </section>

//           <section className="attendance-mark-card">
//             <div className="section-title">
//               <div>
//                 <h2>Mark Today's Attendance</h2>
//                 <p>
//                   Photo and GPS location are captured
//                   with this attendance.
//                 </p>
//               </div>

//               <div className="today-date">
//                 {formatDate(today)}
//               </div>
//             </div>

//             {alreadyMarkedToday ? (
//               <div className="already-marked">
//                 <div className="success-icon">
//                   ✓
//                 </div>

//                 <div>
//                   <h3>
//                     Today's attendance is already
//                     marked
//                   </h3>

//                   <p>
//                     You cannot mark attendance twice
//                     on the same day.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="capture-grid">
//                   <div className="capture-card">
//                     <div className="capture-icon">
//                       📸
//                     </div>

//                     <h3>Attendance Photo</h3>

//                     <p>
//                       Capture your photo before
//                       marking attendance.
//                     </p>

//                     {faceImage ? (
//                       <div className="captured-preview">
//                         <img
//                           src={faceImage}
//                           alt="Attendance"
//                         />

//                         <span className="captured-badge">
//                           ✓ Photo Captured
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="empty-capture">
//                         No photo captured
//                       </div>
//                     )}

//                     <button
//                       className="secondary-btn"
//                       onClick={startCamera}
//                     >
//                       {faceImage
//                         ? "Retake Photo"
//                         : "Capture Photo"}
//                     </button>
//                   </div>

//                   <div className="capture-card">
//                     <div className="capture-icon">
//                       📍
//                     </div>

//                     <h3>Attendance Location</h3>

//                     <p>
//                       Capture GPS location where
//                       attendance is marked.
//                     </p>

//                     {capturedLocation ? (
//                       <div className="location-captured">
//                         <strong>
//                           ✓ Location Captured
//                         </strong>

//                         <span>
//                           Lat:{" "}
//                           {capturedLocation.latitude.toFixed(
//                             6
//                           )}
//                         </span>

//                         <span>
//                           Long:{" "}
//                           {capturedLocation.longitude.toFixed(
//                             6
//                           )}
//                         </span>

//                         <span>
//                           Accuracy:{" "}
//                           {Math.round(
//                             capturedLocation.accuracy
//                           )}{" "}
//                           m
//                         </span>
//                       </div>
//                     ) : (
//                       <div className="empty-capture">
//                         No location captured
//                       </div>
//                     )}

//                     <button
//                       className="secondary-btn"
//                       onClick={captureLocation}
//                     >
//                       {capturedLocation
//                         ? "Recapture Location"
//                         : "Capture Location"}
//                     </button>
//                   </div>
//                 </div>

//                 {attendanceMessage && (
//                   <div className="success-message">
//                     {attendanceMessage}
//                   </div>
//                 )}

//                 {attendanceError && (
//                   <div className="error-message">
//                     {attendanceError}
//                   </div>
//                 )}

//                 <div className="attendance-buttons">
//                   <button
//                     className="primary-btn"
//                     disabled={
//                       !faceImage ||
//                       !capturedLocation
//                     }
//                     onClick={() =>
//                       markAttendance("Present")
//                     }
//                   >
//                     ✓ Mark Present
//                   </button>

//                   <button
//                     className="half-day-btn"
//                     disabled={
//                       !faceImage ||
//                       !capturedLocation
//                     }
//                     onClick={() =>
//                       markAttendance("Half Day")
//                     }
//                   >
//                     Mark Half Day
//                   </button>

//                   <button
//                     className="reset-btn"
//                     onClick={
//                       resetEmployeeAttendanceCapture
//                     }
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </>
//             )}
//           </section>

//           <section className="employee-history-card">
//             <div className="section-title">
//               <div>
//                 <h2>My Attendance History</h2>
//                 <p>
//                   Your attendance records only.
//                 </p>
//               </div>
//             </div>

//             {myAttendance.length === 0 ? (
//               <div className="empty-state">
//                 No attendance records found.
//               </div>
//             ) : (
//               <div className="attendance-table-wrapper">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Date</th>
//                       <th>Time</th>
//                       <th>Status</th>
//                       <th>Photo</th>
//                       <th>Location</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {[...myAttendance]
//                       .reverse()
//                       .map((item) => (
//                         <tr key={item.id}>
//                           <td>
//                             {formatDate(item.date)}
//                           </td>

//                           <td>{item.time}</td>

//                           <td>
//                             <span
//                               className={`status-badge ${item.type
//                                 .toLowerCase()
//                                 .replace(
//                                   " ",
//                                   "-"
//                                 )}`}
//                             >
//                               {item.type}
//                             </span>
//                           </td>

//                           <td>
//                             {item.faceImage ? (
//                               <button
//                                 className="photo-view-btn"
//                                 onClick={() =>
//                                   openPhoto(
//                                     item.faceImage
//                                   )
//                                 }
//                               >
//                                 View Photo
//                               </button>
//                             ) : (
//                               "-"
//                             )}
//                           </td>

//                           <td>
//                             {renderLocationInfo(item)}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>
//         </main>

//         {showCameraModal && (
//           <div className="camera-overlay">
//             <div className="camera-modal">
//               <div className="camera-header">
//                 <div>
//                   <h2>Capture Attendance Photo</h2>
//                   <p>
//                     Keep your face clearly visible.
//                   </p>
//                 </div>

//                 <button
//                   className="close-btn"
//                   onClick={() => {
//                     stopCamera();
//                     setShowCameraModal(false);
//                   }}
//                 >
//                   ×
//                 </button>
//               </div>

//               <div className="camera-preview">
//                 <video
//                   ref={videoRef}
//                   autoPlay
//                   playsInline
//                   muted
//                 />
//               </div>

//               <canvas
//                 ref={canvasRef}
//                 style={{ display: "none" }}
//               />

//               <div className="camera-actions">
//                 <button
//                   className="primary-btn"
//                   onClick={capturePhoto}
//                 >
//                   📸 Capture Photo
//                 </button>

//                 <button
//                   className="reset-btn"
//                   onClick={() => {
//                     stopCamera();
//                     setShowCameraModal(false);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {showPhotoModal && selectedPhoto && (
//           <div
//             className="photo-overlay"
//             onClick={closePhoto}
//           >
//             <div
//               className="photo-modal"
//               onClick={(e) =>
//                 e.stopPropagation()
//               }
//             >
//               <button
//                 className="photo-close-btn"
//                 onClick={closePhoto}
//               >
//                 ×
//               </button>

//               <img
//                 src={selectedPhoto}
//                 alt="Employee attendance"
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="attendance-page admin-page">
//       <header className="admin-header">
//         <div>
//           <span className="brand-small">
//             PUNAR AXIS THERAPY
//           </span>

//           <h1>Admin Attendance Dashboard</h1>
//         </div>

//         <button
//           className="logout-btn"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </header>

//       <main className="admin-content">
//         <div className="admin-tabs">
//           <button
//             className={
//               activeTab === "dashboard"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab("dashboard")
//             }
//           >
//             Dashboard
//           </button>

//           <button
//             className={
//               activeTab === "datewise"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab("datewise")
//             }
//           >
//             Date-wise Attendance
//           </button>

//           <button
//             className={
//               activeTab === "employees"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab("employees")
//             }
//           >
//             Employees
//           </button>

//           <button
//             className={
//               activeTab === "salary"
//                 ? "active"
//                 : ""
//             }
//             onClick={() =>
//               setActiveTab("salary")
//             }
//           >
//             Salary
//           </button>
//         </div>

//         {activeTab === "dashboard" && (
//           <>
//             <section className="stats-grid">
//               <div className="stat-card">
//                 <span>Total Employees</span>
//                 <strong>{employees.length}</strong>
//               </div>

//               <div className="stat-card">
//                 <span>Present Today</span>
//                 <strong>{presentToday}</strong>
//               </div>

//               <div className="stat-card">
//                 <span>Half Day Today</span>
//                 <strong>{halfDayToday}</strong>
//               </div>

//               <div className="stat-card">
//                 <span>Not Marked</span>
//                 <strong>
//                   {Math.max(
//                     0,
//                     employees.length -
//                       todayAttendance.length
//                   )}
//                 </strong>
//               </div>
//             </section>

//             <section className="admin-card">
//               <div className="section-title">
//                 <div>
//                   <h2>Today's Attendance</h2>
//                   <p>
//                     Photo, date, time and location
//                     captured during attendance.
//                   </p>
//                 </div>

//                 <span className="date-pill">
//                   {formatDate(today)}
//                 </span>
//               </div>

//               {todayAttendance.length === 0 ? (
//                 <div className="empty-state">
//                   No attendance marked today.
//                 </div>
//               ) : (
//                 <div className="attendance-table-wrapper">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Employee</th>
//                         <th>Date</th>
//                         <th>Time</th>
//                         <th>Status</th>
//                         <th>Photo</th>
//                         <th>Location</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {[...todayAttendance]
//                         .reverse()
//                         .map((item) => (
//                           <tr key={item.id}>
//                             <td>
//                               <strong>
//                                 {item.employeeName}
//                               </strong>

//                               <small className="table-sub">
//                                 {item.employeeId}
//                               </small>
//                             </td>

//                             <td>
//                               {formatDate(item.date)}
//                             </td>

//                             <td>{item.time}</td>

//                             <td>
//                               <span
//                                 className={`status-badge ${item.type
//                                   .toLowerCase()
//                                   .replace(
//                                     " ",
//                                     "-"
//                                   )}`}
//                               >
//                                 {item.type}
//                               </span>
//                             </td>

//                             <td>
//                               {item.faceImage ? (
//                                 <button
//                                   className="photo-view-btn"
//                                   onClick={() =>
//                                     openPhoto(
//                                       item.faceImage
//                                     )
//                                   }
//                                 >
//                                   📸 View Photo
//                                 </button>
//                               ) : (
//                                 "-"
//                               )}
//                             </td>

//                             <td>
//                               {renderLocationInfo(
//                                 item
//                               )}
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>
//           </>
//         )}

//         {activeTab === "datewise" && (
//           <>
//             <section className="filter-card">
//               <div>
//                 <label>Select Date</label>

//                 <input
//                   type="date"
//                   value={searchDate}
//                   onChange={(e) =>
//                     setSearchDate(e.target.value)
//                   }
//                 />
//               </div>

//               <div>
//                 <label>
//                   Search Employee
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="Name or Employee ID..."
//                   value={searchEmployee}
//                   onChange={(e) =>
//                     setSearchEmployee(
//                       e.target.value
//                     )
//                   }
//                 />
//               </div>
//             </section>

//             <section className="admin-card">
//               <div className="section-title">
//                 <div>
//                   <h2>
//                     Attendance for{" "}
//                     {formatDate(searchDate)}
//                   </h2>

//                   <p>
//                     {filteredDateAttendance.length}{" "}
//                     attendance record(s)
//                   </p>
//                 </div>
//               </div>

//               {filteredDateAttendance.length ===
//               0 ? (
//                 <div className="empty-state">
//                   No attendance found for this
//                   date/search.
//                 </div>
//               ) : (
//                 <div className="attendance-table-wrapper">
//                   <table>
//                     <thead>
//                       <tr>
//                         <th>Employee</th>
//                         <th>Date</th>
//                         <th>Time</th>
//                         <th>Status</th>
//                         <th>Photo</th>
//                         <th>GPS Location</th>
//                         <th>Map</th>
//                       </tr>
//                     </thead>

//                     <tbody>
//                       {filteredDateAttendance.map(
//                         (item) => (
//                           <tr key={item.id}>
//                             <td>
//                               <strong>
//                                 {item.employeeName}
//                               </strong>

//                               <small className="table-sub">
//                                 {item.employeeId}
//                               </small>
//                             </td>

//                             <td>
//                               {formatDate(
//                                 item.date
//                               )}
//                             </td>

//                             <td>{item.time}</td>

//                             <td>
//                               <span
//                                 className={`status-badge ${item.type
//                                   .toLowerCase()
//                                   .replace(
//                                     " ",
//                                     "-"
//                                   )}`}
//                               >
//                                 {item.type}
//                               </span>
//                             </td>

//                             <td>
//                               {item.faceImage ? (
//                                 <button
//                                   className="photo-view-btn"
//                                   onClick={() =>
//                                     openPhoto(
//                                       item.faceImage
//                                     )
//                                   }
//                                 >
//                                   View Photo
//                                 </button>
//                               ) : (
//                                 "No Photo"
//                               )}
//                             </td>

//                             <td>
//                               <div className="gps-box">
//                                 <span>
//                                   Lat:{" "}
//                                   {Number(
//                                     item.latitude
//                                   ).toFixed(6)}
//                                 </span>

//                                 <span>
//                                   Long:{" "}
//                                   {Number(
//                                     item.longitude
//                                   ).toFixed(6)}
//                                 </span>

//                                 <span>
//                                   Accuracy:{" "}
//                                   {item.accuracy
//                                     ? `${Math.round(
//                                         item.accuracy
//                                       )} m`
//                                     : "-"}
//                                 </span>
//                               </div>
//                             </td>

//                             <td>
//                               {item.mapsUrl ? (
//                                 <a
//                                   href={
//                                     item.mapsUrl
//                                   }
//                                   target="_blank"
//                                   rel="noreferrer"
//                                   className="map-button"
//                                 >
//                                   🗺️ Open Map
//                                 </a>
//                               ) : (
//                                 "-"
//                               )}
//                             </td>
//                           </tr>
//                         )
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </section>

//             <section className="admin-card employee-search-card">
//               <div className="section-title">
//                 <div>
//                   <h2>
//                     Employee Attendance Search
//                   </h2>

//                   <p>
//                     Search an employee to see
//                     date-wise attendance.
//                   </p>
//                 </div>
//               </div>

//               <div className="employee-search-input">
//                 <input
//                   type="text"
//                   placeholder="Search employee name or ID, e.g. Manish Kumar Singh"
//                   value={searchEmployee}
//                   onChange={(e) =>
//                     setSearchEmployee(
//                       e.target.value
//                     )
//                   }
//                 />
//               </div>

//               {searchEmployee.trim() && (
//                 <>
//                   {searchedEmployeeRecords.length ===
//                   0 ? (
//                     <div className="empty-state">
//                       No employee attendance found.
//                     </div>
//                   ) : (
//                     <div className="attendance-table-wrapper">
//                       <table>
//                         <thead>
//                           <tr>
//                             <th>Date</th>
//                             <th>Time</th>
//                             <th>Status</th>
//                             <th>Photo</th>
//                             <th>Location</th>
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {[
//                             ...searchedEmployeeRecords,
//                           ]
//                             .sort(
//                               (a, b) =>
//                                 new Date(
//                                   b.date
//                                 ) -
//                                 new Date(a.date)
//                             )
//                             .map((item) => (
//                               <tr key={item.id}>
//                                 <td>
//                                   {formatDate(
//                                     item.date
//                                   )}
//                                 </td>

//                                 <td>{item.time}</td>

//                                 <td>
//                                   <span
//                                     className={`status-badge ${item.type
//                                       .toLowerCase()
//                                       .replace(
//                                         " ",
//                                         "-"
//                                       )}`}
//                                   >
//                                     {item.type}
//                                   </span>
//                                 </td>

//                                 <td>
//                                   {item.faceImage ? (
//                                     <button
//                                       className="photo-view-btn"
//                                       onClick={() =>
//                                         openPhoto(
//                                           item.faceImage
//                                         )
//                                       }
//                                     >
//                                       View Photo
//                                     </button>
//                                   ) : (
//                                     "-"
//                                   )}
//                                 </td>

//                                 <td>
//                                   {renderLocationInfo(
//                                     item
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </>
//               )}
//             </section>
//           </>
//         )}

//         {activeTab === "employees" && (
//           <section className="admin-card">
//             <div className="section-title">
//               <div>
//                 <h2>Employee Management</h2>
//                 <p>
//                   Add employees and automatically
//                   generate Employee IDs.
//                 </p>
//               </div>

//               <button
//                 className="primary-btn"
//                 onClick={() =>
//                   setShowEmployeeModal(true)
//                 }
//               >
//                 + Add Employee
//               </button>
//             </div>

//             {employees.length === 0 ? (
//               <div className="empty-state">
//                 No employees added yet.
//               </div>
//             ) : (
//               <div className="attendance-table-wrapper">
//                 <table>
//                   <thead>
//                     <tr>
//                       <th>Employee ID</th>
//                       <th>Employee</th>
//                       <th>Mobile</th>
//                       <th>Department</th>
//                       <th>Designation</th>
//                       <th>Salary</th>
//                       <th>Face</th>
//                       <th>Action</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {employees.map((employee) => (
//                       <tr key={employee.id}>
//                         <td>
//                           <strong>
//                             {employee.id}
//                           </strong>
//                         </td>

//                         <td>{employee.name}</td>

//                         <td>
//                           {employee.mobile || "-"}
//                         </td>

//                         <td>
//                           {employee.department ||
//                             "-"}
//                         </td>

//                         <td>
//                           {employee.designation ||
//                             "-"}
//                         </td>

//                         <td>
//                           ₹
//                           {Number(
//                             employee.salary || 0
//                           ).toLocaleString("en-IN")}
//                         </td>

//                         <td>
//                           {employee.faceImage ? (
//                             <button
//                               className="photo-view-btn"
//                               onClick={() =>
//                                 openPhoto(
//                                   employee.faceImage
//                                 )
//                               }
//                             >
//                               View Face
//                             </button>
//                           ) : (
//                             "Not Registered"
//                           )}
//                         </td>

//                         <td>
//                           <button
//                             className="delete-employee-btn"
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
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>
//         )}

//         {activeTab === "salary" && (
//           <section className="admin-card">
//             <div className="section-title">
//               <div>
//                 <h2>Salary Management</h2>
//                 <p>
//                   First 2 leave days have no salary
//                   deduction. From 3rd leave, half-day
//                   salary is deducted.
//                 </p>
//               </div>
//             </div>

//             <div className="salary-selector">
//               <label>Select Employee</label>

//               <select
//                 value={selectedSalaryEmployee}
//                 onChange={(e) =>
//                   setSelectedSalaryEmployee(
//                     e.target.value
//                   )
//                 }
//               >
//                 <option value="">
//                   Select employee
//                 </option>

//                 {employees.map((employee) => (
//                   <option
//                     key={employee.id}
//                     value={employee.id}
//                   >
//                     {employee.name} -{" "}
//                     {employee.id}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {salaryData && (
//               <div className="salary-section">
//                 <div className="salary-header-card">
//                   <div>
//                     <span>Employee</span>
//                     <h2>
//                       {salaryData.employee.name}
//                     </h2>
//                     <p>
//                       {salaryData.employee.id}
//                     </p>
//                   </div>

//                   <div>
//                     <span>Monthly Salary</span>
//                     <strong>
//                       ₹
//                       {salaryData.monthlySalary.toLocaleString(
//                         "en-IN",
//                         {
//                           maximumFractionDigits: 2,
//                         }
//                       )}
//                     </strong>
//                   </div>
//                 </div>

//                 <div className="salary-stats">
//                   <div>
//                     <span>Present Days</span>
//                     <strong>
//                       {salaryData.presentDays}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Half Days</span>
//                     <strong>
//                       {salaryData.halfDays}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Absent Days</span>
//                     <strong>
//                       {salaryData.absentDays}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Free Leaves</span>
//                     <strong>
//                       {salaryData.freeLeaves}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>Deducted Leaves</span>
//                     <strong>
//                       {salaryData.deductedLeaves}
//                     </strong>
//                   </div>
//                 </div>

//                 <div className="salary-calculation">
//                   <div>
//                     <span>
//                       Half-day salary deduction
//                     </span>
//                     <strong>
//                       ₹
//                       {salaryData.halfDayDeduction.toFixed(
//                         2
//                       )}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>
//                       Leave deduction
//                     </span>
//                     <strong>
//                       ₹
//                       {salaryData.leaveDeduction.toFixed(
//                         2
//                       )}
//                     </strong>
//                   </div>

//                   <div>
//                     <span>
//                       Half-day deductions
//                     </span>
//                     <strong>
//                       ₹
//                       {salaryData.halfDaySalaryDeduction.toFixed(
//                         2
//                       )}
//                     </strong>
//                   </div>

//                   <div className="total-deduction">
//                     <span>Total Deduction</span>
//                     <strong>
//                       ₹
//                       {salaryData.totalDeduction.toFixed(
//                         2
//                       )}
//                     </strong>
//                   </div>

//                   <div className="payable-salary">
//                     <span>Payable Salary</span>
//                     <strong>
//                       ₹
//                       {salaryData.payableSalary.toFixed(
//                         2
//                       )}
//                     </strong>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </section>
//         )}
//       </main>

//       {showEmployeeModal && (
//         <div className="modal-overlay">
//           <div className="employee-modal">
//             <div className="modal-header">
//               <div>
//                 <h2>Add New Employee</h2>
//                 <p>
//                   Employee ID will be generated
//                   automatically.
//                 </p>
//               </div>

//               <button
//                 className="close-btn"
//                 onClick={() =>
//                   setShowEmployeeModal(false)
//                 }
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={createEmployee}>
//               <div className="form-grid">
//                 <div>
//                   <label>Employee Name</label>

//                   <input
//                     name="name"
//                     value={newEmployee.name}
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                     placeholder="Employee full name"
//                   />
//                 </div>

//                 <div>
//                   <label>Mobile Number</label>

//                   <input
//                     name="mobile"
//                     value={newEmployee.mobile}
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                     placeholder="Mobile number"
//                   />
//                 </div>

//                 <div>
//                   <label>Department</label>

//                   <input
//                     name="department"
//                     value={
//                       newEmployee.department
//                     }
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                     placeholder="Department"
//                   />
//                 </div>

//                 <div>
//                   <label>Designation</label>

//                   <input
//                     name="designation"
//                     value={
//                       newEmployee.designation
//                     }
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                     placeholder="Designation"
//                   />
//                 </div>

//                 <div>
//                   <label>Monthly Salary</label>

//                   <input
//                     type="number"
//                     name="salary"
//                     value={newEmployee.salary}
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                     placeholder="Monthly salary"
//                   />
//                 </div>

//                 <div>
//                   <label>Joining Date</label>

//                   <input
//                     type="date"
//                     name="joiningDate"
//                     value={
//                       newEmployee.joiningDate
//                     }
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                   />
//                 </div>

//                 <div className="full-width">
//                   <label>
//                     Employee Login Password
//                   </label>

//                   <input
//                     type="password"
//                     name="password"
//                     value={
//                       newEmployee.password
//                     }
//                     onChange={
//                       handleNewEmployeeChange
//                     }
//                     placeholder="Create employee password"
//                   />
//                 </div>
//               </div>

//               <div className="modal-actions">
//                 <button
//                   type="button"
//                   className="reset-btn"
//                   onClick={() =>
//                     setShowEmployeeModal(false)
//                   }
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="primary-btn"
//                 >
//                   Create Employee
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {showPhotoModal && selectedPhoto && (
//         <div
//           className="photo-overlay"
//           onClick={closePhoto}
//         >
//           <div
//             className="photo-modal"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >
//             <button
//               className="photo-close-btn"
//               onClick={closePhoto}
//             >
//               ×
//             </button>

//             <img
//               src={selectedPhoto}
//               alt="Attendance"
//             />

//             <div className="photo-modal-caption">
//               Attendance Photo
//             </div>
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
const SHIFT_SETTINGS_KEY = "clinic_employee_shift_settings";
const DEFAULT_SHIFT_START = "10:00";
const DEFAULT_SHIFT_END = "18:00";
const DEFAULT_GRACE_MINUTES = 10;
const REQUIRED_WORK_MINUTES = 8 * 60;

const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
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

const formatTime = (date = new Date()) =>
  date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const getMinutesFromTime = (time) => {
  if (!time) return null;

  const parts = String(time)
    .replace(/\s/g, "")
    .match(/(\d{1,2}):(\d{2})(?::(\d{2}))?(AM|PM)?/i);

  if (!parts) return null;

  let hour = Number(parts[1]);
  const minute = Number(parts[2]);

  if (parts[4]) {
    const period = parts[4].toUpperCase();

    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;
  }

  return hour * 60 + minute;
};

const getEmployeeShift = (employee) => {
  let settings = {};

  try {
    settings = JSON.parse(
      localStorage.getItem(SHIFT_SETTINGS_KEY) || "{}"
    );
  } catch {
    settings = {};
  }

  const saved = employee?.id ? settings[employee.id] || {} : {};

  return {
    inTime: saved.inTime || employee?.shiftInTime || DEFAULT_SHIFT_START,
    outTime: saved.outTime || employee?.shiftOutTime || DEFAULT_SHIFT_END,
    graceMinutes: Number(
      saved.graceMinutes ?? employee?.graceMinutes ?? DEFAULT_GRACE_MINUTES
    ),
  };
};

const getLateInfo = (date = new Date(), employee = null) => {
  const shift = getEmployeeShift(employee);
  const shiftStart = getMinutesFromTime(shift.inTime);
  const current = date.getHours() * 60 + date.getMinutes();
  const safeShiftStart = shiftStart === null ? 600 : shiftStart;
  const graceMinutes = Math.max(0, Number(shift.graceMinutes || 0));
  const lateMinutes = Math.max(0, current - safeShiftStart);

  return {
    lateMinutes,
    graceMinutes,
    shift,
    isLate: lateMinutes > graceMinutes,
  };
};

const getWorkingMinutes = (inTime, outTime) => {
  const inMinutes = getMinutesFromTime(inTime);
  const outMinutes = getMinutesFromTime(outTime);

  if (inMinutes === null || outMinutes === null) return 0;

  let difference = outMinutes - inMinutes;

  if (difference < 0) {
    difference += 24 * 60;
  }

  return difference;
};

const formatDuration = (minutes) => {
  if (minutes === null || minutes === undefined) return "-";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hrs}h ${mins}m`;
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

// const getDaysInMonth = (year, month) => {
//   return new Date(year, month + 1, 0).getDate();
// };

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

  const [showEmployeeModal, setShowEmployeeModal] =
    useState(false);

  const [showCameraModal, setShowCameraModal] =
    useState(false);

  const [showPhotoModal, setShowPhotoModal] =
    useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);

  const [faceImage, setFaceImage] = useState("");
  const [capturedLocation, setCapturedLocation] =
    useState(null);

  const [capturePurpose, setCapturePurpose] =
    useState("in");

  const [attendanceMessage, setAttendanceMessage] =
    useState("");

  const [attendanceError, setAttendanceError] =
    useState("");

  const [searchDate, setSearchDate] =
    useState(getToday());

  const [searchEmployee, setSearchEmployee] =
    useState("");

  const [selectedSalaryEmployee, setSelectedSalaryEmployee] =
    useState("");
// const [selectedEmployee, setSelectedEmployee] = useState("");

const [selectedSalaryMonth, setSelectedSalaryMonth] = useState(() => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}`;
});




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
    const savedEmployees =
      localStorage.getItem(EMPLOYEE_KEY);

    const savedAttendance =
      localStorage.getItem(ATTENDANCE_KEY);

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
        cameraStream.getTracks().forEach((track) =>
          track.stop()
        );
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  const today = getToday();

  // const todayAttendance = useMemo(() => {
  //   return attendance.filter(
  //     (item) => item.date === today
  //   );
  // }, [attendance, today]);

  const todayAttendance = useMemo(() => {
  const markedAttendance = attendance.filter(
    (item) => item.date === today
  );

  const absentEmployees = employees
    .filter(
      (employee) =>
        !attendance.some(
          (item) =>
            item.employeeId === employee.id &&
            item.date === today
        )
    )
    .map((employee) => ({
      id: `absent-${employee.id}-${today}`,
      employeeId: employee.id,
      employeeName: employee.name,
      date: today,
      type: "Absent",
      isLate: false,
      lateMinutes: 0,
      shortHours: false,
      workingHours: "",
    }));

  return [...markedAttendance, ...absentEmployees];
}, [attendance, employees, today]);

  const presentToday = todayAttendance.filter(
    (item) => item.type === "Present"
  ).length;

  const halfDayToday = todayAttendance.filter(
    (item) => item.type === "Half Day"
  ).length;

  const absentToday = todayAttendance.filter(
    (item) => item.type === "Absent"
  ).length;

  const getEmployeeAttendance = (employeeId) => {
    return attendance.filter(
      (item) => item.employeeId === employeeId
    );
  };

  const getTodayRecord = (employeeId) => {
    return attendance.find(
      (item) =>
        item.employeeId === employeeId &&
        item.date === today
    );
  };

  const filteredDateAttendance = useMemo(() => {
    const search = searchEmployee
      .trim()
      .toLowerCase();

    return attendance.filter((item) => {
      const dateMatch = item.date === searchDate;

      const employeeMatch =
        !search ||
        item.employeeName
          ?.toLowerCase()
          .includes(search) ||
        item.employeeId
          ?.toLowerCase()
          .includes(search);

      return dateMatch && employeeMatch;
    });
  }, [attendance, searchDate, searchEmployee]);

  const searchedEmployeeRecords = useMemo(() => {
    const value = searchEmployee
      .trim()
      .toLowerCase();

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
        loginPassword === "PunarUd"
      ) {
        setIsAdminLoggedIn(true);
        setLoggedEmployee(null);
        setLoginId("");
        setLoginPassword("");
        return;
      }

      setLoginError(
        "Invalid admin username or password."
      );
      return;
    }

    const employee = employees.find(
      (item) =>
        item.id.toLowerCase() ===
          loginId.trim().toLowerCase() &&
        item.password === loginPassword
    );

    if (!employee) {
      setLoginError(
        "Invalid Employee ID or password."
      );
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
    resetEmployeeAttendanceCapture();
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

    const updatedEmployees = [
      ...employees,
      employee,
    ];

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

  const startCamera = async (purpose = "in") => {
    setAttendanceError("");
    setAttendanceMessage("");
    setCapturePurpose(purpose);

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
      cameraStream.getTracks().forEach((track) =>
        track.stop()
      );
    }

    setCameraStream(null);
  };

  const capturePhoto = () => {
    if (
      !videoRef.current ||
      !canvasRef.current
    ) {
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

    const image = canvas.toDataURL(
      "image/jpeg",
      0.85
    );

    setFaceImage(image);

    stopCamera();
    setShowCameraModal(false);

    setAttendanceMessage(
      `${capturePurpose === "in" ? "Punch-In" : "Punch-Out"} photo captured successfully. Now capture location.`
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
        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;

        const mapsUrl =
          `https://www.google.com/maps?q=${latitude},${longitude}`;

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

  /*
   * IMPORTANT:
   * Old attendance records had "time".
   * They are automatically treated as old Punch-In time.
   */
  const getInTime = (record) => {
    if (!record) return null;

    return (
      record.inTime ||
      record.time ||
      null
    );
  };

  const getOutTime = (record) => {
    if (!record) return null;

    return record.outTime || null;
  };

  const calculateStatusForPunchIn = (now) => {
    const lateInfo = getLateInfo(now, loggedEmployee);

    if (!lateInfo.isLate) {
      return {
        type: "Present",
        lateMinutes: 0,
      };
    }

    /*
     * Count previous late instances in the current month.
     * 1st late  -> Half Day
     * 2nd late  -> Half Day
     * 3rd+ late -> Full Day Absent
     */
    const year = now.getFullYear();
    const month = now.getMonth();

    const previousLateCount =
      attendance.filter((item) => {
        if (
          item.employeeId !== loggedEmployee?.id
        ) {
          return false;
        }

        const itemDate = new Date(
          `${item.date}T00:00:00`
        );

        const itemLate =
          item.isLate ||
          Number(item.lateMinutes || 0) >
            Number(lateInfo.graceMinutes || 0);

        return (
          itemDate.getFullYear() === year &&
          itemDate.getMonth() === month &&
          itemLate
        );
      }).length;

    const lateCountThisMonth =
      previousLateCount + 1;

    if (lateCountThisMonth <= 2) {
      return {
        type: "Half Day",
        lateMinutes: lateInfo.lateMinutes,
      };
    }

    return {
      type: "Absent",
      lateMinutes: lateInfo.lateMinutes,
    };
  };

  const markPunchIn = () => {
    setAttendanceError("");
    setAttendanceMessage("");

    if (!loggedEmployee) {
      setAttendanceError(
        "Employee login required."
      );
      return;
    }

    const existingRecord =
      getTodayRecord(loggedEmployee.id);

    if (existingRecord) {
      if (getInTime(existingRecord)) {
        setAttendanceError(
          "Today's Punch-In is already marked."
        );
        return;
      }
    }

    if (!faceImage) {
      setAttendanceError(
        "Please capture your Punch-In photo first."
      );
      return;
    }

    if (!capturedLocation) {
      setAttendanceError(
        "Please capture your Punch-In location first."
      );
      return;
    }

    const now = new Date();

    const statusInfo =
      calculateStatusForPunchIn(now);

    const inTime = formatTime(now);

    const baseRecord = existingRecord || {
      id: Date.now(),
      employeeId: loggedEmployee.id,
      employeeName: loggedEmployee.name,
      date: today,
      type: statusInfo.type,
    };

    const attendanceRecord = {
      ...baseRecord,

      inTime,
      time: inTime,

      type: statusInfo.type,

      shiftInTime: statusInfo.shift?.inTime || DEFAULT_SHIFT_START,
      shiftOutTime: statusInfo.shift?.outTime || DEFAULT_SHIFT_END,
      graceMinutes: Number(statusInfo.graceMinutes ?? DEFAULT_GRACE_MINUTES),

      lateMinutes: statusInfo.lateMinutes,
      isLate: statusInfo.lateMinutes > Number(statusInfo.graceMinutes || 0),

      inFaceImage: faceImage,
      faceImage: faceImage,

      inLatitude: capturedLocation.latitude,
      inLongitude: capturedLocation.longitude,
      inAccuracy: capturedLocation.accuracy,
      inLocationCapturedAt:
        capturedLocation.capturedAt,
      inMapsUrl: capturedLocation.mapsUrl,

      latitude: capturedLocation.latitude,
      longitude: capturedLocation.longitude,
      accuracy: capturedLocation.accuracy,
      locationCapturedAt:
        capturedLocation.capturedAt,
      mapsUrl: capturedLocation.mapsUrl,

      inAt: now.toISOString(),

      faceCaptured: true,
      locationCaptured: true,

      createdAt:
        baseRecord.createdAt ||
        now.toISOString(),

      updatedAt: now.toISOString(),
    };

    const updatedAttendance = existingRecord
      ? attendance.map((item) =>
          item.id === existingRecord.id
            ? attendanceRecord
            : item
        )
      : [...attendance, attendanceRecord];

    setAttendance(updatedAttendance);

    localStorage.setItem(
      ATTENDANCE_KEY,
      JSON.stringify(updatedAttendance)
    );

    const updatedEmployees =
      employees.map((employee) =>
        employee.id === loggedEmployee.id
          ? {
              ...employee,
              faceImage:
                employee.faceImage ||
                faceImage,
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
        loggedEmployee.faceImage ||
        faceImage,
    });

    setFaceImage("");
    setCapturedLocation(null);

    let message =
      `Punch-In marked successfully at ${inTime}.`;

    if (statusInfo.type === "Present") {
      message +=
        " You are Present.";
    } else if (
      statusInfo.type === "Half Day"
    ) {
      message +=
        ` You are late by ${statusInfo.lateMinutes} minutes. Attendance marked as Half Day.`;
    } else {
      message +=
        ` You are late by ${statusInfo.lateMinutes} minutes. Attendance marked as Full Day Absent as per monthly late policy.`;
    }

    setAttendanceMessage(message);
  };

  const markPunchOut = () => {
    setAttendanceError("");
    setAttendanceMessage("");

    if (!loggedEmployee) {
      setAttendanceError(
        "Employee login required."
      );
      return;
    }

    const existingRecord =
      getTodayRecord(loggedEmployee.id);

    if (!existingRecord) {
      setAttendanceError(
        "Please mark Punch-In first."
      );
      return;
    }

    if (!getInTime(existingRecord)) {
      setAttendanceError(
        "Punch-In record is missing. Please contact Admin."
      );
      return;
    }

    if (getOutTime(existingRecord)) {
      setAttendanceError(
        "Today's Punch-Out is already marked."
      );
      return;
    }

    if (!faceImage) {
      setAttendanceError(
        "Please capture your Punch-Out photo first."
      );
      return;
    }

    if (!capturedLocation) {
      setAttendanceError(
        "Please capture your Punch-Out location first."
      );
      return;
    }

    const now = new Date();

    const outTime = formatTime(now);

    const inTime = getInTime(
      existingRecord
    );

    const workingMinutes =
      getWorkingMinutes(
        inTime,
        outTime
      );

    const employeeShift = getEmployeeShift(loggedEmployee);
    const requiredWorkMinutes =
      getWorkingMinutes(
        employeeShift.inTime,
        employeeShift.outTime
      ) || REQUIRED_WORK_MINUTES;

    const shortHours =
      workingMinutes <
      requiredWorkMinutes;

    const updatedRecord = {
      ...existingRecord,

      outTime,

      outAt: now.toISOString(),

      outFaceImage: faceImage,

      outLatitude:
        capturedLocation.latitude,

      outLongitude:
        capturedLocation.longitude,

      outAccuracy:
        capturedLocation.accuracy,

      outLocationCapturedAt:
        capturedLocation.capturedAt,

      outMapsUrl:
        capturedLocation.mapsUrl,

      workingMinutes,

      workingHours:
        formatDuration(workingMinutes),

      requiredWorkMinutes,

      shortHours,

      updatedAt: now.toISOString(),
    };

    const updatedAttendance =
      attendance.map((item) =>
        item.id === existingRecord.id
          ? updatedRecord
          : item
      );

    setAttendance(updatedAttendance);

    localStorage.setItem(
      ATTENDANCE_KEY,
      JSON.stringify(updatedAttendance)
    );

    setFaceImage("");
    setCapturedLocation(null);

    let message =
      `Punch-Out marked successfully at ${outTime}. Working time: ${formatDuration(
        workingMinutes
      )}.`;

    if (shortHours) {
      message +=
        " Short Hours: Required 8 hours were not completed.";
    } else {
      message +=
        " Required working hours completed.";
    }

    setAttendanceMessage(message);
  };

  const resetEmployeeAttendanceCapture =
    () => {
      setFaceImage("");
      setCapturedLocation(null);
      setAttendanceError("");
      setAttendanceMessage("");
      setCapturePurpose("in");
    };

  const openPhoto = (photo) => {
    if (!photo) return;

    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setShowPhotoModal(false);
  };

  const renderStatus = (item) => {
    const type =
      item.type || "Present";

    return (
      <span
        className={`status-badge ${type
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        {type}
      </span>
    );
  };

  const renderLocationInfo = (
    item,
    mode = "in"
  ) => {
    const latitude =
      mode === "out"
        ? item.outLatitude
        : item.inLatitude !== undefined
        ? item.inLatitude
        : item.latitude;

    const longitude =
      mode === "out"
        ? item.outLongitude
        : item.inLongitude !== undefined
        ? item.inLongitude
        : item.longitude;

    const accuracy =
      mode === "out"
        ? item.outAccuracy
        : item.inAccuracy !== undefined
        ? item.inAccuracy
        : item.accuracy;

    const mapsUrl =
      mode === "out"
        ? item.outMapsUrl
        : item.inMapsUrl || item.mapsUrl;

    if (
      latitude === undefined ||
      longitude === undefined ||
      latitude === null ||
      longitude === null
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
          <strong>
            {mode === "out" ? "OUT GPS" : "IN GPS"}
          </strong>

          <span>
            {Number(latitude).toFixed(6)},{" "}
            {Number(longitude).toFixed(6)}
          </span>
        </div>

        <small>
          Accuracy:{" "}
          {accuracy
            ? `${Math.round(accuracy)} m`
            : "-"}
        </small>

        {mapsUrl && (
          <a
            href={mapsUrl}
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

  /*
   * SALARY CALCULATION
   *
   * Existing policy:
   * - First 2 absence/leave days: no salary deduction
   * - From 3rd qualifying absence: half-day salary deduction
   * - Half Day attendance: half-day salary deduction
   *
   * Late policy is already converted into Half Day / Absent
   * during Punch-In.
   */
  // const salaryData = useMemo(() => {
  //   if (!selectedSalaryEmployee) return null;

  //   const employee = employees.find(
  //     (item) =>
  //       item.id === selectedSalaryEmployee
  //   );

  //   if (!employee) return null;

  //   const currentDate = new Date();

  //   const year =
  //     currentDate.getFullYear();

  //   const month =
  //     currentDate.getMonth();

  //   const daysInMonth =
  //     getDaysInMonth(year, month);

  //   const records = attendance.filter(
  //     (item) => {
  //       if (
  //         item.employeeId !== employee.id
  //       ) {
  //         return false;
  //       }

  //       const recordDate = new Date(
  //         `${item.date}T00:00:00`
  //       );

  //       return (
  //         recordDate.getFullYear() ===
  //           year &&
  //         recordDate.getMonth() ===
  //           month
  //       );
  //     }
  //   );

  //   const presentDays =
  //     records.filter(
  //       (item) =>
  //         item.type === "Present"
  //     ).length;

  //   const halfDays =
  //     records.filter(
  //       (item) =>
  //         item.type === "Half Day"
  //     ).length;

  //   const absentMarkedDays =
  //     records.filter(
  //       (item) =>
  //         item.type === "Absent"
  //     ).length;

  //   const missingPunchDays =
  //     records.filter(
  //       (item) =>
  //         getInTime(item) &&
  //         !getOutTime(item)
  //     ).length;

  //   const workingDaysMarked =
  //     records.length;

  //   const absentDays = Math.max(
  //     0,
  //     daysInMonth -
  //       workingDaysMarked
  //   );

  //   const totalAbsence =
  //     absentDays +
  //     absentMarkedDays;

  //   const freeLeaves = Math.min(
  //     2,
  //     totalAbsence
  //   );

  //   const deductedLeaves =
  //     Math.max(
  //       0,
  //       totalAbsence - 2
  //     );

  //   const monthlySalary =
  //     Number(employee.salary || 0);

  //   const dailySalary =
  //     daysInMonth > 0
  //       ? monthlySalary /
  //         daysInMonth
  //       : 0;

  //   const halfDayDeduction =
  //     dailySalary / 2;

  //   const leaveDeduction =
  //     deductedLeaves *
  //     halfDayDeduction;

  //   const halfDaySalaryDeduction =
  //     halfDays *
  //     halfDayDeduction;

  //   const absentMarkedDeduction =
  //     absentMarkedDays *
  //     halfDayDeduction;

  //   const totalDeduction =
  //     leaveDeduction +
  //     halfDaySalaryDeduction +
  //     absentMarkedDeduction;

  //   const payableSalary =
  //     Math.max(
  //       0,
  //       monthlySalary -
  //         totalDeduction
  //     );

  //   return {
  //     employee,
  //     daysInMonth,
  //     presentDays,
  //     halfDays,
  //     absentDays,
  //     absentMarkedDays,
  //     missingPunchDays,
  //     workingDaysMarked,
  //     freeLeaves,
  //     deductedLeaves,
  //     monthlySalary,
  //     dailySalary,
  //     halfDayDeduction,
  //     leaveDeduction,
  //     halfDaySalaryDeduction,
  //     absentMarkedDeduction,
  //     totalDeduction,
  //     payableSalary,
  //   };
  // }, [
  //   selectedSalaryEmployee,
  //   employees,
  //   attendance,
  // ]);
const salaryData = useMemo(() => {
  const employee = employees.find(
    (item) => String(item.id) === String(selectedSalaryEmployee)
  );

  if (!employee) {
    return {
      employee: {
        name: "No Employee Selected",
        id: "",
      },
      monthlySalary: 0,
      presentDays: 0,
      halfDays: 0,
      absentDays: 0,
      freeLeaves: 0,
      deductedLeaves: 0,
      missingPunchDays: 0,
      shortHoursDays: 0,

      dailySalary: 0,
      halfDayDeduction: 0,
      halfDaySalaryDeduction: 0,
      leaveDeduction: 0,
      absentMarkedDeduction: 0,
      totalDeduction: 0,
      payableSalary: 0,

      // Compatibility fields
      salary: 0,
      monthlySalaryAmount: 0,
      dailySalaryAmount: 0,
      halfDaySalaryAmount: 0,
      totalSalaryDeduction: 0,
      finalSalary: 0,
      netSalary: 0,
    };
  }

  // ---------------------------------------------------------
  // BASIC EMPLOYEE INFORMATION
  // ---------------------------------------------------------

  const rawSalary =
    employee.salary ??
    employee.monthlySalary ??
    employee.monthlySalaryAmount ??
    employee.salaryAmount ??
    employee.ctcMonthly ??
    employee.ctc ??
    0;

  const monthlySalary = Number(
    String(rawSalary).replace(/[^0-9.-]/g, "")
  ) || 0;

  const employeeName =
    employee.name ||
    employee.employeeName ||
    "Employee";

  const employeeId =
    employee.employeeId ||
    employee.id ||
    employee.empId ||
    "";

  // ---------------------------------------------------------
  // DATE HELPERS
  // ---------------------------------------------------------

  const today = new Date();

  // const year = today.getFullYear();
  // const month = today.getMonth();
  const [selectedYear, selectedMonthNumber] =
  selectedSalaryMonth.split("-").map(Number);

const year = selectedYear;
const month = selectedMonthNumber - 1;

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  const normalizeDate = (date) => {
    const d = new Date(date);

    if (Number.isNaN(d.getTime())) return null;

    return new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate()
    );
  };

  const dateKey = (date) => {
    const d = normalizeDate(date);

    if (!d) return "";

    return `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // ---------------------------------------------------------
  // WEEKLY OFF
  // ---------------------------------------------------------
  // Default = Sunday
  // If employee has weeklyOff / weeklyOffDays configured,
  // that will be used instead.

  const dayNameToNumber = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const convertWeekOff = (value) => {
    if (typeof value === "number" && value >= 0 && value <= 6) {
      return value;
    }

    if (typeof value === "string") {
      const clean = value.trim().toLowerCase();

      if (dayNameToNumber[clean] !== undefined) {
        return dayNameToNumber[clean];
      }
    }

    return null;
  };

  let weeklyOffDays = [];

  const employeeWeeklyOff =
    employee.weeklyOffDays ??
    employee.weeklyOffDay ??
    employee.weeklyOff ??
    employee.week_off;

  if (Array.isArray(employeeWeeklyOff)) {
    weeklyOffDays = employeeWeeklyOff
      .map(convertWeekOff)
      .filter((x) => x !== null);
  } else if (employeeWeeklyOff !== undefined) {
    const converted = convertWeekOff(employeeWeeklyOff);

    if (converted !== null) {
      weeklyOffDays = [converted];
    }
  }

  // If nothing configured, Sunday is weekly off.
  if (weeklyOffDays.length === 0) {
    weeklyOffDays = [0];
  }

  // ---------------------------------------------------------
  // HOLIDAYS
  // ---------------------------------------------------------

  let holidayDates = [];

  const holidayStorageKeys = [
    "clinic_holidays",
    "holidays",
    "clinic_employee_holidays",
  ];

  holidayStorageKeys.forEach((key) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(key) || "[]"
      );

      if (Array.isArray(stored)) {
        stored.forEach((holiday) => {
          if (typeof holiday === "string") {
            holidayDates.push(dateKey(holiday));
          } else if (holiday?.date) {
            holidayDates.push(dateKey(holiday.date));
          }
        });
      }
    } catch (error) {
      // Ignore invalid holiday storage
    }
  });

  holidayDates = [...new Set(holidayDates)];

  // ---------------------------------------------------------
  // JOINING / EXIT DATE
  // ---------------------------------------------------------

  const joiningDate = normalizeDate(
    employee.joiningDate ||
    employee.dateOfJoining ||
    employee.joinDate
  );

  const exitDate = normalizeDate(
    employee.leavingDate ||
    employee.exitDate ||
    employee.lastWorkingDate
  );

  // ---------------------------------------------------------
  // WORKING DAY CHECK
  // ---------------------------------------------------------

  const isWeeklyOff = (date) => {
    return weeklyOffDays.includes(date.getDay());
  };

  const isHoliday = (date) => {
    return holidayDates.includes(dateKey(date));
  };

  const isEmployeeActiveOnDate = (date) => {
    if (joiningDate && date < joiningDate) {
      return false;
    }

    if (exitDate && date > exitDate) {
      return false;
    }

    return true;
  };

  const isWorkingDay = (date) => {
    if (!isEmployeeActiveOnDate(date)) {
      return false;
    }

    if (isWeeklyOff(date)) {
      return false;
    }

    if (isHoliday(date)) {
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------
  // TOTAL SCHEDULED WORKING DAYS IN THIS MONTH
  // ---------------------------------------------------------

  let totalWorkingDaysInMonth = 0;

  for (
    let d = new Date(monthStart);
    d <= monthEnd;
    d.setDate(d.getDate() + 1)
  ) {
    if (isWorkingDay(d)) {
      totalWorkingDaysInMonth++;
    }
  }

  // Safety fallback
  if (totalWorkingDaysInMonth <= 0) {
    totalWorkingDaysInMonth = monthEnd.getDate();
  }

  // ---------------------------------------------------------
  // DAILY SALARY
  // ---------------------------------------------------------

  const dailySalary =
    monthlySalary / totalWorkingDaysInMonth;

  const halfDaySalary = dailySalary / 2;

  // ---------------------------------------------------------
  // ATTENDANCE RECORDS
  // ---------------------------------------------------------

  // const allAttendance =
  //   JSON.parse(
  //     localStorage.getItem("clinic_employee_attendance") || "[]"
  //   ) || [];

  const allAttendance = attendance || [];

  const employeeAttendance = allAttendance.filter((record) => {
    const recordEmployeeId =
      record.employeeId ||
      record.empId ||
      record.employee_id;

    return String(recordEmployeeId) === String(employeeId);
  });

  // ---------------------------------------------------------
  // ONLY CURRENT MONTH RECORDS
  // ---------------------------------------------------------

  const monthAttendance = employeeAttendance.filter((record) => {
    const recordDate =
      record.date ||
      record.attendanceDate ||
      record.createdAt;

    if (!recordDate) return false;

    const d = normalizeDate(recordDate);

    if (!d) return false;

    return (
      d.getFullYear() === year &&
      d.getMonth() === month
    );
  });

  // ---------------------------------------------------------
  // COUNT ATTENDANCE
  // ---------------------------------------------------------

  let presentDays = 0;
  let halfDays = 0;
  let absentDays = 0;

  let freeLeaves = 0;
  let deductedLeaves = 0;

  let missingPunchDays = 0;
  let shortHoursDays = 0;

  // Keep dates unique so one date doesn't get counted twice.
  const processedDates = new Set();

  monthAttendance.forEach((record) => {
    const recordDate =
      record.date ||
      record.attendanceDate ||
      record.createdAt;

    const d = normalizeDate(recordDate);

    if (!d) return;

    // FUTURE DATES MUST NOT AFFECT SALARY
    if (d > today) return;

    // Weekly off / holiday should not become absence.
    // if (!isWorkingDay(d)) return;

    const key = dateKey(d);

    // Prevent duplicate records for same employee/date.
    if (processedDates.has(key)) return;

    processedDates.add(key);

    // const status = String(
    //   record.status ||
    //   record.attendanceStatus ||
    //   record.dayStatus ||
    //   ""
    // )
    //   .trim()
    //   .toLowerCase();

    const status = String(
  record.type ||
  record.status ||
  record.attendanceStatus ||
  record.dayStatus ||
  record.attendanceType ||
  ""
)
  .trim()
  .toLowerCase();

    // -------------------------------------------------------
    // PRESENT
    // -------------------------------------------------------

    if (
      status === "present" ||
      status === "p" ||
      status === "full day" ||
      status === "full-day"
    ) {
      presentDays++;

      // Punch missing check
      const punchIn =
        record.punchIn ||
        record.inTime ||
        record.checkIn ||
        record.loginTime;

      const punchOut =
        record.punchOut ||
        record.outTime ||
        record.checkOut ||
        record.logoutTime;

      if (!punchIn || !punchOut) {
        missingPunchDays++;
      }

      // Short hours check
      const hours =
        Number(record.totalHours) ||
        Number(record.workingHours) ||
        Number(record.hours) ||
        0;

      if (hours > 0 && hours < 8) {
        shortHoursDays++;
      }

      return;
    }

    // -------------------------------------------------------
    // HALF DAY
    // -------------------------------------------------------

    if (
      status === "half day" ||
      status === "half-day" ||
      status === "halfday" ||
      status === "half"
    ) {
      halfDays++;

      const punchIn =
        record.punchIn ||
        record.inTime ||
        record.checkIn ||
        record.loginTime;

      const punchOut =
        record.punchOut ||
        record.outTime ||
        record.checkOut ||
        record.logoutTime;

      if (!punchIn || !punchOut) {
        missingPunchDays++;
      }

      return;
    }

    // -------------------------------------------------------
    // LEAVE
    // -------------------------------------------------------

    if (
      status === "leave" ||
      status === "paid leave" ||
      status === "approved leave"
    ) {
      const isExplicitlyUnpaid =
        record.paid === false ||
        record.isPaidLeave === false ||
        record.unpaid === true ||
        record.leaveType === "Unpaid" ||
        record.leaveType === "unpaid";

      if (isExplicitlyUnpaid) {
        deductedLeaves++;
      } else {
        freeLeaves++;
      }

      return;
    }

    // -------------------------------------------------------
    // ABSENT
    // -------------------------------------------------------

    if (
      status === "absent" ||
      status === "a" ||
      status === "marked absent"
    ) {
      absentDays++;
      return;
    }
  });

  // ---------------------------------------------------------
  // IMPORTANT:
  // Do NOT automatically mark future dates absent.
  //
  // Also don't automatically deduct every old date where
  // attendance was never entered. Only explicit Absent records
  // are deducted. This prevents a newly installed attendance
  // system from deducting the employee's previous days.
  // ---------------------------------------------------------

  // ---------------------------------------------------------
  // SALARY DEDUCTIONS
  // ---------------------------------------------------------

  const halfDaySalaryDeduction =
    halfDays * halfDaySalary;

  const absentMarkedDeduction =
    absentDays * dailySalary;

  const leaveDeduction =
    deductedLeaves * dailySalary;

  const totalDeduction =
    halfDaySalaryDeduction +
    absentMarkedDeduction +
    leaveDeduction;

  const payableSalary = Math.max(
    0,
    monthlySalary - totalDeduction
  );

  // ---------------------------------------------------------
  // FINAL OBJECT
  // ---------------------------------------------------------

  return {
    employee: {
      name: employeeName,
      id: employeeId,
    },

    monthlySalary,

    presentDays,
    halfDays,
    absentDays,

    freeLeaves,
    deductedLeaves,

    missingPunchDays,
    shortHoursDays,

    // Salary calculations
    totalWorkingDaysInMonth,
    dailySalary,
    halfDaySalary,

    halfDayDeduction: halfDaySalaryDeduction,
    halfDaySalaryDeduction,

    leaveDeduction,
    absentMarkedDeduction,

    totalDeduction,
    payableSalary,

    // Compatibility with old JSX
    salary: monthlySalary,
    monthlySalaryAmount: monthlySalary,

    dailySalaryAmount: dailySalary,
    halfDaySalaryAmount: halfDaySalary,

    totalSalaryDeduction: totalDeduction,

    finalSalary: payableSalary,
    netSalary: payableSalary,
  };
// }, [selectedSalaryEmployee, employees, attendance]);
}, [selectedSalaryEmployee, selectedSalaryMonth, employees, attendance]);

  
  /*
   * LOGIN PAGE
   */
  if (
    !loggedEmployee &&
    !isAdminLoggedIn
  ) {
    return (
      <div className="attendance-page login-page">
        <div className="login-card">
          <div className="clinic-logo">
            PA
          </div>

          <h1>
            Employee Attendance
          </h1>

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

            <label>
              Password
            </label>

            <input
              type="password"
              value={loginPassword}
              placeholder="Enter password"
              onChange={(e) =>
                setLoginPassword(
                  e.target.value
                )
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
              <strong>
                Welcome Admin 
              </strong>

              
            </div>
          )}
        </div>
      </div>
    );
  }

  /*
   * EMPLOYEE PORTAL
   */
  if (loggedEmployee) {
    const myAttendance =
      getEmployeeAttendance(
        loggedEmployee.id
      );

    const todayRecord =
      getTodayRecord(
        loggedEmployee.id
      );

    const hasPunchIn =
      !!getInTime(todayRecord);

    const hasPunchOut =
      !!getOutTime(todayRecord);

    return (
      <div className="attendance-page">
        <header className="employee-header">
          <div>
            <span className="brand-small">
              PUNAR AXIS THERAPY
            </span>

            <h1>
              Employee Attendance Portal
            </h1>
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
              <span>
                Welcome
              </span>

              <h2>
                {loggedEmployee.name}
              </h2>

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
              <span>
                Employee ID
              </span>

              <strong>
                {loggedEmployee.id}
              </strong>
            </div>

            <div className="info-card">
              <span>
                Department
              </span>

              <strong>
                {loggedEmployee.department ||
                  "-"}
              </strong>
            </div>

            <div className="info-card">
              <span>
                Designation
              </span>

              <strong>
                {loggedEmployee.designation ||
                  "-"}
              </strong>
            </div>
          </section>

          <section className="attendance-mark-card">
            <div className="section-title">
              <div>
                <h2>
                  Today's Attendance
                </h2>

                <p>
                  Punch-In and Punch-Out are
                  recorded separately.
                </p>
              </div>

              <div className="today-date">
                {formatDate(today)}
              </div>
            </div>

            <div
              className="employee-info-grid"
              style={{
                marginBottom: "20px",
              }}
            >
              <div className="info-card">
                <span>
                  Punch-In
                </span>

                <strong>
                  {hasPunchIn
                    ? getInTime(
                        todayRecord
                      )
                    : "Not Marked"}
                </strong>
              </div>

              <div className="info-card">
                <span>
                  Punch-Out
                </span>

                <strong>
                  {hasPunchOut
                    ? getOutTime(
                        todayRecord
                      )
                    : "Not Marked"}
                </strong>
              </div>

              <div className="info-card">
                <span>
                  Status
                </span>

                <strong>
                  {todayRecord
                    ? todayRecord.type
                    : "Not Marked"}
                </strong>
              </div>
            </div>

            {!hasPunchIn && (
              <>
                <div className="capture-grid">
                  <div className="capture-card">
                    <div className="capture-icon">
                      📸
                    </div>

                    <h3>
                      Punch-In Photo
                    </h3>

                    <p>
                      Capture your photo before
                      Punch-In.
                    </p>

                    {faceImage &&
                    capturePurpose ===
                      "in" ? (
                      <div className="captured-preview">
                        <img
                          src={faceImage}
                          alt="Punch In"
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
                      onClick={() =>
                        startCamera("in")
                      }
                    >
                      {faceImage &&
                      capturePurpose ===
                        "in"
                        ? "Retake Photo"
                        : "Capture Photo"}
                    </button>
                  </div>

                  <div className="capture-card">
                    <div className="capture-icon">
                      📍
                    </div>

                    <h3>
                      Punch-In Location
                    </h3>

                    <p>
                      Capture GPS location for
                      Punch-In.
                    </p>

                    {capturedLocation &&
                    capturePurpose ===
                      "in" ? (
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
                      onClick={() => {
                        setCapturePurpose(
                          "in"
                        );
                        captureLocation();
                      }}
                    >
                      {capturedLocation &&
                      capturePurpose ===
                        "in"
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
                      !capturedLocation ||
                      capturePurpose !==
                        "in"
                    }
                    onClick={
                      markPunchIn
                    }
                  >
                    ✓ Punch In
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

            {hasPunchIn &&
              !hasPunchOut && (
                <>
                  <div className="already-marked">
                    <div className="success-icon">
                      ✓
                    </div>

                    <div>
                      <h3>
                        Punch-In Completed
                      </h3>

                      <p>
                        In Time:{" "}
                        <strong>
                          {getInTime(
                            todayRecord
                          )}
                        </strong>
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {todayRecord.type}
                        </strong>
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    <h3>
                      Now Mark Punch-Out
                    </h3>

                    <p>
                      Punch-Out is mandatory at the
                      end of the shift.
                    </p>
                  </div>

                  <div className="capture-grid">
                    <div className="capture-card">
                      <div className="capture-icon">
                        📸
                      </div>

                      <h3>
                        Punch-Out Photo
                      </h3>

                      <p>
                        Capture your photo before
                        Punch-Out.
                      </p>

                      {faceImage &&
                      capturePurpose ===
                        "out" ? (
                        <div className="captured-preview">
                          <img
                            src={faceImage}
                            alt="Punch Out"
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
                        onClick={() =>
                          startCamera(
                            "out"
                          )
                        }
                      >
                        {faceImage &&
                        capturePurpose ===
                          "out"
                          ? "Retake Photo"
                          : "Capture Photo"}
                      </button>
                    </div>

                    <div className="capture-card">
                      <div className="capture-icon">
                        📍
                      </div>

                      <h3>
                        Punch-Out Location
                      </h3>

                      <p>
                        Capture GPS location for
                        Punch-Out.
                      </p>

                      {capturedLocation &&
                      capturePurpose ===
                        "out" ? (
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
                        onClick={() => {
                          setCapturePurpose(
                            "out"
                          );
                          captureLocation();
                        }}
                      >
                        {capturedLocation &&
                        capturePurpose ===
                          "out"
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
                        !capturedLocation ||
                        capturePurpose !==
                          "out"
                      }
                      onClick={
                        markPunchOut
                      }
                    >
                      ✓ Punch Out
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

            {hasPunchIn &&
              hasPunchOut && (
                <>
                  <div className="already-marked">
                    <div className="success-icon">
                      ✓
                    </div>

                    <div>
                      <h3>
                        Today's Attendance
                        Completed
                      </h3>

                      <p>
                        In Time:{" "}
                        <strong>
                          {getInTime(
                            todayRecord
                          )}
                        </strong>
                      </p>

                      <p>
                        Out Time:{" "}
                        <strong>
                          {getOutTime(
                            todayRecord
                          )}
                        </strong>
                      </p>

                      <p>
                        Working Time:{" "}
                        <strong>
                          {todayRecord.workingHours ||
                            formatDuration(
                              todayRecord.workingMinutes ||
                                0
                            )}
                        </strong>
                      </p>

                      <p>
                        Status:{" "}
                        <strong>
                          {todayRecord.type}
                        </strong>
                      </p>

                      {todayRecord.shortHours && (
                        <p>
                          ⚠️{" "}
                          <strong>
                            Short Hours
                          </strong>
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
          </section>

          <section className="employee-history-card">
            <div className="section-title">
              <div>
                <h2>
                  My Attendance History
                </h2>

                <p>
                  Your attendance records only.
                </p>
              </div>
            </div>

            {myAttendance.length ===
            0 ? (
              <div className="empty-state">
                No attendance records found.
              </div>
            ) : (
              <div className="attendance-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>In Time</th>
                      <th>Out Time</th>
                      <th>Working Hours</th>
                      <th>Status</th>
                      <th>Late</th>
                      <th>Short Hours</th>
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
                            {formatDate(
                              item.date
                            )}
                          </td>

                          <td>
                            {getInTime(item) ||
                              "-"}
                          </td>

                          <td>
                            {getOutTime(item) ||
                              "-"}
                          </td>

                          <td>
                            {item.workingHours ||
                              (item.workingMinutes !==
                              undefined
                                ? formatDuration(
                                    item.workingMinutes
                                  )
                                : "-")}
                          </td>

                          <td>
                            {renderStatus(
                              item
                            )}
                          </td>

                          <td>
                            {item.isLate ? (
                              <span>
                                {item.lateMinutes ||
                                  0}{" "}
                                min
                              </span>
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {item.shortHours
                              ? "Yes"
                              : "-"}
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
                              item,
                              "in"
                            )}
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
                  <h2>
                    Capture{" "}
                    {capturePurpose ===
                    "in"
                      ? "Punch-In"
                      : "Punch-Out"}{" "}
                    Photo
                  </h2>

                  <p>
                    Keep your face clearly
                    visible.
                  </p>
                </div>

                <button
                  className="close-btn"
                  onClick={() => {
                    stopCamera();
                    setShowCameraModal(
                      false
                    );
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
                style={{
                  display: "none",
                }}
              />

              <div className="camera-actions">
                <button
                  className="primary-btn"
                  onClick={
                    capturePhoto
                  }
                >
                  📸 Capture Photo
                </button>

                <button
                  className="reset-btn"
                  onClick={() => {
                    stopCamera();
                    setShowCameraModal(
                      false
                    );
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showPhotoModal &&
          selectedPhoto && (
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
                  onClick={
                    closePhoto
                  }
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

  /*
   * ADMIN DASHBOARD
   */
  return (
    <div className="attendance-page admin-page">
      <header className="admin-header">
        <div>
          <span className="brand-small">
            PUNAR AXIS THERAPY
          </span>

          <h1>
            Admin Attendance Dashboard
          </h1>
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

        {activeTab ===
          "dashboard" && (
          <>
            <section className="stats-grid">
              <div className="stat-card">
                <span>
                  Total Employees
                </span>

                <strong>
                  {employees.length}
                </strong>
              </div>

              <div className="stat-card">
                <span>
                  Present Today
                </span>

                <strong>
                  {presentToday}
                </strong>
              </div>

              <div className="stat-card">
                <span>
                  Half Day Today
                </span>

                <strong>
                  {halfDayToday}
                </strong>
              </div>

              <div className="stat-card">
                <span>
                  Absent Today
                </span>

                <strong>
                  {absentToday}
                </strong>
              </div>
            </section>

            <section className="admin-card">
              <div className="section-title">
                <div>
                  <h2>
                    Today's Attendance
                  </h2>

                  <p>
                    Punch-In, Punch-Out,
                    working hours and location.
                  </p>
                </div>

                <span className="date-pill">
                  {formatDate(today)}
                </span>
              </div>

              {todayAttendance.length ===
              0 ? (
                <div className="empty-state">
                  No attendance marked
                  today.
                </div>
              ) : (
                <div className="attendance-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Employee
                        </th>

                        <th>
                          In Time
                        </th>

                        <th>
                          Out Time
                        </th>

                        <th>
                          Working Hours
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Late
                        </th>

                        <th>
                          Short Hours
                        </th>

                        <th>
                          In Location
                        </th>

                        <th>
                          Out Location
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...todayAttendance]
                        .reverse()
                        .map((item) => (
                          <tr key={item.id}>
                            <td>
                              <strong>
                                {
                                  item.employeeName
                                }
                              </strong>

                              <small className="table-sub">
                                {
                                  item.employeeId
                                }
                              </small>
                            </td>

                            <td>
                              {getInTime(
                                item
                              ) || "-"}
                            </td>

                            <td>
                              {getOutTime(
                                item
                              ) || (
                                <span>
                                  Pending
                                </span>
                              )}
                            </td>

                            <td>
                              {item.workingHours ||
                                "-"}
                            </td>

                            <td>
                              {renderStatus(
                                item
                              )}
                            </td>

                            <td>
                              {item.isLate
                                ? `${item.lateMinutes} min`
                                : "-"}
                            </td>

                            <td>
                              {item.shortHours
                                ? "Yes"
                                : "-"}
                            </td>

                            <td>
                              {renderLocationInfo(
                                item,
                                "in"
                              )}
                            </td>

                            <td>
                              {renderLocationInfo(
                                item,
                                "out"
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

        {activeTab ===
          "datewise" && (
          <>
            <section className="filter-card">
              <div>
                <label>
                  Select Date
                </label>

                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) =>
                    setSearchDate(
                      e.target.value
                    )
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
                  value={
                    searchEmployee
                  }
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
                    {formatDate(
                      searchDate
                    )}
                  </h2>

                  <p>
                    {
                      filteredDateAttendance.length
                    }{" "}
                    attendance record(s)
                  </p>
                </div>
              </div>

              {filteredDateAttendance.length ===
              0 ? (
                <div className="empty-state">
                  No attendance found.
                </div>
              ) : (
                <div className="attendance-table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>
                          Employee
                        </th>

                        <th>
                          In Time
                        </th>

                        <th>
                          Out Time
                        </th>

                        <th>
                          Working Hours
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Late
                        </th>

                        <th>
                          Short Hours
                        </th>

                        <th>
                          Photo
                        </th>

                        <th>
                          Location
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredDateAttendance.map(
                        (item) => (
                          <tr
                            key={
                              item.id
                            }
                          >
                            <td>
                              <strong>
                                {
                                  item.employeeName
                                }
                              </strong>

                              <small className="table-sub">
                                {
                                  item.employeeId
                                }
                              </small>
                            </td>

                            <td>
                              {getInTime(
                                item
                              ) || "-"}
                            </td>

                            <td>
                              {getOutTime(
                                item
                              ) || "-"}
                            </td>

                            <td>
                              {item.workingHours ||
                                "-"}
                            </td>

                            <td>
                              {renderStatus(
                                item
                              )}
                            </td>

                            <td>
                              {item.isLate
                                ? `${item.lateMinutes} min`
                                : "-"}
                            </td>

                            <td>
                              {item.shortHours
                                ? "Yes"
                                : "-"}
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
                                item,
                                "in"
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
                    Employee Attendance
                    Search
                  </h2>

                  <p>
                    Search an employee to
                    see complete attendance.
                  </p>
                </div>
              </div>

              <div className="employee-search-input">
                <input
                  type="text"
                  placeholder="Search employee name or ID..."
                  value={
                    searchEmployee
                  }
                  onChange={(e) =>
                    setSearchEmployee(
                      e.target.value
                    )
                  }
                />
              </div>

              {searchEmployee.trim() &&
                (searchedEmployeeRecords.length ===
                0 ? (
                  <div className="empty-state">
                    No employee attendance
                    found.
                  </div>
                ) : (
                  <div className="attendance-table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>
                            Date
                          </th>

                          <th>
                            In Time
                          </th>

                          <th>
                            Out Time
                          </th>

                          <th>
                            Working Hours
                          </th>

                          <th>
                            Status
                          </th>

                          <th>
                            Late
                          </th>

                          <th>
                            Short Hours
                          </th>
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
                              new Date(
                                a.date
                              )
                          )
                          .map(
                            (
                              item
                            ) => (
                              <tr
                                key={
                                  item.id
                                }
                              >
                                <td>
                                  {formatDate(
                                    item.date
                                  )}
                                </td>

                                <td>
                                  {getInTime(
                                    item
                                  ) ||
                                    "-"}
                                </td>

                                <td>
                                  {getOutTime(
                                    item
                                  ) ||
                                    "-"}
                                </td>

                                <td>
                                  {item.workingHours ||
                                    "-"}
                                </td>

                                <td>
                                  {renderStatus(
                                    item
                                  )}
                                </td>

                                <td>
                                  {item.isLate
                                    ? `${item.lateMinutes} min`
                                    : "-"}
                                </td>

                                <td>
                                  {item.shortHours
                                    ? "Yes"
                                    : "-"}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                ))}
            </section>
          </>
        )}

        {activeTab ===
          "employees" && (
          <section className="admin-card">
            <div className="section-title">
              <div>
                <h2>
                  Employee Management
                </h2>

                <p>
                  Add employees and
                  automatically generate
                  Employee IDs.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowEmployeeModal(
                    true
                  )
                }
              >
                + Add Employee
              </button>
            </div>

            {employees.length ===
            0 ? (
              <div className="empty-state">
                No employees added yet.
              </div>
            ) : (
              <div className="attendance-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>
                        Employee ID
                      </th>

                      <th>
                        Employee
                      </th>

                      <th>
                        Mobile
                      </th>

                      <th>
                        Department
                      </th>

                      <th>
                        Designation
                      </th>

                      <th>
                        Salary
                      </th>

                      <th>
                        Face
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map(
                      (employee) => (
                        <tr
                          key={
                            employee.id
                          }
                        >
                          <td>
                            <strong>
                              {
                                employee.id
                              }
                            </strong>
                          </td>

                          <td>
                            {
                              employee.name
                            }
                          </td>

                          <td>
                            {employee.mobile ||
                              "-"}
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
                              employee.salary ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
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
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab ===
          "salary" && (
          <section className="admin-card">
            <div className="section-title">
              <div>
                <h2>
                  Employee Salary
                  Calculation
                </h2>

                <p>
                  Salary is calculated from
                  attendance status and
                  monthly salary.
                </p>
              </div>
            </div>

            <div className="salary-selector">
              <label>
                Select Employee
              </label>

              {/* <select
                value={
                  selectedSalaryEmployee
                }
                onChange={(e) =>
                  setSelectedSalaryEmployee(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select employee
                </option>

                {employees.map(
                  (employee) => (
                    <option
                      key={
                        employee.id
                      }
                      value={
                        employee.id
                      }
                    >
                      {
                        employee.name
                      }{" "}
                      -{" "}
                      {
                        employee.id
                      }
                    </option>
                  )
                )}
              </select> */}

              <select
  value={selectedSalaryEmployee}
  onChange={(e) => {
    const employeeId = e.target.value;

    setSelectedSalaryEmployee(employeeId);

  }}
>
  <option value="">
    Select employee
  </option>

  {employees.map((employee) => (
    <option
      key={employee.id}
      value={employee.id}
    >
      {employee.name} - {employee.id}
    </option>
  ))}
</select>
<div className="salary-month-selector">
  <label>Select Month</label>

  <input
    type="month"
    value={selectedSalaryMonth}
    onChange={(e) =>
      setSelectedSalaryMonth(e.target.value)
    }
  />
</div>
            </div>

            {salaryData && (
              <div className="salary-section">
                <div className="salary-header-card">
                  <div>
                    <span>
                      Employee
                    </span>

                    <h2>
                      {
                        salaryData
                          .employee
                          .name
                      }
                    </h2>

                    <p>
                      {
                        salaryData
                          .employee
                          .id
                      }
                    </p>
                  </div>

                  <div>
                    <span>
                      Monthly Salary
                    </span>

                    <strong>
                      ₹
                      {salaryData.monthlySalary.toLocaleString(
                        "en-IN",
                        {
                          maximumFractionDigits:
                            2,
                        }
                      )}
                    </strong>
                  </div>
                </div>

                <div className="salary-stats">
                  <div>
                    <span>
                      Present Days
                    </span>

                    <strong>
                      {
                        salaryData.presentDays
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Half Days
                    </span>

                    <strong>
                      {
                        salaryData.halfDays
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Absent Days
                    </span>

                    <strong>
                      {
                        salaryData.absentDays
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Free Leaves
                    </span>

                    <strong>
                      {
                        salaryData.freeLeaves
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Deducted Leaves
                    </span>

                    <strong>
                      {
                        salaryData.deductedLeaves
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Missing Punch
                    </span>

                    <strong>
                      {
                        salaryData.missingPunchDays
                      }
                    </strong>
                  </div>
                </div>

                <div className="salary-calculation">
                  <div>
                    <span>
                      Daily Salary
                    </span>

                    <strong>
                      ₹
                      {salaryData.dailySalary.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Half-day Salary
                      Deduction
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
                      Leave Deduction
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
                      Half-day
                      Deductions
                    </span>

                    <strong>
                      ₹
                      {salaryData.halfDaySalaryDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Absent Marked
                      Deduction
                    </span>

                    <strong>
                      ₹
                      {salaryData.absentMarkedDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div className="total-deduction">
                    <span>
                      Total Deduction
                    </span>

                    <strong>
                      ₹
                      {salaryData.totalDeduction.toFixed(
                        2
                      )}
                    </strong>
                  </div>

                  <div className="payable-salary">
                    <span>
                      Payable Salary
                    </span>

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
                <h2>
                  Add New Employee
                </h2>

                <p>
                  Employee ID will be
                  generated automatically.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowEmployeeModal(
                    false
                  )
                }
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                createEmployee
              }
            >
              <div className="form-grid">
                <div>
                  <label>
                    Employee Name
                  </label>

                  <input
                    name="name"
                    value={
                      newEmployee.name
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Employee full name"
                  />
                </div>

                <div>
                  <label>
                    Mobile Number
                  </label>

                  <input
                    name="mobile"
                    value={
                      newEmployee.mobile
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Mobile number"
                  />
                </div>

                <div>
                  <label>
                    Department
                  </label>

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
                  <label>
                    Designation
                  </label>

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
                  <label>
                    Monthly Salary
                  </label>

                  <input
                    type="number"
                    name="salary"
                    value={
                      newEmployee.salary
                    }
                    onChange={
                      handleNewEmployeeChange
                    }
                    placeholder="Monthly salary"
                  />
                </div>

                <div>
                  <label>
                    Joining Date
                  </label>

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
                    Employee Login
                    Password
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
                    setShowEmployeeModal(
                      false
                    )
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

      {showPhotoModal &&
        selectedPhoto && (
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
                onClick={
                  closePhoto
                }
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