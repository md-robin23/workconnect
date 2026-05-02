/**
 * SIGNUP PAGE JAVASCRIPT
 * Handles phone number validation, OTP sending, OTP verification, and account creation
 */

// Import OTP functions from API module
import { sendOtp, verifyOtp, signUp } from './api.js';

// ========================================
// FIREBASE CONFIGURATION - Initialize Firebase for OTP authentication
// ========================================
// NOTE: Replace these credentials with your Firebase project credentials
// Get these from your Firebase Console: https://console.firebase.google.com/
const firebaseConfig = {

    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);
} catch (error) {
    console.warn("Firebase already initialized or config missing - using demo mode", error);
}

// ========================================
// DOM ELEMENTS - References to HTML elements used in the signup process
// ========================================
const phoneInput = document.getElementById("number");
const sendOtpBtn = document.getElementById("sendOtp");
const confirmOtpBtn = document.getElementById("confirmOtp");
const createAccountBtn = document.getElementById("createAccount");
const sendOtpText = document.getElementById("sendOtpText");
const otpSection = document.getElementById("otpSection");
const passwordSection = document.getElementById("passwordSection");
const passwordInput = document.getElementById("password");
const otpInputs = document.querySelectorAll(".otp-input");
const signupForm = document.getElementById("signupForm");
const numberError = document.getElementById("numberError");
const otpError = document.getElementById("otpError");
const passwordError = document.getElementById("passwordError");

// ========================================
// GLOBAL VARIABLES - State management for OTP process
// ========================================
let OTP = "";
let isOtpSent = false;
let verificationId = null; // Firebase verification ID
let userPhoneNumber = ""; // Store user's phone number

// ========================================
// PHONE NUMBER VALIDATION - Validates phone input and enables/disables send OTP button
// ========================================
phoneInput.addEventListener('input', function () {
    const val = phoneInput.value.trim();
    const isValid = val.length === 11 && /^[0-9]{11}$/.test(val);

    if (isValid) {
        sendOtpBtn.disabled = false;
        phoneInput.classList.remove('error');
        numberError.style.display = 'none';
    } else {
        sendOtpBtn.disabled = true;
        if (val.length > 0) {
            phoneInput.classList.add('error');
            numberError.textContent = 'Please enter a valid 11-digit phone number';
            numberError.style.display = 'block';
        } else {
            phoneInput.classList.remove('error');
            numberError.style.display = 'none';
        }
    }
});

// ========================================
// ========================================
// FORMAT PHONE NUMBER - Converts BD phone number to international format
// ========================================
function formatPhoneNumber(phone) {
    // Converts 01813233767 to 8801813233767 (Bangladesh format without plus)
    if (phone.startsWith('0')) {
        return '88' + phone;
    }
    if (phone.startsWith('+88')) {
        return phone.substring(1);
    }
    return phone;
}

// ========================================
// SEND OTP BUTTON HANDLER - Handles sending OTP to user's phone number via Alpha SMS API
// ========================================
sendOtpBtn.addEventListener('click', async function () {
    const phoneNumber = phoneInput.value.trim();

    if (!phoneNumber || phoneNumber.length !== 11) {
        phoneInput.classList.add('error');
        numberError.textContent = 'Please enter a valid phone number';
        numberError.style.display = 'block';
        return;
    }

    // Store phone number for later use
    userPhoneNumber = phoneNumber;

    // Disable button and show loading state
    sendOtpBtn.disabled = true;
    sendOtpText.textContent = 'Sending...';

    try {
        // Send OTP via backend API
        await sendOtp(phoneNumber);

        // Show OTP section
        otpSection.style.display = 'block';
        isOtpSent = true;

        // Update button text and hide send button, show confirm button
        sendOtpText.textContent = 'Resend OTP';
        sendOtpBtn.style.display = 'none';
        confirmOtpBtn.style.display = 'flex';

        // Focus first OTP input
        otpInputs[0].focus();

        // Show success message
        numberError.textContent = `OTP sent to ${phoneNumber}.`;
        numberError.style.color = '#4CAF50';
        numberError.style.display = 'block';

    } catch (error) {
        const isDnsError = error.message && error.message.includes('Failed to fetch');
        numberError.textContent = isDnsError
            ? 'Failed to reach SMS service. Check the API host and your internet/DNS connection.'
            : 'Failed to send OTP. Please try again.';
        numberError.style.color = '#f44336';
        numberError.style.display = 'block';
    } finally {
        sendOtpBtn.disabled = false;
        if (!isOtpSent) {
            sendOtpText.textContent = 'Send OTP';
        }
    }
});

// ========================================
// OTP INPUT HANDLING - Manages user input in OTP fields with auto-focus and validation
// ========================================
otpInputs.forEach((input, index) => {
    // Handle input event - validates digits and moves focus
    input.addEventListener('input', (e) => {
        const value = e.target.value;

        if (!/^[0-9]$/.test(value)) {
            e.target.value = '';
            return;
        }

        // Auto-focus next input
        if (value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        // Check if OTP is complete
        checkOtpComplete();
    });

    // Handle keyboard navigation (backspace, enter, arrows)
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            if (input.value === '' && index > 0) {
                e.preventDefault();
                otpInputs[index - 1].focus();
                otpInputs[index - 1].select();
            }
        }

        if (e.key === 'Enter') {
            const completeOtp = Array.from(otpInputs).map(inp => inp.value).join('');
            if (completeOtp.length === otpInputs.length) {
                e.preventDefault();
                confirmOtpBtn.click();
            }
        }

        if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            otpInputs[index - 1].focus();
        }

        if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
            e.preventDefault();
            otpInputs[index + 1].focus();
        }
    });

    // Handle paste event - distributes pasted digits across inputs
    input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pastedData = (e.clipboardData || window.clipboardData).getData('text');
        const digits = pastedData.replace(/\D/g, '');

        if (digits.length > 0) {
            let currentIndex = index;
            for (let i = 0; i < digits.length && currentIndex < otpInputs.length; i++) {
                otpInputs[currentIndex].value = digits[i];
                currentIndex++;
            }
            if (currentIndex < otpInputs.length) {
                otpInputs[currentIndex].focus();
            } else {
                otpInputs[otpInputs.length - 1].focus();
            }
            checkOtpComplete();
        }
    });
});

// ========================================
// CONFIRM OTP BUTTON HANDLER - Verifies the entered OTP and completes signup
// ========================================
confirmOtpBtn.addEventListener('click', async function () {
    OTP = Array.from(otpInputs)
        .map(inp => inp.value)
        .join('');

    if (OTP.length !== 6) {
        otpError.textContent = 'Please enter the complete 6-digit OTP';
        otpError.style.display = 'block';
        return;
    }

    // Disable button and show loading state
    confirmOtpBtn.disabled = true;
    confirmOtpBtn.innerHTML = '<span>Verifying...</span><i class="fas fa-spinner fa-spin"></i>';

    try {
        // Verify OTP via backend API
        await verifyOtp(userPhoneNumber, OTP);

        // Clear OTP inputs
        otpInputs.forEach(input => {
            input.value = '';
            input.classList.remove('error');
        });

        // Hide OTP section and show password section
        otpSection.style.display = 'none';
        passwordSection.style.display = 'block';
        // Hide confirm OTP button and show create account button
        confirmOtpBtn.style.display = 'none';
        createAccountBtn.style.display = 'flex';
        // Focus password input
        passwordInput.focus();

        // Clear error message
        otpError.style.display = 'none';
    } catch (error) {
        otpError.textContent = error.message || 'OTP verification failed';
        otpError.style.display = 'block';
    } finally {
        confirmOtpBtn.disabled = false;
        confirmOtpBtn.innerHTML = '<span>Verify OTP</span><i class="fas fa-check"></i>';
    }
});

// ========================================
// CREATE ACCOUNT BUTTON HANDLER - Submits phone number and password to backend for account creation
// ========================================
createAccountBtn.addEventListener('click', async function () {
    const phoneNumber = userPhoneNumber;
    const password = passwordInput.value.trim();

    if (!password || password.length < 6) {
        passwordInput.classList.add('error');
        passwordError.textContent = 'Password must be at least 6 characters long';
        passwordError.style.display = 'block';
        return;
    }

    // Disable button and show loading state
    createAccountBtn.disabled = true;
    createAccountBtn.innerHTML = '<span>Creating...</span><i class="fas fa-spinner fa-spin"></i>';

    try {
        // Call backend API to create user account
        const response = await signUp(phoneNumber, password);

        if (response.success) {
            // Store token and user info if provided
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data && response.data.user) {
                localStorage.setItem('userId', response.data.user._id);
                localStorage.setItem('userPhone', response.data.user.phoneNumber);
            }

            // Clear all fields
            phoneInput.value = '';
            passwordInput.value = '';
            otpInputs.forEach(input => input.value = '');

            // Reset form to initial state
            otpSection.style.display = 'none';
            passwordSection.style.display = 'none';
            sendOtpBtn.style.display = 'flex';
            confirmOtpBtn.style.display = 'none';
            createAccountBtn.style.display = 'none';
            isOtpSent = false;

            // Redirect to home page immediately
            window.location.href = 'home.html';
        } else {
            throw new Error(response.message || 'Failed to create account');
        }

    } catch (error) {
        passwordError.textContent = `Failed to create account: ${error.message}`;
        passwordError.style.display = 'block';
    } finally {
        createAccountBtn.disabled = false;
        createAccountBtn.innerHTML = '<span>Create Account</span><i class="fas fa-user-plus"></i>';
    }
});

// ========================================
// PASSWORD INPUT VALIDATION - Validates password input and enables/disables create account button
// ========================================
passwordInput.addEventListener('input', function () {
    const password = passwordInput.value.trim();
    const isValid = password.length >= 6;

    if (isValid) {
        createAccountBtn.disabled = false;
        passwordInput.classList.remove('error');
        passwordError.style.display = 'none';
    } else {
        createAccountBtn.disabled = true;
        if (password.length > 0) {
            passwordInput.classList.add('error');
            passwordError.textContent = 'Password must be at least 6 characters long';
            passwordError.style.display = 'block';
        } else {
            passwordInput.classList.remove('error');
            passwordError.style.display = 'none';
        }
    }
});

passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const password = passwordInput.value.trim();
        if (password.length >= 6 && !createAccountBtn.disabled) {
            e.preventDefault();
            createAccountBtn.click();
        }
    }
});

// ========================================
// CHECK OTP COMPLETE FUNCTION - Validates if all OTP inputs are filled and enables/disables confirm button
// ========================================
function checkOtpComplete() {
    OTP = Array.from(otpInputs)
        .map(inp => inp.value)
        .join('');

    const isComplete = OTP.length === 6;
    confirmOtpBtn.disabled = !isComplete;

    if (isComplete) {
        otpError.style.display = 'none';
    }
}

// ========================================
// FORM SUBMISSION PREVENTION - Prevents default form submission behavior
// ========================================
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();                                       // Prevent page reload on form submit

    const password = passwordInput.value.trim();
    const otpComplete = Array.from(otpInputs).map(inp => inp.value).join('').length === otpInputs.length;

    if (password.length >= 6 && passwordSection.style.display === 'block' && !createAccountBtn.disabled) {
        createAccountBtn.click();
        return;
    }

    if (otpComplete && otpSection.style.display === 'block' && !confirmOtpBtn.disabled) {
        confirmOtpBtn.click();
        return;
    }
});

// ========================================
// INITIAL FOCUS - Sets focus on phone input when page loads
// ========================================
phoneInput.focus();                                           // Focus phone input for immediate user interaction

