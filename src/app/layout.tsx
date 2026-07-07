import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mediterranean Rentals - Cyprus & Tenerife",
  description:
    "Beautiful holiday homes in Paphos, Cyprus and Tenerife, Spain. Book directly with the host for the best rates - no platform fees.",
  keywords:
    "vacation rental, Cyprus, Paphos, Tenerife, Spain, holiday apartment, pool, beach, direct booking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-cream font-sans antialiased">
        <Header />
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-secondary-dark text-white mt-24">
          {/* Top wave */}
          <div className="overflow-hidden -mb-px">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
              <path
                d="M0 60L80 48C160 36 320 12 480 6C640 0 800 12 960 18C1120 24 1280 24 1360 24L1440 24V60H1360C1280 60 1120 60 960 60C800 60 640 60 480 60C320 60 160 60 80 60H0Z"
                fill="#FDF8F3"
              />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Brand column */}
              <div className="md:col-span-5">
                <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                  <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
                    </svg>
                  </div>
                  <span className="font-serif text-xl font-bold text-white group-hover:text-primary transition-colors">
                    Mediterranean Rentals
                  </span>
                </Link>
                <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                  Handpicked holiday homes in Cyprus and Spain. Book directly
                  with the host - better prices, personal service, no platform fees.
                </p>
                {/* WhatsApp CTA */}
                <a
                  href="https://wa.me/420731139854"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-400 text-sm px-4 py-2 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

              {/* Destinations */}
              <div className="md:col-span-3">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                  Destinations
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link href="/paphos" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary/60" />
                      Cyprus - Paphos
                    </Link>
                  </li>
                  <li>
                    <Link href="/tenerife" className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary/60" />
                      Spain - Tenerife
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="md:col-span-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
                  Contact
                </h4>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="https://wa.me/420731139854"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      +420 731 139 854
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:giorgos.koutoulo@gmail.com"
                      className="text-sm text-gray-300 hover:text-primary transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      giorgos.koutoulo@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} Mediterranean Rentals. All rights reserved.
              </p>
              <p className="flex items-center gap-1.5">
                <span>Made with</span>
                <svg className="w-3.5 h-3.5 text-primary fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>for the Mediterranean</span>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
