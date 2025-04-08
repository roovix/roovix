import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { isValidUID, isValidUsername } from "https://element.roovix.com/functions/app.js";

// Fetch user profile data from Firebase Realtime Database
let urlParams = window.location.search;
let params = new URLSearchParams(urlParams);
let userId = params.get('user_id');

// Function to resolve UID from username if needed
async function resolveUID(userId) {
  if (!isValidUID(userId) && isValidUsername(userId)) {
    // Fetch UID for this username
    const userRefForUId = ref(db, `user_uname/${userId}`);
    const usernameDataSnapshot = await get(userRefForUId);
    if (usernameDataSnapshot.exists()) {
      return usernameDataSnapshot.val().uid;
    } else {
      return null;
    }
  }
  return userId; // Already a UID
}

// Wait for Firebase Auth to initialize and check current user
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const resolvedUID = await resolveUID(userId);

    if (resolvedUID && user.uid === resolvedUID) {
      // ✅ UID matched – open dashboard
      openDashboard();
    }
  }
});

// Dummy function to simulate opening dashboard
function openDashboard() {
  window.location.replace('dashboard');
}
