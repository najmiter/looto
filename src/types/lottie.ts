export interface Transform {
  p: { k: number[] }; // position
  s: { k: number[] }; // scale
  r?: { k: number }; // rotation
  o?: { k: number }; // opacity
}

export interface Layer {
  ty: number; // type
  nm?: string; // name
  ip: number; // in point
  op: number; // out point
  st: number; // start time
  ks: Transform; // key frames
  ind?: number; // index
  parent?: number; // parent
}

export interface LottieAnimation {
  v: string; // version
  fr: number; // frame rate
  ip: number; // in point
  op: number; // out point
  w: number; // width
  h: number; // height
  nm?: string; // name
  ddd: number; // three dimensional
  layers: Layer[]; // layers
  assets?: any[]; // assets
  fonts?: any[]; // fonts
  chars?: any[]; // characters
  markers?: any[]; // markers
}
