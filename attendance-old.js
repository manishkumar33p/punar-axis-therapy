

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

  // const selectedEmployeeForCalendar = employees.find(
  //   (employee) => employee.id === searchEmployee
  // );

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

  // const getEmployeeRecordForDate = (
  //   employeeId,
  //   date
  // ) => {
  //   return attendance.find(
  //     (item) =>
  //       item.employeeId === employeeId &&
  //       item.date === date
  //   );
  // };

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
