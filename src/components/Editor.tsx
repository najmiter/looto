import React, { useState } from 'react';
import { validateLottie } from '../utils/lottieValidator';
import { handleError } from '../utils/errorHandler';
import VisualEditor from './VisualEditor';
import './Editor.css';

interface EditorProps {
  lottieData: object | null;
  onChange: (newData: object) => void;
}

const Editor: React.FC<EditorProps> = ({ lottieData, onChange }) => {
  const [jsonInput, setJsonInput] = useState<string>(
    lottieData ? JSON.stringify(lottieData, null, 2) : ''
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
    setErrorMessage('');
  };

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const validationResults = validateLottie(parsedJson);
      if (!validationResults.isValid) {
        const errorMsg = validationResults.errors.join(', ');
        setErrorMessage(errorMsg);
        handleError(errorMsg);
        return;
      }
      onChange(parsedJson);
      console.log('Lottie JSON saved:', parsedJson);
    } catch (err) {
      const errorMsg = 'Invalid JSON format';
      setErrorMessage(errorMsg);
      handleError(errorMsg);
    }
  };

  // Update JSON input when lottieData changes
  React.useEffect(() => {
    if (lottieData) {
      setJsonInput(JSON.stringify(lottieData, null, 2));
    }
  }, [lottieData]);

  return (
    <div className="editor-container">
      <div className="editor-tabs">
        <button
          className={`tab-button ${activeTab === 'visual' ? 'active' : ''}`}
          onClick={() => setActiveTab('visual')}
        >
          Visual Editor
        </button>
        <button
          className={`tab-button ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          JSON Editor
        </button>
      </div>

      {activeTab === 'visual' ? (
        <VisualEditor lottieData={lottieData} onChange={onChange} />
      ) : (
        <div className="json-editor">
          <h2>Edit Lottie JSON</h2>
          <textarea
            value={jsonInput}
            onChange={handleInputChange}
            rows={20}
            cols={80}
            placeholder="Paste your Lottie JSON here"
            className="json-textarea"
          />
          {errorMessage && <div className="error">{errorMessage}</div>}
          <button onClick={handleSave} className="save-button">
            Save JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default Editor;
