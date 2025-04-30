import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const BelangrijkeFactorenChart = ({
  matchData,
  selectedAanbeveling
}) => {
  console.log("TESSSSSSST", selectedAanbeveling);

  if (!matchData || !matchData.belangrijksteFactoren) return null;

  const actieveAanbeveling = selectedAanbeveling;

  const data = matchData.belangrijksteFactoren.map((factor) => {
    const baseValue = factor.invloed;

    // Zoek extra impact op basis van actieve aanbeveling
    let extra = 0;
    if (actieveAanbeveling && factor.impactDoorAanbevelingen?.length) {
      const match = factor.impactDoorAanbevelingen.find(
        (imp) => imp.aanbeveling === actieveAanbeveling.aanbeveling
      );
      if (match) {
        extra = parseFloat(match.impactScore?.replace("%", "")) || 0;
      }
    }

    return {
      label: factor.naam,
      base: baseValue,
      extra
    };
  });

  const labels = data.map((d) => d.label);
  const baseValues = data.map((d) => d.base);
  const extraValues = data.map((d) => d.extra);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Basis invloed",
        data: baseValues,
        backgroundColor: "#e0e0e0",
        borderRadius: 4,
        categoryPercentage: 0.4,
        barPercentage: 1.0
      },
      {
        label: "Extra invloed",
        data: extraValues,
        backgroundColor: "#ba68c8",
        borderRadius: 4,
        categoryPercentage: 0.4,
        barPercentage: 1.0
      }
    ]
  };

  const options = {
    indexAxis: "y",
    layout: { padding: { top: 0, bottom: 0 } },
    interaction: { mode: "nearest", axis: "y", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: {
        title: { display: true, text: "Impact op matching score (%)" },
        ticks: { callback: (val) => `${val}%` },
        stacked: true,
        grid: {
          drawTicks: false,
          drawBorder: false,
          color: (ctx) => (ctx.tick.value === 0 ? "#999" : "transparent")
        }
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: { autoSkip: false, padding: 0 }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <Paper elevation={1} sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" sx={{ mb: 0 }}>
        Belangrijke factoren
      </Typography>
      <Box sx={{ flexGrow: 1, height: 200, position: "relative", overflowX: "auto" }}>
        <Bar data={chartData} options={options} />
      </Box>
    </Paper>
  );
};

export default BelangrijkeFactorenChart;
