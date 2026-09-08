import { describe, it, expect } from 'vitest';
import { parseCoordinate } from '../src/parser.js';
import { parseCoordinate, fillSegment } from '../src/parser.js';

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