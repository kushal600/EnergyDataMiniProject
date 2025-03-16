import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import countryGeoJSON from "../countries.geo.json";
import PieChartComponent from "../components/PieChartComponent";
import Modal from "react-modal";

// CartoDB Positron tile layer for a clean and modern map design
const TILE_LAYER_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

// Modal styles for smooth UI
const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark background for popup
    backdropFilter: "blur(8px)", // Adds blur effect
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "50%",
    height: "auto",
    maxWidth: "600px",
    maxHeight: "80vh",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.95)", // Light, slightly transparent background
    boxShadow: "0px 10px 25px rgba(0,0,0,0.3)",
    position: "relative",
    overflow: "hidden",
    animation: "fadeIn 0.3s ease-in-out", // Smooth fade-in animation
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default function WorldMap() {
  const [energyData, setEnergyData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryEnergy, setCountryEnergy] = useState(null);
  const energyDataRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch("/data/processed_energy_data.json") // Load your processed energy data
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        energyDataRef.current = data;
        setEnergyData(data);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  const handleCountryClick = (event, feature) => {
    const countryName = feature.properties.name;
    console.log(countryName);
    setSelectedCountry(countryName);

    const countryData = energyDataRef.current?.find(
      (entry) => entry.Country === countryName
    );

    if (countryData) {
      setCountryEnergy([
        { name: "Renewable", value: countryData["Total Renewable"] },
        { name: "Non-Renewable", value: countryData["Total Non-Renewable"] },
      ]);
      console.log(countryData);
      setModalOpen(true);
    } else {
      setCountryEnergy(null);
    }
  };

  // Improved country styling for better map appearance
  const getCountryStyle = (feature) => ({
    fillColor: "#b2bec3", // Light gray for the countries
    weight: 1,
    color: "#7f8c8d", // Darker border for the countries
    fillOpacity: 0.6, // Slight transparency
    // cursor: "pointer", // Cursor change to pointer when hovering
  });

  return (
    <div>
      <MapContainer
        scrollWheelZoom={false}
        // dragging={false}
        worldCopyJump={true}
        center={[20, 0]}
        zoom={2}
        className="leaflet-container"
        style={{ height: "90vh", width: "100%" }}
      >
        {/* CartoDB Positron tile layer */}
        <TileLayer url={TILE_LAYER_URL} noWrap={false} />

        {/* Filtered GeoJSON with selected countries only */}
        <GeoJSON
          data={countryGeoJSON}
          style={getCountryStyle}
          onEachFeature={(feature, layer) => {
            layer.on({
              click: (event) => handleCountryClick(event, feature),
            });
          }}
        />
      </MapContainer>

      {/* Modal Popup for Pie Chart */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={modalStyles}
        ariaHideApp={false} // To avoid warnings
      >
        <button
          onClick={() => setModalOpen(false)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "red",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Close
        </button>
        <h2 style={{ textAlign: "center" }}>
          {selectedCountry} Energy Breakdown
        </h2>
        <PieChartComponent data={countryEnergy} />
      </Modal>
    </div>
  );
}
