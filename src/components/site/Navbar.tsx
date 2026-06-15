import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { href: "/departments", label: "Departments" },
  { href: "/doctors", label: "Specialists" },
  { href: "/radiance", label: "Skin & Hair" },
  { href: "/pharmacy", label: "Pharmacy" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm" 
          : "bg-white/50 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 transition-all duration-500">
        {/* Logo */}
        <Link to="/" aria-label="SNPC Clinic home">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              className="relative text-sm font-semibold tracking-wide text-slate-600 transition-colors hover:text-blue-700 [&.active]:text-blue-700 
                after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-right after:scale-x-0 after:bg-blue-700 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100 [&.active]:after:scale-x-100 [&.active]:after:origin-left"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+918921564251"
            className="hidden text-xs font-medium text-slate-500 transition-colors hover:text-blue-700 md:inline-flex items-center gap-1"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.96a16 16 0 006.69 6.69l1.35-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +91 89215 64251
          </a>
          <Link
            to="/book"
            className="rounded-full bg-blue-700 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Appointment
          </Link>
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-slate-600"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-6 pb-4 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-slate-600 hover:text-blue-700 [&.active]:text-blue-700"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
