import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ barData }) => {
  console.log("BarData: ", typeof barData);
  const [averageData, setAverageData] = useState({
    AverageTotalRenewable: 0,
    AverageTotalNonRenewable: 0,
    AverageTotalEnergy: 0,
  });

  useEffect(() => {
    // Fetching average energy data from the backend
    fetch("http://localhost:5000/energy-averages")
      .then((response) => response.json())
      .then((data) => {
        setAverageData(data);
      })
      .catch((error) =>
        console.error("Error fetching energy averages:", error)
      );
  }, []);
  const chartData = {
    labels: ["Total", "Renewable", "Non-Renewable"],
    datasets: [
      {
        label: "Actual Values",
        data: [
          barData?.find((item) => item.name === "Total")?.value || 0,
          barData?.find((item) => item.name === "Renewable")?.value || 0,
          barData?.find((item) => item.name === "Non-Renewable")?.value || 0,
        ],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Average Values",
        data: [
          averageData.AverageTotalEnergy,
          averageData.AverageTotalRenewable,
          averageData.AverageTotalNonRenewable,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Energy Comparison Chart",
      },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        padding: "20px",
      }}
    >
      <Bar data={chartData} options={options} width={500} height={400} />
    </div>
  );
};

export default BarChart;
