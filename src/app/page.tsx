import Link from "next/link";
import { getPropertiesByRegion, properties } from "@/data/properties";
import { fetchPropertyRates } from "@/lib/rates";
import AnimateOnScroll from "@/components/AnimateOnScroll";

function regionMinPrice(rates: (Awaited<ReturnType<typeof fetchPropertyRates>> | null)[]): number | null {
  const allOpen = rates.flatMap((r) =>
    r?.openRatesByDate ? Object.values(r.openRatesByDate) : []
  );
  return allOpen.length > 0 ? Math.min(...allOpen) : null;
}

export default async function HomePage() {
  const paphosProps = getPropertiesByRegion("paphos");
  const tenerifeProps = getPropertiesByRegion("tenerife");

  // Fetch all property rates in parallel, then compute per-region minimums
  const allRates = await Promise.all(
    properties.map((p) => fetchPropertyRates(p.btPropertyId))
  );
  const paphosRates = allRates.slice(0, paphosProps.length);
  const tenerifeRates = allRates.slice(paphosProps.length);

  const paphosMin = regionMinPrice(paphosRates) ?? Math.min(...paphosProps.map((p) => p.pricePerNight));
  const tenerifeMin = regionMinPrice(tenerifeRates) ?? Math.min(...tenerifeProps.map((p) => p.pricePerNight));

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1a3d38 0%, #2C5F5A 40%, #4a8a84 70%, #E8845A 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/15 -translate-y-1/3 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-secondary-light/20 translate-y-1/3 -translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.03] blur-2xl pointer-events-none" />

        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 text-center px-5 sm:px-8 max-w-5xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm px-5 py-2 rounded-full mb-8 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            <span className="font-medium tracking-wide">Direct booking — best rates guaranteed</span>
          </div>

          {/* Main heading */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.08] mb-8 text-balance">
            Your Mediterranean
            <br />
            <em className="not-italic text-primary">Dream Holiday</em>
            <br />
            Awaits
          </h1>

          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Handpicked holiday homes on the sun-drenched shores of Cyprus and
            the volcanic beauty of Tenerife. Skip the platform fees — book
            directly with your host.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <Link
              href="/paphos"
              className="bg-primary hover:bg-primary-dark text-white px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-glow"
            >
              Explore Cyprus
            </Link>
            <Link
              href="/tenerife"
              className="bg-white/12 hover:bg-white/22 border border-white/30 backdrop-blur-sm text-white px-9 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105"
            >
              Explore Tenerife
            </Link>
          </div>

          {/* Inline stats */}
          <div className="flex items-center justify-center gap-10 sm:gap-16">
            <div className="text-center">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-white">5</p>
              <p className="text-white/55 text-xs sm:text-sm tracking-widest uppercase mt-1">Properties</p>
            </div>
            <div className="w-px h-12 bg-white/15" />
            <div className="text-center">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-white">2</p>
              <p className="text-white/55 text-xs sm:text-sm tracking-widest uppercase mt-1">Destinations</p>
            </div>
            <div className="w-px h-12 bg-white/15" />
            <div className="text-center">
              <p className="font-serif text-4xl sm:text-5xl font-bold text-primary">0%</p>
              <p className="text-white/55 text-xs sm:text-sm tracking-widest uppercase mt-1">Platform fees</p>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 100L80 85C160 70 320 40 480 30C640 20 800 30 960 38C1120 46 1280 50 1360 52L1440 54V100H1360C1280 100 1120 100 960 100C800 100 640 100 480 100C320 100 160 100 80 100H0Z"
              fill="#FDF8F3"
            />
          </svg>
        </div>
      </section>

      {/* ── DESTINATIONS ────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <AnimateOnScroll className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Where do you want to go?
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Destination
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
            Two stunning Mediterranean destinations, each with their own
            character and charm.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Cyprus card */}
          <AnimateOnScroll delay={0}>
            <Link
              href="/paphos"
              className="group block rounded-3xl overflow-hidden shadow-lg hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className="relative h-96 sm:h-[480px] overflow-hidden"
                style={{ background: "linear-gradient(145deg, #1a5a7a 0%, #2C7BA3 45%, #5a9dc0 70%, #E8845A 100%)" }}
              >
                {/* Pattern overlay */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 200" fill="none">
                    <ellipse cx="200" cy="200" rx="200" ry="80" fill="rgba(255,255,255,0.15)" />
                    <ellipse cx="100" cy="180" rx="120" ry="60" fill="rgba(255,255,255,0.1)" />
                  </svg>
                  <div className="absolute top-8 right-8 w-40 h-40 rounded-full border-2 border-white/30 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-16 right-16 w-24 h-24 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform duration-700 delay-75" />
                </div>

                {/* Overlay for text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/50" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {paphosProps.length} properties
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      From €{paphosMin}/night
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
                    Cyprus — Paphos
                  </h3>
                  <p className="text-white/80 text-base mb-5 leading-relaxed">
                    Ancient history, turquoise waters &amp; warm Mediterranean hospitality
                  </p>
                  <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Browse properties</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </AnimateOnScroll>

          {/* Tenerife card */}
          <AnimateOnScroll delay={120}>
            <Link
              href="/tenerife"
              className="group block rounded-3xl overflow-hidden shadow-lg hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div
                className="relative h-96 sm:h-[480px] overflow-hidden"
                style={{ background: "linear-gradient(145deg, #9e4a2a 0%, #c4623e 40%, #E8845A 70%, #2C5F5A 100%)" }}
              >
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-8 right-8 w-40 h-40 rounded-full border-2 border-white/30 group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-16 right-16 w-24 h-24 rounded-full border-2 border-white/20 group-hover:scale-110 transition-transform duration-700 delay-75" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 group-hover:from-black/50" />

                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      {tenerifeProps.length} properties
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                      From €{tenerifeMin}/night
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
                    Spain — Tenerife
                  </h3>
                  <p className="text-white/80 text-base mb-5 leading-relaxed">
                    Volcanic landscapes, eternal spring &amp; Atlantic coast living
                  </p>
                  <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                    <span>Browse properties</span>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section className="bg-secondary/5 border-y border-secondary/10 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Simple process
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900">
              Book in 3 Simple Steps
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden sm:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent pointer-events-none" />

            {[
              {
                num: "01",
                title: "Browse & Discover",
                desc: "Explore our handpicked properties in Cyprus and Tenerife. Each listing is personally vetted.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                num: "02",
                title: "Select Your Dates",
                desc: "Use our live availability calendar to find your ideal dates. See dynamic pricing in real time.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                num: "03",
                title: "Contact Your Host",
                desc: "Message the host directly via WhatsApp or email to confirm. No middlemen, no hidden fees.",
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
              },
            ].map((step, i) => (
              <AnimateOnScroll key={step.num} delay={i * 100}>
                <div className="flex flex-col items-center text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-md border border-cream-dark flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white group-hover:shadow-card-hover transition-all duration-300">
                      {step.icon}
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-primary text-white text-xs font-bold rounded-lg flex items-center justify-center shadow-sm">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY BOOK DIRECT ─────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <AnimateOnScroll>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              The direct booking advantage
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Why Pay More When You Don&apos;t Have To?
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Platforms like Airbnb charge up to 20% in fees — fees you pay,
              fees the host pays. Booking directly cuts them all out. Better
              prices, better service, better experience.
            </p>
            <a
              href="https://wa.me/420731139854"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-dark text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Talk to the host directly
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </AnimateOnScroll>

          {/* Right: feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Best Rates",
                desc: "No platform fees means lower prices — guaranteed.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Personal Service",
                desc: "Direct contact with the host for any request, any time.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Handpicked Quality",
                desc: "Every property personally verified by the host.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Flexible Terms",
                desc: "Long-stay discounts and flexible check-in times.",
              },
            ].map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 80}>
                <div className="bg-white rounded-2xl p-5 border border-cream-dark shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section className="bg-secondary/5 border-y border-secondary/10 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll className="text-center mb-14">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Guest experiences
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900">
              What Our Guests Say
            </h2>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah & Tom",
                location: "United Kingdom",
                property: "Luxe Poolside Escape, Cyprus",
                text: "Absolutely stunning apartment. The host was incredibly responsive and helpful with restaurant recommendations. Booking direct made it so much more personal.",
                rating: 5,
                initials: "ST",
              },
              {
                name: "Marco R.",
                location: "Germany",
                property: "Colorful 2-Bedroom House, Tenerife",
                text: "We saved almost €200 compared to booking on Airbnb! The view terrace was magical at sunrise. Will definitely return next year.",
                rating: 5,
                initials: "MR",
              },
              {
                name: "Elena V.",
                location: "Netherlands",
                property: "Poolside Central Studio, Cyprus",
                text: "Perfect studio for a couple getaway. The pool area is gorgeous and the location is unbeatable. The host arranged early check-in for us — you can't get that on Airbnb!",
                rating: 5,
                initials: "EV",
              },
            ].map((review, i) => (
              <AnimateOnScroll key={review.name} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 border border-cream-dark shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(review.rating)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-gold fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <blockquote className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
                    &ldquo;{review.text}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 pt-4 border-t border-cream-dark">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{review.initials}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                      <p className="text-xs text-gray-400">{review.location} · {review.property}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
        <AnimateOnScroll>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
            Let&apos;s get started
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-5">
            Ready for Your Dream Holiday?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Reach out directly to the host via WhatsApp or email. We&apos;re
            happy to help you find the perfect property and answer any questions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/420731139854"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp Us
            </a>
            <a
              href="mailto:giorgos.koutoulo@gmail.com?cc=katonarita90@gmail.com"
              className="flex items-center gap-2.5 bg-secondary hover:bg-secondary-dark text-white px-7 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send an Email
            </a>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}
