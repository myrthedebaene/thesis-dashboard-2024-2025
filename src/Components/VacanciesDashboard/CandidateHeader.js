import React from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import CakeIcon from "@mui/icons-material/Cake";
import WcIcon from "@mui/icons-material/Wc";

const CandidateHeader = ({ candidate }) => {
  if (!candidate) return null;

  const fullAddress = `${candidate.straat}, ${candidate.nummer}, ${candidate.postcode} ${candidate.stad}, ${candidate.land}`;
  const isActief = candidate.status.toLowerCase().includes("actief");

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1,
        mb: 1,
        borderRadius: 2,
        backgroundColor: "#fafafa",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          rowGap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <PersonIcon fontSize="small" />
          <Typography variant="body1">
            {candidate.voornaam} {candidate.achternaam}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WcIcon fontSize="small" />
          <Typography variant="body1">{candidate.geslacht}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CakeIcon fontSize="small" />
          <Typography variant="body1">{candidate.geboortedatum}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LocationOnIcon fontSize="small" />
          <Typography variant="body1">{fullAddress}</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body1">Status:</Typography>
          <Chip
            label={candidate.status}
            color={isActief ? "success" : "default"}
            variant="outlined"
            size="small"
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default CandidateHeader;
