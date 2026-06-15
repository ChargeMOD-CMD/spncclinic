import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="inline-block">
              <Logo dark />
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              SNPC Clinic &amp; Dr. Nimmy's Radiance Skin and Hair Clinic —
              Bringing together Wayanad’s leading specialists under one roof for
              advanced, trusted, and compassionate healthcare.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+918921564251"
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all hover:border-blue-500 hover:bg-slate-800 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.96a16 16 0 006.69 6.69l1.35-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Call Clinic
              </a>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                Book Now
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Services</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li><Link to="/departments" className="transition-colors hover:text-blue-400">All Departments</Link></li>
              <li><Link to="/doctors" className="transition-colors hover:text-blue-400">Our Specialists</Link></li>
              <li><Link to="/radiance" className="transition-colors hover:text-blue-400">Skin &amp; Hair Care</Link></li>
              <li><Link to="/pharmacy" className="transition-colors hover:text-blue-400">Pharmacy</Link></li>
            </ul>
          </div>

          {/* Visit */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Visit Us</h4>
            <div className="mt-5 space-y-3 text-sm text-slate-400 leading-relaxed">
              <p>
                <strong className="block text-slate-300">SNPC Clinic</strong>
                Sulthan Bathery<br />Wayanad, Kerala, India
              </p>
              <p className="pt-2">
                <span className="block text-xs uppercase tracking-widest text-slate-500">Hours</span>
                Mon – Sat · 10:30 AM – 7:30 PM
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-400">
              <li>
                <span className="block text-xs uppercase tracking-widest text-slate-500">Reception</span>
                <a href="tel:+918921564251" className="text-slate-300 transition hover:text-blue-400">+91 89215 64251</a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-widest text-slate-500">Emergency</span>
                <a href="tel:+919656513550" className="text-slate-300 transition hover:text-blue-400">+91 96565 13550</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60 bg-slate-950/50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SNPC Clinic. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="transition hover:text-slate-300">Terms of Service</a>
            <div className="ml-2 flex items-center gap-4">
              <a href="#" aria-label="Facebook" className="text-slate-400 transition hover:text-blue-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-slate-400 transition hover:text-pink-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://wa.me/918921564251" aria-label="WhatsApp" className="text-slate-400 transition hover:text-emerald-500" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
