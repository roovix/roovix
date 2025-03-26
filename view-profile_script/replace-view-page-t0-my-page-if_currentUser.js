import { auth } from "https://www.roovix.com/config/firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    // Get user_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlUserId = urlParams.get("user_id"); // Example: ?user_id=12345

    // Check authentication state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const currentUserId = user.uid;
            
            if (urlUserId === currentUserId) {
                // If user_id matches, redirect to dashboard.html
                window.location.href = "dashboard";
            }
        }
    });
});
