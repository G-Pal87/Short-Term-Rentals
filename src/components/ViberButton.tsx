"use client";

import { useEffect, useState, type ReactNode } from "react";
import ViberIcon from "./ViberIcon";

interface ViberButtonProps {
  /** viber:// link from buildViberUrl. */
  href: string;
  /** wa.me-style number (country code + number, no "+"). */
  number: string;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  title?: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// viber:// only opens where the Viber app is installed. On computers
// (mouse/trackpad) a click shows the number and a QR code to scan with the
// phone instead; touch devices follow the link straight away.
export default function ViberButton({ href, number, className, children, ...rest }: ViberButtonProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <>
      <a href={href} onClick={handleClick} className={className} {...rest}>
        {children}
      </a>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="viber-dialog-title"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs text-center text-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 mx-auto rounded-full bg-[#7360F2] text-white flex items-center justify-center">
              <ViberIcon className="w-5 h-5" />
            </div>
            <h3 id="viber-dialog-title" className="font-semibold text-lg mt-3">Message us on Viber</h3>
            <p className="text-sm text-gray-600 mt-1">Scan with your phone&apos;s camera to open the chat.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/images/qr/viber-${number}.svg`}
              alt={`QR code for a Viber chat with +${number}`}
              width={198}
              height={198}
              className="mx-auto mt-4"
            />
            <p className="mt-3 text-sm text-gray-600">
              Or add <span className="font-semibold text-gray-900 select-all">+{number}</span> in Viber
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <a
                href={href}
                className="bg-[#7360F2] hover:bg-[#5e4bd6] text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Open Viber on this computer
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
