import { useEffect, useState, useCallback } from "react";
import { Phone, MapPin, SunMoon, AArrowUp, AArrowDown } from "lucide-react";
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

  return (
    <footer className="mt-auto border-t border-primary-light/20 bg-[hsl(212,100%,16%)]">
      {/* Mapa Google Maps */}
      <div className="group relative h-64 w-full overflow-hidden">
        <iframe
          title="Localização SEPLAG-MT"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3843.1234!2d-56.0968!3d-15.5989!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x939db1b5a0b0b0b1%3A0x1234567890abcdef!2sSEPLAG-MT!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
          className="h-full w-full border-0 grayscale transition-all duration-500 group-hover:grayscale-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="container mx-auto flex flex-col items-center gap-4 px-6 py-5 md:flex-row md:justify-between">
        {/* Left — logo + identity */}
        <div className="flex items-center gap-4">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo SEPLAG"
              className="h-10 w-auto shrink-0 object-contain"
              loading="lazy"
            />
          )}
          <div className="text-white">
            <p className="text-sm font-bold leading-tight tracking-wide">
              Governo de Mato Grosso{" "}
              <span className="font-normal text-white/60">|</span>{" "}
              <span className="font-semibold">SEPLAG</span>
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/60">
              <MapPin className="h-3 w-3 shrink-0" />
              Av. Hist. Rubens de Mendonça, s/n – CPA, Cuiabá-MT
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/60">
              <Phone className="h-3 w-3 shrink-0" />
              (65) 3613-3300
            </p>
          </div>
        </div>

        {/* Right — accessibility + copyright */}
        <div className="flex flex-col items-center gap-2 md:items-end">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                const root = document.documentElement;
                const current = parseFloat(root.style.fontSize || "100");
                root.style.fontSize = Math.min(current + 10, 150) + "%";
              }}
              className="rounded p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
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
              className="rounded p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Diminuir fonte"
              title="Diminuir fonte"
            >
              <AArrowDown className="h-4 w-4" />
            </button>
            <button
              onClick={() => document.documentElement.classList.toggle("high-contrast")}
              className="rounded p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              aria-label="Alternar alto contraste"
              title="Alto contraste"
            >
              <SunMoon className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[11px] text-white/40">
            © {new Date().getFullYear()} SEPLAG – Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
