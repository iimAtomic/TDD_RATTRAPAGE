import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseInput } from './parser.js';
import { simulateOpenFloor, simulateWithFloor } from './simulation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function run(inputPath = join(__dirname, '..', 'input.txt')) {
  const content = readFileSync(inputPath, 'utf-8');
  const roches = parseInput(content);

  const lectureA = simulateOpenFloor(roches);
  const lectureB = simulateWithFloor(roches);

  console.log(`Lecture A (limite ouverte) : ${lectureA}`);
  console.log(`Lecture B (sol supposé)    : ${lectureB}`);

  return { lectureA, lectureB };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run();
}
