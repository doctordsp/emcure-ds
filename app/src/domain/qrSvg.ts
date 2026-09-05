import QRCode from "qrcode";
import { escapeHtml } from "./html";

export function qrModules(url: string): boolean[][] {
  const qr = QRCode.create(url, { errorCorrectionLevel: "M" });
  const size = qr.modules.size;
  const rows: boolean[][] = [];
  for (let row = 0; row < size; row += 1) {
    const cells: boolean[] = [];
    for (let col = 0; col < size; col += 1) {
      cells.push(Boolean(qr.modules.get(row, col)));
    }
    rows.push(cells);
  }
  return rows;
}

/** Square SVG QR code for a share URL. Safe to inline in pause-proof HTML. */
export function qrSvg(url: string, size = 112): string {
  const modules = qrModules(url);
  const count = modules.length;
  const cells: string[] = [];
  modules.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (dark) cells.push(`<rect x="${x}" y="${y}" width="1" height="1" />`);
    });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${count} ${count}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="${escapeHtml(`QR code for ${url}`)}">${cells.join("")}</svg>`;
}
