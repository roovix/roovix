import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Initialize database
var database = db;

// Track time on the page
let pageStartTime = Date.now();  // Start time when the page loads
let currentPath = window.location.pathname; // Get the current page URL

// Function to calculate time spent on the page in seconds
function calculateTimeSpent() {
  let timeSpent = Math.floor((Date.now() - pageStartTime) / 1000); // in seconds
  return timeSpent;
}

// Function to save time spent on the page to Firebase
function saveTimeToFirebase(userId) {
  let timeSpent = calculateTimeSpent();
  let pageUrl = window.location.href;
  let date = new Date().toISOString();  // Current date and time in ISO format

  // Create an object to hold the data
  let screenTimeData = {
    pageUrl: pageUrl,
    timeSpent: timeSpent,
    date: date
  };

  // Push the data to Firebase Realtime Database under the user's screenTime node
  const screenTimeRef = ref(database, `users/${userId}/screenTime`);
  push(screenTimeRef, screenTimeData)
    .then(() => {
      console.log('Time saved successfully');
    })
    .catch((error) => {
      console.error('Error saving screen time to Firebase:', error);
    });
}

// Listen for auth state changes to get the current user
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    let userId = user.uid;

    // Track time in 45-second intervals
    setInterval(() => {
      // Save the time spent during the current 45 seconds interval
      saveTimeToFirebase(userId);
      // Reset the start time for the next 45-second interval
      pageStartTime = Date.now();  // Reset the start time for the next interval
    }, 45000); // Every 45 seconds
  } else {
    // User is not signed in
    console.log('User is not signed in to save screen time');
  }
});
