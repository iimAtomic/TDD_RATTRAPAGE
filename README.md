# Rattrapage TDD — Registre de sédiments

Simulation d'un dépôt de sédiments tombant depuis une source `(500,0)` dans une
coupe verticale décrite par `input.txt`, avec deux lectures indépendantes du
même relevé (limite ouverte / sol supposé).

## Installation

```bash
npm install
```

## Lancer le programme

Lit `input.txt` à la racine du projet et affiche les deux indicateurs :

```bash
npm start
```

## Lancer les tests

```bash
npm test
```

> Sur certaines machines Windows, un test qui boucle sans jamais se terminer
> ne produit aucune sortie avant expiration : on recommande de lancer
> `npx vitest run` sous un `timeout` shell pendant le développement.

## Organisation du code

- `src/parser.js` — décodage d'une coordonnée (`parseCoordinate`), remplissage
  d'un segment horizontal ou vertical entre deux points (`fillSegment`),
  assemblage d'une ligne multi-segments dans l'ordre réel des points
  (`parseLine`), et construction du `Set` de roches à partir du fichier
  complet (`parseInput`).
- `src/simulation.js` — la mécanique de chute d'un dépôt :
  - `nextPosition(isOccupied, x, y)` teste les trois destinations dans l'ordre
    imposé (bas, bas-gauche, bas-droite) et retourne la première libre, ou
    `null` si les trois sont occupées ;
  - `settleOne(isOccupied, source, isOutOfBounds)` fait tomber un seul dépôt
    jusqu'à son immobilisation, ou retourne `null` s'il sort de la zone
    connue ;
  - `simulateOpenFloor(rocks)` — **Lecture A** : fait apparaître les dépôts un
    par un jusqu'à ce que l'un d'eux dépasse la ligne de la roche la plus
    basse, et retourne le nombre de dépôts déjà immobilisés à cet instant ;
  - `simulateWithFloor(rocks)` — **Lecture B** : ajoute un sol infini à
    `y = y_max_roche + 2` et fait apparaître les dépôts jusqu'à ce que la
    source `(500,0)` elle-même soit occupée, en comptant ce dernier dépôt.
- `src/index.js` — lit `input.txt`, calcule les deux lectures et les affiche.

## Choix de parsing

- Les points d'une ligne sont séparés par `' -> '` et chaque coordonnée est
  `x,y` (entiers, `x` vers la droite, `y` vers le bas).
- Un segment entre deux points consécutifs est forcément horizontal ou
  vertical ; un segment diagonal fait lever une erreur explicite
  (`fillSegment` — voir le test « rejette un segment diagonal »).
- Les tracés sont accumulés dans un `Set` de chaînes `"x,y"` : une recherche
  d'occupation est en O(1) et une roche ou un dépôt immobilisé sont
  interchangeables pour la simulation (aucune distinction n'est nécessaire
  entre les deux une fois le `Set` construit).
- `parseInput` ignore les lignes vides éventuelles en fin de fichier.

## Format de sortie

Le programme affiche deux lignes sur la sortie standard :

```
Lecture A (limite ouverte) : <nombre>
Lecture B (sol supposé)    : <nombre>
```

## Suite de tests

- `tests/parser.test.js` — décodage des coordonnées, remplissage de segments
  horizontaux/verticaux (dans les deux sens), rejet des diagonales, lignes
  multi-segments, et construction du `Set` de roches.
- `tests/simulation.test.js` — les trois directions dans leur ordre de
  priorité strict, le cas où les trois sont bloquées, et l'immobilisation
  d'un dépôt (`settleOne`), y compris la sortie de la zone connue.
- `tests/reading.test.js` — les deux lectures rejouées sur l'extrait fourni
  par l'énoncé (`24` puis `93`), plus des cas limites (roche confondue avec
  la source, sol qui bloque immédiatement la source).
- `tests/index.test.js` — test d'intégration bout en bout : lecture d'un
  fichier temporaire et vérification des deux résultats.
