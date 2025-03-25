// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4O6t-0B50BajRG62SMjs6221YhUy-2k4",
  authDomain: "roovix-8e4d2.firebaseapp.com",
  projectId: "roovix-8e4d2",
  storageBucket: "roovix-8e4d2.appspot.com",
  messagingSenderId: "772925631250",
  appId: "1:772925631250:web:45ae6220bf92cbdc8fa1cb",
  measurementId: "G-2ZR4V28R7H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

// Export Firebase services for use in other files
export { app, auth, db, analytics };