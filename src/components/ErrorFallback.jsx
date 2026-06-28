import { FaRotateRight, FaTriangleExclamation } from 'react-icons/fa6';

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main className="min-h-screen bg-red-50 p-6 text-red-950 dark:bg-red-950 dark:text-red-50">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center gap-5 text-center">
        <FaTriangleExclamation className="text-5xl text-red-500" aria-hidden="true" />
        <div>
          <h1 className="text-3xl font-black">Something went sideways.</h1>
          <p className="mt-3 text-lg text-red-800 dark:text-red-100">
            The game state is safe in this browser. Try refreshing the screen or reset this view.
          </p>
        </div>
        <pre className="max-w-full overflow-auto rounded-lg bg-white/80 p-4 text-left text-sm text-red-900 shadow-sm dark:bg-red-900/50 dark:text-red-50">
          {error.message}
        </pre>
        <button type="button" className="btn-primary" onClick={resetErrorBoundary}>
          <FaRotateRight aria-hidden="true" />
          Reset View
        </button>
      </section>
    </main>
  );
}
