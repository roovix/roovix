import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup } from "https://element.roovix.com/functions/popups.js";

// Send link to email for verification 
// By clicking send email verification button
document.getElementById("send-email-verification").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    try {
        await sendEmailVerification(user);
 
        confirmPopup(
            "Sent successfully",
            `Check your (${user.email}) inbox. We've sent a verification link.`,
            () => document.getElementById("popup_container").style.display = "none",
            () => document.getElementById("popup_container").style.display = "none",
            document.getElementById("popup_container")
        );
        
        document.getElementById("popup_container").style.display = "flex";
    } catch (err) {
 
        noticePopup(
            "Error sending verification",
            `${err.message}. Please try again later or contact support.`,
            () => document.getElementById("popup_container").style.display = "none",
            document.getElementById("popup_container")
        );
        
        document.getElementById("popup_container").style.display = "flex";
    }
});