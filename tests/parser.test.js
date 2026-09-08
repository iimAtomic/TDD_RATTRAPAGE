import { describe, it, expect } from 'vitest';
import { parseCoordinate, fillSegment, parseLine, parseInput } from '../src/parser.js';

describe('parser', () => {
  it('transforme un coordonnée', () => {
    expect(parseCoordinate('498,4')).toEqual([498, 4]);
  });
});

it('remplit un segment vertical', () => {
  expect(fillSegment([498, 4], [498, 6])).toEqual([
    [498, 4],
    [498, 5],
    [498, 6],
  ]);
});

it('remplit un segment horizontal', () => {
  expect(fillSegment([498, 6], [496, 6])).toEqual([
    [496, 6],
    [497, 6],
    [498, 6],
  ]);
});

it('accepte un segment dans le sens inverse', () => {
  expect(fillSegment([498, 6], [498, 4])).toEqual([
    [498, 4],
    [498, 5],
    [498, 6],
  ]);
});

it('rejette un segment diagonal', () => {
  expect(() => fillSegment([498, 4], [500, 6])).toThrow();
});

it('traite plusieurs segments', () => {
  expect(parseLine('498,4 -> 498,6 -> 496,6')).toEqual([
    [498, 4],
    [498, 5],
    [498, 6],
    [497, 6],
    [496, 6],
  ]);
});

it('construit le Set de roches depuis le fichier', () => {
  const input = '498,4 -> 498,6 -> 496,6\n503,4 -> 502,4 -> 502,9 -> 494,9';
  const roches = parseInput(input);

  expect(roches.has('498,4')).toBe(true);
  expect(roches.has('496,6')).toBe(true);
  expect(roches.has('502,9')).toBe(true);
  expect(roches.has('0,0')).toBe(false);
});
