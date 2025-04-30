import React, { useEffect, useState, useContext } from "react";
import CandidateSidebar from "./CandidateSidebar";
import CandidateHeader from "./CandidateHeader";
import VacancyFilters from "./VacancyFilters";
import VacancyList from "./VacancyList";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, TextField, Button } from "@mui/material";
const MainContent = ({
    salaryRange,
    setSalaryRange,
    locationFilter,
    setLocationFilter,
    radius,
    setRadius,
    contractTypes,
        handleContractTypeChange,
        tijdsregeling,
        handleTijdsregelingChange,
        werkregime,
        handleWerkregimeChange,
        partTimeHours,
        setPartTimeHours,
        candidate,
        candidateKey,
            vacancies,
            matching,
            sortedVacancyIds,
            showDetails,
            handleSelectVacancy,
            setShowDetails,
            setVacancySearch,
            vacancySearch


}) => {
    console.log("candidateMain",candidateKey)
return (
    <Box sx={{ width: '100%'}}>
      {/* cards */}
      {candidate && <CandidateHeader candidate={candidate} />}
       {/* Filters */}
       <VacancyFilters
        salaryRange={salaryRange}
        setSalaryRange={setSalaryRange}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        radius={radius}
        setRadius={setRadius}
        contractTypes={contractTypes}
        handleContractTypeChange={handleContractTypeChange}
        tijdsregeling={tijdsregeling}
        handleTijdsregelingChange={handleTijdsregelingChange}
        werkregime={werkregime}
        handleWerkregimeChange={handleWerkregimeChange}
        partTimeHours={partTimeHours}
        setPartTimeHours={setPartTimeHours}
        candidate={candidate}
      />
           {/* Zoekbalk */}
           <Paper sx={{ p: 0.2, mb: 1, backgroundColor: "#f5f5f5" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Zoek vacatures..."
              fullWidth
              size="small"
              value={vacancySearch}
              onChange={(e) => setVacancySearch(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Details verbergen" : "Toon details"}
            </Button>
          </Grid>
        </Grid>
      </Paper>
          {/* Layout: Sidebar + VacancyList */}
          <Grid container spacing={1}>
   
        <Grid item xs={12} md={12}>
          <VacancyList
            candidateKey={candidateKey}
            vacancies={vacancies}
            matching={matching}
            filteredVacancyIds={sortedVacancyIds}
            showDetails={showDetails}
            onToggleDetails={() => setShowDetails((prev) => !prev)}
            onSelectVacancy={handleSelectVacancy}
          />
        </Grid>
      </Grid>
</Box>
  );
}
export default MainContent;
