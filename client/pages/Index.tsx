import { useEffect, useState } from "react";
import axios from "axios";
import { WeatherResponse, ForecastResponse } from "@shared/weather";
import SearchBar from "../components/SearchBar";
import WeatherInterface from "../components/WeatherInterface";
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
    // Try to get current location on mount with better error handling
    const initializeLocation = () => {
      if ("geolocation" in navigator) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather(`${latitude},${longitude}`);
          },
          (error) => {
            console.error("Initial geolocation error:", {
              code: error.code,
              message: error.message,
            });
            setLoading(false);
            setShowFallback(true);
            // Don't set error on initial load, just show fallback
          },
          {
            timeout: 10000,
            enableHighAccuracy: false,
            maximumAge: 600000, // 10 minutes
          },
        );
      } else {
        setShowFallback(true);
      }
    };

    initializeLocation();
  }, []);

  const handleSearch = (query: string) => {
    fetchWeather(query);
  };

  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  // If we have weather data, show the full WeatherInterface component
  if (weather && !loading) {
    return (
      <WeatherInterface
        weather={weather}
        forecast={forecast}
        onSearch={handleSearch}
        onCurrentLocation={handleCurrentLocation}
        loading={loading}
      />
    );
  }

  // Otherwise, show the search interface with dark background
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Simple background for search interface */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-transparent to-slate-700/20"></div>

      {/* Subtle animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-20 bg-white/5 rounded-full blur-xl animate-pulse opacity-60"></div>
        <div
          className="absolute top-32 right-20 w-40 h-24 bg-white/3 rounded-full blur-xl animate-pulse opacity-50"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-28 h-16 bg-white/4 rounded-full blur-xl animate-pulse opacity-40"
          style={{ animationDelay: "4s" }}
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
                &nbsp;Stay One Step Ahead of the Clouds{' '}
                <span className="cloud-thunder">⛈️</span>
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
          <p>Powered by Nauman Sadiq</p>
        </footer>
      </div>
    </div>
  );
}
