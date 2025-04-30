// src/components/VacanciesDashboard/VacanciesDashboard.js
import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Grid, Paper, TextField, Button,Stack } from "@mui/material";
import CandidateSidebar from "./CandidateSidebar";
//import { vacancies } from "../../Data/vacancies";
//import { matching } from "../../Data/matching";
import MainContent from "./MainContent";
import Header from "./Header";
import { SelectedCandidatesContext } from "../SelectedCandidatesContext";
import { SelectedVacanciesContext } from "../SelectedVacanciesContext";
// voeg bovenaan toe (pad aanpassen indien nodig)
import candidatesData from "../../data/candidates.json";
import vacanciesData  from "../../data/vacatures.json";
import matchingArray  from "../../data/matching.json";

const VacanciesDashboard = () => {
  const [candidates, setCandidates] = useState(candidatesData);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedCandidates, setSelectedCandidates } = useContext(SelectedCandidatesContext);

  const [vacancies, setVacancies] = useState(vacanciesData)
  const [matching, setMatching] = useState(() => {
    const structured = {};
    for (const match of matchingArray) {
      if (!structured[match.kandidaatId]) {
        structured[match.kandidaatId] = {};
      }
      structured[match.kandidaatId][match.vacatureId] = match;
    }
    return structured;
  });

  const vacancyKey = searchParams.get("vacatureId");
  const vacancy = vacancies[vacancyKey];
  const candidateKey = searchParams.get("candidate");
  const candidate = candidates[candidateKey];
  const [selectedVacanciesAll, setSelectedVacanciesAll] = useContext(SelectedVacanciesContext);
const selectedVacancies = selectedVacanciesAll[candidateKey] || [];

console.log("candidate",candidate)





  useEffect(() => {
    localStorage.setItem("selectedVacancies", JSON.stringify(selectedVacanciesAll));
  }, [selectedVacanciesAll]);
  
  useEffect(() => {
    const stored = localStorage.getItem("selectedVacancies");
    if (stored) {
      setSelectedVacanciesAll(JSON.parse(stored));
    }
  }, []);
  
// Laad geselecteerde kandidaten uit localStorage en haal bijbehorende data op uit API

// 1. Bij eerste load → haal uit localStorage
useEffect(() => {
  const stored = localStorage.getItem("selectedCandidates");
  if (stored) {
    const selected = JSON.parse(stored);
    // log("GEVONDEN IN LOCALSTORAGE:", selected);
    setSelectedCandidates(selected);  // Hier ook loggen direct na `setSelectedCandidates`
    //console.log("selectedCandidates na set:", selected);
  } else {
    //console.log("EEN geselecteerde kandidaten in localStorage");
  }
}, []);





  // === Filter state ===
  const [vacancySearch, setVacancySearch] = useState("");
  const [radius, setRadius] = useState(5000);
  const [locationFilter, setLocationFilter] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 5000]);
  const [contractTypes, setContractTypes] = useState([]);
  const [tijdsregeling, setTijdsregeling] = useState([]);
  const [werkregime, setWerkregime] = useState([]);
  const [partTimeHours, setPartTimeHours] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  useEffect(() => {
    if (candidate && !locationFilter) {
      const fullAddress = `${candidate.straat}, ${candidate.nummer}, ${candidate.postcode} ${candidate.stad}, ${candidate.land}`;
      setLocationFilter(fullAddress);
    }
  }, [candidate]);
  
  // === Handle checkbox updates ===
  const updateCheckboxFilter = (value, list, setList) =>
    setList((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const handleContractTypeChange = (e) => updateCheckboxFilter(e.target.name, contractTypes, setContractTypes);
  const handleTijdsregelingChange = (e) => updateCheckboxFilter(e.target.name, tijdsregeling, setTijdsregeling);
  const handleWerkregimeChange = (e) => updateCheckboxFilter(e.target.name, werkregime, setWerkregime);

  // === Aangeraden vacatures ===
  const matchedVacancyIds = candidateKey && matching[candidateKey]
    ? Object.keys(matching[candidateKey])
    : [];
    const filteredVacancyIds = matchedVacancyIds.filter((id) => {
      const vacancy = vacancies[id];
      console.log("VACANCY", vacancy)
      if (!vacancy) return false; 
      const match = matching[candidateKey][id];
    
      const titleMatches = vacancy.titel.toLowerCase().includes(vacancySearch.toLowerCase());
      const distance = parseInt(match.afstand.replace(" km", ""), 10); /////// !!!!!!!!!!!!!!!! aanpassen
      const locationMatches = true; // !!!!!!!!!!!!!!! aanpassen
      const distanceMatches = !isNaN(distance) && distance <= radius;
    
      const contractMatch = contractTypes.length === 0 || contractTypes.includes(vacancy.contract);
      const tijdsregelingMatch = tijdsregeling.length === 0 || tijdsregeling.includes(vacancy.tijdregeling);
      const werkregimeMatch = werkregime.length === 0 || werkregime.includes(vacancy.werkregime);
    
      return (
        titleMatches &&
        locationMatches &&
        distanceMatches &&
        contractMatch &&
        tijdsregelingMatch &&
        werkregimeMatch
      );
    });
    
    
  //console.log("filteredVacancyIds", filteredVacancyIds);

  const sortedVacancyIds = filteredVacancyIds.sort((a, b) =>
    matching[candidateKey][b].matchScore - matching[candidateKey][a].matchScore
  );

  // === Handler functies voor sidebar ===
  const handleRemoveCandidate = (key) =>
    setSelectedCandidates((prev) => prev.filter((k) => k !== key));
    const handleRemoveVacancy = (vacancyId) => {
      setSelectedVacanciesAll((prev) => {
        const current = prev[candidateKey] || [];
        const updated = current.filter((id) => id !== vacancyId);
    
        // Check: als de te verwijderen vacature dezelfde is als de huidige URL
        if (vacancyId === searchParams.get("vacatureId")) {
          navigate(`/vacancies?candidate=${candidateKey}`);
        }
    
        return {
          ...prev,
          [candidateKey]: updated,
        };
      });
    };
    
    
  const handleSelectCandidate = (key) => navigate(`/vacancies?candidate=${key}`);
  
  const handleSelectVacancy = (vacancyId) => {
    setSelectedVacanciesAll((prev) => {
      const current = prev[candidateKey] || [];
      const updated = current.includes(vacancyId) ? current : [...current, vacancyId];
      return {
        ...prev,
        [candidateKey]: updated,
      };
    });
  
    navigate(`/vacancy-detail?vacatureId=${vacancyId}&candidate=${candidateKey}`);
  };

  
  //console.log("candidates",candidates)
  //console.log("selectedCandidates",selectedCandidates)
  return (
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ display: "flex" }}>
      <CandidateSidebar
            candidates={candidates}
            selectedCandidates={selectedCandidates}
            onRemoveCandidate={handleRemoveCandidate}
            onSelectCandidate={handleSelectCandidate}
            activeCandidateKey={candidateKey}
          />

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
              mx: 1,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
        <Header 
            vacancies={vacancies}
            selectedVacancies={selectedVacancies}
            handleSelectVacancy={handleSelectVacancy}
            handleRemoveVacancy={handleRemoveVacancy}
            />

 
          <MainContent 
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
          candidateKey={candidateKey}
          vacancies={vacancies}
          matching={matching}
          sortedVacancyIds={sortedVacancyIds}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          setVacancySearch={setVacancySearch}
          vacancySearch={vacancySearch}
          handleSelectVacancy={handleSelectVacancy}
            
            />
     
      </Stack>
    </Box>
    </Box>
    </Box>
  );
};

export default VacanciesDashboard;
