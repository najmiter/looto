import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import FileUpload from './components/FileUpload';
import { validateLottie } from './utils/lottieValidator';
import { handleError } from './utils/errorHandler';
import { writeLottieFile } from './utils/fileHandler';
import type { LottieAnimation } from './types/lottie';

const App: React.FC = () => {
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [error, setError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fileName, setFileName] = useState<string>('animation.json');
  const [jsonString, setJsonString] = useState<string>('');

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === null) {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      setIsDarkMode(prefersDark);

      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      const parsedTheme = JSON.parse(theme);
      setIsDarkMode(parsedTheme === 'dark');
      document.documentElement.classList.toggle('dark', parsedTheme === 'dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    const theme = newDarkMode ? 'dark' : 'light';
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme', JSON.stringify(theme));
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const handleFileUpload = (jsonData: object, uploadedFileName?: string) => {
    try {
      const validationResult = validateLottie(jsonData);
      if (validationResult.isValid) {
        setLottieData(jsonData);
        setJsonString(JSON.stringify(jsonData, null, 2));
        if (uploadedFileName) {
          setFileName(uploadedFileName);
        }
        setError('');
      } else {
        throw new Error(validationResult.errors.join(', '));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      handleError(errorMessage);
      setError(errorMessage);
    }
  };

  const handleLottieChange = (newData: object) => {
    setLottieData(newData);
    setJsonString(JSON.stringify(newData, null, 2));
  };

  const handleJsonStringChange = (newJsonString: string) => {
    setJsonString(newJsonString);
    try {
      const parsedData = JSON.parse(newJsonString);
      const validationResult = validateLottie(parsedData);
      if (validationResult.isValid) {
        setLottieData(parsedData);
        setError('');
      } else {
        setError(validationResult.errors.join(', '));
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleSaveFile = async () => {
    if (!lottieData) return;

    try {
      await writeLottieFile(lottieData as LottieAnimation, fileName);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save file';
      handleError(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/lottie-editor.svg"
                width={40}
                height={40}
                alt="lootie logo"
                className="rounded-xl"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Lootie
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Free Lottie Editor
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                {lottieData && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="px-3 py-1.5 text-sm border border-gray-300 dark:border-dark-600 rounded-md bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="filename.json"
                    />
                    <button
                      onClick={handleSaveFile}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download
                    </button>
                  </div>
                )}

                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <a
                  target="_blank"
                  href="https://github.com/najmiter/looto"
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Upload Lottie Animation
            </h2>
            <FileUpload onFileUpload={handleFileUpload} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {lottieData ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
                <Editor
                  lottieData={lottieData}
                  jsonString={jsonString}
                  fileName={fileName}
                  onChange={handleLottieChange}
                  onJsonStringChange={handleJsonStringChange}
                  onFileNameChange={setFileName}
                  onSave={async (data, filename) => {
                    try {
                      await writeLottieFile(data as LottieAnimation, filename);
                    } catch (err) {
                      const errorMessage =
                        err instanceof Error
                          ? err.message
                          : 'Failed to save file';
                      handleError(errorMessage);
                      setError(errorMessage);
                    }
                  }}
                />
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Preview
                </h3>
                <div className="aspect-square bg-gray-50 dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 flex items-center justify-center">
                  <Preview lottieData={lottieData} />
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p>The animation will play automatically when loaded.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16M11 9v6M13 9v6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No animation loaded
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Upload a Lottie JSON file to get started with editing.
            </p>
          </div>
        )}
      </main>
      <footer>
        <div className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700 py-6">
          <div className="max-w-7xl space-y-2.5 mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-dark-500 dark:text-dark-300">
            <p>
              &copy; {new Date().getFullYear()} Knoctal. All rights reserved.
            </p>
            <p>
              Made with ❤️ by{' '}
              <a
                target="_blank"
                href="https://www.knoctal.com/"
                className="text-violet-600 dark:text-violet-400 hover:underline"
              >
                Knoctal
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
