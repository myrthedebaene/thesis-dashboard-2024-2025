import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";

const green = "#cdeccd";
const orange = "#ffe299";
const red = "#F4A6A6";
const white = "#ffffff";
const purple = "#ba68c8";

const levelLabels = {
  level1: "Beginner",
  level2: "Basis",
  level3: "Bekwaam",
  level4: "Expert",
};

const getLevelBaselineColor = (level, threshold) => {
  if (level >= threshold) return green;
  if (level === threshold - 1) return orange;
  return red;
};
const lightenColor = (hex, factor = 0.6) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
  const toHex = v => Math.round(((1 - factor) * v + factor) * 255);
  return `#${[r, g, b].map(toHex).map(x => x.toString(16).padStart(2, "0")).join("")}`;
};

const SkillLevelsChart = ({
  name,
  current,
  verbetering,
  gemiddelde,
  threshold,
  selectedAanbeveling,
  variant,
  vacature,
}) => {
  const levels = [1, 2, 3, 4];
  const candidateLevel = Math.min(current, 4);

  const [comment, setComment] = useState("");
  const impacts = selectedAanbeveling?.impact || [];
  const extra = impacts.reduce(
    (sum, imp) => (imp.naam === name ? sum + (parseInt(imp.impactScore) || 0) : sum),
    0
  );
  const impacted = extra > 0;
  const reachesThreshold = candidateLevel + extra >= threshold;

  const rawMaxLevel = impacted ? candidateLevel + extra : candidateLevel + verbetering;
  const clampedMaxLevel = Math.min(rawMaxLevel, levels.length);
  const rawGemLevel = gemiddelde;
  const clampedGemLevel = Math.max(1, Math.min(rawGemLevel, levels.length));
  const maxLeftPercent = ((clampedMaxLevel - 0.5) / levels.length) * 100;
  const gemLeftPercent = ((clampedGemLevel - 0.5) / levels.length) * 100;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          {/* Titel en info-icoon */}
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 1 }}>
            <Typography variant="body2">{name}</Typography>
            <IconButton onClick={handleOpen} size="small" sx={{ p: 0.5, height: "auto" }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
    
          {/* GRAFIEK */}
          <Box sx={{ position: "relative", display: "flex", height: 28 }}>
            {levels.map((level, index) => {
              let fillColor = white;
    
              if (variant === "1") {
                // Variant met ingekleurde verbetering
                if (impacted && level > candidateLevel && level <= candidateLevel + extra) {
                  fillColor = purple;
                } else if (level <= candidateLevel) {
                  fillColor = reachesThreshold ? green : getLevelBaselineColor(candidateLevel, threshold);                
                } else if (level <= candidateLevel + verbetering) {
                  fillColor = lightenColor(getLevelBaselineColor(candidateLevel, threshold), 0.7);

                }
              } else {
                // Variant 2 = enkel huidig niveau
                if (impacted && level > candidateLevel && level <= candidateLevel + extra) {
                  fillColor = purple;
                } else if (level <= candidateLevel) {
                  fillColor = reachesThreshold ? green : getLevelBaselineColor(candidateLevel, threshold);                
                }
              }
    
              return (
                <Box
                  key={level}
                  sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      height: "60%",
                      width: "100%",
                      backgroundColor: fillColor,
                      borderTop: "1px solid #999",
                      borderLeft: index === 0 ? "1px solid #999" : "none",
                      borderRight: "1px solid #999",
                      borderBottom: "1px solid #999",
                    }}
                  />
                  <Box sx={{ height: "2px" }} />
                  <Box sx={{ height: "25%", width: "100%", backgroundColor: getLevelBaselineColor(level, threshold) }} />
                </Box>
              );
            })}
    
            {/* Alleen tonen bij variant 2 */}
            {(gemiddelde || verbetering > 0 || impacted) && (
  <Box>
    {/* Mediaanlijn (altijd tonen) */}
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: `${gemLeftPercent}%`,
        height: "60%",
        pointerEvents: "none",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          top: -17,
          left: "50%",
          transform: "translateX(-50%)",
          color: "#808080",
        }}
      >
        Med.
      </Typography>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          borderLeft: "2px dashed #808080",
          height: "100%",
        }}
      />
    </Box>

    {/* Potentieel alleen bij variant 2 tonen */}
    {variant === "2" && (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: `${maxLeftPercent}%`,
          height: "60%",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: -17,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#808080",
          }}
        >
          Pot.
        </Typography>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            borderLeft: "2px dashed #808080",
            height: "100%",
          }}
        />
      </Box>
    )}
  </Box>
)}

          </Box>
    
          {/* Labels onderaan */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
            {levels.map((level) => (
              <Typography key={level} variant="caption" sx={{ flex: 1, textAlign: "center", color: "#555" }}>
                Level {level}
              </Typography>
            ))}
          </Box>
        </Box>
    
        {/* Dialoog met uitleg */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{ p: 2, bgcolor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <Typography variant="h6">Meer info over {name}</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3, bgcolor: "#fafafa" }}>
            <Typography variant="body1" sx={{ mb: 2, color: "#333" }}>
              Hieronder zie je wat elk niveau betekent voor <strong>{name}</strong>.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, height: 300 }}>
              <TableContainer component={Paper} variant="outlined" sx={{ flex: 2 }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#fff" }}>
                    <TableRow>
                      <TableCell>Level</TableCell>
                      <TableCell>Naam</TableCell>
                      <TableCell>Uitleg</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {levels.map((level) => {
                      const key = `level${level}`;
                      const uitleg =
                        ([...(vacature.vaardigheden || []), ...(vacature.kennis || []), ...(vacature.attitudeEnPersoonlijkeKenmerken || [])]
                          .find((i) => i.name === name)?.levels?.[key]) || "-";
                      return (
                        <TableRow key={level} hover sx={level === current ? { bgcolor: "#e3f2fd" } : {}}>
                          <TableCell>{level}</TableCell>
                          <TableCell>{levelLabels[key]}</TableCell>
                          <TableCell>{uitleg}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
    
              <Box sx={{ flex: 1, height: "100%", display: "flex", flexDirection: "column", p: 1, bgcolor: "#fafafa", borderRadius: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    placeholder="Typ hier je opmerking..."
                    multiline
                    variant="outlined"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{
                      borderRadius: 1,
                      bgcolor: "white",
                      width: "100%",
                      height: "100%",
                      overflow: "auto",
                    }}
                    InputProps={{
                      sx: {
                        overflow: "auto",
                        alignItems: "flex-start",
                        padding: 1,
                        bgcolor: "white",
                        height: "100%",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
    
};

export default SkillLevelsChart;
