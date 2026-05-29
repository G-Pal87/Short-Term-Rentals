"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-cream-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-secondary text-lg hover:text-primary transition-colors"
          >
            <span className="text-2xl">🌊</span>
            <span>Mediterranean Rentals</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/paphos"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Cyprus — Paphos
            </Link>
            <Link
              href="/tenerife"
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
            >
              Spain — Tenerife
            </Link>
            <a
              href="https://wa.me/420731139854"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Contact Host
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-cream-dark transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-cream-dark mt-2 pt-4">
            <nav className="flex flex-col gap-3">
              <Link
                href="/paphos"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                Cyprus — Paphos
              </Link>
              <Link
                href="/tenerife"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                Spain — Tenerife
              </Link>
              <a
                href="https://wa.me/420731139854"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-dark transition-colors text-center"
              >
                Contact Host
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
