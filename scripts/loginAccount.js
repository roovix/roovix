import { auth } from "https://www.roovix.com/config/firebase_config.js"
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"


document.addEventListener("DOMContentLoaded", function () {
    const loginAccount = document.getElementById("loginAccount");
    const searchLoginParms = new URLSearchParams(window.location.search);

    if(searchLoginParms.get("login") === "true") {
        loginAccount.style.display = "flex";
    }else{
        loginAccount.style.display = "none";
    }

    const loginLoad = document.getElementById("login-load");
    const login_email = document.getElementById("login_email");
    const login_pass = document.getElementById("login_pass");
    const login_btn = document.getElementById("login_btn");
    const login_error = document.getElementById("login_error");
    const login_success = document.getElementById("login_success");

    login_btn.addEventListener("click", async function (e) {
        let loginEmailValue = login_email.value;
        let loginPassValue = login_pass.value;

        try{
            loginLoad.style.display = "block";
            let loginUserCredential = await signInWithEmailAndPassword(auth, loginEmailValue, loginPassValue);
            
            loginLoad.style.display = "none";

            login_success.style.display = "flex";
            login_success.textContent = "Login Successful!";
            login_success.classList.add('success_right_opup');

            setTimeout(function(){
                login_success.style.display = "none";
                login_success.classList.remove('success_right_opup');
                window.location.replace("/");
            }, 2000);
        }
        catch(error) {
            loginLoad.style.display = "none";
            login_error.style.display = "block"
            login_error.textContent = error.message;
            login_error.classList.add('success_right_opup');

            setTimeout(function(){
                login_error.style.display = "none";
                login_error.classList.remove('success_right_opup');
            }, 5000);
        }

    });
            
});