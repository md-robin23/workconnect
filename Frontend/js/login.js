import { loginUser } from './api.js';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const phoneInput = document.getElementById('number');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const loginButton = document.querySelector('.login-button');
const numberError = document.getElementById('numberError');
const passwordError = document.getElementById('passwordError');

// Password Toggle Functionality
togglePasswordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const icon = togglePasswordBtn.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Form Validation
function validatePhone(phone) {
    const phoneRegex = /^[0-9]{11}$/;
    return phoneRegex.test(phone);
}

function validatePassword(password) {
    return password.length >= 4;
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function clearError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

// Real-time validation
phoneInput.addEventListener('blur', () => {
    if (phoneInput.value && !validatePhone(phoneInput.value)) {
        showError(numberError, 'Phone number must be exactly 11 digits');
        phoneInput.classList.add('error');
    } else {
        clearError(numberError);
        phoneInput.classList.remove('error');
    }
});

passwordInput.addEventListener('blur', () => {
    if (passwordInput.value && !validatePassword(passwordInput.value)) {
        showError(passwordError, 'Password must be at least 4 characters');
        passwordInput.classList.add('error');
    } else {
        clearError(passwordError);
        passwordInput.classList.remove('error');
    }
});

// Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userPhoneNumber = phoneInput.value.trim();
    const userPassword = passwordInput.value;

    // Clear previous errors
    clearError(numberError);
    clearError(passwordError);
    phoneInput.classList.remove('error');
    passwordInput.classList.remove('error');

    // Validation
    if (!userPhoneNumber) {
        showError(numberError, 'Phone number is required');
        phoneInput.classList.add('error');
        return;
    }

    if (!validatePhone(userPhoneNumber)) {
        showError(numberError, 'Phone number must be exactly 11 digits');
        phoneInput.classList.add('error');
        return;
    }

    if (!userPassword) {
        showError(passwordError, 'Password is required');
        passwordInput.classList.add('error');
        return;
    }

    if (!validatePassword(userPassword)) {
        showError(passwordError, 'Password must be at least 4 characters');
        passwordInput.classList.add('error');
        return;
    }

    // Disable button during submission
    loginButton.disabled = true;
    const originalHTML = loginButton.innerHTML;
    loginButton.innerHTML = '<span>Logging in...</span>';

    try {
        const data = await loginUser(userPhoneNumber, userPassword);

        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userId', data.data.userExists._id);
        localStorage.setItem('userPhone', data.data.userExists.phoneNumber);        window.location.href = '../pages/home.html';

    } catch (error) {
        console.error('Error occurred while logging in:', error);
        
        // Show appropriate error message
        const errorMessage = error.message || 'An error occurred during login. Please try again.';
        
        if (error.message.includes('phone')) {
            showError(numberError, 'Phone number not found');
            phoneInput.classList.add('error');
        } else if (error.message.includes('password')) {
            showError(passwordError, 'Incorrect password');
            passwordInput.classList.add('error');
        } else {
            // Show error at the top of the form
            const formError = document.createElement('div');
            formError.style.cssText = 'padding: 12px; margin-bottom: 20px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 8px; font-size: 14px;';
            formError.textContent = errorMessage;
            loginForm.insertBefore(formError, loginForm.firstChild);
            
            setTimeout(() => formError.remove(), 5000);
        }
    } finally {
        loginButton.disabled = false;
        loginButton.innerHTML = originalHTML;
    }
});
