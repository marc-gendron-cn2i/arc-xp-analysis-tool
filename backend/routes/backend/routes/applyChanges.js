const express = require("express");
const router = express.Router();
const { extractArcId, updateDraftContent } = require("../utils/arcApi");

router.post("/", async (req, res) => {
  try {
    const { arcIdentifier, chosenTitle, seoTitle, checkedTags } = req.body;
    const arcId = extractArcId(arcIdentifier);
    if (!arcId) {
      return res.status(400).json({ status: "error", message: "ID Arc invalide" });
    }
    // 1. Construire le payload ANS modifié
    //    On doit d’abord récupérer à nouveau la Draft pour avoir l’ANS complet
    const draft = await fetchDraftContent(arcId);
    //    On modifie les champs nécessaires
    draft.headline = chosenTitle;
    draft.subheadline = seoTitle; // ou autre champ pour SEO
    //    Mettre à jour la liste de tags
    draft.metadata = draft.metadata || {};
    draft.metadata.tags = checkedTags;
    //    (Éventuellement gérer la taxonomie IAB dans draft.metadata.IAB)
    // 2. Appel PUT pour mettre à jour
    await updateDraftContent(arcId, draft);
    return res.json({ status: "success" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
