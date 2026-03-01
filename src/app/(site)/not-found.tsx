import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="min-h-screen bg-dark flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-8xl md:text-9xl text-coral font-normal">404</h1>
      <p className="font-sans font-light text-xl md:text-2xl text-cream/80 mt-4">
        This page doesn&apos;t exist
      </p>
      <p className="font-sans font-light text-sm text-cream/50 mt-2 max-w-md">
        The page you&apos;re looking for may have been moved or no longer exists.
        Let&apos;s get you back on track.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center px-8 py-3 bg-coral text-cream font-sans font-normal tracking-wider uppercase text-sm transition-all duration-300 hover:brightness-110"
      >
        Back to Home
      </Link>
    </section>
  );
}
