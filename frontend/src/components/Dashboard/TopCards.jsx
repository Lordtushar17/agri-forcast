// src/components/Dashboard/TopCards.jsx
import React from "react";
import WeatherCard from "../WeatherCard";
import PredictionCard from "../PredictionCard";
import GaugeCard from "../GaugeCard";
import CropCycle from "../CropCycle";

export default function TopCards({ weather, prediction, onSimulate, tankLevel }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <WeatherCard weather={weather} />
      <PredictionCard prediction={prediction} onSimulate={onSimulate} />
      <GaugeCard title="Tank Level" value={tankLevel} unit="%" color="blue" />
      <CropCycle stageIndex={1} />
    </div>
  );
}
