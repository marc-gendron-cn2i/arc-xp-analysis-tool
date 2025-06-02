require("dotenv").config();            
const express = require("express");
const bodyParser = require("body-parser");
const analyzeRoute = require("./routes/analyze");
const applyRoute = require("./routes/applyChanges");

const app = express();
app.use(bodyParser.json());

// CORS minimal (autorise toutes origines, à restreindre en prod)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Routes backend
app.use("/api/analyze", analyzeRoute);
app.use("/api/applyChanges", applyRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend démarré sur le port ${PORT}`);
});
