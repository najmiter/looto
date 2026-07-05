import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onFileUpload: (jsonData: object, fileName?: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);
        setError(null);
        onFileUpload(jsonData, file.name);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        setError('This file is not valid JSON.');
      }
    };
    reader.onerror = () => setError('Failed to read the file.');
    reader.readAsText(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileRead(file);
    event.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    // dropped files often have an empty MIME type, so check the extension too
    if (file && (file.type === 'application/json' || file.name.toLowerCase().endsWith('.json'))) {
      handleFileRead(file);
    } else {
      setError('Please drop a valid JSON file.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a Lottie JSON file"
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'scale-[1.02] border-primary-500 bg-primary-50 shadow-xl shadow-primary-500/20 dark:bg-primary-500/10'
            : 'border-gray-300 bg-white/60 hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 dark:border-dark-500 dark:bg-dark-800/60 dark:hover:border-primary-500/60'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
        }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary-500/10 blur-3xl transition-opacity group-hover:opacity-100" />

        <div className="relative space-y-5">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary-500/30 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
            <svg className="h-9 w-9 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">Drop your Lottie file here</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-dark-200">
              or <span className="font-medium text-primary-600 dark:text-primary-400">browse</span> from your computer ·
              JSON only
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 text-sm">
        <span className="text-gray-400 dark:text-dark-300">No file handy?</span>
        <button
          onClick={() => {
            fetch('/ai-cloud.json')
              .then((res) => res.json())
              .then((data) => onFileUpload(data, 'ai-cloud.json'))
              .catch(() => setError('Failed to load the sample animation.'));
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 font-medium text-primary-700 transition hover:border-primary-400 hover:bg-primary-100 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300 dark:hover:bg-primary-500/20">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.5 3.87a1 1 0 011.51-.86l9 5.13a1 1 0 010 1.72l-9 5.13a1 1 0 01-1.51-.86V3.87z" />
          </svg>
          Try a sample animation
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:border-red-500/30 dark:bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
