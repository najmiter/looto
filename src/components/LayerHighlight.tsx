import type { LayerBox } from '@/utils/lottieDom';

interface LayerHighlightProps {
  box: LayerBox;
  label?: string;
}

const HANDLES = ['-left-1 -top-1', '-right-1 -top-1', '-left-1 -bottom-1', '-right-1 -bottom-1'];

export default function LayerHighlight({ box, label }: LayerHighlightProps) {
  const labelBelow = box.top < 28;

  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{ left: box.left, top: box.top, width: box.width, height: box.height }}>
      <div className="absolute inset-0 rounded-sm border-2 border-primary-500 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" />

      {HANDLES.map((position) => (
        <span
          key={position}
          className={`absolute ${position} h-2 w-2 rounded-[2px] border border-primary-500 bg-white shadow-sm`}
        />
      ))}

      {label && (
        <span
          className={`absolute left-0 max-w-full truncate whitespace-nowrap rounded-md bg-primary-600 px-1.5 py-0.5 text-[10px] font-medium text-white shadow-sm ${
            labelBelow ? 'top-full mt-1.5' : '-top-6'
          }`}>
          {label}
        </span>
      )}
    </div>
  );
}
