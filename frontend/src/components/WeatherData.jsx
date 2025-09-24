// src/components/WeatherData.jsx
import { useEffect } from "react";

/**
 * WeatherData
 * - Fetches current weather for a city (default Pune)
 * - Logs raw payload to console
 * - Extracts: temp (°C), humidity (%), solarRadiation (W/m² approx), windSpeed (m/s)
 * - Calls onUpdate({ temp, humidity, solarRadiation, windSpeed, lastSync }) if provided
 *
 * Props:
 * - onUpdate: function to receive mapped weather
 * - refreshCounter: a number; when it changes WeatherData will re-fetch
 */
export default function WeatherData({ onUpdate, refreshCounter = 0 }) {
  useEffect(() => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "0bc3a07b050e43cb91c175456252209";
    const CITY = import.meta.env.VITE_WEATHER_CITY || "Pune";
    let mounted = true;

    const fetchWeather = async () => {
      try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
          CITY
        )}&aqi=no`;

        const resp = await fetch(url);
        if (!resp.ok) {
          console.warn("WeatherData: fetch failed", resp.status, await resp.text());
          return;
        }

        const payload = await resp.json();
        console.log("🌤 WeatherAPI response:", payload);

        const current = payload?.current || {};
        const temp = typeof current.temp_c === "number" ? current.temp_c : null;
        const humidity = typeof current.humidity === "number" ? current.humidity : null;

        const wind_kph = typeof current.wind_kph === "number" ? current.wind_kph : null;
        const windSpeed = wind_kph !== null ? +(wind_kph / 3.6).toFixed(2) : null;

        let solarRadiation = null;
        if (typeof current.uv === "number" && !Number.isNaN(current.uv)) {
          solarRadiation = Math.round(current.uv * 100);
        } else if (typeof current.cloud === "number") {
          solarRadiation = Math.round(Math.max(0, (100 - current.cloud) * 10));
        }

        const mapped = {
          temp: temp ?? "—",
          humidity: humidity ?? "—",
          solarRadiation: solarRadiation ?? "—",
          windSpeed: windSpeed ?? "—",
          lastSync: Date.now(),
        };

        if (mounted && typeof onUpdate === "function") {
          onUpdate(mapped);
        }
      } catch (err) {
        // log only
        // eslint-disable-next-line no-console
        console.error("WeatherData fetch error:", err);
      }
    };

    // initial fetch and re-fetch when refreshCounter changes
    fetchWeather();

    return () => {
      mounted = false;
    };
  }, [onUpdate, refreshCounter]);

  return null;
}
