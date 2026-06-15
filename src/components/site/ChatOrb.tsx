import { useState } from "react";

export function ChatOrb() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Contact SNPC Clinic"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition-all hover:bg-blue-800 hover:shadow-xl"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-blue-700 px-4 py-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-white">SNPC Clinic Reception</div>
              <div className="flex items-center gap-1 text-[11px] text-blue-200">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Available during clinic hours
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto text-blue-200 hover:text-white"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="space-y-3 p-4 text-sm">
            <div className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700 text-sm leading-relaxed">
              👋 Hello! Welcome to SNPC Clinic. How can we help you today?
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["Book an Appointment", "Find a Doctor", "Skin Consultation", "Pharmacy Enquiry"].map((q) => (
                <a
                  key={q}
                  href="#book"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-center text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  {q}
                </a>
              ))}
            </div>
            <a
              href="tel:+918921564251"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81 19.79 19.79 0 01.03 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.96a16 16 0 006.69 6.69l1.35-1.35a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Call Us: +91 89215 64251
            </a>
          </div>
        </div>
      )}
    </>
  );
}
