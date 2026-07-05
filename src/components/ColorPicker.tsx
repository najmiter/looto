import React, { useEffect, useState } from 'react';
import { normalizedToHex, hexToNormalized } from '@/utils/colorUtils';

interface ColorPickerProps {
  value: number[];
  onChange: (newColor: number[]) => void;
  label: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label }) => {
  const colorArray = Array.isArray(value) ? value : [0, 0, 0, 1];
  const hexValue = normalizedToHex(colorArray);
  const hasAlpha = colorArray.length > 3;

  const [hexText, setHexText] = useState(hexValue.toUpperCase());

  useEffect(() => {
    setHexText(hexValue.toUpperCase());
  }, [hexValue]);

  const commitHex = (hex: string) => {
    const newColorArray = hexToNormalized(hex);
    if (hasAlpha) {
      newColorArray[3] = colorArray[3];
    }
    onChange(newColorArray);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    if (!/^#?[0-9A-Fa-f]{0,6}$/.test(text)) return;
    setHexText(text.toUpperCase());
    // only commit complete colors; partial input keeps the previous color
    if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(text)) {
      commitHex(text);
    }
  };

  const handleAlphaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = parseFloat(event.target.value) / 100;
    if (!Number.isFinite(newAlpha)) return;
    const newColorArray = [...colorArray];
    newColorArray[3] = newAlpha;
    onChange(newColorArray);
  };

  const alpha = hasAlpha ? Math.round(colorArray[3] * 100) : 100;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <div className="flex items-center gap-3">
        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-gray-200 shadow-inner dark:border-dark-600">
          <input
            type="color"
            value={hexValue}
            onChange={(e) => commitHex(e.target.value)}
            aria-label={`${label} color`}
            className="absolute -inset-1 h-[calc(100%+8px)] w-[calc(100%+8px)] cursor-pointer border-0 p-0"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
          <input
            type="text"
            value={hexText}
            onChange={handleTextChange}
            onBlur={() => setHexText(hexValue.toUpperCase())}
            className="mt-0.5 w-24 rounded-md border border-transparent bg-transparent px-1 py-0.5 font-mono text-xs text-gray-500 transition focus:border-primary-500 focus:text-gray-900 focus:ring-2 focus:ring-primary-500/30 dark:text-dark-200 dark:focus:text-gray-100"
            placeholder="#000000"
            spellCheck={false}
          />
        </div>
        {hasAlpha && (
          <div className="flex shrink-0 items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={alpha}
              onChange={handleAlphaChange}
              aria-label={`${label} opacity`}
              className="h-1.5 w-16 cursor-pointer appearance-none rounded-full bg-gray-200 accent-primary-600 dark:bg-dark-600"
            />
            <span className="w-9 text-right font-mono text-xs text-gray-500 dark:text-dark-200">{alpha}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
