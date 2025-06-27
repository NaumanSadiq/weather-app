import { useEffect, useState } from "react";
import axios from "axios";
import { WeatherResponse, ForecastResponse } from "@shared/weather";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import ForecastCard from "../components/ForecastCard";
import { AlertCircle, Loader2 } from "lucide-react";

export default function Index() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const fetchWeather = async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch current weather and forecast in parallel
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get("https://api.weatherapi.com/v1/current.json", {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: location,
            aqi: "no",
          },
        }),
        axios.get("https://api.weatherapi.com/v1/forecast.json", {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: location,
            days: 7,
            aqi: "no",
            alerts: "no",
          },
        }),
      ]);

      setWeather(currentResponse.data);
      setForecast(forecastResponse.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError("Location not found. Please try a different search.");
        } else if (err.response?.status === 401) {
          setError("API key is invalid. Please check your configuration.");
        } else if (err.response?.status === 403) {
          setError("API quota exceeded. Please try again later.");
        } else {
          setError("Failed to fetch weather data. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
          setShowFallback(true);
          setError("Unable to get your location. Please search manually.");
        },
        {
          timeout: 10000,
          enableHighAccuracy: true,
        },
      );
    } else {
      setLoading(false);
      setShowFallback(true);
      setError("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    // Try to get current location on mount
    getCurrentLocation();
  }, []);

  const handleSearch = (query: string) => {
    fetchWeather(query);
  };

  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-blue-600/20"></div>
      <div
        className={
          'absolute top-0 left-0 w-full h-full bg-[url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')] opacity-30'
        }
      ></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-light text-white mb-2 drop-shadow-lg">
                Weather App
              </h1>
              <p className="text-white/80 text-lg">
                Get current weather and 7-day forecast
              </p>
            </div>

            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              onCurrentLocation={handleCurrentLocation}
              loading={loading}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                <p className="text-white/80 text-lg">Getting weather data...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-300/30 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-100 mb-1">
                      Unable to get weather data
                    </h3>
                    <p className="text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Weather Content */}
            {weather && !loading && (
              <div className="space-y-6">
                <WeatherCard weather={weather} />
                {forecast && (
                  <ForecastCard forecast={forecast.forecast.forecastday} />
                )}
              </div>
            )}

            {/* Initial State */}
            {!weather && !loading && !error && showFallback && (
              <div className="text-center py-12">
                <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-8 max-w-md mx-auto">
                  <h3 className="text-2xl font-light text-white mb-4">
                    Welcome to Weather App
                  </h3>
                  <p className="text-white/80 mb-6">
                    Search for a city or use your current location to get
                    started.
                  </p>
                  <button
                    onClick={handleCurrentLocation}
                    className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-6 py-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
                  >
                    Use Current Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 py-6 text-center text-white/60">
          <p>Powered by WeatherAPI.com</p>
        </footer>
      </div>
    </div>
  );
}
