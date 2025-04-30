// SelectedCandidatesContext.js
import React, { createContext, useState, useEffect } from "react";

export const SelectedCandidatesContext = createContext();

export const SelectedCandidatesProvider = ({ children }) => {
  const [selectedCandidates, setSelectedCandidates] = useState(() => {
    const stored = localStorage.getItem("selectedCandidates");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("selectedCandidates", JSON.stringify(selectedCandidates));
  }, [selectedCandidates]);

  return (
    <SelectedCandidatesContext.Provider value={{ selectedCandidates, setSelectedCandidates }}>
      {children}
    </SelectedCandidatesContext.Provider>
  );
};
