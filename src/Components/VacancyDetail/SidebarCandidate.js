// src/components/VacanciesDashboard/CandidateSidebar.js
import React from "react";
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getInitials } from "./Helpers";
import { useNavigate } from "react-router-dom";

const drawerWidth = 82;

const CandidateSidebar = ({
  candidates,
  selectedCandidates,
  onRemoveCandidate,
  onSelectCandidate,
  activeCandidateKey
}) => {
  const navigate = useNavigate();

  const handleGoToCandidatePage = () => {
    navigate(`/`);
  };

  const handleRemoveAndGoToDashboard = (key) => {
    onRemoveCandidate(key);
    navigate(`/`);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          p: 0,
          display: { md: "block" },
        },
      }}
    >
      <Box sx={{ mt: 'calc(var(--template-frame-height, 0px) + 4px)', px: 2 }}>
        <Typography variant="h6">Kand.</Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {selectedCandidates.length === 0 ? (
          <Typography variant="body2" sx={{ px: 2, py: 1 }}>
            Geen geselecteerde kand.
          </Typography>
        ) : (
          <List dense>
            {selectedCandidates.map((key) => {
              const candidate = candidates[key];
              if (!candidate) {
                return (
                  <ListItem key={key} disablePadding>
                    <ListItemText primary={`Kandidaat ${key}`} />
                  </ListItem>
                );
              }

              return (
                <ListItem key={key} disablePadding secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAndGoToDashboard(key);
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                }>
                 <ListItemButton
  selected={key === activeCandidateKey}
  onClick={() => onSelectCandidate(key)}
  sx={{
    borderRadius: 1,
    '&.Mui-selected': {
      backgroundColor: '#e3f2fd',
      fontWeight: 'bold',
      color: '#1976d2',
      '&:hover': {
        backgroundColor: '#d0e7fb',
      },
    },
  }}
>
 
  <ListItemText primary={getInitials(candidate)} />
</ListItemButton>

                </ListItem>
              );
            })}
          </List>
        )}

        <Box mt="auto" p={1}>
          <Button variant="contained" fullWidth onClick={handleGoToCandidatePage}>
            +
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CandidateSidebar;
