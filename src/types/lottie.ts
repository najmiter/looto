// Lottie Animation types
export interface Transform {
  p: { k: number[] };
  s: { k: number[] };
  r?: { k: number };
  o?: { k: number };
}

export interface Layer {
  ty: number;
  nm?: string;
  ip: number;
  op: number;
  st: number;
  ks: Transform;
  ind?: number;
  parent?: number;
}

export interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm?: string;
  ddd: number;
  layers: Layer[];
  assets?: any[];
  fonts?: any[];
  chars?: any[];
  markers?: any[];
}
