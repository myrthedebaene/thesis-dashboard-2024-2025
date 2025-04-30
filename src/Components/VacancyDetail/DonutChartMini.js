import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

const DonutChartMini = ({ percentage = 0 }) => {
  const waarde = parseFloat(percentage.toString().replace("%", ""));
  const label = `+${waarde}%`;

  const data = {
    labels: [],
    datasets: [
      {
        data: [waarde, 100 - waarde],
        backgroundColor: ["#ba68c8", "#e0e0e0"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div style={{ position: "relative", width: 36, height: 36 }}>
      <Doughnut
        data={data}
        options={{
          cutout: "70%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "0.6rem",
          fontWeight: 600,
          color: "#333",
          pointerEvents: "none",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export default DonutChartMini;
