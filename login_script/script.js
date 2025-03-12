        // Form validation
        const form = document.getElementById('loginForm');
        const usernameGroup = document.getElementById('usernameGroup');
        const passwordGroup = document.getElementById('passwordGroup');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
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
                alert('Successfully signed in to Roovix!');
                form.reset();
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