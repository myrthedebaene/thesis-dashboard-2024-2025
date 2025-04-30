import SelectedVacancies from "./SelectedVacancies";
import Stack from '@mui/material/Stack';
import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
const Header = ({
  vacancies,
  selectedVacancies,
  handleSelectVacancy,
  handleRemoveVacancy
}) => {
  const [open, setOpen] = useState(false);
  const [vraag, setVraag] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [responseId, setResponseId] = useState(null); // 🧠 gesprekscontext-id

  const handleOpenAssistant = async () => {
    if (messages.length === 0) {
      setLoading(true);
  
      try {
        const res = await fetch("http://localhost:5050/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isInitial: true }),
        });
  
        const data = await res.json();
        console.log("✅ Eerste antwoord ontvangen:", data); // debug check
  
        if (data.antwoord) {
          setMessages([{ role: 'assistant', content: data.antwoord }]);
          setResponseId(data.responseId);
        } else {
          setMessages([{ role: 'assistant', content: "Geen antwoord ontvangen." }]);
        }
  
      } catch (err) {
        console.error("❌ Fout bij laden van AI:", err);
        setMessages([{ role: 'assistant', content: "Fout bij laden van de AI-assistent." }]);
      } finally {
        setLoading(false);
        setOpen(true); // 👈 pas openen na het laden
      }
  
    } else {
      setOpen(true); // heropenen als er al berichten zijn
    }
  };
  
  
  
  const handleSend = async () => {
    if (!vraag.trim()) return;
  
    const nieuweVraag = { role: 'user', content: vraag };
    setMessages((prev) => [...prev, nieuweVraag]);
    setVraag("");
    setLoading(true);
  
    try {
      const res = await fetch("http://localhost:5050/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: vraag,
          previousResponseId: responseId,
        }),
      });
  
      const data = await res.json();
  
      const antwoord = {
        role: 'assistant',
        content: data.antwoord || "Geen antwoord ontvangen.",
      };
  
      setMessages((prev) => [...prev, antwoord]);
      if (data.responseId) {
        setResponseId(data.responseId);
      }
  
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Fout bij ophalen van AI-antwoord." },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Stack
      direction="row"
      sx={{
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 0,
      }}
      spacing={2}
    >
     <Box sx={{ flexGrow: 1, width: '80%' }}>
        {selectedVacancies.length > 0 ? (
          <SelectedVacancies
            vacancies={vacancies}
            selectedKeys={selectedVacancies}
            onSelect={handleSelectVacancy}
            onRemove={handleRemoveVacancy}
          />
        ) : (
          <Box sx={{ height: 0 }} /> // lege ruimte zodat AI-knop rechts blijft
        )}
      </Box>

      <>
      {/* Zichtbare knop rechtsboven */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', px: 1, pt: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleOpenAssistant}
        >
          AI Assistent
        </Button>
      </Box>

      {/* Chat drawer */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 400, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">AI Assistent</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Gespreksgeschiedenis */}
          <Box sx={{ flex: 1, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  mb: 1.5,
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f0f0f0',
                    maxWidth: '80%',
                    fontSize: '0.9rem',
                  }}
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Vraagveld + knop */}
          <TextField
            value={vraag}
            onChange={(e) => setVraag(e.target.value)}
            placeholder="Stel een vraag..."
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            variant="outlined"
          />

          <Box sx={{ mt: 1, textAlign: 'right' }}>
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading || !vraag.trim()}
            >
              {loading ? <CircularProgress size={20} /> : 'Verstuur'}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
    </Stack>
  );
};

export default Header;
