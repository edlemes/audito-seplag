import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DadosSolicitante } from "@/types/agendamento";
import { ORGAOS_MT } from "@/types/agendamento";

interface Props {
  data: DadosSolicitante;
  onChange: (data: DadosSolicitante) => void;
}

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const FormSolicitante = ({ data, onChange }: Props) => {
  const update = (field: keyof DadosSolicitante, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Dados do Solicitante</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input id="nome" placeholder="Nome completo" value={data.nome} onChange={(e) => update("nome", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input id="cpf" placeholder="000.000.000-00" value={data.cpf} onChange={(e) => update("cpf", formatCPF(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input id="email" type="email" placeholder="email@mt.gov.br" value={data.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input id="telefone" placeholder="(65) 99999-9999" value={data.telefone} onChange={(e) => update("telefone", formatPhone(e.target.value))} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Órgão / Secretaria *</Label>
        <Select value={data.orgao} onValueChange={(v) => update("orgao", v)}>
          <SelectTrigger><SelectValue placeholder="Selecione o órgão" /></SelectTrigger>
          <SelectContent>
            {ORGAOS_MT.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FormSolicitante;
