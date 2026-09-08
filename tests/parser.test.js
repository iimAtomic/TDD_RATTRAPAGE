import { describe, it, expect } from 'vitest';
import { parseCoordinate } from '../src/parser.js';

describe('parser', () => {
  it('transforme une coordonnée', () => {
    expect(parseCoordinate('498,4')).toEqual([498, 4]);
  });
});