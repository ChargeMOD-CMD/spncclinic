import radianceImg from "@/assets/radiance-skin.jpg";
import { MedicalFloatersBackground } from "./MedicalFloaters";

const treatments = [
  "Hair Analysis", "Skin Analysis",
  "Acne Treatment", "Hair Fall Treatment",
  "Pigmentation Care", "Anti-aging Solutions",
  "Skin Rejuvenation", "Cosmetic Dermatology",
];

export function Radiance() {
  return (
    <section id="radiance" className="relative py-20 md:py-28 bg-pink-50 overflow-hidden">
      <MedicalFloatersBackground />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <img
              src={radianceImg}
              alt="Dr. Nimmy's Radiance Skin and Hair Clinic"
              width={1280}
              height={960}
              loading="lazy"
              className="w-full rounded-2xl object-cover shadow-xl"
            />
            <div className="absolute -bottom-4 right-4 rounded-xl border border-pink-100 bg-white px-4 py-3 shadow-lg">
              <div className="text-xs font-semibold text-pink-700">Dr. Nimmy Thomas</div>
              <div className="text-xs text-slate-500 mt-0.5">MBBS, MD Dermatology</div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-pink-600">
              Radiance Skin &amp; Hair Clinic
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-slate-900 md:text-4xl">
              Expert Dermatology &amp; Cosmetic Skin Care
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Dr. Nimmy's Radiance Skin and Hair Clinic combines clinical precision with
              personalised dermatological care. Our treatments are evidence-based and
              tailored to your skin's unique biology.
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-2.5 text-sm">
              {treatments.map((t) => (
                <li key={t} className="flex items-center gap-2 rounded-lg border border-pink-100 bg-white px-3 py-2.5">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-pink-500" />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#book"
                className="rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-pink-700"
              >
                Book Skin Consultation
              </a>
              <a
                href="tel:+918921564251"
                className="rounded-lg border border-pink-200 bg-white px-5 py-2.5 text-sm font-semibold text-pink-700 shadow-sm transition-all hover:border-pink-400"
              >
                Call Clinic
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
