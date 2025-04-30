import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  Chip,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TableCandidate = ({ candidates, onSelect, onEdit, onDelete }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleView = (key, candidate) => {
    if (!candidate.vaardigheden) {
      candidate.vaardigheden = [
        { skill: "Microsoft Excel", niveau: "Level 3 – Goed", opmerking: "Gebruikt regelmatig draaitabellen en formules." },
        { skill: "SAP", niveau: "Level 2 – Basis", opmerking: "Heeft beperkte ervaring met het invoeren van orders." }
      ]
    };
    if (!candidate.kennis) {
      candidate.kennis = [
        { skill: "Nederlands", niveau: "Level 4 – Zeer goed", opmerking: "Spreekt en schrijft foutloos Nederlands." },
        { skill: "Engels", niveau: "Level 3 – Goed", opmerking: "Kan vlot communiceren over werkgerelateerde onderwerpen." }
      ]
    };

    if (!candidate.attitudeEnPersoonlijk) {
      candidate.attitudeEnPersoonlijk = [
        { skill: "Leergierigheid", niveau: "Level 4 – Sterk", opmerking: "Gaf aan graag nieuwe tools te verkennen en bij te leren." },
        { skill: "Samenwerken", niveau: "Level 3 – Goed", opmerking: "Vertelde over succesvolle teamprojecten." }
      ]
    };

    if (!candidate.ervaring) {
      candidate.ervaring = "3 jaar als administratief medewerker bij een ziekenhuis.";
    }
    if (!candidate.hobbys) {
      candidate.hobbys = "Lezen, koken, padel.";
    }
    if (!candidate.interesses) {
      candidate.interesses = "Gezondheidszorg, digitale tools, vrijwilligerswerk.";
    }
    if (!candidate.attesten) {
      candidate.attesten = "VCA attest, rijbewijs B.";
    }

    setSelectedCandidate(candidate);
    setActiveTab(0);
  };

  const handleCloseDialog = () => {
    setSelectedCandidate(null);
  };

  const tabLabels = ["Vaardigheden", "Kennis", "Attitude & Persoonlijk", "Andere"];

  const renderCompetenties = (categorie) => (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mt: 2 }}>
      {selectedCandidate?.[categorie]?.map((item, i) => (
        <Box key={i} sx={{ p: 1.5, border: "1px solid #ddd", borderRadius: 1, bgcolor: "#fafafa" }}>
          <Typography variant="body2" fontWeight={500}>{item.skill}</Typography>
          <Typography variant="caption"><strong>Niveau:</strong> {item.niveau}</Typography><br />
          <Typography variant="caption" color="text.secondary">{item.opmerking}</Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "calc(100vh - 250px)", overflow: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Naam</TableCell>
              <TableCell>Geslacht</TableCell>
              <TableCell>Geboortedatum</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.length > 0 ? (
              candidates.map(([key, candidate]) => {
                const fullName = `${candidate.voornaam || ""} ${candidate.achternaam || ""}`.trim();
                const adres = candidate.straat && candidate.nummer && candidate.postcode && candidate.stad && candidate.land
                  ? `${candidate.straat}, ${candidate.nummer}, ${candidate.postcode}, ${candidate.stad}, ${candidate.land}`
                  : "";

                return (
                  <TableRow key={key} hover onClick={() => onSelect(key)} sx={{ cursor: "pointer" }}>
                    <TableCell>{fullName}</TableCell>
                    <TableCell>{candidate.geslacht}</TableCell>
                    <TableCell>{candidate.geboortedatum}</TableCell>
                    <TableCell>{adres}</TableCell>
                    <TableCell>
                      <Chip
                        label={candidate.status}
                        color={candidate.status === "Actief" ? "success" : "default"}
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 500, fontSize: "0.75rem", textTransform: "uppercase", borderRadius: "8px" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <PhoneIcon fontSize="small" />
                        <Typography variant="body2">{candidate.telefoon}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">{candidate.email}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="outlined" size="small" onClick={() => handleView(key, candidate)}>Bekijk</Button>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => onEdit(key)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => onDelete(key)}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">Geen kandidaten gevonden</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedCandidate} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Profiel van {selectedCandidate?.voornaam} {selectedCandidate?.achternaam}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Informatie afgeleid uit chatbotgesprek
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} variant="scrollable">
            {tabLabels.map((label, idx) => (
              <Tab key={idx} label={label} />
            ))}
          </Tabs>

          {activeTab === 0 && renderCompetenties("vaardigheden")}
          {activeTab === 1 && renderCompetenties("kennis")}
          {activeTab === 2 && (
            <>
              {renderCompetenties("attitudeEnPersoonlijk")}
            </>
          )}
          {activeTab === 3 && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>📁 Ervaring</Typography>
                <Typography variant="body2">{selectedCandidate?.ervaring || "Geen ervaring beschreven."}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>🎯 Hobby’s</Typography>
                <Typography variant="body2">{selectedCandidate?.hobbys || "Geen hobby’s vermeld."}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>💡 Interesses</Typography>
                <Typography variant="body2">{selectedCandidate?.interesses || "Geen interesses bekend."}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>📄 Attesten</Typography>
                <Typography variant="body2">{selectedCandidate?.attesten || "Geen attesten opgegeven."}</Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">Sluiten</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableCandidate;