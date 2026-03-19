import { useState } from "react";
import { Star, Send, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AvaliacaoFeedback } from "@/types/agendamento";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ratingLabels = [
  { key: "notaGeral" as const, label: "Experiência Geral" },
  { key: "notaInfraestrutura" as const, label: "Infraestrutura" },
  { key: "notaAtendimento" as const, label: "Atendimento" },
  { key: "notaEquipamentos" as const, label: "Equipamentos" },
];

const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange(star)}>
        <Star
          className={`h-6 w-6 transition-colors ${
            star <= value ? "fill-secondary text-secondary" : "text-border"
          }`}
        />
      </button>
    ))}
  </div>
);

const FeedbackForm = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AvaliacaoFeedback>({
    notaGeral: 0,
    notaInfraestrutura: 0,
    notaAtendimento: 0,
    notaEquipamentos: 0,
    comentario: "",
    sugestao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (data.notaGeral === 0) {
      toast.error("Por favor, informe ao menos a nota geral.");
      return;
    }

    const { error } = await supabase.from("feedback_usuario").insert({
      user_id: user?.id || null,
      nota_geral: data.notaGeral,
      nota_infraestrutura: data.notaInfraestrutura || null,
      nota_atendimento: data.notaAtendimento || null,
      nota_equipamentos: data.notaEquipamentos || null,
      comentario: data.comentario || null,
      sugestao: data.sugestao || null,
    });

    if (error) {
      console.error('[Feedback] Submission failed:', error?.code ?? 'unknown');
      toast.error("Erro ao enviar avaliação. Faça login primeiro.");
      return;
    }
    toast.success("Avaliação enviada com sucesso! Obrigado pelo seu feedback.");
    setData({ notaGeral: 0, notaInfraestrutura: 0, notaAtendimento: 0, notaEquipamentos: 0, comentario: "", sugestao: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <MessageSquareHeart className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Avaliação & Sugestões</h2>
        <p className="text-muted-foreground">Sua opinião nos ajuda a melhorar!</p>
      </div>

      {/* Ratings */}
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        {ratingLabels.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <Label className="text-sm font-medium">{label}</Label>
            <StarRating value={data[key]} onChange={(v) => setData({ ...data, [key]: v })} />
          </div>
        ))}
      </div>

      {/* Text fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="comentario">Comentários sobre a experiência</Label>
          <Textarea id="comentario" rows={3} placeholder="Conte-nos como foi sua experiência..." value={data.comentario} onChange={(e) => setData({ ...data, comentario: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sugestao">Sugestões de melhoria</Label>
          <Textarea id="sugestao" rows={3} placeholder="O que podemos melhorar?" value={data.sugestao} onChange={(e) => setData({ ...data, sugestao: e.target.value })} />
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full gap-2">
        <Send className="h-4 w-4" />
        Enviar Avaliação
      </Button>
    </form>
  );
};

export default FeedbackForm;
