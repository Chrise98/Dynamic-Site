document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const sendButton = document.getElementById('sendingButtom');
    const confirmCheckbox = document.getElementById('confirmCheckbox');

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');

    // Helper function to validate form
    const checkingForm = () => {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        const isNameValid = /^[a-zA-Z\s]+$/.test(name) && name.length > 0;
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        nameError.textContent = isNameValid ? '' : 'Name must only contain letters and spaces.';
        emailError.textContent = isEmailValid ? '' : 'Enter a valid email address.';

        sendButton.disabled = !(isNameValid && isEmailValid && confirmCheckbox.checked);
    };

    // Listen for input changes to validate
    nameInput.addEventListener('input', checkingForm);
    emailInput.addEventListener('input', checkingForm);
    confirmCheckbox.addEventListener('change', checkingForm);

    // Handle form submission
    contactForm.addEventListener('submit', (sub) => {
        sub.preventDefault();
        alert('Congrats you have submited your form');
        contactForm.reset();
        sendButton.disabled = true; // Disable button after submission
    });

    console.log('Contact script loaded successfully');

    // Initial validation check
    checkingForm();
});
