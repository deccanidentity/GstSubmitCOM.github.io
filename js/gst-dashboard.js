/**
 * GSTSubmit GST Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initial State
    showStep('login-step');
    initDashboardNav();
});

/**
 * Onboarding Navigation
 */
function showStep(stepId) {
    document.querySelectorAll('.onboarding-card').forEach(card => {
        card.classList.remove('active');
    });

    const target = document.getElementById(stepId);
    if (target) {
        target.classList.add('active');
    }

    const steps = ['login-step', 'gstin-step', 'integration-step'];
    const currentIdx = steps.indexOf(stepId);
    
    document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
        if (idx <= currentIdx) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function simulateGoogleLogin() {
    const loginBtn = document.querySelector('.btn-google');
    loginBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Authenticating...`;
    loginBtn.disabled = true;

    setTimeout(() => {
        loginBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Business Account Verified`;
        loginBtn.style.background = '#e8f5e9';
        loginBtn.style.color = '#2e7d32';
        
        setTimeout(() => {
            showStep('gstin-step');
        }, 1000);
    }, 1500);
}

function validateGSTIN() {
    const input = document.getElementById('gstin-number');
    if (input.value.length >= 15) {
        showStep('integration-step');
    } else {
        alert('Please enter a valid 15-digit GSTIN');
    }
}

function initDashboardNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            if (sectionId) showDashboardSection(sectionId);
        });
    });
}

function showDashboardSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        
        const headerMap = {
            'business-profile': { title: 'Business Profile', desc: 'Manage your GST registration and business entity details.' },
            'gstr-1': { title: 'Outward Supplies (GSTR-1)', desc: 'Report your sales invoices and tax liabilities for the period.' },
            'gstr-3b': { title: 'Summary Return (GSTR-3B)', desc: 'Summary of outward supplies, ITC, and payment of taxes.' },
            'itc-ledger': { title: 'ITC Ledger', desc: 'View your Input Tax Credit balance across CGST, SGST, and IGST.' },
            'gst-payments': { title: 'GST Payments', desc: 'Pay your tax liabilities and download payment challans.' },
            'file-gst': { title: 'File GST Return', desc: 'Finalize your return data and submit to the GSTN portal.' },
            'downloads': { title: 'Download Center', desc: 'Access your GST certificates, returns, and acknowledgements.' }
        };

        const currentHeader = headerMap[sectionId] || { title: 'Dashboard', desc: '' };
        document.getElementById('section-title').innerText = currentHeader.title;
        document.getElementById('section-description').innerText = currentHeader.desc;

        // Update Tabs
        const tabs = document.querySelectorAll('.tab-item');
        tabs.forEach(tab => {
            const tabText = tab.innerText.toLowerCase().trim();
            const sectionLower = sectionId.replace('-', ' ').toLowerCase();
            
            const isMatch = sectionLower.includes(tabText.split(' ')[0]) || 
                           (sectionId === 'business-profile' && tabText === 'business profile');

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
        document.querySelectorAll('.nav-item').forEach(item => {
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

function finishOnboarding() {
    const overlay = document.querySelector('.onboarding-overlay');
    const dashboard = document.querySelector('.dashboard-container');
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
        dashboard.style.display = 'flex';
        setTimeout(() => {
            dashboard.style.opacity = '1';
            showDashboardSection('business-profile');
        }, 50);
    }, 600);
}

/**
 * Sync Business Details from Tax Registry
 */
function syncBusinessDetails() {
    const btn = event.target.closest('button');
    const originalContent = btn.innerHTML;
    
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Syncing...`;

    setTimeout(() => {
        const tradeName = document.querySelector('#business-profile input[placeholder="e.g. Mahesh Solutions"]');
        const legalName = document.querySelector('#business-profile input[placeholder="As per PAN"]');
        const gstinInput = document.querySelector('#business-profile input[placeholder="GSTIN/UIN"]');
        const constitution = document.querySelector('#business-profile input[placeholder="Constitution of Business"]');
        
        if (tradeName) tradeName.value = "Mahesh Compliance Solutions";
        if (legalName) legalName.value = "Mahesh Kumar";
        if (gstinInput) gstinInput.value = "27ABCDE1234F1Z5";
        if (constitution) constitution.value = "Individual / Proprietorship";
        
        // Add visual link effect
        [tradeName, legalName, gstinInput, constitution].forEach(el => {
            if (el) {
                el.style.borderLeft = '3px solid var(--primary)';
                el.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
            }
        });

        btn.innerHTML = `<i class="fa-solid fa-check"></i> Data Synced`;
        btn.style.background = '#22c55e';
        btn.style.borderColor = '#22c55e';

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.borderColor = '';
            btn.disabled = false;
            alert('Success: Business profile successfully synced from the Central Tax Registry.');
        }, 2000);
    }, 1500);
}
