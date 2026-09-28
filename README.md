# Punar Axis Therapy — Clinic Management System

React clinic management application prepared for centralized Firebase Cloud Firestore storage and Firebase Authentication.

## Main areas

- Public clinic website
- Management Login
- Management Dashboard
- Appointment
- Appointment Details
- Patient Management
- Patient Portal
- Employee Attendance
- Inventory
- Client Management

## Cloud architecture

The application includes:

- `src/firebase.js` — Firebase initialization
- `src/auth.js` — Management authentication
- `src/cloudStorage.js` — migration/realtime synchronization bridge
- `src/ManagementDashboard/` — cloud-connected management overview
- `.env.example` — Firebase Web App configuration template
- `firestore.rules` — authenticated Firestore access rules
- `FIREBASE_SETUP.md` — setup instructions

## First run

1. Copy `.env.example` to `.env.local`.
2. Add your Firebase Web App configuration.
3. Enable Firestore.
4. Enable Firebase Authentication → Email/Password.
5. Create the first management user in Firebase Authentication.
6. Run `npm install`.
7. Run `npm start`.

Do not upload service-account/private-key JSON files to this React project.
