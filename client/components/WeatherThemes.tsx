export const weatherThemes = {
  thunderstorm: {
    background: "from-purple-900 via-purple-800 to-indigo-900",
    cardBg: "bg-purple-900/30",
    accentColor: "text-purple-200",
    primaryText: "text-white",
    secondaryText: "text-purple-200/80",
    effects: {
      lightning: true,
      rain: true,
      clouds: "dark",
    },
  },

  "heavy-thunderstorm": {
    background: "from-slate-900 via-purple-900 to-black",
    cardBg: "bg-slate-800/40",
    accentColor: "text-purple-300",
    primaryText: "text-white",
    secondaryText: "text-purple-300/80",
    effects: {
      lightning: "intense",
      rain: "heavy",
      clouds: "storm",
    },
  },

  sunny: {
    background: "from-amber-400 via-orange-500 to-red-500",
    cardBg: "bg-yellow-400/20",
    accentColor: "text-yellow-100",
    primaryText: "text-white",
    secondaryText: "text-yellow-100/90",
    effects: {
      sun: "bright",
      rays: true,
      particles: "sparkle",
    },
  },

  "partly-cloudy": {
    background: "from-blue-400 via-sky-500 to-blue-600",
    cardBg: "bg-blue-500/25",
    accentColor: "text-blue-100",
    primaryText: "text-white",
    secondaryText: "text-blue-100/90",
    effects: {
      sun: "mild",
      clouds: "light",
      rays: "soft",
    },
  },

  cloudy: {
    background: "from-gray-600 via-slate-600 to-gray-700",
    cardBg: "bg-gray-600/30",
    accentColor: "text-gray-200",
    primaryText: "text-white",
    secondaryText: "text-gray-200/90",
    effects: {
      clouds: "heavy",
      mist: true,
    },
  },

  overcast: {
    background: "from-gray-700 via-slate-700 to-gray-800",
    cardBg: "bg-gray-700/35",
    accentColor: "text-gray-300",
    primaryText: "text-white",
    secondaryText: "text-gray-300/90",
    effects: {
      clouds: "overcast",
      mist: "heavy",
    },
  },

  rainy: {
    background: "from-slate-600 via-blue-700 to-slate-800",
    cardBg: "bg-slate-700/30",
    accentColor: "text-blue-200",
    primaryText: "text-white",
    secondaryText: "text-blue-200/90",
    effects: {
      rain: "moderate",
      clouds: "rain",
      mist: true,
    },
  },

  "light-rain": {
    background: "from-slate-500 via-blue-600 to-slate-700",
    cardBg: "bg-slate-600/25",
    accentColor: "text-blue-200",
    primaryText: "text-white",
    secondaryText: "text-blue-200/90",
    effects: {
      rain: "light",
      clouds: "light-rain",
    },
  },

  "heavy-rain": {
    background: "from-slate-800 via-blue-900 to-slate-900",
    cardBg: "bg-slate-800/40",
    accentColor: "text-blue-300",
    primaryText: "text-white",
    secondaryText: "text-blue-300/80",
    effects: {
      rain: "heavy",
      clouds: "storm",
      mist: "heavy",
    },
  },

  snowy: {
    background: "from-blue-200 via-slate-300 to-blue-300",
    cardBg: "bg-white/25",
    accentColor: "text-slate-700",
    primaryText: "text-slate-800",
    secondaryText: "text-slate-600/90",
    effects: {
      snow: true,
      clouds: "snow",
      sparkle: true,
    },
  },

  blizzard: {
    background: "from-slate-400 via-blue-300 to-slate-500",
    cardBg: "bg-white/20",
    accentColor: "text-slate-700",
    primaryText: "text-slate-800",
    secondaryText: "text-slate-600/90",
    effects: {
      snow: "heavy",
      wind: true,
      clouds: "storm",
    },
  },

  foggy: {
    background: "from-gray-400 via-slate-500 to-gray-600",
    cardBg: "bg-gray-500/25",
    accentColor: "text-gray-200",
    primaryText: "text-white",
    secondaryText: "text-gray-200/90",
    effects: {
      fog: true,
      mist: "heavy",
    },
  },

  windy: {
    background: "from-teal-500 via-sky-600 to-blue-600",
    cardBg: "bg-teal-500/25",
    accentColor: "text-teal-100",
    primaryText: "text-white",
    secondaryText: "text-teal-100/90",
    effects: {
      wind: true,
      clouds: "moving",
      particles: "wind",
    },
  },

  clear: {
    background: "from-sky-400 via-blue-500 to-blue-600",
    cardBg: "bg-sky-400/20",
    accentColor: "text-sky-100",
    primaryText: "text-white",
    secondaryText: "text-sky-100/90",
    effects: {
      sun: "clear",
      rays: "bright",
      sparkle: "light",
    },
  },
};

export const getWeatherTheme = (condition: string) => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("thunder") && conditionLower.includes("heavy")) {
    return weatherThemes["heavy-thunderstorm"];
  }
  if (conditionLower.includes("thunder")) {
    return weatherThemes.thunderstorm;
  }
  if (conditionLower.includes("blizzard")) {
    return weatherThemes.blizzard;
  }
  if (conditionLower.includes("snow")) {
    return weatherThemes.snowy;
  }
  if (
    conditionLower.includes("heavy rain") ||
    conditionLower.includes("torrential")
  ) {
    return weatherThemes["heavy-rain"];
  }
  if (
    conditionLower.includes("light rain") ||
    conditionLower.includes("drizzle")
  ) {
    return weatherThemes["light-rain"];
  }
  if (conditionLower.includes("rain")) {
    return weatherThemes.rainy;
  }
  if (conditionLower.includes("overcast")) {
    return weatherThemes.overcast;
  }
  if (conditionLower.includes("cloudy") || conditionLower.includes("cloud")) {
    return weatherThemes.cloudy;
  }
  if (conditionLower.includes("partly") && conditionLower.includes("cloud")) {
    return weatherThemes["partly-cloudy"];
  }
  if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return weatherThemes.foggy;
  }
  if (conditionLower.includes("wind")) {
    return weatherThemes.windy;
  }
  if (conditionLower.includes("clear") || conditionLower.includes("sunny")) {
    return weatherThemes.sunny;
  }

  return weatherThemes.clear; // Default fallback
};
