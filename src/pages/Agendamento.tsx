import { useState } from "react";
import { ChevronLeft, ChevronRight, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import FormSolicitante from "@/components/portal/FormSolicitante";
import FormEvento from "@/components/portal/FormEvento";
import FormDocumentacao from "@/components/portal/FormDocumentacao";
import type { DadosSolicitante, DadosEvento } from "@/types/agendamento";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const steps = ["Solicitante", "Evento", "Documentação"];

const Agendamento = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [solicitante, setSolicitante] = useState<DadosSolicitante>({
    nome: "", cpf: "", email: "", telefone: "", orgao: "",
  });

  const [evento, setEvento] = useState<DadosEvento>({
    titulo: "", descricao: "", data: "", horarioInicio: "", horarioFim: "",
    numParticipantes: 0, secretariaAtendida: "",
  });

  const [termoAssinado, setTermoAssinado] = useState<File | null>(null);

  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!solicitante.nome || !solicitante.cpf || !solicitante.email) {
      toast.error("Preencha todos os dados do solicitante.");
      setStep(0);
      return;
    }
    if (!evento.titulo || !evento.data || !evento.secretariaAtendida) {
      toast.error("Preencha todos os dados do evento.");
      setStep(1);
      return;
    }

    const { error } = await supabase.from("solicitacoes_auditorio").insert({
      user_id: user?.id || null,
      nome_solicitante: solicitante.nome,
      cpf: solicitante.cpf,
      email: solicitante.email,
      telefone: solicitante.telefone,
      orgao: solicitante.orgao,
      titulo_evento: evento.titulo,
      descricao_evento: evento.descricao,
      data_evento: evento.data,
      horario_inicio: evento.horarioInicio,
      horario_fim: evento.horarioFim,
      num_participantes: evento.numParticipantes,
      secretaria_atendida: evento.secretariaAtendida,
    });

    if (error) {
      console.error(error);
      toast.error("Erro ao enviar solicitação. Faça login primeiro.");
      return;
    }
    setSubmitted(true);
    toast.success("Solicitação enviada com sucesso!");
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-success" />
          <h2 className="text-2xl font-bold text-foreground">Solicitação Enviada!</h2>
          <p className="max-w-md text-muted-foreground">
            Sua solicitação de agendamento foi registrada. Você receberá a confirmação por e-mail em até 48 horas úteis.
          </p>
          <Button onClick={() => { setSubmitted(false); setStep(0); }} variant="outline">
            Nova Solicitação
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="flex-1 py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Solicitar Agendamento</h1>
          <p className="mb-8 text-muted-foreground">Preencha as etapas abaixo para solicitar o uso do auditório.</p>

          {/* Stepper */}
          <div className="mb-8 flex items-center justify-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </button>
                <span className={`hidden text-sm sm:inline ${i === step ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  {label}
                </span>
                {i < steps.length - 1 && <div className="mx-2 h-px w-8 bg-border" />}
              </div>
            ))}
          </div>

          {/* Form content */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            {step === 0 && <FormSolicitante data={solicitante} onChange={setSolicitante} />}
            {step === 1 && <FormEvento data={evento} onChange={setEvento} />}
            {step === 2 && <FormDocumentacao file={termoAssinado} onFileChange={setTermoAssinado} />}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex justify-between">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)} className="gap-1">
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="gap-1">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="gap-1">
                <Send className="h-4 w-4" /> Enviar Solicitação
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Agendamento;
