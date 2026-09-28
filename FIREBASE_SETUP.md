# Punar Axis Therapy — Firebase Setup

This project is prepared for Firebase Authentication + Cloud Firestore.

## 1. Create the Firebase project

1. Open Firebase Console.
2. Create a project for the clinic.
3. Add a Web App to the project.
4. Copy the Web App configuration values.

## 2. Enable Firestore

Firebase Console → Firestore Database → Create database.

Choose the region closest to the clinic's primary users. The selected region is a database deployment choice and cannot be casually changed later.

After the database is created, publish the `firestore.rules` file from this project.

## 3. Enable Management Authentication

Firebase Console → Authentication → Get started → Sign-in method → Email/Password → Enable.

Then open Authentication → Users → Add user.

Example:

- Email: your-admin-email@example.com
- Password: use a strong unique password

The email/password entered on the Management Login page will authenticate against Firebase when Firebase is configured.

## 4. Add the Firebase config

In the project root, copy:

`.env.example` → `.env.local`

Then fill the six Firebase Web App values:

```env
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```

Do NOT put a Firebase service-account JSON/private key in this React project.

## 5. Install dependencies

From the project root:

```bash
npm install
```

Firebase is already listed in `package.json`.

If your existing `package-lock.json` is from before Firebase was added, run `npm install` once so npm regenerates the lock data.

## 6. Start

```bash
npm start
```

Then open the Management Login page and sign in with the Firebase Authentication user you created.

## 7. Firestore collections used by this project

The application is prepared to synchronize these datasets:

- appointments
- patients
- patientTreatments
- clients
- employees
- employeeAttendance
- inventoryItems
- inventoryHistory
- clientNotes

The existing screens continue to use their current local state/localStorage interface, while `cloudStorage.js` mirrors the clinic datasets to Firestore. This lets the existing large UI modules migrate without rewriting every screen from scratch.

## 8. Important production note

The current patient portal still follows the project's existing Patient ID/mobile + password model. For a fully production-grade patient portal, the next security upgrade should be Firebase Authentication for patients (or a server-side authentication endpoint) rather than exposing the patient collection to unauthenticated browsers.

The included Firestore rules intentionally require Firebase Authentication for Firestore access.
