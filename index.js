const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require('path')
const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());


app.use(express.static(path.join(__dirname, "dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });

let meetings = [];

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

app.get("/info", (request, response) => {
  response.send("<h1>API Cartelera de Meetings Chivo</h1>");
});

app.get("/api/meetings", (request, response) => {
  response.json(meetings);
});

app.get("/api/meetings/:id", (request, response) => {
  const id = Number(request.params.id);
  const meeting = meetings.find((meeting) => meeting.id === id);

  if (meeting) {
    response.json(meeting);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/meetings/:id", (request, response) => {
  const id = Number(request.params.id);
  meetings = meetings.filter((meeting) => meeting.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

app.post("/api/meetings", (request, response) => {
  const body = request.body;

  if (!body.meetingRoom || !body.meetingName) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const locationUrl = getLocationUrl(body.meetingRoom);

  const meeting = {
    meetingRoom: body.meetingRoom,
    meetingName: body.meetingName,
    date: body.date,
    start: body.start,
    end: body.end,
    location: locationUrl,
    id: generateId(),
  };

  meetings = meetings.concat(meeting);

  response.json(meeting);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
