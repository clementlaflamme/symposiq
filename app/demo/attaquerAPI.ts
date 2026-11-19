const URL_API = "https://localhost:3000/api/evenements";

const dansTrenteJours = new Date(
  Date.now() + 30 * 24 * 60 * 60 * 1000,
).toISOString();

const valide = {
  title: "Midi-conférence sur la cybersécurité",
  location: "Palais des Congrès",
  startsAt: dansTrenteJours,
  capacity: 40,
  price: "25.00",
};

const tentative: { nom: string; corps: unknown }[] = [
  { nom: "1. Requête correcte", corps: valide },
  { nom: "2. Titre vide", corps: { ...valide, title: "" } },
  {
    nom: "3. Champs de trop",
    corps: { ...valide, statut: "PUBLISHED", seatsTaken: 40 },
  },
  {
    nom: "4. Date dépassée",
    corps: { ...valide, startsAt: "2020-01-01T09:00:00.000Z" },
  },
  { nom: "5. Capacité négative", corps: { ...valide, capacity: -5 } },
  { nom: "6. Prix vide", corps: { ...valide, price: "" } },
  { nom: "7. Prix négatif", corps: { ...valide, price: -5 } },
  { nom: "8. Prix avec virgule", corps: { ...valide, price: "25,99" } },
  { nom: "9. Prix énorme", corps: { ...valide, price: "10000000.00" } },
  { nom: "10. Prix en lettres", corps: { ...valide, price: "ABC" } },
];

async function envoyer(nom: string, corps: unknown) {
  const texte = typeof corps === "string" ? corps : JSON.stringify(corps);
  const reponse = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "applicatino/json" },
    body: texte,
  });
  const brut = await reponse.text();
  console.log(`${nom} -> HTTP : ${reponse.status}`);
  try {
    const json = JSON.parse(brut);
    if (reponse.status === 201){
        const {title, location, capacity, startsAt, seatsTaken, status, priceCents} = json;
        console.log("Créé : ", {title, location, capacity, startsAt, seatsTaken, status, priceCents});
    } else {
        console.log("Réponse : ", JSON.stringify(json));
    }
  } catch {
    console.log("Réponse : ", brut);
  }
}

async function lancerAttaques() {
    for (const {nom, corps} of tentative) {
        await envoyer (nom, corps);
    }
}

lancerAttaques();
