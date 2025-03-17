import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ barData }) => {
  console.log("BarData: ",typeof barData);
    const [data_m, setData] = useState([]);

    useEffect(() => {
        fetch("/data/processed_energy_data.json")
            .then((response) => response.json())
            .then((data_m) => setData(data_m))
            .catch((error) => console.error("Error loading JSON data:", error));
    }, []);

    const totalEnergyValues = data_m.map((country) => country["Total Energy"]);
    const RenewableEnergy = data_m.map((country) => country["Total Non-Renewable"]);
    const NonRenewableEnergy = data_m.map((country) => country["Total Renewable"]);

    const average = totalEnergyValues.reduce((sum, value) => sum + value, 0) / totalEnergyValues.length;
    const R_average = RenewableEnergy.reduce((sum, value) => sum + value, 0) / RenewableEnergy.length;
    const N_average = NonRenewableEnergy.reduce((sum, value) => sum + value, 0) / NonRenewableEnergy.length;

    const chartData = {
        labels: ["Total", "Renewable", "Non-Renewable"],
        datasets: [
            {
                label: 'Actual Values',
                data: [
                    barData?.find(item => item.name === "Total")?.value || 0,
                    barData?.find(item => item.name === "Renewable")?.value || 0,
                    barData?.find(item => item.name === "Non-Renewable")?.value || 0
                ],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Average Values',
                data: [average, R_average, N_average],
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Energy Comparison Chart'
            }
        }
    };

    return (
        <div>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default BarChart;
