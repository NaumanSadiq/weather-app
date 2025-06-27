import { useState } from "react";
import { Search, MapPin, Settings } from "lucide-react";
import WeatherDisplay from "./WeatherDisplay";
import SearchBar from "./SearchBar";
import { WeatherResponse, ForecastResponse } from "@shared/weather";

interface WeatherInterfaceProps {
  weather: WeatherResponse;
  forecast?: ForecastResponse;
  onSearch: (query: string) => void;
  onCurrentLocation: () => void;
  loading?: boolean;
}

export default function WeatherInterface({
  weather,
  forecast,
  onSearch,
  onCurrentLocation,
  loading = false,
}: WeatherInterfaceProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="relative">
      {/* Main Weather Display */}
      <WeatherDisplay weather={weather} forecast={forecast} />

      {/* Search Overlay Button */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-start justify-center pt-20">
          <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">
                Search Location
              </h3>
              <button
                onClick={() => setShowSearch(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <SearchBar
              onSearch={(query) => {
                onSearch(query);
                setShowSearch(false);
              }}
              onCurrentLocation={() => {
                onCurrentLocation();
                setShowSearch(false);
              }}
              loading={loading}
            />

            <div className="mt-4 text-center">
              <p className="text-white/60 text-sm">
                Search for any city worldwide or use your current location
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
