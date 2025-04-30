import React, { useEffect, useRef, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress, Grid, Paper, Stack} from '@mui/material';
//import { matching } from '../../Data/matching';
//import { vacancies } from '../../Data/vacancies';
import candidatesData from "../../data/candidates.json";
import vacanciesData  from "../../data/vacatures.json";
import matchingArray  from "../../data/matching.json";
import VacancyHeader from './VacancyHeader';
import SkillGroupBlock from './SkillGroupBlock';
import VacancyImprovementList from './VacancyImprovementList';
import VacancyFactors from './VacancyFactors';
import Header from './Header';
import MainGrid from './MainGrid';
import SidebarCandidate from './SidebarCandidate';
import { SelectedCandidatesContext } from "../SelectedCandidatesContext";
import { SelectedVacanciesContext } from "../SelectedVacanciesContext";
import SelectedVacancies from './SelectedVacancies';

const VacancyDetail = () => {
  const [vacancies,  setVacancies]  = useState(vacanciesData);
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
  const [candidates, setCandidates] = useState(candidatesData);

    const [selectedAanbeveling, setSelectedAanbeveling] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { selectedCandidates, setSelectedCandidates } = useContext(SelectedCandidatesContext);

    const candidateKey = searchParams.get("candidate");
    const candidate = candidates[candidateKey];

    const vacancyId = searchParams.get("vacatureId");
    const vacancyData = vacancies[vacancyId] || null;

    const [selectedVacanciesAll, setSelectedVacanciesAll] = useContext(SelectedVacanciesContext);



    useEffect(() => {
      const stored = localStorage.getItem("selectedCandidates");
      if (stored) {
        const selected = JSON.parse(stored);
        setSelectedCandidates(selected);
      }
    }, []);


    const handleRemoveCandidate = (key) => {
      setSelectedCandidates((prev) => prev.filter((k) => k !== key));
      if (key === candidateKey) navigate("/vacancies");
    };
   
    const handleSelectCandidate = (key) => navigate(`/vacancies?candidate=${key}`);
    const selectedVacancies = selectedVacanciesAll[candidateKey] || [];
    const matchData =
  candidateKey &&
  matching[candidateKey] &&
  matching[candidateKey][vacancyId]
    ? matching[candidateKey][vacancyId]
    : null;

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
    console.log("DETAILShandleSelectVacancy", handleSelectVacancy)
    if (!vacancyData || !matchData || !candidate) {
      return (
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      );
    }
    return (
      <Box sx={{ p: 0.5 }}>
        <Box sx={{ display: "flex" }}>
          <SidebarCandidate
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
              mt: { xs: 1, md: 0 },
            }}
          >
            <Header 
            vacancies={vacancies}
            selectedVacancies={selectedVacancies}
            handleSelectVacancy={handleSelectVacancy}
            handleRemoveVacancy={handleRemoveVacancy}
            activeCandidateKey={candidateKey}
            />
            
            <MainGrid 
             candidate={candidate}
             matchData={matchData}
             vacancyData={vacancyData}
             selectedAanbeveling={selectedAanbeveling}
             vacancies={vacancies}
             vacancyId={vacancyId}
             setSelectedAanbeveling={setSelectedAanbeveling}
             candidateKey={candidateKey}
            />
          </Stack>
          </Box>
      </Box>
      </Box>)
  }
export default VacancyDetail;