const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function analyzeWithChatGPT(articleJson) {
  const userPrompt = `
  Tu es un expert en journalisme et SEO. Analyse ce contenu d’article au format ANS JSON :
  ${JSON.stringify(articleJson)}
  1. Propose 3 titres pour test A/B.
  2. Propose un titre optimisé SEO.
  3. Suggère une liste de balises (TAGS) en français et en anglais.
  4. Propose une taxonomie IAB (catégorie et sous-catégorie).
  5. Fais une analyse des besoins utilisateurs et suggère 3 axes éditoriaux.
  Retourne uniquement un JSON valide :
  {
    "titles_AB": ["...", "...", "..."],
    "title_SEO": "...",
    "tags": ["...", "...", ...],
    "IAB_taxonomy": { "category": "...", "sub_category": "..." },
    "user_needs_analysis": ["...","...","..."]
  }`;
  
  const completion = await openai.createChatCompletion({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Tu es un assistant expert en rédaction journalistique." },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
  });
  const content = completion.data.choices[0].message.content;
  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error("Réponse ChatGPT non JSON valide : " + content);
  }
}

module.exports = { analyzeWithChatGPT };
