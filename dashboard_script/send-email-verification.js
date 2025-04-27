import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup } from "https://element.roovix.com/functions/popups.js";

// Send link to email for verification 
// By clicking send email verification button
document.getElementById("send-email-verification").addEventListener("click", async ()=> {
    const user = auth.currentUser;
    if(user) {
        sendEmailVerification(user)
        .then(()=>{
            let notice  = confirmPopup(
                "Sent successful",
                `Check your (${user.email}) email address we have sent verification link.`,

                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                document.getElementById("popup_container")
            )

            document.getElementById("popup_container").style.display = "flex";
            document.getElementById("popup_container").appendChild(notice);
        })
        .catch((err)=>{
            let notice  = noticePopup(
                "Error sending verification link",
                `${err.message}, Please try again later`,

                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                ()=>{
                    document.getElementById("popup_container").style.display = "none";
                },
                document.getElementById("popup_container")
            )

            document.getElementById("popup_container").style.display = "flex";
            document.getElementById("popup_container").appendChild(notice);
        })
    }else {
        window.location.href = '/login.html';
    }
});