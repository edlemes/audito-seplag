import { useEffect, useState } from "react";
import { ArrowUp, Phone, Globe, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);

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

  useEffect(() => {
    const handle = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <>
      <footer className="mt-auto bg-[hsl(212,100%,18%)]">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            {/* Left – address & contact */}
            <div className="space-y-2 text-sm text-white/90">
              <p className="text-base font-bold tracking-wide text-white">
                GOVERNO DO ESTADO DE MATO GROSSO
              </p>
              <p>Secretaria de Estado de Planejamento e Gestão – SEPLAG</p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                Av. Historiador Rubens de Mendonça, s/n – CPA, Cuiabá – MT, 78049-901
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-secondary" />
                (65) 3613-3300
              </p>
              <a
                href="https://www.seplag.mt.gov.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-secondary hover:underline"
              >
                <Globe className="h-4 w-4 shrink-0" />
                www.seplag.mt.gov.br
              </a>
            </div>

            {/* Right – logo from CMS */}
            {logoUrl && (
              <div className="flex items-center justify-center md:justify-end">
                <img
                  src={logoUrl}
                  alt="Logo SEPLAG"
                  className="h-20 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-4">
          <p className="text-center text-xs text-white/50">
            © {new Date().getFullYear()} SEPLAG – Governo do Estado de Mato Grosso. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-primary-light text-white shadow-lg transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Footer;
