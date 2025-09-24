// src/components/ZoneCard.jsx
import React from "react";
import Card from "./Card";

const accentFor = (color) => {
  if (color === "green") return "bg-green-500";
  if (color === "red") return "bg-red-500";
  if (color === "blue") return "bg-blue-500";
  return "bg-gray-400";
};

export default function ZoneCard({ zone }) {
  const { name, moisture, status, color = "green" } = zone;
  const pct = Math.max(0, Math.min(100, Math.round(moisture)));
  const accent = accentFor(color);

  return (
    <Card className="border-l-0" accent={color}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-black">{name}</div>
          <div className="muted text-xs">Soil moisture</div>
        </div>

        <div className="text-lg font-bold text-black">{pct}%</div>
      </div>

      <div className="mt-3 w-full rounded-full bg-gray-100 h-3 overflow-hidden">
        <div className={`h-3 ${accent}`} style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm">
          <span className={`inline-flex items-center gap-2 text-xs`}>
            <span className={`w-2 h-2 rounded-full ${accent}`} />
            <span className="text-black">{status}</span>
          </span>
        </div>

        <div>
          <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-200 shadow-sm text-black">Manual</button>
        </div>
      </div>
    </Card>
  );
}
