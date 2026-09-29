


// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// /*
// |--------------------------------------------------------------------------
// | Firebase Configuration
// |--------------------------------------------------------------------------
// */

// export const firebaseConfig = {
//   apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//   authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.REACT_APP_FIREBASE_APP_ID,
//   measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
// };

// /*
// |--------------------------------------------------------------------------
// | Firebase Configuration Check
// |--------------------------------------------------------------------------
// */

// export const isFirebaseConfigured =
//   Boolean(firebaseConfig.apiKey) &&
//   Boolean(firebaseConfig.authDomain) &&
//   Boolean(firebaseConfig.projectId) &&
//   Boolean(firebaseConfig.appId);

// /*
// |--------------------------------------------------------------------------
// | Initialize Firebase
// |--------------------------------------------------------------------------
// */

// const app = getApps().length
//   ? getApp()
//   : initializeApp(firebaseConfig);

// /*
// |--------------------------------------------------------------------------
// | Admin / Management Authentication
// |--------------------------------------------------------------------------
// */

// export const auth = getAuth(app);

// /*
// |--------------------------------------------------------------------------
// | Firestore Database
// |--------------------------------------------------------------------------
// */

// export const db = getFirestore(app);

// /*
// |--------------------------------------------------------------------------
// | Patient Authentication
// |--------------------------------------------------------------------------
// |
// | A separate Firebase Auth instance can be used for patient login,
// | so patient authentication doesn't interfere with management login.
// |
// |--------------------------------------------------------------------------
// */

// let patientAuth;

// try {
//   const patientAppName = "patient-auth-app";

//   const patientApp = getApps().some(
//     (firebaseApp) => firebaseApp.name === patientAppName
//   )
//     ? getApp(patientAppName)
//     : initializeApp(firebaseConfig, patientAppName);

//   patientAuth = getAuth(patientApp);
// } catch (error) {
//   console.error("Patient Firebase Auth initialization error:", error);

//   // Fallback to the main auth instance
//   patientAuth = auth;
// }

// export { patientAuth };

// export default app;


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/*
|--------------------------------------------------------------------------
| Firebase Configuration
|--------------------------------------------------------------------------
*/

export const firebaseConfig = {
  apiKey: "AIzaSyC7QcCaz9tgerunsQ81e96l48omyQJdlzM",
  authDomain: "punar-axis-clinic.firebaseapp.com",
  projectId: "punar-axis-clinic",
  storageBucket: "punar-axis-clinic.firebasestorage.app",
  messagingSenderId: "231886698174",
  appId: "1:231886698174:web:25908fbce4c63b7f4910ef",
  measurementId: "G-V1ND8MSPR1",
};

/*
|--------------------------------------------------------------------------
| Firebase Configuration Check
|--------------------------------------------------------------------------
*/

export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  Boolean(firebaseConfig.authDomain) &&
  Boolean(firebaseConfig.projectId) &&
  Boolean(firebaseConfig.appId);

/*
|--------------------------------------------------------------------------
| Initialize Firebase
|--------------------------------------------------------------------------
*/

const app = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

/*
|--------------------------------------------------------------------------
| Admin / Management Authentication
|--------------------------------------------------------------------------
*/

export const auth = getAuth(app);

/*
|--------------------------------------------------------------------------
| Firestore Database
|--------------------------------------------------------------------------
*/

export const db = getFirestore(app);

/*
|--------------------------------------------------------------------------
| Patient Authentication
|--------------------------------------------------------------------------
|
| A separate Firebase Auth instance is used for patient login,
| so patient authentication doesn't interfere with management login.
|
|--------------------------------------------------------------------------
*/

let patientAuth;

try {
  const patientAppName = "patient-auth-app";

  const patientApp = getApps().some(
    (firebaseApp) => firebaseApp.name === patientAppName
  )
    ? getApp(patientAppName)
    : initializeApp(firebaseConfig, patientAppName);

  patientAuth = getAuth(patientApp);
} catch (error) {
  console.error(
    "Patient Firebase Auth initialization error:",
    error
  );

  // Fallback to the main auth instance
  patientAuth = auth;
}

/*
|--------------------------------------------------------------------------
| Export Patient Authentication
|--------------------------------------------------------------------------
*/

export { patientAuth };

/*
|--------------------------------------------------------------------------
| Default Firebase App
|--------------------------------------------------------------------------
*/

export default app;