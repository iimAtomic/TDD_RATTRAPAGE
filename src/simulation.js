const SOURCE = [500, 0];

export function nextPosition(isOccupied, x, y) {
  const candidates = [
    [x, y + 1],
    [x - 1, y + 1],
    [x + 1, y + 1],
  ];

  for (const [cx, cy] of candidates) {
    if (!isOccupied(cx, cy)) {
      return [cx, cy];
    }
  }

  return null;
}

export function settleOne(isOccupied, source, isOutOfBounds) {
  let [x, y] = source;

  while (true) {
    if (isOutOfBounds(x, y)) {
      return null;
    }

    const next = nextPosition(isOccupied, x, y);
    if (!next) {
      return [x, y];
    }

    [x, y] = next;
  }
}

function key(x, y) {
  return `${x},${y}`;
}

function maxRockY(rocks) {
  let max = -Infinity;
  for (const point of rocks) {
    const y = Number(point.split(',')[1]);
    if (y > max) max = y;
  }
  return max;
}

export function simulateOpenFloor(rocks, source = SOURCE) {
  const occupied = new Set(rocks);
  const lowestRock = maxRockY(occupied);
  const isOccupied = (x, y) => occupied.has(key(x, y));
  const isOutOfBounds = (x, y) => y > lowestRock;

  let count = 0;
  while (true) {
    const settled = settleOne(isOccupied, source, isOutOfBounds);
    if (!settled) break;
    occupied.add(key(...settled));
    count++;
  }

  return count;
}

export function simulateWithFloor(rocks, source = SOURCE) {
  const occupied = new Set(rocks);
  const floorY = maxRockY(occupied) + 2;
  const isOccupied = (x, y) => y === floorY || occupied.has(key(x, y));
  const isOutOfBounds = () => false;

  let count = 0;
  while (!occupied.has(key(...source))) {
    const settled = settleOne(isOccupied, source, isOutOfBounds);
    occupied.add(key(...settled));
    count++;
  }

  return count;
}