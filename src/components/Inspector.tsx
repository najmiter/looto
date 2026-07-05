import React from 'react';
import type { Layer, LottieAnimation } from '@/types/lottie';
import type { ColorProperty } from '@/types';
import ColorPicker from './ColorPicker';
import NumberInput from './NumberInput';
import { updateColorInLayer } from '@/utils/colorUtils';

interface InspectorProps {
  animation: LottieAnimation;
  selectedLayer: number | null;
  layerColors: { [key: number]: ColorProperty[] };
  onChange: (newData: LottieAnimation) => void;
}

// static transform values are plain number arrays; animated ones hold keyframe
// objects and must not be edited as numbers
const staticVector = (prop?: { a?: number; k: unknown }): number[] | null => {
  if (!prop || prop.a === 1) return null;
  const k = prop.k;
  return Array.isArray(k) && typeof k[0] === 'number' ? (k as number[]) : null;
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border-b border-gray-100 px-4 py-4 last:border-b-0 dark:border-dark-600">
    <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-dark-300">
      {title}
    </h4>
    {children}
  </div>
);

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <label className="block">
    <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
      {label}
    </span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-100"
    />
  </label>
);

const Inspector: React.FC<InspectorProps> = ({ animation, selectedLayer, layerColors, onChange }) => {
  const layer = selectedLayer !== null ? animation.layers[selectedLayer] : null;

  const setAnimationProperty = (property: string, value: string | number) => {
    onChange({ ...animation, [property]: value });
  };

  const setLayerProperty = (property: string, value: string | number | object) => {
    if (selectedLayer === null) return;
    const newLayers = [...animation.layers];
    newLayers[selectedLayer] = {
      ...newLayers[selectedLayer],
      [property]: value,
    };
    onChange({ ...animation, layers: newLayers });
  };

  const setColor = (colorProp: ColorProperty, newColor: number[]) => {
    if (selectedLayer === null) return;
    const newLayers = [...animation.layers];
    newLayers[selectedLayer] = updateColorInLayer(
      newLayers[selectedLayer],
      colorProp.path,
      newColor,
      colorProp.stopIndex,
    );
    onChange({ ...animation, layers: newLayers });
  };

  const setTransform = (currentLayer: Layer, axis: 'p' | 's', componentIndex: number, value: number) => {
    const prop = currentLayer.ks?.[axis];
    const current = staticVector(prop);
    if (!prop || !current) return;

    const newVector = [...current];
    newVector[componentIndex] = value;
    setLayerProperty('ks', {
      ...currentLayer.ks,
      [axis]: { ...prop, k: newVector },
    });
  };

  const duration = animation.fr > 0 ? ((animation.op - animation.ip) / animation.fr).toFixed(2) : '—';

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-dark-600">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          {layer ? layer.nm || `Layer ${selectedLayer! + 1}` : 'Animation'}
        </h3>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-dark-700 dark:text-dark-200">
          {layer ? 'Layer' : `${duration}s · ${animation.fr}fps`}
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!layer && (
          <>
            <Section title="Document">
              <div className="space-y-3">
                <TextField label="Name" value={animation.nm || ''} onChange={(v) => setAnimationProperty('nm', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    label="Width"
                    value={animation.w}
                    min={1}
                    step={1}
                    suffix="px"
                    onCommit={(v) => setAnimationProperty('w', Math.round(v))}
                  />
                  <NumberInput
                    label="Height"
                    value={animation.h}
                    min={1}
                    step={1}
                    suffix="px"
                    onCommit={(v) => setAnimationProperty('h', Math.round(v))}
                  />
                </div>
                <NumberInput
                  label="Frame Rate"
                  value={animation.fr}
                  min={1}
                  suffix="fps"
                  onCommit={(v) => setAnimationProperty('fr', v)}
                />
              </div>
            </Section>
            <Section title="Tip">
              <p className="text-sm leading-relaxed text-gray-500 dark:text-dark-200">
                Select a layer on the left to edit its timing, transform, and colors.
              </p>
            </Section>
          </>
        )}

        {layer && (
          <>
            <Section title="Layer">
              <div className="space-y-3">
                <TextField label="Name" value={layer.nm || ''} onChange={(v) => setLayerProperty('nm', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput label="In Point" value={layer.ip} onCommit={(v) => setLayerProperty('ip', v)} />
                  <NumberInput label="Out Point" value={layer.op} onCommit={(v) => setLayerProperty('op', v)} />
                </div>
                <NumberInput label="Start Time" value={layer.st} onCommit={(v) => setLayerProperty('st', v)} />
              </div>
            </Section>

            {(() => {
              const position = staticVector(layer.ks?.p);
              const scale = staticVector(layer.ks?.s);
              if (!position && !scale) return null;
              return (
                <Section title="Transform">
                  <div className="space-y-3">
                    {position && (
                      <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                          label="X"
                          value={position[0] ?? 0}
                          onCommit={(v) => setTransform(layer, 'p', 0, v)}
                        />
                        <NumberInput
                          label="Y"
                          value={position[1] ?? 0}
                          onCommit={(v) => setTransform(layer, 'p', 1, v)}
                        />
                      </div>
                    )}
                    {scale && (
                      <div className="grid grid-cols-2 gap-3">
                        <NumberInput
                          label="Scale X"
                          value={scale[0] ?? 100}
                          suffix="%"
                          onCommit={(v) => setTransform(layer, 's', 0, v)}
                        />
                        <NumberInput
                          label="Scale Y"
                          value={scale[1] ?? 100}
                          suffix="%"
                          onCommit={(v) => setTransform(layer, 's', 1, v)}
                        />
                      </div>
                    )}
                  </div>
                </Section>
              );
            })()}

            {selectedLayer !== null && (layerColors[selectedLayer]?.length ?? 0) > 0 && (
              <Section title={`Colors (${layerColors[selectedLayer].length})`}>
                <div className="space-y-2">
                  {layerColors[selectedLayer].map((colorProp, i) => (
                    <ColorPicker
                      key={`${colorProp.path}-${i}`}
                      value={colorProp.value}
                      label={colorProp.label}
                      onChange={(c) => setColor(colorProp, c)}
                    />
                  ))}
                </div>
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Inspector;
