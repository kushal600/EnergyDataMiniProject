import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON,useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import countryGeoJSON from "../countries.geo.json";
import PieChartComponent from "../components/PieChartComponent";
import Bar from "./Bar";
// CartoDB Positron tile layer for a clean and modern map design
const TILE_LAYER_URL =
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

export default function WorldMap() {
  const [energyData, setEnergyData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryEnergy, setCountryEnergy] = useState(null);
  const [barData, setBarData] = useState(null);
  const energyDataRef = useRef(null);

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
        setBarData(data);
        
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  // // Filter GeoJSON data to only include countries that exist in energyData
  // const filteredGeoJSON = energyData
  //   ? countryGeoJSON.features.filter((feature) => {
  //       const countryName = feature.properties.name;
  //       return energyData.some((entry) => entry.Country === countryName);
  //     })
  //   : [];

  const handleCountryClick = (event, feature) => {
    const countryName = feature.properties.name;
   
    setSelectedCountry(countryName);

    const countryData = energyDataRef.current?.find(
      (entry) => entry.Country === countryName
    );
    
    // const barData = energyDataRef.current?.find(
    //   (entry) => entry.Country === countryName
    // );
   
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
      
      
    } else {
      setCountryEnergy(null);
      setBarData(null);
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

      {/* Displaying selected country energy breakdown */}
      {selectedCountry && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedCountry} Energy Breakdown</h2>
          <PieChartComponent data={countryEnergy} />
        </div>
      )}
      {selectedCountry && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedCountry} Energy Breakdown</h2>
          <Bar barData={barData} />
        </div>
      )}

    </div>
  );
}

// import React, { useState, useEffect, useRef } from "react";
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import countryGeoJSON from "../countries.geo.json";
// import PieChartComponent from "../components/PieChartComponent";

// // CartoDB Positron tile layer for a clean and modern map design
// const TILE_LAYER_URL =
//   "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

// export default function WorldMap() {
//   const [energyData, setEnergyData] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countryEnergy, setCountryEnergy] = useState(null);
//   const energyDataRef = useRef(null);

//   useEffect(() => {
//     fetch("/data/processed_energy_data.json") // Load your processed energy data
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         // console.log("Fetched data:", data);
//         energyDataRef.current = data;
//         setEnergyData(data);
//       })
//       .catch((error) => {
//         console.error("Error loading data:", error);
//       });
//   }, []);

//   const handleCountryClick = (event, feature) => {
//         const countryName = feature.properties.name;
//         console.log(countryName);
//         setSelectedCountry(countryName);
    
//         const countryData = energyDataRef.current?.find(
//           (entry) => entry.Country === countryName
//         );
       
//         if (countryData) {
//           setCountryEnergy([
//             { name: "Renewable", value: countryData["Total Renewable"] },
//             { name: "Non-Renewable", value: countryData["Total Non-Renewable"] },
//           ]);
//           console.log(countryData);
//         } else {
//           setCountryEnergy(null);
//         }
        
//       };

//   // Improved country styling based on whether data exists
//   const getCountryStyle = (feature) => {
//     const countryName = feature.properties.name;
//     const isClickable = energyDataRef.current?.some(
//       (entry) => entry.Country === countryName
//     );

//     return {
//       fillColor: isClickable ? "#00b894" : "#b2bec3", // Green for clickable, gray for non-clickable
//       weight: 1,
//       color: "#7f8c8d", // Darker border for the countries
//       fillOpacity: 0.6, // Slight transparency
//       cursor: isClickable ? "pointer" : "default", // Pointer for clickable, default for non-clickable
//     };
//   };

//   return (
//     <div>
//       <MapContainer
//         center={[20, 0]}
//         zoom={2}
//         className="leaflet-container"
//         style={{ height: "90vh", width: "100%" }}
//       >
//         {/* CartoDB Positron tile layer */}
//         <TileLayer url={TILE_LAYER_URL} noWrap={true} />

//         {/* Filtered GeoJSON with selected countries only */}
//         <GeoJSON
//           data={countryGeoJSON}
//           style={getCountryStyle}
//           onEachFeature={(feature, layer) => {
//             const countryName = feature.properties.name;
//             const isClickable = energyDataRef.current?.some(
//               (entry) => entry.Country === countryName
//             );

//             if (isClickable) {
//               layer.on({
//                 click: (event) => handleCountryClick(event, feature),
//               });
//             }
//           }}
//         />
//       </MapContainer>

//       {/* Displaying selected country energy breakdown */}
//       {selectedCountry && (
//         <div style={{ marginTop: "20px" }}>
//           <h2>{selectedCountry} Energy Breakdown</h2>
//           <PieChartComponent data={countryEnergy} />
//         </div>
//       )}
//     </div>
//   );
// }
