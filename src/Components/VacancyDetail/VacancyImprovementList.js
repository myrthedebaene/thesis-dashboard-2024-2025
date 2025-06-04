import React, { useEffect, useState, useRef } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CloseIcon from "@mui/icons-material/Close";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import DonutChartMini from "./DonutChartMini";
import matchingArray from "../../data/matching.json";
const AanbevelingenPerMatch = ({
  candidateId,
  vacancyId,
  onSelectAanbeveling,
  selectedAanbeveling,
}) => {
  const matchData = matchingArray.find(
        (m) => m.kandidaatId === candidateId && m.vacatureId === vacancyId
      ) || null;
  // flag whether current selectedAanbeveling was set by click
  const clickedRef = useRef(false);

  const UitlegDialog = ({ open, onClose }) => (
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
        <Typography variant="h6">Hoe lees je de component "Aanbevelingen"?</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#fafafa", px: 3, py: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          <strong>Wat toont de grafiek?</strong>
        </Typography>
        <Typography variant="body2" gutterBottom>
          • De donut geeft aan hoeveel procent verbetering een aanbeveling heeft op de matching score.<br />
          • Elke aanbeveling stelt een actie voor die de kandidaat kan ondernemen om bepaalde competenties te verbeteren.<br />
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          <strong>Hoe gebruik je deze info?</strong>
        </Typography>
        <Typography variant="body2">
        • Klik op een aanbeveling om het effect op de matching score te zien.<br />
        • Klik op een aanbeveling om te zien op welke competenties het een impact heeft.<br />
        </Typography>
      </DialogContent>
    </Dialog>
  );
  
  const isSame = (a, b) => a && b && JSON.stringify(a) === JSON.stringify(b);
  const [openDialog, setOpenDialog] = useState(false);
  

  const handleClick = (entry) => {
    if (!onSelectAanbeveling) return;
    const currentlySelected = selectedAanbeveling;
    const same = isSame(currentlySelected, entry);
    if (same) {
      if (clickedRef.current) {
        // was explicitly clicked, so deselect
        clickedRef.current = false;
        onSelectAanbeveling(null);
      } else {
        // was only hover-selected, now click should select
        clickedRef.current = true;
        onSelectAanbeveling(entry);
      }
    } else {
      // new entry clicked
      clickedRef.current = true;
      onSelectAanbeveling(entry);
    }
  };

  const handleMouseEnter = (entry) => {
    if (!clickedRef.current) {
      onSelectAanbeveling(entry);
    }
  };

  const handleMouseLeave = () => {
    if (!clickedRef.current) {
      onSelectAanbeveling(null);
    }
  };

  if (!matchData || !matchData.aanbevelingen?.length) return null;
  const aanbevelingen = matchData.aanbevelingen;

  return (
    <Box sx={{ mt: 0, height: "100%" }}>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
         {/* Titel + helpicoon rechtsboven */}
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
      <Typography variant="h6">Aanbevelingen</Typography>
      <IconButton size="small" onClick={() => setOpenDialog(true)}>
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Box>

        <List
          sx={{
            flexGrow: 1,
            maxHeight: 270,
            overflowY: "auto",
            pr: 0.5,
          }}
        >
          {aanbevelingen.map((entry, index) => {
            const key =
              Object.keys(entry).find((k) => k.startsWith("aanbeveling")) ||
              `aanbeveling${index + 1}`;
            const title = entry[key] || `Aanbeveling ${index + 1}`;
            const commentaar = entry.uitleg || "";
            const improvement = entry.impactScore || "+0%";

            const isActive = selectedAanbeveling && isSame(selectedAanbeveling, entry);

            return (
              <ListItem
                key={key}
                button
                onClick={() => handleClick(entry)}
                onMouseEnter={() => handleMouseEnter(entry)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  border: isActive
                    ? "2px solid #7e57c2"
                    : "1px solid #ccc",
                  backgroundColor: isActive
                    ? "#f3e5f5"
                    : "white",
                  transition: "all 0.2s",
                  alignItems: "flex-start",
                  px: 2,
                  py: 0.5,
                  "&:hover": {
                    backgroundColor: !clickedRef.current ? "#e3f2fd" : undefined,
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ position: "relative", pr: 6 }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {title}
                      </Typography>
                      <Box
                        sx={{ position: "absolute", top: 0, right: 0 }}
                      >
                        <DonutChartMini percentage={improvement} />
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ pr: 6 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", mt: 0.5 }}
                      >
                        {commentaar}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <UitlegDialog open={openDialog} onClose={() => setOpenDialog(false)} />


      </Paper>
    </Box>
  );
};

export default AanbevelingenPerMatch;
