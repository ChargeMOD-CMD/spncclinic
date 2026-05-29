import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const links = [
  { href: "#departments", label: "Departments" },
  { href: "#doctors", label: "Specialists" },
  { href: "#radiance", label: "Radiance Clinic" },
  { href: "#ai", label: "AI Assistant" },
  { href: "#pharmacy", label: "Pharmacy" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all ${
            scrolled ? "glass-strong" : "glass"
          }`}
        >
          <a href="#top" aria-label="SNPC Clinic home">
            <Logo />
          </a>
          <ul className="hidden items-center gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="tel:+918921564251"
              className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground md:inline"
            >
              +91 89215 64251
            </a>
            <a
              href="#book"
              className="rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--neural)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] shadow-glow transition-transform hover:scale-[1.03]"
            >
              Book Appointment
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
