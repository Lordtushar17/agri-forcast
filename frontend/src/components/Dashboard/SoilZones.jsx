// src/components/Dashboard/SoilZones.jsx
import React from "react";
import Card from "../Card";
import ZoneCard from "../ZoneCard";

export default function SoilZones({ zones = [], onToggleManual }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-semibold text-black">Soil & Zones</h2>
        <span className="text-sm muted">Real-time sensors</span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {zones.map((z) => (
          <ZoneCard key={z.id} zone={z} onToggleManual={onToggleManual} />
        ))}
      </div>
    </Card>
  );
}
