import React from "react";
import { WeatherForecastResponse } from "../types";
import { generateRecommendations } from "../utils";
import { WeatherIcon } from "./WeatherIcon";

interface RecommendationsProps {
  weather: WeatherForecastResponse;
}

export function Recommendations({ weather }: RecommendationsProps) {
  const current = weather.current;
  const todayRain = weather.daily.precipitation_sum[0];
  const todayUv = weather.daily.uv_index_max[0];
  
  const recommendations = generateRecommendations(
    current.temperature_2m,
    current.weather_code,
    current.relative_humidity_2m,
    current.wind_speed_10m,
    todayRain,
    todayUv
  );

  return (
    <div
      id="smart-recommendations-card"
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-full"
    >
      <div className="mb-5">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <WeatherIcon name="Sparkles" className="text-indigo-500" size={22} />
          Smart Weather Intel
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500">
          Personalized planning recommendations based on real-time and forecast parameters
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          // Color styles based on type
          let typeStyles = "bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-800 text-slate-700 dark:text-slate-300";
          let iconColor = "text-indigo-500";
          
          if (rec.type === "warning") {
            typeStyles = "bg-amber-50/50 border-amber-100 dark:bg-amber-950/10 dark:border-amber-900/30 text-amber-800 dark:text-amber-200";
            iconColor = "text-amber-500";
          } else if (rec.type === "success") {
            typeStyles = "bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-200";
            iconColor = "text-emerald-500";
          } else if (rec.type === "info") {
            typeStyles = "bg-blue-50/50 border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/30 text-blue-800 dark:text-blue-200";
            iconColor = "text-blue-500";
          }

          return (
            <div
              key={rec.id}
              id={`recommendation-${rec.id}`}
              className={`flex gap-4 p-4 rounded-2xl border transition-all ${typeStyles}`}
            >
              <div className={`p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm self-start flex-none ${iconColor}`}>
                <WeatherIcon name={rec.iconName} size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm tracking-tight">
                  {rec.title}
                </h4>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
