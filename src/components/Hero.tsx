import FileUpload from './FileUpload';

interface HeroProps {
  onFileUpload: (jsonData: object, fileName?: string) => void;
}

export default function Hero({ onFileUpload }: HeroProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center py-10">
      <div className="mb-10 max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Edit Lottie animations,
          <br />
          <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent dark:from-primary-300 dark:to-primary-500">
            no sign-up needed
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-gray-500 dark:text-dark-200">
          Recolor, retime, and tweak your animations with a live preview. Your files never leave your device.
        </p>
      </div>

      <FileUpload onFileUpload={onFileUpload} />
    </div>
  );
}
