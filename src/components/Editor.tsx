import React, { useState, useEffect } from 'react';
import VisualEditor from './VisualEditor';
import type { EditorProps } from '@/types';

const Editor: React.FC<EditorProps> = ({
  lottieData,
  jsonString,
  onChange,
  onJsonStringChange,
}) => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    onJsonStringChange(newValue);
    setErrorMessage('');
  };

  useEffect(() => {
    setErrorMessage('');
  }, [activeTab, lottieData]);

  return (
    <div className="h-full">
      <div className="border-b border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 rounded-t-xl">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('visual')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'visual'
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Visual Editor
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'json'
                ? 'border-violet-500 text-violet-600 dark:text-violet-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            JSON Editor
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'visual' ? (
          <VisualEditor lottieData={lottieData} onChange={onChange} />
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={jsonString}
                onChange={handleInputChange}
                rows={20}
                className="block w-full rounded-lg border outline-none border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100 font-mono text-sm p-4 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                placeholder="Paste your Lottie JSON here..."
              />
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
