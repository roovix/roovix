import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Form validation
const form = document.getElementById('loginForm');
const usernameGroup = document.getElementById('usernameGroup');
const passwordGroup = document.getElementById('passwordGroup');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message'); // For displaying errors
const credentialErrorMessage = document.getElementById('credential-error-message');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    const loginButton = document.getElementById('loginButton'); // Add the button ID in HTML
    loginButton.textContent = "Signing in..."; 
    loginButton.disabled = true; // Disable button to prevent multiple clicks

    // Validate username/email
    if (!usernameInput.value.trim()) {
        usernameGroup.classList.add('error');
        isValid = false;
    } else {
        usernameGroup.classList.remove('error');
    }

    // Validate password
    if (!passwordInput.value.trim()) {
        passwordGroup.classList.add('error');
        isValid = false;
    } else {
        passwordGroup.classList.remove('error');
    }

    if (isValid) {
        let email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!isValidEmail(email)) {
            const u_nameReg = ref(db, `/user_uname/${email}`);
            const user_data = await get(u_nameReg);
            if (user_data.exists()) {
                const emailValue = user_data.val();
                email = emailValue.email;
            }
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Update last login time with ISOString format
            const userRef = ref(db, `/users/${user.uid}`);
            await update(userRef, { lastLogin: new Date().toISOString() });
            window.location.replace('/dashboard'); // Redirect to dashboard
        } catch (error) {
            console.log(error.code);
            credentialErrorMessage.style.display = "block";

            if (error.code == "auth/invalid-credential") {
                credentialErrorMessage.textContent = "Wrong Password..!";
            } else if (error.code == "auth/invalid-email") {
                credentialErrorMessage.textContent = "Invalid email or username";
            } else {
                credentialErrorMessage.textContent = "Login failed. Try again.";
            }

            setTimeout(() => {
                credentialErrorMessage.style.display = "none";
            }, 3000);

            loginButton.textContent = "Login"; // Reset button text
            loginButton.disabled = false; // Re-enable button
            return;
        }

        form.reset();
    } else {
        loginButton.textContent = "Login"; // Reset button text
        loginButton.disabled = false; // Re-enable button
    }
});

// Real-time validation
usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim()) {
        usernameGroup.classList.remove('error');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim()) {
        passwordGroup.classList.remove('error');
    }
});
