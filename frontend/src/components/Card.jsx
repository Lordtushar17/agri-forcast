// src/components/Card.jsx
import React from "react";

/**
 * Reusable Card component
 * Props:
 *  - children: node
 *  - className: string (extra tailwind classes)
 *  - accent: "blue" | "red" | "green" | undefined (adds a left accent stripe)
 *  - style: object (inline styles)
 */
export default function Card({ children, className = "", accent, style }) {
  let accentClass = "";
  if (accent === "blue") accentClass = "border-l-4 border-blue-500";
  else if (accent === "red") accentClass = "border-l-4 border-red-500";
  else if (accent === "green") accentClass = "border-l-4 border-green-500";

  return (
    <div
      className={
        `bg-white rounded-2xl border border-gray-200 p-4 shadow-sm 
         transition-transform duration-200 transform 
         hover:scale-105 hover:shadow-lg ` +
        accentClass +
        " " +
        className
      }
      style={style}
    >
      {children}
    </div>
  );
}
