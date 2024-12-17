let sidebarOpen = false;
let sidebar = null;
let keyboardConfig = {
    nextKey: 'NumpadRight',     // Default values
    previousKey: 'NumpadLeft',
    toggleKey: 'Escape'
};

// Fetch keyboard configuration when extension loads
fetch(chrome.runtime.getURL('configuration.json'))
    .then(response => response.json())
    .then(data => {
        if (data.keyboard) {
            keyboardConfig = data.keyboard;
        }
    });

// Add global keyboard event listener
window.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.code); // Debug log to see actual key codes

    // Handle toggle key
    if (e.code === keyboardConfig.toggleKey) {
        e.preventDefault();
        e.stopPropagation();
        toggleSidebar();
        return;
    }

    if (!sidebarOpen) return;
    
    if (e.code === keyboardConfig.nextKey || e.code === keyboardConfig.previousKey) {
        e.preventDefault();
        e.stopPropagation();
        
        sidebar.contentWindow.postMessage({
            type: 'keypress',
            key: e.code === keyboardConfig.nextKey ? 'ArrowRight' : 'ArrowLeft'
        }, '*');
    }
}, true);

// Add toggle function
function toggleSidebar() {
    if (!sidebarOpen) {
        console.log('Creating sidebar');
        createSidebar();
    } else {
        console.log('Removing sidebar');
        removeSidebar();
    }
    sidebarOpen = !sidebarOpen;
}

// Keep existing message listener for the extension button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);
    if (request.action === "toggleSidebar") {
        toggleSidebar();
    }
});

function createSidebar() {
    sidebar = document.createElement('iframe');
    sidebar.src = chrome.runtime.getURL('sidebar.html');
    sidebar.id = 'demo-agenda-sidebar';
    document.body.appendChild(sidebar);
    
    // Add class to body instead of direct style manipulation
    document.body.classList.add('sidebar-active');
}

function removeSidebar() {
    if (sidebar) {
        sidebar.remove();
        document.body.classList.remove('sidebar-active');
    }
}

console.log('Demo Agenda content script loaded');