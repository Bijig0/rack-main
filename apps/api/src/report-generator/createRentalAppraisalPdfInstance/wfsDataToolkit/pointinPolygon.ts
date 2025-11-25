/**
 * Check if a point is inside a polygon (simple ray casting algorithm)
 */
export function pointInPolygon(
  point: [number, number],
  polygon: number[][][]
): boolean {
  const [x, y] = point;
  let inside = false;

  for (const ring of polygon) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const xi = ring[i][0],
        yi = ring[i][1];
      const xj = ring[j][0],
        yj = ring[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
  }

  return inside;
}
