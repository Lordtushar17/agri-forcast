// src/components/PredictionCard.jsx
import React from "react";
import Card from "./Card";

export default function PredictionCard({ prediction, onSimulate }) {
  return (
    <Card className="flex flex-col justify-center">
      <div className="text-sm font-medium text-black">Water Required (predicted)</div>

      <div className="mt-3 flex items-baseline gap-2">
        <div className="text-3xl font-extrabold text-black">
          {prediction === null ? "—" : `${prediction} L/day`}
        </div>
        <div className="muted">Predicted by ML model</div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => onSimulate && onSimulate()}
          className="px-3 py-1 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
        >
          Simulate Prediction
        </button>

        <button
          onClick={() => console.log("View prediction details (future)") }
          className="px-3 py-1 bg-white text-black border border-gray-200 rounded-md shadow-sm hover:shadow-md transition"
        >
          Details
        </button>
      </div>

      <div className="mt-3 text-sm muted">
        Submit the farmer inputs to get a daily irrigation requirement.
      </div>
    </Card>
  );
}
