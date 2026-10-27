import { FAQ } from "@/data/faq";

// Native <details> accordion: works without JavaScript and with the keyboard.
export default function FaqList({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`bg-white border border-cream-dark rounded-2xl divide-y divide-cream-dark ${compact ? "" : "shadow-sm"}`}>
      {FAQ.map((item) => (
        <details key={item.question} className="group">
          <summary className={`flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden ${compact ? "px-4 py-3 text-sm" : "px-5 sm:px-6 py-4"} font-semibold text-gray-900 hover:text-primary transition-colors`}>
            {item.question}
            <svg className="w-4 h-4 flex-shrink-0 text-secondary transition-transform duration-200 group-open:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
            </svg>
          </summary>
          <p className={`text-gray-600 leading-relaxed ${compact ? "px-4 pb-4 text-sm" : "px-5 sm:px-6 pb-5"}`}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
