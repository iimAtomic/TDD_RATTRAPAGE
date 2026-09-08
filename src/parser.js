export function parseCoordinate(str) {
  const [x, y] = str.split(',').map(Number);
  return [x, y];
}