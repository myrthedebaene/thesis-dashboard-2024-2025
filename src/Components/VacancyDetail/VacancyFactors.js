import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const BelangrijkeFactorenChart = ({ matchData, selectedAanbeveling }) => {
  const [openDialog, setOpenDialog] = useState(false);

  if (!matchData || !matchData.belangrijksteFactoren) return null;

  const actieveAanbeveling = selectedAanbeveling;

  const data = matchData.belangrijksteFactoren.map((factor) => {
    const baseValue = factor.invloed;

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
      {/* Titel + helpicoon */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="h6">Belangrijke factoren</Typography>
        <IconButton size="small" onClick={() => setOpenDialog(true)}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ flexGrow: 1, height: 200, position: "relative", overflowX: "auto" }}>
        <Bar data={chartData} options={options} />
      </Box>

      {/* Dialoogvenster met uitleg */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            p: 2,
            bgcolor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Hoe lees je de component "Belangrijke factoren"?</Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ bgcolor: "#fafafa", px: 3, py: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Wat toont deze grafiek?</strong>
          </Typography>
          <Typography variant="body2" gutterBottom>
            • Elke rij toont een competentie die bijdraagt aan de match tussen kandidaat en vacature (zowel positief als negatief).<br />
            • Het grijze deel toont de impact van deze factor.<br />
            • Het paarse deel toont hoeveel deze factor extra zou bijdragen als je een aanbeveling aanduidt.
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            <strong>Hoe gebruik je deze info?</strong>
          </Typography>
          <Typography variant="body2">
          • Vergelijk de lengte van de balken om te zien welke factoren het meest wegen.<br />
          • Bekijk het effect van aanbevelingen op de competenties.<br />
          • Gebruik dit om te bepalen waar de grootste winst te halen valt.
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default BelangrijkeFactorenChart;
