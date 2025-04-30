import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import DonutChart from "../VacanciesDashboard/Charts/DonutChart";

const VacancyHeader = ({ vacancyData, matchData, selectedAanbeveling }) => {
  if (!vacancyData || !matchData) return null;

  const aanbevolenVerbetering = selectedAanbeveling?.impactScore
    ? parseFloat(selectedAanbeveling.impactScore.replace("%", ""))
    : 0;

  const verbetering = matchData.verbeterPotentieel || 0;

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "#fff",
        border: "1px solid #ccc",
        borderRadius: 2,
        px: 1.5,
        py: 0.5,
        mb: 0,
      }}
    >
      <Grid container spacing={1}>
        {/* Linkerzijde: titel + info */}
        <Grid item xs={11}>
          <Grid container spacing={1.5}>
            <InfoItem
              value={vacancyData.titel}
              bold
              gridSize={12}
            />
            <InfoItem label="Loon" value={vacancyData.loon} gridSize={2.5} />
            <InfoItem label="Plaats" value={vacancyData.locatie} gridSize={2.5} />
            <InfoItem label="Bedrijf" value={vacancyData.bedrijf} gridSize={1.5} />
            <InfoItem label="Contract" value={vacancyData.contract} gridSize={1} />
            <InfoItem label="Werkregime" value={vacancyData.werkregime} gridSize={1} />
            <InfoItem label="Tijdregeling" value={vacancyData.tijdregeling} gridSize={1} />
            <InfoItem
              label="Woon-werk afstand"
              value={matchData.afstand || "Onbekend"}
              gridSize={2}
            />
          </Grid>
        </Grid>

        {/* Rechterzijde: DonutChart */}
        <Grid item xs={1}>
          <Box
            sx={{
              width: "100%",
              maxWidth: 73,
              aspectRatio: "1 / 1",
              ml: "auto",
            }}
          >
            <DonutChart
              score={matchData.matchScore}
              verbetering={verbetering}
              aanbevelingVerbetering={aanbevolenVerbetering}
              threshold={parseInt(vacancyData.threshold?.replace("%", ""))}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const InfoItem = ({ label, value, bold = false, gridSize = 2 }) => (
  <Grid item xs={gridSize}>
    <Box sx={{ overflowWrap: "break-word", wordBreak: "break-word" }}>
      {label && (
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: "0.75rem", lineHeight: 1 }}
        >
          {label}
        </Typography>
      )}
      <Typography
        variant="body2"
        sx={{
          fontWeight: bold ? 600 : 500,
          fontSize: "0.9rem",
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
    </Box>
  </Grid>
);

export default VacancyHeader;
