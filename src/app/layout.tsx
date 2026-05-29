import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mediterranean Rentals — Cyprus & Tenerife",
  description:
    "Beautiful vacation rentals in Paphos, Cyprus and Tenerife, Spain. Book directly with the host for the best rates.",
  keywords:
    "vacation rental, Cyprus, Paphos, Tenerife, Spain, holiday apartment, pool, beach",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-cream font-sans antialiased">
        <Header />
        <main>{children}</main>
        <footer className="bg-secondary text-white py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  Mediterranean Rentals
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Beautiful holiday properties in Cyprus and Spain. Book
                  directly with the host for a personal and memorable
                  experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  Destinations
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <Link
                      href="/paphos"
                      className="hover:text-primary transition-colors"
                    >
                      Cyprus — Paphos
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/tenerife"
                      className="hover:text-primary transition-colors"
                    >
                      Spain — Tenerife
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-primary">
                  Contact
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>
                    <a
                      href="https://wa.me/420731139854"
                      className="hover:text-primary transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp: +420 731 139 854
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:giorgos.koutoulo@gmail.com"
                      className="hover:text-primary transition-colors"
                    >
                      giorgos.koutoulo@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-secondary-dark mt-8 pt-6 text-center text-sm text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Mediterranean Rentals. All
                rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
