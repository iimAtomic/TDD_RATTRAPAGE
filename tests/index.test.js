import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { run } from '../src/index.js';

const EXTRAIT = `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`;

describe('run', () => {
  it("lit un fichier et retourne les deux lectures pour l'extrait de l'énoncé", () => {
    const dir = mkdtempSync(join(tmpdir(), 'tdd-rattrapage-'));
    const inputPath = join(dir, 'input.txt');
    writeFileSync(inputPath, EXTRAIT, 'utf-8');

    expect(run(inputPath)).toEqual({ lectureA: 24, lectureB: 93 });
  });
});
