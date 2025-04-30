import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import AIassistent from "./AIassistent";

const VacatureDashboard = () => {
  return (
    <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex" }}>
        <Sidebar/>
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflow: 'auto',
          }}
        >
          <Stack
            spacing={0.5}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >  
            <AIassistent/>
        <MainContent />
        </Stack>
        </Box>
        </Box>
    </Box>
  );
};

export default VacatureDashboard;
