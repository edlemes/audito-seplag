import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import FeedbackForm from "@/components/portal/FeedbackForm";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck, Users, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: CalendarCheck, value: "100+", label: "Eventos realizados" },
  { icon: Users, value: "5.000+", label: "Participantes" },
  { icon: Star, value: "4.7", label: "Nota média" },
  { icon: Award, value: "98%", label: "Aprovação" },
];

const Avaliacao = () => (
  <div className="flex min-h-screen flex-col">
    <Header />

    {/* Hero */}
    <section className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary)/0.8)] py-12 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold leading-tight md:text-3xl"
        >
          Sua opinião constrói um serviço público melhor
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/80"
        >
          Ajude-nos a aprimorar o Auditório SEPLAG. Cada feedback é analisado pela equipe de gestão
          para garantir melhorias contínuas.
        </motion.p>
      </div>
    </section>

    {/* Stats */}
    <section className="border-b bg-card py-6">
      <div className="container mx-auto grid grid-cols-2 gap-4 px-4 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card className="border-border/40 shadow-none">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold leading-none text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Form */}
    <div className="flex-1 bg-background py-12">
      <div className="container mx-auto px-4">
        <FeedbackForm />
      </div>
    </div>

    <Footer />
  </div>
);

export default Avaliacao;
