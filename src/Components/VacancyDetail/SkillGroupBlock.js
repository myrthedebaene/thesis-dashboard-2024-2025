import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SkillLevelsChart from "./SkillLevelsChart";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import RadioGroupBlock from "./RadioGroupBlock";
import CloseIcon from "@mui/icons-material/Close";

const UitlegDialog = ({ open, onClose, chartVariant }) => {
  const uitlegTekst = chartVariant === "1" ? (
    <>
      <Typography variant="subtitle2" gutterBottom>
        <strong>Schaal van 1 tot 4 per competentie:</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        1 = Beginner<br />
        2 = Basiskennis<br />
        3 = Bekwaam<br />
        4 = Expert
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        <strong>Wat toont de grafiek?</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        • Donkere ingekleurde blokjes: huidig niveau van de kandidaat<br />
        • Lichter gekleurde blokjes: potentiële verbetering via AI-aanbeveling<br />
        • Lijn met "Med.": mediaan van werknemers in gelijkaardige functies<br />
        • Groen vakje onderaan: minimumvereiste level voor de job
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        <strong>Hoe gebruik je deze info?</strong>
      </Typography>
      <Typography variant="body2">
      • Controleer of de kandidaat voldoet aan de verwachtingen<br />
      • Zie waar verbetering mogelijk is<br />
      • Klik op een aanbeveling om de impact te zien op een competentie (paarse blokjes) 
      </Typography>
    </>
  ) : (
    <>
      <Typography variant="subtitle2" gutterBottom>
        <strong>Schaal van 1 tot 4 per competentie:</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        1 = Beginner<br />
        2 = Basiskennis<br />
        3 = Bekwaam<br />
        4 = Expert
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        <strong>Wat toont de grafiek?</strong>
      </Typography>
      <Typography variant="body2" gutterBottom>
        • Donkere ingekleurde blokjes: huidig niveau van de kandidaat<br />
        • Lijn met "Pot.": potentiële verbetering via AI-aanbeveling<br />
        • Lijn met "Med.": mediaan van werknemers in gelijkaardige functies<br />
        • Groen vakje onderaan: minimumvereiste level voor de job
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        <strong>Hoe gebruik je deze info?</strong>
      </Typography>
      <Typography variant="body2">
      • Controleer of de kandidaat voldoet aan de verwachtingen<br />
      • Zie waar verbetering mogelijk is<br />
      • Klik op een aanbeveling om de impact te zien op een competentie (paarse blokjes) 
      </Typography>
    </>
  );
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          p: 2,
          bgcolor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Hoe lees je deze grafiek?</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#fafafa", px: 3, py: 2 }}>
        {uitlegTekst}
      </DialogContent>
    </Dialog>
  );
};
const SkillGroupBlock = ({
  title,
  skills = [],
  vacatureSkills = [],
  onSelectAanbeveling,
  selectedAanbeveling,
  candidate,
  vacature
}) => {
  const isAttitude = title === "Attitudes en karaktertrekken";
  const isKennis = title === "Kennis";
  const [openDialog, setOpenDialog] = useState(false);
  const [chartVariant, setChartVariant] = useState("1");

 

  // Sorteer skills op afwijking van drempel (rood → oranje → groen)
  const sortedSkills = skills.slice().sort((a, b) => {
    const vacA = vacatureSkills.find((v) => v.name === a.naam);
    const vacB = vacatureSkills.find((v) => v.name === b.naam);
    const thresholdA = parseInt(vacA?.threshold?.replace("level", "")) || 1;
    const thresholdB = parseInt(vacB?.threshold?.replace("level", "")) || 1;
    const diffA = a.huidig < thresholdA ? thresholdA - a.huidig : -1; // -1 = drempel gehaald
    const diffB = b.huidig < thresholdB ? thresholdB - b.huidig : -1;
    return diffB - diffA; // grootste afwijking eerst
  });

  return (
    <Paper
      elevation={1}
      sx={{
        p: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >

      {/* Titel + hulpicoon */}
   {/* Titel + hulpicoon + toggle rechtsboven */}
<Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
  <Typography variant="h6">{title}</Typography>

  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    {/* Toggle buttons rechtsboven */}
    <ToggleButtonGroup
      size="small"
      exclusive
      value={chartVariant}
      onChange={(e, val) => val && setChartVariant(val)}
      sx={{
        height: 28,
        "& .MuiToggleButton-root": {
          px: 1.2,
          minWidth: 28,
          fontSize: "0.75rem",
        },
      }}
    >
      <ToggleButton value="1">1</ToggleButton>
      <ToggleButton value="2">2</ToggleButton>
    </ToggleButtonGroup>

    {/* Helpicoon */}
    <IconButton size="small" onClick={() => setOpenDialog(true)}>
      <HelpOutlineIcon fontSize="small" />
    </IconButton>
  </Box>
</Box>


      {/* Skills */}
      {skills.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Geen data beschikbaar.</Typography>
      ) : isAttitude ? (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {sortedSkills.map((skill) => {
            const vacatureInfo = vacatureSkills.find((v) => v.name === skill.naam);
            const threshold = parseInt(vacatureInfo?.threshold?.replace("level", "")) || 1;
            const gemiddelde = vacatureInfo?.gemiddelde ?? Math.max(threshold - 1, 1);
            return (
              <Grid item xs={12} key={skill.name}>
                <SkillLevelsChart
                  name={skill.naam}
                  current={skill.huidig || 0}
                  verbetering={skill.verbetering || 0}
                  gemiddelde={gemiddelde}
                  threshold={parseInt(vacatureInfo?.threshold?.replace("level", "")) || 1}
                  onSelectAanbeveling={onSelectAanbeveling}
                  selectedAanbeveling={selectedAanbeveling}
                  variant={chartVariant}
                  vacature={vacature}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {sortedSkills.map((skill) => {
            const vacatureInfo = vacatureSkills.find((v) => v.name === skill.naam);
            const threshold = parseInt(vacatureInfo?.threshold?.replace("level", "")) || 1;
            const gemiddelde = vacatureInfo?.gemiddelde ?? Math.max(threshold - 1, 1);
            return (
              <SkillLevelsChart
                key={skill.naam}
                name={skill.naam}
                current={skill.huidig || 0}
                verbetering={skill.verbetering || 0}
                gemiddelde={gemiddelde}
                threshold={parseInt(vacatureInfo?.threshold?.replace("level", ""))|| 1}
                onSelectAanbeveling={onSelectAanbeveling}
                selectedAanbeveling={selectedAanbeveling}
                variant={chartVariant}
                vacature={vacature}
              />
            );
          })}
        </Box>
      )}

      {/* Extra info bij kennis */}
      {isKennis && (
        <Box sx={{ mt: 0 }}>
          <RadioGroupBlock
            title="Werkervaring"
            options={["Geen", "<1 jaar", "1-3 jaar", ">3 jaar"]}
            selected={candidate?.werkervaring || "Geen"}
          />
          <Box sx={{ mt: 2 }}>
            <RadioGroupBlock
              title="Diploma"
              options={["Geen", "Lager onderwijs", "Secundair", "Hoger onderwijs", "Universitair"]}
              selected={candidate?.diploma || "Geen diploma"}
            />
          </Box>
        </Box>
      )}

     {/* Tooltip dialog */}
     <UitlegDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        chartVariant={chartVariant}
      />
    </Paper>
  );
};

export default SkillGroupBlock;
