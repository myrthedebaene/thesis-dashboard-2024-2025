// src/components/CandidateDashboard/CandidateDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams} from "react-router-dom";
import { SelectedCandidatesContext } from "../SelectedCandidatesContext";
import { Box, Grid, Paper, Typography, Button, Stack, TextField, Select, MenuItem } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CandidateFormDialog from "./CandidateFormDialog";
import TableCandidate from "./TableCandidates";


const CandidateDashboard = () => {
  const [candidateList, setCandidateList] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(null);

  const { selectedCandidates, setSelectedCandidates } = useContext(SelectedCandidatesContext);
  const navigate = useNavigate();
const [searchParams] = useSearchParams();

  const candidateKey = searchParams.get("candidate");

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedCandidates", JSON.stringify(selectedCandidates));
  }, [selectedCandidates]);

  useEffect(() => {
    const storedSelected = localStorage.getItem("selectedCandidates");
    if (storedSelected) {
      setSelectedCandidates(JSON.parse(storedSelected));
    }
  }, []);

  const fetchCandidates = () => {
    fetch("http://localhost:5050/api/kandidaten")
      .then((res) => res.json())
      .then((data) => setCandidateList(data))
      .catch((err) => console.error("Fout bij ophalen kandidaten:", err));
  };

  const handleSelect = (key) => {
    if (!selectedCandidates.includes(key)) {
      setSelectedCandidates([...selectedCandidates, key]);
    }
    navigate(`/vacancies?candidate=${key}`);
  };

  const handleRemove = (key) => {
    setSelectedCandidates(selectedCandidates.filter((k) => k !== key));
  };

  const handleAdd = () => {
    setFormMode("add");
    setFormData(null);
    setOpenForm(true);
  };

  const handleEdit = (key) => {
    setFormMode("edit");
    setFormData(candidateList[key]);
    setSelectedKey(key);
    setOpenForm(true);
  };

  const handleDelete = (key) => {
    fetch(`http://localhost:5050/api/kandidaten/${key}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Niet gevonden");
        return res.json();
      })
      .then(() => fetchCandidates())
      .catch((err) => alert("Fout bij verwijderen: " + err.message));
  };

  const handleFormSubmit = (data) => {
    const endpoint = "http://localhost:5050/api/kandidaten";
    const method = formMode === "edit" ? "PUT" : "POST";
    const url = formMode === "edit" ? `${endpoint}/${selectedKey}` : endpoint;
    const payload = formMode === "edit" ? data : { ...data, id: `id-${Date.now()}` };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        fetchCandidates();
        setOpenForm(false);
      })
      .catch((err) => console.error("Fout bij opslaan:", err));
  };

  const filtered = Object.entries(candidateList).filter(([_, c]) => {
    const fullName = `${c.voornaam || ""} ${c.achternaam || ""}`.toLowerCase();
    return fullName.includes(searchInput.toLowerCase()) && (!statusFilter || c.status === statusFilter);
  });

  return (
    <Box sx={{ p: 0.5 }}>
            <Box sx={{ display: "flex" }}>
            <Sidebar
            candidates={candidateList}
            selectedCandidates={selectedCandidates}
            onSelectCandidate={handleSelect}
            onRemoveCandidate={handleRemove}
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
              mt: { xs: 8, md: 0 },
            }}
          >  
     <Header />

     <MainContent 
      handleAdd={handleAdd}
      filtered={filtered}
      handleSelect={handleSelect}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      openForm={openForm}
      formMode={formMode}
      handleFormSubmit={handleFormSubmit}
      searchInput={searchInput}
      setSearchInput={setSearchInput}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      setOpenForm={setOpenForm}
      formData={formData}
      />

</Stack>
    </Box>
    </Box>
    </Box>
  );
};
export default CandidateDashboard;