// Server Configuration
const SERVER_URL = 'http://localhost:3000/api';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const celsiusBtn = document.getElementById('celsius-btn');
const fahrenheitBtn = document.getElementById('fahrenheit-btn');
const weatherContent = document.getElementById('weather-content');
const historyList = document.getElementById('history-list');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const debugInfo = document.getElementById('debug-info');

// State
let currentUnit = 'metric';
let searchHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
    updateDate();
    displaySearchHistory();
    
    // Set up event listeners
    searchBtn.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Demo cities
    document.querySelectorAll('.demo-city').forEach(city => {
        city.addEventListener('click', () => {
            getWeatherByCity(city.getAttribute('data-city'));
        });
    });

    // Unit toggle
    celsiusBtn.addEventListener('click', () => switchUnit('metric'));
    fahrenheitBtn.addEventListener('click', () => switchUnit('imperial'));

    // Test server connection
    await testServerConnection();
    
    // Load weather for default city
    getWeatherByCity('London');
});

// Test server connection
async function testServerConnection() {
    try {
        const response = await fetch(`${SERVER_URL}/health`);
        if (!response.ok) throw new Error('Server not responding');
        console.log('✅ Server connection successful');
    } catch (error) {
        console.error('❌ Server connection failed:', error);
        showError('Server connection failed. Please make sure the server is running.');
    }
}

// Update current date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return now.toLocaleDateString('en-US', options);
}

// Handle search
function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
        cityInput.value = '';
    }
}

// Switch temperature unit
function switchUnit(unit) {
    if (currentUnit === unit) return;
    
    currentUnit = unit;
    
    // Update toggle buttons
    if (unit === 'metric') {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        celsiusBtn.classList.remove('active');
        fahrenheitBtn.classList.add('active');
    }
    
    // Refresh current weather with new unit
    if (searchHistory.length > 0) {
        getWeatherByCity(searchHistory[0]);
    }
}

// Get weather by city name using our server
async function getWeatherByCity(city) {
    showLoading();
    hideError();
    hideDebugInfo();
    
    try {
        console.log(`Fetching weather for: ${city}`);
        
        // Fetch current weather from our server
        const currentWeatherResponse = await fetch(
            `${SERVER_URL}/weather/current?city=${encodeURIComponent(city)}&units=${currentUnit}`
        );
        
        console.log('Response status:', currentWeatherResponse.status);
        
        if (!currentWeatherResponse.ok) {
            const errorData = await currentWeatherResponse.json();
            throw new Error(errorData.error || 'Failed to fetch weather data');
        }
        
        const currentWeatherData = await currentWeatherResponse.json();
        
        // Fetch forecast from our server
        const forecastResponse = await fetch(
            `${SERVER_URL}/weather/forecast?city=${encodeURIComponent(city)}&units=${currentUnit}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error('Forecast not available');
        }
        
        const forecastData = await forecastResponse.json();
        
        // Update UI
        updateWeatherDisplay(currentWeatherData, forecastData);
        addToSearchHistory(city);
        
        hideLoading();
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        hideLoading();
        showError(error.message);
        showDebugInfo(error);
    }
}

// Get weather by coordinates (for geolocation feature)
async function getWeatherByCoordinates(lat, lon) {
    showLoading();
    hideError();
    
    try {
        const response = await fetch(
            `${SERVER_URL}/weather/coordinates?lat=${lat}&lon=${lon}&units=${currentUnit}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch weather data');
        }
        
        const data = await response.json();
        
        // Fetch forecast as well
        const forecastResponse = await fetch(
            `${SERVER_URL}/weather/forecast?city=${encodeURIComponent(data.name)}&units=${currentUnit}`
        );
        
        const forecastData = await forecastResponse.ok ? await forecastResponse.json() : null;
        
        updateWeatherDisplay(data, forecastData);
        addToSearchHistory(data.name);
        hideLoading();
        
    } catch (error) {
        console.error('Error fetching weather by coordinates:', error);
        hideLoading();
        showError(error.message);
    }
}

// Update weather display
function updateWeatherDisplay(currentData, forecastData) {
    const weatherHTML = `
        <div class="current-weather">
            <div class="location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${currentData.name}, ${currentData.sys.country}</span>
            </div>
            <div class="date">${updateDate()}</div>
            
            <div class="weather-main">
                <div class="temperature-section">
                    <div class="temperature">${Math.round(currentData.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
                    <div class="weather-desc">${currentData.weather[0].description}</div>
                </div>
                <div class="weather-icon">
                    ${getWeatherIcon(currentData.weather[0].icon)}
                </div>
            </div>

            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">Feels Like</div>
                    <div class="detail-value">${Math.round(currentData.main.feels_like)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${currentData.main.humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${Math.round(currentData.wind.speed)} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${currentData.main.pressure} hPa</div>
                </div>
            </div>
        </div>
        ${forecastData ? generateForecastHTML(forecastData) : ''}
    `;
    
    weatherContent.innerHTML = weatherHTML;
    updateBackground(currentData.weather[0].main);
}

// Generate forecast HTML
function generateForecastHTML(forecastData) {
    const dailyForecasts = [];
    for (let i = 0; i < forecastData.list.length; i += 8) {
        dailyForecasts.push(forecastData.list[i]);
    }
    
    const forecastCards = dailyForecasts.map(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        return `
            <div class="forecast-card">
                <div class="forecast-day">${day}</div>
                <div class="forecast-icon">${getWeatherIcon(forecast.weather[0].icon)}</div>
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°${currentUnit === 'metric' ? 'C' : 'F'}</div>
                <div class="forecast-desc">${forecast.weather[0].description}</div>
            </div>
        `;
    }).join('');
    
    return `
        <h2 style="text-align: center; margin-bottom: 20px;">5-Day Forecast</h2>
        <div class="forecast">
            ${forecastCards}
        </div>
    `;
}

// Get appropriate weather icon
function getWeatherIcon(iconCode) {
    const iconMap = {
        '01d': 'fas fa-sun',
        '01n': 'fas fa-moon',
        '02d': 'fas fa-cloud-sun',
        '02n': 'fas fa-cloud-moon',
        '03d': 'fas fa-cloud',
        '03n': 'fas fa-cloud',
        '04d': 'fas fa-cloud',
        '04n': 'fas fa-cloud',
        '09d': 'fas fa-cloud-rain',
        '09n': 'fas fa-cloud-rain',
        '10d': 'fas fa-cloud-sun-rain',
        '10n': 'fas fa-cloud-moon-rain',
        '11d': 'fas fa-bolt',
        '11n': 'fas fa-bolt',
        '13d': 'fas fa-snowflake',
        '13n': 'fas fa-snowflake',
        '50d': 'fas fa-smog',
        '50n': 'fas fa-smog'
    };
    
    return `<i class="${iconMap[iconCode] || 'fas fa-cloud'}"></i>`;
}

// Update background based on weather
function updateBackground(weatherCondition) {
    const body = document.body;
    
    const gradients = {
        'Clear': 'linear-gradient(135deg, #74b9ff, #0984e3)',
        'Clouds': 'linear-gradient(135deg, #b2bec3, #636e72)',
        'Rain': 'linear-gradient(135deg, #636e72, #2d3436)',
        'Drizzle': 'linear-gradient(135deg, #74b9ff, #636e72)',
        'Thunderstorm': 'linear-gradient(135deg, #2d3436, #000000)',
        'Snow': 'linear-gradient(135deg, #dfe6e9, #b2bec3)',
        'Mist': 'linear-gradient(135deg, #dfe6e9, #b2bec3)',
        'Fog': 'linear-gradient(135deg, #dfe6e9, #b2bec3)',
        'Default': 'linear-gradient(135deg, #74b9ff, #0984e3)'
    };
    
    body.style.background = gradients[weatherCondition] || gradients['Default'];
}

// Add city to search history
function addToSearchHistory(city) {
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
    searchHistory.unshift(city);
    
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    
    localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory));
    displaySearchHistory();
}

// Display search history
function displaySearchHistory() {
    historyList.innerHTML = '';
    
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = city;
        historyItem.addEventListener('click', () => getWeatherByCity(city));
        
        historyList.appendChild(historyItem);
    });
}

// UI Helper Functions
function showLoading() {
    loading.style.display = 'block';
    weatherContent.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    weatherContent.style.display = 'block';
}

function showError(message) {
    errorMessage.innerHTML = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showDebugInfo(error) {
    debugInfo.innerHTML = `
        <strong>Debug Information:</strong><br>
        Error: ${error.message}<br>
        Server: ${SERVER_URL}<br>
        Time: ${new Date().toLocaleString()}<br>
        <small>Check browser console for more details</small>
    `;
    debugInfo.style.display = 'block';
}

function hideDebugInfo() {
    debugInfo.style.display = 'none';
}

// Geolocation function (optional feature)
function getLocationWeather() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoordinates(latitude, longitude);
        },
        (error) => {
            showError('Unable to retrieve your location');
            console.error('Geolocation error:', error);
        }
    );
}