// Aviation Tools JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme handling
    initThemeHandling();
    
    console.log('✈️ Aviation Tools loaded successfully!');
});

// Theme Handling
function initThemeHandling() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Theme selector buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const themeClass = this.className.split(' ')[1];
            let theme = 'light';
            
            if (themeClass === 'dark-theme') theme = 'dark';
            else if (themeClass === 'aa-theme') theme = 'aa';
            
            applyTheme(theme);
            localStorage.setItem('theme', theme);
        });
    });
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update active state
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`.${theme}-theme`);
        if (activeBtn) activeBtn.classList.add('active');
    }
}

// Distance Calculator using Haversine formula
function calculateDistance() {
    const fromAirport = document.getElementById('fromAirport').value.trim().toUpperCase();
    const toAirport = document.getElementById('toAirport').value.trim().toUpperCase();
    const resultDiv = document.getElementById('distanceResult');
    
    if (!fromAirport || !toAirport) {
        showResult(resultDiv, 'Please enter both airport codes', 'error');
        return;
    }
    
    if (fromAirport.length !== 3 || toAirport.length !== 3) {
        showResult(resultDiv, 'Please enter valid 3-letter airport codes', 'error');
        return;
    }
    
    // Airport coordinates database (major airports)
    const airports = {
        'DFW': { lat: 32.8968, lon: -97.0380, name: 'Dallas/Fort Worth' },
        'LAX': { lat: 33.9425, lon: -118.4081, name: 'Los Angeles' },
        'JFK': { lat: 40.6413, lon: -73.7781, name: 'New York JFK' },
        'LGA': { lat: 40.7769, lon: -73.8740, name: 'New York LaGuardia' },
        'EWR': { lat: 40.6895, lon: -74.1745, name: 'Newark' },
        'ORD': { lat: 41.9742, lon: -87.9073, name: 'Chicago O\'Hare' },
        'MDW': { lat: 41.7868, lon: -87.7522, name: 'Chicago Midway' },
        'MIA': { lat: 25.7959, lon: -80.2870, name: 'Miami' },
        'ATL': { lat: 33.6407, lon: -84.4277, name: 'Atlanta' },
        'BOS': { lat: 42.3656, lon: -71.0096, name: 'Boston' },
        'SEA': { lat: 47.4502, lon: -122.3088, name: 'Seattle' },
        'SFO': { lat: 37.6213, lon: -122.3790, name: 'San Francisco' },
        'LAS': { lat: 36.0840, lon: -115.1537, name: 'Las Vegas' },
        'PHX': { lat: 33.4484, lon: -112.0740, name: 'Phoenix' },
        'DEN': { lat: 39.8561, lon: -104.6737, name: 'Denver' },
        'CLT': { lat: 35.2144, lon: -80.9473, name: 'Charlotte' },
        'PHL': { lat: 39.8744, lon: -75.2424, name: 'Philadelphia' },
        'IAH': { lat: 29.9902, lon: -95.3368, name: 'Houston Intercontinental' },
        'HOU': { lat: 29.6454, lon: -95.2789, name: 'Houston Hobby' },
        'MCO': { lat: 28.4312, lon: -81.3081, name: 'Orlando' }
    };
    
    const fromCoords = airports[fromAirport];
    const toCoords = airports[toAirport];
    
    if (!fromCoords || !toCoords) {
        showResult(resultDiv, 'Airport code not found in database', 'error');
        return;
    }
    
    const distance = haversineDistance(
        fromCoords.lat, fromCoords.lon,
        toCoords.lat, toCoords.lon
    );
    
    showResult(resultDiv, 
        `Distance: ${Math.round(distance)} NM<br>
         From: ${fromCoords.name} (${fromAirport})<br>
         To: ${toCoords.name} (${toAirport})`, 
        'success'
    );
}

// Haversine distance calculation
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3440.065; // Earth's radius in nautical miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Fuel Calculator
function calculateFuel() {
    const distance = parseFloat(document.getElementById('fuelDistance').value);
    const aircraftType = document.getElementById('aircraftType').value;
    const resultDiv = document.getElementById('fuelResult');
    
    if (!distance || distance <= 0) {
        showResult(resultDiv, 'Please enter a valid distance', 'error');
        return;
    }
    
    // Fuel consumption rates (gallons per nautical mile)
    const fuelRates = {
        '737': 4.2,
        '777': 6.8,
        '787': 5.1,
        '320': 3.9,
        '321': 4.3,
        '330': 6.2
    };
    
    const aircraftNames = {
        '737': 'Boeing 737',
        '777': 'Boeing 777',
        '787': 'Boeing 787',
        '320': 'Airbus A320',
        '321': 'Airbus A321',
        '330': 'Airbus A330'
    };
    
    const fuelRate = fuelRates[aircraftType];
    const fuelGallons = Math.round(distance * fuelRate);
    const fuelPounds = Math.round(fuelGallons * 6.7); // Approximate weight of jet fuel
    
    showResult(resultDiv, 
        `Estimated Fuel Required:<br>
         ${fuelGallons.toLocaleString()} gallons<br>
         ${fuelPounds.toLocaleString()} pounds<br>
         Aircraft: ${aircraftNames[aircraftType]}<br>
         Distance: ${distance.toLocaleString()} NM`, 
        'success'
    );
}

// Time Calculator
function calculateTime() {
    const distance = parseFloat(document.getElementById('timeDistance').value);
    const avgSpeed = parseFloat(document.getElementById('avgSpeed').value);
    const windComponent = parseFloat(document.getElementById('windComponent').value) || 0;
    const resultDiv = document.getElementById('timeResult');
    
    if (!distance || distance <= 0) {
        showResult(resultDiv, 'Please enter a valid distance', 'error');
        return;
    }
    
    if (!avgSpeed || avgSpeed <= 0) {
        showResult(resultDiv, 'Please enter a valid airspeed', 'error');
        return;
    }
    
    const groundSpeed = avgSpeed + windComponent; // Positive = tailwind, Negative = headwind
    
    if (groundSpeed <= 0) {
        showResult(resultDiv, 'Ground speed cannot be zero or negative', 'error');
        return;
    }
    
    const timeHours = distance / groundSpeed;
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    
    const windText = windComponent > 0 ? `${windComponent} kt tailwind` : 
                     windComponent < 0 ? `${Math.abs(windComponent)} kt headwind` : 
                     'No wind';
    
    showResult(resultDiv, 
        `Flight Time: ${hours}h ${minutes}m<br>
         Ground Speed: ${groundSpeed} knots<br>
         Wind: ${windText}<br>
         Distance: ${distance.toLocaleString()} NM`, 
        'success'
    );
}

// Weight & Balance Calculator
function calculateWeight() {
    const emptyWeight = parseFloat(document.getElementById('emptyWeight').value);
    const fuelWeight = parseFloat(document.getElementById('fuelWeight').value);
    const payload = parseFloat(document.getElementById('payload').value);
    const resultDiv = document.getElementById('weightResult');
    
    if (!emptyWeight || emptyWeight <= 0) {
        showResult(resultDiv, 'Please enter a valid empty weight', 'error');
        return;
    }
    
    if (!fuelWeight || fuelWeight < 0) {
        showResult(resultDiv, 'Please enter a valid fuel weight', 'error');
        return;
    }
    
    if (!payload || payload < 0) {
        showResult(resultDiv, 'Please enter a valid payload', 'error');
        return;
    }
    
    const totalWeight = emptyWeight + fuelWeight + payload;
    
    // Approximate MTOW for common aircraft (in pounds)
    const mtowLimits = {
        'light': 175000,  // 737, A320 class
        'heavy': 775000   // 777, A330 class
    };
    
    let status = 'Within limits';
    let statusClass = 'success';
    
    if (totalWeight > mtowLimits.light) {
        if (totalWeight > mtowLimits.heavy) {
            status = 'Exceeds heavy aircraft MTOW';
            statusClass = 'error';
        } else {
            status = 'Requires heavy aircraft';
            statusClass = 'success';
        }
    }
    
    showResult(resultDiv, 
        `Total Weight: ${totalWeight.toLocaleString()} lbs<br>
         Empty Weight: ${emptyWeight.toLocaleString()} lbs<br>
         Fuel Weight: ${fuelWeight.toLocaleString()} lbs<br>
         Payload: ${payload.toLocaleString()} lbs<br>
         Status: ${status}`, 
        statusClass
    );
}

// Utility function to show results
function showResult(element, message, type = 'success') {
    element.innerHTML = message;
    element.className = `result ${type}`;
}