import Link from "next/link";
import { getPropertiesByRegion } from "@/data/properties";

export default function HomePage() {
  const paphosProps = getPropertiesByRegion("paphos");
  const tenerifeProps = getPropertiesByRegion("tenerife");

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #2C5F5A 0%, #1e4540 35%, #4a7a74 65%, #E8845A 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary/30 translate-y-1/2 -translate-x-1/2 blur-3xl" />

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#FDF8F3"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6">
            <span>🌊</span>
            <span>Direct booking — best rates guaranteed</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Mediterranean{" "}
            <span className="text-primary">Dream Holiday</span> Awaits
          </h1>

          <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Handpicked holiday homes in the sun-drenched shores of Cyprus and
            the volcanic beauty of Tenerife. Book directly with your host for a
            personal, memorable experience.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/paphos"
              className="bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:scale-105 shadow-lg"
            >
              Explore Cyprus
            </Link>
            <Link
              href="/tenerife"
              className="bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all hover:scale-105"
            >
              Explore Tenerife
            </Link>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-cream-dark">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-secondary">5</p>
            <p className="text-sm text-gray-500 mt-0.5">Properties</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">2</p>
            <p className="text-sm text-gray-500 mt-0.5">Destinations</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-secondary">100%</p>
            <p className="text-sm text-gray-500 mt-0.5">Direct booking</p>
          </div>
        </div>
      </section>

      {/* Region cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Choose Your Destination
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Two stunning Mediterranean destinations, each with their own
            character and charm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cyprus card */}
          <Link
            href="/paphos"
            className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div
              className="relative h-80 sm:h-96"
              style={{ background: "linear-gradient(135deg, #2C7BA3 0%, #1a5a7a 50%, #E8845A 100%)" }}
            >
              {/* Content overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-4 border-white" />
                <div className="absolute top-16 right-16 w-20 h-20 rounded-full border-4 border-white" />
                <div className="absolute bottom-12 left-12 w-24 h-24 rounded-full border-4 border-white opacity-50" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-5xl mb-3">🏛️</div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  Cyprus — Paphos
                </h3>
                <p className="text-white/85 text-base mb-4">
                  Ancient history, turquoise waters & warm hospitality
                </p>
                <div className="flex items-center gap-4">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm px-3 py-1 rounded-full">
                    {paphosProps.length} properties
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm px-3 py-1 rounded-full">
                    From €80/night
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-white font-semibold">
                  <span>Browse properties</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Tenerife card */}
          <Link
            href="/tenerife"
            className="group block rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          >
            <div
              className="relative h-80 sm:h-96"
              style={{ background: "linear-gradient(135deg, #E8845A 0%, #c4623e 50%, #2C5F5A 100%)" }}
            >
              {/* Content overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-8 right-8 w-32 h-32 rounded-full border-4 border-white" />
                <div className="absolute top-16 right-16 w-20 h-20 rounded-full border-4 border-white" />
                <div className="absolute bottom-12 left-12 w-24 h-24 rounded-full border-4 border-white opacity-50" />
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="text-5xl mb-3">🌋</div>
                <h3 className="text-3xl font-bold text-white mb-1">
                  Spain — Tenerife
                </h3>
                <p className="text-white/85 text-base mb-4">
                  Volcanic landscapes, eternal spring & Atlantic coast
                </p>
                <div className="flex items-center gap-4">
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm px-3 py-1 rounded-full">
                    {tenerifeProps.length} properties
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm px-3 py-1 rounded-full">
                    From €75/night
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 text-white font-semibold">
                  <span>Browse properties</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Why book direct */}
      <section className="bg-secondary/5 border-y border-secondary/10 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Why Book Direct?
            </h2>
            <p className="text-gray-500">
              Skip the middleman. Better for you, better for the host.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: "💰",
                title: "Best Rates",
                desc: "No platform fees means lower prices for you.",
              },
              {
                icon: "🤝",
                title: "Personal Service",
                desc: "Direct communication with the host for any needs.",
              },
              {
                icon: "🎁",
                title: "Flexible Terms",
                desc: "Long-stay discounts and flexible check-in times.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 text-center shadow-sm border border-cream-dark"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Have a Question?
        </h2>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          Reach out directly to the host via WhatsApp or email. We&apos;re
          happy to help you find the perfect property for your holiday.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://wa.me/420731139854"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp Us
          </a>
          <a
            href="mailto:giorgos.koutoulo@gmail.com?cc=katonarita90@gmail.com"
            className="flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-full font-semibold transition-colors shadow-md"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send an Email
          </a>
        </div>
      </section>
    </div>
  );
}
