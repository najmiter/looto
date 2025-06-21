import React, { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (jsonData: object) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          onFileUpload(json);
          setError(null);
        } catch (err) {
          setError('Invalid Lottie JSON file.');
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default FileUpload;
