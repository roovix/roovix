import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";


// User id for current user
let uid = "";

function fetchUserData() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            uid = user.uid;
            const userRef = ref(db, `users/${uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    document.getElementById("nav-user-profile-picture").src = snapshot.val().profile_picture;
                    document.getElementById("nav-username").textContent = snapshot.val().username;

                    // small-screen-user-profile-picture-top-right
                    document.getElementById('small-screen-user-profile-picture-top-right').src = snapshot.val().profile_picture;
                } else {
                    // No user found in database for current user id
                }
            }).catch((error) => {
                // Error while fetching user data
            });
        } else {
            // No user logged in to show profile data
        }
    });
}

document.addEventListener("DOMContentLoaded", ()=>{
    // Fetch user data
    fetchUserData();
    // Open profile when click
    document.getElementById("logo-nav-item").addEventListener('click', ()=>{
        if(uid !== "") {
            window.location.href = `/dashboard`;
        }else {
            window.location.href = "/login";
        }
    });
    // Open profile when join now button click if user logged in else open login page
    document.getElementById("join_now_button_hub_footer").addEventListener('click', ()=>{
        if(uid !== "") {
            window.location.href = `/dashboard`;
        } else {
            window.location.href = "/login";
        }
    });
    // Open profile when fotter dashboard click if user logged in else open login page
    document.getElementById("dashboard-option").addEventListener('click', ()=>{
        if(uid !== "") {
            window.location.href = `/dashboard`;
        } else {
            window.location.href = "/login";
        }
    });
    // Open profile when click small-screen-user-profile-picture-top-right 
    document.getElementById("small-screen-user-profile-picture-top-right").addEventListener('click', ()=>{
        if(uid!== "") {
            window.location.href = `/dashboard`;
        } else {
            window.location.href = "/login";
        }
    });
});
