import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Slider,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";


const ClickDialog = ({ children, title }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <>
      <HelpOutlineIcon
        fontSize="small"
        onClick={handleOpen}
        sx={{ color: 'text.secondary', cursor: 'pointer', ml: 1 }}
      />
   <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth scroll="paper">
        <DialogTitle
          sx={{
            p: 2,
            bgcolor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            bgcolor: "#fafafa",
            px: 3,
            py: 2,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        >
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
};

const tijdsregelingTooltip = (
  <Box>
    {[
      ["Dagwerk", "Start tussen 7u en 9.30u, eindigt tussen 15.30u en 18u."],
      ["2-ploegenstelsel", "Je werkt de ene week 's ochtends, de andere week 's avonds."],
      ["3-ploegenstelsel", "Je wisselt tussen ochtend-, avond- en nachtploeg."],
      ["Nachtwerk", "Je werkt 's nachts."],
      ["Weekendwerk", "Je werkt op zaterdag en/of zondag."],
      ["Onderbroken dienst", "Werkdag is onderbroken, bijv. 6-10u en 16-20u."],
      ["Volcontinu systeem", "Je werkt in 5 ploegen, ook 's nachts en in het weekend."],
    ].map(([title, desc]) => (
      <Box key={title} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{desc}</Typography>
      </Box>
    ))}
  </Box>
);

const contractTooltip = (
  <Box>
    {[
      ["Vaste jobs", "Dit zijn jobs met een contract van onbepaalde duur."],
      ["Tijdelijke jobs", "Dit zijn jobs met een contract van bepaalde duur."],
      ["Flexijob", "Jobs voor wie werkt of gepensioneerd is en wil bijverdienen."],
      ["Tijdelijke jobs met optie vast", "Start tijdelijk, mogelijk vast contract nadien."],
      ["Dienstenchequebaan", "Jobs via dienstencheques, in dienst van een werkgever."],
    ].map(([title, desc]) => (
      <Box key={title} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{desc}</Typography>
      </Box>
    ))}
  </Box>
);

const FilterSection = ({
  title,
  options,
  values,
  onChange,
  tooltip,
  width = '20%',
  direction = 'row'
}) => {
  const allChecked = options.every(opt => values.includes(opt));
  const someChecked = options.some(opt => values.includes(opt));

  const handleParentChange = (event) => {
    const isChecked = event.target.checked;
    options.forEach((opt) => {
      const included = values.includes(opt);
      if ((isChecked && !included) || (!isChecked && included)) {
        onChange({ target: { name: opt } });
      }
    });
  };

  const handleChildChange = (event) => {
    onChange(event);
  };

  return (
    <Box sx={{ flex: `1 1 ${width}`, minWidth: 100 }}>
      <Box sx={{
        backgroundColor: "#f0f0f0",
        borderRadius: 2,
        p: 1,
        mb: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <FormControlLabel
          label={<Typography sx={{ fontWeight: 600 }}>{title}</Typography>}
          control={
            <Checkbox
              checked={allChecked}
              indeterminate={!allChecked && someChecked}
              onChange={handleParentChange}
            />
          }
        />
        {tooltip && <ClickDialog title={`Uitleg: ${title}`}>{tooltip}</ClickDialog>}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: direction, flexWrap: 'wrap' }}>
        {options.map((opt) => (
          <Box key={opt} sx={{ width: direction === 'column' ? '100%' : '50%' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.includes(opt)}
                  onChange={handleChildChange}
                  name={opt}
                />
              }
              label={opt}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};


const VacancyFilters = ({
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
}) => {
  if (!candidate) return null;

  return (
    <Accordion defaultExpanded={false} sx={{ mb: 2 }}>

      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
      >
        <Typography variant="subtitle1" sx={{ width: "100%" }}>
          Filters
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>

          {/* Salaris */}
          <Box sx={{ flex: '0 0 18%', minWidth: 240 }}>
            <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: 2, p: 1, mb: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>Salaris (€)</Typography>
            </Box>
            <Box sx={{ position: 'relative', width: '100%', pb: 4 }}>
  <Slider
    value={salaryRange}
    onChange={(e, newValue) => setSalaryRange(newValue)}
    min={0}
    max={5000}
    step={50}
  />
  <Box sx={{ position: 'absolute', top: 40, left: 0, right: 0, height: 20 }}>
    {salaryRange.map((value, index) => {
      const percent = ((value - 0) / (5000 - 0)) * 100;
      return (
        <Typography
          key={index}
          variant="caption"
          sx={{
            position: 'absolute',
            left: `calc(${percent}% - 12px)`,
            width: 40,
            textAlign: 'center',
          }}
        >
          €{value}
        </Typography>
      );
    })}
  </Box>
</Box>
          </Box>

          {/* Locatie */}
          <Box sx={{ flex: '1 1 20%', minWidth: 250 }}>
            <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: 2, p: 1, mb: 1 }}>
              <Typography sx={{ fontWeight: 600 }}>Locatie</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                variant="outlined"
                fullWidth
                size="small"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                InputProps={{ startAdornment: <LocationOnIcon sx={{ mr: 1 }} /> }}
              />
              <TextField
                label="Straal (km)"
                variant="outlined"
                type="number"
                size="small"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                sx={{ width: 125 }}
              />
            </Box>
          </Box>

          {/* Contracttypes */}
          <FilterSection
            title="Contracttype"
            options={["Vast", "Tijdelijk", "Flexijob", "Tijdelijk met optie vast", "Dienstencheques"]}
            values={contractTypes}
            onChange={handleContractTypeChange}
            tooltip={contractTooltip}
            width="20%"
          />

          {/* Tijdsregeling */}
          <FilterSection
            title="Tijdsregeling"
            options={["Dagwerk", "2-ploegenstelsel", "3-ploegenstelsel", "Nachtwerk", "Weekendwerk", "Onderbroken dienst", "Volcontinu systeem"]}
            values={tijdsregeling}
            onChange={handleTijdsregelingChange}
            tooltip={tijdsregelingTooltip}
            width="20%"
          />

          {/* Werkregime */}
          <Box sx={{ flex: '1 1 15%', minWidth: 150 }}>
            <Box sx={{ backgroundColor: "#f0f0f0", borderRadius: 2, p: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 600 }}>Werkregime</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {['Voltijds', 'Deeltijds'].map((opt) => (
                <Box key={opt} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Checkbox
                    checked={werkregime.includes(opt)}
                    onChange={handleWerkregimeChange}
                    name={opt}
                  />
                  <Typography>{opt}</Typography>
                  {opt === 'Deeltijds' && werkregime.includes('Deeltijds') && (
                    <TextField
                      label="Uren/week"
                      type="number"
                      size="small"
                      value={partTimeHours}
                      onChange={(e) => setPartTimeHours(e.target.value)}
                      sx={{ width: 100, ml: 1 }}
                    />
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default VacancyFilters;
