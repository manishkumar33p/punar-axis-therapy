import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { initializeCloudStorage } from "./cloudStorage";
import { auth, isFirebaseConfigured } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

async function bootstrap() {
  try {
    // Installs the localStorage bridge immediately. Firestore collections that
    // require authentication are hydrated once Firebase confirms a user.
    await initializeCloudStorage();
  } catch (error) {
    console.error("Clinic cloud bootstrap failed. Starting app anyway:", error);
  }

  if (isFirebaseConfigured && auth) {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        await initializeCloudStorage();
      } catch (error) {
        console.error("Authenticated clinic cloud sync failed:", error);
      }
    });
  }

  const root = createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
reportWebVitals();
