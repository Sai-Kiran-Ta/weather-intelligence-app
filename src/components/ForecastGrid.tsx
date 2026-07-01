import React from "react";
import { WeatherForecastResponse } from "../types";
import { getWeatherCondition, celsiusToFahrenheit, formatDate } from "../utils";
import { WeatherIcon } from "./WeatherIcon";

interface ForecastGridProps {
  weather: WeatherForecastResponse;
  unit: "C" | "F";
}

export function ForecastGrid({ weather, unit }: ForecastGridProps) {
  const daily = weather.daily;

  return (
    <div id="forecast-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <WeatherIcon name="CalendarDays" className="text-indigo-500" size={22} />
          7-Day Outlook
        </h3>
      </div>

      {/* Mobile view: beautiful vertical list */}
      <div className="md:hidden space-y-2">
        {daily.time.map((time, index) => {
          const code = daily.weather_code[index];
          const condition = getWeatherCondition(code);
          const maxTemp = unit === "C" ? daily.temperature_2m_max[index] : celsiusToFahrenheit(daily.temperature_2m_max[index]);
          const minTemp = unit === "C" ? daily.temperature_2m_min[index] : celsiusToFahrenheit(daily.temperature_2m_min[index]);
          const rainProb = daily.precipitation_probability_max[index];
          const uv = daily.uv_index_max[index];
          const isToday = index === 0;

          return (
            <div
              key={time}
              id={`forecast-row-${index}`}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                isToday
                  ? "bg-gradient-to-r from-indigo-50/60 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
              }`}
            >
              {/* Day & Date */}
              <div className="w-16 flex-none">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isToday ? "Today" : formatDate(time).split(",")[0]}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {formatDate(time).split(",")[1]}
                </p>
              </div>

              {/* Icon, Label & Stats (Stacked vertically for perfect space-efficiency on mobile) */}
              <div className="flex-1 flex items-center gap-2 px-1 min-w-0">
                <div className={`p-1.5 rounded-xl bg-gradient-to-br ${condition.bgColor} text-white shadow-xs flex-none`}>
                  <WeatherIcon name={condition.iconName} size={15} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {condition.label}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <WeatherIcon name="Droplets" size={10} className="text-blue-400" />
                      {rainProb}%
                    </span>
                    <span className="flex items-center gap-0.5">
                      <WeatherIcon name="Sparkles" size={10} className="text-amber-500" />
                      UV {uv.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* High / Low Temp */}
              <div className="flex-none text-right pl-2 flex items-baseline justify-end gap-1.5 w-16">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {maxTemp.toFixed(0)}°
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  {minTemp.toFixed(0)}°
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop view: original elegant 7-column grid */}
      <div
        id="forecast-grid-container"
        className="hidden md:grid md:grid-cols-7 gap-4"
      >
        {daily.time.map((time, index) => {
          const code = daily.weather_code[index];
          const condition = getWeatherCondition(code);
          const maxTemp = unit === "C" ? daily.temperature_2m_max[index] : celsiusToFahrenheit(daily.temperature_2m_max[index]);
          const minTemp = unit === "C" ? daily.temperature_2m_min[index] : celsiusToFahrenheit(daily.temperature_2m_min[index]);
          const rainProb = daily.precipitation_probability_max[index];
          const uv = daily.uv_index_max[index];

          // Highlight today
          const isToday = index === 0;

          return (
            <div
              key={time}
              id={`forecast-card-${index}`}
              className={`flex-none w-40 md:w-auto snap-align-start p-5 rounded-2xl border text-center transition-all ${
                isToday
                  ? "bg-gradient-to-b from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/20 dark:to-indigo-900/10 border-indigo-200 dark:border-indigo-800 shadow-sm"
                  : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
            >
              {/* Date */}
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isToday ? "Today" : formatDate(time).split(",")[0]}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                {formatDate(time).split(",")[1]}
              </p>

              {/* Icon */}
              <div className="flex justify-center mb-3">
                <div className={`p-3 rounded-full bg-gradient-to-br ${condition.bgColor} text-white shadow-sm`}>
                  <WeatherIcon name={condition.iconName} size={22} />
                </div>
              </div>

              {/* Condition Label */}
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate px-1 mb-3">
                {condition.label}
              </p>

              {/* Temperatures */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {maxTemp.toFixed(0)}°
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">
                  {minTemp.toFixed(0)}°
                </span>
              </div>

              {/* Extra Weather Intel */}
              <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                {/* Rain probability */}
                <div className="flex items-center gap-0.5" title="Precipitation Probability">
                  <WeatherIcon name="Droplets" size={12} className="text-blue-400" />
                  <span>{rainProb}%</span>
                </div>
                {/* UV Index */}
                <div className="flex items-center gap-0.5" title="UV Index">
                  <WeatherIcon name="Sparkles" size={12} className="text-amber-500" />
                  <span>UV {uv.toFixed(0)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
