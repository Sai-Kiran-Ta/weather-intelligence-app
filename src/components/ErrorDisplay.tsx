import React from "react";
import { WeatherIcon } from "./WeatherIcon";

interface ErrorDisplayProps {
  message: string;
  onClear: () => void;
  onSelectPopular: (cityName: string) => void;
}

export function ErrorDisplay({ message, onClear, onSelectPopular }: ErrorDisplayProps) {
  const popularCities = ["London", "New York", "Chennai", "Tokyo", "Paris"];

  return (
    <div
      id="error-display-card"
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center max-w-xl mx-auto my-8 relative overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 h-1.5 bg-red-500" />
      
      {/* Icon */}
      <div className="mx-auto w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mb-6">
        <WeatherIcon name="X" size={28} />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
        Geographic Intelligence Error
      </h3>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
        <button
          id="btn-error-retry"
          onClick={onClear}
          className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <WeatherIcon name="RotateCcw" size={16} />
          Try Another Search
        </button>
      </div>

      {/* Popular locations quick recovery */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
          Quickly jump to a major metropolis
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {popularCities.map((city) => (
            <button
              key={city}
              id={`popular-city-btn-${city.toLowerCase()}`}
              onClick={() => onSelectPopular(city)}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-lg transition-all"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
