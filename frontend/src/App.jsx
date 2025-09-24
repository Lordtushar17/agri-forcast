// src/App.jsx
import React from "react";
import Dashboard from "./components/Dashboard";

export default function App(){
  return (
    <div className="min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold">Agri Forecast — Demo</h1>
        <div className="text-sm text-slate-300">Hackathon · Dummy data</div>
      </header>
      <main><Dashboard/></main>
    </div>
  );
}
