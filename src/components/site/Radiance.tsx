import radianceImg from "@/assets/radiance-skin.jpg";

const treatments = [
  "Hair Analysis",
  "Skin Analysis",
  "Acne Treatment",
  "Hair Fall Treatment",
  "Pigmentation Care",
  "Anti-aging Solutions",
  "Skin Rejuvenation",
  "Cosmetic Dermatology",
];

export function Radiance() {
  return (
    <section id="radiance" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-[var(--radiance)]/30 to-[var(--skin-glow)]/20 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl glass-strong">
              <img
                src={radianceImg}
                alt="Microscopic radiant skin cell visualization with glowing particles"
                width={1280}
                height={960}
                loading="lazy"
                className="w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent p-6">
                <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--radiance)" }} />
                  Live skin scan · Radiance index 94%
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-xs uppercase tracking-[0.3em] text-radiance">
              Dr. Nimmy&apos;s Radiance Skin &amp; Hair Clinic
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Where modern dermatology meets{" "}
              <span className="text-radiance">radiant skin.</span>
            </h2>
            <p className="mt-5 text-muted-foreground">
              The visual centerpiece of our healthcare ecosystem — a luxury skin
              and hair clinic combining clinical precision with futuristic cosmetic
              dermatology. Personalised plans built around your skin&apos;s biology.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-2 text-sm">
              {treatments.map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-xl glass px-3 py-2.5">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--radiance)", boxShadow: "0 0 8px var(--radiance)" }} />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#book"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--primary-foreground)] shadow-radiance transition-transform hover:scale-[1.03]"
                style={{ background: "var(--gradient-radiance)" }}
              >
                Book Skin Consultation
              </a>
              <a
                href="#ai"
                className="rounded-full glass px-5 py-2.5 text-sm font-semibold transition-colors hover:text-radiance"
              >
                Get AI Skin Recommendation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
