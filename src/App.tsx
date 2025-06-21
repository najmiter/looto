import React, { useState } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import FileUpload from './components/FileUpload';
import { validateLottie } from './utils/lottieValidator';
import { handleError } from './utils/errorHandler';

const App = () => {
    const [lottieData, setLottieData] = useState(null);
    const [error, setError] = useState('');

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                const validationResult = validateLottie(json);
                if (validationResult.isValid) {
                    setLottieData(json);
                    setError('');
                } else {
                    throw new Error(validationResult.errorMessage);
                }
            } catch (err) {
                handleError(err.message);
                setError(err.message);
            }
        };
        reader.readAsText(file);
    };

    const handleLottieChange = (newData) => {
        setLottieData(newData);
    };

    return (
        <div>
            <h1>Lottie Editor</h1>
            <FileUpload onFileUpload={handleFileUpload} />
            {error && <div className="error">{error}</div>}
            <Editor lottieData={lottieData} onChange={handleLottieChange} />
            <Preview lottieData={lottieData} />
        </div>
    );
};

export default App;