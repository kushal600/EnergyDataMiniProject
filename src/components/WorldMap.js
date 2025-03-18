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
  const [activeTab, setActiveTab] = useState("pie"); // 'pie' or 'bar'
  const [selectedRegion, setSelectedRegion] = useState(""); // Region filter
  const [regions, setRegions] = useState([]);
  // Fetching regions from the backend API
  useEffect(() => {
    fetch("http://localhost:5000/regions") // Fetch regions from API
      .then((response) => response.json())
      .then((data) => {
        setRegions(data); // setting available regions
      })
      .catch((error) => console.error("Error fetching regions:", error));
  }, []);

  // Fetching countries based on selected region
  useEffect(() => {
    if (selectedRegion) {
      fetch(`http://localhost:5000/countries/${selectedRegion}`) // Fetch countries for the selected region
        .then((response) => response.json())
        .then((data) => {
          setEnergyCountries(data); // setting available countries based on region
        })
        .catch((error) => console.error("Error fetching countries:", error));
    }
  }, [selectedRegion]);

  // useEffect(() => {
  //   fetch("/data/processed_energy_data.json") // Load your processed energy data
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log("Fetched data:", data);
  //       energyDataRef.current = data;
  //       setEnergyData(data);

  //       const countrySet = data.map((entry) => entry.Country);
  //       setEnergyCountries(countrySet); // setting available countries from the dataset

  //       setBarData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error loading data:", error);
  //     });
  // }, []);

  //fetching data from backend (just getting all coutries name)
  useEffect(() => {
    fetch("http://localhost:5000/countries") // Fetch from API
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched", data);
        setEnergyCountries(data); // setting available countries from the dataset

        // setBarData(data);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // This function is without using backed API
  // const handleCountryClick = (event, feature) => {
  //   const countryName = feature.properties.name;

  //   setSelectedCountry(countryName);

  //   const countryData = energyDataRef.current?.find(
  //     (entry) => entry.Country === countryName
  //   );

  //   if (countryData) {
  //     setCountryEnergy([
  //       { name: "Renewable", value: countryData["Total Renewable"] },
  //       { name: "Non-Renewable", value: countryData["Total Non-Renewable"] },
  //     ]);

  //     setBarData([
  //       { name: "Renewable", value: countryData["Total Renewable"] },
  //       { name: "Non-Renewable", value: countryData["Total Non-Renewable"] },
  //       { name: "Total", value: countryData["Total Energy"] },
  //     ]);

  //     console.log(countryData);
  //     setModalOpen(true);
  //   } else {
  //     setCountryEnergy(null);
  //     setBarData(null);
  //   }
  // };
  const handleCountryClick = (event, feature) => {
    const countryName = feature.properties.name;

    setSelectedCountry(countryName);

    fetch(`http://localhost:5000/energy/${countryName}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setCountryEnergy(null);
          setBarData(null);
          return;
        }

        setCountryEnergy([
          { name: "Renewable", value: data.TotalRenewable },
          { name: "Non-Renewable", value: data.TotalNonRenewable },
        ]);

        setBarData([
          { name: "Renewable", value: data.TotalRenewable },
          { name: "Non-Renewable", value: data.TotalNonRenewable },
          {
            name: "Total",
            value: data.TotalEnergy,
          },
        ]);
        setActiveTab("pie"); // Default to Pie Chart when opening modal
        setModalOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching energy data:", error);
      });
  };

  const getCountryStyle = (feature) => {
    const countryName = feature.properties.name;
    const isInDataset = energyCountries.includes(countryName);
    const isHovered = hoveredCountry === countryName;

    return {
      // fillColor: isInDataset ? "#3498db" : "#b2bec3", // Light gray for the countries
      fillColor: isInDataset ? "#1abc9c" : "#b2bec3", // Light gray for the countries
      weight: isHovered ? 2.5 : 1, // Thicker border on hover
      color: isHovered ? "#2c3e50" : "#7f8c8d", // Darker border on hover
      fillOpacity: isHovered ? 0.9 : 0.7, // Slight highlight effect
      transition: "all 0.3s ease-in-out", // Smooth transition
    };
  };

  return (
    <div>
      <div
        style={{
          textAlign: "center",
          marginBottom: "10px",
          position: "relative",
        }}
      >
        {/* Region Filter Dropdown */}
        <select
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSearchQuery(""); // Reset search query when changing region
          }}
          style={{
            padding: "8px",
            marginRight: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        >
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <div
          style={{
            display: "inline-block",
            position: "relative",
            fontSize: "1rem",
          }}
        >
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
              fontSize: "1rem",
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
              color: "#ff416c",
              fontSize: "1rem",
            }}
          >
            {dropdownOpen ? "▲" : "▼"} {/* Arrow Toggle */}
          </button>

          {/* Dropdown List */}
          {dropdownOpen && (
            <ul
              className="dropdown-menu"
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
                    color: "#ff416c", // Darker border
                    fillOpacity: 0.9,
                  });
                  layer.bringToFront();
                }, 10); // Small delay to force re-render
              },

              mouseout: () => {
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
          close
        </button>
        <h2 style={{ textAlign: "center" }}>
          {selectedCountry} Energy Breakdown
        </h2>
        {/* Tabs for Pie Chart and Bar Chart */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            className={activeTab === "pie" ? "tab active" : "tab"}
            onClick={() => setActiveTab("pie")}
          >
            Energy Split
          </button>
          <button
            className={activeTab === "bar" ? "tab active" : "tab"}
            onClick={() => setActiveTab("bar")}
          >
            Comparison
          </button>
        </div>

        {/* Conditional Rendering of Charts */}
        {activeTab === "pie" && <PieChartComponent data={countryEnergy} />}
        {activeTab === "bar" && <Bar barData={barData} />}
      </Modal>

      {/* Styles for Tabs */}
      <style>
        {`
          .tab {
            padding: 10px 15px;
            border: none;
            cursor: pointer;
            font-size: 16px;
            border-radius: 5px;
            background: #ecf0f1;
            transition: all 0.3s ease-in-out;
          }

          .tab:hover {
            background: #bdc3c7;
          }

          .active {
            background: #3498db;
            color: white;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
}
