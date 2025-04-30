import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import VacancyHeader from "./VacancyHeader";
import VacancyImprovementList from "./VacancyImprovementList";
import VacancyFactors from "./VacancyFactors";
import SkillGroupBlock from './SkillGroupBlock';

const MainGrid = ({
  candidate,
  matchData,
  vacancyData,
  selectedAanbeveling,
  vacancies,
  vacancyId,
  setSelectedAanbeveling,
  candidateKey
}) => {
  // Combine kennis and vaardigheden into one skills list
  const combinedSkills = [
    ...(matchData.vaardigheden || []),
    ...(matchData.kennis || [])
  ];

  // Combine corresponding vacature skills
  const vacatureSkillInfo = [
    ...(vacancies[vacancyId]?.vaardigheden || []),
    ...(vacancies[vacancyId]?.kennis || [])
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', px: 0 }}>
      <VacancyHeader
        candidate={candidate}
        matchData={matchData}
        vacancyData={vacancyData}
        selectedAanbeveling={selectedAanbeveling}
      />

      <Grid container spacing={1} alignItems="stretch">
        {/* Column 1: combined skills */}
        <Grid item xs={12} sm={6} lg={3.5}>
          <SkillGroupBlock
            title="Vaardigheden"
            skills={combinedSkills}
            domain="vaardigheden"
            vacatureSkills={vacatureSkillInfo}
            onSelectAanbeveling={setSelectedAanbeveling}
            selectedAanbeveling={selectedAanbeveling}
            vacature={vacancies[vacancyId]}
          />
        </Grid>

        {/* Column 2: attitudes & karaktertrekken */}
        <Grid item xs={12} sm={6} lg={3.5}>
          <SkillGroupBlock
            title="Attitudes en karaktertrekken"
            skills={matchData.attitudeEnPersoonlijkeKenmerken || []}
            domain="attitude"
            vacatureSkills={vacancies[vacancyId]?.attitudeEnPersoonlijkeKenmerken || []}
            onSelectAanbeveling={setSelectedAanbeveling}
            selectedAanbeveling={selectedAanbeveling}
            vacature={vacancies[vacancyId]}
          />
        </Grid>

        {/* Column 3: recommendations (bovenaan) and factors (onderaan) */}
        <Grid item xs={12} sm={12} lg={5}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>
            <Box sx={{ flex: '1 1 auto' }}>
              <VacancyImprovementList
                candidateId={candidateKey}
                vacancyId={vacancyId}
                onSelectAanbeveling={setSelectedAanbeveling}
                selectedAanbeveling={selectedAanbeveling}
                matchingData={matchData}
              />
            </Box>
            <Box sx={{ flex: '1 1 auto' }}>
              <VacancyFactors
                matchData={matchData}
                highlightedFactors={
                  selectedAanbeveling?.impact?.map(i => Object.values(i)[0])
                }
                onSelectAanbeveling={setSelectedAanbeveling}
                selectedAanbeveling={selectedAanbeveling}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainGrid;
