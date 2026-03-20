import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Como solicitar o agendamento do auditório?",
    answer:
      "Acesse a página de Agendamento, preencha o formulário com seus dados pessoais e as informações do evento. Após o envio, a equipe da SEPLAG analisará sua solicitação e responderá em até 48 horas úteis.",
  },
  {
    question: "Qual a capacidade máxima do Auditório Antônio Mendes?",
    answer:
      "O Auditório Antônio Mendes comporta até 200 participantes sentados confortavelmente, com acessibilidade para pessoas com mobilidade reduzida.",
  },
  {
    question: "Quais equipamentos estão disponíveis?",
    answer:
      "O espaço conta com sistema de som profissional, microfones sem fio, projetor HD com tela de projeção, ar-condicionado central, iluminação ajustável e rede Wi-Fi dedicada.",
  },
  {
    question: "Preciso assinar algum documento?",
    answer:
      "Sim. Após a aprovação, é necessário baixar e assinar o Termo de Responsabilidade (Anexo II) e enviá-lo via SigDoc. O sistema gera o termo automaticamente com os dados do seu agendamento.",
  },
  {
    question: "É possível agendar nos finais de semana ou feriados?",
    answer:
      "O auditório funciona em dias úteis. Datas de feriados nacionais e estaduais (Mato Grosso) são bloqueadas automaticamente no calendário. Casos excepcionais podem ser avaliados pela administração.",
  },
  {
    question: "Como acompanho o status da minha solicitação?",
    answer:
      "Após o envio, você receberá atualizações por e-mail sempre que o status da sua solicitação mudar (aprovada, recusada ou cancelada). Também é possível consultar pelo painel se estiver logado.",
  },
  {
    question: "Posso cancelar um agendamento já aprovado?",
    answer:
      "Sim. Entre em contato com a administração pelo telefone (65) 3613-3300 ou pelo WhatsApp disponível no site com antecedência mínima de 48 horas.",
  },
  {
    question: "Quem pode solicitar o uso do auditório?",
    answer:
      "Servidores públicos estaduais e representantes de órgãos vinculados ao Governo do Estado de Mato Grosso podem solicitar o espaço para eventos institucionais, capacitações e reuniões.",
  },
];

const reveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const FAQ = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main id="main-content" className="flex-1">
      <motion.section
        className="py-16"
        variants={reveal}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-center text-3xl font-bold text-foreground">
            Dúvidas Frequentes
          </h1>
          <p className="mb-10 text-center text-muted-foreground">
            Encontre respostas rápidas sobre o uso do auditório da SEPLAG
          </p>

          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <AccordionItem
                  value={`item-${i}`}
                  className="rounded-xl border border-border/60 bg-card px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-left text-[15px] font-semibold hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </motion.section>
    </main>
    <Footer />
  </div>
);

export default FAQ;
