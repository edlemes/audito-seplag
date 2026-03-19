import HeroCarousel from "@/components/portal/HeroCarousel";
import NoticiasSection from "@/components/portal/NoticiasSection";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { CalendarPlus, Mic2, Monitor, Users, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { icon: Monitor, title: "Projeção HD", desc: "Tela de projeção e equipamentos audiovisuais modernos" },
  { icon: Mic2, title: "Sonorização", desc: "Sistema de som profissional com microfones sem fio" },
  { icon: Users, title: "Capacidade", desc: "Espaço para até 200 participantes confortavelmente" },
  { icon: Shield, title: "Segurança", desc: "Controle de acesso e equipe de apoio dedicada" },
];

const Index = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main id="main-content">
      <HeroCarousel />

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
            Recursos do Auditório
          </h2>
          <p className="mb-10 text-center text-muted-foreground">
            Infraestrutura completa para seus eventos institucionais
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card group rounded-xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Últimos Eventos */}
      <NoticiasSection />

      {/* CTA */}
      <section className="seplag-gradient py-12">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Precisa do auditório para seu evento?
          </h2>
          <p className="text-primary-foreground/70">
            Solicite agora e receba a confirmação em até 48 horas úteis.
          </p>
          <Link
            to="/agendamento"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground shadow-lg transition hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <CalendarPlus className="h-5 w-5" />
            Solicitar Agendamento
          </Link>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default Index;
