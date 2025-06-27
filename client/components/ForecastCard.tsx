import { Cloud, CloudRain, Sun, CloudSnow, ChevronRight } from "lucide-react";
import { ForecastDay } from "@shared/weather";

interface ForecastCardProps {
  forecast: ForecastDay[];
}

const getWeatherIcon = (condition: string, size: "sm" | "md" = "sm") => {
  const conditionLower = condition.toLowerCase();
  const iconClass = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  const textClass = "text-white/80";

  if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return <CloudRain className={`${iconClass} ${textClass}`} />;
  }
  if (conditionLower.includes("snow") || conditionLower.includes("blizzard")) {
    return <CloudSnow className={`${iconClass} ${textClass}`} />;
  }
  if (conditionLower.includes("cloud") || conditionLower.includes("overcast")) {
    return <Cloud className={`${iconClass} ${textClass}`} />;
  }
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return <Sun className={`${iconClass} ${textClass}`} />;
  }

  return <Cloud className={`${iconClass} ${textClass}`} />;
};

const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", { weekday: "short" });
};

export default function ForecastCard({ forecast }: ForecastCardProps) {
  if (!forecast || forecast.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-3xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">7-Day Forecast</h2>
        <ChevronRight className="w-5 h-5 text-white/60" />
      </div>

      <div className="space-y-4">
        {forecast.slice(0, 7).map((day, index) => (
          <div
            key={day.date}
            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-200 hover:bg-white/10 ${
              index === 0 ? "bg-white/10" : "bg-white/5"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 text-left">
                <div className="font-medium">{getDayName(day.date)}</div>
                <div className="text-sm text-white/60">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {getWeatherIcon(day.day.condition.text)}
                <div className="hidden md:block">
                  <div className="text-sm text-white/80">
                    {day.day.condition.text}
                  </div>
                  <div className="text-xs text-white/60">
                    {day.day.daily_chance_of_rain}% rain
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium">
                    {Math.round(day.day.maxtemp_c)}°
                  </span>
                  <span className="text-white/60">
                    {Math.round(day.day.mintemp_c)}°
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
