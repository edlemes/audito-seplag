import { Building2, Menu, LogIn, Accessibility, Plus, Minus, Eye, Type, Underline, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const location = useLocation();
  const { user, isAdmin, isReadonly } = useAuth();

  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);

  useEffect(() => {
    supabase
      .from("cms_content")
      .select("imagem_url")
      .eq("tipo", "logo")
      .eq("ativo", true)
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]) setLogoUrl(data[0].imagem_url);
      });
  }, []);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const changeFontSize = (delta: number) => {
    const next = Math.max(80, Math.min(150, fontSize + delta));
    setFontSize(next);
    document.documentElement.style.fontSize = `${next}%`;
  };

  const toggleContrast = () => {
    setHighContrast((prev) => !prev);
    document.documentElement.classList.toggle("high-contrast");
  };

  const toggleUnderlineLinks = () => {
    setUnderlineLinks((prev) => !prev);
    document.documentElement.classList.toggle("underline-links");
  };

  const resetAll = () => {
    setFontSize(100);
    document.documentElement.style.fontSize = "100%";
    if (highContrast) {
      setHighContrast(false);
      document.documentElement.classList.remove("high-contrast");
    }
    if (underlineLinks) {
      setUnderlineLinks(false);
      document.documentElement.classList.remove("underline-links");
    }
  };

  const navItems = [
    { label: "Início", path: "/" },
    { label: "Agendamento", path: "/agendamento" },
    { label: "Inscrições", path: "/inscricao" },
    { label: "Orientações", path: "/orientacoes" },
    { label: "Avaliação", path: "/avaliacao" },
    { label: "Dúvidas (FAQ)", path: "/faq" },
  ];

  const hasChanges = fontSize !== 100 || highContrast || underlineLinks;

  const AccessibilityMenu = () => (
    <div className="space-y-4">
      <p className="text-xs font-bold uppercase tracking-wider text-foreground">
        Acessibilidade
      </p>
      <div className="space-y-1.5">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Type className="h-3.5 w-3.5" /> Tamanho da fonte
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeFontSize(-10)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Diminuir fonte"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[3ch] text-center text-sm font-semibold text-foreground">
            {fontSize}%
          </span>
          <button
            onClick={() => changeFontSize(10)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Aumentar fonte"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <button
        onClick={toggleContrast}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          highContrast
            ? "bg-foreground text-background"
            : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
        aria-pressed={highContrast}
      >
        <Eye className="h-4 w-4" />
        Alto Contraste
      </button>
      <button
        onClick={toggleUnderlineLinks}
        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          underlineLinks
            ? "bg-foreground text-background"
            : "bg-muted text-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
        aria-pressed={underlineLinks}
      >
        <Underline className="h-4 w-4" />
        Sublinhar Links
      </button>
      {hasChanges && (
        <button
          onClick={resetAll}
          className="text-xs text-muted-foreground underline transition hover:text-foreground"
        >
          Restaurar padrão
        </button>
      )}
    </div>
  );

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg"
      >
        Pular para o conteúdo
      </a>

      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-primary-dark/80 shadow-xl backdrop-blur-xl"
            : "seplag-gradient shadow-lg"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo SEPLAG Mato Grosso" className="h-10 w-10 rounded-lg object-contain" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-6 w-6 text-secondary-foreground" />
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold leading-tight text-primary-foreground">
                Auditório Antônio Mendes
              </h1>
              <p className="text-xs font-light text-primary-foreground/70">
                SEPLAG — Mato Grosso
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 md:flex">
            <nav className="flex items-center gap-1" aria-label="Navegação principal">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-secondary transition-all duration-300 ${
                        isActive ? "w-3/4" : "w-0 group-hover:w-3/4"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-primary-foreground/70 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  aria-label="Menu de acessibilidade"
                >
                  <Accessibility className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <AccessibilityMenu />
              </PopoverContent>
            </Popover>

            {/* Admin button or Login */}
            {user && (isAdmin || isReadonly) ? (
              <Link
                to="/admin"
                className="ml-2 flex items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground shadow-sm transition hover:bg-secondary/90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <ShieldCheck className="h-4 w-4" />
                Painel Admin
              </Link>
            ) : !user ? (
              <Link
                to="/login"
                className="ml-2 flex items-center gap-1.5 rounded-md border border-primary-foreground/30 px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:border-primary-foreground/60 hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              >
                <LogIn className="h-4 w-4" /> Entrar
              </Link>
            ) : null}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-md text-primary-foreground transition hover:bg-primary-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                  aria-label="Menu de acessibilidade"
                >
                  <Accessibility className="h-5 w-5" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64">
                <AccessibilityMenu />
              </PopoverContent>
            </Popover>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-md text-primary-foreground transition hover:bg-primary-foreground/10" aria-label="Abrir menu">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 seplag-gradient border-primary-light/20">
                <nav className="mt-8 flex flex-col gap-1" aria-label="Navegação principal">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? "bg-primary-foreground/15 text-primary-foreground"
                          : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {user && (isAdmin || isReadonly) ? (
                    <Link
                      to="/admin"
                      className="mt-4 flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/90"
                    >
                      <ShieldCheck className="h-4 w-4" /> Painel Admin
                    </Link>
                  ) : !user ? (
                    <Link
                      to="/login"
                      className="mt-4 flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-4 py-3 text-sm font-medium text-primary-foreground/70 transition hover:bg-primary-foreground/10"
                    >
                      <LogIn className="h-4 w-4" /> Entrar
                    </Link>
                  ) : null}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
