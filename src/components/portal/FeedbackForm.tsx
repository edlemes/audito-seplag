import { useState } from "react";
import { Star, Send, MessageSquareHeart, Headphones, Thermometer, TrendingUp, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AvaliacaoFeedback } from "@/types/agendamento";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

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
};

const StarRating = ({ value, onChange, size = "md" }: { value: number; onChange: (v: number) => void; size?: "sm" | "md" }) => {
  const [hover, setHover] = useState(0);
  const dim = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="rounded-sm p-0.5 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            className={`${dim} transition-colors duration-150 ${
              star <= (hover || value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const NpsScale = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>Nada provável</span>
      <span>Extremamente provável</span>
    </div>
    <div className="flex gap-1">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`flex-1 rounded-md py-2 text-xs font-medium transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            value === n
              ? n <= 6
                ? "bg-red-500 text-white shadow-md"
                : n <= 8
                ? "bg-amber-400 text-white shadow-md"
                : "bg-emerald-500 text-white shadow-md"
              : "bg-muted hover:bg-muted-foreground/10"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);

const sections = [
  { id: 0, title: "Experiência Logística", icon: TrendingUp },
  { id: 1, title: "Recursos Técnicos", icon: Headphones },
  { id: 2, title: "Ambiente e Conforto", icon: Thermometer },
  { id: 3, title: "Impacto e Recomendação", icon: MessageSquareHeart },
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

  const canAdvance = () => {
    if (step === 0) return data.notaGeral > 0 && data.notaLogistica > 0;
    if (step === 1) return data.notaTecnologia > 0 && data.notaEquipamentos > 0;
    if (step === 2) return data.notaConforto > 0 && data.notaTemperatura > 0;
    return data.npsScore > 0;
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto flex max-w-lg flex-col items-center gap-6 py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-foreground">Avaliação enviada com sucesso!</h2>
        <p className="text-muted-foreground">
          Agradecemos imensamente pelo seu feedback. Sua opinião é fundamental para aprimorarmos
          continuamente os serviços do Auditório Antônio Mendes.
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
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Etapa {step + 1} de {sections.length}</span>
          <span>{sections[step].title}</span>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <h3 className="font-semibold text-foreground">{sections[step].title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {step === 0 && "Avalie a facilidade de agendamento e a organização geral."}
                    {step === 1 && "Avalie a qualidade dos recursos tecnológicos disponíveis."}
                    {step === 2 && "Avalie o conforto e as condições do ambiente."}
                    {step === 3 && "Compartilhe sua impressão geral e recomendação."}
                  </p>
                </div>
              </div>

              {step === 0 && (
                <div className="space-y-5">
                  <RatingRow label="Experiência Geral" field="notaGeral" />
                  <RatingRow label="Facilidade de Agendamento" field="notaLogistica" />
                  <RatingRow label="Atendimento da Equipe" field="notaAtendimento" />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5">
                  <RatingRow label="Projeção e Sonorização" field="notaTecnologia" />
                  <RatingRow label="Equipamentos em Geral" field="notaEquipamentos" />
                  <RatingRow label="Infraestrutura (Rede/Wi-Fi)" field="notaInfraestrutura" />
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

              {step === 2 && (
                <div className="space-y-5">
                  <RatingRow label="Climatização e Conforto" field="notaConforto" />
                  <RatingRow label="Temperatura do Auditório" field="notaTemperatura" />
                  <div className="space-y-2">
                    <Label htmlFor="comentario">Comentários sobre a experiência</Label>
                    <Textarea
                      id="comentario"
                      rows={3}
                      placeholder="Conte-nos como foi sua experiência..."
                      value={data.comentario}
                      onChange={(e) => set("comentario", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      De 0 a 10, qual a probabilidade de recomendar o auditório? (NPS)
                    </Label>
                    <NpsScale value={data.npsScore} onChange={(v) => set("npsScore", v)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sugestao">Sugestões de melhoria</Label>
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
                      Existe algum recurso tecnológico ou melhoria física essencial para futuros eventos?
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
            onClick={() => canAdvance() ? setStep((s) => s + 1) : toast.error("Preencha os campos obrigatórios.")}
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
