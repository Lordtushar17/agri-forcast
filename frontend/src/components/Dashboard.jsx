// src/components/Dashboard.jsx
import React, { useState } from "react";
import GaugeCard from "./GaugeCard";
import ZoneCard from "./ZoneCard";
import Card from "./Card";
import InputForm from "./InputForm";
import PredictionCard from "./PredictionCard";
import WeatherCard from "./WeatherCard";
import YieldChart from "./YieldChart";
import CropCycle from "./CropCycle";

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
  },
  yieldHistory: [
    { year: 2022, yield: 2200 },
    { year: 2023, yield: 2450 },
    { year: 2024, yield: 2600 },
  ],
};

export default function Dashboard() {
  const [data, setData] = useState(initial);
  const [prediction, setPrediction] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // simulate fetching sensors/new telemetry
  const handleRefresh = () => {
    // simple randomized demo updates (keeps same ranges)
    const newZones = data.zones.map((z) => {
      const jitter = (Math.random() < 0.5 ? -1 : 1) * Math.round(Math.random() * 3);
      const newM = Math.max(10, Math.min(95, z.moisture + jitter));
      return { ...z, moisture: newM, status: newM < 40 ? "Dry" : "OK" };
    });

    const newWeather = {
      ...data.weather,
      temp: +(data.weather.temp + (Math.random() - 0.5) * 1.5).toFixed(1),
      humidity: Math.max(20, Math.min(95, Math.round(data.weather.humidity + (Math.random() - 0.5) * 4))),
      windSpeed: +(data.weather.windSpeed + (Math.random() - 0.5) * 0.6).toFixed(1),
    };

    setData((prev) => ({
      ...prev,
      zones: newZones,
      weather: newWeather,
      tankLevel: Math.max(10, Math.min(100, prev.tankLevel + (Math.random() > 0.7 ? -2 : 0))),
    }));
    setLastRefreshed(new Date());
    console.log("Refreshed telemetry (simulated)");
  };

  const handleSettings = () => {
    // placeholder: open settings modal later — for now log
    console.log("Open settings (not implemented yet)");
    alert("Settings modal - implement later");
  };

  const handleZoneManual = (zoneId, enabled) => {
    // handle toggling manual for a zone — maybe log or update state
    console.log("Zone manual toggled:", zoneId, enabled);
    // as demo: set a transient notification area (console + small UI)
  };

  // when form submits, call ML endpoint later.
  // For demo, we simulate a prediction using a simple heuristic:
  const handleFormSubmit = (formData) => {
    console.log("Form submitted to dashboard:", formData);
    // simple heuristic for demo: base = evapotranspiration * 5 + (60 - avgSoilMoisture)*8
    const avgSoil = data.zones.reduce((s, z) => s + z.moisture, 0) / data.zones.length;
    const et = Number(formData.evapotranspiration || formData.referenceET || 1);
    const predicted = Math.max(50, Math.round(et * 5 + (60 - avgSoil) * 8));
    // show predicted value
    setPrediction(predicted);
    // scroll to prediction result (UX nicety)
    setTimeout(() => {
      const el = document.querySelector("#prediction-result");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  // simulate when user clicks simulate prediction button
  const handleSimulatePrediction = () => {
    // re-run same heuristic with latest telemetry
    const avgSoil = data.zones.reduce((s, z) => s + z.moisture, 0) / data.zones.length;
    const predicted = Math.max(50, Math.round((data.weather.temp || 20) * 4 + (60 - avgSoil) * 7));
    setPrediction(predicted);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-black">
            Agri Forecast — Crop & Irrigation Predictor
          </h1>
          <p className="muted mt-1 max-w-xl">
            Data-driven platform combining weather + yield history to predict crop cycles and irrigation schedules.
          </p>
          <div className="mt-2 text-xs muted">Last refresh: <span className="text-black">{lastRefreshed.toLocaleString()}</span></div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="px-3 py-1 rounded-md text-black bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            Refresh
          </button>

        </div>
      </header>

      {/* Top row: Weather, Prediction, Tank, Crop Cycle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <WeatherCard weather={data.weather} />
        <PredictionCard prediction={prediction} onSimulate={handleSimulatePrediction} />
        <GaugeCard title="Tank Level" value={data.tankLevel} unit="%" color="blue" />
        <CropCycle stageIndex={1} />
      </div>

      {/* Middle: Soil / Zones and Yield */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold text-black">Soil & Zones</h2>
              <span className="text-sm muted">Real-time sensors</span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.zones.map((z) => (
                <ZoneCard key={z.id} zone={z} onToggleManual={handleZoneManual} />
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 className="text-black font-semibold">Irrigation Telemetry</h3>
              <div className="text-sm muted">Flow & usage</div>
            </div>

            <div className="mt-4 w-full h-36 rounded-lg border border-gray-100 flex items-center justify-center">
              <div className="muted">Telemetry chart placeholder</div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <YieldChart data={data.yieldHistory} />
          <Card>
            <h3 className="text-black font-semibold">Alerts & Recommendations</h3>
            <div className="mt-3 text-sm">
              <div className="text-black">No critical alerts</div>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 rounded-md bg-red-50 border border-red-200 text-red-600 text-xs">
                  Dry: Zone B
                </span>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* Farmer Input Form (single page) */}
      <div className="max-w-6xl mx-auto">
        <InputForm onSubmit={handleFormSubmit} />
      </div>

      {/* Prediction result placeholder under the form */}
      <div id="prediction-result" className="mt-6 max-w-3xl mx-auto">
        <Card>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-black">Prediction Result</div>
              <div className="muted">ML response will appear here after integration</div>
            </div>

            <div className="text-2xl font-bold text-black">
              {prediction === null ? "—" : `${prediction} L/day`}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
