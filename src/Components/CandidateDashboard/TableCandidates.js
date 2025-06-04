import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  Chip,
  TableContainer,
  Grid,
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

    setSelectedCandidate(candidate);
    setActiveTab(0);
  };
  const InfoBlock = ({ icon, label, value }) => (
    <Box>
      <Typography variant="subtitle2" fontWeight={600}>
        {icon} {label}
      </Typography>
      <Typography variant="body2" color={value ? "text.primary" : "text.secondary"}>
        {value || "Niet ingevuld"}
      </Typography>
    </Box>
  );
  
  const handleCloseDialog = () => {
    setSelectedCandidate(null);
  };

  const tabLabels = ["Algemeen", "Vaardigheden", "Attitude & Persoonlijk", "Andere"];
  const [sortField, setSortField] = useState("naam");
  const [sortOrder, setSortOrder] = useState("asc");
  

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
            <TableCell
  sx={{ cursor: "pointer", userSelect: "none" }}
  onClick={() => {
    if (sortField === "naam") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField("naam");
      setSortOrder("asc");
    }
  }}
>
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    Naam
    <Typography variant="body2" component="span" color="text.secondary">
      {sortField === "naam" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
    </Typography>
  </Box>
</TableCell>

              <TableCell>Geslacht</TableCell>
              <TableCell>Geboortedatum</TableCell>
              <TableCell>Adres</TableCell>
              <TableCell
  sx={{ cursor: "pointer", userSelect: "none" }}
  onClick={() => {
    if (sortField === "status") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField("status");
      setSortOrder("asc");
    }
  }}
>
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    Status
    <Typography variant="body2" component="span" color="text.secondary">
      {sortField === "status" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
    </Typography>
  </Box>
</TableCell>

              <TableCell>Contact</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Acties</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.length > 0 ? (
            [...candidates]
            .sort((a, b) => {
              const getValue = (c) => {
                const data = c[1];
                if (sortField === "naam") {
                  return `${data.voornaam || ""} ${data.achternaam || ""}`.toLowerCase();
                }
                if (sortField === "status") {
                  return (data.status || "").toLowerCase();
                }
                return "";
              };
              const valA = getValue(a);
              const valB = getValue(b);
              return sortOrder === "asc"
                ? valA.localeCompare(valB, "nl")
                : valB.localeCompare(valA, "nl");
            })
            .map(([key, candidate]) => {
          
           
            
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
          {activeTab === 0 && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="👤" label="Naam" value={`${selectedCandidate?.voornaam} ${selectedCandidate?.achternaam}`} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="🎂" label="Geboortedatum" value={selectedCandidate?.geboortedatum} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="👥" label="Geslacht" value={selectedCandidate?.geslacht} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="🌍" label="Nationaliteit" value={selectedCandidate?.nationaliteit} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="📌" label="Status" value={selectedCandidate?.status} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="📞" label="Telefoon" value={selectedCandidate?.telefoon} />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <InfoBlock icon="📧" label="Email" value={selectedCandidate?.email} />
  </Grid>
  <Grid item xs={12} sm={12} md={8}>
    <InfoBlock
      icon="🏠"
      label="Adres"
      value={`${selectedCandidate?.straat || ""} ${selectedCandidate?.nummer || ""}, ${selectedCandidate?.postcode || ""} ${selectedCandidate?.stad || ""}, ${selectedCandidate?.land || ""}`}
    />
  </Grid>
</Grid>

)}

          {activeTab === 1 && renderCompetenties("vaardigheden")}
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
  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
    📄 Attesten en diploma's
  </Typography>

  <Typography variant="body2">
    <strong>Attesten:</strong> {selectedCandidate?.attesten || "Geen attesten opgegeven."}
  </Typography>

  <Typography variant="body2">
    <strong>Diploma:</strong> {selectedCandidate?.diploma || "Geen diploma's opgegeven."}
  </Typography>
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