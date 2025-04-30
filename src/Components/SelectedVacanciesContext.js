// SelectedVacanciesContext.js
import React, { createContext, useState, useEffect } from "react";

export const SelectedVacanciesContext = createContext();

export const SelectedVacanciesProvider = ({ children }) => {
  const [selectedVacancies, setSelectedVacancies] = useState(() => {
    const stored = localStorage.getItem("selectedVacancies");
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem("selectedVacancies", JSON.stringify(selectedVacancies));
  }, [selectedVacancies]);

  return (
    <SelectedVacanciesContext.Provider value={[selectedVacancies, setSelectedVacancies]}>
      {children}
    </SelectedVacanciesContext.Provider>
  );
};
