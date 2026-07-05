import { useCallback, useEffect, useState } from 'react';
import type { AnimationItem } from 'lottie-web';
import { getLayerBox, layerIndexFromEvent, tagLayerElements, type LayerBox } from '@/utils/lottieDom';

interface UseLayerSelectionOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  animationRef: React.RefObject<AnimationItem | null>;
  selectedLayer: number | null;
  onSelectLayer?: (index: number | null) => void;
  frame: number;
  reloadTick: number;
}

export function useLayerSelection({
  containerRef,
  animationRef,
  selectedLayer,
  onSelectLayer,
  frame,
  reloadTick,
}: UseLayerSelectionOptions): LayerBox | null {
  const [box, setBox] = useState<LayerBox | null>(null);

  // re-tag on every frame: lottie-web creates layer elements lazily, so a
  // layer that starts later in the timeline only gets its <g> mid-playback
  useEffect(() => {
    if (animationRef.current) tagLayerElements(animationRef.current);
  }, [animationRef, frame, reloadTick]);

  // click-to-select; clicking empty canvas clears the selection
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !onSelectLayer) return;

    const handleClick = (event: MouseEvent) => onSelectLayer(layerIndexFromEvent(event));
    container.addEventListener('click', handleClick);

    return () => container.removeEventListener('click', handleClick);
  }, [containerRef, onSelectLayer]);

  const updateBox = useCallback(() => {
    const container = containerRef.current;
    const animation = animationRef.current;
    if (!container || !animation || selectedLayer === null) {
      setBox(null);
      return;
    }
    setBox(getLayerBox(animation, selectedLayer, container));
  }, [containerRef, animationRef, selectedLayer]);

  // follow the layer as it animates (enterFrame bumps `frame`) and across
  // rebuilds of the SVG tree
  useEffect(() => {
    updateBox();
  }, [updateBox, frame, reloadTick]);

  // stay glued when the panel resizes while paused
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(updateBox);
    observer.observe(container);

    return () => observer.disconnect();
  }, [containerRef, updateBox]);

  return box;
}
