import React from 'react';
import Plot from 'react-plotly.js';
import  { useRef, useState, useEffect } from 'react';

const RenewableEnergy = () => {
  // Example array of 224 float values (replace with your actual data)
//   const dataArray = Array.from({ length: 224 }, () => Math.random() * 10 - 5); // Random floats between -5 and 5
//   const chartRef = useRef(null);
  const [data, setData] = useState([]);

  // Load JSON data from the file
  useEffect(() => {
    fetch("/data/processed_energy_data.json")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error loading JSON data:", error));
  }, []);
  const totalEnergyValues = data.map((country) => country["Total Renewable"]);
  console.log(totalEnergyValues);
  // Define the violin plot trace
  const D_data = [
    {
      y: totalEnergyValues,           // Your 224 float values
      type: 'violin',
      box: { visible: true }, // Show a box plot inside
      meanline: { visible: true }, // Show the mean line
      points: 'all',          // Show all data points
      jitter: 0.05,           // Slight spread for points
      name: 'Data',           // Legend name (optional)
    },
  ];

  // Layout configuration
  const layout = {
    title: 'Violin Plot of 224 Float Values',
    yaxis: { title: 'Values' ,range:[0,5000000]},
    height: 600,            // Adjust height as needed
    width: 800,             // Adjust width as needed
  };

  return (
    <div>
      <Plot
        data={D_data}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        config={{ responsive: true }} // Makes the plot responsive
      />
    </div>
  );
};

export default RenewableEnergy;