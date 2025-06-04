import {
  Paper,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import BarChart from "./Charts/BarChart";
import DonutChart from "./Charts/DonutChart";
import React, { useState } from "react"; // <-- dit is correct
import { ToggleButtonGroup, ToggleButton } from "@mui/material"; // apart houden



const VacancyList = ({
  candidateKey,
  vacancies,
  matching,
  filteredVacancyIds,
  onSelectVacancy,
  chartVariant,
  showDetails,
}) => {
  console.log(vacancies)
  if (!candidateKey) return null;
  const getColorCategory = (score, threshold) => {
    if (score >= threshold) return 0; // groen
    if (threshold - score < 10) return 1; // oranje
    return 2; // rood
  };


  // Sorteer op drempelwaarde behaald, daarna op matchingscore
  const sortedVacancyIds = filteredVacancyIds.slice().sort((a, b) => {
    const matchA = matching[candidateKey][a];
    const matchB = matching[candidateKey][b];
    const thresholdA = parseFloat(vacancies[a].threshold?.replace("%", "")) || 0;
    const thresholdB = parseFloat(vacancies[b].threshold?.replace("%", "")) || 0;
    const catA = getColorCategory(matchA.matchScore, thresholdA);
    const catB = getColorCategory(matchB.matchScore, thresholdB);
    if (catA !== catB) {
      return catA - catB;
    }
    // zelfde kleur: hoogste score eerst
    return matchB.matchScore - matchA.matchScore;
  });

  return (
    <Paper sx={{ p: 1 }}>
     

      <Grid container spacing={2}>

        {sortedVacancyIds.length > 0 ? (
          sortedVacancyIds.map((vacancyId) => {
            const vacancy = vacancies[vacancyId];
            if (!vacancy) return null;

            const match = matching?.[candidateKey]?.[vacancyId];
if (!match) return null; // of continue; als je in een loop zit

            const threshold = Number(vacancy.threshold?.replace("%", ""));
            const avgWorker = Math.round(
              (match.vaardighedenBarchart.average +
                match.attitudeEnPersoonlijkeKenmerkenBarchart.average) /
                3
            );
            const improvement = match.verbeterPotentieel || 0;

            return (
              <Grid item xs={12} sm={12} md={6} lg={4} key={vacancyId}>
                <Paper
                  sx={{
                    p: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Titel en afstand */}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => onSelectVacancy(vacancyId)}
                    >
                      {vacancy.titel}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Woon-Werk: {match.afstand}
                    </Typography>
                  </Box>

                  {/* Donut + plus/minpunten */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      mt: 1,
                      minHeight: 120,
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: 85,
                        aspectRatio: "1 / 1",
                        flexShrink: 0,
                      }}
                    >
                      <DonutChart
                        score={match.matchScore}
                        average={avgWorker}
                        verbetering={improvement}
                        threshold={threshold}
                      />
                    </Box>

                    <Box
                      sx={{
                        flex: 1,
                        display: "flex",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Pluspunten */}
                      <Box sx={{ flex: 1, minWidth: 140 }}>
                        <Typography variant="subtitle2">Pluspunten:</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {match.pluspunten.map((point, idx) => (
                            <Box
                              key={idx}
                              sx={{ display: "flex", alignItems: "start", gap: 0.5 }}
                            >
                              <AddCircleIcon fontSize="small" color="success" />
                              <Typography
                                variant="body2"
                                sx={{
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                  lineHeight: 1.3,
                                }}
                              >
                                {point}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* Minpunten */}
                      <Box sx={{ flex: 1, minWidth: 140 }}>
                        <Typography variant="subtitle2">Minpunten:</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {match.minpunten.map((point, idx) => (
                            <Box
                              key={idx}
                              sx={{ display: "flex", alignItems: "start", gap: 0.5 }}
                            >
                              <RemoveCircleIcon fontSize="small" color="error" />
                              <Typography
                                variant="body2"
                                sx={{
                                  overflowWrap: "break-word",
                                  wordBreak: "break-word",
                                  lineHeight: 1.3,
                                }}
                              >
                                {point}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* BarCharts onderaan */}
                  {showDetails && (
                    <Box sx={{ mt: "auto", pt: 0 }}>
                      {[
                        {
                          label: "Vaardigheden",
                          data: match.vaardighedenBarchart,
                          threshold: vacancy.vaardighedenBarchartThreshold,
                        },
                        {
                          label: "Attitudes & Karakter",
                          data:
                            match.attitudeEnPersoonlijkeKenmerkenBarchart,
                          threshold:
                            vacancy.attitudeEnPersoonlijkeKenmerkenBarchartThreshold,
                        },
                      ].map((item, idx) => (
                        <Grid key={idx} container alignItems="center" spacing={2} sx={{ mb: 0 }}>
                          <Grid item xs={4}>
                            <Typography variant="subtitle2" align="right">
                              {item.label}:
                            </Typography>
                          </Grid>
                          <Grid item xs={7}>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                              <BarChart
                                current={parseInt(
                                  item.data.huidig.replace("%", "")
                                )}
                                threshold={parseInt(
                                  item.threshold.replace("%", "")
                                )}
                                average={70} // eventueel dynamisch maken
                                improvement={parseInt(
                                  item.data.verbetering.replace("%", "")
                                )}
                                variant={chartVariant}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="body1" align="center">
                Geen vacatures gevonden
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default VacancyList;
