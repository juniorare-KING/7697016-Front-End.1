// Récupération des pièces depuis le fichier JSON
const reponse = await fetch("pieces-autos.json");
const pieces = await reponse.json();

// fonction d'affichage des pieces
function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    //recupération de la balise où les pieces seront affichées
    const sectionFiches = document.querySelector(".fiches");
    //creation d'une balise article pour chaque piece
    const pieceElement = document.createElement("article");
    //remplissage de la balise article
    const imageElement = document.createElement("img");
    imageElement.src = pieces[i].image;
    const nomElement = document.createElement("h2");
    nomElement.innerText = pieces[i].nom;
    const prixElement = document.createElement("p");
    prixElement.innerText =
      "Prix : " +
      pieces[i].prix +
      " € " +
      (pieces[i].prix < 35 ? "(€)" : "(€€€)");
    const categorieElement = document.createElement("p");
    categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)";
    const descriptionElement = document.createElement("p");
    descriptionElement.innerText =
      pieces[i].description ?? "Pas de description disponible.";
    const disponibiliteElement = document.createElement("p");
    disponibiliteElement.innerText = pieces[i].disponibilite
      ? "En stock"
      : "Rupture de stock";
    //rattachement de l'arcticle au DOM
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(disponibiliteElement);
    sectionFiches.appendChild(pieceElement);
    // On rattache la balise article au body
  }
}

// Premier affichage de la page
genererPieces(pieces);

// Ajout des fonctionnalités de tri croissant et de filtrage
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", () => {
  const piecesOrdonnees = Array.from(pieces);

  piecesOrdonnees.sort(function (a, b) {
    return a.prix - b.prix;
  });
  console.log(pieces);
  console.log(piecesOrdonnees);
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonnees);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", () => {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.prix <= 35;
  });
   // ✅ AJOUTÉ : Réaffichage
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
  console.log(piecesFiltrees);
});
// Ajout de la fonctionnalité d'affichage des descriptions
const boutonDescription = document.querySelector(".btn-description");
boutonDescription.addEventListener("click", () => {
  const piecesFiltrees = pieces.filter(function (piece) {
    return piece.description !== undefined;
  });
   // ✅ AJOUTÉ : Réaffichage
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltrees);
  console.log(piecesFiltrees);
});
// Ajout de la fonctionnalité de tri par prix décroissant
const boutonTrierDecroissant = document.querySelector(".btn-trier-decroissant");
boutonTrierDecroissant.addEventListener("click", () => {
  const piecesOrdonneesDecroissant = Array.from(pieces);

  piecesOrdonneesDecroissant.sort(function (a, b) {
    return b.prix - a.prix;
  });
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesOrdonneesDecroissant);
  console.log(piecesOrdonneesDecroissant);
});

/*
const nom = pieces.map(function(piece) {
  return piece.nom
});
*/
const noms = pieces.map((piece) => piece.nom);

//function splice pour supprimer des éléments d'un tableau
for (let i = pieces.length - 1; i >= 0; i--) {
  if (pieces[i].prix > 35) {
    noms.splice(i, 1);
  }
}
console.log(noms);
/*je peux faire la même chose avec filter et map
const noms = pieces
  .filter(piece => piece.prix <= 35)
  .map(piece => piece.nom);

console.log(noms);
*/

// creation de la liste des pieces abordables
const abordablesElement = document.createElement("ul");
for (let i = 0; i < noms.length; i++) {
  const nomsElement = document.createElement("li");
  nomsElement.innerText = noms[i];
  abordablesElement.appendChild(nomsElement);
}
// Ajout de l'en-tête puis de la liste dans la div classée "abordables"
document.querySelector(".abordables").appendChild(abordablesElement);

// creation de la liste des pièces disponibles
// Etape 1 : filtrer les pièces disponibles et récupérer leurs noms
const disponibles = pieces
  .filter((piece) => piece.disponibilite)
  .map((piece) => ({ nom: piece.nom, prix: piece.prix }))
console.log(disponibles);
// Etape 2 : créer la liste des pièces disponibles
const disponiblesElement = document.createElement("ul");
for (let i = 0; i < disponibles.length; i++) {
  const nomElementDisponible = document.createElement("li");
  nomElementDisponible.innerText =
    disponibles[i].nom + " - " + pieces[i].prix + " €";
  disponiblesElement.appendChild(nomElementDisponible);
}
// Etape 3 : ajouter l'en-tête puis la liste dans la div classée "disponibles"
document.querySelector(".disponibles").appendChild(disponiblesElement);

/*suppression de .fiches
  document.querySelector(".fiches").innerHTML = "";*/

// Ajout de la barre de filtrage par prix maximum
const affichagePrixMax = document.getElementById("affichage");
const barrePrixMax = document.getElementById("prix-max");

barrePrixMax.addEventListener("input", () => {
affichagePrixMax.innerText = barrePrixMax.value;
});
//filtrage des pièces selon le prix maximum
barrePrixMax.addEventListener("change", () => {
  const piecesFiltreesPrixMax = pieces.filter(function (piece) {
    return piece.prix <= barrePrixMax.value;
  });
   // ✅ AJOUTÉ : Réaffichage
  document.querySelector(".fiches").innerHTML = "";
  genererPieces(piecesFiltreesPrixMax);
  console.log(piecesFiltreesPrixMax);
})