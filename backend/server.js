require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const analyzeRoute = require("./routes/analyze");
const applyRoute = require("./routes/applyChanges");

const app = express();
app.use(bodyParser.json());
// Pour un intranet, on peut restreindre le CORS à un domaine interne
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://intranet.monsite.com");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/api/analyze", analyzeRoute);
app.use("/api/applyChanges", applyRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
