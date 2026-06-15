import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-border py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            SNPC Clinic &amp; Dr. Nimmy&apos;s Radiance Skin and Hair Clinic —
            Advanced Care. Trusted Specialists. Radiant Health.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold">Visit</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            Sulthan Bathery<br />Wayanad, Kerala, India
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li><a href="tel:+918921564251" className="hover:text-foreground">+91 89215 64251</a></li>
            <li><a href="tel:+919656513550" className="hover:text-foreground">+91 96565 13550</a></li>
            <li>10:30 AM – 5:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} SNPC Clinic · Radiance NeuroVerse</span>
        <Link to="/admin/requests" className="hover:text-foreground">Staff Login</Link>
      </div>
    </footer>
  );
}
