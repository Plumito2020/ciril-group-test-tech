const Coord = require("./Coord");
const {
  coords_cellule_initialement_en_feu,
  nb_colonnes,
  nb_lignes,
  proba_propagation,
} = require("./config.json");

/**
 * Crée une matrice initiale en fonction des coordonnées des cellules initialement en feu.
 * @param {Coord[]} coord_cellules_en_feu - Les coordonnées des cellules initialement en feu.
 * @returns {number[][]} Une matrice représentant l'état initial des cellules, où 1 indique une cellule en feu et 0 indique une cellule éteinte et -1 si elle est en cendre.
 */
const creer_matrice_initial = (coord_cellules_en_feu) => {
  const matrice = [];
  for (let i = 0; i < nb_lignes; i++) {
    matrice[i] = [];
    for (let j = 0; j < nb_colonnes; j++) {
      const is_cellule_initialement_en_feu = Boolean(
        coord_cellules_en_feu.find(
          (cellule) => cellule.i === i && cellule.j === j
        )
      );
      if (is_cellule_initialement_en_feu) {
        matrice[i][j] = 1;
      } else {
        matrice[i][j] = 0;
      }
    }
  }
  return matrice;
};

/**
 * Crée une liste d'objets Coord représentant les cellules initialement en feu à partir des coordonnées fournies en configuration.
 * @returns {Coord[]} Une liste d'objets Coord représentant les cellules initialement en feu.
 */
const creer_liste_cellules_en_feu = () => {
  return coords_cellule_initialement_en_feu.map((cellule) => {
    if (
      cellule.i > nb_lignes - 1 ||
      cellule.i > nb_colonnes - 1 ||
      cellule.i < 0 ||
      cellule.j < 0
    ) {
      throw Error(
        "Les coordonnées de la cellule sont en dehors des limites de la matrice"
      );
    }
    return new Coord(cellule.i, cellule.j);
  });
};

/**
 * Retourne les coordonnées des cellules voisines d'une cellule donnée.
 * @param {number} i - Coordonnée x de la cellule.
 * @param {number} j - Coordonnée y de la cellule.
 * @returns {Array<Coord>} Les coordonnées des cellules voisines.
 */
const get_cellules_adjacentes = (i, j) => {
  if (j < 0 || j >= nb_colonnes || i < 0 || i >= nb_lignes) {
    throw Error("ligne ou colonne hors des dimensions spécifiées");
  } else {
    // Coins
    if (i === 0 && j === 0) {
      // en haut à gauche
      return [new Coord(i, j + 1), new Coord(i + 1, j)];
    } else if (i === 0 && j === nb_colonnes - 1) {
      // en haut à droite
      return [new Coord(i, j - 1), new Coord(i + 1, j)];
    } else if (i === nb_lignes - 1 && j === 0) {
      // en bas à gauche
      return [new Coord(i - 1, j), new Coord(i, j + 1)];
    } else if (i === nb_lignes - 1 && j === nb_colonnes - 1) {
      // en bas à droite
      return [new Coord(i, j - 1), new Coord(i - 1, j)];
    } else if (j === 0) {
      // coté gauche sauf coins
      return [new Coord(i - 1, j), new Coord(i, j + 1), new Coord(i + 1, j)];
    } else if (j === nb_colonnes - 1) {
      // coté droit sauf coins
      return [new Coord(i - 1, j), new Coord(i, j - 1), new Coord(i + 1, j)];
    } else if (i === 0) {
      // coté haut sauf coins
      return [new Coord(i, j - 1), new Coord(i + 1, j), new Coord(i, j + 1)];
    } else if (i === nb_lignes - 1) {
      // coté bas sauf coins
      return [new Coord(i - 1, j), new Coord(i, j - 1), new Coord(i, j + 1)];
    }
    // Milieux sauf côtés
    else if (
      i !== 0 &&
      i !== nb_lignes - 1 &&
      j !== 0 &&
      j !== nb_colonnes - 1
    ) {
      return [
        new Coord(i - 1, j),
        new Coord(i, j - 1),
        new Coord(i, j + 1),
        new Coord(i + 1, j),
      ];
    }
  }
};

/**
 * Décide aléatoirement si une cellule doit être allumée en fonction de la probabilité de propagation spécifiée en configuration.
 * @returns {boolean} True si la cellule doit être allumée, sinon False.
 */
const mettre_le_feu_ou_pas = () => Boolean(Math.random() <= proba_propagation);

/**
 * Allume les cellules voisines d'une cellule donnée dans une matrice en fonction d'une probabilité de propagation.
 * @param {number[][]} matrice - La matrice représentant l'état des cellules.
 * @param {Array<Coord>} coord_cellules_en_feu - Liste des coordonnées des cellule actuellement en feu.
 * @param {number} i - Coordonnée x de la cellule.
 * @param {number} j - Coordonnée y de la cellule.
 * @returns {number[][]} La matrice mise à jour avec les cellules voisines allumées.
 */
const gerer_feu_de_la_cellule_et_ses_voisines = (
  matrice,
  coord_cellules_en_feu,
  i,
  j,
  index
) => {
  const cellules_voisines = get_cellules_adjacentes(i, j);
  // La cellule devient en cendre dans tout les cas
  matrice[i][j] = -1;
  coord_cellules_en_feu.splice(index, 1);

  for (const cellule of cellules_voisines) {
    const x = cellule.i;
    const y = cellule.j;
    if (matrice[x][y] === 0 && mettre_le_feu_ou_pas()) {
      matrice[x][y] = 1;
      coord_cellules_en_feu.push(new Coord(x, y));
    }
  }
  return matrice;
};

const afficher_simulation = (matrice) => {
  for (let i = 0; i < matrice.length; i++) {
    console.log(matrice[i].join("\t"));
  }
  console.log(
    "**************************************************************************"
  );
};

const simuler_feu = async () => {
  if (proba_propagation > 1) {
    throw Error(
      "La probabilité de propagation doit être comprise entre 0 et 1"
    );
  }

  const coord_cellules_en_feu = creer_liste_cellules_en_feu();

  const matrice_initial = creer_matrice_initial(coord_cellules_en_feu);
  afficher_simulation(matrice_initial);

  while (coord_cellules_en_feu.length !== 0) {
    for (let index = 0; index < coord_cellules_en_feu.length; index++) {
      const cellule = coord_cellules_en_feu[index];

      const resultat_iteration = gerer_feu_de_la_cellule_et_ses_voisines(
        matrice_initial,
        coord_cellules_en_feu,
        cellule.i,
        cellule.j,
        index
      );
      afficher_simulation(resultat_iteration);
      // Ajoutez un délai d'attente d'une seconde avant chaque itération pour pouvoir visionner la simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("Feu éteint !");
  return;
};

// Exécuter la simulation
simuler_feu();
