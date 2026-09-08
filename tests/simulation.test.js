import { describe, it, expect } from 'vitest';
import { nextPosition, settleOne } from '../src/simulation.js';

describe('simulation', () => {
  it('descend verticalement si la case du bas est libre', () => {
    const isOccupied = () => false;
    expect(nextPosition(isOccupied, 500, 0)).toEqual([500, 1]);
  });

  it('va à gauche si le bas est bloqué', () => {
    const isOccupied = (x, y) => x === 500 && y === 1; // seul (500,1) est occupé
    expect(nextPosition(isOccupied, 500, 0)).toEqual([499, 1]);
  });

  it('va à droite si bas et gauche sont bloqués', () => {
    const isOccupied = (x, y) =>
      (x === 500 && y === 1) || (x === 499 && y === 1);
    expect(nextPosition(isOccupied, 500, 0)).toEqual([501, 1]);
  });

  it("respecte l'ordre de priorité bas > gauche > droite quand tout est libre", () => {
    const isOccupied = () => false;
    expect(nextPosition(isOccupied, 500, 0)).toEqual([500, 1]);
  });

  it('choisit toujours le bas en priorité même si gauche et droite sont aussi libres', () => {
    const calls = [];
    const isOccupied = (x, y) => {
      calls.push([x, y]);
      return false;
    };
    nextPosition(isOccupied, 500, 0);
    expect(calls[0]).toEqual([500, 1]);
  });

  it('retourne null quand les trois destinations sont occupées', () => {
    const isOccupied = () => true;
    expect(nextPosition(isOccupied, 500, 0)).toBeNull();
  });
});

describe('settleOne', () => {
  it("immobilise un dépôt à sa position de départ si tout autour est occupé", () => {
    const isOccupied = (x, y) => !(x === 500 && y === 0);
    const isOutOfBounds = () => false;
    expect(settleOne(isOccupied, [500, 0], isOutOfBounds)).toEqual([500, 0]);
  });

  it('fait chuter un dépôt jusqu\'à la première case libre au-dessus de la roche', () => {
    // une corniche pleine en y=3 : les trois destinations y sont bloquées
    const occupied = new Set(['499,3', '500,3', '501,3']);
    const isOccupied = (x, y) => occupied.has(`${x},${y}`);
    const isOutOfBounds = () => false;
    expect(settleOne(isOccupied, [500, 0], isOutOfBounds)).toEqual([500, 2]);
  });

  it('retourne null si le dépôt sort de la zone connue', () => {
    const isOccupied = () => false;
    const isOutOfBounds = (x, y) => y > 5;
    expect(settleOne(isOccupied, [500, 0], isOutOfBounds)).toBeNull();
  });
});

describe('enchaînement : immobilisation puis apparition du suivant', () => {
  it('le second dépôt part bien de la source et est dévié par le premier, déjà immobilisé', () => {
    // corniche large en y=3 sous la source : le premier dépôt s'immobilise en (500,2)
    const rocks = new Set(['497,3', '498,3', '499,3', '500,3', '501,3', '502,3', '503,3']);
    const isOutOfBounds = () => false;

    const occupied = new Set(rocks);
    const isOccupied = (x, y) => occupied.has(`${x},${y}`);

    const premier = settleOne(isOccupied, [500, 0], isOutOfBounds);
    expect(premier).toEqual([500, 2]);

    // le premier dépôt devient une obstruction avant que le suivant n'apparaisse
    occupied.add(`${premier[0]},${premier[1]}`);

    // le second dépôt réapparaît à la source (500,0), pas là où le premier s'est arrêté
    const second = settleOne(isOccupied, [500, 0], isOutOfBounds);
    expect(second).toEqual([499, 2]);
    expect(second).not.toEqual(premier);
  });
});