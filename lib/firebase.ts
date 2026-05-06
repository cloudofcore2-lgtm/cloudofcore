import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMQWWMYp_aoHX4oV-wn83yvnPT1Urc7F0",
  authDomain: "cloudofcore-4bfa4.firebaseapp.com",
  projectId: "cloudofcore-4bfa4",
  storageBucket: "cloudofcore-4bfa4.firebasestorage.app",
  messagingSenderId: "781262918779",
  appId: "1:781262918779:web:fba0d81bcf902d87f7bede",
  measurementId: "G-MKGRDB5X8S"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
