// Toggle features list
const featuresToggle = document.getElementById('featuresToggle');
const featuresList = document.getElementById('featuresList');
const toggleIcon = document.getElementById('toggleIcon');

featuresToggle.addEventListener('click', () => {
    featuresList.classList.toggle('show');
    if (featuresList.classList.contains('show')) {
        toggleIcon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
    } else {
        toggleIcon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
    }
});

// Form validation
const form = document.getElementById('signupForm');
const emailGroup = document.getElementById('emailGroup');
const passwordGroup = document.getElementById('passwordGroup');
const usernameGroup = document.getElementById('usernameGroup');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;
    
    // Validate email
    if (!emailInput.value.trim()) {
        emailGroup.classList.add('error');
        isValid = false;
    } else {
        emailGroup.classList.remove('error');
    }
    
    // Validate password
    if (!passwordInput.value.trim()) {
        passwordGroup.classList.add('error');
        isValid = false;
    } else {
        const password = passwordInput.value;
        const hasMinLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const isLongEnough = password.length >= 15;
        
        if (!(isLongEnough || (hasMinLength && hasNumber && hasLowercase))) {
            passwordGroup.classList.add('error');
            passwordGroup.querySelector('.error-message').textContent = 'Password does not meet requirements';
            isValid = false;
        } else {
            passwordGroup.classList.remove('error');
        }
    }
    
    // Validate username
    if (!usernameInput.value.trim()) {
        usernameGroup.classList.add('error');
        isValid = false;
    } else {
        const username = usernameInput.value;
        const isValidUsername = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(username);
        
        if (!isValidUsername) {
            usernameGroup.classList.add('error');
            usernameGroup.querySelector('.error-message').textContent = 'Username format is invalid';
            isValid = false;
        } else {
            usernameGroup.classList.remove('error');
        }
    }
    
    if (isValid) {
        alert('Account created successfully! Welcome to Roovix - Where Machines Think, and Ideas Take Flight.');
        form.reset();
    }
});

// Real-time validation
emailInput.addEventListener('input', () => {
    if (emailInput.value.trim()) {
        emailGroup.classList.remove('error');
    }
});

passwordInput.addEventListener('input', () => {
    if (passwordInput.value.trim()) {
        const password = passwordInput.value;
        const hasMinLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const isLongEnough = password.length >= 15;
        
        if (isLongEnough || (hasMinLength && hasNumber && hasLowercase)) {
            passwordGroup.classList.remove('error');
        }
    }
});

usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim()) {
        const username = usernameInput.value;
        const isValidUsername = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(username);
        
        if (isValidUsername) {
            usernameGroup.classList.remove('error');
        }
    }
});

window.document.addEventListener('DOMContentLoaded', () => {
    // Get email from url
    const urlParams = new URLSearchParams(window.location.search);
    let email = urlParams.get('user_email');
    if (email) {
        emailInput.value = email;
    }
})