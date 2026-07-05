import React, { useEffect, useState } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onCommit: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({ label, value, onCommit, min, step, suffix }) => {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    setText(raw);
    const parsed = parseFloat(raw);
    if (Number.isFinite(parsed) && (min === undefined || parsed >= min)) {
      onCommit(parsed);
    }
  };

  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-dark-300">
        {label}
      </span>
      <span className="relative block">
        <input
          type="number"
          value={text}
          min={min}
          step={step}
          onChange={handleChange}
          onBlur={() => setText(String(value))}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-100"
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400 dark:text-dark-300">
            {suffix}
          </span>
        )}
      </span>
    </label>
  );
};

export default NumberInput;
