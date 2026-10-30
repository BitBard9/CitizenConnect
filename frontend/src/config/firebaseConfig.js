
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// In Docker, nginx writes /config.js from FIREBASE_* env vars at container start
// (see docker/firebase-config.sh). In local dev, set VITE_FIREBASE_* in frontend/.env.local.
const runtimeConfig = window.__FIREBASE_CONFIG__ || {};

const firebaseConfig = {
  apiKey: runtimeConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: runtimeConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: runtimeConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: runtimeConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error(
    "Missing Firebase config. Set FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID and FIREBASE_APP_ID " +
      "(Docker) or VITE_FIREBASE_* in frontend/.env.local (Vite dev)."
  );
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
