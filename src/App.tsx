import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Workspace from './components/Workspace';
import Footer from './components/Footer';
import ErrorBanner from './components/ErrorBanner';
import { useTheme } from './hooks/useTheme';
import { useLottieDocument } from './hooks/useLottieDocument';
import type { EditorView } from './components/ViewToggle';

export default function App() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const doc = useLottieDocument();
  const [view, setView] = useState<EditorView>('design');

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 text-gray-900 transition-colors dark:bg-dark-900 dark:text-gray-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-80 bg-gradient-to-b from-primary-500/10 via-primary-500/5 to-transparent"
      />

      <Header
        hasDocument={doc.lottieData !== null}
        view={view}
        onViewChange={setView}
        fileName={doc.fileName}
        onFileNameChange={doc.setFileName}
        isDirty={doc.isDirty}
        onRevert={doc.revert}
        onDownload={doc.download}
        onFileUpload={doc.loadDocument}
        onUploadError={doc.setError}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <ErrorBanner message={doc.error} onDismiss={() => doc.setError('')} />

      <main
        className={`relative z-10 w-full flex-1 px-4 py-6 sm:px-6 ${doc.lottieData ? '' : 'mx-auto max-w-[1600px]'}`}>
        {!doc.lottieData ? (
          <Hero onFileUpload={doc.loadDocument} />
        ) : (
          <Workspace
            animation={doc.lottieData}
            view={view}
            onViewChange={setView}
            layerColors={doc.layerColors}
            selectedLayer={doc.selectedLayer}
            onSelectLayer={doc.setSelectedLayer}
            onDeleteLayer={doc.deleteLayer}
            onChange={doc.updateDocument}
            jsonString={doc.jsonString}
            jsonError={doc.jsonError}
            onJsonChange={doc.updateJsonString}
          />
        )}
      </main>

      {!doc.lottieData && <Footer />}
    </div>
  );
}
