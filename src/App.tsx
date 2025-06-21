import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import FileUpload from './components/FileUpload';
import { validateLottie } from './utils/lottieValidator';
import { handleError } from './utils/errorHandler';

const App: React.FC = () => {
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (jsonData: object) => {
    try {
      const validationResult = validateLottie(jsonData);
      if (validationResult.isValid) {
        setLottieData(jsonData);
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
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Lottie Editor</h1>
        <p>Upload, edit, and preview Lottie animations</p>
      </header>

      <div className="app-content">
        <div className="upload-section">
          <FileUpload onFileUpload={handleFileUpload} />
          {error && <div className="error">{error}</div>}
        </div>

        <div className="editor-preview-container">
          <div className="editor-section">
            <Editor lottieData={lottieData} onChange={handleLottieChange} />
          </div>

          {lottieData && (
            <div className="preview-section">
              <h3>Preview</h3>
              <div className="preview-container">
                <Preview lottieData={lottieData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
