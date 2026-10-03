
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_lkXvwHAjZpAIsEpBmdlGF8KEmazWQ9M",
  authDomain: "citizenconnect-75755.firebaseapp.com",
  projectId: "citizenconnect-75755",
  storageBucket: "citizenconnect-75755.firebasestorage.app",
  messagingSenderId: "643312814323",
  appId: "1:643312814323:web:82ea93dd44de6765f64f86"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();


