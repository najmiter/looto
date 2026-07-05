import { useRef } from 'react';
import { useLottiePlayer } from '@/hooks/useLottiePlayer';
import { useLayerSelection } from '@/hooks/useLayerSelection';
import PlaybackControls from './PlaybackControls';
import LayerHighlight from './LayerHighlight';
import PreviewLoader from './PreviewLoader';

interface PreviewProps {
  lottieData: object | null;
  selectedLayer?: number | null;
  onSelectLayer?: (index: number | null) => void;
  selectedLayerName?: string;
}

export default function Preview({ lottieData, selectedLayer = null, onSelectLayer, selectedLayerName }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const player = useLottiePlayer(containerRef, lottieData);
  const selectionBox = useLayerSelection({
    containerRef,
    animationRef: player.animationRef,
    selectedLayer,
    onSelectLayer,
    frame: player.frame,
    reloadTick: player.reloadTick,
  });

  if (!lottieData) return null;

  return (
    <div className="flex h-full w-full flex-col">
      <div className="checkerboard relative min-h-0 flex-1 overflow-hidden rounded-xl border border-gray-200 dark:border-dark-600">
        <div ref={containerRef} className="lottie-canvas h-full w-full" />
        {selectionBox && <LayerHighlight box={selectionBox} label={selectedLayerName} />}
        {player.isLoading && <PreviewLoader variant={player.reloadTick === 0 ? 'initial' : 'refresh'} />}
      </div>

      <PlaybackControls
        isPlaying={player.isPlaying}
        onTogglePlay={player.togglePlay}
        frame={player.frame}
        totalFrames={player.totalFrames}
        onScrub={player.scrub}
        speed={player.speed}
        onCycleSpeed={player.cycleSpeed}
      />
    </div>
  );
}
