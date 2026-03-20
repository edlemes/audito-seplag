import { LayoutDashboard, FileText, Download, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const actions = [
  { icon: LayoutDashboard, title: "Portal do Gestor", desc: "Painel administrativo e relatórios", to: "/admin" },
  { icon: FileText, title: "Normativas", desc: "Regulamentos e orientações de uso", to: "/orientacoes" },
  { icon: Download, title: "Documentos Úteis", desc: "Termos, formulários e modelos", to: "/agendamento" },
  { icon: HelpCircle, title: "Dúvidas Frequentes", desc: "Perguntas e respostas sobre o auditório", to: "/orientacoes" },
];

const QuickActions = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ icon: Icon, title, desc, to }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to={to}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default QuickActions;
