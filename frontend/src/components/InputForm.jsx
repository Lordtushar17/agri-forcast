// src/components/InputForm.jsx
import React, { useState } from "react";
import Card from "./Card";

const numericFields = new Set([
  "temperature",
  "humidity",
  "soilMoisture",
  "referenceET",
  "evapotranspiration",
  "cropCoefficient",
  "nitrogen",
  "phosphorus",
  "potassium",
  "solarRadiation",
  "windSpeed",
  "ph",
]);

export default function InputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    soilMoisture: "",
    referenceET: "",
    evapotranspiration: "",
    cropCoefficient: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    solarRadiation: "",
    windSpeed: "",
    ph: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // allow empty or numeric input for numeric fields
    if (numericFields.has(name)) {
      // allow numeric characters, dot and leading minus (rare for temp)
      if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: "" }));
      }
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const validate = () => {
    const next = {};
    Object.keys(formData).forEach((k) => {
      if (numericFields.has(k) && formData[k] === "") {
        next[k] = "Required";
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // convert numeric fields to numbers
    const payload = { ...formData };
    numericFields.forEach((k) => (payload[k] = Number(payload[k])));
    console.log("Farmer Input Data -> will send to ML later:", payload);
    if (onSubmit) onSubmit(payload);
  };

  const fields = [
    ["temperature", "Temperature (°C)"],
    ["humidity", "Humidity (%)"],
    ["soilMoisture", "Soil moisture (raw)"],
    ["referenceET", "Reference evapotranspiration"],
    ["evapotranspiration", "Evapotranspiration"],
    ["cropCoefficient", "Crop coefficient (Kc)"],
    ["nitrogen", "Nitrogen (N)"],
    ["phosphorus", "Phosphorus (P)"],
    ["potassium", "Potassium (K)"],
    ["solarRadiation", "Solar radiation (W/m²)"],
    ["windSpeed", "Wind speed (m/s)"],
    ["ph", "pH"],
  ];

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-black mb-2">Farmer Input Form</h2>
      <p className="muted mb-4">Fill the values below and press Submit to send to your ML endpoint.</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(([name, label]) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="text-sm font-medium text-black mb-1">
              {label}
            </label>
            <input
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className={`border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                errors[name] ? "border-red-400" : "border-gray-300"
              }`}
              placeholder={label}
              inputMode={numericFields.has(name) ? "decimal" : "text"}
            />
            {errors[name] && <div className="text-xs text-red-600 mt-1">{errors[name]}</div>}
          </div>
        ))}

        <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={() => {
              setFormData({
                temperature: "",
                humidity: "",
                soilMoisture: "",
                referenceET: "",
                evapotranspiration: "",
                cropCoefficient: "",
                nitrogen: "",
                phosphorus: "",
                solarRadiation: "",
                windSpeed: "",
                ph: "",
              });
              setErrors({});
            }}
            className="px-4 py-2 bg-white text-black border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
          >
            Reset
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </Card>
  );
}
