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

        {/* Right — copyright */}
        <p className="text-[11px] text-white/40">
          © {new Date().getFullYear()} SEPLAG – Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
