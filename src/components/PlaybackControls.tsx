interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  frame: number;
  totalFrames: number;
  onScrub: (frame: number) => void;
  speed: number;
  onCycleSpeed: () => void;
}

export default function PlaybackControls({
  isPlaying,
  onTogglePlay,
  frame,
  totalFrames,
  onScrub,
  speed,
  onCycleSpeed,
}: PlaybackControlsProps) {
  const maxFrame = Math.max(totalFrames - 1, 0);

  return (
    <div className="mt-3 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md shadow-primary-500/30 transition hover:scale-105 active:scale-95">
        {isPlaying ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5.75 3.5A1.25 1.25 0 004.5 4.75v10.5a1.25 1.25 0 002.5 0V4.75A1.25 1.25 0 005.75 3.5zM14.25 3.5A1.25 1.25 0 0013 4.75v10.5a1.25 1.25 0 002.5 0V4.75a1.25 1.25 0 00-1.25-1.25z" />
          </svg>
        ) : (
          <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.5 3.87a1 1 0 011.51-.86l9 5.13a1 1 0 010 1.72l-9 5.13a1 1 0 01-1.51-.86V3.87z" />
          </svg>
        )}
      </button>

      <input
        type="range"
        min="0"
        max={maxFrame}
        step="1"
        value={Math.min(frame, maxFrame)}
        onChange={(e) => onScrub(parseFloat(e.target.value))}
        aria-label="Animation progress"
        className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary-600 dark:bg-dark-600"
      />

      <span className="w-16 shrink-0 text-right font-mono text-xs tabular-nums text-gray-500 dark:text-dark-200">
        {frame}/{totalFrames}
      </span>

      <button
        onClick={onCycleSpeed}
        aria-label="Playback speed"
        className="shrink-0 rounded-lg border border-gray-200 px-2 py-1 font-mono text-xs font-medium text-gray-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-dark-200 dark:hover:text-primary-400">
        {speed}x
      </button>
    </div>
  );
}
