import { qrModules } from "../domain/qrSvg";

export function ShareQr({ url, size = 112 }: { url: string; size?: number }) {
  if (!url) return null;
  const modules = qrModules(url);
  const count = modules.length;
  return (
    <figure className="share-qr">
      <svg
        className="share-qr-code"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${count} ${count}`}
        width={size}
        height={size}
        shapeRendering="crispEdges"
        role="img"
        aria-label={`QR code for ${url}`}
      >
        {modules.flatMap((row, y) =>
          row.flatMap((dark, x) =>
            dark ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : [],
          ),
        )}
      </svg>
      <figcaption>
        <a href={url}>{url}</a>
      </figcaption>
    </figure>
  );
}
