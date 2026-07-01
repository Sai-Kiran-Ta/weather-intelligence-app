import React from "react";
import { WeatherForecastResponse, CityResult } from "../types";
import { getWeatherCondition, celsiusToFahrenheit, formatDate } from "../utils";
import { WeatherIcon } from "./WeatherIcon";

interface CurrentWeatherCardProps {
  city: CityResult;
  weather: WeatherForecastResponse;
  unit: "C" | "F";
}

export function CurrentWeatherCard({ city, weather, unit }: CurrentWeatherCardProps) {
  const current = weather.current;
  const condition = getWeatherCondition(current.weather_code);
  
  const displayTemp = unit === "C" ? current.temperature_2m : celsiusToFahrenheit(current.temperature_2m);
  const displayFeels = unit === "C" ? current.apparent_temperature : celsiusToFahrenheit(current.apparent_temperature);
  
  // Find today's high and low temps from the daily forecast
  const todayMax = weather.daily.temperature_2m_max[0];
  const todayMin = weather.daily.temperature_2m_min[0];
  const displayMax = unit === "C" ? todayMax : celsiusToFahrenheit(todayMax);
  const displayMin = unit === "C" ? todayMin : celsiusToFahrenheit(todayMin);

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm p-6 lg:p-8"
    >
      {/* Decorative colored glow based on weather condition */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${condition.bgColor} opacity-20 blur-2xl pointer-events-none`} />

      {/* Card Header: Location and Time */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <WeatherIcon name="MapPin" className="text-slate-400 dark:text-slate-500" size={20} />
            <h2 id="current-city-name" className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
              {city.name}
            </h2>
            {city.country_code && (
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded">
                {city.country_code}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-7">
            {[city.admin1, city.country].filter(Boolean).join(", ")}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Current Conditions
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Observed at {formatDate(current.time, "full")}
          </p>
        </div>
      </div>

      {/* Main Grid: Temp & Main Condition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8 relative z-10">
        {/* Large Temp Indicator */}
        <div className="flex items-baseline gap-1">
          <span className="text-6xl md:text-7xl font-extrabold text-slate-800 dark:text-white tracking-tighter">
            {displayTemp.toFixed(1)}°
          </span>
          <span className="text-3xl font-light text-slate-400 dark:text-slate-500">
            {unit}
          </span>
          <div className="ml-4 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300">
              <WeatherIcon name="ArrowUp" className="text-red-400" size={14} />
              <span>{displayMax.toFixed(1)}°</span>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <WeatherIcon name="ArrowDown" className="text-blue-400" size={14} />
              <span>{displayMin.toFixed(1)}°</span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Feels like {displayFeels.toFixed(1)}°{unit}
            </p>
          </div>
        </div>

        {/* Condition details with badge */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${condition.bgColor} text-white shadow-md`}>
            <WeatherIcon name={condition.iconName} size={40} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {condition.label}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {current.is_day ? "Daytime conditions" : "Nighttime conditions"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row with detailed measurements */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
        {/* Humidity */}
        <div id="stat-humidity" className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
            <WeatherIcon name="Droplets" size={16} />
            <span className="text-xs font-medium">Humidity</span>
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {current.relative_humidity_2m}%
          </p>
        </div>

        {/* Wind Speed */}
        <div id="stat-wind" className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
            <WeatherIcon name="Wind" size={16} />
            <span className="text-xs font-medium">Wind Speed</span>
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {current.wind_speed_10m.toFixed(1)} <span className="text-xs font-normal text-slate-400">km/h</span>
          </p>
        </div>

        {/* Precipitation */}
        <div id="stat-precipitation" className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
            <WeatherIcon name="Umbrella" size={16} />
            <span className="text-xs font-medium">Precipitation</span>
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {current.precipitation.toFixed(1)} <span className="text-xs font-normal text-slate-400">mm</span>
          </p>
        </div>

        {/* UV Index */}
        <div id="stat-uv-index" className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
            <WeatherIcon name="Sparkles" size={16} />
            <span className="text-xs font-medium">UV Index</span>
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {weather.daily.uv_index_max[0].toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
