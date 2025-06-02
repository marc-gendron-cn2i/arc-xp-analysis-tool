// Configuration : URL du backend. 
// Remplacez localhost par l’URL finale une fois déployé.
const API_BASE = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
  const arcInput = document.getElementById("arcInput");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const loader = document.getElementById("loader");
  const resultContainer = document.getElementById("resultContainer");

  analyzeBtn.addEventListener("click", async () => {
    const inputValue = arcInput.value.trim();
    if (!inputValue) {
      alert("Veuillez saisir un ID ou une URL valide.");
      return;
    }

    // Affiche le loader et vide le résultat précédent
    loader.classList.remove("hidden");
    resultContainer.innerHTML = "";

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arcIdentifier: inputValue }),
      });
      const data = await response.json();

      loader.classList.add("hidden");

      if (data.status === "success") {
        renderAnalysis(data.analysis, inputValue);
      } else {
        resultContainer.innerHTML = `<p style="color: red;">Erreur : ${data.message}</p>`;
      }
    } catch (err) {
      loader.classList.add("hidden");
      resultContainer.innerHTML = `<p style="color: red;">Erreur serveur : ${err.message}</p>`;
    }
  });

  function renderAnalysis(analysis, arcIdentifier) {
    resultContainer.innerHTML = ""; // nettoyage

    // 1. Titres A/B
    const sectionAB = document.createElement("div");
    sectionAB.className = "section";
    sectionAB.innerHTML = `<h3>Titres pour test A/B :</h3>`;
    analysis.titles_AB.forEach((titre, idx) => {
      const idRadio = `titleAB_${idx}`;
      sectionAB.innerHTML += `
        <label for="${idRadio}">
          <input type="radio" name="titleChoice" id="${idRadio}" value="${titre}" ${idx === 0 ? "checked" : ""}/>
          ${titre}
        </label><br/>
      `;
    });
    resultContainer.appendChild(sectionAB);

    // 2. Titre SEO
    const sectionSEO = document.createElement("div");
    sectionSEO.className = "section";
    sectionSEO.innerHTML = `
      <h3>Titre SEO suggéré :</h3>
      <input type="text" id="seoTitleInput" value="${analysis.title_SEO}" style="width: 100%; padding: 6px; border: 1px solid #ccc; border-radius: 4px;" />
    `;
    resultContainer.appendChild(sectionSEO);

    // 3. Tags
    const sectionTags = document.createElement("div");
    sectionTags.className = "section";
    sectionTags.innerHTML = `<h3>Tags suggérés :</h3>`;
    analysis.tags.forEach((tag, idx) => {
      const idChk = `tagChoice_${idx}`;
      sectionTags.innerHTML += `
        <label for="${idChk}" style="margin-right: 8px;">
          <input type="checkbox" name="tagChoice" id="${idChk}" value="${tag}" checked/>
          ${tag}
        </label>
      `;
    });
    resultContainer.appendChild(sectionTags);

    // 4. Taxonomie IAB
    const sectionIAB = document.createElement("div");
    sectionIAB.className = "section";
    sectionIAB.innerHTML = `
      <h3>Taxonomie IAB suggérée :</h3>
      <p>Catégorie : <strong>${analysis.IAB_taxonomy.category}</strong></p>
      <p>Sous‐catégorie : <strong>${analysis.IAB_taxonomy.sub_category}</strong></p>
    `;
    resultContainer.appendChild(sectionIAB);

    // 5. Analyse des besoins utilisateurs
    const sectionNeeds = document.createElement("div");
    sectionNeeds.className = "section";
    sectionNeeds.innerHTML = `<h3>Analyse des besoins utilisateurs :</h3><ul>`;
    analysis.user_needs_analysis.forEach((need) => {
      sectionNeeds.innerHTML += `<li>${need}</li>`;
    });
    sectionNeeds.innerHTML += `</ul>`;
    resultContainer.appendChild(sectionNeeds);

    // 6. Bouton pour appliquer les modifications
    const applyBtn = document.createElement("button");
    applyBtn.textContent = "Appliquer les modifications dans Arc XP";
    applyBtn.className = "btn-primary";
    applyBtn.style.marginTop = "1rem";
    resultContainer.appendChild(applyBtn);

    applyBtn.addEventListener("click", () => {
      collectAndApplyChanges(arcIdentifier);
    });
  }

  async function collectAndApplyChanges(arcIdentifier) {
    const chosenTitle = document.querySelector("input[name='titleChoice']:checked").value;
    const seoTitle = document.getElementById("seoTitleInput").value.trim();
    const checkedTags = Array.from(document.querySelectorAll("input[name='tagChoice']:checked"))
                             .map((el) => el.value);
    const category = document.querySelector(".section:nth-child(4) strong").textContent;
    const subCategory = document.querySelector(".section:nth-child(4) strong + strong").textContent;
    const IAB_taxonomy = { category, sub_category: subCategory };

    const payload = {
      arcIdentifier,
      chosenTitle,
      seoTitle,
      checkedTags,
      IAB_taxonomy
    };

    try {
      const resp = await fetch(`${API_BASE}/applyChanges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      if (data.status === "success") {
        alert("Les modifications ont été appliquées avec succès dans Arc XP !");
      } else {
        alert("Erreur lors de l’application : " + data.message);
      }
    } catch (err) {
      alert("Erreur serveur lors de l’application : " + err.message);
    }
  }
});
