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