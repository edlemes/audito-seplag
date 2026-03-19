import { Building2 } from "lucide-react";

const Footer = () => (
  <footer className="seplag-gradient mt-auto">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary">
            <Building2 className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary-foreground">SEPLAG</p>
            <p className="text-xs text-primary-foreground/60">
              Secretaria de Estado de Planejamento e Gestão
            </p>
          </div>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Governo do Estado de Mato Grosso. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
