import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import DonutChartMini from "./DonutChartMini";

const AanbevelingenPerMatch = ({
  candidateId,
  vacancyId,
  onSelectAanbeveling,
  selectedAanbeveling,
}) => {
  const [matchData, setMatchData] = useState(null);
  // flag whether current selectedAanbeveling was set by click
  const clickedRef = useRef(false);

  useEffect(() => {
    const fetchMatchingData = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/matching");
        const data = await response.json();
        const match = data.find(
          (m) => m.kandidaatId === candidateId && m.vacatureId === vacancyId
        );
        setMatchData(match);
      } catch (error) {
        console.error("Fout bij ophalen matchingsdata:", error);
      }
    };
    fetchMatchingData();
  }, [candidateId, vacancyId]);

  const isSame = (a, b) => a && b && JSON.stringify(a) === JSON.stringify(b);

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
        <Typography variant="h6" sx={{ mb: 1 }}>
          Aanbevelingen
        </Typography>
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
      </Paper>
    </Box>
  );
};

export default AanbevelingenPerMatch;
