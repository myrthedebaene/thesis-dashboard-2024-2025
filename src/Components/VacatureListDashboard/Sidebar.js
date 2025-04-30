// src/components/VacanciesDashboard/CandidateSidebar.js
import React,  { useEffect, useState, useContext } from "react";
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
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getInitials } from "../CandidateDashboard/Helpers";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone';

 
const drawerWidth = 150;

const Sidebar = ({
  candidates,
  selectedCandidates,
  onRemoveCandidate,
  onSelectCandidate,
  activeCandidateKey
}) => {



  const navigate = useNavigate();
  


  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          p: 1,
          display: { md: "block" },
        },
      }}
    >
      

<Box mt="auto" p={1} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
  <Button variant="outlined" fullWidth onClick={() => navigate("/")}>
     Terug naar kandidaten
  </Button>
</Box>

    </Drawer>
  );
};

export default Sidebar;
