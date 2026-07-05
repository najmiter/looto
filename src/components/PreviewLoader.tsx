interface PreviewLoaderProps {
  variant: 'initial' | 'refresh';
}

export default function PreviewLoader({ variant }: PreviewLoaderProps) {
  if (variant === 'initial') {
    return (
      <div className="absolute select-none pointer-events-none inset-0 z-10 flex flex-col items-center justify-center gap-3">
        <span className="size-8 animate-spin rounded-full border-[3px] border-primary-200 border-t-primary-600 dark:border-dark-600 dark:border-t-primary-400" />
        <span className="text-xs font-medium text-gray-500 dark:text-dark-200">Loading animation…</span>
      </div>
    );
  }

  return (
    <div className="absolute select-none pointer-events-none right-2 top-2 z-10 flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur dark:border-dark-600 dark:bg-dark-800/90">
      <span className="size-3 animate-spin rounded-full border-2 border-primary-200 border-t-primary-600 dark:border-dark-600 dark:border-t-primary-400" />
      <span className="text-[10px] font-medium text-gray-500 dark:text-dark-200">Updating</span>
    </div>
  );
}
