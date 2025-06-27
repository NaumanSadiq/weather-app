# Weather App

A beautiful, modern weather application built with React, TypeScript, and TailwindCSS. Get current weather conditions and a 7-day forecast for any location worldwide.

## Features

- 🌤️ **Current Weather**: Real-time weather conditions with detailed metrics
- 📅 **7-Day Forecast**: Extended weather predictions with daily highs and lows
- 📍 **Location Search**: Search weather by city name or coordinates
- 🎯 **Current Location**: Automatic weather detection using your current location
- 📱 **Responsive Design**: Beautiful UI that works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Glassmorphism design with gradient backgrounds and blur effects
- ⚡ **Fast & Reliable**: Built with modern web technologies for optimal performance

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS 4 with custom gradients
- **Icons**: Lucide React
- **API**: WeatherAPI.com
- **HTTP Client**: Axios

## Setup Instructions

1. **Clone and Install**

   ```bash
   npm install
   ```

2. **Get API Key**

   - Visit [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
   - Sign up for a free account
   - Get your API key from the dashboard

3. **Configure Environment**

   - Copy `.env.example` to `.env`
   - Add your WeatherAPI key:

   ```bash
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Usage

- **Automatic Location**: The app will request your location on first load
- **Manual Search**: Use the search bar to find weather for any city
- **Current Location Button**: Click the location icon to use your current position
- **7-Day Forecast**: Scroll down to see the extended forecast

## API Limits

The free WeatherAPI.com plan includes:

- 1 million calls per month
- Current weather data
- 3-day forecast (upgraded to 7-day in this app with paid plan)
- Weather alerts and astronomy data

## Architecture

```
client/
├── components/
│   ├── SearchBar.tsx        # Location search component
│   ├── WeatherCard.tsx      # Main weather display
│   └── ForecastCard.tsx     # 7-day forecast component
├── pages/
│   └── Index.tsx            # Main weather app page
└── global.css               # Weather app theme colors

shared/
└── weather.ts               # TypeScript types for weather API
```

## Features in Detail

### Current Weather Card

- Location name and country
- Current temperature with "feels like"
- Weather condition with appropriate icon
- Wind speed, humidity, visibility, and pressure
- Last updated timestamp

### 7-Day Forecast

- Daily weather icons
- High and low temperatures
- Weather conditions
- Chance of precipitation
- Responsive grid layout

### Search & Location

- City name search
- Coordinate-based search
- Geolocation API integration
- Error handling for location services

## Browser Support

- Modern browsers with ES6+ support
- Geolocation API support
- CSS Grid and Flexbox support

## License

This project is open source and available under the MIT License.
