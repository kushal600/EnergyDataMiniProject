import React from "react";
import Plot from "react-plotly.js";
import { useRef, useState, useEffect } from "react";

const NonRenewable = () => {
  // Example array of 224 float values (replace with your actual data)
  //   const dataArray = Array.from({ length: 224 }, () => Math.random() * 10 - 5); // Random floats between -5 and 5
  //   const chartRef = useRef(null);
  const [data, setData] = useState([]);

  // // Load JSON data from the file (withoutApi)
  // useEffect(() => {
  //   fetch("/data/processed_energy_data.json")
  //     .then((response) => response.json())
  //     .then((data) => setData(data))
  //     .catch((error) => console.error("Error loading JSON data:", error));
  // }, []);
  // const totalEnergyValues = data.map(
  //   (country) => country["Total Non-Renewable"]
  // );

  useEffect(() => {
    fetch("http://localhost:5000/total-nonrenewable") // ✅ Fetch from backend API
      .then((response) => response.json())
      .then((fetchedData) => {
        console.log("Fetched Renewable Energy Data:", fetchedData);
        setData(fetchedData); // ✅ Set state with API response
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const totalEnergyValues = data;
  console.log("FinalNonRenwable: ", totalEnergyValues);
  // Define the violin plot trace
  const D_data = [
    {
      y: totalEnergyValues, // Your 224 float values
      type: "violin",
      box: { visible: true }, // Show a box plot inside
      meanline: { visible: true }, // Show the mean line
      points: "all", // Show all data points
      jitter: 0.05, // Slight spread for points
      name: "Data", // Legend name (optional)
      fillcolor: "rgba(245, 18, 101, 0.6)", // Set the fill color (e.g., tomato red with 60% opacity)
      line: {
        color: "rgb(245, 18, 101)", // Outline color (solid tomato red)
        width: 2, // Outline width
      },
    },
  ];

  // Layout configuration
  const layout = {
    title: "Violin Plot of 224 Float Values",
    yaxis: { title: "Values", range: [0, 5000000] },
    height: 600, // Adjust height as needed
    width: 800, // Adjust width as needed
  };

  return (
    <div>
      <Plot
        data={D_data}
        layout={layout}
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true }} // Makes the plot responsive
      />
    </div>
  );
};

export default NonRenewable;
