import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import VacatureEditDialog from "./VacatureEditDialog";
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkIcon from '@mui/icons-material/Work';
import AddCommentIcon from '@mui/icons-material/AddComment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import vacaturesData from "../../data/vacatures.json"; 
const TabPanel = ({ value, index, children }) => {
  return value === index && (
    <Box sx={{ mt: 3 }}>
      {children}
    </Box>
  );
};

const VacatureTabel = ({ newVacature }) => {
  const [vacatures, setVacatures] = useState(vacaturesData);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedVacature, setSelectedVacature] = useState(null);

  useEffect(() => {
        if (newVacature?.id) {
          setVacatures(prev => ({ ...prev, [newVacature.id]: newVacature }));
        }
      }, [newVacature]);

  

  const handleTabChange = (event, newValue) => setTab(newValue);

  const handleEdit = (vacature) => {
    setSelectedVacature(vacature);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Ben je zeker dat je deze vacature wilt verwijderen?");
    if (!confirm) return;

  setVacatures(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
       };
  return (
    <Box sx={{ mt: 4 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Titel</TableCell>
            <TableCell>Bedrijf</TableCell>
            <TableCell>Locatie</TableCell>
            <TableCell>Contract</TableCell>
            <TableCell>Tijdregeling</TableCell>
            <TableCell>Werkregime</TableCell>
            <TableCell align="right">Details</TableCell>
            <TableCell align="right">Acties</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(vacatures).map(([id, v]) => (
            <TableRow key={id}>
              <TableCell>{v.titel || "-"}</TableCell>
              <TableCell>{v.bedrijf || "-"}</TableCell>
              <TableCell>{v.locatie || "-"}</TableCell>
              <TableCell>{v.contract || "-"}</TableCell>
              <TableCell>{v.tijdregeling || "-"}</TableCell>
              <TableCell>{v.werkregime || "-"}</TableCell>
              <TableCell align="right">
                <Button size="small" onClick={() => { setSelected(v); setTab(0); }}>Details</Button>
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Bewerk vacature">
                  <IconButton size="small" onClick={() => handleEdit(v)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Verwijder vacature">
                  <IconButton size="small" onClick={() => handleDelete(id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle>{selected?.titel || "Vacaturedetails"}</DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Algemeen" icon={<InfoIcon />} iconPosition="start" />
            <Tab label="Vaardigheden" icon={<WorkIcon />} iconPosition="start" />
            <Tab label="Attitude" icon={<PsychologyIcon />} iconPosition="start" />
            <Tab label="Extra" icon={<AddCommentIcon />} iconPosition="start" />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <Box sx={{ lineHeight: 1.8 }}>
              <Typography><strong>Bedrijf:</strong> {selected?.bedrijf}</Typography>
              <Typography><strong>Locatie:</strong> {selected?.locatie}</Typography>
              <Typography><strong>Contract:</strong> {selected?.contract}</Typography>
              <Typography><strong>Tijdregeling:</strong> {selected?.tijdregeling}</Typography>
              <Typography><strong>Werkregime:</strong> {selected?.werkregime}</Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {selected?.vaardigheden?.map((v, i) => (
              <Paper key={i} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{v.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Gevraagd: <strong>{v.threshold}</strong> – Gemiddeld: <strong>{v.gemiddelde}</strong>
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {Object.entries(v.levels).map(([level, desc]) => (
                  <Typography key={level} variant="body2"><strong>{level}:</strong> {desc}</Typography>
                ))}
              </Paper>
            ))}
          </TabPanel>

          
          <TabPanel value={tab} index={2}>
            {selected?.attitudeEnPersoonlijkeKenmerken?.map((a, i) => (
              <Paper key={i} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: "#f9f9f9" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{a.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Gevraagd: <strong>{a.threshold}</strong> – Gemiddeld: <strong>{a.gemiddelde}</strong>
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {Object.entries(a.levels).map(([level, desc]) => (
                  <Typography key={level} variant="body2"><strong>{level}:</strong> {desc}</Typography>
                ))}
              </Paper>
            ))}
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {selected?.extra || "-"}
            </Typography>
          </TabPanel>
        </DialogContent>
      </Dialog>

      <VacatureEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        vacature={selectedVacature}
        onSave={(updated) => {
          setVacatures(prev => ({ ...prev, [updated.id]: updated }));
          setEditDialogOpen(false);
        }}
      />
    </Box>
  );
};

export default VacatureTabel;
