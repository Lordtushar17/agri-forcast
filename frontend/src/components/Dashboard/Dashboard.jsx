// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import Card from "../Card";
import InputForm from "../InputForm";

// small presentational parts we moved out
import TopCards from "./TopCards";
import SoilZones from "./SoilZones";
import IrrigationTelemetry from "./IrrigationTelemetry";
import YieldSection from "./YieldSection";

// LogsModal still in Dashboard folder if you added it earlier
import LogsModal from "./LogsModal";
import EntryCard from "./EntryCard";
import WeatherData from "../WeatherData";

const initial = {
  tankLevel: 74,
  temperature: 28.4,
  humidity: 68,
  flowRate: 1.2,
  zones: [
    { id: 1, name: "Zone A", moisture: 64, status: "OK", color: "green" },
    { id: 2, name: "Zone B", moisture: 42, status: "Dry", color: "red" },
    { id: 3, name: "Zone C", moisture: 54, status: "OK", color: "blue" },
  ],
  weather: {
    temp: 28.4,
    humidity: 68,
    windSpeed: 2.1,
    solarRadiation: 450,
    lastSync: null,
  },
  yieldHistory: [
    { year: 2022, yield: 2200 },
    { year: 2023, yield: 2450 },
    { year: 2024, yield: 2600 },
  ],
};

const LOGS_API = "https://1ce5t6va9e.execute-api.ap-south-1.amazonaws.com/agridata";

export default function Dashboard() {
  // debugging log left intentionally if you need it
  // console.log("DASSSSHOBOARDDDDDD")
  const [data, setData] = useState(initial);
  const [prediction, setPrediction] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // control for WeatherData refetch (increment to trigger)
  const [weatherFetchCounter, setWeatherFetchCounter] = useState(0);

  // Logs / modal state
  const [logsOpen, setLogsOpen] = useState(false);
  const [logs, setLogs] = useState([]); // normalized array of entries
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState(null);

  // stable callback so WeatherData effect doesn't re-run every render
  const handleWeatherUpdate = useCallback((w) => {
    setData((prev) => ({ ...prev, weather: { ...prev.weather, ...w } }));
  }, []);

  // simulate fetching sensors/new telemetry
  const handleRefresh = () => {
    const newZones = data.zones.map((z) => {
      const jitter = (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 3);
      const newM = Math.max(10, Math.min(95, z.moisture + jitter));
      return { ...z, moisture: newM, status: newM < 40 ? "Dry" : "OK" };
    });

    // keep weather values from API (do not randomize)
    const newWeather = data.weather;

    setData((prev) => ({
      ...prev,
      zones: newZones,
      weather: newWeather,
      tankLevel: Math.max(10, Math.min(100, prev.tankLevel + (Math.random() > 0.7 ? -2 : 0))),
    }));

    // trigger WeatherData to fetch once more
    setWeatherFetchCounter((c) => c + 1);

    setLastRefreshed(new Date());
    console.log("Refreshed telemetry (simulated)");
  };

  const handleZoneManual = (zoneId, enabled) => {
    console.log("Zone manual toggled:", zoneId, enabled);
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted to dashboard:", formData);
    const avgSoil = data.zones.reduce((s, z) => s + z.moisture, 0) / data.zones.length;
    const et = Number(formData.evapotranspiration || formData.referenceET || 1);
    const predicted = Math.max(50, Math.round(et * 5 + (60 - avgSoil) * 8));
    setPrediction(predicted);
    setTimeout(() => {
      const el = document.querySelector("#prediction-result");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  const handleSimulatePrediction = () => {
    const avgSoil = data.zones.reduce((s, z) => s + z.moisture, 0) / data.zones.length;
    const predicted = Math.max(50, Math.round((data.weather.temp || 20) * 4 + (60 - avgSoil) * 7));
    setPrediction(predicted);

    // SMOOTH SCROLL to the farmer input form
    setTimeout(() => {
      const el = document.querySelector("#farmer-input-form");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  // === Logs fetcher & helpers (unchanged) ===
  const normalizePayloadToEntries = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.agriData)) return payload.agriData;
    if (Array.isArray(payload.Items)) return payload.Items;
    if (Array.isArray(payload.items)) return payload.items;
    if (payload.agriData && typeof payload.agriData === "object") return [payload.agriData];
    return [payload];
  };

  const fetchLogs = async () => {
    setLogsError(null);
    setLogsLoading(true);
    try {
      const resp = await fetch(LOGS_API, {
        method: "GET",
        headers: { Accept: "application/json, text/plain, */*" },
      });

      let payload;
      try {
        payload = await resp.json();
      } catch (jsonErr) {
        const text = await resp.text();
        try {
          payload = JSON.parse(text);
        } catch (parseErr) {
          payload = { raw: text };
        }
      }
      const entries = normalizePayloadToEntries(payload);
      setLogs(entries);
      setLogsOpen(true);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogsError(err.message || String(err));
      setLogs([]);
      setLogsOpen(true);
    } finally {
      setLogsLoading(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    if (!logsOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLogsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [logsOpen]);

  const closeModal = () => {
    setLogsOpen(false);
    setLogsError(null);
    setLogsLoading(false);
  };

  // helper to format numbers nicely
  const formatValue = (v) => {
    if (v === null || v === undefined) return "—";
    if (typeof v === "number") {
      if (!Number.isInteger(v)) return Number.parseFloat(v).toFixed(3).replace(/\.?0+$/, "");
      return v;
    }
    return String(v);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-black">
            Agri Forecast — Crop & Irrigation Predictor with AI
          </h1>
          <p className="muted mt-1 max-w-xl">
            Data-driven platform combining weather + yield history to predict crop cycles and irrigation schedules.
          </p>
          <div className="mt-2 text-xs muted">
            Last refresh: <span className="text-black">{lastRefreshed.toLocaleString()}</span>
          </div>
        </div>

        {/* WeatherData fetcher (silent) — fetches on mount and again when refreshCounter changes */}
        <div className="mb-4">
          <WeatherData
            refreshCounter={weatherFetchCounter}
            onUpdate={handleWeatherUpdate}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-3 py-1 rounded-md text-black bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            Refresh
          </button>

          <button
            onClick={fetchLogs}
            className="px-3 py-1 rounded-md text-white bg-gray-800 border border-gray-700 shadow-sm hover:opacity-90 transition"
            disabled={logsLoading}
            title="Fetch previous telemetry logs"
          >
            {logsLoading ? "Loading…" : "Logs"}
          </button>
        </div>
      </header>

      {/* Top row: moved to TopCards */}
      <TopCards
        weather={data.weather}
        prediction={prediction}
        onSimulate={handleSimulatePrediction}
        tankLevel={data.tankLevel}
      />

      {/* Middle: Soil / Zones and Yield */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <SoilZones zones={data.zones} onToggleManual={handleZoneManual} />

          <IrrigationTelemetry />
        </div>

        <YieldSection yieldHistory={data.yieldHistory} />
      </div>

      {/* Farmer Input Form (unchanged file) */}
      <div id="farmer-input-form" className="max-w-6xl mx-auto">
        <InputForm onSubmit={handleFormSubmit} />
      </div>

     
      {/* Logs Modal (keeps same props) */}
      <LogsModal
        open={logsOpen}
        logs={logs}
        logsLoading={logsLoading}
        logsError={logsError}
        fetchLogs={fetchLogs}
        closeModal={closeModal}
        formatValue={formatValue}
      />
    </div>
  );
}
