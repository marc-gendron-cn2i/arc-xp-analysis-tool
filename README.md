# Outil d’analyse d’article Arc XP (Full GitHub Online)

Ce dépôt contient une application full-JavaScript (backend + frontend) que vous pouvez créer et modifier entièrement **depuis l’interface web de GitHub**.  
Elle permet de :
1. Récupérer le contenu d’un article Arc XP via l’API Draft.
2. Faire analyser ce contenu par ChatGPT (titres A/B, SEO, tags, IAB, besoins utilisateurs).
3. Afficher les résultats de façon interactive.
4. Appliquer les suggestions dans Arc XP via un PUT sur la Draft.

## Structure du dépôt

arc-xp-analysis-tool/
├── backend/
│ ├── .env.example
│ ├── package.json
│ ├── server.js
│ ├── routes/
│ │ ├── analyze.js
│ │ └── applyChanges.js
│ └── utils/
│ ├── arcApi.js
│ └── openaiApi.js
├── frontend/
│ ├── index.html
│ ├── scripts/
│ │ └── main.js
│ └── styles/
│ └── style.css
└── README.md


## Développement en ligne (GitHub)

1. **Créez le dépôt** sur GitHub (Privé ou Public).  
2. **Dans l’interface GitHub**, utilisez “Add file → Create new file” pour créer chaque dossier/fichier tel que décrit ci-dessus.  
3. **Ne jamais commiter vos vraies clés** dans le dépôt :  
   - Le fichier `backend/.env.example` montre la structure, mais vous ne commitez pas `.env` avec les vraies valeurs.  
4. **Pour tester en local** (optionnel) :  
   - Clonez le repo, `cd backend`, copiez `.env.example` → `.env` avec vos vraies clés, puis `npm install && npm start`.  
   - Ouvrez ensuite `frontend/index.html` (ou configurez le backend pour servir le frontend).  

## Déploiement

- **Backend** : hébergez-le sur un service Node.js (Heroku, Render, Vercel, etc.). Configurez vos variables d’environnement (`ARC_DRAFT_ENDPOINT`, `ARC_ACCESS_TOKEN`, `OPENAI_API_KEY`).  
- **Frontend** : soit servi par le backend (Express), soit déployé en statique (GitHub Pages, Netlify, etc.). Si vous utilisez GitHub Pages pour `frontend/`, assurez-vous de modifier `API_BASE` dans `main.js` pour pointer vers l’URL de votre backend en production.

## Utilisation

1. Ouvrez la page web (URL du frontend).  
2. Saisissez l’ID (ou l’URL contenant l’ID) d’un article Arc XP.  
3. Cliquez sur **“Lancer l’analyse”**.  
4. Choisissez parmi les suggestions (titre A/B, SEO, tags, IAB, besoins utilisateurs).  
5. Cliquez sur **“Appliquer les modifications dans Arc XP”**.  

Vos modifications seront poussées directement dans la Draft de l’article via l’API Arc XP.  

