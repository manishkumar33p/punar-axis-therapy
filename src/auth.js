
import {
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
} from "firebase/auth";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "./firebase";


/* =========================================================
   MANAGEMENT LOGIN
========================================================= */

export async function managementLogin(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    const user = result.user;

    const adminRef = doc(
      db,
      "admins",
      user.uid
    );

    const adminSnapshot = await getDoc(adminRef);

    if (!adminSnapshot.exists()) {
      await signOut(auth);

      throw new Error(
        "This account is not registered as clinic management."
      );
    }

    return user;
  } catch (error) {
    console.error(
      "Management login error:",
      error
    );

    throw new Error(
      error?.message ||
        "Management login failed."
    );
  }
}


/* =========================================================
   MANAGEMENT LOGIN ALIAS

   ManagementLogin.js is importing:
   signInManagement
========================================================= */

export async function signInManagement(
  email,
  password
) {
  return managementLogin(
    email,
    password
  );
}


/* =========================================================
   MANAGEMENT LOGOUT
========================================================= */

export async function managementLogout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn(
      "Management logout warning:",
      error
    );
  }
}


/* =========================================================
   PATIENT LOGIN HASH
========================================================= */

export async function hashLogin(
  patientId,
  lastFour
) {
  const id = String(patientId || "")
    .trim()
    .toUpperCase();

  const pass = String(lastFour || "")
    .replace(/\D/g, "")
    .slice(-4);

  const value = `${id}|${pass}`;

  const encoder = new TextEncoder();

  const data = encoder.encode(value);

  const hashBuffer =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array.from(
    new Uint8Array(hashBuffer)
  )
    .map((byte) =>
      byte
        .toString(16)
        .padStart(2, "0")
    )
    .join("");
}


/* =========================================================
   CREATE / UPDATE PATIENT PORTAL LOGIN
========================================================= */

export async function provisionPatientPortal(
  patient
) {
  if (!patient?.patientId) {
    throw new Error(
      "Patient ID is required."
    );
  }

  const mobile = String(
    patient.mobile ||
      patient.phone ||
      patient.mobileNumber ||
      patient.phoneNumber ||
      ""
  ).replace(/\D/g, "");

  if (!mobile) {
    throw new Error(
      "Patient mobile number is required."
    );
  }

  if (mobile.length < 4) {
    throw new Error(
      "Patient mobile number is invalid."
    );
  }

  const patientId = String(
    patient.patientId
  )
    .trim()
    .toUpperCase();

  const lastFour = mobile.slice(-4);

  const loginId = await hashLogin(
    patientId,
    lastFour
  );

  await setDoc(
    doc(
      db,
      "patientLoginIndex",
      loginId
    ),
    {
      patientId: patientId,
      updatedAt: new Date().toISOString(),
    },
    {
      merge: true,
    }
  );

  return {
    success: true,
    patientId: patientId,
  };
}


/* =========================================================
   PATIENT LOGIN

   Example:

   Patient ID: PAT-0002
   Mobile:     123456789
   Password:   6789
========================================================= */

export async function signInPatient(
  patientId,
  password
) {
  const id = String(patientId || "")
    .trim()
    .toUpperCase();

  const pass = String(password || "")
    .trim()
    .replace(/\D/g, "");

  if (!id) {
    throw new Error(
      "Please enter Patient ID."
    );
  }

  if (!pass) {
    throw new Error(
      "Please enter password."
    );
  }

  if (pass.length !== 4) {
    throw new Error(
      "Password must be the last 4 digits of the registered mobile number."
    );
  }

  if (!id.startsWith("PAT-")) {
    throw new Error(
      "Invalid Patient ID. Example: PAT-0002."
    );
  }

  try {
    /* -------------------------------------------------------
       STEP 1: Firebase anonymous authentication
    ------------------------------------------------------- */

    if (!auth.currentUser) {
      await signInAnonymously(auth);
    }


    /* -------------------------------------------------------
       STEP 2: Directly load patient profile
    ------------------------------------------------------- */

    const patientRef = doc(
      db,
      "patients",
      id
    );

    const patientSnapshot =
      await getDoc(patientRef);

    if (!patientSnapshot.exists()) {
      throw new Error(
        "Incorrect Patient ID or password."
      );
    }

    const patientData =
      patientSnapshot.data();


    /* -------------------------------------------------------
       STEP 3: Find registered mobile
    ------------------------------------------------------- */

    const registeredMobile = String(
      patientData.mobile ||
        patientData.phone ||
        patientData.mobileNumber ||
        patientData.phoneNumber ||
        ""
    ).replace(/\D/g, "");

    if (!registeredMobile) {
      throw new Error(
        "No registered mobile number found for this patient. Please contact clinic management."
      );
    }

    if (registeredMobile.length < 4) {
      throw new Error(
        "Registered mobile number is invalid. Please contact clinic management."
      );
    }


    /* -------------------------------------------------------
       STEP 4: Password = last 4 digits of mobile
    ------------------------------------------------------- */

    const correctPassword =
      registeredMobile.slice(-4);

    if (pass !== correctPassword) {
      throw new Error(
        "Incorrect Patient ID or password."
      );
    }


    /* -------------------------------------------------------
       STEP 5: Patient object
    ------------------------------------------------------- */

    const patient = {
      id: patientSnapshot.id,
      ...patientData,
      patientId: id,
    };


    /* -------------------------------------------------------
       STEP 6: Treatment history
    ------------------------------------------------------- */

    let treatmentHistory = [];

    try {
      const treatmentQuery = query(
        collection(
          db,
          "patientTreatments"
        ),
        where(
          "patientId",
          "==",
          id
        )
      );

      const treatmentSnapshot =
        await getDocs(
          treatmentQuery
        );

      treatmentHistory =
        treatmentSnapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );
    } catch (error) {
      console.warn(
        "Treatment history could not be loaded:",
        error
      );

      treatmentHistory = [];
    }


    /* -------------------------------------------------------
       STEP 7: Appointment history
    ------------------------------------------------------- */

    let appointmentHistory = [];

    try {
      const appointmentQuery = query(
        collection(
          db,
          "appointments"
        ),
        where(
          "patientId",
          "==",
          id
        )
      );

      const appointmentSnapshot =
        await getDocs(
          appointmentQuery
        );

      appointmentHistory =
        appointmentSnapshot.docs.map(
          (item) => ({
            id: item.id,
            ...item.data(),
          })
        );
    } catch (error) {
      console.warn(
        "Appointment history could not be loaded:",
        error
      );

      appointmentHistory = [];
    }


    /* -------------------------------------------------------
       STEP 8: Create session
    ------------------------------------------------------- */

    const session = {
      loggedIn: true,

      patient: {
        ...patient,
        patientId: id,
      },

      treatmentHistory,

      appointmentHistory,

      loggedInAt:
        new Date().toISOString(),
    };


    /* -------------------------------------------------------
       STEP 9: Save session
    ------------------------------------------------------- */

    localStorage.setItem(
      "patientSession",
      JSON.stringify(session)
    );

    localStorage.setItem(
      "patientData",
      JSON.stringify(
        session.patient
      )
    );

    return session;

  } catch (error) {
    console.error(
      "Patient login error:",
      error
    );

    if (
      error?.code ===
      "permission-denied"
    ) {
      throw new Error(
        "Patient login was successful, but Firestore permission was denied. Please check Firebase Rules."
      );
    }

    throw new Error(
      error?.message ||
        "Incorrect Patient ID or password."
    );
  }
}


/* =========================================================
   GET PATIENT SESSION
========================================================= */

export function getPatientSession() {
  try {
    const session =
      localStorage.getItem(
        "patientSession"
      );

    if (!session) {
      return null;
    }

    const parsed =
      JSON.parse(session);

    if (
      !parsed ||
      parsed.loggedIn !== true ||
      !parsed.patient?.patientId
    ) {
      return null;
    }

    return parsed;

  } catch (error) {
    console.error(
      "Unable to read patient session:",
      error
    );

    return null;
  }
}


/* =========================================================
   GET PATIENT DATA
========================================================= */

export function getPatientData() {
  try {
    const patient =
      localStorage.getItem(
        "patientData"
      );

    if (!patient) {
      return null;
    }

    return JSON.parse(patient);

  } catch (error) {
    console.error(
      "Unable to read patient data:",
      error
    );

    return null;
  }
}


/* =========================================================
   PATIENT LOGOUT
========================================================= */

export async function logoutPatient() {
  try {
    localStorage.removeItem(
      "patientSession"
    );

    localStorage.removeItem(
      "patientData"
    );

    if (auth.currentUser) {
      await signOut(auth);
    }

    return true;

  } catch (error) {
    console.error(
      "Patient logout error:",
      error
    );

    localStorage.removeItem(
      "patientSession"
    );

    localStorage.removeItem(
      "patientData"
    );

    return true;
  }
}


/* =========================================================
   ADMIN LOGOUT
========================================================= */

export async function logoutAdmin() {
  try {
    await signOut(auth);

    return true;

  } catch (error) {
    console.error(
      "Admin logout error:",
      error
    );

    throw new Error(
      "Logout failed."
    );
  }
}


/* =========================================================
   CHANGE PATIENT PASSWORD
========================================================= */

export async function changePatientPassword(
  patientId,
  newPassword
) {
  throw new Error(
    "Patient password is currently based on the last 4 digits of the registered mobile number."
  );
}

