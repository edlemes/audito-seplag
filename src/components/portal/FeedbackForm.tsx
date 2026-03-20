import { useState } from "react";
import { Send, Sofa, Wifi, HeadphonesIcon, TrendingUp, CheckCircle2, ChevronRight, ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import type { AvaliacaoFeedback } from "@/types/agendamento";
import { RECURSOS_AUDITORIO } from "@/types/agendamento";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SentimentScale from "./feedback/SentimentScale";
import NpsScale from "./feedback/NpsScale";

const initialData: AvaliacaoFeedback = {
  notaGeral: 0,
  notaInfraestrutura: 0,
  notaAtendimento: 0,
  notaEquipamentos: 0,
  notaLogistica: 0,
  notaTecnologia: 0,
  notaConforto: 0,
  suporteTecnico: null,
  notaTemperatura: 0,
  npsScore: 0,
  comentario: "",
  sugestao: "",
  sugestaoRecurso: "",
  recursosUtilizados: [],
  falhaTecnica: false,
  descricaoFalha: "",
};

const sections = [
  { id: 0, title: "Infraestrutura", icon: Sofa, desc: "Avalie poltronas, climatização e limpeza do ambiente." },
  { id: 1, title: "Recursos Técnicos", icon: Wifi, desc: "Avalie sonorização, projeção e conectividade." },
  { id: 2, title: "Apoio e Logística", icon: HeadphonesIcon, desc: "Avalie o agendamento e o suporte da equipe." },
  { id: 3, title: "Impacto e Recomendação", icon: TrendingUp, desc: "Compartilhe sua impressão geral." },
];

const FeedbackForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AvaliacaoFeedback>(initialData);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const progress = ((step + 1) / sections.length) * 100;

  const set = (field: keyof AvaliacaoFeedback, value: any) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const toggleRecurso = (recurso: string) => {
    setData((prev) => ({
      ...prev,
      recursosUtilizados: prev.recursosUtilizados.includes(recurso)
        ? prev.recursosUtilizados.filter((r) => r !== recurso)
        : [...prev.recursosUtilizados, recurso],
    }));
  };

  const canAdvance = () => {
    if (step === 0) return data.notaConforto > 0 && data.notaTemperatura > 0;
    if (step === 1) return data.notaTecnologia > 0 && data.notaEquipamentos > 0;
    if (step === 2) return data.notaLogistica > 0 && data.notaAtendimento > 0;
    return data.notaGeral > 0 && data.npsScore > 0;
  };

  const handleSubmit = async () => {
    if (!canAdvance()) {
      toast.error("Preencha todos os campos obrigatórios desta seção.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("feedback_usuario").insert({
      user_id: user?.id || null,
      nota_geral: data.notaGeral,
      nota_infraestrutura: data.notaInfraestrutura || null,
      nota_atendimento: data.notaAtendimento || null,
      nota_equipamentos: data.notaEquipamentos || null,
      nota_logistica: data.notaLogistica || null,
      nota_tecnologia: data.notaTecnologia || null,
      nota_conforto: data.notaConforto || null,
      suporte_tecnico: data.suporteTecnico,
      nota_temperatura: data.notaTemperatura || null,
      nps_score: data.npsScore || null,
      comentario: data.comentario || null,
      sugestao: data.sugestao || null,
      sugestao_recurso: data.sugestaoRecurso || null,
      recursos_utilizados: data.recursosUtilizados,
      falha_tecnica: data.falhaTecnica,
      descricao_falha: data.descricaoFalha || null,
    });
    setLoading(false);

    if (error) {
      console.error("[Feedback] Submission failed:", error?.code ?? "unknown");
      toast.error("Erro ao enviar avaliação. Faça login primeiro.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Avaliação enviada com sucesso!</h2>
        <p className="text-muted-foreground">
          Agradecemos pelo seu feedback. Sua opinião é fundamental para aprimorarmos
          o Auditório Antônio Mendes.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSubmitted(false);
            setStep(0);
            setData(initialData);
          }}
        >
          Enviar nova avaliação
        </Button>
      </motion.div>
    );
  }

  const RatingRow = ({ label, field }: { label: string; field: keyof AvaliacaoFeedback }) => (
    <div className="flex items-center justify-between gap-4">
      <Label className="text-sm font-medium">{label}</Label>
      <StarRating value={data[field] as number} onChange={(v) => set(field, v)} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Etapa {step + 1} de {sections.length}</span>
          <span>{Math.round(progress)}% concluído</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex gap-1">
          {sections.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => i <= step && setStep(i)}
              className={`flex-1 rounded-full py-0.5 text-[10px] font-medium transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                  ? "bg-primary/20 text-primary cursor-pointer"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="border-border/50 shadow-sm">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = sections[step].icon;
                  return (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-semibold text-foreground">{sections[step].title}</h3>
                  <p className="text-xs text-muted-foreground">{sections[step].desc}</p>
                </div>
              </div>

              {/* Step 0: Infraestrutura e Limpeza */}
              {step === 0 && (
                <div className="space-y-5">
                  <RatingRow label="Climatização e Conforto" field="notaConforto" />
                  <RatingRow label="Temperatura do Ambiente" field="notaTemperatura" />
                  <RatingRow label="Infraestrutura Geral" field="notaInfraestrutura" />
                  <div className="space-y-2">
                    <Label htmlFor="comentario">Observações sobre o ambiente</Label>
                    <Textarea
                      id="comentario"
                      rows={2}
                      placeholder="Poltronas, limpeza, acessibilidade..."
                      value={data.comentario}
                      onChange={(e) => set("comentario", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Recursos Técnicos */}
              {step === 1 && (
                <div className="space-y-5">
                  <RatingRow label="Sonorização e Projeção" field="notaTecnologia" />
                  <RatingRow label="Equipamentos em Geral" field="notaEquipamentos" />

                  <div className="space-y-3 pt-2">
                    <Label className="text-sm font-medium">Recursos utilizados no evento</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {RECURSOS_AUDITORIO.map((recurso) => (
                        <label
                          key={recurso}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 p-2.5 transition-colors hover:bg-muted/50 has-[data-state=checked]:border-primary/40 has-[data-state=checked]:bg-primary/5"
                        >
                          <Checkbox
                            checked={data.recursosUtilizados.includes(recurso)}
                            onCheckedChange={() => toggleRecurso(recurso)}
                          />
                          <span className="text-xs">{recurso}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-lg border border-amber-200/60 bg-amber-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <Label className="text-sm font-medium text-amber-800">
                        Houve alguma falha técnica durante o evento?
                      </Label>
                    </div>
                    <RadioGroup
                      value={data.falhaTecnica ? "sim" : "nao"}
                      onValueChange={(v) => {
                        set("falhaTecnica", v === "sim");
                        if (v === "nao") set("descricaoFalha", "");
                      }}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="sim" id="falha-sim" />
                        <Label htmlFor="falha-sim" className="cursor-pointer text-sm">Sim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nao" id="falha-nao" />
                        <Label htmlFor="falha-nao" className="cursor-pointer text-sm">Não</Label>
                      </div>
                    </RadioGroup>
                    {data.falhaTecnica && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="overflow-hidden"
                      >
                        <Textarea
                          rows={2}
                          placeholder="Descreva brevemente o que aconteceu..."
                          value={data.descricaoFalha}
                          onChange={(e) => set("descricaoFalha", e.target.value)}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Apoio e Logística */}
              {step === 2 && (
                <div className="space-y-5">
                  <RatingRow label="Facilidade de Agendamento" field="notaLogistica" />
                  <RatingRow label="Atendimento da Equipe" field="notaAtendimento" />
                  <div className="space-y-2 pt-2">
                    <Label className="text-sm font-medium">
                      O suporte técnico foi solicitado durante o evento?
                    </Label>
                    <RadioGroup
                      value={data.suporteTecnico === null ? "" : data.suporteTecnico ? "sim" : "nao"}
                      onValueChange={(v) => set("suporteTecnico", v === "sim")}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="sim" id="sup-sim" />
                        <Label htmlFor="sup-sim" className="cursor-pointer">Sim</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="nao" id="sup-nao" />
                        <Label htmlFor="sup-nao" className="cursor-pointer">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 3: Impacto e Recomendação */}
              {step === 3 && (
                <div className="space-y-6">
                  <RatingRow label="Satisfação Geral" field="notaGeral" />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      De 0 a 10, qual a probabilidade de recomendar o auditório? (NPS)
                    </Label>
                    <NpsScale value={data.npsScore} onChange={(v) => set("npsScore", v)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sugestao">Sugestões de melhoria e elogios</Label>
                    <Textarea
                      id="sugestao"
                      rows={2}
                      placeholder="O que podemos melhorar?"
                      value={data.sugestao}
                      onChange={(e) => set("sugestao", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sugestaoRecurso">
                      Algum recurso tecnológico ou melhoria física essencial para futuros eventos?
                    </Label>
                    <Textarea
                      id="sugestaoRecurso"
                      rows={2}
                      placeholder="Descreva recursos ou melhorias desejadas..."
                      value={data.sugestaoRecurso}
                      onChange={(e) => set("sugestaoRecurso", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        {step < sections.length - 1 ? (
          <Button
            type="button"
            onClick={() =>
              canAdvance()
                ? setStep((s) => s + 1)
                : toast.error("Preencha os campos obrigatórios.")
            }
            className="gap-1"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !canAdvance()}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
