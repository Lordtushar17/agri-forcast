// src/components/YieldChart.jsx
import React from "react";
import Card from "./Card";

/**
 * Placeholder for yield history visualization.
 * Replace with Recharts LineChart / BarChart later.
 */
export default function YieldChart({ data }) {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-black">Yield History</div>
          <div className="muted">Yield (kg/ha) — past seasons</div>
        </div>
        <div className="text-sm muted">Last 3 years</div>
      </div>

      <div className="mt-4 w-full h-40 rounded-lg border border-gray-100 flex items-center justify-center">
        <div className="muted">Yield chart placeholder — add Recharts for a line/bar chart</div>
      </div>
    </Card>
  );
}
