/**
 * Cyber-Luxe AI Assistant Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    injectAssistantHTML();
    initAssistantListeners();
});

function injectAssistantHTML() {
    const assistantHTML = `
        <div class="ai-assistant-widget">
            <div class="ai-chat-window" id="ai-chat-window">
                <div class="ai-chat-header">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fa-solid fa-robot"></i>
                        <div>
                            <div style="font-weight: 700; font-size: 0.9rem;">GSTSubmit AI</div>
                            <div style="font-size: 0.7rem; opacity: 0.8;">Always active • Online</div>
                        </div>
                    </div>
                    <i class="fa-solid fa-xmark" style="cursor: pointer;" onclick="toggleChat()"></i>
                </div>
                <div class="ai-chat-body" id="ai-chat-body">
                    <div class="chat-bubble ai">
                        Hello! I am your GSTSubmit AI Assistant. How can I help you with your compliance today?
                        <div class="ai-suggestions">
                            <div class="suggestion-pill" onclick="sendQuickMessage('Check EWB Validity')">EWB Validity</div>
                            <div class="suggestion-pill" onclick="sendQuickMessage('IRN Generation Help')">IRN Help</div>
                            <div class="suggestion-pill" onclick="sendQuickMessage('HSN Prediction')">HSN Predictor</div>
                        </div>
                    </div>
                </div>
                <div class="ai-chat-footer">
                    <input type="text" id="ai-chat-input" placeholder="Ask me anything...">
                    <button onclick="handleUserMessage()"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
            <div class="ai-chat-trigger" onclick="toggleChat()">
                <i class="fa-solid fa-comment-dots"></i>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', assistantHTML);
}

function toggleChat() {
    const window = document.getElementById('ai-chat-window');
    window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
}

function handleUserMessage() {
    const input = document.getElementById('ai-chat-input');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    input.value = '';

    // Simulated AI Processing
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'ai');
    }, 1000);
}

function sendQuickMessage(text) {
    addMessage(text, 'user');
    setTimeout(() => {
        addMessage(getAIResponse(text), 'ai');
    }, 1000);
}

function addMessage(text, type) {
    const body = document.getElementById('ai-chat-body');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    bubble.innerText = text;
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
}

function getAIResponse(query) {
    const q = query.toLowerCase();
    if (q.includes('ewb') || q.includes('way')) {
        return "I can help you track E-Way bills. Currently, 2 of your shipments are nearing expiry. Would you like me to extend them?";
    } else if (q.includes('irn') || q.includes('invoice')) {
        return "Your IRN generation status is 100% healthy. I've validated your latest 50 invoices and they are compliant.";
    } else if (q.includes('hsn')) {
        return "I can predict HSN codes. Try typing a product description in the AI Lab section, or just tell me the product name here!";
    } else {
        return "That's a great question! For specific compliance help, I recommend checking our AI Lab or the latest GST notification updates in your dashboard.";
    }
}

function initAssistantListeners() {
    const input = document.getElementById('ai-chat-input');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });
    }
}

window.toggleChat = toggleChat;
window.handleUserMessage = handleUserMessage;
window.sendQuickMessage = sendQuickMessage;
