export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-gray-200 bg-white/60 py-4 dark:border-dark-600 dark:bg-dark-900/60">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-2 px-4 text-xs text-gray-500 sm:flex-row sm:px-6 dark:text-dark-300">
        <p>
          &copy; {new Date().getFullYear()} Knoctal · Made with 💜 by{' '}
          <a
            target="_blank"
            href="https://www.knoctal.com/"
            className="font-medium text-primary-600 hover:underline dark:text-primary-400">
            Knoctal
          </a>
        </p>
        <a
          target="_blank"
          href="https://github.com/najmiter/looto"
          className="font-medium transition hover:text-gray-900 dark:hover:text-white">
          GitHub ↗
        </a>
      </div>
    </footer>
  );
}
