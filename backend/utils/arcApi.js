const axios = require("axios");

// Extrait l’ID Arc (26 caractères) ou depuis une URL
function extractArcId(input) {
  const simpleIdPattern = /^[A-Za-z0-9]{26}$/;
  if (simpleIdPattern.test(input)) {
    return input;
  }
  const urlPattern = /([A-Za-z0-9]{26})(?:\/)?$/;
  const match = input.match(urlPattern);
  return match ? match[1] : null;
}

// Récupère le JSON ANS de la Draft via Arc Draft API
async function fetchDraftContent(arcId) {
  const ACCESS_TOKEN = process.env.ARC_ACCESS_TOKEN;
  const endpoint = process.env.ARC_DRAFT_ENDPOINT;
  const url = `${endpoint}/drafts/${arcId}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      Accept: "application/vnd.automate-content+json; charset=utf-8",
    },
  });
  return response.data;
}

// Met à jour la Draft via Arc Draft API
async function updateDraftContent(arcId, draftJson) {
  const ACCESS_TOKEN = process.env.ARC_ACCESS_TOKEN;
  const endpoint = process.env.ARC_DRAFT_ENDPOINT;
  const url = `${endpoint}/drafts/${arcId}`;

  await axios.put(url, draftJson, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/vnd.automate-content+json; charset=utf-8",
    },
  });
}

module.exports = {
  extractArcId,
  fetchDraftContent,
  updateDraftContent,
};
