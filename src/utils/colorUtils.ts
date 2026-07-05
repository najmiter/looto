import type { ColorProperty } from '@/types';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function normalizedToHex(color: number[]): string {
  if (!Array.isArray(color) || color.length < 3) return '#000000';

  const channel = (v: number) =>
    Math.round(clamp01(typeof v === 'number' ? v : 0) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${channel(color[0])}${channel(color[1])}${channel(color[2])}`;
}

export function hexToNormalized(hex: string): number[] {
  let value = hex.replace(/^#/, '');
  if (/^[a-f\d]{3}$/i.test(value)) {
    value = value
      .split('')
      .map((c) => c + c)
      .join('');
  }

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
  if (!result) return [0, 0, 0, 1];

  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255, 1];
}

// A color is only editable when it's a static animated-property ({a: 0/undefined})
// whose k is a plain numeric rgb(a) array. Animated colors (keyframe objects in k)
// must be left untouched or the file breaks in strict players.
function getStaticColor(prop: unknown): number[] | null {
  if (!prop || typeof prop !== 'object') return null;
  const { a, k } = prop as { a?: number; k?: unknown };
  if (a !== 1 && Array.isArray(k) && k.length >= 3 && k.every((n) => typeof n === 'number')) {
    return k as number[];
  }
  return null;
}

// Gradient data lives at g.k, which is itself an animated property wrapping a
// flat array: [pos, r, g, b] per color stop, optionally followed by [pos, a]
// alpha stops.
function getStaticGradientStops(g: unknown): number[] | null {
  if (!g || typeof g !== 'object') return null;
  const inner = (g as { k?: unknown }).k;
  return getStaticColor(inner);
}

export function extractColorsFromShape(shape: any, basePath: string = ''): ColorProperty[] {
  const colors: ColorProperty[] = [];

  if (!shape || typeof shape !== 'object') return colors;

  if ((shape.ty === 'fl' || shape.ty === 'st') && shape.c) {
    const value = getStaticColor(shape.c);
    if (value) {
      colors.push({
        path: `${basePath}.c`,
        label: shape.ty === 'fl' ? 'Fill Color' : 'Stroke Color',
        value,
        type: shape.ty === 'fl' ? 'fill' : 'stroke',
      });
    }
  }

  if ((shape.ty === 'gf' || shape.ty === 'gs') && shape.g) {
    const stops = getStaticGradientStops(shape.g);
    if (stops) {
      const stopCount = typeof shape.g.p === 'number' ? shape.g.p : Math.floor(stops.length / 4);
      for (let i = 0; i < stopCount; i++) {
        const offset = i * 4;
        if (offset + 3 >= stops.length) break;
        colors.push({
          path: `${basePath}.g.k`,
          label: `Gradient Stop ${i + 1}`,
          value: [stops[offset + 1], stops[offset + 2], stops[offset + 3]],
          type: 'gradient',
          stopIndex: i,
        });
      }
    }
  }

  return colors;
}

export function extractColorsFromLayer(layer: any): ColorProperty[] {
  const colors: ColorProperty[] = [];

  if (!layer?.shapes || !Array.isArray(layer.shapes)) return colors;

  function processShapes(shapes: any[], basePath: string): void {
    shapes.forEach((shape, index) => {
      const shapePath = `${basePath}[${index}]`;

      colors.push(...extractColorsFromShape(shape, shapePath));

      if (shape?.it && Array.isArray(shape.it)) {
        processShapes(shape.it, `${shapePath}.it`);
      }
    });
  }

  processShapes(layer.shapes, 'shapes');
  return colors;
}

export function updateColorInLayer(layer: any, colorPath: string, newColor: number[], stopIndex?: number): any {
  const pathParts = colorPath.split(/[.[\]]+/).filter(Boolean);
  const newLayer = structuredClone(layer);

  let current: any = newLayer;
  for (const part of pathParts) {
    if (current == null) return newLayer;
    current = current[/^\d+$/.test(part) ? Number(part) : part];
  }

  if (!current || typeof current !== 'object') return newLayer;

  if (typeof stopIndex === 'number') {
    // current is the {a, k} wrapper around the flat gradient stop array;
    // only touch the rgb of the targeted stop so positions and alpha stops survive
    const stops = current.k;
    const offset = stopIndex * 4;
    if (Array.isArray(stops) && offset + 3 < stops.length) {
      stops[offset + 1] = newColor[0];
      stops[offset + 2] = newColor[1];
      stops[offset + 3] = newColor[2];
    }
  } else if (Array.isArray(current.k)) {
    // keep the original arity: don't grow a 3-channel color to 4 or vice versa
    current.k = current.k.length === 3 ? newColor.slice(0, 3) : newColor.slice(0, 4);
  }

  return newLayer;
}
