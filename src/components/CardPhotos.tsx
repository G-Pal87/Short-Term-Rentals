"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface CardPhotosProps {
  href: string;
  alt: string;
  /** Full image URLs (basePath included), first one is the hero. */
  photos: string[];
}

// Swipeable photo strip for property cards: CSS scroll-snap does the
// swiping on touch screens, arrow buttons appear on hover for mouse users.
// Every slide links to the property page.
export default function CardPhotos({ href, alt, photos }: CardPhotosProps) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  function onScroll() {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function go(delta: number) {
    const el = track.current;
    if (!el) return;
    const next = Math.min(photos.length - 1, Math.max(0, index + delta));
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }

  return (
    <>
      <div
        ref={track}
        onScroll={onScroll}
        className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((src, i) => (
          <Link key={src} href={href} className="relative flex-none w-full h-full snap-start overflow-hidden" tabIndex={i === 0 ? 0 : -1}>
            <Image
              src={src}
              alt={i === 0 ? alt : `${alt} - photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              loading={i === 0 ? undefined : "lazy"}
            />
          </Link>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          {index > 0 && (
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="hidden [@media(hover:hover)]:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {index < photos.length - 1 && (
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="hidden [@media(hover:hover)]:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 text-gray-800 shadow items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
          {/* Dots, kept above the name overlay */}
          <div className="absolute bottom-[4.75rem] inset-x-0 z-20 flex justify-center gap-1.5 pointer-events-none">
            {photos.map((src, i) => (
              <span key={src} className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"}`} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
