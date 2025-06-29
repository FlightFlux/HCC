// Constants
const APP_VERSION = '2.0.0';
const CACHE_VERSION = 'airline-staff-portal-v2.0.0';
const CUSTOM_LINKS_KEY = 'airline-staff-portal-custom-links';
const DARK_MODE_KEY = 'airline-staff-portal-dark-mode';
const SMALL_SCREEN_KEY = 'airline-staff-portal-small-screen';

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
            src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cGF0aCBmaWxsPSIjMDA2M2M2IiBkPSJNNTAsMTBMOTAsOTBIMTBMNTAsMTB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik01MCw3NWwtMjUtMTBoNTBMNTAsNzV6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik01MCwyNWwxNSw0NUg2NWwtMTUtNDV6Ii8+PC9zdmc+",
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

// DOM elements
const localTimeElement = document.getElementById('local-time');
const localDateElement = document.getElementById('local-date');
const utcTimeElement = document.getElementById('utc-time');
const utcDateElement = document.getElementById('utc-date');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const smallScreenToggle = document.getElementById('small-screen-toggle');
const flightTrackerForm = document.getElementById('flight-tracker-form');
const flightStatusContainer = document.getElementById('flight-status');
const multiSearchForm = document.getElementById('multi-search-form');
const airportInfoForm = document.getElementById('airport-info-form');
const airportInfoContainer = document.getElementById('airport-info');
const addLinkBtn = document.getElementById('add-link-btn');
const addLinkModal = document.getElementById('add-link-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const addLinkForm = document.getElementById('add-link-form');
const editLinkForm = document.getElementById('edit-link-form');
const editLinkModal = document.getElementById('edit-link-modal');
const notificationElement = document.getElementById('notification');
const installButton = document.getElementById('install-pwa');
const contextMenu = document.getElementById('context-menu');
const editLinkBtn = document.getElementById('edit-link');
const deleteLinkBtn = document.getElementById('delete-link');

// PWA install event
let deferredPrompt;
let currentCustomLinkElement = null;

// Setup panels (notifications, settings, etc.)
function setupPanels() {
    const panelButtons = document.querySelectorAll('.panel-btn');
    const closePanelButtons = document.querySelectorAll('.close-panel');
    
    // Panel toggle buttons
    panelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const panelId = this.getAttribute('data-panel');
            const panel = document.getElementById(panelId);
            
            if (panel) {
                // Close any open panels first
                document.querySelectorAll('.panel').forEach(p => {
                    if (p.id !== panelId) {
                        p.classList.remove('open');
                    }
                });
                
                // Toggle the target panel
                panel.classList.toggle('open');
            }
        });
    });
    
    // Close panel buttons
    closePanelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const panel = this.closest('.panel');
            if (panel) {
                panel.classList.remove('open');
            }
        });
    });
}

// Aviation Calculator Suite Functions
function initCalculatorSuite() {
    // Distance Calculator
    const originAirportDist = document.getElementById('origin-airport-dist');
    const destAirportDist = document.getElementById('dest-airport-dist');
    const distanceResult = document.getElementById('distance-result');
    const distanceTime = document.getElementById('distance-time');
    
    if (!originAirportDist || !destAirportDist) return; // Bail if elements not found
    
    // Airport coordinates (latitude, longitude)
    const airportCoordinates = {
        'DFW': { lat: 32.8998, lon: -97.0403 },
        'JFK': { lat: 40.6413, lon: -73.7781 },
        'LAX': { lat: 33.9416, lon: -118.4085 },
        'ORD': { lat: 41.9742, lon: -87.9073 },
        'MIA': { lat: 25.7932, lon: -80.2906 },
        'LHR': { lat: 51.4700, lon: -0.4543 },
        'CDG': { lat: 49.0097, lon: 2.5479 }
    };
    
    // Calculate distance between two points using Haversine formula
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 3440.065; // Radius of the earth in nautical miles
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // Distance in nautical miles
        return distance;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    function updateDistanceCalculation() {
        const origin = originAirportDist.value;
        const dest = destAirportDist.value;
        
        if (origin && dest && airportCoordinates[origin] && airportCoordinates[dest]) {
            const distance = calculateDistance(
                airportCoordinates[origin].lat, airportCoordinates[origin].lon,
                airportCoordinates[dest].lat, airportCoordinates[dest].lon
            );
            
            // Round to nearest whole number
            const nmDistance = Math.round(distance);
            const milesDistance = Math.round(distance * 1.15078);
            
            // Update the result
            distanceResult.textContent = `${nmDistance.toLocaleString()} NM (${milesDistance.toLocaleString()} miles)`;
            
            // Estimate flight time (assuming 450 kts ground speed)
            const flightHours = Math.floor(distance / 450);
            const flightMinutes = Math.round((distance / 450 - flightHours) * 60);
            distanceTime.textContent = `${flightHours}h ${flightMinutes}m`;
        }
    }
    
    // Add event listeners for distance calculator
    originAirportDist.addEventListener('change', updateDistanceCalculation);
    destAirportDist.addEventListener('change', updateDistanceCalculation);
    
    // Initialize with default values
    updateDistanceCalculation();
    
    // Fuel Calculator
    const aircraftType = document.getElementById('aircraft-type');
    const flightDistance = document.getElementById('flight-distance');
    const fuelResult = document.getElementById('fuel-result');
    
    if (aircraftType && flightDistance) {
        // Aircraft fuel consumption rates (gallons per nm)
        const aircraftFuelRates = {
            '737': 3.2,  // Boeing 737
            '777': 6.8,  // Boeing 777
            '787': 5.5,  // Boeing 787
            '320': 3.0,  // Airbus A320
            '330': 6.2   // Airbus A330
        };
        
        function updateFuelCalculation() {
            const aircraft = aircraftType.value;
            const distance = parseFloat(flightDistance.value);
            
            if (aircraft && !isNaN(distance) && aircraftFuelRates[aircraft]) {
                const fuelRate = aircraftFuelRates[aircraft];
                const fuelRequired = distance * fuelRate;
                
                fuelResult.textContent = `${Math.round(fuelRequired).toLocaleString()} gallons`;
            } else {
                fuelResult.textContent = 'Enter details';
            }
        }
        
        // Add event listeners for fuel calculator
        aircraftType.addEventListener('change', updateFuelCalculation);
        flightDistance.addEventListener('input', updateFuelCalculation);
    }
    
    // Time Calculator
    const departureTime = document.getElementById('departure-time');
    const flightDuration = document.getElementById('flight-duration');
    const timeResult = document.getElementById('time-result');
    
    if (departureTime && flightDuration) {
        function updateTimeCalculation() {
            const depTime = departureTime.value;
            const duration = parseFloat(flightDuration.value);
            
            if (depTime && !isNaN(duration)) {
                const [hours, minutes] = depTime.split(':').map(Number);
                const depMinutes = hours * 60 + minutes;
                const arrMinutes = depMinutes + (duration * 60);
                
                const arrHours = Math.floor(arrMinutes / 60) % 24;
                const arrMins = Math.round(arrMinutes % 60);
                
                const arrTime = `${arrHours.toString().padStart(2, '0')}:${arrMins.toString().padStart(2, '0')}`;
                timeResult.textContent = arrTime;
            } else {
                timeResult.textContent = 'Enter details';
            }
        }
        
        // Add event listeners for time calculator
        departureTime.addEventListener('change', updateTimeCalculation);
        flightDuration.addEventListener('input', updateTimeCalculation);
    }
}

// Calculator tab switching
function initCalculatorTabs() {
    const tabs = document.querySelectorAll('.calculator-tab');
    const contents = document.querySelectorAll('.calculator-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-calculator');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(`${target}-calculator`).classList.add('active');
        });
    });
}

// Theme handling
function initThemeHandling() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('airline-portal-theme') || 'light';
    applyTheme(savedTheme);
    
    function applyTheme(theme) {
        // Remove all theme classes
        body.classList.remove('dark-mode', 'aa-mode');
        themeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Apply selected theme
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            document.querySelector('.dark-theme').classList.add('active');
            darkModeToggle.checked = true;
        } else if (theme === 'aa') {
            body.classList.add('aa-mode');
            document.querySelector('.aa-theme').classList.add('active');
            darkModeToggle.checked = false;
        } else {
            document.querySelector('.light-theme').classList.add('active');
            darkModeToggle.checked = false;
        }
        
        // Save theme
        localStorage.setItem('airline-portal-theme', theme);
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
    
    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            if (darkModeToggle.checked) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        });
    }
}

// Time display updates
function updateTimeDisplay() {
    const now = new Date();
    
    // Local time
    if (localTimeElement) {
        localTimeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    if (localDateElement) {
        localDateElement.textContent = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
    
    // UTC time
    if (utcTimeElement) {
        utcTimeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
        });
    }
    
    if (utcDateElement) {
        utcDateElement.textContent = now.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC'
        });
    }
}

// Flight tracking simulation
function handleFlightTracking() {
    if (flightTrackerForm) {
        flightTrackerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const flightNumber = document.getElementById('flight-number').value;
            
            if (flightNumber) {
                showFlightStatus(flightNumber);
            }
        });
    }
}

function showFlightStatus(flightNumber) {
    // Simulate flight data
    const flightData = {
        flight: flightNumber.toUpperCase(),
        origin: 'DFW',
        destination: 'LAX',
        departure: '15:30',
        arrival: '17:45',
        status: 'On Time',
        gate: 'A15'
    };
    
    if (flightStatusContainer) {
        flightStatusContainer.innerHTML = `
            <div class="flight-header">
                <span class="flight-title">Flight ${flightData.flight}</span>
                <span class="flight-status">${flightData.status}</span>
            </div>
            <div class="flight-data">
                <div class="flight-info">
                    <div class="flight-info-label">Origin</div>
                    <div class="flight-info-value">${flightData.origin}</div>
                </div>
                <div class="flight-info">
                    <div class="flight-info-label">Destination</div>
                    <div class="flight-info-value">${flightData.destination}</div>
                </div>
                <div class="flight-info">
                    <div class="flight-info-label">Departure</div>
                    <div class="flight-info-value">${flightData.departure}</div>
                </div>
                <div class="flight-info">
                    <div class="flight-info-label">Arrival</div>
                    <div class="flight-info-value">${flightData.arrival}</div>
                </div>
            </div>
        `;
        flightStatusContainer.classList.add('show');
    }
}

// Airport information simulation
function handleAirportInfo() {
    if (airportInfoForm) {
        airportInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const airportCode = document.getElementById('airport-code').value;
            
            if (airportCode) {
                showAirportInfo(airportCode);
            }
        });
    }
}

function showAirportInfo(code) {
    const airports = {
        'DFW': {
            name: 'Dallas/Fort Worth International',
            city: 'Dallas, TX',
            timezone: 'Central Time (UTC-6)',
            weather: '75°F Partly Cloudy'
        },
        'LAX': {
            name: 'Los Angeles International',
            city: 'Los Angeles, CA',
            timezone: 'Pacific Time (UTC-8)',
            weather: '72°F Sunny'
        },
        'JFK': {
            name: 'John F. Kennedy International',
            city: 'New York, NY',
            timezone: 'Eastern Time (UTC-5)',
            weather: '68°F Overcast'
        }
    };
    
    const airport = airports[code.toUpperCase()];
    
    if (airportInfoContainer && airport) {
        airportInfoContainer.innerHTML = `
            <div class="airport-header">
                <h3>${code.toUpperCase()} - ${airport.name}</h3>
            </div>
            <div class="airport-data">
                <div class="airport-info">
                    <div class="airport-info-label">City</div>
                    <div class="airport-info-value">${airport.city}</div>
                </div>
                <div class="airport-info">
                    <div class="airport-info-label">Timezone</div>
                    <div class="airport-info-value">${airport.timezone}</div>
                </div>
                <div class="airport-info">
                    <div class="airport-info-label">Weather</div>
                    <div class="airport-info-value">${airport.weather}</div>
                </div>
            </div>
        `;
        airportInfoContainer.classList.add('show');
    }
}

// Quick links handling
function initQuickLinks() {
    const linkItems = document.querySelectorAll('.link-item');
    
    linkItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const url = item.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

// Modal handling
function initModals() {
    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Add link button
    if (addLinkBtn) {
        addLinkBtn.addEventListener('click', () => {
            if (addLinkModal) {
                addLinkModal.style.display = 'block';
            }
        });
    }
}

// Multi-search handling
function handleMultiSearch() {
    if (multiSearchForm) {
        multiSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = document.getElementById('search-query').value;
            
            if (query) {
                showNotification(`Searching for: ${query}`);
                // Here you would implement actual search functionality
            }
        });
    }
}

// Notification system
function showNotification(message, type = 'success') {
    if (notificationElement) {
        notificationElement.textContent = message;
        notificationElement.className = `notification ${type}`;
        notificationElement.style.display = 'block';
        
        setTimeout(() => {
            notificationElement.style.display = 'none';
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('✈️ Airline Staff Portal loaded successfully!');
    
    // Initialize all components
    setupPanels();
    initCalculatorSuite();
    initCalculatorTabs();
    initThemeHandling();
    handleFlightTracking();
    handleAirportInfo();
    initQuickLinks();
    initModals();
    handleMultiSearch();
    
    // Start time updates
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 1000);
    
    // Load saved settings
    const savedTheme = localStorage.getItem('airline-portal-theme');
    if (savedTheme && darkModeToggle) {
        darkModeToggle.checked = savedTheme === 'dark';
    }
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (installButton) {
        installButton.style.display = 'block';
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }
});