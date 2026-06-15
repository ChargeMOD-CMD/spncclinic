export function Logo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/images/logo.png"
        alt="SPNC Clinic Logo"
        className="h-12 w-auto object-contain drop-shadow-sm"
      />
      <div className="flex flex-col leading-tight">
        <span
          className={`text-base font-extrabold tracking-wide ${
            dark ? "text-white" : "text-blue-800"
          }`}
          style={{ fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: "0.06em" }}
        >
          SPNC CLINIC
        </span>
        <span
          className={`text-[10px] font-medium tracking-widest uppercase ${
            dark ? "text-slate-400" : "text-slate-500"
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Health &amp; Wellness
        </span>
      </div>
    </div>
  );
}
