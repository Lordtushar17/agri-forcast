import React from "react";

export default function EntryCard({ entry, index, formatValue }) {
  const header = entry.fid || entry.id || entry.timestamp || `Entry #${index + 1}`;

  const flatten = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const out = {};
    Object.keys(obj).forEach((k) => {
      const val = obj[k];
      if (val && typeof val === "object" && (val.N || val.S || val.BOOL || val.NULL)) {
        if (val.N) out[k] = Number(val.N);
        else if (val.S) out[k] = val.S;
        else if (val.BOOL !== undefined) out[k] = Boolean(val.BOOL);
        else if (val.NULL) out[k] = null;
        else out[k] = val;
      } else {
        out[k] = val;
      }
    });
    return out;
  };

  const flat = flatten(entry);
  const keys = Object.keys(flat).sort((a, b) => a.localeCompare(b));

  const localFormatValue = (v) => {
    if (formatValue) return formatValue(v);
    if (v === null || v === undefined) return "—";
    if (typeof v === "number") {
      if (!Number.isInteger(v)) return Number.parseFloat(v).toFixed(3).replace(/\.?0+$/, "");
      return v;
    }
    return String(v);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm text-gray-600">Record</div>
          <div className="font-medium text-gray-900">{header}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-800">
        {keys.map((k) => (
          <div key={k} className="flex items-start gap-3">
            <div className="w-36 text-xs text-gray-500">{k.replace(/_/g, " ")}</div>
            <div className="font-medium">{localFormatValue(flat[k])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
