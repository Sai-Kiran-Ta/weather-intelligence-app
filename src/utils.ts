import { WeatherConditionInfo } from "./types";

// WMO Weather Interpretation Codes (WW)
// https://open-meteo.com/en/docs
export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: "Clear Sky",
        iconName: "Sun",
        bgColor: "from-amber-400 to-orange-500",
        textColor: "text-amber-500",
      };
    case 1:
      return {
        label: "Mainly Clear",
        iconName: "SunDim",
        bgColor: "from-yellow-400 to-amber-500",
        textColor: "text-amber-500",
      };
    case 2:
      return {
        label: "Partly Cloudy",
        iconName: "CloudSun",
        bgColor: "from-blue-300 to-indigo-400",
        textColor: "text-blue-500",
      };
    case 3:
      return {
        label: "Overcast",
        iconName: "Cloud",
        bgColor: "from-slate-400 to-slate-600",
        textColor: "text-slate-500",
      };
    case 45:
    case 48:
      return {
        label: "Foggy",
        iconName: "CloudFog",
        bgColor: "from-gray-300 to-gray-500",
        textColor: "text-gray-500",
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Drizzle",
        iconName: "CloudDrizzle",
        bgColor: "from-blue-400 to-teal-500",
        textColor: "text-blue-400",
      };
    case 56:
    case 57:
      return {
        label: "Freezing Drizzle",
        iconName: "CloudSnow",
        bgColor: "from-cyan-300 to-blue-500",
        textColor: "text-cyan-500",
      };
    case 61:
    case 63:
    case 65:
      return {
        label: "Rain",
        iconName: "CloudRain",
        bgColor: "from-blue-500 to-indigo-700",
        textColor: "text-blue-600",
      };
    case 66:
    case 67:
      return {
        label: "Freezing Rain",
        iconName: "CloudSnow",
        bgColor: "from-cyan-400 to-blue-600",
        textColor: "text-cyan-600",
      };
    case 71:
    case 73:
    case 75:
      return {
        label: "Snowfall",
        iconName: "Snowflake",
        bgColor: "from-sky-300 to-blue-400",
        textColor: "text-sky-500",
      };
    case 77:
      return {
        label: "Snow Grains",
        iconName: "Snowflake",
        bgColor: "from-sky-200 to-sky-400",
        textColor: "text-sky-400",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Rain Showers",
        iconName: "CloudLightning",
        bgColor: "from-indigo-400 to-blue-600",
        textColor: "text-blue-500",
      };
    case 85:
    case 86:
      return {
        label: "Snow Showers",
        iconName: "CloudSnow",
        bgColor: "from-sky-300 to-indigo-500",
        textColor: "text-sky-500",
      };
    case 95:
      return {
        label: "Thunderstorm",
        iconName: "CloudLightning",
        bgColor: "from-purple-600 to-slate-800",
        textColor: "text-purple-600",
      };
    case 96:
    case 99:
      return {
        label: "Thunderstorm with Hail",
        iconName: "CloudLightning",
        bgColor: "from-purple-800 to-indigo-950",
        textColor: "text-indigo-800",
      };
    default:
      return {
        label: "Unknown Weather",
        iconName: "CloudRain",
        bgColor: "from-slate-400 to-slate-500",
        textColor: "text-slate-500",
      };
  }
}

export interface Recommendation {
  id: string;
  type: "warning" | "success" | "info" | "neutral";
  title: string;
  description: string;
  iconName: string;
}

export function generateRecommendations(
  temp: number, // Celsius
  code: number,
  humidity: number,
  windSpeed: number, // km/h
  dailyRainSum?: number, // mm
  uvIndex?: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Rain checks
  const isRaining = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code) || (dailyRainSum && dailyRainSum > 0);
  if (isRaining) {
    recommendations.push({
      id: "rain",
      type: "warning",
      title: "Carry an umbrella",
      description: "Rain is active or highly likely. Keep a rain jacket or umbrella handy for outdoor trips.",
      iconName: "Umbrella",
    });
  }

  // Temp checks (high)
  if (temp >= 30) {
    recommendations.push({
      id: "hot",
      type: "warning",
      title: "Stay hydrated",
      description: `High temperature of ${temp.toFixed(1)}°C. Drink plenty of water and avoid prolonged sun exposure.`,
      iconName: "CupSoda",
    });
  }

  // Temp checks (cold)
  if (temp <= 15) {
    recommendations.push({
      id: "cold",
      type: "info",
      title: "Wear warm clothes",
      description: `Chilly conditions at ${temp.toFixed(1)}°C. Layer up with a sweater or warm jacket.`,
      iconName: "Shirt",
    });
  }

  // UV index checks
  if (uvIndex !== undefined && uvIndex >= 6) {
    recommendations.push({
      id: "uv",
      type: "warning",
      title: "Apply sunscreen",
      description: `High UV index of ${uvIndex}. Wear SPF 30+ sunscreen, a wide-brimmed hat, and sunglasses.`,
      iconName: "Sparkles",
    });
  }

  // Wind speed checks
  if (windSpeed >= 25) {
    recommendations.push({
      id: "wind",
      type: "warning",
      title: "Secure outdoor items",
      description: `Gusty winds up to ${windSpeed.toFixed(1)} km/h. Watch out for flying debris and secure garden furniture.`,
      iconName: "Wind",
    });
  }

  // Pleasant weather check
  const isPleasant = temp > 18 && temp < 27 && !isRaining && windSpeed < 20;
  if (isPleasant) {
    recommendations.push({
      id: "outdoor",
      type: "success",
      title: "Perfect outdoor day",
      description: "Delightful weather conditions! Great for outdoor activities, sports, or a relaxing stroll.",
      iconName: "Footprints",
    });
  }

  // Default neutral if no recommendation generated
  if (recommendations.length === 0) {
    recommendations.push({
      id: "neutral",
      type: "neutral",
      title: "Routine day",
      description: "Conditions are steady and moderate. Have a wonderful and productive day!",
      iconName: "Smile",
    });
  }

  return recommendations;
}

// Convert Celsius to Fahrenheit
export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

// Format date nicely
export function formatDate(dateStr: string, format: "short" | "full" = "short"): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  
  if (format === "short") {
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

// Format time nicely
export function formatTime(timeStr: string): string {
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return timeStr;
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
