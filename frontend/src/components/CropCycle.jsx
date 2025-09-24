// src/components/CropCycle.jsx
import React from "react";
import Card from "./Card";

/**
 * Crop cycle indicator: simple progress + current stage label
 * props: stageIndex (0..n-1) and stages array
 */
export default function CropCycle({ stageIndex = 1, stages = ["Planting", "Growth", "Flowering", "Harvest"] }) {
  const pct = Math.round(((stageIndex + 1) / stages.length) * 100);
  return (
    <Card>
      <div className="text-sm font-medium text-black">Crop Cycle</div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-black">{stages[stageIndex]}</div>
          <div className="muted text-sm">Stage {stageIndex + 1} of {stages.length}</div>
        </div>

        <div className="w-40">
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div style={{ width: `${pct}%` }} className="h-3 bg-blue-500" />
          </div>
          <div className="muted text-xs mt-1">{pct}% complete</div>
        </div>
      </div>
    </Card>
  );
}
