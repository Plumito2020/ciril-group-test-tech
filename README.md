Pour exécuter la simulation, exécutez simplement la commande ```node main.js```.

Le programme est composé de trois fichiers :
- Un fichier config.json permet de paramétrer le programme.
- Un fichier Coord.js qui définit une classe utilitaire pour manipuler les coordonnées d'une cellule de manière plus efficace que d'utiliser des objets.
- main.js contient le cœur du programme.

Il existe trois états de cellules :
```
0 : la cellule n'est pas en feu
1 : la cellule est en feu
-1 : la cellule est en cendre
```

Voici un exemple de simulation avec la configuration suivante : 
```
{
  "nb_lignes": 10,
  "nb_colonnes": 10,
  "proba_propagation": 0.05,
  "coords_cellule_initialement_en_feu": [
    { "i": 3, "j": 9 },
    { "i": 2, "j": 7 }
  ]
}
```
![image](https://github.com/Plumito2020/ciril-group-test-tech/assets/63741613/330c81b8-b5c4-4ecc-ae4e-46ce59afe6f2)
