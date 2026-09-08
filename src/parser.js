export function parseCoordinate(str) {
  const [x, y] = str.split(',').map(Number);
  return [x, y];
}


export function fillSegment([x1, y1], [x2, y2]) {
  const points = [];

  if (x1 === x2) {
    // ici on a le segment vertical
    const [yStart, yEnd] = y1 <= y2 ? [y1, y2] : [y2, y1];
    for (let y = yStart; y <= yEnd; y++) {
      points.push([x1, y]);
    }
  } else if (y1 === y2) {
    // ici on a le segment horizontal
    const [xStart, xEnd] = x1 <= x2 ? [x1, x2] : [x2, x1];
    for (let x = xStart; x <= xEnd; x++) {
      points.push([x, y1]);
    }
  } else {
    throw new Error('Segment diagonal non supporté');
  }

  return points;
}

export function parseLine(line) {
  const points = line.split(' -> ').map(parseCoordinate);

  const cases = [points[0]];

  for (let i = 1; i < points.length; i++) {
    let segment = fillSegment(points[i - 1], points[i]);

    const [prevX, prevY] = points[i - 1];
    const [firstX, firstY] = segment[0];
    if (firstX !== prevX || firstY !== prevY) {
      segment = segment.reverse();
    }

    cases.push(...segment.slice(1));
  }

  return cases;
}

export function parseInput(content) {
  const lines = content.split('\n').filter((line) => line.trim() !== '');
  const roches = new Set();

  for (const line of lines) {
    const cases = parseLine(line);
    for (const [x, y] of cases) {
      roches.add(`${x},${y}`);
    }
  }

  return roches;
}
