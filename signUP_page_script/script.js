import { 
    createUserWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "https://www.roovix.com/config/firebase_config.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// DOM Elements
const elements = {
    featuresToggle: document.getElementById('featuresToggle'),
    featuresList: document.getElementById('featuresList'),
    toggleIcon: document.getElementById('toggleIcon'),
    form: document.getElementById('signupForm'),
    emailGroup: document.getElementById('emailGroup'),
    passwordGroup: document.getElementById('passwordGroup'),
    usernameGroup: document.getElementById('usernameGroup'),
    emailInput: document.getElementById('email'),
    passwordInput: document.getElementById('password'),
    usernameInput: document.getElementById('username'),
    emailError: document.getElementById('email-error'),
    usernameError: document.getElementById('username-error'),
    profilePic: document.getElementById('profile-pic'),
    profilePicPreview: document.getElementById('profile-pic-preview'),
    profilePicGroup: document.getElementById("profile-pic-group"),
    profilePicError: document.getElementById('profile-pic-error'),
    submitButton: document.getElementById('createAccountButton')
};

// Constants
const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireNumber: true,
    requireLowercase: true,
    requireUppercase: false,
    requireSpecialChar: false,
    strongLength: 15
};

const USERNAME_REGEX = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/;

// Toggle features list
elements.featuresToggle.addEventListener('click', () => {
    elements.featuresList.classList.toggle('show');
    elements.toggleIcon.innerHTML = elements.featuresList.classList.contains('show') 
        ? '<polyline points="18 15 12 9 6 15"></polyline>' 
        : '<polyline points="6 9 12 15 18 9"></polyline>';
});

/**
 * Check if a username already exists in the database
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} - True if username exists, false otherwise
 */
async function isUsernameTaken(username) {
    try {
        const dbRef = ref(db, `user_uname/${username}`);
        const snapshot = await get(dbRef);
        return snapshot.exists();
    } catch (error) {
        console.error('Error checking username:', error);
        return true; // Assume username is taken to prevent duplicates on error
    }
}

/**
 * Validate password against requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password is valid
 */
function validatePassword(password) {
    if (password.length >= PASSWORD_REQUIREMENTS.strongLength) return true;
    
    if (password.length < PASSWORD_REQUIREMENTS.minLength) return false;
    
    if (PASSWORD_REQUIREMENTS.requireNumber && !/\d/.test(password)) return false;
    
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) return false;
    
    return true;
}

/**
 * Show error message for a form field
 * @param {HTMLElement} element - The form group element
 * @param {string} message - The error message to display
 * @param {number} timeout - Time in ms to auto-hide the error (default 10s)
 */
function showError(element, message, timeout = 10000) {
    element.classList.add('error');
    const errorElement = element.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        if (timeout > 0) {
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, timeout);
        }
    }
}

/**
 * Hide error message for a form field
 * @param {HTMLElement} element - The form group element
 */
function hideError(element) {
    element.classList.remove('error');
    const errorElement = element.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * Save user data to the database
 * @param {Object} user - Firebase user object
 * @param {string} username - The username
 * @returns {Promise<void>}
 */
async function saveUserData(user, username, imageUrl) {
    let user_image = "";
    if(!imageUrl) {
        user_image = "https://roovix.com/image_assets/user_default.png";
    }else{
        user_image = imageUrl;
    }
    const userData = {
        uid: user.uid,
        email: user.email,
        username: username,
        profile_picture: user_image,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: {
            value: "Member"
        }
    };

    // Use transaction to ensure data consistency
    await Promise.all([
        set(ref(db, `users/${user.uid}`), userData),
        set(ref(db, `user_uname/${username}`), {
            uid: user.uid,
            email: user.email
        })
    ]);
}

// Profile picture change handler
elements.profilePic.addEventListener('change', () => {
    const file = elements.profilePic.files[0];
    
    if (file) {
        // Validate file type
        if (!file.type.match('image.*')) {
            elements.profilePicError.textContent = 'Please select a valid image file';
            elements.profilePicError.style.display = 'block';
            elements.profilePic.value = ''; // Clear the input
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            elements.profilePicError.textContent = 'Image size must be less than 5MB';
            elements.profilePicError.style.display = 'block';
            elements.profilePic.value = ''; // Clear the input
            return;
        }
        
        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            elements.profilePicPreview.src = e.target.result;
            elements.profilePicError.style.display = 'none';
            elements.profilePicGroup.classList.remove('error');
        };
        reader.readAsDataURL(file);
    }
});


// Form validation and submission
elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;
    
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value.trim();
    const username = elements.usernameInput.value.trim();
    
    // Update button text and state
    elements.submitButton.innerHTML = 'Creating Account...';
    elements.submitButton.disabled = true;

    // Validate email
    if (!email) {
        showError(elements.emailGroup, 'Email is required');
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(elements.emailGroup, 'Please enter a valid email address');
        isValid = false;
    } else {
        hideError(elements.emailGroup);
    }
    
    // Validate password
    if (!password) {
        showError(elements.passwordGroup, 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(
            elements.passwordGroup, 
            `Password must be at least ${PASSWORD_REQUIREMENTS.strongLength} characters OR ` +
            `${PASSWORD_REQUIREMENTS.minLength}+ characters with at least one number`
        );
        isValid = false;
    } else {
        hideError(elements.passwordGroup);
    }

    // Validate profile picture
    if (!elements.profilePic.files || elements.profilePic.files.length === 0) {
        elements.profilePicError.textContent = 'Profile picture is required';
        elements.profilePicError.style.display = 'block';
        elements.profilePicGroup.classList.add('error');
        isValid = false;
    } else {
        elements.profilePicError.style.display = 'none';
        elements.profilePicGroup.classList.remove('error');
    }
    
    // Validate username
    if (!username) {
        showError(elements.usernameGroup, 'Username is required');
        isValid = false;
    } else if (username.length < 3 || username.length > 20) {
        showError(elements.usernameGroup, 'Username must be between 3-20 characters');
        isValid = false;
    } else if (!USERNAME_REGEX.test(username)) {
        showError(elements.usernameGroup, 'Username can only contain letters, numbers, and single hyphens between');
        isValid = false;
    } else {
        hideError(elements.usernameGroup);
    }
    
    if (!isValid) {
        // Reset button if validation fails
        elements.submitButton.innerHTML = 'Continue <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>';
        elements.submitButton.disabled = false;
        return;
    }

    try {
        // Check if username is available
        if (await isUsernameTaken(username)) {
            showError(elements.usernameGroup, 'Username is already taken. Please choose another one.');
            elements.usernameInput.value = '';
            elements.submitButton.innerHTML = 'Continue <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>';
            elements.submitButton.disabled = false;
            return;
        }

        // Upload profile picture
        const imageUrl = await uploadImage(elements.profilePic.files[0]);

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with username
        await updateProfile(user, { displayName: username });
        
        // Save user data to database
        await saveUserData(user, username, imageUrl);

        // Success - redirect to dashboard
        window.location.replace('/dashboard');

    } catch (error) {
        console.error('Signup error:', error);
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                showError(elements.emailGroup, 'Email is already registered. Please use a different email.');
                elements.emailInput.value = '';
                break;
            case 'auth/invalid-email':
                showError(elements.emailGroup, 'Please enter a valid email address.');
                break;
            case 'auth/weak-password':
                showError(elements.passwordGroup, 'Password is too weak. Please choose a stronger password.');
                break;
            default:
                alert('An unexpected error occurred. Please try again later.');
        }
    }

    // Reset button after completion
    elements.submitButton.innerHTML = 'Continue <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>';
    elements.submitButton.disabled = false;
});

// Real-time validation
elements.emailInput.addEventListener('input', () => {
    if (elements.emailInput.value.trim()) {
        hideError(elements.emailGroup);
    }
});

elements.passwordInput.addEventListener('input', () => {
    if (elements.passwordInput.value.trim()) {
        hideError(elements.passwordGroup);
    }
});

elements.usernameInput.addEventListener('input', () => {
    if (elements.usernameInput.value.trim()) {
        hideError(elements.usernameGroup);
    }
});

// Initialize form with email from URL if present
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('user_email');
    if (email) {
        elements.emailInput.value = email;
    }
});
