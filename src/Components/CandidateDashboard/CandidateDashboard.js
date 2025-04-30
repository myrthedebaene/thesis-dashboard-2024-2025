// src/components/CandidateDashboard/CandidateDashboard.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SelectedCandidatesContext } from "../SelectedCandidatesContext";
import { Box, Stack } from "@mui/material";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./Sidebar";
import candidatesData from "../../data/candidates.json";

const CandidateDashboard = () => {
  // 1) Al je kandidaten lokaal laden uit JSON
  const [candidateList, setCandidateList] = useState(candidatesData);

  // 2) State voor filtering, form, selectie, etc.
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedKey, setSelectedKey] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [formData, setFormData] = useState(null);

  // 3) Context voor welke kandidaten geselecteerd zijn
  const { selectedCandidates, setSelectedCandidates } = useContext(SelectedCandidatesContext);

  // 4) Router hooks
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const candidateKey = searchParams.get("candidate");

  // 5) Persist selection in localStorage
  useEffect(() => {
    localStorage.setItem("selectedCandidates", JSON.stringify(selectedCandidates));
  }, [selectedCandidates]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedCandidates");
    if (stored) {
      setSelectedCandidates(JSON.parse(stored));
    }
  }, [setSelectedCandidates]);

  // 6) **Nieuwe hook**: als er via URL een candidateKey staat en nog niets geselecteerd is,
  //    zet die kandidaat dan direct in de selectie (zodat je op Netlify iets ziet)
  useEffect(() => {
    if (candidateKey && selectedCandidates.length === 0) {
      setSelectedCandidates([candidateKey]);
    }
  }, [candidateKey, selectedCandidates, setSelectedCandidates]);

  // 7) Handlers
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

    setCandidateList((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setSelectedCandidates((prev) => prev.filter((k) => k !== key));
  };

  const handleFormSubmit = (data) => {
    if (formMode === "edit") {
      setCandidateList((prev) => ({
        ...prev,
        [selectedKey]: { ...prev[selectedKey], ...data }
      }));
    } else {
      const newId = `id-${Date.now()}`;
      setCandidateList((prev) => ({
        ...prev,
        [newId]: { ...data, id: newId }
      }));
    }
    setOpenForm(false);
  };

  // 8) Filter logic
  const filtered = Object.entries(candidateList).filter(([_, c]) => {
    const fullName = `${c.voornaam || ""} ${c.achternaam || ""}`.toLowerCase();
    return (
      fullName.includes(searchInput.toLowerCase()) &&
      (!statusFilter || c.status === statusFilter)
    );
  });

  // 9) Render
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
            overflow: "auto",
          }}
        >
          <Stack
            spacing={0.5}
            sx={{
              alignItems: "center",
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
