// src/components/GaugeCard.jsx
import React from "react";
import Card from "./Card";

const colorMap = {
  blue: { track: "#E6F0FF", stroke: "#1D4ED8" },
  red: { track: "#FFECEF", stroke: "#DC2626" },
  green: { track: "#ECFDF5", stroke: "#059669" },
  default: { track: "#F3F4F6", stroke: "#111827" },
};

export default function GaugeCard({ title, value, unit, color = "default" }) {
  const conf = colorMap[color] || colorMap.default;
  const val = Number(value);
  const pct = Math.max(0, Math.min(100, Math.round(val)));
  const size = 64;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <Card className="flex items-center gap-4" accent={color !== "default" ? color : undefined}>
      <div className="flex items-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={conf.track}
            strokeWidth={stroke}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={conf.stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={offset}
            fill="transparent"
          />
          <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="text-sm font-semibold" style={{ fill: '#000' }}>
            {pct}%
          </text>
        </svg>
      </div>

      <div className="flex-1">
        <div className="text-sm text-black">{title}</div>
        <div className="mt-1 text-xl font-bold text-black">{value}{unit}</div>
        <div className="muted text-sm">Live (simulated)</div>
      </div>
    </Card>
  );
}
