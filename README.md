# Weather Dashboard 🌤️

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![OpenWeatherMap](https://img.shields.io/badge/API-OpenWeatherMap-blue)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

A beautiful, responsive weather dashboard with **server-side API protection**.

---

## 🚀 Features

- 🌡️ **Current weather conditions**
- 📅 **5-day weather forecast**
- 🌍 **Global city search**
- 🔄 **Celsius/Fahrenheit toggle**
- 📱 **Fully responsive design**
- 🔒 **Server-side API key protection**
- ⚡ **Rate limiting**
- 📚 **Search history**

---

## 🧩 Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Responsive design

**Backend:**
- Node.js + Express.js
- Environment variables
- Rate limiting
- CORS protection

---

## 🗂️ Project Structure

```bash
weather-dashboard/
├── client/
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── server/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adebayo-makemoney/weather-dashboard.git
   cd weather-dashboard
   ```

2. **Setup the server**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API key
   ```

4. **Start the server ensuring that you are hosting it on the server file path**

   e.g cd C:\Users\REX\Desktop\weather-dashboard\server

   ```bash
   cd C:\your_server_file_path
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `server/.env` file with the following:

```env
PORT=3000
OPENWEATHER_API_KEY=your_api_key_here
NODE_ENV=development
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/weather/current?city=London` | Current weather |
| GET | `/api/weather/forecast?city=London` | 5-day forecast |
| GET | `/api/weather/coordinates?lat=51.5074&lon=0.1278` | Weather by coordinates |

---

## 🛡️ Security Features

✅ API key protection (server-side only)  
✅ Rate limiting (60 requests/minute)  
✅ Input validation  
✅ CORS configuration  
✅ Error handling without sensitive data exposure  

---

## 🤝 Contributing

1. Fork the project  
2. Create your feature branch  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch  
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/api) — for weather data API  
- [Font Awesome](https://fontawesome.com/) — for icons

---

## 🧰 .env.example Template

```env
# Server Configuration
PORT=3000

# OpenWeatherMap API Key
# Get your free API key from: https://openweathermap.org/api
OPENWEATHER_API_KEY=your_api_key_here

# Environment
NODE_ENV=development
```

---

## 🪄 Git Setup & Push Instructions

```bash
# Stage and commit files
git add .
git commit -m "Initial commit: Weather dashboard with server-side API protection"

# Add your GitHub remote (if not set)
git remote add origin https://github.com/YOUR_USERNAME/weather-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

✅ **Safe to push:**  
- `server/.env.example`  
- `server/package.json`  
- All client files  
- `README.md`  
- `.gitignore`  

❌ **Never push:**  
- `server/.env` (with real API key)  
- `server/node_modules/`  
- Any file with actual API keys  
