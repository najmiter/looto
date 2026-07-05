interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="relative z-10 mx-auto mt-4 w-full max-w-2xl px-4">
      <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm dark:border-red-500/30 dark:bg-red-500/10">
        <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
        <button onClick={onDismiss} aria-label="Dismiss error" className="text-red-400 transition hover:text-red-600">
          ✕
        </button>
      </div>
    </div>
  );
}
