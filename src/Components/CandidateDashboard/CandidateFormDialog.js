import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { validateField } from "./Helpers";
import worldCountries from "world-countries";
import InputMask from "react-input-mask";

const countries = worldCountries
  .map((c) => c.translations?.nld?.common)
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, "nl"));

const levelOptions = [
  "Level 1 – Beginner",
  "Level 2 – Basis",
  "Level 3 – Goed",
  "Level 4 – Zeer goed"
];

const defaultForm = {
  voornaam: "",
  achternaam: "",
  geslacht: "",
  straat: "",
  nummer: "",
  postcode: "",
  stad: "",
  land: "",
  geboortedatum: "",
  email: "",
  telefoon: "",
  extraInfo: "",
  werkervaring: "",
  diploma: "",
  status: "Actief",
  vaardigheden: [],
  kennis: [],
  attitudeEnPersoonlijk: [],
  ervaring: "",
  hobbys: "",
  interesses: "",
  attesten: ""
};

const CandidateFormDialog = ({ open, onClose, onSubmit, mode, candidate }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({ email: "", telefoon: "" });
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (candidate) {
      setFormData({ ...defaultForm, ...candidate });
    } else {
      setFormData({ ...defaultForm });
    }
    setFormErrors({ email: "", telefoon: "" });
    setTab(0);
  }, [candidate, open]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (["email", "telefoon"].includes(field)) {
      const error = validateField(field, value);
      setFormErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = () => {
        // 1) Valideer verplichte velden
        const errors = {};
        if (!formData.voornaam)    errors.voornaam    = "Voornaam is verplicht";
        if (!formData.achternaam)  errors.achternaam  = "Achternaam is verplicht";
        // (voeg hier evt. meer verplichte velden toe)
    
  
    
        // 3) Stop als er nog errors zijn
        if (Object.values(errors).some((msg) => msg)) {
          return;
        }
    
        // 4) Sla op en sluit de dialoog
        onSubmit(formData);
        onClose();
     };

  const handleDeleteSkill = (field, index) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData({ ...formData, [field]: updated });
  };

  const renderSkillList = (field) => (
    <Box>
      {formData[field]?.map((item, index) => (
        <Grid container spacing={1} key={index} sx={{ mb: 2 }} alignItems="center">
          <Grid item xs={3}><TextField label="Skill" value={item.skill} fullWidth onChange={(e) => {
            const updated = [...formData[field]];
            updated[index].skill = e.target.value;
            setFormData({ ...formData, [field]: updated });
          }} /></Grid>
          <Grid item xs={3}><FormControl fullWidth><InputLabel>Niveau</InputLabel><Select value={item.niveau} label="Niveau" onChange={(e) => {
            const updated = [...formData[field]];
            updated[index].niveau = e.target.value;
            setFormData({ ...formData, [field]: updated });
          }}>{levelOptions.map((level) => (
            <MenuItem key={level} value={level}>{level}</MenuItem>
          ))}</Select></FormControl></Grid>
          <Grid item xs={5}><TextField label="Opmerking" value={item.opmerking} fullWidth onChange={(e) => {
            const updated = [...formData[field]];
            updated[index].opmerking = e.target.value;
            setFormData({ ...formData, [field]: updated });
          }} /></Grid>
          <Grid item xs={1}><IconButton color="error" onClick={() => handleDeleteSkill(field, index)}><DeleteIcon /></IconButton></Grid>
        </Grid>
      ))}
      <Button startIcon={<AddIcon />} onClick={() => setFormData({
        ...formData,
        [field]: [...formData[field], { skill: "", niveau: "", opmerking: "" }]
      })}>Voeg toe</Button>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{mode === "add" ? "Kandidaat Toevoegen" : "Kandidaat Bewerken"}</DialogTitle>
      <DialogContent>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Algemene info" />
          <Tab label="Vaardigheden" />
          <Tab label="Kennis" />
          <Tab label="Attitude & Persoonlijk" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2}>
            {/* Algemene info */}
            <Grid item xs={6}><TextField label="Voornaam" value={formData.voornaam} onChange={(e) => handleChange("voornaam", e.target.value)} fullWidth margin="dense" required error={!formData.voornaam} helperText={!formData.voornaam ? "Verplicht" : ""} /></Grid>
            <Grid item xs={6}><TextField label="Achternaam" value={formData.achternaam} onChange={(e) => handleChange("achternaam", e.target.value)} fullWidth margin="dense" required error={!formData.achternaam} helperText={!formData.achternaam ? "Verplicht" : ""} /></Grid>
            <Grid item xs={5}>
                    <InputMask
                      mask="99-99-9999"
                      value={formData.geboortedatum || ""}
                      onChange={(e) => handleChange("geboortedatum", e.target.value)}
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          label="Geboortedatum"
                          fullWidth
                          margin="dense"
                          placeholder="dd-mm-jjjj"
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    </InputMask>
                  </Grid>
            <Grid item xs={3}><FormControl fullWidth margin="dense"><InputLabel id="geslacht-label">Geslacht</InputLabel><Select labelId="geslacht-label" value={formData.geslacht} label="Geslacht" onChange={(e) => handleChange("geslacht", e.target.value)}><MenuItem value="Vrouw">Vrouw</MenuItem><MenuItem value="Man">Man</MenuItem><MenuItem value="X">X</MenuItem></Select></FormControl></Grid>
            <Grid item xs={4}><FormControl fullWidth margin="dense"><InputLabel id="status-label">Status</InputLabel><Select labelId="status-label" value={formData.status} label="Status" onChange={(e) => handleChange("status", e.target.value)}><MenuItem value="Actief">Actief</MenuItem><MenuItem value="Niet Actief">Niet Actief</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6}><FormControl fullWidth margin="dense"><InputLabel id="werkervaring-label">Werkervaring</InputLabel><Select labelId="werkervaring-label" value={formData.werkervaring} label="Werkervaring" onChange={(e) => handleChange("werkervaring", e.target.value)}><MenuItem value="Geen">Geen</MenuItem><MenuItem value="<1 jaar">&lt;1 jaar</MenuItem><MenuItem value="1-3 jaar">1-3 jaar</MenuItem><MenuItem value=">3 jaar">&gt;3 jaar</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6}><FormControl fullWidth margin="dense"><InputLabel id="diploma-label">Diploma</InputLabel><Select labelId="diploma-label" value={formData.diploma} label="Diploma" onChange={(e) => handleChange("diploma", e.target.value)}><MenuItem value="Geen">Geen</MenuItem><MenuItem value="Lager onderwijs">Lager onderwijs</MenuItem><MenuItem value="Secundair">Secundair</MenuItem><MenuItem value="Hoger onderwijs">Hoger onderwijs</MenuItem><MenuItem value="Universitair">Universitair</MenuItem></Select></FormControl></Grid>
            <Grid item xs={6}><TextField label="Straat" value={formData.straat} onChange={(e) => handleChange("straat", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={2}><TextField label="Nummer" value={formData.nummer} onChange={(e) => handleChange("nummer", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={4}><TextField label="Postcode" value={formData.postcode} onChange={(e) => handleChange("postcode", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={6}><TextField label="Stad" value={formData.stad} onChange={(e) => handleChange("stad", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={6}><Autocomplete freeSolo options={countries} value={formData.land} onChange={(event, newValue) => handleChange("land", newValue || "")} onInputChange={(event, newInputValue) => handleChange("land", newInputValue)} renderInput={(params) => (<TextField {...params} label="Land" margin="dense" fullWidth />)} /></Grid>
            <Grid item xs={6}><TextField label="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} error={Boolean(formErrors.email)} helperText={formErrors.email} fullWidth margin="dense" /></Grid>
            <Grid item xs={6}><TextField label="Telefoonnummer" value={formData.telefoon} onChange={(e) => handleChange("telefoon", e.target.value)} error={Boolean(formErrors.telefoon)} helperText={formErrors.telefoon} fullWidth margin="dense" /></Grid>
            <Grid item xs={12}><TextField label="Ervaring" value={formData.ervaring} onChange={(e) => handleChange("ervaring", e.target.value)} fullWidth multiline rows={2} margin="dense" /></Grid>
            <Grid item xs={6}><TextField label="Hobby's" value={formData.hobbys} onChange={(e) => handleChange("hobbys", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={6}><TextField label="Interesses" value={formData.interesses} onChange={(e) => handleChange("interesses", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={12}><TextField label="Attesten" value={formData.attesten} onChange={(e) => handleChange("attesten", e.target.value)} fullWidth margin="dense" /></Grid>
            <Grid item xs={12}><TextField label="Opmerkingen" value={formData.extraInfo} onChange={(e) => handleChange("extraInfo", e.target.value)} fullWidth multiline rows={2} margin="dense" /></Grid>

          </Grid>
        )}

        {tab === 1 && renderSkillList("vaardigheden")}
        {tab === 2 && renderSkillList("kennis")}
        {tab === 3 && (
          <>
            {renderSkillList("attitudeEnPersoonlijk")}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuleren</Button>
        <Button variant="contained" onClick={handleSubmit}>Opslaan</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CandidateFormDialog;
