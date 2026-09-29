import {
  collection,
  // deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./firebase";

/*
  Cloud bridge for the existing application.
  It keeps the current UI/state code working while moving the important
  clinic datasets from browser-only localStorage to Firestore.

  The app first hydrates localStorage from Firestore. Existing screens can
  therefore continue using their current state logic. Every subsequent
  localStorage write for a mapped clinic key is mirrored to Firestore.
*/

const DATA_MAP = {
  clinic_appointments: "appointments",
  clinic_patients: "patients",
  clinic_patient_treatments: "patientTreatments",
  clinic_clients: "clients",
  clinic_employees: "employees",
  clinic_employee_attendance: "employeeAttendance",
  clinic_inventory_items: "inventoryItems",
  clinic_inventory_history: "inventoryHistory",
};

const NOTE_PREFIX = "clinic_client_notes_";

const storagePrototype = Object.getPrototypeOf(window.localStorage);
const originalSetItem = storagePrototype.setItem.bind(window.localStorage);
const originalGetItem = storagePrototype.getItem.bind(window.localStorage);
const originalRemoveItem = storagePrototype.removeItem.bind(window.localStorage);

let bridgeInstalled = false;
let syncingKeys = new Set();
let pendingWrites = new Map();
let authenticatedInitializationPromise = null;
let authenticatedSyncStarted = false;

const safeParse = (value, fallback = []) => {
  try {
    const parsed = JSON.parse(value || "null");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const getItemId = (item, index) => {
  const raw =
    item?.id ??
    item?.appointmentId ??
    item?.patientId ??
    item?.clientId ??
    item?.employeeId;

  if (raw !== undefined && raw !== null && String(raw).trim()) {
    return String(raw).replaceAll("/", "_");
  }

  return `record-${index + 1}`;
};

const stripUndefined = (value) => {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .map(([key, entry]) => [key, stripUndefined(entry)])
  );
};

const normalizeDocs = (snapshot) =>
  snapshot.docs.map((item) => ({
    ...item.data(),
    id: item.data()?.id ?? item.id,
  }));

async function replaceFirestoreCollection(collectionName, value) {
  if (!db || !isFirebaseConfigured) return;

  const records = Array.isArray(value) ? value : [];
  const existing = await getDocs(collection(db, collectionName));
  const batch = writeBatch(db);
  const nextIds = new Set();

  records.forEach((record, index) => {
    const id = getItemId(record, index);
    nextIds.add(id);
    batch.set(
      doc(db, collectionName, id),
      stripUndefined({ ...record, id, _updatedAt: new Date().toISOString() })
    );
  });

  existing.docs.forEach((existingDoc) => {
    if (!nextIds.has(existingDoc.id)) {
      batch.delete(existingDoc.ref);
    }
  });

  await batch.commit();
}

function scheduleCollectionWrite(key, value) {
  if (!DATA_MAP[key] || !db || !isFirebaseConfigured) return;

  pendingWrites.set(key, value);

  if (pendingWrites.get(`${key}__scheduled`)) return;
  pendingWrites.set(`${key}__scheduled`, true);

  window.setTimeout(async () => {
    pendingWrites.delete(`${key}__scheduled`);
    const latest = pendingWrites.get(key);
    pendingWrites.delete(key);

    try {
      syncingKeys.add(key);
      await replaceFirestoreCollection(DATA_MAP[key], safeParse(latest, []));
    } catch (error) {
      console.error(`Cloud sync failed for ${key}:`, error);
    } finally {
      syncingKeys.delete(key);
    }
  }, 250);
}

async function syncNotesFromCloud() {
  if (!db || !isFirebaseConfigured) return;

  try {
    const snapshot = await getDocs(collection(db, "clientNotes"));
    snapshot.docs.forEach((item) => {
      const notes = item.data()?.notes;
      if (Array.isArray(notes)) {
        originalSetItem(`${NOTE_PREFIX}${item.id}`, JSON.stringify(notes));
      }
    });
  } catch (error) {
    console.error("Client notes hydration failed:", error);
  }
}

async function migrateOrHydrateKey(key) {
  const collectionName = DATA_MAP[key];
  const localValue = originalGetItem(key);
  const localData = safeParse(localValue, []);

  if (!db || !isFirebaseConfigured) return;

  try {
    const snapshot = await getDocs(collection(db, collectionName));

    if (!snapshot.empty) {
      const cloudData = normalizeDocs(snapshot);
      originalSetItem(key, JSON.stringify(cloudData));
      return;
    }

    if (Array.isArray(localData) && localData.length > 0) {
      await replaceFirestoreCollection(collectionName, localData);
    }
  } catch (error) {
    console.error(`Firestore hydration failed for ${key}:`, error);
  }
}

function startRealtimeListener(key) {
  if (!db || !isFirebaseConfigured) return () => {};

  const collectionName = DATA_MAP[key];

  return onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      if (syncingKeys.has(key)) return;

      const data = normalizeDocs(snapshot);
      originalSetItem(key, JSON.stringify(data));
      window.dispatchEvent(
        new CustomEvent("clinic-cloud-update", { detail: { key } })
      );
    },
    (error) => {
      console.error(`Realtime listener failed for ${key}:`, error);
    }
  );
}

function installLocalStorageBridge() {
  if (bridgeInstalled || typeof window === "undefined") return;
  bridgeInstalled = true;

  storagePrototype.setItem = function patchedSetItem(key, value) {
    originalSetItem(key, value);

    if (syncingKeys.has(key)) return;

    if (DATA_MAP[key]) {
      scheduleCollectionWrite(key, value);
      return;
    }

    if (key.startsWith(NOTE_PREFIX) && db && isFirebaseConfigured) {
      const clientId = key.slice(NOTE_PREFIX.length);
      const notes = safeParse(value, []);
      syncingKeys.add(key);
      writeBatch(db)
        .set(doc(db, "clientNotes", clientId), {
          clientId,
          notes: Array.isArray(notes) ? notes : [],
          _updatedAt: new Date().toISOString(),
        })
        .commit()
        .catch((error) => console.error("Client note sync failed:", error))
        .finally(() => syncingKeys.delete(key));
    }
  };

  storagePrototype.removeItem = function patchedRemoveItem(key) {
    originalRemoveItem(key);

    if (DATA_MAP[key] && db && isFirebaseConfigured) {
      // Existing screens almost never remove these datasets. If they do,
      // an empty local array is the safest cloud representation.
      scheduleCollectionWrite(key, "[]");
    }
  };
}

export async function initializeCloudStorage() {
  installLocalStorageBridge();

  if (!isFirebaseConfigured || !db) {
    console.warn(
      "Firebase is not configured yet. The app is running in local fallback mode."
    );
    return { configured: false, unsubscribe: () => {} };
  }

  if (!auth?.currentUser) {
    return { configured: true, waitingForAuth: true, unsubscribe: () => {} };
  }

  if (authenticatedSyncStarted) {
    return { configured: true, unsubscribe: () => {} };
  }

  if (authenticatedInitializationPromise) {
    return authenticatedInitializationPromise;
  }

  authenticatedInitializationPromise = (async () => {
    const keys = Object.keys(DATA_MAP);
    await Promise.all(keys.map(migrateOrHydrateKey));
    await syncNotesFromCloud();

    const unsubscribers = keys.map(startRealtimeListener);
    authenticatedSyncStarted = true;

    return {
      configured: true,
      unsubscribe: () => unsubscribers.forEach((unsubscribe) => unsubscribe()),
    };
  })();

  try {
    return await authenticatedInitializationPromise;
  } catch (error) {
    authenticatedInitializationPromise = null;
    throw error;
  }
}

export const getLocalStorageRaw = originalGetItem;
