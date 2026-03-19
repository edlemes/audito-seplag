import { Building2, Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, isReadonly } = useAuth();

  const navItems = [
    { label: "Início", path: "/" },
    { label: "Agendamento", path: "/agendamento" },
    { label: "Orientações", path: "/orientacoes" },
    { label: "Avaliação", path: "/avaliacao" },
    ...(isAdmin || isReadonly ? [{ label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <header className="seplag-gradient sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <Building2 className="h-6 w-6 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-primary-foreground">
              Portal do Auditório
            </h1>
            <p className="text-xs font-light text-primary-foreground/70">
              SEPLAG — Mato Grosso
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {!user && (
            <Link to="/login" className="ml-2 flex items-center gap-1 rounded-md bg-primary-foreground/10 px-3 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/20">
              <LogIn className="h-4 w-4" /> Entrar
            </Link>
          )}
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-primary-foreground md:hidden">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-primary-foreground/10 px-4 pb-4 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {!user && (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-2 block rounded-md px-4 py-2.5 text-sm font-medium text-primary-foreground/70 hover:bg-primary-foreground/10">
              <LogIn className="mr-1 inline h-4 w-4" /> Entrar
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
