import type { LottieAnimation } from '../types/lottie';

export const readLottieFile = async (
  file: File
): Promise<LottieAnimation | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        resolve(json);
      } catch (error: any) {
        reject(new Error('Failed to parse Lottie JSON file.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };
    reader.readAsText(file);
  });
};

export const writeLottieFile = async (
  data: LottieAnimation,
  filename: string
): Promise<void> => {
  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
