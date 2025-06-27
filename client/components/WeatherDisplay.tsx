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
      className={`min-h-screen bg-gradient-to-br ${theme.background} relative overflow-hidden weather-card`}
    >
      {/* Enhanced Lightning Effects for Thunderstorm */}
      {theme.effects.lightning && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Main Lightning Bolts */}
          <svg className="absolute top-0 right-0 w-full h-full opacity-80">
            <path
              d="M 80 10 L 120 80 L 100 80 L 140 150 L 90 90 L 110 90 L 70 20 Z"
              fill="url(#lightning-gradient)"
              className="lightning-flash"
            />
            <path
              d="M 60 30 L 90 100 L 75 100 L 110 170 L 70 110 L 85 110 L 55 40 Z"
              fill="url(#lightning-gradient)"
              className="lightning-flash"
              style={{ animationDelay: "2s" }}
            />
            <defs>
              <linearGradient
                id="lightning-gradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Rain Effects */}
      {theme.effects.rain && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 w-0.5 bg-gradient-to-b from-white/50 via-purple-200/40 to-transparent rain-drop opacity-60"
              style={{
                left: `${(i + 1) * 4.5}%`,
                height: `${10 + Math.random() * 12}px`,
                animationDuration: `${1.0 + Math.random() * 1.0}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Weather Card */}
          <div className="bg-purple-900/30 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            {/* Header with Location */}
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {weather.location.name}, {weather.location.country}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Column - Current Weather & Daily Forecast */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-6">
                {/* Current Weather */}
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="flex-shrink-0 weather-icon">
                    {getWeatherIcon(weather.current.condition.text, "lg")}
                  </div>
                  <div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-thin text-white mb-1 temperature-display">
                      {Math.round(weather.current.temp_c)}°
                    </div>
                    <div className="text-xs sm:text-sm text-white/70">
                      Feels like {Math.round(weather.current.feelslike_c)}°
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Droplets className="w-3 h-3 text-white/60" />
                        <span className="text-xs text-white/70">
                          {weather.current.humidity}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wind className="w-3 h-3 text-white/60" />
                        <span className="text-xs text-white/70">
                          {weather.current.wind_kph} km/h
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Forecast */}
                <div className="mt-6 sm:mt-8">
                  <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                    <div className="w-3 h-3 bg-white/40 rounded-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-sm"></div>
                    </div>
                    <h3 className="text-xs font-medium text-white/60 uppercase tracking-wide">
                      30-Day Monthly Forecast
                    </h3>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                    {Array.from({ length: 30 }, (_, index) => {
                      const date = new Date();
                      date.setDate(date.getDate() + index);

                      const dayName =
                        index === 0
                          ? "Today"
                          : index === 1
                            ? "Tomorrow"
                            : date
                                .toLocaleDateString("en-US", {
                                  weekday: "short",
                                })
                                .toUpperCase();

                      const dateString = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });

                      // Simulate realistic weather variations
                      const baseTemp = weather.current.temp_c;
                      const minTemp = Math.round(
                        baseTemp - 5 + Math.random() * 8,
                      );
                      const maxTemp = Math.round(
                        baseTemp + 3 + Math.random() * 8,
                      );
                      const rainChance = Math.round(10 + Math.random() * 40);

                      return {
                        day: dayName,
                        date: dateString,
                        min: minTemp,
                        max: maxTemp,
                        rain: rainChance,
                        humidity: Math.round(40 + Math.random() * 40),
                      };
                    }).map((item, index) => (
                      <div
                        key={item.day}
                        className="flex items-center justify-between py-1.5 sm:py-1 forecast-item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                          <div className="text-xs font-medium text-white w-10 sm:w-12">
                            {item.day}
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {getWeatherIcon(
                              weather.current.condition.text,
                              "sm",
                            )}
                            <span className="text-xs text-white/60 w-6 hidden sm:inline">
                              {item.rain}%
                            </span>
                          </div>
                        </div>

                        {/* Temperature Range Bar */}
                        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-1 justify-end">
                          <span className="text-xs text-white/60 w-5 sm:w-6 text-right">
                            {item.min}°
                          </span>
                          <div className="w-12 sm:w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                          <span className="text-xs text-white w-5 sm:w-6">
                            {item.max}°
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Weather Forecast & Hourly */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-8">
                {/* Weather Forecast Header */}
                <div className="text-center lg:text-right">
                  <h2 className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">
                    Weather Forecast
                  </h2>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white capitalize">
                    {weather.current.condition.text}
                  </h1>
                </div>

                {/* Hourly Forecast */}
                <div className="mt-6 sm:mt-8 lg:mt-12">
                  <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-9 gap-2 sm:gap-3">
                    {[
                      {
                        time: "18:00",
                        temp: 20,
                        icon: weather.current.condition.text,
                      },
                      {
                        time: "19:00",
                        temp: 19,
                        icon: weather.current.condition.text,
                      },
                      {
                        time: "20:00",
                        temp: 19,
                        icon: weather.current.condition.text,
                      },
                      {
                        time: "21:00",
                        temp: 18,
                        icon: weather.current.condition.text,
                      },
                      {
                        time: "22:00",
                        temp: 17,
                        icon: weather.current.condition.text,
                      },
                      {
                        time: "23:00",
                        temp: 16,
                        icon: weather.current.condition.text,
                      },
                      { time: "00:00", temp: 16, icon: "cloudy" },
                      { time: "01:00", temp: 15, icon: "cloudy" },
                      { time: "02:00", temp: 15, icon: "cloudy" },
                    ]
                      .slice(
                        0,
                        window.innerWidth < 640
                          ? 5
                          : window.innerWidth < 1024
                            ? 7
                            : 9,
                      )
                      .map((hour) => (
                        <div
                          key={hour.time}
                          className="text-center space-y-2 sm:space-y-3"
                        >
                          <div className="text-xs text-white/60">
                            {hour.time}
                          </div>
                          <div className="flex justify-center">
                            {getWeatherIcon(hour.icon, "sm")}
                          </div>
                          <div className="text-xs font-medium text-white">
                            {hour.temp}°
                          </div>
                        </div>
                      ))}
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
