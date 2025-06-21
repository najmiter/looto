export interface LottieAnimation {
  v: string; // Lottie version
  fr: number; // Frame rate
  ip: number; // In point
  op: number; // Out point
  w: number; // Width
  h: number; // Height
  nm: string; // Name
  ddd: number; // 3D flag
  assets: LottieAsset[]; // Array of assets
  layers: LottieLayer[]; // Array of layers
}

export interface LottieAsset {
  id: string; // Asset ID
  w: number; // Asset width
  h: number; // Asset height
  p: string; // Asset path
  e: number; // Asset type (e.g., image, solid)
}

export interface LottieLayer {
  ddd: number; // 3D flag
  ind: number; // Layer index
  ty: number; // Layer type
  nm: string; // Layer name
  sr: number; // Stretch
  ks: LottieKeyframes; // Keyframes
  ao: number; // Auto-orient flag
  ip: number; // In point
  op: number; // Out point
  st: number; // Start time
}

export interface LottieKeyframes {
  p: LottiePosition; // Position keyframes
  a: LottieAnchor; // Anchor keyframes
  s: LottieScale; // Scale keyframes
}

export interface LottiePosition {
  k: number[]; // Keyframe values
  ix: number; // Index
}

export interface LottieAnchor {
  k: number[]; // Keyframe values
  ix: number; // Index
}

export interface LottieScale {
  k: number[]; // Keyframe values
  ix: number; // Index
}
