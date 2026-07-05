import React, { useEffect, useMemo, useRef, useState } from 'react';
import Preview from './components/Preview';
import FileUpload from './components/FileUpload';
import LayersPanel from './components/LayersPanel';
import Inspector from './components/Inspector';
import JsonEditor from './components/JsonEditor';
import { validateLottie } from './utils/lottieValidator';
import { handleError } from './utils/errorHandler';
import { writeLottieFile } from './utils/fileHandler';
import { extractColorsFromLayer } from './utils/colorUtils';
import type { LottieAnimation } from './types/lottie';
import type { ColorProperty } from './types';

export default function App() {
  const [lottieData, setLottieData] = useState<LottieAnimation | null>(null);
  const [originalData, setOriginalData] = useState<LottieAnimation | null>(null);
  const [jsonString, setJsonString] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fileName, setFileName] = useState<string>('animation.json');
  const [view, setView] = useState<'design' | 'json'>('design');
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    // older versions stored the value JSON-encoded ('"dark"'), so strip quotes
    const theme = stored?.replace(/"/g, '') ?? null;
    const dark = theme === null ? window.matchMedia('(prefers-color-scheme: dark)').matches : theme === 'dark';
    setIsDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const layerColors = useMemo(() => {
    const colors: { [key: number]: ColorProperty[] } = {};
    lottieData?.layers?.forEach((layer, index) => {
      colors[index] = extractColorsFromLayer(layer);
    });
    return colors;
  }, [lottieData]);

  const handleFileUpload = (jsonData: object, uploadedFileName?: string) => {
    const validationResult = validateLottie(jsonData);
    if (!validationResult.isValid) {
      const message = validationResult.errors.join(', ');
      handleError(message);
      setError(message);
      return;
    }
    const animation = jsonData as LottieAnimation;
    setLottieData(animation);
    setOriginalData(structuredClone(animation));
    setJsonString(JSON.stringify(animation, null, 2));
    if (uploadedFileName) setFileName(uploadedFileName);
    setSelectedLayer(null);
    setError('');
    setJsonError('');
  };

  const handleLottieChange = (newData: LottieAnimation) => {
    setLottieData(newData);
    setJsonString(JSON.stringify(newData, null, 2));
    setJsonError('');
  };

  const handleJsonStringChange = (newJsonString: string) => {
    setJsonString(newJsonString);
    try {
      const parsedData = JSON.parse(newJsonString);
      const validationResult = validateLottie(parsedData);
      if (validationResult.isValid) {
        setLottieData(parsedData);
        setJsonError('');
      } else {
        setJsonError(validationResult.errors.join(', '));
      }
    } catch {
      setJsonError('Invalid JSON format');
    }
  };

  const handleLayerDelete = (layerIndex: number) => {
    if (!lottieData) return;

    const removed = lottieData.layers[layerIndex];
    // layers referencing the removed layer via parent would point at a
    // missing index and crash strict players — reparent them to the removed
    // layer's own parent (or detach them)
    const newLayers = lottieData.layers
      .filter((_, index) => index !== layerIndex)
      .map((layer) => {
        if (removed.ind === undefined || layer.parent !== removed.ind) {
          return layer;
        }
        const { parent: _parent, ...rest } = layer;
        return removed.parent !== undefined ? { ...rest, parent: removed.parent } : rest;
      });

    handleLottieChange({ ...lottieData, layers: newLayers });
    setSelectedLayer(null);
  };

  const handleRevert = () => {
    if (!originalData) return;
    handleLottieChange(structuredClone(originalData));
    setSelectedLayer(null);
  };

  const handleSaveFile = async () => {
    if (!lottieData) return;
    try {
      await writeLottieFile(lottieData, fileName.endsWith('.json') ? fileName : `${fileName}.json`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save file';
      handleError(message);
      setError(message);
    }
  };

  const handleReplaceFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    file
      .text()
      .then((content) => handleFileUpload(JSON.parse(content), file.name))
      .catch(() => setError('This file is not valid JSON.'));
    event.target.value = '';
  };

  const isDirty = originalData !== null && JSON.stringify(lottieData) !== JSON.stringify(originalData);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-dark-900 dark:text-gray-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-80 bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent" />

      <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-white/80 backdrop-blur-lg dark:border-dark-600/80 dark:bg-dark-900/80">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <img width={36} height={36} alt="Lootie logo" src="/lottie-editor.svg" className="rounded-xl" />
            <div className="sr-only">
              <h1 className="">Lootie</h1>
            </div>
          </div>

          {lottieData && (
            <div className="hidden items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm md:flex dark:border-dark-600 dark:bg-dark-800">
              {(['design', 'json'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${
                    view === v
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:text-dark-200 dark:hover:text-white'
                  }`}>
                  {v === 'json' ? 'JSON' : 'Design'}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {lottieData && (
              <>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
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
                  onClick={handleRevert}
                  disabled={!isDirty}
                  title="Revert all changes"
                  className="rounded-lg border border-gray-200 p-2 text-gray-500 transition enabled:hover:border-primary-400 enabled:hover:text-primary-600 disabled:opacity-40 dark:border-dark-600 dark:text-dark-200 dark:enabled:hover:text-primary-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                </button>

                <button
                  onClick={handleSaveFile}
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
              onClick={toggleDarkMode}
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

      {error && (
        <div className="relative z-10 mx-auto mt-4 w-full max-w-2xl px-4">
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm dark:border-red-500/30 dark:bg-red-500/10">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => setError('')}
              aria-label="Dismiss error"
              className="text-red-400 transition hover:text-red-600">
              ✕
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 sm:px-6">
        {!lottieData ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center py-10">
            <div className="mb-10 max-w-2xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                Edit Lottie animations,
                <br />
                <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
                  no sign-up needed
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base text-gray-500 dark:text-dark-200">
                Recolor, retime, and tweak your animations with a live preview. Your files never leave your device.
              </p>
            </div>

            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="grid gap-4 lg:h-[calc(100dvh-7.5rem)] lg:min-h-[560px] lg:grid-cols-[280px_minmax(0,1fr)_340px]">
            {view === 'design' ? (
              <>
                <div className="order-2 h-96 lg:order-1 lg:h-auto lg:min-h-0">
                  <LayersPanel
                    animation={lottieData}
                    layerColors={layerColors}
                    selectedLayer={selectedLayer}
                    onSelect={setSelectedLayer}
                    onDelete={handleLayerDelete}
                  />
                </div>
                <div className="order-1 h-[60vh] lg:order-2 lg:h-auto lg:min-h-0">
                  <Preview lottieData={lottieData} />
                </div>
                <div className="order-3 h-[32rem] lg:h-auto lg:min-h-0">
                  <Inspector
                    animation={lottieData}
                    selectedLayer={selectedLayer}
                    layerColors={layerColors}
                    onChange={handleLottieChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="order-2 h-[60vh] lg:order-1 lg:col-span-2 lg:h-auto lg:min-h-0">
                  <JsonEditor jsonString={jsonString} error={jsonError} onChange={handleJsonStringChange} />
                </div>
                <div className="order-1 h-[50vh] lg:order-2 lg:h-auto lg:min-h-0">
                  <Preview lottieData={lottieData} />
                </div>
              </>
            )}

            {/* mobile view switcher */}
            <div className="order-4 flex justify-center md:hidden">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-dark-600 dark:bg-dark-800">
                {(['design', 'json'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${
                      view === v ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 dark:text-dark-200'
                    }`}>
                    {v === 'json' ? 'JSON' : 'Design'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {!lottieData && (
        <footer className="relative z-10 border-t border-gray-200 bg-white/60 py-4 dark:border-dark-600 dark:bg-dark-900/60">
          <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 text-xs text-gray-500 sm:flex-row sm:px-6 dark:text-dark-300">
            <p>
              &copy; {new Date().getFullYear()} Knoctal · Made with 💜 by{' '}
              <a
                target="_blank"
                href="https://www.knoctal.com/"
                className="font-medium text-primary-600 hover:underline dark:text-primary-400">
                Knoctal
              </a>
            </p>
            <a
              target="_blank"
              href="https://github.com/najmiter/looto"
              className="font-medium transition hover:text-gray-900 dark:hover:text-white">
              GitHub ↗
            </a>
          </div>
        </footer>
      )}
    </div>
  );
}
