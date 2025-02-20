import { auth, db } from "https://www.roovix.com/config/firebase_config.js"
import { ref, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js"
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

// Get a reference to the fields
const user_email_submit_form = document.getElementById('user_email_submit_form');
const user_email = document.getElementById('user_email');
const user_name = document.getElementById('user_name');
const user_password = document.getElementById('pass');
const user_email_input = document.getElementById('create_email');
const user_confirm_password = document.getElementById('confirm_pass');
const create_account_btn  = document.getElementById('create_account_btn');

user_email_submit_form.addEventListener('submit', ()=>{
    event.preventDefault();
    let email = user_email.value;

    if(email === "") {
        user_email.classList.add("empty-input-field");
        return;
    }

    user_email.classList.remove("empty-input-field");
    window.location.href = `http://localhost:5500?user_email=${email}`;
})

document.addEventListener("DOMContentLoaded", function () {
    const create_account = document.getElementById('create_account');
    const urlParams = new URLSearchParams(window.location.search);

    if(user_email_input.value.trim() === "") {
        let email = urlParams.get('user_email');
        user_email_input.value = email;
    } 

    if (urlParams.has('user_email')) {
        create_account.style.display = 'flex';
    } else {
        create_account.style.display = 'none';
    }

    create_account_btn.addEventListener('click', async () => {
        let password = user_password.value.trim();
        let confirm_password = user_confirm_password.value.trim();
        let name = user_name.value.trim();
        
        // Function to toggle error class
        function toggleErrorStyle(field, condition) {
            if (condition) {
                field.classList.add("empty-input-field");
            } else {
                field.classList.remove("empty-input-field");
            }
        }
        
        // Check if fields are empty
        toggleErrorStyle(user_name, name === "");
        toggleErrorStyle(user_password, password === "");
        toggleErrorStyle(user_confirm_password, confirm_password === "");
        
        // Check if name is at least 4 characters long
        toggleErrorStyle(user_name, name.length < 4);
        
        // Check if password is at least 6 characters long
        toggleErrorStyle(user_password, password.length < 6);
        
        // Check if passwords match
        toggleErrorStyle(user_confirm_password, password.length >= 6 && password !== confirm_password);
        
        // Stop execution if any validation fails
        if (name === "" || name.length < 4 || password === "" || password.length < 6 || password !== confirm_password) {
            
            return;
        }
        
        // If everything is correct, remove error styles
        user_name.classList.remove("empty-input-field");
        user_password.classList.remove("empty-input-field");
        user_confirm_password.classList.remove("empty-input-field");
        
        const create_account_loading = document.getElementById("create_account_loading");
        const create_account_loadingLoad = document.getElementById("load-gif");
        const create_account_loadingSuccess = document.getElementById("success-right");
        const createAccountErrorMessage = document.getElementById("create_accoutn_error");

        try {
            // **🔥 Create user in Firebase Authentication**
            create_account_loading.style.display = "flex";
            create_account_loadingLoad.style.display = "block";
            create_account_loadingSuccess.style.display = "none";

            let finalEmail = user_email_input.value;

            const userCredential = await createUserWithEmailAndPassword(auth, finalEmail, password);
            const user = userCredential.user;

            // **📝 Store additional user info in Firebase Database**
            await set(ref(db, 'users/' + user.uid), {
                username: name,
                email: finalEmail
            });

            create_account_loadingLoad.style.display = "none";
            create_account_loadingSuccess.style.display = "block";
            create_account_loadingSuccess.classList.add("success_right_opup");
            setTimeout(()=>{
                create_account_loading.style.display = "none";
                create_account_loadingSuccess.classList.remove("success_right_opup");
                window.location.replace("/");
            }, 2500);

        } catch (error) {
            create_account_loading.style.display = "none";
            createAccountErrorMessage.style.display = "block";
            createAccountErrorMessage.classList.add("success_right_opup");
            createAccountErrorMessage.textContent = error.message;
            setTimeout(()=>{
                createAccountErrorMessage.style.display = "none";
                createAccountErrorMessage.classList.remove("success_right_opup");
            }, 5000);
            
        }
    });
});