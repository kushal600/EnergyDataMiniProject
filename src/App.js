import React, { useState } from "react";
import "./App.css";
import WorldMap from "./components/WorldMap";
import RenewableEnergy from "./components/RenewableEnergy";
import NonRenewable from "./components/NonRenewable";
import ViolinPlot from "./components/TotalEnergy";

function App() {
  const [activeView, setActiveView] = useState("map"); // 'map' or 'summary'
  const [activeSummary, setActiveSummary] = useState("renewable"); // 'renewable', 'nonRenewable', 'violinPlot'

  return (
    <div className="App">
      <h1>Global Renewable Energy Visualization</h1>

      {/* Main Navigation Buttons */}
      <div className="btn-group">
        <button
          className={activeView === "map" ? "active" : ""}
          onClick={() => setActiveView("map")}
        >
          Map
        </button>
        <button
          className={activeView === "summary" ? "active" : ""}
          onClick={() => setActiveView("summary")}
        >
          Summary Data
        </button>
      </div>

      {/* Conditional Rendering for Main Content */}
      {activeView === "map" && <WorldMap />}

      {activeView === "summary" && (
        <div className="summary-container">
          <div className="btn-group">
            <button
              className={activeSummary === "renewable" ? "active" : ""}
              onClick={() => setActiveSummary("renewable")}
            >
              Renewable Energy
            </button>
            <button
              className={activeSummary === "nonRenewable" ? "active" : ""}
              onClick={() => setActiveSummary("nonRenewable")}
            >
              Non-Renewable Energy
            </button>
            <button
              className={activeSummary === "violinPlot" ? "active" : ""}
              onClick={() => setActiveSummary("violinPlot")}
            >
              Violin Plot
            </button>
          </div>

          {/* Conditional Rendering for Summary Components */}
          <div className="card">
            {activeSummary === "renewable" && <RenewableEnergy />}
            {activeSummary === "nonRenewable" && <NonRenewable />}
            {activeSummary === "violinPlot" && <ViolinPlot />}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
