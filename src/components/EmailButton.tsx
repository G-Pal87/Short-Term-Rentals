"use client";

import { useEffect, useState, type ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/site";
import { gmailUrl, mailtoUrl, outlookUrl, type EmailDraft } from "@/lib/email";

interface EmailButtonProps {
  draft?: EmailDraft;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  /** Booking panel only: opens the enquiry form instead of an email. */
  onUseForm?: () => void;
}

// mailto: opens whatever desktop mail program is set up (often one the
// visitor never uses). On computers a click offers Gmail / Outlook.com in the
// browser, the mail app, copying the address, or the enquiry form; phones
// follow the mailto: link straight away.
export default function EmailButton({ draft = {}, className, children, onUseForm, ...rest }: EmailButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      e.preventDefault();
      setCopied(false);
      setOpen(true);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const option = "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors";

  return (
    <>
      <a href={mailtoUrl(draft)} onClick={handleClick} className={className} {...rest}>
        {children}
      </a>
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-dialog-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-gray-900" onClick={(e) => e.stopPropagation()}>
            <h3 id="email-dialog-title" className="font-semibold text-lg text-center">Email us</h3>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-cream-dark bg-cream px-3 py-2">
              <span className="flex-1 min-w-0 truncate text-sm font-medium select-all">{CONTACT_EMAIL}</span>
              <button type="button" onClick={copy} className="text-xs font-semibold text-secondary hover:text-primary px-2 py-1">
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <a href={gmailUrl(draft)} target="_blank" rel="noopener noreferrer" className={`${option} bg-secondary hover:bg-secondary-dark text-white`} onClick={() => setOpen(false)}>
                Open in Gmail
              </a>
              <a href={outlookUrl(draft)} target="_blank" rel="noopener noreferrer" className={`${option} bg-secondary hover:bg-secondary-dark text-white`} onClick={() => setOpen(false)}>
                Open in Outlook.com
              </a>
              <a href={mailtoUrl(draft)} className={`${option} border border-cream-dark text-gray-800 hover:bg-cream`} onClick={() => setOpen(false)}>
                Use my mail app
              </a>
              {onUseForm && (
                <button type="button" className={`${option} border border-cream-dark text-gray-800 hover:bg-cream`} onClick={() => { setOpen(false); onUseForm(); }}>
                  Send the enquiry form instead
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className={`${option} text-gray-600 hover:bg-gray-100`}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
