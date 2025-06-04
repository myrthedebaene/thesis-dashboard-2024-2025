import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const contractOpties = [
  "Vast",
  "Flexijob",
  "Dienstencheques",
  "Tijdelijk",
  "Tijdelijk met optie vast",
];
const tijdsregelingOpties = [
  "Voltijds",
  "Deeltijds - 32 uren per week",
  "Deeltijds - 20 uren per week",
];
const werkregimeOpties = [
  "Dagwerk",
  "3-ploegenstelsel",
  "Weekendwerk",
  "Ploegenstelsel",
  "2-ploegenstelsel",
  "Nachtwerk",
  "Onderbroken dienst",
  "Volcontinu systeem",
];
const levelOpties = ["level1", "level2", "level3", "level4"];

const VacatureEditDialog = ({ open, onClose, vacature, onSave }) => {
  const [form, setForm] = useState({});
  const [tab, setTab] = useState(0);

  useEffect(() => {
    setForm(vacature || {});
  }, [vacature]);

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleLevelChange = (categorie, index, type) => (e) => {
    const updated = { ...form };
    updated[categorie][index][type] = e.target.value;
    setForm(updated);
  };

  const handleLevelDescChange = (categorie, index, levelKey) => (e) => {
    const updated = { ...form };
    updated[categorie][index].levels[levelKey] = e.target.value;
    setForm(updated);
  };

  const handleAddCompetentie = (categorie) => () => {
    const updated = { ...form };
    updated[categorie] = [...(updated[categorie] || []), {
      name: "Nieuwe competentie",
      threshold: "level1",
      levels: {
        level1: "",
        level2: "",
        level3: "",
        level4: ""
      }
    }];
    setForm(updated);
  };

  const handleDeleteCompetentie = (categorie, index) => () => {
    const updated = { ...form };
    updated[categorie] = updated[categorie].filter((_, i) => i !== index);
    setForm(updated);
  };

  const handleSave = () => {
        // stuur het gewijzigde object terug naar de parent
        onSave(form);
        // sluit de dialog
        onClose();
      };

  const renderCompetentie = (categorie) => (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Button startIcon={<AddIcon />} onClick={handleAddCompetentie(categorie)}>
          Voeg {categorie} toe
        </Button>
      </Box>
      {form[categorie]?.map((item, index) => (
        <Accordion key={index} sx={{ mt: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1">{item.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <TextField
                label="Naam"
                value={item.name}
                onChange={(e) => {
                  const updated = { ...form };
                  updated[categorie][index].name = e.target.value;
                  setForm(updated);
                }}
                fullWidth
              />
              <Tooltip title="Verwijder deze competentie">
                <IconButton  onClick={handleDeleteCompetentie(categorie, index)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Threshold</InputLabel>
                <Select
                  value={item.threshold}
                  label="Threshold"
                  onChange={handleLevelChange(categorie, index, "threshold")}
                >
                  {levelOpties.map((lvl) => (
                    <MenuItem key={lvl} value={lvl}>{lvl}</MenuItem>
                  ))}
                </Select>
              </FormControl>

            
            </Box>

            {Object.entries(item.levels).map(([levelKey, levelVal]) => (
              <TextField
                key={levelKey}
                label={`Uitleg ${levelKey}`}
                value={levelVal}
                onChange={handleLevelDescChange(categorie, index, levelKey)}
                fullWidth
                multiline
                minRows={2}
                sx={{ mt: 2 }}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Bewerk vacature: {form.titel}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} sx={{ mb: 3 }}>
          <Tab label="Algemene info" />
          <Tab label="Vaardigheden" />
          <Tab label="Attitude & Persoonlijk" />
        </Tabs>

        {tab === 0 && (
          <Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, my: 2 }}>
              <TextField label="Titel" value={form.titel || ""} onChange={handleChange("titel")} fullWidth />
              <TextField label="Bedrijf" value={form.bedrijf || ""} onChange={handleChange("bedrijf")} fullWidth />
              <TextField label="Locatie" value={form.locatie || ""} onChange={handleChange("locatie")} fullWidth />

              <FormControl fullWidth>
                <InputLabel>Contract</InputLabel>
                <Select
                  value={form.contract || ""}
                  label="Contract"
                  onChange={handleChange("contract")}
                >
                  {contractOpties.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Tijdregeling</InputLabel>
                <Select
                  value={form.tijdregeling || ""}
                  label="Tijdregeling"
                  onChange={handleChange("tijdregeling")}
                >
                  {tijdsregelingOpties.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Werkregime</InputLabel>
                <Select
                  value={form.werkregime || ""}
                  label="Werkregime"
                  onChange={handleChange("werkregime")}
                >
                  {werkregimeOpties.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Extra info"
              multiline
              minRows={4}
              value={form.extra || ""}
              onChange={handleChange("extra")}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Box>
        )}

        {tab === 1 && renderCompetentie("vaardigheden")}
        {tab === 2 && renderCompetentie("attitudeEnPersoonlijkeKenmerken")}

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          Je kan hier het gevraagde niveau (threshold), en uitleg per level aanpassen of een competentie toevoegen/verwijderen.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuleer</Button>
        <Button onClick={handleSave} variant="contained">Opslaan</Button>
      </DialogActions>
    </Dialog>
  );
};

export default VacatureEditDialog;
