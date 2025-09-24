// src/components/Dashboard/IrrigationTelemetry.jsx
import React from "react";
import Card from "../Card";

export default function IrrigationTelemetry() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-black font-semibold">Irrigation Telemetry</h3>
        <div className="text-sm muted">Flow & usage</div>
      </div>

      <div className="mt-4 w-full h-36 rounded-lg border border-gray-100 flex items-center justify-center">
        <div className="muted">Telemetry chart placeholder</div>
      </div>
    </Card>
  );
}
