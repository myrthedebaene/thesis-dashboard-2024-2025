// src/components/CandidateDashboard/CandidateDashboard.js
import { Box, Grid, Paper, Typography, Button, Stack, TextField, Select, MenuItem } from "@mui/material";
import React from 'react';
import { useState } from "react";
import {FormControl, InputLabel} from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import TableCandidate from "./TableCandidates";
import CandidateFormDialog from "./CandidateFormDialog";
const MainContent = ({
    handleAdd,
    filtered,
    handleSelect,
    handleEdit,
    handleDelete,
    openForm,
    formMode,
    handleFormSubmit,
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    setOpenForm,
    formData
}) => {
    const [selectedCandidate, setSelectedCandidate] = useState(null);

const handleView = (id, candidate) => {
  setSelectedCandidate({ id, ...candidate });
};

    return(
        <Box sx={{ width: '100%'}}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, mb: 1, border: "1px solid #ccc", borderRadius: "4px" }}>
                <Typography variant="h4">Kandidaten</Typography>
                <Button variant="contained" onClick={handleAdd}>
                <ForumIcon sx={{ mr: 1 }} /> Kandidaat Toevoegen
            </Button>
            </Box>
            
            <Paper sx={{ p: 1, mb: 1, backgroundColor: "#f5f5f5" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Zoeken op naam..."
                            fullWidth
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="status-select">Status</InputLabel>
                        <Select
                            labelId="status-select"
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value=""><em>Alles</em></MenuItem>
                            <MenuItem value="Actief">Actief</MenuItem>
                            <MenuItem value="Niet Actief">Niet Actief</MenuItem>
                        </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>
            <TableCandidate
            candidates={filtered}
            onSelect={handleSelect}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            />

                    
                
            <CandidateFormDialog
                open={openForm}
                onClose={() => setOpenForm(false)}
                onSubmit={handleFormSubmit}
                mode={formMode}
                candidate={formData}
            />
                </Box>
                
    )

}

export default MainContent;