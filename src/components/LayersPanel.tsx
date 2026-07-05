import React, { useEffect, useRef } from 'react';
import type { LottieAnimation } from '@/types/lottie';
import type { ColorProperty } from '@/types';
import { normalizedToHex } from '@/utils/colorUtils';

interface LayersPanelProps {
  animation: LottieAnimation;
  layerColors: { [key: number]: ColorProperty[] };
  selectedLayer: number | null;
  onSelect: (index: number | null) => void;
  onDelete: (index: number) => void;
}

const LAYER_TYPES: { [key: number]: { name: string; icon: string } } = {
  0: { name: 'Precomp', icon: '◫' },
  1: { name: 'Solid', icon: '■' },
  2: { name: 'Image', icon: '🖼' },
  3: { name: 'Null', icon: '◌' },
  4: { name: 'Shape', icon: '◆' },
  5: { name: 'Text', icon: 'T' },
};

const LayersPanel: React.FC<LayersPanelProps> = ({ animation, layerColors, selectedLayer, onSelect, onDelete }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedLayer === null) return;

    listRef.current
      ?.querySelector(`[data-layer-row="${selectedLayer}"]`)
      ?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedLayer]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-dark-600">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Layers</h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-dark-700 dark:text-dark-200">
          {animation.layers.length}
        </span>
      </div>

      <div ref={listRef} className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2.5">
        {animation.layers.map((layer, index) => {
          const type = LAYER_TYPES[layer.ty] || {
            name: `Type ${layer.ty}`,
            icon: '?',
          };
          const colors = layerColors[index] || [];
          const isSelected = selectedLayer === index;

          return (
            <div
              key={index}
              data-layer-row={index}
              onClick={() => onSelect(isSelected ? null : index)}
              className={`group flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 shadow-sm dark:border-primary-500/60 dark:bg-primary-500/10'
                  : 'border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-dark-500 dark:hover:bg-dark-700/60'
              }`}>
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs ${
                  isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-500 dark:bg-dark-700 dark:text-dark-200'
                }`}
                title={type.name}>
                {type.icon}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                  {layer.nm || `Layer ${index + 1}`}
                </p>
                <p className="text-[11px] text-gray-400 dark:text-dark-300">{type.name}</p>
              </div>

              {colors.length > 0 && (
                <span className="flex shrink-0 -space-x-1.5">
                  {colors.slice(0, 3).map((c, i) => (
                    <span
                      key={i}
                      className="size-4 rounded-full border-2 border-white shadow-sm dark:border-dark-800"
                      style={{ backgroundColor: normalizedToHex(c.value) }}
                    />
                  ))}
                  {colors.length > 3 && (
                    <span className="flex size-4 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[8px] font-bold text-gray-600 shadow-sm dark:border-dark-800 dark:bg-dark-600 dark:text-dark-100">
                      +{colors.length - 3}
                    </span>
                  )}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(index);
                }}
                aria-label={`Delete layer ${layer.nm || index + 1}`}
                className="shrink-0 rounded-md p-1 text-gray-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-dark-400 dark:hover:bg-red-500/10">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          );
        })}

        {animation.layers.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-gray-400 dark:text-dark-300">No layers in this animation.</p>
        )}
      </div>
    </div>
  );
};

export default LayersPanel;
