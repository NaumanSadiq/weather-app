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
          console.error("Geolocation error details:", {
            code: error.code,
            message: error.message,
            PERMISSION_DENIED: error.PERMISSION_DENIED,
            POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
            TIMEOUT: error.TIMEOUT,
          });

          setLoading(false);
          setShowFallback(true);

          let errorMessage =
            "Unable to get your location. Please search manually.";

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage =
                "Location access was denied. Please enable location access in your browser settings or search manually.";
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage =
                "Location information is unavailable. Please check your connection or search manually.";
              break;
            case 3: // TIMEOUT
              errorMessage =
                "Location request timed out. Please try again or search manually.";
              break;
            default:
              errorMessage = `Location error (Code ${error.code}): ${error.message || "Unknown error"}. Please search manually.`;
              break;
          }

          setError(errorMessage);
        },
        {
          timeout: 15000,
          enableHighAccuracy: false,
          maximumAge: 300000, // 5 minutes
        },
      );
    } else {
      setLoading(false);
      setShowFallback(true);
      setError(
        "Geolocation is not supported by your browser. Please search manually.",
      );
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 via-purple-700 to-blue-800 relative overflow-hidden">
      {/* Dynamic Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 via-transparent to-blue-300/20"></div>

      {/* Animated Clouds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-20 bg-white/10 rounded-full blur-xl animate-pulse opacity-60"></div>
        <div
          className="absolute top-32 right-20 w-40 h-24 bg-white/8 rounded-full blur-xl animate-pulse opacity-50"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-16 left-1/3 w-28 h-16 bg-white/12 rounded-full blur-xl animate-pulse opacity-40"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-40 right-1/3 w-36 h-22 bg-white/6 rounded-full blur-xl animate-pulse opacity-70"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating Weather Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Raindrops */}
        <div
          className="absolute top-0 left-1/4 w-0.5 h-8 bg-gradient-to-b from-white/30 to-transparent animate-bounce opacity-60"
          style={{ animationDuration: "2s", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-0 left-1/2 w-0.5 h-6 bg-gradient-to-b from-white/25 to-transparent animate-bounce opacity-50"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-0 left-3/4 w-0.5 h-7 bg-gradient-to-b from-white/20 to-transparent animate-bounce opacity-40"
          style={{ animationDuration: "2.2s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-0 left-1/6 w-0.5 h-5 bg-gradient-to-b from-white/35 to-transparent animate-bounce opacity-55"
          style={{ animationDuration: "2.8s", animationDelay: "1.5s" }}
        ></div>

        {/* Snowflakes */}
        <div
          className="absolute top-10 right-1/4 w-2 h-2 bg-white/40 rounded-full animate-ping opacity-70"
          style={{ animationDuration: "3s", animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-20 right-1/2 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping opacity-50"
          style={{ animationDuration: "3.5s", animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-32 right-3/4 w-1 h-1 bg-white/35 rounded-full animate-ping opacity-60"
          style={{ animationDuration: "4s", animationDelay: "2s" }}
        ></div>
      </div>

      {/* Atmospheric Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent via-transparent to-blue-900/10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-400/5 to-transparent"></div>

      {/* Subtle Weather Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Aurora Effect */}
      <div
        className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-green-400/10 via-blue-400/5 to-transparent opacity-60 animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>

      {/* Stars */}
      <div className="absolute inset-0">
        <div className="absolute top-16 left-16 w-1 h-1 bg-white rounded-full animate-pulse opacity-80"></div>
        <div
          className="absolute top-24 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-60"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-40 left-40 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-70"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse opacity-50"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-20 left-2/3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-90"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-44 right-2/3 w-1 h-1 bg-white rounded-full animate-pulse opacity-60"
          style={{ animationDelay: "2.5s" }}
        ></div>
      </div>

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
