import React from 'react';
import { normalizedToHex, hexToNormalized } from '@/utils/colorUtils';

interface ColorPickerProps {
  value: number[] | { k: number[] };
  onChange: (newColor: number[]) => void;
  label: string;
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  disabled = false,
}) => {
  const getColorArray = (): number[] => {
    if (Array.isArray(value)) {
      return value;
    }
    if (
      value &&
      typeof value === 'object' &&
      'k' in value &&
      Array.isArray(value.k)
    ) {
      return value.k;
    }
    return [0, 0, 0, 1];
  };

  const colorArray = getColorArray();
  const hexValue = normalizedToHex(colorArray);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = event.target.value;
    const newColorArray = hexToNormalized(newHex);

    if (colorArray.length > 3) {
      newColorArray[3] = colorArray[3];
    }

    onChange(newColorArray);
  };

  const handleAlphaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAlpha = parseFloat(event.target.value) / 100;
    const newColorArray = [...colorArray];
    newColorArray[3] = newAlpha;
    onChange(newColorArray);
  };

  const alpha = colorArray.length > 3 ? Math.round(colorArray[3] * 100) : 100;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2 flex-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-0 flex-shrink">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded border border-gray-300 dark:border-dark-600 flex-shrink-0"
            style={{ backgroundColor: hexValue }}
          />
          <input
            type="color"
            value={hexValue}
            onChange={handleColorChange}
            disabled={disabled}
            className="w-8 h-8 rounded border-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <input
            type="text"
            value={hexValue.toUpperCase()}
            onChange={(e) => {
              if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                handleColorChange(e as any);
              }
            }}
            disabled={disabled}
            className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-dark-600 rounded bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent disabled:opacity-50"
            placeholder="#000000"
          />
        </div>
      </div>

      {colorArray.length > 3 && (
        <div className="flex items-center space-x-2 flex-shrink-0">
          <label className="text-xs text-gray-600 dark:text-gray-400">
            Alpha:
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={alpha}
            onChange={handleAlphaChange}
            disabled={disabled}
            className="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 disabled:opacity-50"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
            {alpha}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
