"use client";

import { useState, useRef } from "react";

interface PhotoGalleryProps {
  gradients: string[];
  propertyName: string;
}

export default function PhotoGallery({
  gradients,
  propertyName,
}: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      // swipe left → next
      setActiveIndex((i) => (i + 1) % gradients.length);
    } else {
      // swipe right → prev
      setActiveIndex((i) => (i - 1 + gradients.length) % gradients.length);
    }
  }

  function prev() {
    setActiveIndex((i) => (i - 1 + gradients.length) % gradients.length);
  }

  function next() {
    setActiveIndex((i) => (i + 1) % gradients.length);
  }

  const photoPlaceholder = (
    <div className="w-full h-full flex items-center justify-center opacity-25">
      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Mobile: single swipeable photo */}
      <div className="sm:hidden relative rounded-2xl overflow-hidden h-64 select-none">
        <div
          className="w-full h-full transition-all duration-300"
          style={{ background: gradients[activeIndex] }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label={`${propertyName} photo ${activeIndex + 1} of ${gradients.length}`}
        >
          {photoPlaceholder}
        </div>

        {/* Prev / Next arrows */}
        {gradients.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {gradients.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {gradients.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeIndex ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden sm:grid grid-cols-4 gap-3 h-96">
        {/* Main large photo */}
        <div
          className="col-span-2 rounded-2xl overflow-hidden cursor-pointer"
          style={{ background: gradients[activeIndex] }}
          onClick={next}
        >
          <div className="w-full h-full flex items-center justify-center opacity-25">
            <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        </div>

        {/* Smaller thumbnail photos */}
        {gradients.map((gradient, i) => {
          if (i === activeIndex) return null;
          return (
            <div
              key={i}
              className="rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: gradient }}
              onClick={() => setActiveIndex(i)}
            >
              <div className="w-full h-full flex items-center justify-center opacity-20">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
            </div>
          );
        }).filter(Boolean).slice(0, 2)}
      </div>
    </>
  );
}
