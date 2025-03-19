import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F"];

export default function PieChartComponent({ data }) {
  // Custom tooltip to show percentage on hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const percent = (
        (payload[0].value / data.reduce((acc, cur) => acc + cur.value, 0)) *
        100
      ).toFixed(1);
      return (
        <div
          style={{
            background: "white",
            padding: "8px",
            borderRadius: "5px",
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{payload[0].name}</strong>
          </p>
          <p style={{ margin: 0 }}>Percentage: {percent}%</p>
        </div>
      );
    }
    return null;
  };

  if (!data)
    return (
      <p style={{ textAlign: "center", color: "#7f8c8d" }}>No data available</p>
    );
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
      <PieChart width={500} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value, percent }) => `${value.toFixed(2)} GWh`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            paddingTop: "10px",
            fontSize: "16px",
            textAlign: "center",
          }}
        />
      </PieChart>
    </div>
  );
}
