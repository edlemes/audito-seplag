import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DadosEvento } from "@/types/agendamento";
import { SECRETARIAS_MT } from "@/types/agendamento";

interface Props {
  data: DadosEvento;
  onChange: (data: DadosEvento) => void;
}

const FormEvento = ({ data, onChange }: Props) => {
  const update = (field: keyof DadosEvento, value: string | number) =>
    onChange({ ...data, [field]: value });

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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="data">Data *</Label>
          <Input id="data" type="date" value={data.data} onChange={(e) => update("data", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horarioInicio">Início *</Label>
          <Input id="horarioInicio" type="time" value={data.horarioInicio} onChange={(e) => update("horarioInicio", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horarioFim">Término *</Label>
          <Input id="horarioFim" type="time" value={data.horarioFim} onChange={(e) => update("horarioFim", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="participantes">Nº de Participantes *</Label>
          <Input id="participantes" type="number" min={1} placeholder="50" value={data.numParticipantes || ""} onChange={(e) => update("numParticipantes", parseInt(e.target.value) || 0)} />
        </div>
        <div className="space-y-2">
          <Label>Secretaria Atendida *</Label>
          <Select value={data.secretariaAtendida} onValueChange={(v) => update("secretariaAtendida", v)}>
            <SelectTrigger><SelectValue placeholder="Selecione a secretaria" /></SelectTrigger>
            <SelectContent>
              {SECRETARIAS_MT.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FormEvento;
