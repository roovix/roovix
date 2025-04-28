import { auth } from "https://www.roovix.com/config/firebase_config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup } from "https://element.roovix.com/functions/popups.js";


// Turn on multi factor authentication
const multiFactorToggle = document.getElementById('multiFactorToggleSwitch');
multiFactorToggle.addEventListener('click', function(e) {
    e.preventDefault(); // Stops the checkbox from changing

    // Verification code here to turn on multi factor auth
});
// FUNCTION TO PROGRAMMATICALLY CHANGE
function verifyAndToggle() {
    multiFactorToggle.checked = true; // Your code controls it
}

// Logout current user
document.getElementById("logout").addEventListener("click", async () => {
    try {
        await signOut(auth);
        // Redirect to hub page after successful logout
        window.location.href = "/hub";

    } catch (error) {
        let notice  = noticePopup(
            "Logout failed, Please try again.",
            error.message,

            ()=>{
                document.getElementById("popup_container").style.display = "none";
                removePostParamAndReload();
            },
            ()=>{
                document.getElementById("popup_container").style.display = "none";
                removePostParamAndReload();
            },
            document.getElementById("popup_container")
        )

        document.getElementById("popup_container").style.display = "flex";
        document.getElementById("popup_container").appendChild(notice);
    }
});


// Open security action pages
document.getElementById("change-password").addEventListener("click", ()=>{
    window.location.href = "/change-password.html"
});
document.getElementById("change-email-address").addEventListener("click", ()=>{
    window.location.href = "/change-email.html"
});
document.getElementById("reset-password").addEventListener("click", ()=>{
    window.location.href = "/reset-password.html"
});