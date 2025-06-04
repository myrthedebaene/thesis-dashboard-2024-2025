import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// Maak kleur lichter
const lightenColor = (hex, factor = 0.5) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
  const toHex = (v) => Math.round(((1 - factor) * v + factor) * 255);
  return `#${[r, g, b].map(toHex).map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

const DonutChart = ({
  score,
  verbetering = 0,
  aanbevelingVerbetering = 0,
  threshold,
  width = 80,
  height = 80,
}) => {
  const base = score;
  const aanbevelingSegment = Math.max(0, Number(aanbevelingVerbetering));
  const adjustedVerbetering = Math.max(0, verbetering - aanbevelingVerbetering);
  const filled = base + aanbevelingSegment + adjustedVerbetering;
  const restSegment = Math.max(0, 100 - filled);
  const totalScore = base + aanbevelingSegment;

  // 🎨 Kleurselectie op basis van threshold
  let mainColor = "#F4A6A6"; // rood
  let lightColor = lightenColor(mainColor);
  if (totalScore >= threshold) {
    mainColor = "#cdeccd"; // groen
    lightColor = lightenColor(mainColor);
  } else if (totalScore >= threshold * 0.8) {
    mainColor = "#ffe299"; // oranje
    lightColor = lightenColor(mainColor);
  }

  const donutColors = [mainColor, "#ba68c8", lightColor, "#eeeeee"];

  const data = {
    labels: [
      "Huidige score",
      "Aanbeveling",
      "Extra verbetering",
      "Geen verbetering",
    ],
    datasets: [
      {
        data: [base, aanbevelingSegment, adjustedVerbetering, restSegment],
        backgroundColor: donutColors,
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  // Threshold lijn plugin
  const thresholdPlugin = {
    id: "thresholdLine",
    afterDatasetDraw(chart, _args, pluginOptions) {
      const { ctx, width: w, height: h } = chart;
      const thr = pluginOptions.threshold;
      if (thr == null || isNaN(thr)) return;
      const angle = (thr / 100) * 2 * Math.PI - 0.5 * Math.PI;
      const meta = chart.getDatasetMeta(0).data[0];
      const inner = meta.innerRadius;
      const outer = meta.outerRadius;
      const cx = w / 2;
      const cy = h / 2;
      const x1 = cx + inner * Math.cos(angle);
      const y1 = cy + inner * Math.sin(angle);
      const x2 = cx + outer * Math.cos(angle);
      const y2 = cy + outer * Math.sin(angle);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "#000";
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
    const tooltipWidth = 200;
    const showLeft = e.clientX + tooltipWidth > window.innerWidth;
    setTooltip({
      visible: true,
      x: showLeft ? mouseX - tooltipWidth - 10 : mouseX + 10,
      y: mouseY + 10,
    });
  };

  return (
    <div
      style={{ position: "relative", width: "100%", aspectRatio: "1 / 1" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setTooltip((t) => ({ ...t, visible: true }))}
      onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
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
          color: "#333",
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
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            whiteSpace: "pre-line",
            zIndex: 20,
            pointerEvents: "none",
            minWidth: 180,
            fontSize: 12,
            color: "#333",
          }}
        >
          <div><strong>Drempelwaarde:</strong> {threshold}%</div>
          <div><strong>Max te behalen score:</strong> {filled}%</div>
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
