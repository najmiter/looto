export interface ColorProperty {
  // path to the animated-property wrapper object (e.g. "shapes[0].it[1].c"),
  // never to a value inside it — updates must preserve the {a, k} structure
  path: string;
  label: string;
  value: number[]; // rgb(a), normalized 0-1
  type: 'fill' | 'stroke' | 'gradient';
  stopIndex?: number; // gradient stop index within the flat stop array
}
