import React, { useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = ({
  score,
  verbetering = 0,
  aanbevelingVerbetering = 0,
  threshold,
  width = 80,
  height = 80
}) => {
  const base = score;
  const adjustedVerbetering = Math.max(0, verbetering - aanbevelingVerbetering);
  const aanbevelingSegment = Math.max(0, Number(aanbevelingVerbetering));
  const filled = base + aanbevelingSegment + adjustedVerbetering;
  const restSegment = Math.max(0, 100 - filled);
  const totalScore = base + aanbevelingSegment;
  console.log("DonutChart 📊 totaal =", totalScore);

// 🎨 Kleurselectie op basis van threshold
let mainColor = "#f44336";   // rood
let lightColor = "#ffcdd2";  // lichtrood
if (totalScore >= threshold) {
  mainColor = "#4caf50";     // groen
  lightColor = "#c8e6c9";    // lichtgroen
} else if (totalScore >= threshold * 0.8) {
  mainColor = "#ff9800";     // oranje
  lightColor = "#ffe0b2";    // lichter oranje
}

const donutColors = [mainColor, "#ba68c8", lightColor, "#eeeeee"];

const data = {
  labels: ["Huidige score", "Aanbeveling", "Extra verbetering", "Geen verbetering"],
  datasets: [
    {
      data: [base, aanbevelingSegment, adjustedVerbetering, restSegment],
      backgroundColor: donutColors,
      borderWidth: 1,
      cutout: "70%"
    }
  ]
};

  const thresholdPlugin = {
    id: "thresholdLine",
    afterDatasetDraw(chart, args, pluginOptions) {
      const { ctx, chartArea, config } = chart;
      const { threshold } = pluginOptions;
  
      if (threshold == null || isNaN(threshold)) return;
  
      const angle = (threshold / 100) * 2 * Math.PI - 0.5 * Math.PI;
      const { width, height } = chart;
      const cx = width / 2;
      const cy = height / 2;
  
      const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
      const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
  
      const x1 = cx + innerRadius * Math.cos(angle);
      const y1 = cy + innerRadius * Math.sin(angle);
      const x2 = cx + outerRadius * Math.cos(angle);
      const y2 = cy + outerRadius * Math.sin(angle);
  
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    },
  };
  
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const tooltipWidth = 240;
  
    const showLeft = e.clientX + tooltipWidth > window.innerWidth;
  
    setTooltip({
      visible: true,
      x: showLeft ? mouseX - tooltipWidth - 10 : mouseX + 10,
      y: mouseY + 10
    });
  };
  

  return (
    <div
    style={{
      position: "relative",
      width: "100%",
      aspectRatio: "1 / 1",
    }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setTooltip((prev) => ({ ...prev, visible: true }))}
      onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
    >
<Doughnut
  data={data}
  options={{
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      thresholdLine: {
        threshold: typeof threshold === "string" && threshold.includes("%")
          ? parseInt(threshold)
          : Number(threshold),
      },
    },
    events: [],
  }}
  plugins={[thresholdPlugin]}
/>



      {/* Score in midden */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 14,
          fontWeight: "bold",
          color: "#333"
        }}
      >
        {totalScore}%
      </div>

           {/* Tooltip */}
           {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y,
            left: tooltip.x,
            fontSize: 12,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            whiteSpace: "pre-line",
            zIndex: 20,
            minWidth: 220,
            pointerEvents: "none"
          }}
        >
          <div><strong>Te verbeteren tot:</strong> {filled}%</div>
          <div style={{ marginTop: 6 }}>
            <div><span style={{ color: donutColors[0] }}>⬤</span> Huidige score: {base}%</div>
            {aanbevelingSegment > 0 && (
              <div><span style={{ color: donutColors[1] }}>⬤</span> Met aanbeveling: +{aanbevelingSegment}%</div>
            )}
            {adjustedVerbetering > 0 && (
              <div><span style={{ color: donutColors[2] }}>⬤</span> Extra potentieel: +{adjustedVerbetering}%</div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default DonutChart;
