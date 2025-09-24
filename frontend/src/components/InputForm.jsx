// src/components/InputForm.jsx
import React, { useState } from "react";
import Card from "./Card";

const numericFields = new Set([
  "temperature_c_",
  "humidity_",
  "soil_moisture",
  "reference_evapotranspiration",
  "evapotranspiration",
  "crop_coefficient",
  "nitrogen_mg_kg_",
  "phosphorus_mg_kg_",
  "potassium",
  "solar_radiation_ghi",
  "wind_speed",
  "ph",
]);

export default function InputForm() {
  const [formData, setFormData] = useState({
    temperature_c_: "",
    humidity_: "",
    soil_moisture: "",
    reference_evapotranspiration: "",
    evapotranspiration: "",
    crop_coefficient: "",
    nitrogen_mg_kg_: "",
    phosphorus_mg_kg_: "",
    potassium: "",
    solar_radiation_ghi: "",
    wind_speed: "",
    ph: "",
  });

  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (numericFields.has(name)) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setPrediction(null);

    // Convert numeric strings to numbers for submission
    const payload = {};
    Object.entries(formData).forEach(([key, val]) => {
      payload[key] = val === "" ? null : Number(val);
    });

    try {
      const res = await fetch(
        "https://1ce5t6va9e.execute-api.ap-south-1.amazonaws.com/agridata",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPrediction(data.predicted_water_required_mm_day);
      } else {
        alert("Error: " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      temperature_c_: "",
      humidity_: "",
      soil_moisture: "",
      reference_evapotranspiration: "",
      evapotranspiration: "",
      crop_coefficient: "",
      nitrogen_mg_kg_: "",
      phosphorus_mg_kg_: "",
      potassium: "",
      solar_radiation_ghi: "",
      wind_speed: "",
      ph: "",
    });
    setErrors({});
    setPrediction(null);
  };

  const fields = [
    ["temperature_c_", "Temperature (°C)"],
    ["humidity_", "Humidity (%)"],
    ["soil_moisture", "Soil moisture (raw)"],
    ["reference_evapotranspiration", "Reference evapotranspiration"],
    ["evapotranspiration", "Evapotranspiration"],
    ["crop_coefficient", "Crop coefficient (Kc)"],
    ["nitrogen_mg_kg_", "Nitrogen (N)"],
    ["phosphorus_mg_kg_", "Phosphorus (P)"],
    ["potassium", "Potassium (K)"],
    ["solar_radiation_ghi", "Solar radiation (W/m²)"],
    ["wind_speed", "Wind speed (m/s)"],
    ["ph", "pH"],
  ];

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-black mb-2">Farmer Input Form</h2>
      <p className="muted mb-4">
        Fill the values below and press Submit to send to your ML endpoint.
      </p>

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
              autoComplete="off"
            />
            {errors[name] && (
              <div className="text-xs text-red-600 mt-1">{errors[name]}</div>
            )}
          </div>
        ))}

        <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-white text-black border border-gray-200 rounded-lg shadow-sm"
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {prediction !== null && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-md text-green-800 font-semibold">
          Predicted Water Required (mm/day): {prediction}
        </div>
      )}
    </Card>
  );
}
