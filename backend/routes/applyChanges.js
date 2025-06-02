const express = require("express");
const router = express.Router();

const { extractArcId, fetchDraftContent, updateDraftContent } = require("../utils/arcApi");

router.post("/", async (req, res) => {
  try {
    const { arcIdentifier, chosenTitle, seoTitle, checkedTags, IAB_taxonomy } = req.body;
    const arcId = extractArcId(arcIdentifier);
    if (!arcId) {
      return res.status(400).json({ status: "error", message: "ID Arc invalide" });
    }

    // 1. Récupérer la Draft complète
    const draft = await fetchDraftContent(arcId);

    // 2. Modifier les champs nécessaires
    draft.headline = chosenTitle;
    draft.subheadline = seoTitle;
    draft.metadata = draft.metadata || {};
    draft.metadata.tags = checkedTags;
    draft.metadata.IAB_taxonomy = IAB_taxonomy;

    // 3. Envoyer le PUT à Arc Draft API pour mise à jour
    await updateDraftContent(arcId, draft);

    return res.json({ status: "success" });
  } catch (err) {
    console.error("Erreur /api/applyChanges :", err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
