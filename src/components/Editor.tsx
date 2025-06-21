import React, { useState } from 'react';
import { validateLottie } from '../utils/lottieValidator';
import { handleError } from '../utils/errorHandler';

const Editor: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(event.target.value);
    setErrorMessage('');
  };

  const handleSave = () => {
    const validationResults = validateLottie(jsonInput);
    if (!validationResults.isValid) {
      setErrorMessage(validationResults.errorMessage);
      handleError(validationResults.errorMessage);
      return;
    }
    // Logic to save the JSON file can be implemented here
    console.log('Lottie JSON saved:', jsonInput);
  };

  return (
    <div>
      <h2>Edit Lottie JSON</h2>
      <textarea
        value={jsonInput}
        onChange={handleInputChange}
        rows={10}
        cols={50}
        placeholder="Paste your Lottie JSON here"
      />
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Editor;
