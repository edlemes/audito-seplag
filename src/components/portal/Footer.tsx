import { useEffect, useState } from "react";
import { Phone, MapPin, Mail, Globe, SunMoon, AArrowUp, AArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("cms_content")
      .select("imagem_url")
      .eq("tipo", "logo_footer")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setLogoUrl(data[0].imagem_url);
      });
  }, []);

  const quickLinks = [
    { label: "Início", to: "/" },
    { label: "Agendamento", to: "/agendamento" },
    { label: "Orientações", to: "/orientacoes" },
    { label: "Avaliação", to: "/avaliacao" },
  ];

  return (
    <footer className="mt-auto border-t border-primary-light/20 bg-[hsl(212,100%,16%)]">
      {/* Google Maps */}
      <div className="group relative h-64 w-full overflow-hidden">
        <iframe
          title="Localização SEPLAG-MT"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3843.4685571388063!2d-56.07931090321045!3d-15.566594899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x939db103442be443%3A0x41835cd9e6d299d7!2sSecretaria%20de%20Estado%20de%20Planejamento%20e%20Gest%C3%A3o%20-%20SEPLAG-MT!5e0!3m2!1spt-BR!2sbr!4v1774029615677!5m2!1spt-BR!2sbr"
          className="h-full w-full border-0 grayscale transition-all duration-500 group-hover:grayscale-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* 3-column content */}
      <div className="container mx-auto grid gap-8 px-6 py-8 md:grid-cols-3">
        {/* Col 1 — Identity */}
        <div className="flex flex-col gap-3">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo SEPLAG"
              className="h-10 w-auto shrink-0 self-start object-contain"
              loading="lazy"
            />
          )}
          <p className="text-sm font-bold leading-tight tracking-wide text-white">
            Governo de Mato Grosso{" "}
            <span className="font-normal text-white/50">|</span>{" "}
            <span className="font-semibold">SEPLAG</span>
          </p>
          <p className="max-w-xs text-xs leading-relaxed text-white/50">
            Secretaria de Estado de Planejamento e Gestão, promovendo eficiência e transparência na gestão pública.
          </p>
        </div>

        {/* Col 2 — Quick Links */}
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
            Links Rápidos
          </p>
          <nav className="flex flex-col gap-1.5" aria-label="Links do rodapé">
            {quickLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-white/60 transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Col 3 — Contact + Accessibility */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-white/40">
              Contato
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="flex items-center gap-2 text-xs text-white/60">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/40" />
                Av. Hist. Rubens de Mendonça, s/n – CPA, Cuiabá-MT
              </p>
              <p className="flex items-center gap-2 text-xs text-white/60">
                <Phone className="h-3.5 w-3.5 shrink-0 text-white/40" />
                (65) 3613-3300
              </p>
              <a
                href="https://www.seplag.mt.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-white/60 transition hover:text-white"
              >
                <Globe className="h-3.5 w-3.5 shrink-0 text-white/40" />
                www.seplag.mt.gov.br
              </a>
            </div>
          </div>

          {/* Mini accessibility */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const root = document.documentElement;
                const current = parseFloat(root.style.fontSize || "100");
                root.style.fontSize = Math.min(current + 10, 150) + "%";
              }}
              className="rounded p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Aumentar fonte"
              title="Aumentar fonte"
            >
              <AArrowUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const root = document.documentElement;
                const current = parseFloat(root.style.fontSize || "100");
                root.style.fontSize = Math.max(current - 10, 80) + "%";
              }}
              className="rounded p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Diminuir fonte"
              title="Diminuir fonte"
            >
              <AArrowDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => document.documentElement.classList.toggle("high-contrast")}
              className="rounded p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Alternar alto contraste"
              title="Alto contraste"
            >
              <SunMoon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-3 text-center">
        <p className="text-[11px] text-white/30">
          © {new Date().getFullYear()} SEPLAG – Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
