import type { ColorProperty } from '@/types';

export function normalizedToHex(color: number[]): string {
  if (!Array.isArray(color) || color.length < 3) return '#000000';

  const r = Math.round((color[0] || 0) * 255);
  const g = Math.round((color[1] || 0) * 255);
  const b = Math.round((color[2] || 0) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hexToNormalized(hex: string): number[] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0, 1];

  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
    1,
  ];
}

export function extractColorsFromShape(
  shape: any,
  basePath: string = ''
): ColorProperty[] {
  const colors: ColorProperty[] = [];

  if (!shape || typeof shape !== 'object') return colors;

  if (shape.ty === 'fl' && shape.c) {
    const colorValue = shape.c.a === 0 ? shape.c.k : shape.c;
    if (Array.isArray(colorValue) && colorValue.length >= 3) {
      colors.push({
        path: `${basePath}.c.${shape.c.a === 0 ? 'k' : ''}`.replace(/^\./, ''),
        label: 'Fill Color',
        value: shape.c,
        type: 'fill',
      });
    }
  }

  if (shape.ty === 'gf' && shape.g && shape.g.k) {
    const gradientData = shape.g.a === 0 ? shape.g.k : shape.g;
    if (Array.isArray(gradientData)) {
      const colorCount = (gradientData.length - (gradientData.length % 4)) / 4;
      for (let i = 0; i < colorCount; i++) {
        const startIndex = i * 4 + 1;
        if (startIndex + 2 < gradientData.length) {
          colors.push({
            path: `${basePath}.g.${shape.g.a === 0 ? 'k' : ''}`.replace(
              /^\./,
              ''
            ),
            label: `Gradient Color ${i + 1}`,
            value: shape.g,
            type: 'gradient',
          });
        }
      }
    }
  }

  if (shape.ty === 'st' && shape.c) {
    const colorValue = shape.c.a === 0 ? shape.c.k : shape.c;
    if (Array.isArray(colorValue) && colorValue.length >= 3) {
      colors.push({
        path: `${basePath}.c.${shape.c.a === 0 ? 'k' : ''}`.replace(/^\./, ''),
        label: 'Stroke Color',
        value: shape.c,
        type: 'stroke',
      });
    }
  }

  return colors;
}

export function extractColorsFromLayer(layer: any): ColorProperty[] {
  const colors: ColorProperty[] = [];

  if (!layer.shapes || !Array.isArray(layer.shapes)) return colors;

  function processShapes(shapes: any[], basePath: string = 'shapes'): void {
    shapes.forEach((shape, index) => {
      const shapePath = `${basePath}[${index}]`;

      colors.push(...extractColorsFromShape(shape, shapePath));

      if (shape.it && Array.isArray(shape.it)) {
        processShapes(shape.it, `${shapePath}.it`);
      }
    });
  }

  processShapes(layer.shapes);
  return colors;
}

export function updateColorInLayer(
  layer: any,
  colorPath: string,
  newColor: number[]
): any {
  const pathParts = colorPath.split(/[.[\]]+/).filter(Boolean);
  const newLayer = JSON.parse(JSON.stringify(layer));

  let current = newLayer;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!isNaN(Number(part))) {
      current = current[Number(part)];
    } else {
      current = current[part];
    }
  }

  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart === 'k') {
    current.k = newColor;
  } else if (!isNaN(Number(lastPart))) {
    current[Number(lastPart)] = newColor;
  } else {
    current[lastPart] = newColor;
  }

  return newLayer;
}
