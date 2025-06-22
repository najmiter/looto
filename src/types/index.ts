export interface ColorProperty {
  path: string;
  label: string;
  value: number[] | { k: number[] };
  type: 'fill' | 'stroke' | 'gradient';
}

export interface EditorProps {
  lottieData: object | null;
  jsonString: string;
  fileName: string;
  onChange: (newData: object) => void;
  onJsonStringChange: (newJsonString: string) => void;
  onFileNameChange: (newFileName: string) => void;
  onSave?: (data: object, filename: string) => void;
}

export interface VisualEditorProps {
  lottieData: object | null;
  onChange: (newData: object) => void;
}
