document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSlider();
    initMultiStepForm();
    setYear();
});

/* =========================================
   1. NAVIGATION & SCROLLING
   ========================================= */
function initNavigation() {
    window.scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

/* =========================================
   2. SLIDER LOGIC
   ========================================= */
function initSlider() {
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if(!track) return;

    const slideCount = 3; 
    let currentIndex = 0;

    function updateSlider() {
        const slide = document.querySelector('.slide');
        if(slide) {
            const slideWidth = slide.offsetWidth;
            const moveAmount = (slideWidth + 30) * currentIndex;
            track.style.transform = `translateX(-${moveAmount}px)`;
        }
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < slideCount - 1) {
                currentIndex++;
                updateSlider();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    window.addEventListener('resize', updateSlider);
}

/* =========================================
   3. MULTI-STEP FORM + WHATSAPP INTEGRATION
   ========================================= */
function initMultiStepForm() {
    let currentStep = 1;
    const totalSteps = 11;
    
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progressBar');
    const stepDisplay = document.getElementById('currentStepDisplay');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');

    function updateUI() {
        steps.forEach(step => {
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        const progressPercentage = (currentStep / totalSteps) * 100;
        if(progressBar) progressBar.style.width = `${progressPercentage}%`;
        if(stepDisplay) stepDisplay.innerText = currentStep;

        if (currentStep === 1) prevBtn.classList.add('hidden');
        else prevBtn.classList.remove('hidden');

        if (currentStep === totalSteps) nextBtn.classList.add('hidden');
        else nextBtn.classList.remove('hidden');
    }

    if(nextBtn) nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
        }
    });

    if(prevBtn) prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    // --- WHATSAPP SENDING LOGIC ---
    if(submitBtn) submitBtn.addEventListener('click', () => {
        
        // 1. CHANGE THIS TO YOUR NUMBER (e.g., 212600000000)
        const myNumber = "212695031414"; 
        
        // 2. Start Message
        let msg = "🚀 *NEW PROJECT INQUIRY* %0A%0A";
        
        // 3. Collect all visible inputs
        const form = document.getElementById('multiStepForm');
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Ignore unchecked radio/checkboxes
            if((input.type === 'radio' || input.type === 'checkbox') && !input.checked) return;
            
            // Determine Label
            let label = input.placeholder;
            
            // If it's a checkbox/radio, try to find the text next to it
            if(input.type === 'radio' || input.type === 'checkbox') {
                 // Try to grab text from parent label
                 label = input.parentElement.textContent.trim();
                 // If that fails, check name attribute
                 if(!label) label = input.name;
            }
            
            // Fallback if no label found
            if(!label && input.name) label = input.name;
            if(!label) label = "Info";

            // Determine Value
            let value = input.value;
            if(input.type === 'checkbox') value = "✅ Yes"; // Just mark as checked

            // Don't add empty fields
            if(value && value !== "") {
                // Formatting for WhatsApp ( %0A is a new line )
                msg += `*${label}:* ${value}%0A`;
            }
        });

        // 4. Send
        submitBtn.innerText = "Opening WhatsApp...";
        
        setTimeout(() => {
            window.open(`https://wa.me/${myNumber}?text=${msg}`, '_blank');
            submitBtn.innerText = "Message Sent!";
        }, 1000);
    });
}

/* =========================================
   4. UTILS
   ========================================= */
function setYear() {
    const yearSpan = document.getElementById('year');
    if(yearSpan) {
        yearSpan.innerText = new Date().getFullYear();
    }
}