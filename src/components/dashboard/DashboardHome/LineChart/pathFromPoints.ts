export function pathFromPoints(points: number[], width = 980, height = 250, max = 12000) {
  if (points.length === 0) return "";
  if (points.length === 1) {
    const y = height - (points[0] / max) * height;
    return `M 0 ${y.toFixed(1)}`;
  }

  const getX = (i: number) => (i / (points.length - 1)) * width;
  const getY = (p: number) => height - (p / max) * height;

  const pts = points.map((p, i) => ({ x: getX(i), y: getY(p) }));

  let path = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;

  const tension = 0.2;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i === 0 ? pts[0] : pts[i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i === pts.length - 2 ? pts[pts.length - 1] : pts[i + 2];

    let cp1x = p1.x + (p2.x - p0.x) * tension;
    let cp1y = p1.y + (p2.y - p0.y) * tension;

    let cp2x = p2.x - (p3.x - p1.x) * tension;
    let cp2y = p2.y - (p3.y - p1.y) * tension;

    // Prevent curve from dipping below 0 (y > height in SVG coordinates)
    if (cp1y > height) cp1y = height;
    if (cp2y > height) cp2y = height;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return path;
}
