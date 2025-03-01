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
  "Punta Mango": "",
  "El Tunco": "",
  "Tamanique": "",
  "Los Cóbanos": "",
  "Punta Roca": "./assets/images/PuntaRoca.png",
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
    const imagePath = roomLocationMap[roomName];
    if (!imagePath) return ""; 
  
    const baseURL = process.env.NODE_ENV === "production"
      ? "https://carteleraback.onrender.com/"
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

  app.use('/assets/images', (req, res, next) => {
    console.log(`Solicitud de imagen: ${req.url}`);
    console.log(`Ruta completa: ${path.join(__dirname, 'assets', 'images', req.url)}`);
    next();
  }, express.static(path.join(__dirname, 'assets', 'images')));

  
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
