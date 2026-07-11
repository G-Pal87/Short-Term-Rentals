import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-cream min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="font-serif text-7xl font-bold text-primary mb-2">404</p>
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/paphos"
            className="bg-white border border-cream-dark hover:border-secondary/30 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
