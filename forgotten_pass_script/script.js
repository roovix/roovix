import { auth } from "https://www.roovix.com/config/firebase_config.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { deletePopup, confirmPopup, noticePopup } from "https://element.roovix.com/functions/popups.js";



document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const emailInput = document.getElementById('email');
    const emailGroup = document.getElementById('emailGroup');
    const resetButton = document.getElementById('resetButton');
    const resetSuccessMessage = document.getElementById('reset-success-message');
    const resetErrorMessage = document.getElementById('reset-error-message');
    
    resetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error states
        emailGroup.classList.remove('error');
        resetSuccessMessage.style.display = 'none';
        resetErrorMessage.style.display = 'none';
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            emailGroup.classList.add('error');
            return;
        }
        
        // Disable button during processing
        resetButton.disabled = true;
        resetButton.textContent = 'Sending...';
        
        // Send password reset email
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // Success
                resetSuccessMessage.style.display = 'block';
                resetForm.reset();
            })
            .catch((error) => {  
                // Show appropriate error message
                let errorMessage = 'Error sending reset email. Please try again.';
                
                switch (error.code) {
                    case 'auth/user-not-found':
                        errorMessage = 'No user found with this email address.';
                        break;
                    case 'auth/too-many-requests':
                        errorMessage = 'Too many requests. Please try again later.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        emailGroup.classList.add('error');
                        break;
                }
                
                resetErrorMessage.textContent = errorMessage;
                resetErrorMessage.style.display = 'block';
            })
            .finally(() => {
                resetButton.disabled = false;
                resetButton.textContent = 'Send reset link';
            });
    });
    
    // Email validation helper
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});
