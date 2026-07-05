export interface AnimatedProperty {
  a?: number; // 0 = static, 1 = animated (k holds keyframe objects)
  k: unknown;
  ix?: number;
}

export interface Transform {
  p?: AnimatedProperty; // position
  s?: AnimatedProperty; // scale
  r?: AnimatedProperty; // rotation
  o?: AnimatedProperty; // opacity
  a?: AnimatedProperty; // anchor point
}

export interface Layer {
  ty: number; // type
  nm?: string; // name
  ip: number; // in point
  op: number; // out point
  st: number; // start time
  ks?: Transform; // transform
  ind?: number; // index
  parent?: number; // parent layer index (references another layer's ind)
  shapes?: unknown[];
  [key: string]: unknown;
}

export interface LottieAnimation {
  v: string; // version
  fr: number; // frame rate
  ip: number; // in point
  op: number; // out point
  w: number; // width
  h: number; // height
  nm?: string; // name
  ddd?: number; // three dimensional
  layers: Layer[];
  assets?: unknown[];
  fonts?: unknown;
  chars?: unknown[];
  markers?: unknown[];
  [key: string]: unknown;
}
