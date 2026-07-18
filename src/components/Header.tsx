import { GraduationCap } from "lucide-react";

export function Header() {
  return (
    <header className="w-full bg-[#0a3d91] text-white shadow-md print:bg-[#0a3d91] print:text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/25">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] uppercase tracking-widest text-white/70">
              Governo Federal
            </p>
            <h1 className="text-base font-semibold sm:text-lg">
              Sistema Integrado de Educação
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <InstitutionalBadges />
          </div>
          <div className="border-l border-white/20 pl-4 text-right">
            <p className="text-[11px] uppercase tracking-widest text-white/70">
              Serviço
            </p>
            <p className="text-sm font-semibold sm:text-base">
              Consulta Pública de Certificados
            </p>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-[#009c3b] via-[#ffdf00] to-[#002776]" />
    </header>
  );
}

function InstitutionalBadges() {
  const badges = ["MEC", "FNDE", "CEBAS", "GOV.BR"];
  return (
    <div className="flex items-center gap-1.5">
      {badges.map((b) => (
        <span
          key={b}
          className="rounded border border-white/25 bg-white/5 px-2 py-1 text-[10px] font-semibold tracking-wide"
        >
          {b}
        </span>
      ))}
      <span
        aria-label="Bandeira do Brasil"
        title="Bandeira do Brasil"
        className="ml-1 inline-block h-4 w-6 rounded-sm bg-[#009c3b] ring-1 ring-white/30"
        style={{
          background:
            "linear-gradient(#009c3b,#009c3b) padding-box, radial-gradient(circle at center, #ffdf00 45%, #002776 46%) border-box",
        }}
      />
    </div>
  );
}
