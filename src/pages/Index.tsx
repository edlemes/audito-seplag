import { motion } from "framer-motion";
import HeroCarousel from "@/components/portal/HeroCarousel";
import CalendarioOcupacao from "@/components/portal/CalendarioOcupacao";
import NoticiasSection from "@/components/portal/NoticiasSection";
import GaleriaEventos from "@/components/portal/GaleriaEventos";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";

const reveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const Index = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main id="main-content">
      <HeroCarousel />

      {/* Calendário de Ocupação */}
      <motion.section
        className="bg-muted/50 py-16"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-4">
          <h2 className="mb-2 text-center text-3xl font-bold text-foreground">
            Consulte a Disponibilidade
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            Verifique as datas disponíveis antes de solicitar seu agendamento
          </p>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-lg">
            <CalendarioOcupacao isAdmin={false} />
          </div>
        </div>
      </motion.section>

      {/* Galeria de Eventos */}
      <GaleriaEventos />

      {/* Últimos Eventos */}
      <NoticiasSection />

      {/* CTA */}
      <motion.section
        className="seplag-gradient py-12"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
          <h2 className="text-2xl font-bold text-primary-foreground">
            Precisa do Auditório Antônio Mendes para seu evento?
          </h2>
          <p className="text-primary-foreground/70">
            Solicite agora e receba a confirmação em até 48 horas úteis.
          </p>
          <Link
            to="/agendamento"
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground shadow-lg transition hover:bg-secondary/90 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <CalendarPlus className="h-5 w-5" />
            Solicitar Agendamento
          </Link>
        </div>
      </motion.section>
    </main>

    <Footer />
  </div>
);

export default Index;
