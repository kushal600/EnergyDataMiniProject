import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import countryGeoJSON from "../countries.geo.json";
import PieChartComponent from "../components/PieChartComponent";
import Modal from "react-modal";
import Bar from "./Bar";


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
  const [energyCountries, setEnergyCountries] = useState([]);
  const [energyData, setEnergyData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryEnergy, setCountryEnergy] = useState(null);
  const [barData, setBarData] = useState(null);
  const energyDataRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);


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

        const countrySet = data.map((entry) => entry.Country);
        setEnergyCountries(countrySet); // setting available countries from the dataset

        setBarData(data);

      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  const handleCountryClick = (event, feature) => {
    const countryName = feature.properties.name;
   
    setSelectedCountry(countryName);

    const countryData = energyDataRef.current?.find(
      (entry) => entry.Country === countryName
    );

    if (countryData) {
      setCountryEnergy([
        { name: "Renewable", value: countryData["Total Renewable"] },
        { name: "Non-Renewable", value: countryData["Total Non-Renewable"] },
       
      ]);
      
      setBarData([
        { name: "Renewable", value: countryData["Total Renewable"] },
        { name: "Non-Renewable", value: countryData["Total Non-Renewable"] },
        { name: "Total", value: countryData["Total Energy"] },
      ]);

      console.log(countryData);
      setModalOpen(true);

    } else {
      setCountryEnergy(null);
      setBarData(null);
    }
  };

  const getCountryStyle = (feature) => {
    const countryName = feature.properties.name;
    const isInDataset = energyCountries.includes(countryName);
    const isHovered = hoveredCountry === countryName;
    return {
      fillColor: isInDataset ? "#3498db" : "#b2bec3", // Light gray for the countries
      weight: isHovered ? 2.5 : 1, // Thicker border on hover
      color: isHovered ? "#2c3e50" : "#7f8c8d", // Darker border on hover
      fillOpacity: isHovered ? 0.9 : 0.7, // Slight highlight effect
      transition: "all 0.3s ease-in-out", // Smooth transition
    };
  };

  return (
    <div>
      {/* Dropdown with Search Functionality */}
      {/* <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "8px", width: "200px", marginRight: "5px" }}
        />
        <select
          onChange={(e) => {
            const selected = e.target.value;
            if (selected) {
              handleCountryClick(null, { properties: { name: selected } });
            }
          }}
          style={{ padding: "8px" }}
        >
          <option value="">Select a country</option>
          {energyCountries
            .filter((country) =>
              country.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
        </select>
      </div> */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        <div style={{ display: "inline-block", position: "relative" }}>
          <input
            type="text"
            placeholder="Search country..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setDropdownOpen(true); // Open dropdown when typing
            }}
            onFocus={() => setDropdownOpen(true)} // Show dropdown when input is focused
            style={{
              padding: "8px",
              width: "200px",
              marginRight: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
            style={{
              padding: "8px",
              cursor: "pointer",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginLeft: "-5px", // Keep button attached to input
            }}
          >
            {dropdownOpen ? "▲" : "▼"} {/* Arrow Toggle */}
          </button>

          {/* Dropdown List */}
          {dropdownOpen && (
            <ul
              style={{
                position: "absolute",
                width: "100%",
                maxHeight: "150px",
                overflowY: "auto",
                listStyleType: "none",
                padding: "5px",
                margin: "0",
                border: "1px solid #ccc",
                background: "white",
                borderRadius: "5px",
                zIndex: 1000,
              }}
            >
              {energyCountries
                .filter((country) =>
                  country.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((country, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      handleCountryClick(null, {
                        properties: { name: country },
                      });
                      setDropdownOpen(false); // Close dropdown on selection
                      setSearchQuery(country); // Set search bar text
                    }}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    {country}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

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
            const countryName = feature.properties.name;
            // const isInDataset = energyCountries.has(countryName);

            layer.on({
              click: (event) => handleCountryClick(event, feature),
              mouseover: () => {
                console.log(`Hovered: ${countryName}`); // Debugging

                console.log("inside if condition");
                setTimeout(() => {
                  layer.setStyle({
                    weight: 3,
                    color: "#2c3e50", // Darker border
                    fillOpacity: 0.9,
                  });
                  layer.bringToFront();
                }, 10); // Small delay to force re-render
              },

              mouseout: () => {
                console.log(`Mouse left: ${countryName}`); // Debugging

                setTimeout(() => {
                  layer.setStyle({
                    weight: 1,
                    color: "#7f8c8d",
                    fillOpacity: 0.7,
                  });
                  layer.bringToBack();
                }, 10);
              },
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


      {selectedCountry && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedCountry} Energy Breakdown</h2>
          <Bar barData={barData} />
        </div>
      )}


    </div>
  );
}
