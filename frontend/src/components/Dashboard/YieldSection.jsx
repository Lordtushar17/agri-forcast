// src/components/Dashboard/YieldSection.jsx
import React from "react";
import YieldChart from "../YieldChart";

export default function YieldSection({ yieldHistory = [] }) {
  return (
    <aside className="space-y-4">
      <YieldChart data={yieldHistory} />
    </aside>
  );
}
