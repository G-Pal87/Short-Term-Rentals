// Phone-in-bubble glyph used for every Viber link (paired with Viber purple).
export default function ViberIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 3.582-9 8 0 2.4 1.19 4.55 3.07 6.02L5.5 21l3.88-2.3c.84.2 1.71.3 2.62.3 4.97 0 9-3.582 9-8s-4.03-8-9-8z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.2 8.2c.3-.3.8-.3 1 .1l.6 1.1c.2.3.1.7-.2.9l-.4.3c.4.9 1.1 1.6 2 2l.3-.4c.2-.3.6-.4.9-.2l1.1.6c.4.2.4.7.1 1l-.5.5c-.5.5-1.3.6-1.9.3-1.7-.8-3-2.1-3.8-3.8-.3-.6-.2-1.4.3-1.9l.5-.5z" />
    </svg>
  );
}
