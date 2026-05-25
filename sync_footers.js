// Global Form State
window.submitted = false;

/**
 * handleFormSuccess
 * Global callback for hidden iframe onload events.
 * Reveals success modal and resets forms.
 */
window.handleFormSuccess = function () {
    if (window.submitted) {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');
            // Reset all forms on the page to clear inputs
            document.querySelectorAll('form').forEach(form => {
                form.reset();
                // Restore button state
                const btn = form.querySelector('button[type="submit"]');
                if (btn && btn.getAttribute('data-original-text')) {
                    btn.innerHTML = btn.getAttribute('data-original-text');
                    btn.disabled = false;
                    btn.classList.remove('btn-loading');
                }
            });
        }
        window.submitted = false;
    }
};

// Alias for compatibility with community.html
window.showSuccessModal = window.handleFormSuccess;

/**
 * Auto-fill Forms from URL Parameters
 * Searches for entry.XXXX parameters and fills matching form fields.
 */
function autoFillForms() {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.forEach((value, key) => {
        if (key.startsWith('entry.')) {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = value;
                // Trigger change event for any listeners
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    });
}

function initFormListeners() {
    autoFillForms();

    // Add loading state to forms on submission
    document.querySelectorAll('form').forEach(form => {
        // Prevent multiple attachments
        if (form.getAttribute('data-listeners-set')) return;

        form.addEventListener('submit', function () {
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.setAttribute('data-original-text', btn.innerHTML);
                btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...`;
                btn.classList.add('btn-loading');
                btn.disabled = true;
            }
        });
        form.setAttribute('data-listeners-set', 'true');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormListeners);
} else {
    initFormListeners();
}

document.addEventListener('DOMContentLoaded', () => {
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

    // 1. Inject Header
    const header = document.getElementById('header');
    if (header) {
        header.innerHTML = `
            <div class="container">
                <a href="${isHomePage ? '#' : 'index.html'}" class="logo">
                    <img src="img/logo.png" alt="GSTSubmit Logo">
                </a>
                
                <nav class="nav-menu" id="navMenu">
                    <a href="index.html" class="nav-link ${window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ? 'active' : ''}">HOME</a>
                    <a href="services.html" class="nav-link ${window.location.pathname.endsWith('services.html') ? 'active' : ''}">SERVICES</a>
                    <a href="products.html" class="nav-link ${window.location.pathname.endsWith('products.html') ? 'active' : ''}">PRODUCTS</a>
                    <a href="contact.html" class="nav-link ${window.location.pathname.endsWith('contact.html') ? 'active' : ''}">CONTACT US</a>
                    <a href="community.html" class="nav-link ${window.location.pathname.endsWith('community.html') ? 'active' : ''}">JOIN US</a>
                    <a href="filing-dashboard.html" class="btn btn-accent"><i class="fa-solid fa-bolt"></i> Start Filing</a>
                </nav>

                <button class="mobile-toggle" id="mobileToggle">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        `;

        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.querySelector('i').classList.toggle('fa-bars');
                mobileToggle.querySelector('i').classList.toggle('fa-xmark');
            });

            // Close menu on link click
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileToggle.querySelector('i').classList.add('fa-bars');
                    mobileToggle.querySelector('i').classList.remove('fa-xmark');
                });
            });
        }

        // Scroll Effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Form Submission Handling moved to global scope for immediate availability

    // Inject Mobile Nav Styles
    if (!document.getElementById('mobileNavStyles')) {
        const styles = `
            @media (max-width: 991px) {
                .nav-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: var(--bg-main);
                    padding: 2rem;
                    flex-direction: column;
                    gap: 1.5rem;
                    border-bottom: 1px solid var(--border-light);
                    box-shadow: var(--shadow-lg);
                    z-index: 1001;
                }
                .nav-menu.active {
                    display: flex;
                }
                .mobile-toggle {
                    display: block !important;
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--text-main);
                    cursor: pointer;
                }
                .btn-loading {
                    opacity: 0.8;
                    cursor: not-allowed;
                    position: relative;
                }
                .btn-loading i {
                    margin-right: 8px;
                }
            }
        `;
        const styleSheet = document.createElement("style");
        styleSheet.id = 'mobileNavStyles';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    // 2. Inject Footer
    const footer = document.querySelector('.footer');
    if (footer) {
        footer.innerHTML = `
            <div class="footer-main">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <a href="index.html" style="color: #FFFFFF; font-weight: bold;font-size: 20px;">
                            GSTSubmit
                        </a>
                        
                        <span style="font-size: 12px; color: #fff; text-align: center; ">is a 100% Tax Compliance System</span>
                        
                        <p>Next-gen tax & compliance solutions for modern businesses. Expert-assisted, AI-powered, and 100% accurate.</p>
                        <div class="footer-social">
                            <a href="https://www.facebook.com/profile.php?id=61590260663704" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="social-icon"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="https://x.com/GSTSubmit_Dis" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" class="social-icon"><i class="fa-brands fa-x-twitter"></i></a>
                            <a href="https://www.instagram.com/gstsubmit_deccanidentity/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="social-icon"><i class="fa-brands fa-instagram"></i></a>
                            <a href="https://linkedin.com/company/gstsubmit" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" class="social-icon"><i class="fa-brands fa-linkedin-in"></i></a>
                            <a href="https://youtu.be/oXtMGy-F8bI" target="_blank" rel="noopener noreferrer" aria-label="YouTube" class="social-icon"><i class="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>
                    
                    <div class="footer-column">
                        <h4>Our Solutions</h4>
                        <ul class="footer-links">
                            <li><a href="gst-registration.html">GST Solutions</a></li>
                            <li><a href="filing-dashboard.html">Tax Compliance</a></li>
                            <li><a href="itr-filing.html">ITR Returns</a></li>
                            <li><a href="e-invoice-dashboard.html">E-Invoicing</a></li>
                            <li><a href="e-way-submit.html">E-Way Bills</a></li>
                            <li><a href="tds-management.html">TDS Management</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4>Quick Links</h4>
                        <ul class="footer-links"> 
                            <li><a href="index.html">HOME</a></li>
                            <li><a href="services.html">SERVICES</a></li>
                            <li><a href="products.html">PRODUCTS</a></li>
                            <li><a href="contact.html">CONTACT US</a></li>
                            <li><a href="community.html">JOIN US</a></li>
                        </ul>
                    </div>

                    <div class="footer-column" id="footer-contact-info">
                        <h4>Contact Us</h4>
                        <div class="footer-contact">
                            <div class="contact-item">
                                <i class="fa-solid fa-envelope"></i>
                                <span>info@gstsubmit.com</span>
                            </div>
                            <div class="contact-item">
                                <i class="fa-solid fa-phone"></i>
                                <span>+91 90000 35869</span>
                            </div>
                            <div class="contact-item">
                                <i class="fa-solid fa-location-dot"></i>
                                <span>Hyderabad, Telangana, 501510, India</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="footer-bottom-inner">
                    <nav class="footer-nav">
                        <a href="index.html">Home</a> <span>|</span>
                        <a href="services.html">Services</a> <span>|</span>
                        <a href="products.html">Products</a> <span>|</span>
                        <a href="contact.html">Contact Us</a> <span>|</span>
                        <a href="community.html">Join Us</a>
                    </nav>
                    <p class="copyright"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> &copy; ${new Date().getFullYear()} All Rights Reserved. By <a style="color: #fff; text-align: center; text-weight:bold;" href="https://gstsubmit.com" target="_blank">GSTSubmit</a> <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> <a style="color: #fff; text-align: center;"   href="privacy-policy.html">Privacy Policy</a> <span>|</span> <a style="color: #fff; text-align: center;" href="terms-of-service.html">Terms of Service</a></p>
                </div>
            </div>
        `;
    }

    // 3. Inject Support Hub (WhatsApp/Phone FAB)
    if (!document.querySelector('.support-hub')) {
        const hubHTML = `
            <div class="support-hub">
                <button class="hub-trigger" id="hubTrigger">
                    <i class="fa-solid fa-headset"></i>
                </button>
                <div class="hub-menu" id="hubMenu">
                    <a href="https://wa.me/919000035869" class="hub-item" target="_blank">
                        <i class="fa-brands fa-whatsapp"></i>
                        <span>WhatsApp</span>
                    </a>
                    <a href="tel:+919000035869" class="hub-item">
                        <i class="fa-solid fa-phone"></i>
                        <span>Call Support</span>
                    </a>
                    <a href="mailto:info@gstsubmit.com" class="hub-item">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Email Support</span>
                    </a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', hubHTML);

        const trigger = document.getElementById('hubTrigger');
        const menu = document.getElementById('hubMenu');

        if (trigger && menu) {
            trigger.addEventListener('click', () => {
                menu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!trigger.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                }
            });
        }
    }
});
