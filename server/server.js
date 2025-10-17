const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from client directory
app.use(express.static(path.join(__dirname, '../client')));

// Rate limiting store
const requestCounts = new Map();
const RATE_LIMIT = 60; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Simple rate limiting middleware
function rateLimit(req, res, next) {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requestCounts.has(clientIP)) {
        requestCounts.set(clientIP, { count: 1, startTime: now });
        return next();
    }
    
    const clientData = requestCounts.get(clientIP);
    
    // Reset counter if window has passed
    if (now - clientData.startTime > RATE_LIMIT_WINDOW) {
        clientData.count = 1;
        clientData.startTime = now;
        return next();
    }
    
    // Check if over limit
    if (clientData.count >= RATE_LIMIT) {
        return res.status(429).json({
            error: 'Too many requests. Please try again later.'
        });
    }
    
    clientData.count++;
    next();
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV 
    });
});

// Current weather endpoint
app.get('/api/weather/current', rateLimit, async (req, res) => {
    try {
        const { city, units = 'metric' } = req.query;
        
        if (!city) {
            return res.status(400).json({
                error: 'City parameter is required'
            });
        }
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                error: errorData.message || 'Failed to fetch weather data'
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Current weather error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Forecast endpoint
app.get('/api/weather/forecast', rateLimit, async (req, res) => {
    try {
        const { city, units = 'metric' } = req.query;
        
        if (!city) {
            return res.status(400).json({
                error: 'City parameter is required'
            });
        }
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=${units}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                error: errorData.message || 'Failed to fetch forecast data'
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Forecast error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Weather by coordinates endpoint
app.get('/api/weather/coordinates', rateLimit, async (req, res) => {
    try {
        const { lat, lon, units = 'metric' } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                error: 'Latitude and longitude parameters are required'
            });
        }
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({
                error: errorData.message || 'Failed to fetch weather data'
            });
        }
        
        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('Coordinates weather error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Something went wrong!'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint not found'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔑 API Key: ${API_KEY ? 'Loaded' : 'Missing!'}`);
});

// Clean up rate limiting store periodically
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestCounts.entries()) {
        if (now - data.startTime > RATE_LIMIT_WINDOW) {
            requestCounts.delete(ip);
        }
    }
}, RATE_LIMIT_WINDOW);