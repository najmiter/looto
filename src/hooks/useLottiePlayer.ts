import { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

export const PLAYBACK_SPEEDS = [0.5, 1, 1.5, 2];

// owns the lottie-web instance: debounced (re)loading when the data changes,
// play/pause, speed, and frame tracking
export function useLottiePlayer(containerRef: React.RefObject<HTMLDivElement | null>, lottieData: object | null) {
  const animationRef = useRef<AnimationItem | null>(null);
  const isPlayingRef = useRef(true);
  const speedRef = useRef(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [frame, setFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  // bumped after every rebuild so DOM-dependent effects (layer tagging,
  // selection highlight) know to re-run against the fresh SVG tree
  const [reloadTick, setReloadTick] = useState(0);

  isPlayingRef.current = isPlaying;
  speedRef.current = speed;

  useEffect(() => {
    if (!containerRef.current || !lottieData) return;

    // debounce so dragging a color picker or typing doesn't rebuild the
    // whole animation on every keystroke
    const handle = setTimeout(() => {
      if (!containerRef.current) return;

      animationRef.current?.destroy();
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: isPlayingRef.current,
        // clone so lottie-web's internal mutations never leak back into the
        // data that gets saved to disk
        animationData: structuredClone(lottieData),
      });

      animation.setSpeed(speedRef.current);
      setTotalFrames(Math.round(animation.totalFrames));
      animation.addEventListener('enterFrame', () => {
        setFrame(Math.round(animation.currentFrame));
      });

      animationRef.current = animation;
      setReloadTick((tick) => tick + 1);
    }, 250);

    return () => {
      clearTimeout(handle);
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, [containerRef, lottieData]);

  const togglePlay = () => {
    const animation = animationRef.current;
    if (!animation) return;
    if (isPlaying) {
      animation.pause();
    } else {
      animation.play();
    }
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = () => {
    const next = PLAYBACK_SPEEDS[(PLAYBACK_SPEEDS.indexOf(speed) + 1) % PLAYBACK_SPEEDS.length];
    setSpeed(next);
    animationRef.current?.setSpeed(next);
  };

  const scrub = (value: number) => {
    const animation = animationRef.current;
    if (!animation || !Number.isFinite(value)) return;
    animation.goToAndStop(value, true);
    setFrame(value);
    setIsPlaying(false);
  };

  return { animationRef, isPlaying, togglePlay, speed, cycleSpeed, frame, totalFrames, scrub, reloadTick };
}
