const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path')
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

let meetings = [];

const roomLocationMap = {
  "Punta Mango": "./assets/images/PuntaMango.png",
  "El Tunco": "./assets/images/ElTunco.png",
  "Tamanique": "./assets/images/Tamanique.png",
  "Los Cóbanos": "./assets/images/LosCobanos.png",
  "Punta Roca": "./assets/images/PuntaRoca.png",
  "Taquillo": "./assets/images/Taquillo.png",
  "Tasajera": "./assets/images/Tasajera.png",
  "Barra de Santiago": "./assets/images/BarraSantiago.png",
  "Costa del Sol": "./assets/images/CostaSol.png",
  "El Palmarcito": "./assets/images/ElPalmarcito.png",
  "El Zapote": "./assets/images/ElZapote.png",
  "Salinitas": "./assets/images/Salinitas.png",
  "El Sunzal": "./assets/images/ElSunzal.png",
  "El Tamarindo": "./assets/images/ElTamarindo.png",
  "Mizata": "./assets/images/Mizata.png",
  "El Cuco": "./assets/images/ElCuco.png",
  "Sala D": "./assets/images/SalaD.png",
  "Sala B": "./assets/images/SalaB.png",
  "Zunganera": "./assets/images/Zunganera.png",
  "San Blas": "./assets/images/SanBlas.png",
};  

const getLocationUrl = (roomName) => {
  const imagePath = roomLocationMap[roomName];
  if (!imagePath) return ""; 

  const baseURL = process.env.NODE_ENV === "production"
    ? "https://carteleraback.onrender.com"
    : "http://localhost:3001";

  return `${baseURL}/assets/images/${path.basename(imagePath)}`;
};

  

const generateId = () => {
    const id = Math.floor(Math.random()*1000)
    return id
  }

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

  app.use('/assets/images', express.static(path.join(__dirname, 'assets', 'images')));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
