// src/components/CandidateDashboard/CandidateDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams} from "react-router-dom";
import { SelectedCandidatesContext } from "../SelectedCandidatesContext";
import { Box, Stack } from "@mui/material";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./Sidebar";
import candidatesData from "../../data/candidates.json";


const CandidateDashboard = () => {
  const [candidateList, setCandidateList] = useState(candidatesData);
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
    localStorage.setItem("selectedCandidates", JSON.stringify(selectedCandidates));
  }, [selectedCandidates]);

  useEffect(() => {
    const storedSelected = localStorage.getItem("selectedCandidates");
    if (storedSelected) {
      setSelectedCandidates(JSON.parse(storedSelected));
    }
  }, []);



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
    const ok = window.confirm("Weet je zeker dat je deze kandidaat wilt verwijderen?");
    if (!ok) return;

    setCandidateList(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    // Optioneel: als je ook wilt dat 'selectedCandidates' bijgewerkt wordt:
    setSelectedCandidates(prev => prev.filter(k => k !== key));
  };
      const handleFormSubmit = (data) => {
        if (formMode === "edit") {
              setCandidateList(prev => ({
                ...prev,
                [selectedKey]: { ...prev[selectedKey], ...data }
              }));
            } else {
              const newId = `id-${Date.now()}`;
              setCandidateList(prev => ({
                ...prev,
                [newId]: { ...data, id: newId }
              }));
            }}

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