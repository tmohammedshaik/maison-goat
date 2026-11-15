// Rosaces marocaines : méthode de Hankin sur le pavage 4.6.12 (dodécagones, hexagones, carrés).
import fs from "fs";
const th = (+process.argv[2] || 60) * Math.PI / 180, ep = +process.argv[3] || 0.16;
const e = 1, r12 = e * (2 + Math.sqrt(3)) / 2, D = e * (3 + Math.sqrt(3));
const W = D, H = D * Math.sqrt(3);
const reg = (cx, cy, n, R, a0) => Array.from({ length: n }, (_, k) => [cx + R * Math.cos(a0 + 2 * Math.PI * k / n), cy + R * Math.sin(a0 + 2 * Math.PI * k / n)]);
const R12 = e / (2 * Math.sin(Math.PI / 12)), polys = [];
for (let i = -2; i <= 3; i++) for (let j = -2; j <= 3; j++) {
  const x = i * D + j * D / 2, y = j * D * Math.sqrt(3) / 2;
  polys.push(reg(x, y, 12, R12, Math.PI / 12));
  for (const a of [0, Math.PI / 3, 2 * Math.PI / 3]) polys.push(reg(x + Math.cos(a) * D / 2, y + Math.sin(a) * D / 2, 4, e / Math.SQRT2, a + Math.PI / 4));
  for (const s of [1, -1]) polys.push(reg(x + D / 2, y + s * D / (2 * Math.sqrt(3)), 6, e, 0));
}
const inter = (p, d, q, f) => { const den = d[0] * f[1] - d[1] * f[0]; const t = ((q[0] - p[0]) * f[1] - (q[1] - p[1]) * f[0]) / den; return [p[0] + d[0] * t, p[1] + d[1] * t]; };
const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
let d = ""; const f = n => n.toFixed(4);
for (let P of polys) {
  const aire = P.reduce((s, p, k) => { const q = P[(k + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0); if (aire < 0) P = P.slice().reverse();
  const n = P.length, M = [], Dd = [];
  for (let k = 0; k < n; k++) { const a = P[k], b = P[(k + 1) % n]; M.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]); const l = Math.hypot(b[0] - a[0], b[1] - a[1]); Dd.push([(b[0] - a[0]) / l, (b[1] - a[1]) / l]); }
  let s = "";
  for (let k = 0; k < n; k++) { const k2 = (k + 1) % n, X = inter(M[k], rot(Dd[k], th), M[k2], rot([-Dd[k2][0], -Dd[k2][1]], -th));
    s += `M${f(M[k][0])} ${f(M[k][1])}L${f(X[0])} ${f(X[1])}L${f(M[k2][0])} ${f(M[k2][1])}`; }
  d += s;
}
const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${f(W)} ${f(H)}' width='${Math.round(W * 100)}' height='${Math.round(H * 100)}'><path d='${d}' fill='none' stroke='#000' stroke-width='${ep}' stroke-linejoin='miter' stroke-miterlimit='8' stroke-linecap='square'/></svg>`;
fs.writeFileSync(process.argv[4] || "motif2.svg", svg); console.log(f(W), f(H), svg.length);
