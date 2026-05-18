/**
 * GSTSubmit Dashboard & Onboarding Logic
 * Handles multi-step flow and dashboard sections
 */

// Global User Data State
let userData = {
    firstName: "Mahesh",
    lastName: "Kumar",
    email: "mahesh@gmail.com",
    mobile: "+91 90000 35869",
    pan: "ABCDE1234F",
    dob: "1990-05-15",
    aadhaar: "XXXX XXXX 1234",
    fatherName: "Kumar Prasad"
};

document.addEventListener('DOMContentLoaded', () => {
    // Initial State
    handleDashboardChannels();
    initDashboardNav();
    updateDashboardProfileUI();
});

/**
 * Channel-based Dashboard Customization
 * Handles ?channel=tax or ?channel=itr
 */
function handleDashboardChannels() {
    const urlParams = new URLSearchParams(window.location.search);
    const channel = urlParams.get('channel');
    
    const salariedOnboarding = document.getElementById('onboarding-salaried');
    const taxOnboarding = document.getElementById('onboarding-tax');
    const progressDots = document.getElementById('progress-dots');

    if (channel === 'tax') {
        if (salariedOnboarding) salariedOnboarding.style.display = 'none';
        if (taxOnboarding) taxOnboarding.style.display = 'block';
        if (progressDots) progressDots.style.display = 'flex';
        showStep('tax-login-step');
        // TAXSubmit Channel: All income except Salaried Person
        const salaryCard = document.getElementById('salary-income-card');
        if (salaryCard) {
            salaryCard.style.display = 'none';
        }

        // Show Business Compliance for TAX channel
        const businessNav = document.getElementById('nav-business-compliance');
        if (businessNav) businessNav.style.display = 'flex';
        
        // Update Logo/Branding in Dashboard
        const logo = document.querySelector('.dashboard-sidebar .logo');
        if (logo) {
            logo.innerHTML = `<span class="logo-icon"><i class="fa-solid fa-calculator"></i></span> TAXSubmit`;
        }

        // Update navigation flow
        const nextBtn = document.getElementById('btn-income-next');
        if (nextBtn) {
            nextBtn.onclick = () => showDashboardSection('business-compliance');
        }
    } else {
        // Default / ITRSubmit Channel (Salaried)
        if (taxOnboarding) taxOnboarding.style.display = 'none';
        if (salariedOnboarding) salariedOnboarding.style.display = 'block';
        // Progress dots for salaried are only 3 steps, so we can hide the last 2 or hide entirely if we prefer, but let's just keep 3 active.
        if (progressDots) {
            Array.from(progressDots.children).forEach((dot, idx) => {
                if (idx > 2) dot.style.display = 'none';
                else dot.style.display = 'block';
            });
        }
        
        // Update Logo/Branding
        const logo = document.querySelector('.dashboard-sidebar .logo');
        if (logo) {
            logo.innerHTML = `<span class="logo-icon"><i class="fa-solid fa-user-tie"></i></span> ITRSubmit`;
        }

        // Hide Compliance Hub and other non-ITR modules for ITRSubmit Channel
        const complianceNav = document.querySelector('.nav-item[data-section="compliance-hub"]');
        if (complianceNav) complianceNav.style.display = 'none';

        const tdsNav = document.querySelector('.nav-item[data-section="tds-compliance"]');
        if (tdsNav) tdsNav.style.display = 'none';

        showStep('salaried-login-step');
    }
}

/**
 * Onboarding Navigation
 */
function showStep(stepId) {
    // Hide all steps
    document.querySelectorAll('.onboarding-card').forEach(card => {
        card.classList.remove('active');
    });

    // Show target step
    const target = document.getElementById(stepId);
    if (target) {
        target.classList.add('active');
    }

    // Update progress dots
    let steps = [];
    if (['salaried-login-step', 'pan-step', 'form16-step'].includes(stepId)) {
        steps = ['salaried-login-step', 'pan-step', 'form16-step'];
    } else {
        steps = ['tax-login-step', 'import-step', 'type-step'];
    }
    
    const currentIdx = steps.indexOf(stepId);
    
    document.querySelectorAll('#progress-dots .progress-dot').forEach((dot, idx) => {
        // Skip hidden dots for salaried flow
        if (dot.style.display === 'none') return;
        
        if (idx <= currentIdx) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * Google Sign-In Simulation
 */
function simulateGoogleLogin() {
    const loginBtn = document.querySelector('.btn-google');
    const originalContent = loginBtn.innerHTML;
    
    loginBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...`;
    loginBtn.style.opacity = '0.7';
    loginBtn.disabled = true;

    // Simulate network delay
    setTimeout(() => {
        // Mock data from Google
        userData.firstName = "Mahesh";
        userData.lastName = "Kumar";
        userData.email = "mahesh@gmail.com";
        updateDashboardProfileUI();

        loginBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Connected as ${userData.email}`;
        loginBtn.style.background = '#e8f5e9';
        loginBtn.style.color = '#2e7d32';
        loginBtn.style.borderColor = '#a5d6a7';
        
        setTimeout(() => {
            showStep('pan-step');
        }, 1200);
    }, 1500);
}

/**
 * Dashboard Navigation Logic
 */
function initDashboardNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            showDashboardSection(sectionId);
            
            // Update UI
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function showDashboardSection(sectionId) {
    const urlParams = new URLSearchParams(window.location.search);
    const channel = urlParams.get('channel');
    
    // Safeguard: Prevent showing Compliance Hub in ITR mode
    if (sectionId === 'compliance-hub' && channel !== 'tax') {
        sectionId = 'personal-info';
    }

    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        // Update header title & description
        const headerMap = {
            'compliance-hub': {
                title: 'Compliance Hub',
                desc: 'Integrated command center for your Income Tax, GST, and TDS compliance.'
            },
            'personal-info': {
                title: 'Personal Information',
                desc: 'Review and update your profile and bank details for accurate filing.'
            },
            'tds-compliance': {
                title: 'TDS & Tax Credits',
                desc: 'Track tax deducted at source and verify against Form 26AS records.'
            },
            'income-sources': {
                title: 'Income Sources',
                desc: 'Declare your earnings from salary, interest, and capital gains.'
            },
            'deductions': {
                title: 'Deductions & Tax Saving',
                desc: 'Maximize your tax savings with Section 80C, 80D, and other exemptions.'
            },
            'tax-regime': {
                title: 'Tax Regime Selection',
                desc: 'Compare and choose the most beneficial tax regime for your profile.'
            },
            'tax-summary': {
                title: 'Verify Tax Calculation',
                desc: 'Review your final income and deductions before official submission.'
            },
            'file-return': {
                title: 'File Return',
                desc: 'Electronically submit your ITR to the Income Tax Department.'
            },
            'e-verify': {
                title: 'E-Verify Return',
                desc: 'Mandatory verification to complete your filing process.'
            },
            'business-compliance': {
                title: 'Business Details',
                desc: 'Manage your business profile and Profit & Loss summary.'
            },
            'tax-guide': {
                title: 'Tax Filing Guide',
                desc: 'Everything small business owners and freelancers need to know.'
            },
            'downloads': {
                title: 'Download Center',
                desc: 'Access your filed returns, acknowledgements, and computation sheets.'
            }
        };

        const currentHeader = headerMap[sectionId] || { title: 'Dashboard', desc: '' };
        document.getElementById('section-title').innerText = currentHeader.title;
        document.getElementById('section-description').innerText = currentHeader.desc;

        // Update Horizontal Tabs if present
        const tabs = document.querySelectorAll('.tab-item');
        tabs.forEach(tab => {
            const tabText = tab.innerText.toLowerCase().trim();
            const sectionLower = sectionId.replace('-', ' ').toLowerCase();
            
            // Logic to match tab to section
            const isMatch = sectionLower.includes(tabText) || 
                           (sectionId === 'deductions' && tabText === 'tax saving') ||
                           (sectionId === 'personal-info' && tabText === 'personal info');

            if (isMatch) {
                tab.classList.add('active');
                tab.style.background = 'var(--primary)';
                tab.style.color = 'white';
                tab.style.fontWeight = '700';
            } else {
                tab.classList.remove('active');
                tab.style.background = 'transparent';
                tab.style.color = 'var(--text-muted)';
                tab.style.fontWeight = '600';
            }
        });

        // Sync sidebar
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

/**
 * Complete Onboarding and show Dashboard
 */
function finishOnboarding() {
    const overlay = document.querySelector('.onboarding-overlay');
    const dashboard = document.querySelector('.dashboard-container');
    const urlParams = new URLSearchParams(window.location.search);
    const channel = urlParams.get('channel');

    // Capture sign-up data
    if (channel === 'tax') {
        const signupEmail = document.getElementById('signup-email');
        const signupMobile = document.getElementById('signup-mobile');
        const signupPan = document.getElementById('signup-pan');

        if (signupEmail && signupEmail.value) {
            userData.email = signupEmail.value;
            // Derive name from email for new sign-ups
            userData.firstName = signupEmail.value.split('@')[0].split('.')[0];
            userData.firstName = userData.firstName.charAt(0).toUpperCase() + userData.firstName.slice(1);
            userData.lastName = ""; // Clear default last name for new sign-up
        }
        if (signupMobile && signupMobile.value) userData.mobile = signupMobile.value;
        if (signupPan && signupPan.value) userData.pan = signupPan.value.toUpperCase();
    } else {
        const salariedPan = document.getElementById('pan-number');
        const salariedDob = document.getElementById('salaried-dob');

        if (salariedPan && salariedPan.value) userData.pan = salariedPan.value.toUpperCase();
        if (salariedDob && salariedDob.value) userData.dob = salariedDob.value;
    }

    // Update UI with captured data
    updateDashboardProfileUI();
    
    overlay.style.transition = 'opacity 0.6s ease';
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        dashboard.style.display = 'flex';
        dashboard.style.opacity = '0';
        dashboard.style.transition = 'opacity 0.6s ease';
        
        setTimeout(() => {
            dashboard.style.opacity = '1';
            if (channel === 'tax') {
                showDashboardSection('compliance-hub');
            } else {
                showDashboardSection('personal-info');
            }
        }, 50);
    }, 600);
}

/**
 * Update All Profile Displays
 */
function updateDashboardProfileUI() {
    // Header Profile
    const headerAvatar = document.getElementById('header-avatar');
    const headerName = document.getElementById('header-user-name');
    const headerEmail = document.getElementById('header-user-email');

    if (headerName) headerName.innerText = `${userData.firstName} ${userData.lastName || ""}`.trim();
    if (headerEmail) headerEmail.innerText = userData.email;
    if (headerAvatar && userData.firstName) headerAvatar.innerText = userData.firstName.charAt(0).toUpperCase();

    // Personal Info Section Fields
    const fields = {
        'profile-fname': userData.firstName,
        'profile-lname': userData.lastName,
        'profile-mname': userData.middleName || "",
        'profile-dob': userData.dob,
        'profile-father': userData.fatherName,
        'profile-aadhaar': userData.aadhaar,
        'profile-pan': userData.pan,
        'profile-mobile': userData.mobile,
        'profile-email': userData.email
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value;
            if (value && id !== 'profile-pan') {
                el.classList.add('linked-field');
            }
        }
    }
}

/**
 * Salary Section: Toggle between Manual Entry and Form 16 Upload
 */
function toggleSalaryMode(mode) {
    const manualFields = document.getElementById('salary-manual-fields');
    const uploadFields = document.getElementById('salary-upload-fields');
    const btns = document.querySelectorAll('.seg-btn');

    if (mode === 'manual') {
        manualFields.style.display = 'block';
        uploadFields.style.display = 'none';
        btns[0].classList.add('active');
        btns[1].classList.remove('active');
    } else {
        manualFields.style.display = 'none';
        uploadFields.style.display = 'block';
        btns[0].classList.remove('active');
        btns[1].classList.add('active');
    }
}

/**
 * PAN Validation Simulation
 */
function validatePan() {
    const panInput = document.getElementById('pan-number');
    if (panInput.value.length >= 10) {
        showStep('form16-step');
    } else {
        alert('Please enter a valid 10-digit PAN number');
    }
}

/**
 * Dynamic Other Income Sources
 */
function addOtherIncomeSource() {
    const container = document.getElementById('other-income-container');
    
    const sourceGroup = document.createElement('div');
    sourceGroup.className = 'input-group';
    sourceGroup.style.animation = 'fadeInUp 0.4s ease forwards';
    sourceGroup.innerHTML = `
        <label>Source of Income</label>
        <input type="text" placeholder="Enter source name">
    `;

    const amountGroup = document.createElement('div');
    amountGroup.className = 'input-group';
    amountGroup.style.animation = 'fadeInUp 0.4s ease forwards';
    amountGroup.innerHTML = `
        <label>Amount</label>
        <input type="text" placeholder="₹ 0.00">
    `;

    container.appendChild(sourceGroup);
    container.appendChild(amountGroup);
}

/**
 * AIS/TIS Upload and Fetch Simulation
 */
function handleAISUpload(input) {
    if (!input.files || !input.files[0]) return;
    
    const btn = document.getElementById('ais-btn');
    const statusText = document.getElementById('ais-status');
    const banner = document.getElementById('ais-banner');
    const fileName = input.files[0].name;

    // Loading State
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Fetching...`;
    statusText.innerText = `Processing ${fileName}...`;
    
    // Simulate Fetching Process
    setTimeout(() => {
        // Success State
        btn.innerHTML = `<i class="fa-solid fa-check"></i> Data Synced`;
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';
        
        statusText.innerHTML = `<span style="color: #22c55e; font-weight: 600;">Success!</span> Records imported from AIS/TIS.`;
        
        // Add a subtle glow effect to the banner
        banner.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.2)';
        
        // Visual feedback: Highlight a field that would be pre-filled
        const interestInput = document.querySelector('#income-sources input[placeholder="₹ 0.00"]');
        if (interestInput) {
            interestInput.value = "₹ 42,500";
            interestInput.style.borderColor = "#22c55e";
            interestInput.style.transition = "all 0.4s ease";
        }
    }, 2000);
}

/**
 * Dynamic Capital Gains Details
 */
function addCapitalGainsDetail() {
    const container = document.getElementById('capital-gains-container');
    if (!container) return;

    const group = document.createElement('div');
    group.className = 'broker-card';
    group.style.gridColumn = 'span 2';
    group.style.display = 'flex';
    group.style.justifyContent = 'space-between';
    group.style.alignItems = 'center';
    group.style.padding = '1.5rem';
    group.style.animation = 'fadeInUp 0.4s ease forwards';

    group.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 80%;">
            <div class="input-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">Asset Name</label>
                <input type="text" placeholder="e.g. Tata Steel Shares" style="padding: 0.5rem;">
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label style="font-size: 0.7rem;">Gain/Loss</label>
                <input type="text" placeholder="₹ 0.00" style="padding: 0.5rem;">
            </div>
        </div>
        <button class="btn btn-sm btn-outline" style="color: #f43f5e; border-color: #f43f5e;" onclick="this.parentElement.remove()">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    container.appendChild(group);
}

/**
 * Support Sidebar Logic
 */
function toggleSupportSidebar() {
    const sidebar = document.getElementById('support-sidebar');
    sidebar.classList.toggle('active');
    
    // Auto-focus input
    if (sidebar.classList.contains('active')) {
        const input = document.getElementById('chat-input-field');
        input.focus();
        
        // Add enter key listener once
        if (!input.getAttribute('data-listener')) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
            input.setAttribute('data-listener', 'true');
        }
    }
}

function sendMessage() {
    const input = document.getElementById('chat-input-field');
    const container = document.getElementById('chat-messages');
    
    if (!input.value.trim()) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerText = input.value;
    container.appendChild(userMsg);

    const text = input.value;
    input.value = '';

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;

    // Simulated Bot Response
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.className = 'message bot';
        botMsg.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing...`;
        container.appendChild(botMsg);
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            botMsg.innerHTML = `I've analyzed your query about "${text}". Based on your current profile, I recommend checking Section 80C for additional deductions. Would you like to connect with a human expert?`;
            container.scrollTop = container.scrollHeight;
        }, 1500);
    }, 1000);
}

/**
 * Data Sync Animation
 */
function startDataSync() {
    const overlay = document.getElementById('sync-overlay');
    const progress = document.getElementById('sync-progress');
    
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                overlay.classList.remove('active');
                setTimeout(() => {
                    overlay.style.display = 'none';
                    alert('Data sync complete! Your dashboard has been updated with 2023-24 details.');
                }, 400);
            }, 500);
        } else {
            width += Math.random() * 5;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 100);
}

/**
 * Expert Modal Logic
 */
/**
 * Step 2: Data Import Simulation
 */
function simulateDataImport() {
    const btn = document.querySelector('#import-step .btn-accent');
    const originalText = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating with Dept...`;
    
    setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down fa-bounce"></i> Fetching AIS & 26AS...`;
        
        setTimeout(() => {
            btn.innerHTML = `<i class="fa-solid fa-check"></i> 48 Records Found & Synced`;
            btn.style.background = '#22c55e';
            btn.style.borderColor = '#22c55e';
            
            setTimeout(() => {
                showStep('type-step');
            }, 1000);
        }, 2000);
    }, 1500);
}

/**
 * Step 3: Taxpayer Type Selection
 */
function selectType(element, type) {
    // Remove active from others
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.style.borderColor = 'var(--border-dark)';
        btn.style.background = 'rgba(255,255,255,0.03)';
    });

    // Set active
    element.style.borderColor = 'var(--primary)';
    element.style.background = 'rgba(99, 102, 241, 0.1)';
    
    // Auto-select ITR form based on type
    const itrSelect = document.getElementById('itr-form-select');
    if (type === 'individual') itrSelect.value = 'itr1';
    else if (type === 'proprietor' || type === 'business') itrSelect.value = 'itr3';
    else if (type === 'freelancer') itrSelect.value = 'itr4';
}

/**
 * Step 6: Filing Simulation
 */
function simulateFiling() {
    const mainCard = document.querySelector('#file-return .data-card');
    const successCard = document.getElementById('filing-success');
    const btn = mainCard.querySelector('.btn-primary');
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Encrypting Data...`;
    
    setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-paper-plane fa-bounce"></i> Uploading to IT Dept...`;
        
        setTimeout(() => {
            mainCard.style.display = 'none';
            successCard.style.display = 'block';
        }, 2500);
    }, 1500);
}

/**
 * Expert Modal Logic
 */
function toggleExpertModal() {
    const modal = document.getElementById('expert-modal');
    if (modal.style.display === 'none' || !modal.style.display) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
    } else {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 400);
    }
}

/**
 * Business Compliance Logic
 */
function calculateNetProfit() {
    const salesInput = document.querySelector('#business-compliance input[placeholder="₹ 0.00"]');
    const cogsInput = document.querySelectorAll('#business-compliance input[placeholder="₹ 0.00"]')[1];
    const expenseInputs = document.querySelectorAll('.expense-input');
    const display = document.getElementById('net-profit-display');

    const sales = parseFloat(salesInput.value.replace(/[^0-9.]/g, '')) || 0;
    const cogs = parseFloat(cogsInput.value.replace(/[^0-9.]/g, '')) || 0;
    
    let totalExpenses = cogs;
    expenseInputs.forEach(input => {
        totalExpenses += parseFloat(input.value.replace(/[^0-9.]/g, '')) || 0;
    });

    const netProfit = sales - totalExpenses;
    display.innerText = `₹ ${netProfit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    
    if (netProfit < 0) {
        display.style.color = '#f43f5e';
    } else {
        display.style.color = '#22c55e';
    }
}

function runReconciliation() {
    const gstInput = document.getElementById('gst-turnover');
    const bankInput = document.getElementById('bank-credits');
    const alertBox = document.getElementById('recon-alert');
    const salesInput = document.querySelector('#business-compliance input[placeholder="₹ 0.00"]');

    const gst = parseFloat(gstInput.value.replace(/[^0-9.]/g, '')) || 0;
    const itrSales = parseFloat(salesInput.value.replace(/[^0-9.]/g, '')) || 0;

    if (gst > 0 && itrSales > 0 && Math.abs(gst - itrSales) > 10) {
        alertBox.style.display = 'block';
        alertBox.style.animation = 'shake 0.5s ease';
    } else if (gst > 0 && itrSales > 0) {
        alertBox.style.display = 'none';
        alert('Reconciliation Complete: Turnover matches successfully within tolerance limits.');
    } else {
        alert('Please enter or link turnover data to run reconciliation.');
    }
}

/**
 * Link GSTSubmit Data to ITR
 */
function linkGstData(context = 'hub') {
    const banner = document.getElementById('gst-link-banner');
    const turnoverInput = document.getElementById('business-turnover');
    const gstTurnoverInput = document.getElementById('gst-turnover');
    const turnoverBadge = document.getElementById('turnover-link-badge');
    const gstr1Badge = document.getElementById('gstr1-link-badge');

    // Button states
    const btn = event.target.closest('button');
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Syncing...`;

    setTimeout(() => {
        // Data Simulation
        const syncedTurnover = "₹ 24,50,000.00";
        
        // Update ITR Fields
        if (turnoverInput) {
            turnoverInput.value = syncedTurnover;
            turnoverInput.classList.add('linked-field');
            if (turnoverBadge) {
                turnoverBadge.innerHTML = `<i class="fa-solid fa-link"></i> Linked`;
                turnoverBadge.className = 'linked-badge';
                turnoverBadge.style.display = 'inline-flex';
            }
        }

        if (gstTurnoverInput) {
            gstTurnoverInput.value = syncedTurnover;
            gstTurnoverInput.classList.add('linked-field');
            if (gstr1Badge) {
                gstr1Badge.innerHTML = `<i class="fa-solid fa-link"></i> Linked`;
                gstr1Badge.className = 'linked-badge';
                gstr1Badge.style.display = 'inline-flex';
            }
        }

        // Recalculate if in business section
        if (typeof calculateNetProfit === 'function') calculateNetProfit();

        btn.innerHTML = `<i class="fa-solid fa-check"></i> Data Linked`;
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';

        if (context === 'hub' && banner) {
            setTimeout(() => {
                banner.style.opacity = '0';
                setTimeout(() => banner.style.display = 'none', 500);
            }, 2000);
        }

        // Final Feedback
        setTimeout(() => {
            if (context === 'reconciliation') {
                btn.innerHTML = `<i class="fa-solid fa-link"></i> Sync from GSTSubmit`;
                btn.style.background = '';
                btn.style.borderColor = '';
                btn.disabled = false;
            }
            alert('Success: GST Turnover data has been linked and pre-filled in your ITR Business Details.');
        }, 1000);

    }, 1500);
}

/**
 * Compliance Hub: Smart AI Scan Simulation
 */
function runSmartScan() {
    const btn = document.querySelector('#compliance-hub .btn-primary');
    const visual = document.getElementById('scan-animation');
    const originalText = btn.innerHTML;
    
    // Activate animation
    visual.classList.add('scan-animation-active');
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing Profile...`;

    setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-server fa-bounce"></i> Syncing with Govt Portals...`;
        
        setTimeout(() => {
            btn.innerHTML = `<i class="fa-solid fa-check"></i> Scan Complete`;
            btn.style.background = '#22c55e';
            btn.style.borderColor = '#22c55e';
            visual.classList.remove('scan-animation-active');
            
            // Trigger GST link detection
            const linkBanner = document.getElementById('gst-link-banner');
            if (linkBanner) {
                linkBanner.style.display = 'flex';
                linkBanner.style.animation = 'fadeInUp 0.6s ease forwards';
            }

            // Show result notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                bottom: 2rem;
                right: 2rem;
                background: var(--bg-alt);
                border: 1px solid var(--primary);
                border-left: 5px solid var(--primary);
                padding: 1.5rem;
                border-radius: var(--radius-md);
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 5000;
                animation: slideUpFade 0.5s ease forwards;
                max-width: 350px;
            `;
            notification.innerHTML = `
                <div style="font-weight: 700; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-robot" style="color: var(--primary);"></i> AI Intelligence Report
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
                    We've identified <strong>Income Tax (ITR-3)</strong> and <strong>Monthly GST Returns</strong> as your primary requirements. TDS Tracking has been enabled for your consultancy income.
                </p>
                <button class="btn btn-sm btn-primary" style="margin-top: 1rem; width: 100%;" onclick="this.parentElement.remove()">Review Modules</button>
            `;
            document.body.appendChild(notification);

            // Reset button after some time
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.borderColor = '';
            }, 5000);
            
        }, 2000);
    }, 1500);
}

/**
 * Fetch Details from TAXSubmit Simulation
 */
function fetchTaxSubmitDetails(mode) {
    const btn = event.target.closest('button');
    const originalContent = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Fetching...`;

    setTimeout(() => {
        if (mode === 'personal') {
            // Fill Personal Details in State
            userData.firstName = "Mahesh";
            userData.lastName = "Kumar";
            userData.fatherName = "Kumar Prasad";
            userData.pan = "ABCDE1234F";
            userData.dob = "1990-05-15";
            userData.aadhaar = "XXXX XXXX 1234";
            userData.email = "mahesh@gmail.com";
            userData.mobile = "+91 90000 35869";
            
            // Sync to UI
            updateDashboardProfileUI();

            // Add highlight effect to inputs
            ['profile-fname', 'profile-mname', 'profile-lname', 'profile-father', 'profile-pan', 'profile-dob', 'profile-aadhaar', 'profile-email', 'profile-mobile'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.add('linked-field');
                    el.style.borderLeft = '3px solid #22c55e';
                    el.style.backgroundColor = 'rgba(34, 197, 94, 0.05)';
                }
            });
        } else if (mode === 'business') {
            // Fill Business Details
            const bizName = document.querySelector('#business-compliance input[placeholder="e.g. Mahesh Consulting"]');
            const gstInput = document.querySelector('#business-compliance input[placeholder="27ABCDE1234F1Z5"]');
            const turnover = document.getElementById('business-turnover');
            
            if (bizName) bizName.value = "Mahesh Compliance Solutions";
            if (gstInput) gstInput.value = "27ABCDE1234F1Z5";
            if (turnover) turnover.value = "₹ 24,50,000.00";
            
            [bizName, gstInput, turnover].forEach(el => {
                if (el) {
                    el.classList.add('linked-field');
                    el.style.borderLeft = '3px solid #22c55e';
                }
            });

            if (typeof calculateNetProfit === 'function') calculateNetProfit();
        }

        btn.innerHTML = `<i class="fa-solid fa-check"></i> Data Synced`;
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
            alert('Success: Data successfully fetched and synced from your TAXSubmit records.');
        }, 2000);
    }, 1500);
}

