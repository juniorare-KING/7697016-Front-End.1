// Fonction pour ajouter des écouteurs d'événements aux boutons d'avis
export function ajoutListenersAvis() {
  // Sélectionne tous les boutons d'avis dans les articles
  const piecesElements = document.querySelectorAll(".fiches article button");

  // Parcourt chaque bouton et ajoute un écouteur d'événement
  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      // Récupère l'ID de l'élément à partir de l'attribut de données
      const id = event.target.dataset.id;
      // Effectue une requête fetch pour obtenir les avis de la pièce correspondante
      const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
      /* affichage JSON brut dans la console
      const texteSecret = await reponse.text();
      console.log(texteSecret);*/

      // Traduit les données JSON en objet JavaScript
      const avis = await reponse.json();
      console.log(avis);
      // salvegarde de l'avis dans le localStorage
      localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));

      // Affiche les avis pour la pièce correspondante dans un paragraph
      // Récupère l'élément parent (article) du bouton cliqué
      const pieceElement = event.target.parentElement;
      // Appelle la fonction pour afficher les avis de la pièce
      afficherAvis(pieceElement, avis);
    });
  }
}
// Fonction pour afficher les avis d'une pièce à partir du localStorage
export function afficherAvis(pieceElement, avis) {
  // Crée un élément paragraphe pour afficher les avis
  const avisElement = document.createElement("p");
  avisElement.classList.add("avis");
  // Remplit le paragraphe avec les avis formatés
  for (let j = 0; j < avis.length; j++) {
    let nomUtilisateur =
      avis[j]?.utilisateur ??
      avis[j]?.user ??
      avis[j]?.username ??
      avis[j]?.nom ??
      "Anonyme";
    if (
      nomUtilisateur == null ||
      nomUtilisateur === "" ||
      nomUtilisateur === "undefined"
    ) {
      nomUtilisateur = "Anonyme";
    }
    const commentaire = avis[j]?.commentaire ?? "";
    avisElement.innerHTML += `${nomUtilisateur} : ${commentaire} <br/>`;
  }
  pieceElement.appendChild(avisElement);
}

// Fonction pour ajouter des écouteurs d'événements pour l'envoi du formulaire d'avis
export function ajoutListenersEnvoyerAvis() {
  const formulaireAvis = document.querySelector(".formulaire-avis");
  formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    // Création de l'objet du nouvel avis
    const avis = {
      pieceId: parseInt(event.target.querySelector("[name=piece-id]").value), // Récupération de l'id de la pièce à partir du formulaire
      utilisateur: event.target.querySelector("[name=utilisateur]").value, // Récupération du nom de l'utilisateur à partir du formulaire
      commentaire: event.target.querySelector("[name=commentaire]").value, // Récupération du commentaire à partir du formulaire
      NbEtoiles: parseInt(event.target.querySelector("[name=etoiles]").value), // Récupération du nombre d'étoiles à partir du formulaire
    };
    // Convertir l'objet en JSON
    const chargeUtile = JSON.stringify(avis);
    // Envoi de la requête POST à l'API
    fetch("http://localhost:8081/avis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    });
  });
}
