import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DadosEvento } from "@/types/agendamento";
import { ORGAOS_POR_CATEGORIA } from "@/types/agendamento";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Lock } from "lucide-react";

interface Props {
  data: DadosEvento;
  onChange: (data: DadosEvento) => void;
}

interface ConflictEvent {
  titulo_evento: string;
  horario_inicio: string;
  horario_fim: string;
  status: string;
}

const FormEvento = ({ data, onChange }: Props) => {
  const [conflicts, setConflicts] = useState<ConflictEvent[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockMotivo, setBlockMotivo] = useState("");

  const update = (field: keyof DadosEvento, value: string | number) =>
    onChange({ ...data, [field]: value });

  useEffect(() => {
    if (!data.data) {
      setConflicts([]);
      setIsBlocked(false);
      return;
    }

    const checkDate = async () => {
      const { data: blocked } = await supabase
        .from("blocked_dates")
        .select("motivo")
        .eq("data", data.data)
        .limit(1);

      if (blocked && blocked.length > 0) {
        setIsBlocked(true);
        setBlockMotivo(blocked[0].motivo || "Data bloqueada pelo administrador");
        setConflicts([]);
        return;
      }
      setIsBlocked(false);
      setBlockMotivo("");

      if (data.horarioInicio && data.horarioFim) {
        const { data: existing } = await supabase
          .from("solicitacoes_auditorio")
          .select("titulo_evento, horario_inicio, horario_fim, status")
          .eq("data_evento", data.data)
          .in("status", ["aprovada", "pendente"]);

        if (existing) {
          const overlapping = existing.filter((e) => {
            return e.horario_inicio < data.horarioFim && e.horario_fim > data.horarioInicio;
          });
          setConflicts(overlapping);
        } else {
          setConflicts([]);
        }
      } else {
        setConflicts([]);
      }
    };

    checkDate();
  }, [data.data, data.horarioInicio, data.horarioFim]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Dados do Evento</h3>

      <div className="space-y-2">
        <Label htmlFor="titulo">Título do Evento *</Label>
        <Input id="titulo" placeholder="Ex: Reunião de Planejamento Estratégico" value={data.titulo} onChange={(e) => update("titulo", e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descricao">Descrição *</Label>
        <Textarea id="descricao" placeholder="Descreva brevemente o evento..." rows={3} value={data.descricao} onChange={(e) => update("descricao", e.target.value)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="data">Data de Início *</Label>
          <Input id="data" type="date" value={data.data} onChange={(e) => update("data", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dataTermino">Data de Término *</Label>
          <Input id="dataTermino" type="date" value={data.dataTermino} onChange={(e) => update("dataTermino", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="horarioInicio">Horário de Início *</Label>
          <Input id="horarioInicio" type="time" value={data.horarioInicio} onChange={(e) => update("horarioInicio", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horarioFim">Horário de Término *</Label>
          <Input id="horarioFim" type="time" value={data.horarioFim} onChange={(e) => update("horarioFim", e.target.value)} />
        </div>
      </div>

      {isBlocked && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Data indisponível</p>
            <p className="text-xs text-muted-foreground">{blockMotivo}. Escolha outra data.</p>
          </div>
        </div>
      )}

      {conflicts.length > 0 && !isBlocked && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-medium text-foreground">Conflito de horário detectado</p>
              <p className="mb-2 text-xs text-muted-foreground">
                Já existe(m) {conflicts.length} evento(s) neste horário. Sua solicitação ficará pendente de análise.
              </p>
              <div className="space-y-1">
                {conflicts.map((c, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    • {c.titulo_evento} ({c.horario_inicio}–{c.horario_fim}) — <span className="capitalize">{c.status}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="participantes">Nº de Participantes *</Label>
          <Input id="participantes" type="number" min={1} placeholder="50" value={data.numParticipantes || ""} onChange={(e) => update("numParticipantes", parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Secretaria Atendida *</Label>
          <Select value={data.secretariaAtendida} onValueChange={(v) => update("secretariaAtendida", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione a secretaria" /></SelectTrigger>
            <SelectContent className="max-h-80">
              {ORGAOS_POR_CATEGORIA.map((cat) => (
                <SelectGroup key={cat.categoria}>
                  <SelectLabel className="text-xs font-bold uppercase tracking-wider text-primary">{cat.categoria}</SelectLabel>
                  {cat.orgaos.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FormEvento;
