document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling function
    function smoothScroll(target, duration) {
        var targetElement = document.querySelector(target);
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        var startPosition = window.pageYOffset;
        var distance = targetPosition - startPosition;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main > section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                    smoothScroll('#' + targetId, 1000);
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
        });
    });

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault(); 
            smoothScroll('#reservation', 1000);
            // Make sure the reservation section is visible
            document.getElementById('reservation').classList.remove('hidden');
            document.getElementById('reservation').classList.add('active');
        });
    }

    // Initialize Pikaday
    var picker = new Pikaday({
        field: document.getElementById('date'),
        minDate: new Date(),
        format: 'YYYY-MM-DD'
    });

    // Populate time slots
    var timeSelect = document.getElementById('time');
    for (var i = 11; i < 22; i++) {
        for (var j = 0; j < 60; j += 30) {
            var hour = i % 12 || 12;
            var ampm = i < 12 ? 'AM' : 'PM';
            var time = hour + ':' + (j === 0 ? '00' : j) + ' ' + ampm;
            var option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        }
    }

    // Reservation form validation
    document.getElementById('reservationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm(this)) {
            alert('Reservation submitted successfully!');
            this.reset();
        }
    });

    // Contact form validation
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm(this)) {
            alert('Message sent successfully!');
            this.reset();
        }
    });

    function validateForm(form) {
        let isValid = true;
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (field.hasAttribute('required') && !field.value.trim()) {
                alert(`Please fill in the ${field.name} field.`);
                isValid = false;
            }
        });

        if (form.email && !validateEmail(form.email.value)) {
            alert('Please enter a valid email address.');
            isValid = false;
        }

        return isValid;
    }

    function validateEmail(email) {
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});