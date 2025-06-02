const express = require("express");
const router = express.Router();

const { extractArcId, fetchDraftContent } = require("../utils/arcApi");
const { analyzeWithChatGPT } = require("../utils/openaiApi");

router.post("/", async (req, res) => {
  try {
    const { arcIdentifier } = req.body;
    const arcId = extractArcId(arcIdentifier);
    if (!arcId) {
      return res.status(400).json({ status: "error", message: "ID Arc invalide" });
    }

    // 1. Récupérer le contenu Draft via Arc Draft API
    const articleJson = await fetchDraftContent(arcId);

    // 2. Envoyer à ChatGPT pour analyse
    const analysis = await analyzeWithChatGPT(articleJson);

    return res.json({ status: "success", analysis });
  } catch (err) {
    console.error("Erreur /api/analyze :", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
