// Navigation scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Animated counters
function animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Initialize counters when page loads
function initCounters() {
    // You can update these numbers based on actual data
    const familiesMoved = 1000;
    const recentBookings = 12;
    
    const familiesElement = document.getElementById('familiesMoved');
    const recentElement = document.getElementById('recentBookings');
    const quoteFamilies = document.getElementById('quoteFamilies');
    const quoteRecent = document.getElementById('quoteRecent');
    const ctaRecent = document.getElementById('ctaRecent');
    
    if (familiesElement) {
        animateCounter(familiesElement, familiesMoved, '+');
    }
    if (recentElement) {
        animateCounter(recentElement, recentBookings, '+');
    }
    if (quoteFamilies) {
        animateCounter(quoteFamilies, familiesMoved, '+');
    }
    if (quoteRecent) {
        animateCounter(quoteRecent, recentBookings, '+');
    }
    if (ctaRecent) {
        animateCounter(ctaRecent, recentBookings, '+');
    }
}

// Initialize counters on page load
window.addEventListener('load', initCounters);

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Quote form step navigation
let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = progress + '%';
    
    // Update step indicators
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        if (index + 1 <= currentStep) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function showStep(step) {
    document.querySelectorAll('.form-step').forEach(formStep => {
        formStep.classList.remove('active');
    });
    
    const targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    updateProgress();
}

function nextStep() {
    const currentFormStep = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
            setTimeout(() => {
                input.style.borderColor = '';
            }, 2000);
        } else {
            input.style.borderColor = '';
        }
    });
    
    if (isValid && currentStep < totalSteps) {
        currentStep++;
        showStep(currentStep);
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
    }
}

// Initialize progress on page load
updateProgress();

// Quote form submission
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(quoteForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Thank you! Your quote request has been submitted. We will contact you shortly.');
        
        // Reset form
        quoteForm.reset();
        currentStep = 1;
        showStep(currentStep);
        
        // Update recent bookings counter
        const recentBookings = parseInt(document.getElementById('recentBookings').textContent) || 12;
        document.getElementById('recentBookings').textContent = (recentBookings + 1) + '+';
        document.getElementById('quoteRecent').textContent = (recentBookings + 1) + '+';
        document.getElementById('ctaRecent').textContent = (recentBookings + 1) + '+';
    });
}

// FAQ accordion functionality
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Contact form submitted:', data);
        
        // Show success message
        alert('Thank you for your message! We will get back to you as soon as possible.');
        
        // Reset form
        contactForm.reset();
    });
}

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            if (value.length <= 3) {
                value = `(${value}`;
            } else if (value.length <= 6) {
                value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
        }
        e.target.value = value;
    });
});

// Set minimum date for move date input to today
const moveDateInput = document.getElementById('moveDate');
if (moveDateInput) {
    const today = new Date().toISOString().split('T')[0];
    moveDateInput.setAttribute('min', today);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards and review cards
document.querySelectorAll('.service-card, .review-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});
