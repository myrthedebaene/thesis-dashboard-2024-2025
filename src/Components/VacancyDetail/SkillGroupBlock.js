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
import RadioGroupBlock from "./RadioGroupBlock";

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

  const uitlegTekst = `
Elke skill wordt geëvalueerd op een schaal van 1 tot 4:

1 = Beginner
2 = Basiskennis
3 = Bekwaam
4 = Expert

De grafiek toont voor elke skill:
• Het huidige niveau van de kandidaat (donkere blokjes).
• Een mogelijke verbetering op basis van AI-aanbevelingen (lichtere blokjes).
• De gemiddelde score van andere werknemers in gelijkaardige functies (blauwe stippellijn).
• Het minimumvereiste niveau voor deze job (groen vakje onderaan per kolom).

Gebruik deze info om te zien:
- Of de kandidaat voldoet aan de verwachtingen.
- Waar verbetering mogelijk is.
- Welke aanbevelingen de grootste impact hebben wanneer er een aanbeveling is aangeklikt (blokjes worden paars).
`;


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
      <Box sx={{ display: "flex", alignItems: "center", mb: 0 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton size="small" onClick={() => setOpenDialog(true)}>
          <HelpOutlineIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Skills */}
      {skills.length === 0 ? (
        <Typography variant="body2" color="text.secondary">Geen data beschikbaar.</Typography>
      ) : isAttitude ? (
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          {skills.map((skill) => {
            const vacatureInfo = vacatureSkills.find((v) => v.name === skill.naam);
            return (
              <Grid item xs={12} key={skill.name}>
                <SkillLevelsChart
                  name={skill.naam}
                  current={skill.huidig || 0}
                  verbetering={skill.verbetering || 0}
                  gemiddelde={vacatureInfo?.gemiddelde || 1}
                  threshold={parseInt(vacatureInfo?.threshold?.replace("level", "")) || 1}
                  onSelectAanbeveling={onSelectAanbeveling}
                  selectedAanbeveling={selectedAanbeveling}
                  vacature={vacature}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {skills.map((skill) => {
            const vacatureInfo = vacatureSkills.find((v) => v.name === skill.naam);
            return (
              <SkillLevelsChart
                key={skill.naam}
                name={skill.naam}
                current={skill.huidig || 0}
                verbetering={skill.verbetering || 0}
                gemiddelde={vacatureInfo?.gemiddelde || 1}
                threshold={parseInt(vacatureInfo?.threshold?.replace("level", ""))|| 1}
                onSelectAanbeveling={onSelectAanbeveling}
                selectedAanbeveling={selectedAanbeveling}
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

      {/* Tooltip Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Hoe lees je deze grafiek?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {uitlegTekst}
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default SkillGroupBlock;
