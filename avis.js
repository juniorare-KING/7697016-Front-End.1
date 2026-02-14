/* global Chart */

// Fonction pour ajouter des écouteurs d'événements aux boutons d'avis
export function ajoutListenersAvis() {
  // Sélectionne tous les boutons d'avis dans les articles
  const piecesElements = document.querySelectorAll(".fiches article button");
  if (!piecesElements) return;

  // Parcourt chaque bouton et ajoute un écouteur d'événement
  for (let i = 0; i < piecesElements.length; i++) {
    piecesElements[i].addEventListener("click", async function (event) {
      // Récupère l'ID de l'élément à partir de l'attribut de données
      const id = event.target.dataset.id;
      try {
        // Effectue une requête fetch pour obtenir les avis de la pièce correspondante
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        if (!reponse.ok) {
          console.error(`Erreur serveur : ${reponse.status}`);
          return;
        }

        // Traduit les données JSON en objet JavaScript
        const avis = await reponse.json();
        console.log(avis);
        // sauvegarde de l'avis dans le localStorage
        localStorage.setItem(`avis-piece-${id}`, JSON.stringify(avis));

        // Affiche les avis pour la pièce correspondante dans un paragraphe
        // Récupère l'élément parent (article) du bouton cliqué
        const pieceElement = event.target.parentElement;
        // Enlève un ancien bloc d'avis éventuel pour éviter les doublons
        const ancienBloc = pieceElement.querySelector("p.avis");
        if (ancienBloc) {
          ancienBloc.remove();
        }
        // Appelle la fonction pour afficher les avis de la pièce
        afficherAvis(pieceElement, avis);
      } catch (err) {
        console.error("Impossible de récupérer les avis :", err);
      }
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
  if (!formulaireAvis) return;
  formulaireAvis.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    // Création de l'objet du nouvel avis
    const avis = {
      pieceId: parseInt(
        event.target.querySelector("[name=piece-id]").value,
        10,
      ), // Récupération de l'id de la pièce à partir du formulaire
      utilisateur: event.target.querySelector("[name=utilisateur]").value || "", // Récupération du nom de l'utilisateur à partir du formulaire
      commentaire: event.target.querySelector("[name=commentaire]").value || "", // Récupération du commentaire à partir du formulaire
      nbEtoiles:
        parseInt(event.target.querySelector("[name=etoiles]").value, 10) || 0, // Récupération du nombre d'étoiles à partir du formulaire (nommage cohérent)
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

// Fonction pour afficher le graphique des avis
export async function afficherGraphiqueAvis() {
  // Calcul du nombre total de commentaires par quantité d'étoiles attribuées
  const avis = await fetch("http://localhost:8081/avis").then((r) => r.json());

  const nb_commentaires = [0, 0, 0, 0, 0];
  for (let commentaire of avis) {
    // on s'assure qu'on a bien un nombre valide
    const etoiles = commentaire.nbEtoiles || commentaire.nb_etoiles || 0;
    if (etoiles >= 1 && etoiles <= 5) {
      nb_commentaires[etoiles - 1]++;
    }
  }

  // Légende qui s'affichera sur la gauche à côté de la barre horizontale
  const labels = ["5", "4", "3", "2", "1"];
  // Données et personnalisation du graphique
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Étoiles attribuées",
        data: nb_commentaires.reverse(),
        backgroundColor: "rgba(241, 150, 14, 0.94)", // couleur jaune
      },
    ],
  };
  // Objet de configuration final
  const config = {
    type: "bar",
    data: data,
    options: {
      indexAxis: "y",
    },
  };
  // Rendu du graphique dans l'élément canvas
  new Chart(document.querySelector("#graphique-avis"), config);
}

// Fonction pour afficher un graphique comparant le nombre de commentaires
// pour pièces disponibles et pièces non disponibles
export async function afficherGraphiqueDisponibilite() {
  // Récupère toutes les pièces et tous les avis simultanément
  const [pieces, avis] = await Promise.all([
    fetch("http://localhost:8081/pieces").then((r) => r.json()),
    fetch("http://localhost:8081/avis").then((r) => r.json()),
  ]);

  // Map des disponibilités par identifiant
  const dispoMap = new Map(pieces.map((p) => [p.id, !!p.disponibilite]));

  let nbDisponibles = 0;
  let nbNonDisponibles = 0;
  for (const a of avis) {
    if (dispoMap.get(a.pieceId)) {
      nbDisponibles++;
    } else {
      nbNonDisponibles++;
    }
  }

  const data = {
    labels: ["Disponibles", "Non disponibles"],
    datasets: [
      {
        label: "Commentaires",
        data: [nbDisponibles, nbNonDisponibles],
        backgroundColor: ["rgba(24, 231, 24, 0.5)", "rgba(240, 71, 107, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgb(235, 14, 62)"],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "bar",
    data,
    options: {
      scales: {
        y: { beginAtZero: true },
      },
    },
  };

  new Chart(document.querySelector("#graphique-disponibilite"), config);
}
