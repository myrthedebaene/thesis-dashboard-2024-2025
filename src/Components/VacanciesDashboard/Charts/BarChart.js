// src/components/VacanciesDashboard/charts/BarChart.js
import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const BarChart = ({ current, threshold, average, improvement, width = 200, height = 30 }) => {
  const canvasRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const drawHeight = height - 10;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Achtergrond
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, drawHeight);
    ctx.strokeStyle = "#ccc";
    ctx.strokeRect(0, 0, width, drawHeight);

    // Kleuren bepalen
    let mainColor, lightColor;
    const gap = threshold - current;
    if (current >= threshold) {
      mainColor = "#B9B9B9";
      lightColor = "#E4E4E4";
    } else {
      mainColor = gap < 10 ? "#E7AF60" : "#FF2D00";
      lightColor = gap < 10 ? "#FFB74D" : "#EEA6A6";
    }

    const currentWidth = (current / 100) * width;
    const improvedWidth = ((current + improvement) / 100) * width;

    // Current
    ctx.fillStyle = mainColor;
    ctx.fillRect(0, 0, currentWidth, drawHeight);

    // Score-label met witte achtergrond
    const label = `${current}%`;
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(label).width;
    const textX = 20;

    const textY = drawHeight / 2;
    ctx.fillStyle = "white";
    ctx.fillRect(textX - textWidth / 2 - 4, textY - 8, textWidth + 8, 16);
    ctx.fillStyle = "#000";
    ctx.fillText(label, textX, textY);

    // Improvement
    if (improvement > 0 && current < threshold) {
      ctx.fillStyle = lightColor;
      ctx.fillRect(currentWidth, 0, improvedWidth - currentWidth, drawHeight);
    }

    // Threshold lijn
    const threshX = (threshold / 100) * width;
    ctx.beginPath();
    ctx.moveTo(threshX, 0);
    ctx.lineTo(threshX, drawHeight);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Gemiddelde lijn
    const avgX = (average / 100) * width;
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.moveTo(avgX, 0);
    ctx.lineTo(avgX, drawHeight);
    ctx.strokeStyle = "#2196f3";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Label "gem."
    ctx.fillStyle = "#2196f3";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Gem.", avgX, height - 4);
  }, [current, threshold, average, improvement, width, height]);

  return (
    <Box sx={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        style={{ width, height, cursor: "pointer" }}
        onMouseMove={(e) => {
          const rect = e.target.getBoundingClientRect();
          setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
          setShowTooltip(true);
        }}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <Box
          sx={{
            position: 'absolute',
            top: tooltipPos.y + 10,
            left: tooltipPos.x + 10,
            backgroundColor: '#333',
            color: 'white',
            padding: '2px 6px',
            fontSize: '12px',
            borderRadius: '4px',
            pointerEvents: 'none',
            zIndex: 999,
            whiteSpace: 'nowrap'
          }}
        >
          Verbetering: {improvement}%
        </Box>
      )}
    </Box>
  );
};

export default BarChart;
