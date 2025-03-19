import React from "react";
import Plot from "react-plotly.js";
import { useState, useEffect } from "react";

const NonRenewable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/total-nonrenewable") // fetching data from API
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const totalEnergyValues = data;

  const D_data = [
    {
      y: totalEnergyValues,
      type: "violin",
      box: { visible: true },
      meanline: { visible: true },
      points: "all",
      jitter: 0.05,
      name: "Data",
      fillcolor: "rgba(245, 18, 101, 0.6)",
      line: {
        color: "rgb(245, 18, 101)",
        width: 2,
      },
    },
  ];

  const layout = {
    title: "NonRenewable Violin Plot of 224 Float Values",
    yaxis: { title: "Values", range: [0, 5000000] },
    height: 600,
    width: 800,
  };

  return (
    <div>
      <Plot
        data={D_data}
        layout={layout}
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true }}
      />
    </div>
  );
};

export default NonRenewable;
