const phoneInput = document.getElementById("number");
const sendBtn = document.getElementById("sendOtp");
const otpBox = document.getElementsByClassName("otpBox");
const otpInputs = document.querySelectorAll(".otpBox .otp-input");
const confirmOtp = document.getElementById('confirmOtp');
let OTP;

// phoneInput.focus();
phoneInput.addEventListener('input', function() {
    const val = phoneInput.value.trim();
    if(val.length === 11) {
        sendBtn.disabled = false;
        console.log(val);
    } else {
        sendBtn.disabled = true;
    }
});



otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        const value = e.target.value;

        if(!/^[0-9]$/.test(value)) {
            e.target.value= '';
            return;
        }

        if(value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }  
        
        if (index === otpInputs.length - 1) {
            OTP = Array.from(otpInputs)
                .map(inp => inp.value)
                .join('');

            confirmOtp.disabled = (OTP.length !== 6);
        }
    });

    input.addEventListener('keydown', (e) => {
            if(e.key === 'Backspace' || e.key === 'Enter') {
                if(input.value === '' && index > 0) {
                    e.preventDefault();
                    otpInputs[index - 1].focus();
                    otpInputs[index - 1].select();
                }
            }

            if(e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                otpInputs[index - 1].focus();
            }

            if(e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                e.preventDefault();
                otpInputs[index + 1].focus();
            }
        });
    
    input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pastedData.replace(/\D/g, '');

            if(digits.length > 0) {
                let currenInedx = index;
                for(let i = 0; i < digits.length && currenInedx < otpInputs.length; i++) {
                    otpInputs[currenInedx].value = digits[i];
                    currenInedx++;
                }
                if(currenInedx < otpInputs.length) {
                    otpInputs[currenInedx].focus();
                } else {
                    otpInputs[otpInputs.length - 1].focus();
                }
            }
        });
});

confirmOtp.addEventListener('click', () => {
    OTP = Array.from(otpInputs)
        .map(inp => inp.value)
        .join('');

    if (OTP.length !== 6) {
        console.log("OTP is incomplete!");
        // You can show alert / shake animation / red border etc.
        return;
    }

    console.log("Submitting OTP:", OTP);
    // Here you would normally send OTP + phone to backend
    // e.g. fetch('/verify-otp', { method: 'POST', body: JSON.stringify({ phone: phoneInput.value, otp: OTP }) })
});

