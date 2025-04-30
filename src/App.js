// src/App.js
import React from 'react';
import CandidateDashboard from './Components/CandidateDashboard/CandidateDashboard';
import VacanciesDashboard from './Components/VacanciesDashboard/VacanciesDashboard';
import VacancyDetail from './Components/VacancyDetail/VacancyDetail';
import VacatureListDashboard from "./Components/VacatureListDashboard/VacatureListDashboard"; 
import { SelectedVacanciesProvider } from "./Components/SelectedVacanciesContext";
import { SelectedCandidatesProvider } from "./Components/SelectedCandidatesContext";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CandidateDashboard from './Components/CandidateDashboard';
// import VacanciesDashboard from './Components/VacanciesDashboard';
//import VacancyDetail from './Components/VacancyDetail';

function App() {
  return (
<SelectedVacanciesProvider>
<SelectedCandidatesProvider>
  <Router>
    <Routes>
      <Route path="/" element={<CandidateDashboard />} />
      <Route path="/vacaturedashboard" element={<VacatureListDashboard />} />
      <Route path="/vacancies" element={<VacanciesDashboard />} />
      <Route path="/vacancy-detail" element={<VacancyDetail />} />
    </Routes>
  </Router>
</SelectedCandidatesProvider>
</SelectedVacanciesProvider>

  );
}

export default App;
