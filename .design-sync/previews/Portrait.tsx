import { Portrait } from '@suite/design-system';

// Platzhalter statt eines echten Fotos: encodeURIComponent bekommt die Farben
// mit '#', nicht vorkodiert als '%23' - sonst wird doppelt kodiert und das SVG
// faellt auf Schwarz zurueck.
const platzhalter =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
      '<rect width="200" height="200" fill="#eef2ff"/>' +
      '<circle cx="100" cy="78" r="34" fill="#4f46e5"/>' +
      '<path d="M40 200c0-33 27-60 60-60s60 27 60 60z" fill="#4f46e5"/>' +
    '</svg>'
  );

export function MitBild() {
  return <Portrait src={platzhalter} alt="Portraitfoto" />;
}
