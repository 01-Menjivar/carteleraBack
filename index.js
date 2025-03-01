const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path')
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

let meetings = [
    {
        meetingRoom: "Punta Roca",
        meetingName: "Chivo Pets",
        date: "2025-06-03"
        

    }
    
];

const roomLocationMap = {
  "Punta Mango": "",
  "El Tunco": "",
  "Tamanique": "",
  "Los Cóbanos": "",
  "Punta Roca": "./images/PuntaRoca.png",
  "Taquillo": "",
  "Tasajera": "",
  "Barra de Santiago": "",
  "Costa del Sol": "",
  "El Palmarcito": "",
  "El Zapote": "",
  "Salinitas": "",
  "El Sunzal": "",
  "Tamarindo": "",
  "Mizata": "",
  "El Cuco": "",
  "Sala D": "",
  "Sala B": "",
  "Zunganera": "",
  "San Blas": "",
};

const getLocationUrl = (roomName) => {
  return roomLocationMap[roomName] || roomLocationMap.default;
};

// Rutas de la API
app.get("/api/meetings", (req, res) => {
    res.json(meetings);
  });
  
  app.get("/api/meetings/:id", (req, res) => {
    const id = Number(req.params.id);
    const meeting = meetings.find((meeting) => meeting.id === id);
    meeting ? res.json(meeting) : res.status(404).end();
  });
  
  app.post("/api/meetings", (req, res) => {
    const body = req.body;
    if (!body.meetingRoom || !body.meetingName) {
      return res.status(400).json({ error: "content missing" });
    }
    const meeting = {
      meetingRoom: body.meetingRoom,
      meetingName: body.meetingName,
      date: body.date,
      start: body.start,
      end: body.end,
      location: getLocationUrl(body.meetingRoom),
      id: generateId(),
    };
    meetings = meetings.concat(meeting);
    res.json(meeting);
  });
  
  app.delete("/api/meetings/:id", (req, res) => {
    const id = Number(req.params.id);
    meetings = meetings.filter((meeting) => meeting.id !== id);
    res.status(204).end();
  });
  
  // Servir React después de las rutas de la API
  app.use(express.static(path.join(__dirname, "dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
