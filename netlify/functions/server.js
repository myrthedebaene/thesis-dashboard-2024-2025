// ✅ Configuratie bovenaan
require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");

const app = express();
const PORT = 5050;  
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ Bestanden & helpers
const MATCH_FILE = path.join(__dirname, "matching.json");
const DATA_FILE = path.join(__dirname, "candidates.json");
const VACATURES_FILE = path.join(__dirname, "vacatures.json");


// ✅ Bestandshelpers
const readJSON = (file) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : {};
const writeJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

const readCandidates = () => readJSON(DATA_FILE);
const writeCandidates = (data) => writeJSON(DATA_FILE, data);

const readVacatures = () => readJSON(VACATURES_FILE);
const writeVacatures = (data) => writeJSON(VACATURES_FILE, data);

const readMatches = () => {
  const data = readJSON(MATCH_FILE);
  return Array.isArray(data) ? data : [];
};

const writeMatches = (data) => writeJSON(MATCH_FILE, data);


const filterOutMatches = ({ kandidaatId = null, vacatureId = null }) => {
  const allMatches = readMatches();
  const updated = allMatches.filter(match => {
    if (kandidaatId && match.kandidaatId === kandidaatId) return false;
    if (vacatureId && match.vacatureId === vacatureId) return false;
    return true;
  });
  writeMatches(updated);
};


// ✅ AI Prompt Helpers
const generateMatchPrompt = (kandidaat, vacature) => `
Je bent een intelligente matching-assistent.

Vergelijk de onderstaande kandidaat met de vacature en genereer een JSON-output in het volgende formaat:

{
  "kandidaatId": "${kandidaat.id}",
  "vacatureId": "${vacature.id}",
  "matchScore": ...,                    // percentage tussen 0–100, gebruik decimale precisie (bv. 82.5)
  "verbeterPotentieel": ...,            // som van impactScores uit aanbevelingen (in %, met decimalen)
  "pluspunten": ["..."],
  "minpunten": ["..."],
  "afstand": "... km",                  // schatting op basis van locaties

  "vaardighedenBarchart": {
    "huidig": "...",                    // percentage (0–100), gebaseerd op huidige skill levels
    "verbetering": "..."                // potentiële verbetering in percentage bij optimale begeleiding
  },
  "kennisBarchart": {
    "huidig": "...",
    "verbetering": "..."
  },
  "attitudeEnPersoonlijkeKenmerkenBarchart": {
    "huidig": "...",
    "verbetering": "..."
  },

  "vaardigheden": [
    {
      "naam": "...",                    // ALLE skills die in de vacature voorkomen onder vaardigheden
      "huidig": ...,                    // level 1 t.e.m. 4
      "verbetering": ...                // haalbare verhoging in level (bv. 1 of 2 niveau's)
    }
  ],
  "kennis": [
    {
      "naam": "...",                    //ALLE skills die in de vacature voorkomen onder kennis
      "huidig": ...,
      "verbetering": ...
    }
  ],
  "attitudeEnPersoonlijkeKenmerken": [
    {
      "naam": "...",                  //ALLE skills die in de vacature voorkomen onder attitudeEnPersoonlijkeKenmerken
      "huidig": ...,
      "verbetering": ...
    }
  ],

  "aanbevelingen": [
    {
      "aanbeveling": "...",             // concrete actie (bv. 'Volg opleiding X', 'Behaal attest Y')
      "impactScore": "+...%",           // verwachte verbetering van de totale matchScore (gebruik decimalen)
      "uitleg": "...",                  // gedetailleerde reden: waarom deze actie nuttig is in deze specifieke context en waarom hij juist die impactScore heeft (waarom bv 5% ipv 10%)
      "impact": [
        { "naam": "...", "impactScore": "+... niveau" }
      ]
    }
  ],

  "belangrijksteFactoren": [
    { 
      "naam": "...",                    // voor ALLE skills in vaardigheden, kennis en attitudeEnPersoonlijkeKenmerken (ook als er geen aanbevelingen van toepssing zijn)
      "invloed": ...,                   // bijdrage aan matchScore in %, ook met decimalen (kan negatief zijn)
      "uitleg": "...",                  // uitleg waarom deze skill belangrijk is voor deze functie (concreet)
      "impactDoorAanbevelingen": [     
        {
          "aanbeveling": "...",         // naam van de aanbeveling
          "impactScore": "+...%",       // hoeveel invloed heeft de aanbeveling op deze skill
          "uitleg": "..."               // gedetailleerd: hoe en waarom deze aanbeveling op deze skill werkt
        }
      ]
    }
  ]
}

Belangrijke instructies:
- Denk na over een goede manier om de percentages te bepalen op een realistische manier
- Alle percentages in barcharts en scores zijn **decimaal nauwkeurig** (bv. 86.2 i.p.v. 86).
- Skillscores zijn **altijd tussen 1 en 4**. **Er bestaat geen level 0.**
- Bepaal zelf hoeveel impact een aanbeveling heeft. Wees realistisch en onderbouw je schatting.
- Bij elke aanbeveling geef je een **duidelijke motivatie** waarom ze impact heeft op de score.
- **BelangrijksteFactoren** moet expliciet elke skill bevatten uit vaardigheden, kennis en attitudeEnPersoonlijkeKenmerken (zelfs bij 0 invloed). Geef per factor:
  - invloed (% met één decimaal)
  - uitleg waarom deze skill cruciaal is
  - impactDoorAanbevelingen: voor elke aanbeveling, impactScore op deze skill en concrete toelichting
- Denk bij aanbevelingen ook aan verplichte attesten, opleidingen of stages die noodzakelijk zijn voor deze functie.
- De verbeterPotentieel is gelijk aan de **som van alle impactScore-waarden uit de aanbevelingen**.

Gebruik deze kandidaatdata:
\`\`\`json
${JSON.stringify(kandidaat, null, 2)}
\`\`\`

Gebruik deze vacaturedata:
\`\`\`json
${JSON.stringify(vacature, null, 2)}
\`\`\`
`;



const parseAndCleanAIResponse = (response) => {
  let text = response.choices?.[0]?.message?.content || "{}";
  return JSON.parse(text.replace(/^```json/, "").replace(/```$/, "").trim());
};

// ✅ API: Kandidaten
app.get("/api/kandidaten", (_, res) => res.json(readCandidates()));

app.get("/api/kandidaten/:id", (req, res) => {
  const kandidaat = readCandidates()[req.params.id];
  if (!kandidaat) return res.status(404).json({ error: "Kandidaat niet gevonden" });
  res.json(kandidaat);
});

app.post("/api/kandidaten", async (req, res) => {
  const all = readCandidates();
  const vacatures = readVacatures();
  const matches = readMatches();

  const id = req.body.id || `${Date.now()}${Math.floor(Math.random() * 100000)}`;
  const kandidaat = { ...req.body, id };
  all[id] = kandidaat;
  writeCandidates(all);

  // ❗ Automatisch matchen met alle bestaande vacatures
  try {
    for (const vacatureId in vacatures) {
      const vacature = vacatures[vacatureId];
      const prompt = generateMatchPrompt(kandidaat, vacature);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Je bent een AI die matchscores tussen kandidaten en vacatures berekent." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      });

      const parsed = parseAndCleanAIResponse(response);
      matches.push(parsed);
    }

    writeMatches(matches);
  } catch (error) {
    console.error("❌ Automatische matching fout (kandidaat):", error);
  }

  res.status(201).json({ message: "Kandidaat opgeslagen + gematcht", id });
});


app.put("/api/kandidaten/:id", async (req, res) => {
  const all = readCandidates();
  const vacatures = readVacatures();
  const id = req.params.id;

  if (!all[id]) return res.status(404).json({ error: "Kandidaat niet gevonden" });

  all[id] = { ...all[id], ...req.body };
  writeCandidates(all);

  filterOutMatches({ kandidaatId: id });

  try {
    const matches = readMatches();
    for (const vacatureId in vacatures) {
      const vacature = vacatures[vacatureId];
      const prompt = generateMatchPrompt(all[id], vacature);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Je bent een AI die matchscores tussen kandidaten en vacatures berekent." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      });
      const parsed = parseAndCleanAIResponse(response);
      matches.push(parsed);
    }
    writeMatches(matches);
  } catch (error) {
    console.error("❌ Matching fout na kandidaat-update:", error);
  }

  res.json({ message: "Kandidaat bijgewerkt + gematcht", kandidaat: all[id] });
});


app.delete("/api/kandidaten/:id", (req, res) => {
  const all = readCandidates();
  const id = req.params.id;

  if (!all[id]) return res.status(404).json({ error: "Kandidaat niet gevonden" });

  delete all[id];
  writeCandidates(all);

  // ❌ Verwijder bijhorende matches
  filterOutMatches({ kandidaatId: id });

  res.json({ message: "Kandidaat verwijderd + matches opgeruimd" });
});


// ✅ API: Vacatures
app.get("/api/vacatures", (_, res) => res.json(readVacatures()));

app.post("/api/vacatures", async (req, res) => {
  const all = readVacatures();
  const kandidaten = readCandidates();
  const matches = readMatches();

  const id = req.body.id || `v-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const vacature = { ...req.body, id };
  all[id] = vacature;
  writeVacatures(all);

  // ❗ Automatisch matchen met alle bestaande kandidaten
  try {
    for (const kandidaatId in kandidaten) {
      const kandidaat = kandidaten[kandidaatId];
      const prompt = generateMatchPrompt(kandidaat, vacature);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Je bent een AI die matchscores tussen kandidaten en vacatures berekent." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      });

      const parsed = parseAndCleanAIResponse(response);
      matches.push(parsed);
    }

    writeMatches(matches);
  } catch (error) {
    console.error("❌ Automatische matching fout (vacature):", error);
  }

  res.status(201).json({ message: "Vacature opgeslagen + gematcht", id });
});


app.put("/api/vacatures/:id", async (req, res) => {
  const all = readVacatures();
  const kandidaten = readCandidates();
  const id = req.params.id;

  if (!all[id]) return res.status(404).json({ error: "Vacature niet gevonden" });

  all[id] = req.body;
  writeVacatures(all);

  // ❌ Verwijder oude matches
  filterOutMatches({ vacatureId: id });

  // ✅ Nieuwe matches aanmaken
  try {
    const matches = readMatches();
    for (const kandidaatId in kandidaten) {
      const kandidaat = kandidaten[kandidaatId];
      const prompt = generateMatchPrompt(kandidaat, all[id]);
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Je bent een AI die matchscores tussen kandidaten en vacatures berekent." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      });
      const parsed = parseAndCleanAIResponse(response);
      matches.push(parsed);
    }
    writeMatches(matches);
  } catch (error) {
    console.error("❌ Matching fout na vacature-update:", error);
  }

  res.json(all[id]);
});
app.delete("/api/vacatures/:id", (req, res) => {
  const all = readVacatures();
  const id = req.params.id;

  if (!all[id]) return res.status(404).json({ error: "Vacature niet gevonden" });

  delete all[id];
  writeVacatures(all);

  // ❌ Verwijder bijhorende matches
  filterOutMatches({ vacatureId: id });

  res.json({ message: "Vacature verwijderd + matches opgeruimd" });
});


// ✅ API: AI Matching
app.get("/api/matching", (req, res) => {
  const matches = readMatches();
  res.json(matches);
});

app.post("/api/match", async (req, res) => {
  const { kandidaatId, vacatureId } = req.body;
  const kandidaten = readCandidates();
  const vacatures = readVacatures();

  const kandidaat = kandidaten[kandidaatId];
  const vacature = vacatures[vacatureId];

  if (!kandidaat || !vacature) {
    return res.status(404).json({ error: "Kandidaat of vacature niet gevonden." });
  }

  const prompt = generateMatchPrompt(kandidaat, vacature);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Je bent een AI die matchscores tussen kandidaten en vacatures berekent." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
    });

    const parsed = parseAndCleanAIResponse(response);
    const allMatches = readMatches();
    allMatches.push(parsed);
    writeMatches(allMatches);

    res.json(parsed);
  } catch (err) {
    console.error("❌ AI Matching error:", err);
    res.status(500).json({ error: "AI matching mislukt" });
  }
});

// ✅ API: AI Assistent (chat)
let lastResponseId = null;
app.post("/api/ai", async (req, res) => {
  const { prompt, previousResponseId, isInitial } = req.body;
  let input = [];

  if (isInitial) {
    input = [
      { role: "system", content: "Je bent een behulpzame AI-assistent die altijd in het Nederlands antwoordt." },
      { role: "user", content: "Antwoord terug: Hallo, ik ben ja AI-assistent, waarmee kan ik je helpen?" }
    ];
  } else if (prompt) {
    input = [{ role: "user", content: prompt }];
  } else {
    return res.status(400).json({ error: "Prompt is verplicht" });
  }

  try {
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input,
      ...(previousResponseId && { previous_response_id: previousResponseId }),
    });

    res.json({
      antwoord: response.output_text || response.choices?.[0]?.message?.content || "Geen antwoord ontvangen.",
      responseId: response.id,
    });
  } catch (error) {
    console.error("❌ Fout bij OpenAI:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ API: Vacature upload + AI parsing
const upload = multer({ dest: "uploads/" });

app.post("/api/upload-vacature", upload.single("pdf"), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Geen bestand ontvangen." });

  try {
    const text = (await pdfParse(fs.readFileSync(file.path))).text;

    const prompt = `
    Je bent een slimme parser. Parseer de onderstaande vacaturetekst in het volgende JSON-formaat:
    
    {
      "titel": "...",
      "bedrijf": "...",
      "loon"; "...",
      "locatie": "...",
      "contract": "...",
      "tijdregeling": "...",
      "werkregime": "...",
      "threshold:" "...%", 
      "vaardighedenBarchartThreshold": "...%",
      "kennisBarchartThreshold": "...%",
      "attitudeEnPersoonlijkeKenmerkenBarchartThreshold": "...%"
      "vaardigheden": [
        {
          "name": "...",
          "threshold": "...",  //in levels
          "levels": {
            "level1": "Uitleg wat dit niveau betekent voor deze skill",
            "level2": "...",
            "level3": "...",
            "level4": "..."
          }
        }
      ],
      "kennis": [
        {
          "name": "...",
          "threshold": "...",  //in levels
          "levels": {
            "level1": "Uitleg wat dit niveau betekent voor deze taal",
            "level2": "...",
            "level3": "...",
            "level4": "..."
          }
        }
      ],
      "attitudeEnPersoonlijkeKenmerken": [
        {
          "name": "...",
          "threshold": "...",  //in levels
          "levels": {
            "level1": "Uitleg wat dit niveau betekent voor deze attitude",
            "level2": "...",
            "level3": "...",
            "level4": "..."
          }
        }
      ],
      "extra": "..."
    }
    
    Belangrijk:
    
    Richtlijnen:
    - Beschrijf per niveau (level1–4) de **concrete taken of gedragingen** die iemand op dat niveau moet kunnen uitvoeren. Gebruik steeds volledige zinnen (2 à 3 per niveau).
    - Stem de uitleg af op de **inhoud van de skill of eigenschap** zelf. Geef bij voorkeur gedragsvoorbeelden of typische werksituaties.
    - Threshold = het niveau dat vereist is voor de functie
    
    - Contract-opties: Vast, Flexijob, Dienstencheques, Tijdelijk, Tijdelijk met optie vast
    - Tijdsregeling-opties: Voltijds, Deeltijds met aantal uren
    - Werkregime-opties: Dagwerk, 3-ploegenstelsel, Weekendwerk, Ploegenstelsel, 2-ploegenstelsel, Nachtwerk, Onderbroken dienst, Volcontinu systeem
    - Threshold = level gevraagd in vacature. Moet je zelf uit de vacature afleiden of berekenen
    - Gemiddelde = gemiddeld level van medewerkers die zo een job uitvoeren
    
    De volgenden elementen moeten de threshold (in percentage) bevatten die in het algemeen nodig is voor respectievelijk vaardigheden, kennis en attitudeEnPersoonlijkeKenmerken:
    vaardighedenBarchartThreshold, kennisBarchartThreshold en attitudeEnPersoonlijkeKenmerkenBarchartThreshold.

    De levels: leg zeer duidelijk de TAKEN uit die nodig zijn per level:
    - **level1**: Beginner 
    - **level2**: Basis 
    - **level3**: Bekwaam
    - **level4**: Expert
    
    Max aantallen:
    - vaardigheden: max 3, ik bedoel hier echt taken die ze moeten doen (geen attidude en persoonlijke kenmerken)
    - kennis (talen): alle die je in de tekst herkent
    - attitudeEnPersoonlijkeKenmerken: max 6
    
    exta: belangrijke overige info
    
    Hieronder volgt de vacaturetekst:
    
    Vacaturetekst:
    ${text}
    `;
    
    

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Je bent een AI die tekst omzet naar gestructureerde JSON." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    let raw = response.choices?.[0]?.message?.content || "{}";
    raw = raw.replace(/^```json/, "").replace(/```$/, "").trim();

    const parsed = JSON.parse(raw);
    res.json(parsed);
  } catch (err) {
    console.error("❌ Fout bij PDF/AI:", err);
    res.status(500).json({ error: "Verwerking mislukt." });
  } finally {
    fs.unlinkSync(file.path);
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server draait op http://localhost:${PORT}`);
});
module.exports.handler = serverless(app);