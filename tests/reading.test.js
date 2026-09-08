import { describe, it, expect } from 'vitest';
import { parseInput } from '../src/parser.js';
import { simulateOpenFloor, simulateWithFloor } from '../src/simulation.js';

const EXTRAIT = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

describe('Lecture A - limite ouverte', () => {
  it('compte 24 dépôts immobilisés avant que les suivants ne quittent la zone connue', () => {
    const roches = parseInput(EXTRAIT);
    expect(simulateOpenFloor(roches)).toBe(24);
  });

  it('ne compte aucun dépôt si la source est immédiatement au-delà de la roche connue', () => {
    const roches = parseInput('500,0 -> 500,0');
    // D'apres le doc de l'exo toute la roche est sur la source elle-même : rien ne peut se poser en dessous
    expect(simulateOpenFloor(roches)).toBe(0);
  });
});

describe('Lecture B - sol supposé', () => {
  it('compte 93 dépôts immobilisés, y compris le dernier qui bloque la source', () => {
    const roches = parseInput(EXTRAIT);
    expect(simulateWithFloor(roches)).toBe(93);
  });

  it("s'arrête dès que la source (500,0) est elle-même occupée", () => {
    const roches = parseInput('500,2 -> 500,2');
    const total = simulateWithFloor(roches);
    expect(total).toBeGreaterThan(0);
  });
});
