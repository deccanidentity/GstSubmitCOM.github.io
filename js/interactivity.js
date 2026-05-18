/**
 * GSTSubmit Interactivity
 * Handles interactive elements like drag-and-drop feedback and custom animations.
 */

document.addEventListener('DOMContentLoaded', () => {
    setupDragAndDrop();
});

function setupDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');

    if (!dropZone || !fileInput || !fileList) return;

    // Trigger file input on click
    dropZone.addEventListener('click', () => fileInput.click());

    // Highlight drop zone on drag over
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('drag-active');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-active');
        }, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }, false);

    // Handle selected files
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleFiles(files) {
        ([...files]).forEach(file => {
            addFileToList(file);
        });
    }

    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item fade-in-up visible';
        
        // Format size
        const size = (file.size / (1024 * 1024)).toFixed(2);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fa-solid fa-file-pdf"></i>
                <div class="file-details">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${size} MB</span>
                </div>
            </div>
            <div class="file-status">
                <span class="status-badge">Ready to Sync</span>
                <button class="remove-file" title="Remove"><i class="fa-solid fa-xmark"></i></button>
            </div>
        `;

        fileList.appendChild(fileItem);

        // Remove file logic
        fileItem.querySelector('.remove-file').addEventListener('click', () => {
            fileItem.style.opacity = '0';
            fileItem.style.transform = 'translateY(10px)';
            setTimeout(() => fileItem.remove(), 300);
        });
    }
}
