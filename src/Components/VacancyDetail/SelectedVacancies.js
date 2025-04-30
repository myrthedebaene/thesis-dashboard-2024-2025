import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Tooltip,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams, useNavigate } from "react-router-dom";

const SelectedVacancies = ({ vacancies, selectedKeys, onSelect, onRemove, activeCandidateKey }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeVacancyId = searchParams.get("vacatureId");
  const [activeTab, setActiveTab] = useState(activeVacancyId || "");

  useEffect(() => {
    setActiveTab(activeVacancyId);
  }, [activeVacancyId]);

  if (!selectedKeys || selectedKeys.length === 0) return null;

  const handleTabChange = (event, newValue) => {
    if (newValue === "__add__") {
      handleAddVacancy();
    } else {
      setActiveTab(newValue);
      onSelect(newValue);
    }
  };

  const handleAddVacancy = () => {
    if (activeCandidateKey) {
      navigate(`/vacancies?candidate=${activeCandidateKey}`);
    }
  };

  return (
    <Box
      sx={{
        borderBottom: 0,
        borderColor: "divider",
        mb: 0,
      }}
    >
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 'none', // ❌ zet uit om dubbele lijn te vermijden
          '& .MuiTabs-indicator': {
            display: 'none', // ❌ verberg standaard indicator
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            minHeight: '40px',
            fontSize: '0.85rem',
            px: 1.5,
            py: 0.5,
            borderRadius: '8px 8px 0 0',
            mr: 1,
            backgroundColor: '#f0f0f0',
            '&:hover': {
              backgroundColor: '#e0e0e0',
            },
          },
          '& .Mui-selected': {
            backgroundColor: '#ffffff',
            fontWeight: 600,
            boxShadow: 'inset 0 -2px 0 #1976d2', // ✅ blauwe onderlijn als pseudo-border
          },
        }}
      >
        {selectedKeys.map((vacancyId) => {
          const vacancy = vacancies[vacancyId];
          if (!vacancy) return null;

          return (
            <Tab
              key={vacancyId}
              value={vacancyId}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 120,
                    }}
                  >
                    {vacancy.titel}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(vacancyId);
                    }}
                    sx={{
                      ml: 0.5,
                      p: 0,
                      color: "black",
                      "&:hover": {
                        color: "red",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            />
          );
        })}

        {/* ➕ Tab voor toevoegen */}
        <Tab
  value="__add__"
  icon={<AddIcon fontSize="small" />}   // ⬅️ kleinere icoon
  sx={{
    minWidth: 36,
    width: 36,
    px: 0.5,
    py: 0.5,
    backgroundColor: '#e8f0fe',
    '&:hover': {
      backgroundColor: '#dce8fd',
    },
    borderRadius: '6px 6px 0 0',
  }}
/>

      </Tabs>
    </Box>
  );
};

export default SelectedVacancies;
