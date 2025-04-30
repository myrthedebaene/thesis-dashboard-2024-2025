import React, { useEffect, useState, useContext } from "react";
import { Box, Typography } from "@mui/material";
import { IconButton, Dialog, DialogTitle, DialogContent } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
//import { levelsPerSkillUitleg } from "../../Data/levelsPerSkillUitleg";

const green = "#cdeccd";
const orange = "#ffe299";
const red = "#F4A6A6";
//const darkGray = "#b0b0b0";
//const lightGray = "#e0e0e0";
const white = "#ffffff";
const purple = "#ba68c8";
const levelLabels = {
  level1: "Beginner",
  level2: "Basis",
  level3: "Bekwaam",
  level4: "Expert",
};

const lightenColor = (hex, factor = 0.6) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255);
  const toHex = (v) => Math.round(((1 - factor) * v + factor) * 255);
  return `#${[r, g, b].map(toHex).map((x) => x.toString(16).padStart(2, "0")).join("")}`;
};

const isGreenLike = (hex) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return g > r && g > b;
};

const SkillLevelsChart = ({
  name,
  current,
  verbetering,
  gemiddelde,
  threshold,
  selectedAanbeveling,
  vacature
}) => {
  console.log("vacature", vacature)
  const levels = [1, 2, 3, 4];
  const candidateLevel = Math.min(current, 4);

  let extraVerbetering = 0;
  if (selectedAanbeveling?.impact?.length) {
    console.log("selectedAanbeveling", selectedAanbeveling)
    selectedAanbeveling.impact.forEach((impactItem) => {
        console.log("impact", impactItem)
      const [key, value] = Object.entries(impactItem)[0];
      if (value === name) {
        console.log("value en name", value, name)
        extraVerbetering += parseInt(impactItem.impactScore) || 0;
      }
    });
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getLevelBaselineColor = (level) => {
    if (level >= threshold) return green;
    if (level === threshold - 1) return orange;
    return red;
  };

  const candidateBaseColor = getLevelBaselineColor(candidateLevel);
  const candidateIsGreen = isGreenLike(candidateBaseColor);
  const candidateColor = candidateBaseColor;
  const improvementColor = lightenColor(candidateBaseColor, 0.4);
  const impacts = selectedAanbeveling?.impact || [];
  const extra = impacts.reduce((sum, imp) => imp.naam === name ? sum + (parseInt(imp.impactScore) || 0) : sum, 0);
  const impacted = extra > 0;
  const reachesThreshold = candidateLevel + extra >= threshold;
        //----------------------------
        // EERSTE BOX: box met kandidaat level voor barchart
        // TWEEDE BOX: box voor naam en icoon
        // DERDE BOX: box voor barchart
        //----------------------------
  return (
    
    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>     
      {/*
<Box
  sx={{
    width: 32,
    height: 50,
    mr: 1.5,
    borderRadius: 2,
    backgroundColor: improvementColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#000",
    fontSize: "1.5rem",
    border: "1px solid #999",
  }}
>
  {candidateLevel}
</Box>
*/}

      <Box sx={{ flex: 1}}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <Typography variant="body2">{name}</Typography>
          <IconButton onClick={handleOpen} size="small" aria-label={`Meer info over ${name}`} sx={{ p: 0.5, height: 'auto' }}>
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", height: 28, position: "relative" }}>
          {levels.map((level, index) => {
            let fillColor = white;
            if (impacted) {
              // indien aanbeveling threshold haalt, baseline groen, extra region paars
              if (reachesThreshold) {
                if (level <= candidateLevel) fillColor = green;
                else if (level <= candidateLevel + extra) fillColor = purple;
              } else {
                // aanbeveling niet genoeg voor threshold: baseline origineel, extra paars
                if (level <= candidateLevel) fillColor = getLevelBaselineColor(candidateLevel);
                else if (level <= candidateLevel + extra) fillColor = purple;
              }
            } else {
              // geen aanbeveling: origineel gedrag
              if (level <= candidateLevel) fillColor = getLevelBaselineColor(candidateLevel);
              else if (level <= candidateLevel + verbetering) fillColor = lightenColor(getLevelBaselineColor(candidateLevel));
            }

            return (
              <Box
                key={level}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
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
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {gemiddelde === level && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        bottom: 0,
                        width: 0,
                        display: "flex",
                        left: "50%",
                        right: 0,
                        alignItems: "flex-start",
                        zIndex: 5,
                        pointerEvents: "none",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontSize: "10px",
                          color: "#808080",
                        }}
                      >
                        Gem.
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 19,
                          bottom: 0,
                          left: "50%",
                          borderLeft: "2px dashed #808080",
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box sx={{ height: "2px" }} />
                <Box sx={{ height: "25%", width: "100%", backgroundColor: getLevelBaselineColor(level) }} />
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
          {levels.map((level) => (
            <Box
              key={level}
              sx={{
                flex: 1,
                textAlign: "center",
                fontSize: "0.7rem",
                color: "#555",
              }}
            >
              Level {level}
            </Box>
          ))}
        </Box>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Meer info over {name}</DialogTitle>
        <DialogContent>
  <Typography variant="body1" sx={{ mb: 2 }}>
    Hieronder zie je wat elk niveau betekent voor <strong>{name}</strong>.
  </Typography>

  <Box component="table" sx={{ width: "100%", borderCollapse: "collapse", fontSize: "1rem" }}>
  <Box component="thead" sx={{ bgcolor: "#f0f0f0" }}>
  <Box component="tr">
    <Box component="th" sx={{ textAlign: "left", py: 1, px: 1, borderBottom: "2px solid #ccc", width: "10%" }}>Level</Box>
    <Box component="th" sx={{ textAlign: "left", py: 1, px: 1, borderBottom: "2px solid #ccc", width: "15%" }}>Naam</Box>
    <Box component="th" sx={{ textAlign: "left", py: 1, px: 1, borderBottom: "2px solid #ccc", width: "50%" }}>Uitleg</Box>
    <Box component="th" sx={{ textAlign: "left", py: 1, px: 1, borderBottom: "2px solid #ccc", width: "25%" }}>Opmerkingen</Box>
  </Box>
</Box>

    <Box component="tbody">
      {[1, 2, 3, 4].map((level, index) => {
        const levelKey = `level${level}`;
        const uitleg = (
          [...(vacature.vaardigheden || []),
           ...(vacature.kennis || []),
           ...(vacature.attitudeEnPersoonlijkeKenmerken || [])]
            .find((item) => item.name === name)?.levels?.[levelKey]
        ) || "-";
        
          const isCurrentLevel = level === current;
      
          return (
            <Box component="tr" key={level} sx={{ backgroundColor: isCurrentLevel ? "#f1f9ff" : "transparent" }}>
              <Box component="td" sx={{ py: 1.2, px: 1.2, borderBottom: "1px solid #ddd", fontWeight: isCurrentLevel ? 700 : 400 }}>
                {level}
              </Box>
              <Box component="td" sx={{ py: 1.2, px: 1.2, borderBottom: "1px solid #ddd", fontWeight: isCurrentLevel ? 700 : 400 }}>
                {levelLabels[levelKey]}
              </Box>
              <Box component="td" sx={{ py: 1.2, px: 1.2, borderBottom: "1px solid #ddd", fontWeight: isCurrentLevel ? 700 : 400 }}>
                {uitleg}
              </Box>
              {index === 0 && (
                <Box
                  component="td"
                  rowSpan={4}
                  sx={{
                    py: 1.2,
                    px: 1.2,
                    borderBottom: "1px solid #ddd",
                    verticalAlign: "top",
                    fontStyle: "italic",
                    fontSize: "0.95rem",
                    width: "25%",
                  }}
                >
                  {/* optionele opmerking */}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
      </Box>
</DialogContent>

      </Dialog>
    </Box>
  );
};

export default SkillLevelsChart;
