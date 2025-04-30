export const getInitials = (candidate) => {
    if (candidate.voornaam && candidate.achternaam) {
      return (candidate.voornaam[0] + candidate.achternaam[0]).toUpperCase();
    }
    return candidate.naam ? candidate.naam.split(" ").map((p) => p[0]).join("").toUpperCase() : "";
  };
  
export const validateField = (field, value) => {
  if (field === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "" : "Ongeldig e-mailadres";
  }

  if (field === "telefoon") {
    const telefoonRegex = /^(\+?\d{1,3}[\s-]?)?(\(?\d{2,4}\)?[\s-]?)?\d{6,10}$/;
    return telefoonRegex.test(value) ? "" : "Ongeldig telefoonnummer";
  }

  return "";
};

  