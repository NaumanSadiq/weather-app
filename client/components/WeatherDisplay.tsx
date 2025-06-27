import { useState } from "react";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Eye,
  Droplets,
  Thermometer,
  ChevronDown,
  MapPin,
} from "lucide-react";
import { WeatherResponse, ForecastResponse } from "@shared/weather";
import { getWeatherTheme } from "./WeatherThemes";

interface WeatherDisplayProps {
  weather: WeatherResponse;
  forecast?: ForecastResponse;
}

const getWeatherIcon = (condition: string, size: "sm" | "md" | "lg" = "md") => {
  const conditionLower = condition.toLowerCase();
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  const iconClass = `${sizeClasses[size]} text-white drop-shadow-lg`;

  if (conditionLower.includes("thunder")) {
    return (
      <div className="relative">
        <Cloud className={iconClass} />
        <div className="absolute top-2 left-2 w-2 h-6 bg-yellow-300 lightning-bolt opacity-80"></div>
      </div>
    );
  }
  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return <CloudRain className={iconClass} />;
  }
  if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
    return <CloudSnow className={iconClass} />;
  }
  if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return <Cloud className={iconClass} />;
  }
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return <Sun className={iconClass} />;
  }

  return <Sun className={iconClass} />;
};

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  return date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

const getHourlyTimes = () => {
  const times = [];
  const now = new Date();

  for (let i = 0; i < 9; i++) {
    const hour = new Date(now.getTime() + i * 3600000);
    times.push(
      hour.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    );
  }
  return times;
};

export default function WeatherDisplay({
  weather,
  forecast,
}: WeatherDisplayProps) {
  const [selectedLocation, setSelectedLocation] = useState(false);
  const theme = getWeatherTheme(weather.current.condition.text);
  const hourlyTimes = getHourlyTimes();

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${theme.background} relative overflow-hidden`}
    >
      {/* Dynamic Background Effects based on weather */}
      {theme.effects.lightning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-1/4 w-1 h-32 bg-gradient-to-b from-white/90 via-purple-200/70 to-transparent lightning-flash opacity-0"></div>
          <div
            className="absolute top-16 left-1/3 w-0.5 h-28 bg-gradient-to-b from-white/80 via-yellow-200/60 to-transparent lightning-flash opacity-0"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>
      )}

      {/* Rain Effects */}
      {theme.effects.rain && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              className={`absolute top-0 w-0.5 bg-gradient-to-b from-white/40 via-blue-200/60 to-transparent rain-drop opacity-70`}
              style={{
                left: `${(i + 1) * 6}%`,
                height: `${12 + Math.random() * 8}px`,
                animationDuration: `${1.2 + Math.random() * 0.8}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Sun Effects */}
      {theme.effects.sun && (
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-radial from-yellow-200/30 via-orange-200/15 to-transparent rounded-full blur-3xl sun-glow opacity-80"></div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Weather Card */}
          <div
            className={`${theme.cardBg} backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl`}
          >
            {/* Header with Location */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setSelectedLocation(!selectedLocation)}
                className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span className="text-lg">
                  {weather.location.name}, {weather.location.country}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Side - Current Weather & Daily Forecast */}
              <div className="space-y-8">
                {/* Current Weather */}
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    {getWeatherIcon(weather.current.condition.text, "lg")}
                  </div>
                  <div>
                    <div
                      className={`text-6xl font-thin ${theme.primaryText} mb-1`}
                    >
                      {Math.round(weather.current.temp_c)}°
                    </div>
                    <div className={`text-lg ${theme.secondaryText}`}>
                      Feels like {Math.round(weather.current.feelslike_c)}°
                    </div>
                  </div>
                </div>

                {/* 10-Day Forecast */}
                <div>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-4 h-4 bg-white/60 rounded-sm flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-600 rounded-sm"></div>
                    </div>
                    <h3
                      className={`text-sm font-medium ${theme.secondaryText}`}
                    >
                      10-Day Forecast
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {forecast?.forecast.forecastday
                      .slice(0, 7)
                      .map((day, index) => (
                        <div
                          key={day.date}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div
                              className={`text-sm font-medium ${theme.primaryText} w-12`}
                            >
                              {getDayName(day.date)}
                            </div>
                            <div className="flex items-center space-x-2">
                              {getWeatherIcon(day.day.condition.text, "sm")}
                              <span
                                className={`text-sm ${theme.secondaryText} w-4`}
                              >
                                {day.day.daily_chance_of_rain}%
                              </span>
                            </div>
                          </div>

                          {/* Temperature Range Bar */}
                          <div className="flex items-center space-x-3 flex-1 justify-end">
                            <span
                              className={`text-sm ${theme.secondaryText} w-8 text-right`}
                            >
                              {Math.round(day.day.mintemp_c)}°
                            </span>
                            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-red-400 rounded-full"
                                style={{ width: "70%" }}
                              ></div>
                            </div>
                            <span
                              className={`text-sm ${theme.primaryText} w-8`}
                            >
                              {Math.round(day.day.maxtemp_c)}°
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Weather Forecast & Hourly */}
              <div className="space-y-8">
                {/* Weather Forecast Header */}
                <div>
                  <h2
                    className={`text-sm font-medium ${theme.secondaryText} mb-2`}
                  >
                    Weather Forecast
                  </h2>
                  <h1
                    className={`text-4xl font-light ${theme.primaryText} capitalize`}
                  >
                    {weather.current.condition.text}
                  </h1>
                </div>

                {/* Hourly Forecast */}
                <div>
                  <div className="grid grid-cols-9 gap-3">
                    {hourlyTimes.map((time, index) => {
                      // Simulate hourly data (in real app, this would come from API)
                      const temp = Math.round(
                        weather.current.temp_c + (Math.random() - 0.5) * 6,
                      );
                      const condition =
                        index < 3
                          ? weather.current.condition.text
                          : index < 6
                            ? "Partly cloudy"
                            : "Clear";

                      return (
                        <div key={time} className="text-center space-y-3">
                          <div className={`text-xs ${theme.secondaryText}`}>
                            {time}
                          </div>
                          <div className="flex justify-center">
                            {getWeatherIcon(condition, "sm")}
                          </div>
                          <div
                            className={`text-sm font-medium ${theme.primaryText}`}
                          >
                            {temp}°
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Weather Details */}
                <div className="grid grid-cols-2 gap-6 pt-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Wind className={`w-4 h-4 ${theme.accentColor}`} />
                        <span className={`text-sm ${theme.secondaryText}`}>
                          Wind
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${theme.primaryText}`}
                      >
                        {weather.current.wind_kph} km/h
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className={`w-4 h-4 ${theme.accentColor}`} />
                        <span className={`text-sm ${theme.secondaryText}`}>
                          Humidity
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${theme.primaryText}`}
                      >
                        {weather.current.humidity}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className={`w-4 h-4 ${theme.accentColor}`} />
                        <span className={`text-sm ${theme.secondaryText}`}>
                          Visibility
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${theme.primaryText}`}
                      >
                        {weather.current.vis_km} km
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Thermometer
                          className={`w-4 h-4 ${theme.accentColor}`}
                        />
                        <span className={`text-sm ${theme.secondaryText}`}>
                          Pressure
                        </span>
                      </div>
                      <span
                        className={`text-sm font-medium ${theme.primaryText}`}
                      >
                        {weather.current.pressure_mb} mb
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
