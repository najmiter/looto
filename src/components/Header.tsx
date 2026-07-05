import React, { useRef } from 'react';
import ViewToggle, { type EditorView } from './ViewToggle';

interface HeaderProps {
  hasDocument: boolean;
  view: EditorView;
  onViewChange: (view: EditorView) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  isDirty: boolean;
  onRevert: () => void;
  onDownload: () => void;
  onFileUpload: (jsonData: object, fileName?: string) => void;
  onUploadError: (message: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({
  hasDocument,
  view,
  onViewChange,
  fileName,
  onFileNameChange,
  isDirty,
  onRevert,
  onDownload,
  onFileUpload,
  onUploadError,
  isDarkMode,
  onToggleDarkMode,
}: HeaderProps) {
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleReplaceFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((content) => onFileUpload(JSON.parse(content), file.name))
      .catch(() => onUploadError('This file is not valid JSON.'));
    event.target.value = '';
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg dark:border-dark-600/80 dark:bg-dark-900/80">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <img width={36} height={36} alt="Lootie logo" src="/lottie-editor.svg" className="rounded-xl" />
          <div className={`${hasDocument ? 'sr-only' : 'text-gray-900 dark:text-white'}`}>
            <h1 className="font-semibold">Lootie</h1>
            <p className="text-xs text-gray-500 dark:text-dark-200">Edit Lottie animations in your browser</p>
          </div>
        </div>

        {hasDocument && (
          <div className="hidden md:block">
            <ViewToggle view={view} onChange={onViewChange} />
          </div>
        )}

        <div className="flex items-center gap-2">
          {hasDocument && (
            <>
              <input
                type="text"
                value={fileName}
                onChange={(e) => onFileNameChange(e.target.value)}
                aria-label="File name"
                className="hidden w-44 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 sm:block dark:border-dark-600 dark:bg-dark-800 dark:text-gray-100"
                placeholder="filename.json"
              />

              <input
                ref={replaceInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleReplaceFile}
                className="hidden"
              />
              <button
                onClick={() => replaceInputRef.current?.click()}
                title="Open another file"
                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-dark-200 dark:hover:text-primary-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </button>

              <button
                onClick={onRevert}
                disabled={!isDirty}
                title="Revert all changes"
                className="rounded-lg border border-gray-200 p-2 text-gray-500 transition enabled:hover:border-primary-400 enabled:hover:text-primary-600 disabled:opacity-40 dark:border-dark-600 dark:text-dark-200 dark:enabled:hover:text-primary-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
              </button>

              <button
                onClick={onDownload}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary-500/30 transition hover:shadow-lg hover:shadow-primary-500/40 active:scale-95">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                <span className="hidden sm:inline">Download</span>
              </button>
            </>
          )}

          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-primary-400 hover:text-primary-600 dark:border-dark-600 dark:text-dark-200 dark:hover:text-primary-400">
            {isDarkMode ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
