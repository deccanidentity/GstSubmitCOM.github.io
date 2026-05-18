/**
 * E-Way Bill Dashboard Logic
 * Handles logistics-specific workflows and interactive UI.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    loadShipments();
});

let shipments = JSON.parse(localStorage.getItem('gst_shipments')) || [
    { date: '15 May 24', ewb: '5512 8893 1120', consignee: 'Reliance Retail', value: '₹ 4.52 L', status: 'Delivered' },
    { date: '14 May 24', ewb: '1214 5562 8891', consignee: 'Global Ind.', value: '₹ 12.30 L', status: 'In Transit' }
];

/**
 * Handles sidebar navigation and section switching
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-link-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });
}

/**
 * Switches the visible dashboard section
 */
function showSection(sectionId) {
    document.querySelectorAll('.nav-link-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });

    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(`section-${sectionId}`);
    if (targetSection) {
        targetSection.style.display = 'block';
    } else {
        document.getElementById('section-overview').style.display = 'block';
    }
}

/**
 * Simulates Bulk E-Way Bill Generation from Manifest
 */
function simulateBulkGen() {
    const statusDiv = document.getElementById('bulk-status');
    const progressBar = document.getElementById('bulk-progress-bar');
    const statusText = document.getElementById('bulk-text');
    
    statusDiv.style.display = 'block';
    let progress = 0;
    
    const steps = [
        "Validating Vehicle Numbers...",
        "Checking PIN Code Distances...",
        "Generating IRN Links...",
        "Signing E-Way Bills...",
        "Finalizing Consolidated Manifest..."
    ];
    
    const interval = setInterval(() => {
        progress += 5;
        const stepIndex = Math.floor((progress / 100) * steps.length);
        if (steps[stepIndex]) {
            statusText.innerText = steps[stepIndex];
        }

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            statusText.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10B981;"></i> 24 E-Way Bills Generated Successfully!';
            showToast('Bulk Logistics Processing Complete');
            
            setTimeout(() => {
                showSection('shipments');
                statusDiv.style.display = 'none';
                progressBar.style.width = '0%';
            }, 2000);
        }
        progressBar.style.width = `${progress}%`;
    }, 150);
}

/**
 * Toast Notification System
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.style.background = '#1E293B';
    toast.style.color = 'white';
    toast.style.padding = '1rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 10px 15px rgba(0,0,0,0.2)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '12px';
    toast.style.fontSize = '0.9rem';
    toast.style.borderLeft = '4px solid #3B82F6';
    toast.style.animation = 'slideInRight 0.3s ease-out';
    
    toast.innerHTML = `<i class="fa-solid fa-truck" style="color: #3B82F6;"></i> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

/**
 * Modal Management
 */
function openModal(id) {
    document.getElementById(id).style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

/**
 * Search Logic
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input-group input');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            showToast(`Searching logistics database for "${searchInput.value}"...`);
            setTimeout(() => {
                showSection('shipments');
            }, 500);
        }
    });
}

/**
 * Data Management & Persistence
 */
function loadShipments() {
    const tbody = document.querySelector('#section-shipments tbody');
    const overviewBody = document.querySelector('#section-overview tbody');
    if (!tbody) return;

    const renderRow = (s) => {
        const tr = document.createElement('tr');
        const statusClass = s.status === 'Delivered' ? 'status-delivered' : 'status-transit';
        tr.innerHTML = `
            <td style="padding: 1rem;">${s.date}</td>
            <td style="padding: 1rem; font-weight: 600;">${s.ewb}</td>
            <td style="padding: 1rem;">${s.consignee}</td>
            <td style="padding: 1rem;">${s.value}</td>
            <td style="padding: 1rem;"><span class="status-pill ${statusClass}">${s.status}</span></td>
        `;
        return tr;
    };

    tbody.innerHTML = '';
    shipments.forEach(s => tbody.appendChild(renderRow(s)));

    if (overviewBody) {
        overviewBody.innerHTML = '';
        shipments.slice(0, 5).forEach(s => {
            const tr = renderRow(s);
            // Customize overview row if needed
            overviewBody.appendChild(tr);
        });
    }
}

function createShipment() {
    const invoice = document.querySelector('#ewbModal input[placeholder="INV/24/..."]').value;
    const vehicle = document.querySelector('#ewbModal input[placeholder="TS 09 ..."]').value;

    if (!invoice || !vehicle) {
        showToast('Please enter all details');
        return;
    }

    const newShipment = {
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        ewb: `${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)} ${Math.floor(Math.random() * 9000 + 1000)}`,
        consignee: 'New Consignee',
        value: '₹ 1.25 L',
        status: 'In Transit'
    };

    shipments.unshift(newShipment);
    localStorage.setItem('gst_shipments', JSON.stringify(shipments));
    
    showToast('E-Way Bill Generated Successfully!');
    loadShipments();
    closeModal('ewbModal');
    showSection('shipments');

    // Reset
    document.querySelectorAll('#ewbModal input').forEach(i => i.value = '');
}

/**
 * Logistics AI Tools
 */
function optimizeRoute() {
    const origin = document.getElementById('ai-origin').value;
    const dest = document.getElementById('ai-dest').value;
    
    if (!origin || !dest) {
        showToast('Please enter origin and destination');
        return;
    }
    
    showToast(`AI is calculating optimal route from ${origin} to ${dest}...`);
    setTimeout(() => {
        document.getElementById('route-result').style.display = 'block';
        showToast('Optimal Route Found!');
    }, 2000);
}

function runTransitScan() {
    const logs = document.getElementById('sentinel-logs');
    logs.style.display = 'block';
    logs.innerHTML = '> Initializing Transit Sentinel AI...<br>';
    
    const steps = [
        "> Pinged 42 active GPS trackers...",
        "> Analyzing traffic patterns on NH-44...",
        "> Predicting ETA for TS 09 EA 1234...",
        "> ALERT: Potential delay at toll plaza near Pune.",
        "> Rerouting suggested for KA 01 BK 9988...",
        "> SENTINEL SCAN COMPLETE: 3 Vehicles Rerouted."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        logs.innerHTML += steps[i] + '<br>';
        logs.scrollTop = logs.scrollHeight;
        i++;
        if (i >= steps.length) {
            clearInterval(interval);
            showToast('Logistics Health: All Vehicles Optimized');
        }
    }, 900);
}

// Global scope expose
window.showSection = showSection;
window.simulateBulkGen = simulateBulkGen;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.createShipment = createShipment;
window.optimizeRoute = optimizeRoute;
window.runTransitScan = runTransitScan;

// Add CSS for toast animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
