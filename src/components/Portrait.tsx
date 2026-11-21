export interface PortraitProps {
  src: string;
  alt: string;
}

/** Quadratisches Bild mit weichem Radius, Rahmen und der Systemlichtquelle. */
export function Portrait({ src, alt }: PortraitProps) {
  return <img className="portrait" src={src} alt={alt} />;
}
