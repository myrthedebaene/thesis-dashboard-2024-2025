import React, { useEffect, useState, useContext } from "react";
import CandidateSidebar from "./CandidateSidebar";
import CandidateHeader from "./CandidateHeader";
import VacancyFilters from "./VacancyFilters";
import VacancyList from "./VacancyList";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, TextField, Button } from "@mui/material";
import { ToggleButtonGroup, ToggleButton } from "@mui/material"; // voeg toe als dat nog niet gebeurt is

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
    const [chartVariant, setChartVariant] = useState("1");
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
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} md={4}>
      <TextField
        label="Zoek vacatures..."
        fullWidth
        size="small"
        value={vacancySearch}
        onChange={(e) => setVacancySearch(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} md={8}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="contained"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? "Details verbergen" : "Toon details"}
        </Button>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={chartVariant}
          onChange={(e, val) => val && setChartVariant(val)}
          aria-label="Grafiekstijl"
        >
          <ToggleButton value="1">1</ToggleButton>
          <ToggleButton value="2">2</ToggleButton>
        </ToggleButtonGroup>
      </Box>
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
            chartVariant={chartVariant}
            onSelectVacancy={handleSelectVacancy}
          />
        </Grid>
      </Grid>
</Box>
  );
}
export default MainContent;
