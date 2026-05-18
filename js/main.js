/**
 * GSTSubmit Main Interactive Logic
 * Handles premium micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initSpotlightEffect();
    initScrollReveal();
    initMagneticButtons();
    initUploadPortal();
    initTypingEffect();
    initStepper();
});

/**
 * Spotlight Hover Effect
 * Updates CSS variables for radial gradient based on mouse position
 */
function initSpotlightEffect() {
    const cards = document.querySelectorAll('.spotlight-card, .service-card, .bento-item, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * Magnetic Button Effect
 * Buttons subtly follow the cursor
 */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-accent, .btn-primary');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

/**
 * Simple Scroll Reveal using Intersection Observer
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                entry.target.classList.add('visible'); // bridge both animation systems
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.fade-in-up, .service-card, .bento-item, .pricing-card');
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        // If element is already in viewport, show it immediately
        if (rect.top < window.innerHeight) {
            el.classList.add('reveal-visible');
            el.classList.add('visible');
        } else {
            el.classList.add('reveal-hidden');
            observer.observe(el);
        }
    });
}

/**
 * Upload Portal Logic
 * Handles file selection, drag-and-drop, and progress simulation
 */
function initUploadPortal() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    if (!dropZone) return;

    // Trigger file input on click
    dropZone.addEventListener('click', () => fileInput.click());

    // Drag and Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        const fileArr = [...files];
        if (fileArr.length > 0) {
            fileList.style.display = 'block';
            fileArr.forEach(uploadFile);
        }
    }

    function uploadFile(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileId = 'file-' + Math.random().toString(36).substr(2, 9);
        
        fileItem.innerHTML = `
            <div class="file-icon" style="color: var(--primary); font-size: 1.5rem;">
                <i class="fa-solid fa-file-pdf"></i>
            </div>
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-progress">
                    <div class="progress-bar" id="${fileId}-progress"></div>
                </div>
                <div class="file-status" id="${fileId}-status">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Encrypting & Uploading...
                </div>
            </div>
        `;
        
        fileList.appendChild(fileItem);

        // Simulate Progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                const pBar = document.getElementById(`${fileId}-progress`);
                const pStatus = document.getElementById(`${fileId}-status`);
                if(pBar) pBar.style.width = '100%';
                if(pStatus) pStatus.innerHTML = `
                    <i class="fa-solid fa-circle-check" style="color: var(--accent);"></i> Ready for Review
                `;
            } else {
                const pBar = document.getElementById(`${fileId}-progress`);
                if(pBar) pBar.style.width = `${progress}%`;
            }
        }, 400);
    }
}

/**
 * Hero Typing Effect
 */
function initTypingEffect() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const words = ["Taxes", "GST Returns", "ITR Filing", "E-Invoicing", "E-Way Bills", "Audits", "Compliance"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 75;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/**
 * Interactive Stepper Logic
 */
function initStepper() {
    const btns = document.querySelectorAll('.step-btn');
    const contents = document.querySelectorAll('.step-content');

    if (btns.length === 0) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const step = btn.getAttribute('data-step');

            btns.forEach(b => b.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`step-${step}`).classList.add('active');
        });
    });
}

