import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Eye,
  Droplets,
  Thermometer,
} from "lucide-react";
import { WeatherResponse } from "@shared/weather";

interface WeatherCardProps {
  weather: WeatherResponse;
}

const getWeatherIcon = (condition: string, isDay: number) => {
  const conditionLower = condition.toLowerCase();
  const iconClass = "w-24 h-24 text-white drop-shadow-lg";

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

  // Default based on day/night
  return isDay ? (
    <Sun className={iconClass} />
  ) : (
    <Cloud className={iconClass} />
  );
};

export default function WeatherCard({ weather }: WeatherCardProps) {
  const { location, current } = weather;

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-8 mb-8 text-white shadow-2xl">
      {/* Location */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-light text-white/90">
          {location.name}, {location.country}
        </h1>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          {getWeatherIcon(current.condition.text, current.is_day)}
          <div className="mt-4">
            <div className="text-6xl font-thin mb-2">
              {Math.round(current.temp_c)}°
            </div>
            <div className="text-lg text-white/80 font-light">
              {current.condition.text}
            </div>
            <div className="text-sm text-white/60 mt-1">
              Feels like {Math.round(current.feelslike_c)}°
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Wind className="w-6 h-6 mx-auto mb-2 text-white/70" />
          <div className="text-sm text-white/60">Wind</div>
          <div className="text-lg font-medium">{current.wind_kph} km/h</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Droplets className="w-6 h-6 mx-auto mb-2 text-white/70" />
          <div className="text-sm text-white/60">Humidity</div>
          <div className="text-lg font-medium">{current.humidity}%</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Eye className="w-6 h-6 mx-auto mb-2 text-white/70" />
          <div className="text-sm text-white/60">Visibility</div>
          <div className="text-lg font-medium">{current.vis_km} km</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Thermometer className="w-6 h-6 mx-auto mb-2 text-white/70" />
          <div className="text-sm text-white/60">Pressure</div>
          <div className="text-lg font-medium">{current.pressure_mb} mb</div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center mt-6 text-sm text-white/60">
        Last updated: {new Date(current.last_updated).toLocaleTimeString()}
      </div>
    </div>
  );
}
