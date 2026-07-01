import React, { useState, useEffect } from "react";
import { CityResult, WeatherForecastResponse } from "./types";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { ForecastGrid } from "./components/ForecastGrid";
import { WeatherCharts } from "./components/WeatherCharts";
import { Recommendations } from "./components/Recommendations";
import { ErrorDisplay } from "./components/ErrorDisplay";
import { WeatherIcon } from "./components/WeatherIcon";

const DEFAULT_CITY: CityResult = {
  id: 1274746,
  name: "Chennai",
  latitude: 13.08784,
  longitude: 80.27847,
  country: "India",
  country_code: "IN",
  admin1: "Tamil Nadu",
  timezone: "Asia/Kolkata",
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCity, setActiveCity] = useState<CityResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [searchHistory, setSearchHistory] = useState<CityResult[]>([]);
  const [suggestions, setSuggestions] = useState<CityResult[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  // Load state and history on mount
  useEffect(() => {
    // Load search history
    const storedHistory = localStorage.getItem("weather_search_history");
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse search history", e);
      }
    }

    // Load last searched city or default
    const lastCity = localStorage.getItem("weather_last_city");
    if (lastCity) {
      try {
        const parsedCity = JSON.parse(lastCity) as CityResult;
        setActiveCity(parsedCity);
        fetchWeather(parsedCity);
      } catch (e) {
        setActiveCity(DEFAULT_CITY);
        fetchWeather(DEFAULT_CITY);
      }
    } else {
      setActiveCity(DEFAULT_CITY);
      fetchWeather(DEFAULT_CITY);
    }

    // Load temperature unit setting
    const storedUnit = localStorage.getItem("weather_temp_unit");
    if (storedUnit === "C" || storedUnit === "F") {
      setTempUnit(storedUnit);
    }
  }, []);

  // Fetch forecast data from Open-Meteo
  const fetchWeather = async (city: CityResult) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]); // Clear recommendations list to close dropdown
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Unable to fetch weather forecast from Open-Meteo.");
      }

      const data = (await response.json()) as WeatherForecastResponse;
      setWeatherData(data);
      setActiveCity(city);
      
      // Update last searched city persistence
      localStorage.setItem("weather_last_city", JSON.stringify(city));

      // Update Search History (avoid duplicates)
      setSearchHistory((prev) => {
        const filtered = prev.filter((item) => item.name.toLowerCase() !== city.name.toLowerCase());
        const updated = [city, ...filtered].slice(0, 5); // Store top 5 searches
        localStorage.setItem("weather_search_history", JSON.stringify(updated));
        return updated;
      });
    } catch (err: any) {
      setError(err.message || "Failed to load meteorological details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Perform city lookup via Geocoding API
  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        searchQuery.trim()
      )}&count=5&language=en&format=json`;

      const response = await fetch(geoUrl);
      if (!response.ok) {
        throw new Error("Could not reach Geocoding services.");
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setError(`City "${searchQuery}" not found. Please verify the spelling or try another location.`);
        setIsLoading(false);
        return;
      }

      // If we find matches, display suggestions or select the first one directly
      const results = data.results as CityResult[];
      if (results.length === 1) {
        fetchWeather(results[0]);
        setSearchQuery("");
      } else {
        // Multi-match scenario: let users select the precise location
        setSuggestions(results);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during search.");
      setIsLoading(false);
    }
  };

  // Dynamic autosearch typing recommendations (debounce/autocomplete preview)
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSuggesting(true);
      try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          searchQuery.trim()
        )}&count=5&language=en&format=json`;

        const response = await fetch(geoUrl);
        if (response.ok) {
          const data = await response.json();
          if (data.results) {
            setSuggestions(data.results);
          }
        }
      } catch (err) {
        console.error("Failed to fetch search recommendations", err);
      } finally {
        setIsSuggesting(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Request browser GPS position
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your current browser.");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Construct a pseudo-city object for the GPS coordinates
        const gpsCity: CityResult = {
          id: Date.now(),
          name: "Current Location",
          latitude,
          longitude,
          country: "My Position",
          timezone: "auto",
        };
        fetchWeather(gpsCity);
        setSearchQuery("");
      },
      (geoError) => {
        setIsLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError("Location access was denied. Please check your browser/system permissions.");
        } else {
          setError("Failed to determine current location. Try searching manually.");
        }
      }
    );
  };

  // Clear search query
  const handleClearQuery = () => {
    setSearchQuery("");
    setSuggestions([]);
  };

  // Switch temperature unit
  const handleToggleUnit = (unit: "C" | "F") => {
    setTempUnit(unit);
    localStorage.setItem("weather_temp_unit", unit);
  };

  // Remove item from search history
  const handleRemoveHistoryItem = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("weather_search_history", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 pb-12">
      
      {/* Dynamic Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-5 sticky top-0 z-40 shadow-xs backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-xl text-white shadow-md">
              <WeatherIcon name="SunDim" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Weather Intelligence
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Smarter Meteorological Forecasts & Recommendations
              </p>
            </div>
          </div>

          {/* Unit Switcher & Settings */}
          <div className="flex items-center gap-4">
            <div id="unit-switcher" className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <button
                id="btn-unit-c"
                onClick={() => handleToggleUnit("C")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tempUnit === "C"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                °C
              </button>
              <button
                id="btn-unit-f"
                onClick={() => handleToggleUnit("F")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tempUnit === "F"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 space-y-8">
        
        {/* Search & Location Bar */}
        <section id="search-section" className="relative max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="relative flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <WeatherIcon name="Search" size={18} />
              </span>
              
              <input
                id="city-search-input"
                type="text"
                placeholder="Search for any city (e.g: Chennai)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-sm md:text-base focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-white"
              />

              {searchQuery && (
                <button
                  id="btn-clear-search"
                  type="button"
                  onClick={handleClearQuery}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <WeatherIcon name="X" size={16} />
                </button>
              )}
            </div>

            {/* Actions button group */}
            <div className="flex items-center gap-2">
              {/* GPS Trigger Button */}
              <button
                id="btn-gps-location"
                type="button"
                onClick={handleRequestLocation}
                title="Use Current Location"
                className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex-1 sm:flex-none flex items-center justify-center gap-2 min-h-[48px] sm:min-h-0 cursor-pointer"
              >
                <WeatherIcon name="MapPin" size={18} />
                <span className="sm:hidden text-xs font-semibold">My Location</span>
              </button>

              {/* Search Button */}
              <button
                id="btn-search-submit"
                type="submit"
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-2xl shadow-md shadow-indigo-500/10 transition-all flex-2 sm:flex-none flex items-center justify-center min-h-[48px] sm:min-h-0 cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Panel */}
          {suggestions.length > 0 && (
            <div id="suggestions-dropdown" className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Cities
              </div>
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  id={`suggestion-${item.id}`}
                  onClick={() => {
                    fetchWeather(item);
                    setSearchQuery("");
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 flex items-center justify-between transition-all"
                >
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
                    {item.admin1 && (
                      <span className="text-slate-400 dark:text-slate-500 text-xs ml-1.5">
                        {item.admin1}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {item.country}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Search History Chips */}
          {searchHistory.length > 0 && !suggestions.length && (
            <div id="search-history" className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                Recent:
              </span>
              {searchHistory.map((city) => (
                <div
                  key={city.id}
                  id={`history-chip-${city.name.toLowerCase()}`}
                  onClick={() => fetchWeather(city)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-100 dark:hover:border-indigo-900 text-xs font-medium text-slate-600 dark:text-slate-300 rounded-full cursor-pointer shadow-2xs hover:shadow-xs transition-all group"
                >
                  <span>{city.name}</span>
                  <button
                    onClick={(e) => handleRemoveHistoryItem(e, city.id)}
                    className="text-slate-300 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 transition-colors"
                  >
                    <WeatherIcon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Loading Spinner */}
        {isLoading && (
          <div id="loading-spinner-container" className="flex flex-col items-center justify-center py-20">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
              <WeatherIcon name="Loader2" className="animate-spin text-indigo-500" size={32} />
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 mt-4 tracking-wide">
              Analyzing Atmospheric Conditions...
            </p>
          </div>
        )}

        {/* Error Screen */}
        {error && !isLoading && (
          <ErrorDisplay
            message={error}
            onClear={() => {
              setError(null);
              setSearchQuery("");
            }}
            onSelectPopular={(name) => {
              setSearchQuery(name);
              handleSearchGeocodingDirectly(name);
            }}
          />
        )}

        {/* Live Weather Analytics */}
        {!isLoading && !error && activeCity && weatherData && (
          <div id="weather-dashboard-grid" className="space-y-8 animate-fade-in">
            
            {/* Top Grid: Current conditions & Smart recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Current Weather Card */}
              <div className="lg:col-span-7">
                <CurrentWeatherCard
                  city={activeCity}
                  weather={weatherData}
                  unit={tempUnit}
                />
              </div>

              {/* Recommendations Box */}
              <div className="lg:col-span-5">
                <Recommendations weather={weatherData} />
              </div>
            </div>

            {/* Middle Grid: Charts / Analytics */}
            <div className="w-full">
              <WeatherCharts weather={weatherData} unit={tempUnit} />
            </div>

            {/* Bottom Grid: 7-day outlook */}
            <div className="w-full pt-2">
              <ForecastGrid weather={weatherData} unit={tempUnit} />
            </div>
          </div>
        )}
      </main>
    </div>
  );

  // Helper function to search geocoding directly on popular selection
  async function handleSearchGeocodingDirectly(cityName: string) {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    
    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1&language=en&format=json`;

      const response = await fetch(geoUrl);
      if (!response.ok) {
        throw new Error("Could not reach Geocoding services.");
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setError(`City "${cityName}" not found.`);
        setIsLoading(false);
        return;
      }

      fetchWeather(data.results[0]);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during search.");
      setIsLoading(false);
    }
  }
}
