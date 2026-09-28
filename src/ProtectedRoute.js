// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { watchManagementAuth } from "./auth";

// function ProtectedRoute({ children }) {
//   const location = useLocation();
//   const [status, setStatus] = useState({ loading: true, authenticated: false });

//   useEffect(() => {
//     return watchManagementAuth((authenticated) => {
//       setStatus({ loading: false, authenticated });
//     });
//   }, []);

//   if (status.loading) {
//     return (
//       <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f7f4ef", color: "#1d3b36", fontFamily: "Inter, Arial, sans-serif" }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{ fontSize: 30, marginBottom: 12 }}>✦</div>
//           <strong>Securing your management session…</strong>
//         </div>
//       </div>
//     );
//   }

//   if (!status.authenticated) {
//     return (
//       <Navigate
//         to="/management-login"
//         replace
//         state={{ from: location.pathname + location.search }}
//       />
//     );
//   }

//   return children;
// }

// export default ProtectedRoute;

// import React, { useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";

// function ProtectedRoute({ children }) {
//   const location = useLocation();

//   const [status, setStatus] = useState({
//     loading: true,
//     authenticated: false,
//   });

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setStatus({
//         loading: false,
//         authenticated: !!user,
//       });
//     });

//     return () => unsubscribe();
//   }, []);

//   if (status.loading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "grid",
//           placeItems: "center",
//           background: "#f7f4ef",
//           color: "#1d3b36",
//           fontFamily: "Inter, Arial, sans-serif",
//         }}
//       >
//         <div style={{ textAlign: "center" }}>
//           <div
//             style={{
//               fontSize: 30,
//               marginBottom: 12,
//             }}
//           >
//             ✦
//           </div>

//           <strong>Securing your management session…</strong>
//         </div>
//       </div>
//     );
//   }

//   if (!status.authenticated) {
//     return (
//       <Navigate
//         to="/management-login"
//         replace
//         state={{
//           from: location.pathname + location.search,
//         }}
//       />
//     );
//   }

//   return children;
// }

// export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔥 Firebase Admin User:", currentUser);

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f4ef",
          color: "#1d3b36",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 30, marginBottom: 12 }}>✦</div>
          <strong>Checking admin access...</strong>
        </div>
      </div>
    );
  }

  // Firebase में Admin login नहीं है
  if (!user) {
    return (
      <Navigate
        to="/management-login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  // Firebase Admin login है
  return children;
}

export default ProtectedRoute;