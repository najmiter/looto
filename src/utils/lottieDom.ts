import type { AnimationItem } from 'lottie-web';

export interface LayerBox {
  left: number;
  top: number;
  width: number;
  height: number;
}

// lottie-web's SVG renderer keeps one element per layer in renderer.elements,
// in the same order as the layers array in the JSON. The renderer isn't part
// of the public typings, hence the casts.
function getLayerElements(animation: AnimationItem): (SVGGElement | null)[] {
  const renderer = (animation as unknown as { renderer?: { elements?: unknown[] } }).renderer;
  if (!renderer?.elements) return [];

  return renderer.elements.map((el) => {
    const element = el as { layerElement?: SVGGElement; baseElement?: SVGGElement } | null;
    return element?.layerElement ?? element?.baseElement ?? null;
  });
}

// stamp each layer's <g> with its index so clicks can be mapped back to the
// layers array; lottie-web builds elements lazily (a layer whose in-point
// hasn't been reached has no DOM node yet), so call this repeatedly as
// frames advance
export function tagLayerElements(animation: AnimationItem): void {
  getLayerElements(animation).forEach((g, index) => {
    if (g && !g.hasAttribute('data-layer-index')) {
      g.setAttribute('data-layer-index', String(index));
    }
  });
}

export function layerIndexFromEvent(event: MouseEvent): number | null {
  const target = event.target as Element | null;
  const g = target?.closest?.('[data-layer-index]');
  if (!g) return null;

  const index = Number(g.getAttribute('data-layer-index'));

  return Number.isInteger(index) ? index : null;
}

// screen-space bounding box of a layer, relative to the preview container —
// getBoundingClientRect accounts for every transform lottie applies, so the
// box tracks the layer as it animates
export function getLayerBox(animation: AnimationItem, index: number, container: HTMLElement): LayerBox | null {
  const g = getLayerElements(animation)[index];
  if (!g) return null;

  const rect = g.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;

  const containerRect = container.getBoundingClientRect();

  return {
    left: rect.left - containerRect.left,
    top: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height,
  };
}
