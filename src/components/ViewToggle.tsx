export type EditorView = 'design' | 'json';

interface ViewToggleProps {
  view: EditorView;
  onChange: (view: EditorView) => void;
}

export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-dark-600 dark:bg-dark-800">
      {(['design', 'json'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${
            view === v
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-dark-200 dark:hover:text-white'
          }`}>
          {v === 'json' ? 'JSON' : 'Design'}
        </button>
      ))}
    </div>
  );
}
