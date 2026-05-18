/**
 * E-Invoicing Dashboard Logic
 * Enhanced with Toast, Modal, and more interactive feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSearch();
    loadInvoices();
    setupTableActions();
});

let invoices = JSON.parse(localStorage.getItem('gst_invoices')) || [
    { id: 'INV/24/001', date: '15 May 2024', customer: 'Global Industries', value: '₹ 45,670.00', status: 'Generated' },
    { id: 'INV/24/002', date: '14 May 2024', customer: 'Alpha Tech Ltd', value: '₹ 12,300.00', status: 'Pending' }
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
 * Simulates a file upload process
 */
function simulateUpload() {
    const statusDiv = document.getElementById('upload-status');
    const progressBar = document.getElementById('upload-progress-bar');
    const statusText = document.getElementById('upload-text');
    
    statusDiv.style.display = 'block';
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            statusText.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10B981;"></i> 12 Invoices Imported Successfully!';
            showToast('Bulk Import Complete: 12 Invoices Added');
            
            setTimeout(() => {
                showSection('invoices');
                statusDiv.style.display = 'none';
                progressBar.style.width = '0%';
                statusText.innerText = 'Processing...';
            }, 2000);
        }
        progressBar.style.width = `${progress}%`;
    }, 300);
}

/**
 * Handles the top search bar interaction
 */
function initSearch() {
    const searchInput = document.querySelector('.search-input-group input');
    if (!searchInput) return;

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
            const query = searchInput.value;
            showToast(`Searching for "${query}"...`);
            setTimeout(() => {
                showSection('invoices');
                showToast(`Found 2 results for "${query}"`);
            }, 800);
        }
    });
}

/**
 * Toast Notification System
 */
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.style.background = 'rgba(30, 41, 59, 0.95)';
    toast.style.color = 'white';
    toast.style.padding = '1rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.fontSize = '0.9rem';
    toast.style.animation = 'slideInRight 0.3s ease-out';
    
    toast.innerHTML = `<i class="fa-solid fa-info-circle" style="color: #3B82F6;"></i> ${message}`;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Modal Management
 */
function openModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'flex';
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'none';
}

/**
 * Interactive Table Actions
 */
function setupTableActions() {
    document.querySelectorAll('.fa-ellipsis-vertical').forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            showToast('Opening action menu for record...');
        });
    });
}

/**
 * Table Rendering and Persistence
 */
function loadInvoices() {
    const tbody = document.querySelector('#section-invoices tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    invoices.forEach(inv => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #F1F5F9';
        const statusClass = inv.status === 'Generated' ? 'success' : 'warning';
        
        tr.innerHTML = `
            <td style="padding: 1rem; font-weight: 600;">${inv.id}</td>
            <td style="padding: 1rem;">${inv.date}</td>
            <td style="padding: 1rem;">${inv.customer}</td>
            <td style="padding: 1rem;">${inv.value}</td>
            <td style="padding: 1rem;"><span class="status-badge ${statusClass}">${inv.status}</span></td>
            <td style="padding: 1rem;"><i class="fa-solid fa-ellipsis-vertical" onclick="showToast('Options for ${inv.id}')"></i></td>
        `;
        tbody.appendChild(tr);
    });
}

function createInvoice() {
    const customer = document.querySelector('#invoiceModal input[type="text"]').value;
    const amount = document.querySelector('#invoiceModal input[type="number"]').value;
    
    if (!customer || !amount) {
        showToast('Please fill all fields');
        return;
    }

    const newInv = {
        id: `INV/24/00${invoices.length + 1}`,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        customer: customer,
        value: `₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        status: 'Generated'
    };

    invoices.unshift(newInv);
    localStorage.setItem('gst_invoices', JSON.stringify(invoices));
    
    showToast('Invoice Created & IRN Generated!');
    loadInvoices();
    closeModal('invoiceModal');
    showSection('invoices');

    // Reset inputs
    document.querySelectorAll('#invoiceModal input').forEach(i => i.value = '');
}

/**
 * AI Intelligence Tools
 */
function predictHSN() {
    const desc = document.getElementById('ai-item-desc').value;
    if (!desc) {
        showToast('Please enter an item description');
        return;
    }
    
    showToast('AI is analyzing description...');
    setTimeout(() => {
        document.getElementById('hsn-result').style.display = 'block';
        showToast('HSN Predicted Successfully!');
    }, 1500);
}

function runSmartAudit() {
    const logs = document.getElementById('audit-logs');
    logs.style.display = 'block';
    logs.innerHTML = '> Initializing AI Audit Engine...<br>';
    
    const steps = [
        "> Scanning IRN signatures...",
        "> Verifying GSTIN active status...",
        "> Cross-referencing HSN/SAC codes...",
        "> Checking for duplicate invoice patterns...",
        "> AUDIT COMPLETE: 0 Anomalies Found."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        logs.innerHTML += steps[i] + '<br>';
        logs.scrollTop = logs.scrollHeight;
        i++;
        if (i >= steps.length) {
            clearInterval(interval);
            showToast('Smart Audit Finished: Compliance Health 100%');
        }
    }, 800);
}

// Global scope expose
window.showSection = showSection;
window.simulateUpload = simulateUpload;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.createInvoice = createInvoice;
window.predictHSN = predictHSN;
window.runSmartAudit = runSmartAudit;

// Add CSS for toast animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);
