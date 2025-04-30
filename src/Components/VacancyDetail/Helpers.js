// src/components/helpers/helpers.js

// Genereer initialen voor een kandidaat
export const getInitials = (candidate) => {
    if (candidate.voornaam && candidate.achternaam) {
      return (candidate.voornaam[0] + candidate.achternaam[0]).toUpperCase();
    }
    return candidate.naam
      ? candidate.naam.split(" ").map((p) => p[0]).join("").toUpperCase()
      : "";
  };
  
  // Validatie voor velden als e-mail en telefoonnummer
  export const validateField = (field, value) => {
    let error = "";
  
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        error = "Voer een geldig e-mailadres in";
      }
    }
  
    if (field === "telefoon") {
      const phoneRegex = /^[0-9]{8,15}$/;
      if (value && !phoneRegex.test(value)) {
        error = "Voer een geldig telefoonnummer in (8-15 cijfers)";
      }
    }
  
    return error;
  };
  