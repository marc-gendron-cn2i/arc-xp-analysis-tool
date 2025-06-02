const { Configuration, OpenAIApi } = require("openai");

// Configure le client OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Envoie au modèle ChatGPT le JSON ANS de l’article et demande l’analyse.
 * Retourne l’objet JS (titles_AB, title_SEO, tags, IAB_taxonomy, user_needs_analysis).
 */
async function analyzeWithChatGPT(articleJson) {
  const userPrompt = `
Tu es un expert en journalisme et SEO. Voici le contenu de l’article au format ANS JSON :
${JSON.stringify(articleJson)}

1. Propose 3 titres pour des tests A/B (format court et accrocheur).
2. Propose 1 titre optimisé SEO.
3. Suggère une liste de balises (TAGS) en français et en anglais.
4. Propose une taxonomie IAB (category, sub_category).
5. Fais une analyse des besoins des utilisateurs et suggère 3 axes éditoriaux.

Renvoie uniquement un JSON valide au format suivant :
{
  "titles_AB": ["Titre A", "Titre B", "Titre C"],
  "title_SEO": "Mon titre optimisé SEO",
  "tags": ["tag1", "tag2", "tag3"],
  "IAB_taxonomy": { "category": "News", "sub_category": "Local" },
  "user_needs_analysis": ["Besoin 1", "Besoin 2", "Besoin 3"]
}
`;

  const completion = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Tu es un assistant expert en rédaction journalistique." },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });

  const rawContent = completion.data.choices[0].message.content;
  try {
    return JSON.parse(rawContent);
  } catch (err) {
    throw new Error("Réponse ChatGPT non JSON valide : " + rawContent);
  }
}

module.exports = { analyzeWithChatGPT };
