import React from 'react';

interface JsonEditorProps {
  jsonString: string;
  error: string;
  onChange: (newJsonString: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ jsonString, error, onChange }) => {
  const formatJson = () => {
    try {
      onChange(JSON.stringify(JSON.parse(jsonString), null, 2));
    } catch {
      // leave invalid JSON as-is; the error banner already explains it
    }
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-dark-600 dark:bg-dark-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2.5 dark:border-dark-600">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">JSON Source</h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              error
                ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
            }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
            {error ? 'Invalid' : 'Valid'}
          </span>
        </div>
        <button
          onClick={formatJson}
          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 transition hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-dark-200 dark:hover:text-primary-400">
          Format
        </button>
      </div>

      <textarea
        value={jsonString}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-0 w-full flex-1 resize-none rounded-b-2xl bg-transparent p-4 font-mono text-xs leading-relaxed text-gray-800 outline-none dark:text-gray-200"
        placeholder="Paste your Lottie JSON here..."
      />

      {error && (
        <div className="border-t border-red-100 bg-red-50 px-4 py-2 dark:border-red-500/20 dark:bg-red-500/10">
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default JsonEditor;
