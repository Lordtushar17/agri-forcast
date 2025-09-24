// src/components/WeatherCard.jsx
import React from "react";
import Card from "./Card";

/**
 * Simple weather snapshot card that shows a few key metrics.
 * Accepts a `weather` object with { temp, humidity, windSpeed, solarRadiation }
 */
export default function WeatherCard({ weather }) {
  const w = weather || { temp: "--", humidity: "--", windSpeed: "--", solarRadiation: "--" };

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium text-black">Weather Snapshot</div>
          <div className="muted">Local weather + forecast</div>
        </div>

        <div className="text-sm text-black muted">Last sync: 5m ago</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <div className="text-xs muted">Temperature</div>
          <div className="text-lg font-semibold text-black">{w.temp} °C</div>
        </div>

        <div>
          <div className="text-xs muted">Humidity</div>
          <div className="text-lg font-semibold text-black">{w.humidity} %</div>
        </div>

        <div>
          <div className="text-xs muted">Solar radiation</div>
          <div className="text-lg font-semibold text-black">{w.solarRadiation} W/m²</div>
        </div>

        <div>
          <div className="text-xs muted">Wind speed</div>
          <div className="text-lg font-semibold text-black">{w.windSpeed} m/s</div>
        </div>
      </div>
    </Card>
  );
}
