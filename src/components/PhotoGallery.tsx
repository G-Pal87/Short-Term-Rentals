"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface PhotoGalleryProps {
  images: string[];   // full resolved URLs/paths
  gradients: string[];
  propertyName: string;
}

export default function PhotoGallery({ images, gradients, propertyName }: PhotoGalleryProps) {
  const hasPhotos = images.length > 0;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const totalCount = hasPhotos ? images.length : gradients.length;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i - 1 + totalCount) % totalCount));
  }, [totalCount]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % totalCount));
  }, [totalCount]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, prev, next]);

  return (
    <>
      {/* ── Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-2.5 h-72 sm:h-[420px] rounded-2xl overflow-hidden">
        {/* Main large photo */}
        <div
          className="col-span-4 sm:col-span-2 relative overflow-hidden cursor-pointer"
          style={hasPhotos ? undefined : { background: gradients[0] }}
          onClick={() => openLightbox(0)}
        >
          {hasPhotos ? (
            <Image
              src={images[0]}
              alt={propertyName}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover hover:scale-[1.02] transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-2 border-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <span className="text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
              Main view
            </span>
          </div>
        </div>

        {/* Smaller thumbnails */}
        <div className="hidden sm:grid sm:col-span-2 grid-cols-2 gap-2.5">
          {(hasPhotos ? images.slice(1, 5) : gradients.slice(1, 5)).map((src, i) => {
            const globalIndex = i + 1;
            const isLastThumb = i === 3;
            const remaining = totalCount - 5;
            const showMore = isLastThumb && remaining > 0;

            return (
              <div
                key={i}
                className="relative overflow-hidden cursor-pointer group"
                style={hasPhotos ? undefined : { background: src as string }}
                onClick={() => openLightbox(globalIndex)}
              >
                {hasPhotos ? (
                  <Image
                    src={src}
                    alt={`${propertyName} photo ${globalIndex + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-8">
                    <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full border border-white/30" />
                  </div>
                )}

                {showMore && (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 hover:bg-black/60 transition-colors">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M4.5 3v18M19.5 3v18" />
                    </svg>
                    <span className="text-white text-sm font-semibold">+{remaining} more</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Lightbox ─────────────────────────────────── */}
      {lightboxIndex !== null && hasPhotos && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            onClick={closeLightbox}
            aria-label="Close gallery"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-3 sm:left-6 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous photo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full max-w-5xl max-h-[85vh] mx-16 sm:mx-24"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${propertyName} photo ${lightboxIndex + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          <button
            className="absolute right-3 sm:right-6 z-10 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next photo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 overflow-x-auto">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`relative flex-shrink-0 w-12 h-9 rounded overflow-hidden border-2 transition-all ${
                  i === lightboxIndex ? "border-white scale-110" : "border-white/30 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
