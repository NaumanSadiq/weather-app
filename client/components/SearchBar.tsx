import { useState, useEffect, useRef } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";
import axios from "axios";
import { SearchLocation, SearchResponse } from "@shared/weather";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCurrentLocation: () => void;
  loading?: boolean;
}

export default function SearchBar({
  onSearch,
  onCurrentLocation,
  loading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const searchLocations = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearching(true);
    try {
      const response = await axios.get(
        "https://api.weatherapi.com/v1/search.json",
        {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: searchQuery,
          },
        },
      );
      const locations: SearchResponse = response.data;
      setSuggestions(locations.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(locations.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error("Search error:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearching(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectLocation(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Select a location from suggestions
  const selectLocation = (location: SearchLocation) => {
    const locationString = `${location.name}, ${location.region}, ${location.country}`;
    setQuery(locationString);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(locationString);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto mb-6 sm:mb-8 relative">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 sm:w-5 sm:h-5 z-10" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            placeholder="Search for a city..."
            className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-lg pl-8 sm:pl-10 pr-8 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all duration-200"
            disabled={loading}
            autoComplete="off"
          />
          {searching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white/60 rounded-full animate-spin"></div>
            </div>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 w-3 h-3 sm:w-4 sm:h-4" />
          )}
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-2.5 sm:p-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          type="button"
          onClick={onCurrentLocation}
          disabled={loading}
          className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg p-2.5 sm:p-3 text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-12 sm:right-16 mt-2 bg-white/95 backdrop-blur-md border border-white/30 rounded-lg shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <div
              key={`${location.lat}-${location.lon}`}
              onClick={() => selectLocation(location)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 cursor-pointer transition-all duration-200 border-b border-gray-200/20 last:border-b-0 ${
                index === selectedIndex
                  ? "bg-blue-500/20 text-blue-900"
                  : "text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              <div className="font-medium text-xs sm:text-sm">
                {location.name}
                {location.region && (
                  <span className="font-normal text-gray-600">
                    , {location.region}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {location.country}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
