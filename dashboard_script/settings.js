import { auth } from "https://www.roovix.com/config/firebase_config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup } from "https://element.roovix.com/functions/popups.js";


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