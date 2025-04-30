import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import VacatureTabel from "./VacatureTabel"; 

const Header = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [parsedVacature, setParsedVacature] = useState(null);
  const [toegevoegdeVacature, setToegevoegdeVacature] = useState(null);
  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("pdf", file);
  
    setUploadStatus("uploading");
  
    try {
      const res = await fetch("http://localhost:5050/api/upload-vacature", {
        method: "POST",
        body: formData,
      });
  
      const data = await res.json();
      console.log("✅ Geparste JSON:", data);
  
      const vacatureToSave = { ...data, id: `v-${Date.now()}` };
      setParsedVacature(vacatureToSave);
  
      await fetch("http://localhost:5050/api/vacatures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vacatureToSave),
      });
  
      // ✅ Update state die aan de tabel wordt doorgegeven
      setToegevoegdeVacature(vacatureToSave);
  
      setUploadStatus("success");
  
    } catch (err) {
      console.error("❌ Fout bij uploaden:", err);
      setUploadStatus("error");
    }
  };
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': [] },
  });

  return (
    <Box sx={{ width: '100%'}}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1, mb: 2, border: "1px solid #ccc", borderRadius: "4px" }}>

      {/* Upload-knop */}
                <Typography variant="h4">Vacatures</Typography>
                <Button variant="contained" onClick={() => setUploadOpen(true)}>
  Vacature Toevoegen
</Button>



            </Box>
            <VacatureTabel newVacature={toegevoegdeVacature}/>

      {/* Upload Dialoog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Vacature toevoegen</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              p: 3,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: isDragActive ? "#f0f8ff" : "inherit",
            }}
          >
            <input {...getInputProps()} />
            <Typography>
              {isDragActive
                ? "Laat los om te uploaden..."
                : "Sleep hier een vacature (PDF) of klik om te kiezen"}
            </Typography>
          </Box>

          {uploadStatus === "uploading" && <Typography sx={{ mt: 2 }}>Bezig met uploaden...</Typography>}
          {uploadStatus === "success" && <Typography sx={{ mt: 2, color: "green" }}>Upload gelukt!</Typography>}
          {uploadStatus === "error" && <Typography sx={{ mt: 2, color: "red" }}>Fout bij uploaden.</Typography>}

          {uploadStatus === "success" && parsedVacature && (
            <Box sx={{ mt: 3, bgcolor: "#f9f9f9", p: 2, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Geparste vacature:</Typography>
              <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                {JSON.stringify(parsedVacature, null, 2)}
              </pre>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadOpen(false)}>Sluiten</Button>
        </DialogActions>
      </Dialog>
      </Box>

  );
};

export default Header;
