import neuralImg from "@/assets/neural-sphere.jpg";

const features = [
  { title: "Skin Care Recommendation", desc: "Personalised skincare regimen from a smart assessment." },
  { title: "Health Awareness Assistant", desc: "Plain-language guidance on symptoms and care." },
  { title: "Department Finder", desc: "Routes your concern to the right specialist." },
  { title: "Appointment Guidance", desc: "Picks the best slot and doctor for your need." },
];

export function AIAssessment() {
  return (
    <section id="ai" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-[2rem] glass-strong p-8 md:p-14">
          <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
          <div
            className="absolute -right-32 top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full lg:block"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--neural) 40%, transparent), transparent 60%)",
              filter: "blur(20px)",
            }}
            aria-hidden
          />

          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-accent">AI Health Assessment</span>
              <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
                Meet{" "}
                <span className="text-gradient">SNPC AI</span> — your
                in-clinic health companion.
              </h2>
              <p className="mt-5 max-w-xl text-muted-foreground">
                An always-on holographic assistant trained on our specialities.
                Ask about symptoms, skin concerns, doctor availability or
                medicines — get clear, calm guidance instantly.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f.title} className="rounded-2xl glass p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <span className="grid h-6 w-6 place-items-center rounded-full" style={{ background: "color-mix(in oklab, var(--accent) 25%, transparent)" }}>
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="var(--accent)" strokeWidth="2.5"><path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                      {f.title}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <img
                  src={neuralImg}
                  alt="Glowing neural network sphere"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full rounded-full object-cover opacity-90"
                />
                <div className="absolute inset-0 rounded-full ring-1 ring-[var(--accent)]/30" />
                <div className="absolute -inset-4 animate-spin-slow rounded-full border border-dashed border-[var(--accent)]/30" />
                <div className="absolute -inset-10 animate-spin-slow rounded-full border border-[var(--radiance)]/15" style={{ animationDirection: "reverse" }} />

                {/* Chat bubble */}
                <div className="absolute -right-2 bottom-6 max-w-[80%] rounded-2xl glass-strong p-3 text-xs">
                  <div className="mb-1 text-[10px] uppercase tracking-wider text-accent">SNPC AI</div>
                  Based on your symptoms, I&apos;d recommend Dr. Sreejith Paul (Neurology). Shall I book Friday 11 AM?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
