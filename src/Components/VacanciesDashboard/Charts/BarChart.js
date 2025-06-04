import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";

const BarChart = ({ current, threshold, average, improvement, variant, width = 200, height = 30 }) => {
  const canvasRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });
  const lightenColor = (hex, factor = 0.6) => {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
    const toHex = v => Math.round(((1 - factor) * v + factor) * 255);
    return `#${[r, g, b].map(toHex).map(x => x.toString(16).padStart(2, "0")).join("")}`;
  };
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

    // Gedeelde waarden
    const currentWidth = (current / 100) * width;
    const threshX = (threshold / 100) * width;
    const avgX = (average / 100) * width;
    const maxX = improvement < current ? ((current + improvement) / 100) * width : (improvement / 100) * width;

    if (variant === "2") {
      const gap = threshold - current;
      const mainColor = current >= threshold ? "#cdeccd" : gap < 10 ? "#ffe299" : "#F4A6A6";

      ctx.fillStyle = mainColor;
      ctx.fillRect(0, 0, currentWidth, drawHeight);

      // Huidige score label
      const label = `${current}%`;
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const textX = 20;
      const textY = drawHeight / 2;
      const textWidth = ctx.measureText(label).width;
      ctx.fillStyle = "white";
      ctx.fillRect(textX - textWidth / 2 - 4, textY - 8, textWidth + 8, 16);
      ctx.fillStyle = "#000";
      ctx.fillText(label, textX, textY);

      // Threshold lijn
      ctx.beginPath();
      ctx.moveTo(threshX, 0);
      ctx.lineTo(threshX, drawHeight);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Median + Max lijnen
      const samePos = improvement > 0 && Math.abs(avgX - maxX) < 1;

      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(avgX, 0);
      ctx.lineTo(avgX, drawHeight);
      ctx.strokeStyle = "#808080";
      ctx.stroke();

      if (improvement > 0 && !samePos) {
        ctx.beginPath();
        ctx.moveTo(maxX, 0);
        ctx.lineTo(maxX, drawHeight);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillStyle = "#808080";
      if (samePos) {
        ctx.fillText("Med., Pot.", avgX, drawHeight);
      } else {
        ctx.fillText("Med.", avgX, drawHeight);
        if (improvement > 0) ctx.fillText("Pot.", maxX, drawHeight);
      }
    } else {
      // Variant 2: visuele verbetering in opvulling
      let mainColor, lightColor;
      const gap = threshold - current;
      if (current >= threshold) {
        mainColor = "#cdeccd";
        lightColor = lightenColor("#cdeccd");
      } else {
        mainColor = gap < 10 ? "#ffe299" : "#F4A6A6";
        lightColor = gap < 10 ? lightenColor("#ffe299") : lightenColor("#F4A6A6");
      }
    
      ctx.fillStyle = mainColor;
      ctx.fillRect(0, 0, currentWidth, drawHeight);

      if (improvement > 0 && current < threshold) {
        const improvedWidth = Math.max(0, maxX - currentWidth);
        ctx.fillStyle = lightColor;
        ctx.fillRect(currentWidth, 0, improvedWidth, drawHeight);
      }

      // Label
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      const label = `${current}%`;
      const textX = 20;
      const textY = drawHeight / 2;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(textX - textWidth / 2 - 4, textY - 8, textWidth + 8, 16);
      ctx.fillStyle = "#000";
      ctx.fillText(label, textX, textY);

      // Threshold lijn
      ctx.beginPath();
      ctx.moveTo(threshX, 0);
      ctx.lineTo(threshX, drawHeight);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Mediaanlijn
      ctx.setLineDash([4, 2]);
      ctx.beginPath();
      ctx.moveTo(avgX, 0);
      ctx.lineTo(avgX, drawHeight);
      ctx.strokeStyle = "#808080";
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#808080";
      ctx.fillText("Med.", avgX, height - 4);
    }
  }, [variant, current, threshold, average, improvement, width, height]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const tooltipWidth = 100;
    const tooltipHeight = 70;
    let x = mouseX + 10;
    let y = mouseY + 10;

    if (x + tooltipWidth > width) x = mouseX - tooltipWidth - 60;
    if (y + tooltipHeight > height) y = height - tooltipHeight - 10;

    setTooltip({ visible: true, x, y });
  };



  return (
      <Box sx={{ position: "relative", width, height }}>
      <canvas
        ref={canvasRef}
        style={{ width, height, cursor: "pointer" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
        onMouseEnter={handleMouseMove}
      />
      {tooltip.visible && (
        <Box
  sx={{
    position: "absolute",
    top: 0,
    left: 0,
    transform: `translate(${tooltip.x}px, ${tooltip.y}px)`,
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    padding: "8px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    whiteSpace: "pre-line",
    fontSize: "12px",
    color: "#333",
    minWidth: "160px",
    pointerEvents: "none",
    zIndex: 20,
  }}
>
  <div><strong>Drempelwaarde:</strong> {threshold}%</div>
  <div><strong>Mediaan:</strong> {average}%</div>
  <div><strong>Potentieel:</strong> {improvement}%</div>
</Box>

      )}
    </Box>
  );
};

export default BarChart;
