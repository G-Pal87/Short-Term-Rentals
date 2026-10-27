import { CONTACT_EMAIL, CONTACT_EMAIL_CC } from "@/lib/site";

export interface EmailDraft {
  subject?: string;
  body?: string;
}

const q = (params: Record<string, string | undefined>) =>
  Object.entries(params)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
    .join("&");

/** Opens the visitor's default mail app (Outlook, Apple Mail...). */
export function mailtoUrl({ subject, body }: EmailDraft = {}): string {
  return `mailto:${CONTACT_EMAIL}?${q({ cc: CONTACT_EMAIL_CC, subject, body })}`;
}

/** Pre-filled compose window in Gmail on the web. */
export function gmailUrl({ subject, body }: EmailDraft = {}): string {
  return `https://mail.google.com/mail/?${q({ view: "cm", fs: "1", to: CONTACT_EMAIL, cc: CONTACT_EMAIL_CC, su: subject, body })}`;
}

/** Pre-filled compose window in Outlook.com. */
export function outlookUrl({ subject, body }: EmailDraft = {}): string {
  return `https://outlook.live.com/mail/0/deeplink/compose?${q({ to: CONTACT_EMAIL, cc: CONTACT_EMAIL_CC, subject, body })}`;
}
