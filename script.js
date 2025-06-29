// Constants
const APP_VERSION = '2.0.0';
const CACHE_VERSION = 'airline-staff-portal-v2.0.0';
const CUSTOM_LINKS_KEY = 'airline-staff-portal-custom-links';
const THEME_KEY = 'airline-portal-theme';

// Create the manifest
const manifestData = {
    name: "Airline Staff Portal",
    short_name: "AA Staff",
    description: "Essential tools for airline staff - flight tracking, airport info, and quick links",
    id: "/index.html",
    start_url: "./index.html",
    display: "standalone",
    background_color: "#0063c6",
    theme_color: "#0063c6",
    orientation: "portrait-primary",
    icons: [
        {
            src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjMDA2M2M2IiBkPSJNNTAsMTBMOTAsOTBIMTBMNTAsMTB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik01MCw3NWwtMjUtMTBoNTBMNTAsNzV6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik01MCwyNWwxNSw0NUg2NWwtMTUtNDV6Ci8+PC9zdmc+",
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any"
        },
        {
            src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cmVjdCB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcng9IjEwMCIgZmlsbD0iIzAwNjNjNiIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMjU2LDEwMEwzOTAsMzgwSDEyMkwyNTYsMTAweiIvPjxwYXRoIGZpbGw9IiNlNDAwNDYiIGQ9Ik0yNTYsMzIwbC0zNS0xOGg3MEwyNTYsMzIweiIvPjxwYXRoIGZpbGw9IiNlNDAwNDYiIGQ9Ik0yNTYsMTUwbDIwLDcwaDIwbC0yMC03MHoiLz48L3N2Zz4=",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable"
        }
    ],
    shortcuts: [
        {
            name: "Track Flight",
            short_name: "Flight",
            description: "Track a flight quickly",
            url: "./index.html?action=track_flight",
            icons: [{ 
                src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzAwNjNjNiIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNzAsMzBMNDAsNjVIMzBMNjAsMzBINzB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik03MCw1MEw1MCw2NUg0MEw2MCw1MEg3MHoiLz48L3N2Zz4=", 
                sizes: "192x192" 
            }]
        },
        {
            name: "Airport Info",
            short_name: "Airport",
            description: "Look up airport information",
            url: "./index.html?action=airport_info",
            icons: [{ 
                src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzAwNjNjNiIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNNTAsNzBMMzAsNTVINzBMNTAsNzB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik01MCwzMEw2NSw1MEg2MEw0NSwzMEg1MHoiLz48L3N2Zz4=", 
                sizes: "192x192" 
            }]
        }
    ],
    scope: "./",
    related_applications: [],
    prefer_related_applications: false,
    categories: ["utilities", "productivity"]
};

// Create Blob and Object URL for manifest
const manifestBlob = new Blob([JSON.stringify(manifestData)], {type: 'application/json'});
const manifestURL = URL.createObjectURL(manifestBlob);
document.getElementById('manifest-placeholder').href = manifestURL;

// Global variables
let currentPanel = null;
let currentTheme = 'light';
let isExpanded = false;
let isCompactMode = false;
let toolsExpanded = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initThemeHandling();
    initPanelHandling();
    initQuickLinks();
    initModals();
    loadCustomLinks();
    updateTimeDisplays();
    initWeatherTooltips();
    
    // Update clocks every second
    setInterval(updateTimeDisplays, 1000);
    
    // Load saved settings
    loadSettings();
    
    console.log('🛩️ Airline Staff Portal loaded successfully!');
});

// Links Dropdown State
let linksDropdownOpen = false;

// Toggle Links Dropdown
function toggleLinksDropdown() {
    const dropdownMenu = document.getElementById('linksDropdownMenu');
    const dropdownIcon = document.getElementById('linksDropdownIcon');
    const dropdownBtn = document.getElementById('linksDropdownBtn');
    
    if (!dropdownMenu || !dropdownIcon || !dropdownBtn) return;
    
    linksDropdownOpen = !linksDropdownOpen;
    
    if (linksDropdownOpen) {
        dropdownMenu.classList.add('show');
        dropdownIcon.className = 'fas fa-chevron-up';
        dropdownBtn.classList.add('active');
    } else {
        dropdownMenu.classList.remove('show');
        dropdownIcon.className = 'fas fa-chevron-down';
        dropdownBtn.classList.remove('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdownBtn = document.getElementById('linksDropdownBtn');
    const dropdownMenu = document.getElementById('linksDropdownMenu');
    
    if (dropdownBtn && dropdownMenu && !dropdownBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
        const dropdownIcon = document.getElementById('linksDropdownIcon');
        
        if (dropdownMenu && dropdownIcon && dropdownBtn) {
            linksDropdownOpen = false;
            dropdownMenu.classList.remove('show');
            dropdownIcon.className = 'fas fa-chevron-down';
            dropdownBtn.classList.remove('active');
        }
    }
});

// Compact Flight Tracking with FlightAware
function trackFlightCompact() {
    const airlineSelect = document.getElementById('airlineSelect');
    const flightNumberInput = document.getElementById('flightNumberCompact');
    
    if (!airlineSelect || !flightNumberInput) return;
    
    const airlineCode = airlineSelect.value;
    const flightNumber = flightNumberInput.value.trim();
    
    if (!flightNumber) {
        showNotification('Please enter a flight number', 'error');
        return;
    }
    
    // Validate flight number (numbers only)
    if (!/^\d{1,4}$/.test(flightNumber)) {
        showNotification('Flight number must be 1-4 digits only', 'error');
        return;
    }
    
    // Construct FlightAware URL
    const flightAwareUrl = `https://www.flightaware.com/live/flight/${airlineCode}${flightNumber}`;
    
    // Open in new tab
    window.open(flightAwareUrl, '_blank');
    
    // Show success notification
    showNotification(`Tracking ${airlineCode}${flightNumber} on FlightAware`, 'success');
    
    // Clear input
    flightNumberInput.value = '';
}

// Header Flight Tracking with FlightAware
function trackFlightHeader() {
    const airlineSelect = document.getElementById('airlineSelectHeader');
    const flightNumberInput = document.getElementById('flightNumberHeader');
    
    if (!airlineSelect || !flightNumberInput) return;
    
    const airlineCode = airlineSelect.value;
    const flightNumber = flightNumberInput.value.trim();
    
    if (!flightNumber) {
        showNotification('Enter flight number', 'error');
        return;
    }
    
    // Validate flight number (numbers only)
    if (!/^\d{1,4}$/.test(flightNumber)) {
        showNotification('Flight number must be 1-4 digits', 'error');
        return;
    }
    
    // Construct FlightAware URL
    const flightAwareUrl = `https://www.flightaware.com/live/flight/${airlineCode}${flightNumber}`;
    
    // Open in new tab
    window.open(flightAwareUrl, '_blank');
    
    // Show success notification
    showNotification(`Tracking ${airlineCode}${flightNumber}`, 'success');
    
    // Clear input
    flightNumberInput.value = '';
}

// Add Enter key support for flight tracking and enhanced tooltips
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const flightInputHeader = document.getElementById('flightNumberHeader');
        if (flightInputHeader) {
            flightInputHeader.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    trackFlightHeader();
                }
            });
        }
        
        // Enhanced airline tooltips
        const airlineSelect = document.getElementById('airlineSelectHeader');
        if (airlineSelect) {
            // Create custom tooltip element
            const tooltip = document.createElement('div');
            tooltip.className = 'airline-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: var(--card-color);
                color: var(--text-color);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.7rem;
                border: 1px solid var(--border-color);
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.2s;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(tooltip);
            
            // Show tooltip on hover
            airlineSelect.addEventListener('mouseenter', function(e) {
                const selectedOption = this.options[this.selectedIndex];
                const airlineName = selectedOption.title;
                const rect = this.getBoundingClientRect();
                
                tooltip.textContent = airlineName;
                tooltip.style.left = rect.left + 'px';
                tooltip.style.top = (rect.bottom + 4) + 'px';
                tooltip.style.opacity = '1';
            });
            
            // Hide tooltip on leave
            airlineSelect.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
            });
            
            // Update tooltip when selection changes
            airlineSelect.addEventListener('change', function() {
                if (tooltip.style.opacity === '1') {
                    const selectedOption = this.options[this.selectedIndex];
                    tooltip.textContent = selectedOption.title;
                }
            });
        }
    }, 100);
});



// Theme handling
function initThemeHandling() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);
    
    function applyTheme(theme) {
        // Remove all theme classes
        body.classList.remove('dark-mode', 'aa-mode');
        themeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Apply selected theme
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            document.querySelector('.dark-theme').classList.add('active');
        } else if (theme === 'aa') {
            body.classList.add('aa-mode');
            document.querySelector('.aa-theme').classList.add('active');
        } else {
            document.querySelector('.light-theme').classList.add('active');
        }
        
        currentTheme = theme;
        localStorage.setItem(THEME_KEY, theme);
    }
    
    // Theme button event listeners
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('light-theme')) {
                applyTheme('light');
            } else if (button.classList.contains('dark-theme')) {
                applyTheme('dark');
            } else if (button.classList.contains('aa-theme')) {
                applyTheme('aa');
            }
        });
    });
}

// Panel handling
function initPanelHandling() {
    const panelToggle = document.getElementById('panelToggle');
    const smallScreenToggle = document.getElementById('smallScreenToggle');
    
    if (panelToggle) {
        panelToggle.addEventListener('click', togglePanelView);
    }
    
    if (smallScreenToggle) {
        smallScreenToggle.addEventListener('click', toggleCompactMode);
    }
}

function showPanel(panelType) {
    hidePanel(); // Hide any open panel first
    
    const panel = document.getElementById(`${panelType}-panel`);
    const panelsContainer = document.getElementById('panelsContainer');
    
    if (panel && panelsContainer) {
        panelsContainer.style.display = 'block';
        panel.classList.add('active');
        currentPanel = panelType;
        
        // Focus on input if available
        const input = panel.querySelector('input[type="text"], input[type="number"]');
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
}

function hidePanel() {
    const panelsContainer = document.getElementById('panelsContainer');
    const panels = document.querySelectorAll('.panel');
    
    panels.forEach(panel => panel.classList.remove('active'));
    
    if (panelsContainer) {
        panelsContainer.style.display = 'none';
    }
    
    currentPanel = null;
}

function togglePanelView() {
    const btn = document.getElementById('panelToggle');
    const icon = btn.querySelector('i');
    
    isExpanded = !isExpanded;
    
    if (isExpanded) {
        icon.className = 'fas fa-compress';
        btn.classList.add('active');
        document.querySelector('.container').style.maxWidth = '900px';
    } else {
        icon.className = 'fas fa-expand';
        btn.classList.remove('active');
        document.querySelector('.container').style.maxWidth = '600px';
    }
}

function toggleCompactMode() {
    const btn = document.getElementById('smallScreenToggle');
    
    isCompactMode = !isCompactMode;
    
    if (isCompactMode) {
        btn.classList.add('active');
        document.body.classList.add('compact-mode');
    } else {
        btn.classList.remove('active');
        document.body.classList.remove('compact-mode');
    }
}



// Flight tracking
function handleFlightTracking() {
    const flightInput = document.getElementById('flightInput');
    const resultsDiv = document.getElementById('flightResults');
    const trackingStatus = document.getElementById('tracking-status');
    const trackingText = document.getElementById('tracking-text');
    const clearBtn = document.getElementById('clearBtn');
    
    if (flightInput && resultsDiv) {
        const flightNumber = flightInput.value.trim().toUpperCase();
        
        if (flightNumber) {
            // Update status to searching
            trackingStatus.style.color = '#f59e0b';
            trackingText.textContent = 'Searching...';
            
            // Show flight status
            showFlightStatus(flightNumber, resultsDiv);
            
            // Show clear button
            clearBtn.style.display = 'flex';
            
            // Update status to active
            setTimeout(() => {
                trackingStatus.style.color = '#10b981';
                trackingText.textContent = 'Active';
            }, 500);
        }
    }
}

function clearFlightResults() {
    const resultsDiv = document.getElementById('flightResults');
    const flightInput = document.getElementById('flightInput');
    const trackingStatus = document.getElementById('tracking-status');
    const trackingText = document.getElementById('tracking-text');
    const clearBtn = document.getElementById('clearBtn');
    
    // Clear input and results
    flightInput.value = '';
    resultsDiv.innerHTML = `
        <div class="placeholder-text">
            <i class="fas fa-plane"></i>
            <p>Enter a flight number above to track its status</p>
            <small>Try: AA123, DL456, UA789, SW101</small>
        </div>
    `;
    
    // Reset status
    trackingStatus.style.color = '#10b981';
    trackingText.textContent = 'Ready';
    
    // Hide clear button
    clearBtn.style.display = 'none';
    
    // Focus input
    flightInput.focus();
}

function showFlightStatus(flightNumber, container) {
    // Simulate flight data (in a real app, this would come from an API)
    const mockData = {
        flight: flightNumber,
        airline: flightNumber.substring(0, 2),
        origin: 'DFW',
        destination: 'LAX',
        departure: '15:30',
        arrival: '17:45',
        status: 'On Time',
        gate: 'A12',
        aircraft: 'Boeing 737-800'
    };
    
    container.innerHTML = `
        <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 16px; background: var(--card-color);">
            <h3 style="color: var(--primary-color); margin-bottom: 12px;">Flight ${mockData.flight}</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                <div><strong>From:</strong> ${mockData.origin}</div>
                <div><strong>To:</strong> ${mockData.destination}</div>
                <div><strong>Departure:</strong> ${mockData.departure}</div>
                <div><strong>Arrival:</strong> ${mockData.arrival}</div>
                <div><strong>Status:</strong> <span style="color: var(--success-color);">${mockData.status}</span></div>
                <div><strong>Gate:</strong> ${mockData.gate}</div>
            </div>
            <div style="background: var(--card-hover); padding: 8px; border-radius: var(--border-radius-sm); font-size: 0.9rem;">
                Aircraft: ${mockData.aircraft}
            </div>
        </div>
    `;
}

// Airport information
function handleAirportInfo() {
    const airportInput = document.getElementById('airportInput');
    const resultsDiv = document.getElementById('airportResults');
    
    if (airportInput && resultsDiv) {
        const airportCode = airportInput.value.trim().toUpperCase();
        
        if (airportCode) {
            showAirportInfo(airportCode, resultsDiv);
        }
    }
}

function showAirportInfo(code, container) {
    const airports = {
        'LAX': { name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', timezone: 'PST' },
        'JFK': { name: 'John F. Kennedy International', city: 'New York', country: 'USA', timezone: 'EST' },
        'DFW': { name: 'Dallas/Fort Worth International', city: 'Dallas', country: 'USA', timezone: 'CST' },
        'ORD': { name: 'Chicago O\'Hare International', city: 'Chicago', country: 'USA', timezone: 'CST' },
        'LHR': { name: 'London Heathrow', city: 'London', country: 'UK', timezone: 'GMT' },
        'CDG': { name: 'Charles de Gaulle', city: 'Paris', country: 'France', timezone: 'CET' }
    };
    
    const airport = airports[code];
    
    if (airport) {
        container.innerHTML = `
            <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius); padding: 16px; background: var(--card-color);">
                <h3 style="color: var(--primary-color); margin-bottom: 12px;">${code} - ${airport.name}</h3>
                <div style="display: grid; gap: 8px;">
                    <div><strong>City:</strong> ${airport.city}</div>
                    <div><strong>Country:</strong> ${airport.country}</div>
                    <div><strong>Timezone:</strong> ${airport.timezone}</div>
                    <div><strong>Status:</strong> <span style="color: var(--success-color);">Operational</span></div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div style="color: var(--error-color); padding: 16px; text-align: center;">
                Airport code "${code}" not found. Try LAX, JFK, DFW, ORD, LHR, or CDG.
            </div>
        `;
    }
}

// Multi-search
function handleMultiSearch() {
    const searchInput = document.getElementById('multiSearchInput');
    const resultsDiv = document.getElementById('multiSearchResults');
    
    if (searchInput && resultsDiv) {
        const query = searchInput.value.trim().toUpperCase();
        
        if (query) {
            resultsDiv.innerHTML = `
                <div style="padding: 16px; text-align: center; color: var(--text-light);">
                    Searching for "${query}" across flights, airports, and routes...
                    <br><br>
                    <div style="color: var(--primary-color);">
                        In a real application, this would search multiple databases and return comprehensive results.
                    </div>
                </div>
            `;
        }
    }
}

// Quick links management
function initQuickLinks() {
    const defaultLinks = [
        { name: 'American Airlines', url: 'https://aa.com', icon: 'fas fa-plane' },
        { name: 'Flight Aware', url: 'https://flightaware.com', icon: 'fas fa-radar' },
        { name: 'Weather', url: 'https://weather.gov', icon: 'fas fa-cloud-sun' },
        { name: 'NOTAMs', url: 'https://www.faa.gov/air_traffic/publications/notices/', icon: 'fas fa-exclamation-triangle' }
    ];
    
    const savedLinks = JSON.parse(localStorage.getItem(CUSTOM_LINKS_KEY) || '[]');
    const allLinks = savedLinks.length > 0 ? savedLinks : defaultLinks;
    
    displayQuickLinks(allLinks);
}

function displayQuickLinks(links) {
    const container = document.getElementById('quickLinksContainer');
    if (!container) return;
    
    container.innerHTML = links.map(link => `
        <a href="${link.url}" target="_blank" class="link-item">
            <i class="${link.icon}"></i>
            <span>${link.name}</span>
        </a>
    `).join('');
}

function loadCustomLinks() {
    const links = JSON.parse(localStorage.getItem(CUSTOM_LINKS_KEY) || '[]');
    if (links.length > 0) {
        displayQuickLinks(links);
    }
}

// Modal handling
function initModals() {
    // Tools menu
    const toolsMenuBtn = document.querySelector('.tools-menu-btn');
    if (toolsMenuBtn) {
        toolsMenuBtn.addEventListener('click', openToolsMenu);
    }
    
    // Add link modal
    const addLinkBtn = document.querySelector('.add-link-btn');
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', openCustomLinkModal);
    }
}

function openToolsMenu() {
    const modal = document.getElementById('toolsMenuModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeToolsMenu() {
    const modal = document.getElementById('toolsMenuModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function openCustomLinkModal() {
    const modal = document.getElementById('customLinkModal');
    if (modal) {
        modal.classList.add('active');
        // Clear form
        document.getElementById('linkName').value = '';
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkIcon').value = 'fas fa-link';
    }
}

function closeCustomLinkModal() {
    const modal = document.getElementById('customLinkModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function saveCustomLink() {
    const name = document.getElementById('linkName').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const icon = document.getElementById('linkIcon').value.trim() || 'fas fa-link';
    
    if (name && url) {
        const links = JSON.parse(localStorage.getItem(CUSTOM_LINKS_KEY) || '[]');
        links.push({ name, url, icon });
        localStorage.setItem(CUSTOM_LINKS_KEY, JSON.stringify(links));
        
        displayQuickLinks(links);
        closeCustomLinkModal();
        showNotification('Link added successfully!', 'success');
    } else {
        showNotification('Please enter both name and URL', 'error');
    }
}

function navigateToTool(toolName) {
    if (toolName === 'screen-testing') {
        window.location.href = `${toolName}/`;
    } else {
        showNotification(`${toolName} tool coming soon!`, 'warning');
    }
}

// Notifications
function showNotification(message, type = 'success') {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'exclamation'}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Time display updates
function updateTimeDisplays() {
    const now = new Date();
    
    // Local time
    const localTimeElement = document.getElementById('localTime');
    const localDateElement = document.getElementById('localDate');
    
    if (localTimeElement) {
        localTimeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
    
    if (localDateElement) {
        localDateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    }
    
    // UTC time
    const utcTimeElement = document.getElementById('utcTime');
    const utcDateElement = document.getElementById('utcDate');
    
    if (utcTimeElement) {
        utcTimeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'UTC'
        });
    }
    
    if (utcDateElement) {
        utcDateElement.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });
    }
}

// Settings management
function loadSettings() {
    // Load any saved settings from localStorage
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
        currentTheme = savedTheme;
    }
    
    // Load quick links visibility preference
    const savedQuickLinksVisible = localStorage.getItem('quickLinksVisible');
    if (savedQuickLinksVisible === 'false') {
        setTimeout(() => {
            const quickLinksBar = document.getElementById('quickLinksBar');
            const toggleIcon = document.getElementById('quickLinksToggleIcon');
            const toggleBtn = document.querySelector('.quick-links-toggle');
            
            if (quickLinksBar && toggleIcon && toggleBtn) {
                quickLinksVisible = false;
                quickLinksBar.classList.add('collapsed');
                toggleIcon.className = 'fas fa-chevron-down';
                toggleBtn.classList.add('collapsed');
            }
        }, 100);
    }
}

// Close modals when clicking outside
document.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close panels/modals
    if (e.key === 'Escape') {
        hidePanel();
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    // Enter to submit forms in panels
    if (e.key === 'Enter' && currentPanel) {
        e.preventDefault();
        if (currentPanel === 'flight') {
            handleFlightTracking();
        } else if (currentPanel === 'airport') {
            handleAirportInfo();
        } else if (currentPanel === 'multi-search') {
            handleMultiSearch();
        }
    }
});

// Weather API functionality
const weatherCache = new Map();
const WEATHER_CACHE_TIME = 10 * 60 * 1000; // 10 minutes

async function fetchWeatherData(airportCode) {
    const cacheKey = airportCode;
    const cachedData = weatherCache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < WEATHER_CACHE_TIME) {
        return cachedData.data;
    }
    
    // Use CORS proxy service for GitHub Pages compatibility
    const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
    ];
    
    const apiUrl = `https://aviationweather.gov/api/data/metar?ids=${airportCode}&format=json`;
    
    for (const proxy of corsProxies) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch(proxy + encodeURIComponent(apiUrl), {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const weatherData = Array.isArray(data) && data.length > 0 ? data[0] : null;
            
            if (weatherData) {
                // Cache the data
                weatherCache.set(cacheKey, {
                    data: weatherData,
                    timestamp: Date.now()
                });
                
                return weatherData;
            }
        } catch (error) {
            console.warn(`CORS proxy ${proxy} failed for ${airportCode}:`, error);
            continue; // Try next proxy
        }
    }
    
    // If all proxies fail, try direct API one more time
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(apiUrl, {
            signal: controller.signal,
            mode: 'cors'
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            const weatherData = data.length > 0 ? data[0] : null;
            
            if (weatherData) {
                weatherCache.set(cacheKey, {
                    data: weatherData,
                    timestamp: Date.now()
                });
                
                return weatherData;
            }
        }
    } catch (error) {
        // Direct API failed, which is expected due to CORS
    }
    
    // Return null to indicate no data available
    return null;
}



function parseMetarData(metar) {
    if (!metar) return null;
    
    const rawText = metar.rawOb || '';
    
    // Extract temperature (format: M##/M## or ##/## or ##/)
    const tempMatch = rawText.match(/\s(M?\d{2})\/(M?\d{2}|)\s/);
    let temperature = 'N/A';
    if (tempMatch) {
        let temp = tempMatch[1];
        if (temp.startsWith('M')) {
            temp = '-' + temp.substring(1);
        }
        const tempF = Math.round((parseInt(temp) * 9/5) + 32);
        temperature = `${tempF}°F`;
    }
    
    // Extract wind information
    const windMatch = rawText.match(/\s(\d{3}\d{2}KT|\d{3}\d{2}G\d{2}KT|VRB\d{2}KT)\s/);
    let wind = 'Calm';
    if (windMatch) {
        const windStr = windMatch[1];
        if (windStr.startsWith('VRB')) {
            const speed = windStr.match(/\d{2}/)[0];
            wind = `Variable ${parseInt(speed)} kt`;
        } else {
            const direction = windStr.substring(0, 3);
            const speed = windStr.substring(3, 5);
            const gustMatch = windStr.match(/G(\d{2})/);
            if (gustMatch) {
                wind = `${direction}° at ${parseInt(speed)} G ${parseInt(gustMatch[1])} kt`;
            } else {
                wind = `${direction}° at ${parseInt(speed)} kt`;
            }
        }
    }
    
    // Extract visibility
    const visMatch = rawText.match(/\s(\d{1,2}SM|\d\/\d{1,2}SM)\s/);
    let visibility = 'N/A';
    if (visMatch) {
        visibility = visMatch[1];
    }
    
    // Extract altimeter
    const altMatch = rawText.match(/\sA(\d{4})\s/);
    let altimeter = 'N/A';
    if (altMatch) {
        const alt = altMatch[1];
        altimeter = `${alt.substring(0,2)}.${alt.substring(2)} inHg`;
    }
    
    // Extract conditions (basic weather phenomena)
    const conditionsMatch = rawText.match(/\s(CLR|SKC|FEW\d{3}|SCT\d{3}|BKN\d{3}|OVC\d{3}|VV\d{3})/);
    let conditions = 'Clear';
    if (conditionsMatch) {
        const cond = conditionsMatch[1];
        if (cond === 'CLR' || cond === 'SKC') conditions = 'Clear';
        else if (cond.startsWith('FEW')) conditions = 'Few Clouds';
        else if (cond.startsWith('SCT')) conditions = 'Scattered Clouds';
        else if (cond.startsWith('BKN')) conditions = 'Broken Clouds';
        else if (cond.startsWith('OVC')) conditions = 'Overcast';
        else if (cond.startsWith('VV')) conditions = 'Vertical Visibility';
    }
    
    return {
        temperature,
        wind,
        visibility,
        altimeter,
        conditions,
        observationTime: metar.obsTime || 'N/A',
        rawText: rawText
    };
}

function initWeatherTooltips() {
    const hubItems = document.querySelectorAll('.hub-item[data-hub]');
    const tooltip = document.getElementById('weatherTooltip');
    
    if (!tooltip) return;
    
    hubItems.forEach(hubItem => {
        hubItem.addEventListener('mouseenter', async (e) => {
            const airportCode = hubItem.getAttribute('data-hub');
            const displayCode = hubItem.getAttribute('data-airport');
            
            // Position tooltip
            const rect = hubItem.getBoundingClientRect();
            tooltip.style.left = `${rect.right + 10}px`;
            tooltip.style.top = `${rect.top}px`;
            
            // Show loading state
            document.getElementById('weatherAirport').textContent = displayCode;
            document.getElementById('weatherTime').textContent = 'Loading...';
            document.getElementById('weatherConditions').textContent = 'Loading...';
            document.getElementById('weatherTemp').textContent = '--°F';
            document.getElementById('weatherWind').textContent = '--';
            document.getElementById('weatherVisibility').textContent = '--';
            document.getElementById('weatherAltimeter').textContent = '--';
            
            tooltip.classList.add('visible');
            
            // Fetch weather data
            const weatherData = await fetchWeatherData(airportCode);
            
            if (weatherData) {
                const parsedWeather = parseMetarData(weatherData);
                
                if (parsedWeather) {
                    document.getElementById('weatherConditions').textContent = parsedWeather.conditions;
                    document.getElementById('weatherTemp').textContent = parsedWeather.temperature;
                    document.getElementById('weatherWind').textContent = parsedWeather.wind;
                    document.getElementById('weatherVisibility').textContent = parsedWeather.visibility;
                    document.getElementById('weatherAltimeter').textContent = parsedWeather.altimeter;
                    
                    // Format time
                    const time = new Date(parsedWeather.observationTime);
                    if (!isNaN(time.getTime())) {
                        document.getElementById('weatherTime').textContent = time.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZoneName: 'short'
                        });
                    } else {
                        document.getElementById('weatherTime').textContent = 'Recent';
                    }
                } else {
                    document.getElementById('weatherConditions').textContent = 'Unable to parse weather data';
                    document.getElementById('weatherTime').textContent = 'N/A';
                }
            } else {
                // Show message that weather service is currently unavailable
                document.getElementById('weatherConditions').textContent = 'Weather service unavailable';
                document.getElementById('weatherTemp').textContent = '--°F';
                document.getElementById('weatherWind').textContent = '--';
                document.getElementById('weatherVisibility').textContent = '--';
                document.getElementById('weatherAltimeter').textContent = '--';
                document.getElementById('weatherTime').textContent = 'Try again later';
            }
        });
        
        hubItem.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });
    });
    
    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', () => {
        tooltip.classList.remove('visible');
    });
}

// Handle URL parameters for PWA shortcuts
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'track_flight') {
        showPanel('flight');
    } else if (action === 'airport_info') {
        showPanel('airport');
    }
});