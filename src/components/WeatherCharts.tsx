import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { WeatherForecastResponse } from "../types";
import { formatDate, celsiusToFahrenheit } from "../utils";
import { WeatherIcon } from "./WeatherIcon";

interface WeatherChartsProps {
  weather: WeatherForecastResponse;
  unit: "C" | "F";
}

type MetricType = "temp" | "rain" | "wind";

export function WeatherCharts({ weather, unit }: WeatherChartsProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>("temp");

  const chartData = weather.daily.time.map((time, index) => {
    const rawMax = weather.daily.temperature_2m_max[index];
    const rawMin = weather.daily.temperature_2m_min[index];
    
    return {
      name: formatDate(time).split(",")[0], // e.g. "Wed"
      dateLabel: formatDate(time),
      "Max Temp": unit === "C" ? rawMax : celsiusToFahrenheit(rawMax),
      "Min Temp": unit === "C" ? rawMin : celsiusToFahrenheit(rawMin),
      "Rain Chance": weather.daily.precipitation_probability_max[index],
      "Wind Speed": weather.daily.wind_speed_10m_max[index],
    };
  });

  return (
    <div
      id="weather-charts-card"
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <WeatherIcon name="TrendingUp" className="text-indigo-500" size={22} />
            Meteorological Trends
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Interactive forecasts for the next 7 days
          </p>
        </div>

        {/* Tab Switcher */}
        <div id="chart-metrics-tabs" className="flex items-center gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-900 self-start">
          <button
            id="tab-temp"
            onClick={() => setActiveMetric("temp")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === "temp"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Temperature
          </button>
          <button
            id="tab-rain"
            onClick={() => setActiveMetric("rain")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === "rain"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Precipitation
          </button>
          <button
            id="tab-wind"
            onClick={() => setActiveMetric("wind")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeMetric === "wind"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Wind Speed
          </button>
        </div>
      </div>

      {/* Recharts Area */}
      <div className="w-full h-80 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {activeMetric === "temp" && (
                <>
                  <linearGradient id="colorMaxTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMinTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </>
              )}
              {activeMetric === "rain" && (
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              )}
              {activeMetric === "wind" && (
                <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={500}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              fontSize={11}
              fontWeight={500}
              tickFormatter={(value) => {
                if (activeMetric === "temp") return `${value}°`;
                if (activeMetric === "rain") return `${value}%`;
                return `${value} km/h`;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "12px",
                border: "none",
                color: "#f8fafc",
                fontSize: "12px",
                fontWeight: "500",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelFormatter={(label, items) => {
                const item = items[0]?.payload;
                return item ? item.dateLabel : label;
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: 600 }} />
            
            {activeMetric === "temp" && (
              <>
                <Area
                  name={`Max Temp (°${unit})`}
                  type="monotone"
                  dataKey="Max Temp"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorMaxTemp)"
                />
                <Area
                  name={`Min Temp (°${unit})`}
                  type="monotone"
                  dataKey="Min Temp"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMinTemp)"
                />
              </>
            )}

            {activeMetric === "rain" && (
              <Area
                name="Precipitation Probability (%)"
                type="monotone"
                dataKey="Rain Chance"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRain)"
              />
            )}

            {activeMetric === "wind" && (
              <Area
                name="Max Wind Speed (km/h)"
                type="monotone"
                dataKey="Wind Speed"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorWind)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
