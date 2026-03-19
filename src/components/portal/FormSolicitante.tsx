import { useState } from "react";
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

const isValidCPF = (cpf: string) => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  if (parseInt(digits[9]) !== check) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  check = 11 - (sum % 11);
  if (check >= 10) check = 0;
  return parseInt(digits[10]) === check;
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const FormSolicitante = ({ data, onChange }: Props) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const update = (field: keyof DadosSolicitante, value: string) =>
    onChange({ ...data, [field]: value });

  const touch = (field: string) => setTouched((t) => ({ ...t, [field]: true }));

  const cpfError = touched.cpf && data.cpf && !isValidCPF(data.cpf) ? "CPF inválido" : "";
  const emailError = touched.email && data.email && !isValidEmail(data.email) ? "E-mail inválido" : "";
  const nomeError = touched.nome && !data.nome.trim() ? "Nome é obrigatório" : "";
  const telefoneError = touched.telefone && data.telefone && data.telefone.replace(/\D/g, "").length < 10 ? "Telefone incompleto" : "";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Dados do Solicitante</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo *</Label>
          <Input
            id="nome"
            placeholder="Nome completo"
            value={data.nome}
            onChange={(e) => update("nome", e.target.value)}
            onBlur={() => touch("nome")}
            aria-invalid={!!nomeError}
            aria-describedby={nomeError ? "nome-error" : undefined}
          />
          {nomeError && <p id="nome-error" className="text-xs text-destructive">{nomeError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            placeholder="000.000.000-00"
            value={data.cpf}
            onChange={(e) => update("cpf", formatCPF(e.target.value))}
            onBlur={() => touch("cpf")}
            aria-invalid={!!cpfError}
            aria-describedby={cpfError ? "cpf-error" : undefined}
          />
          {cpfError && <p id="cpf-error" className="text-xs text-destructive">{cpfError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="email@mt.gov.br"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => touch("email")}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && <p id="email-error" className="text-xs text-destructive">{emailError}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            placeholder="(65) 99999-9999"
            value={data.telefone}
            onChange={(e) => update("telefone", formatPhone(e.target.value))}
            onBlur={() => touch("telefone")}
            aria-invalid={!!telefoneError}
            aria-describedby={telefoneError ? "telefone-error" : undefined}
          />
          {telefoneError && <p id="telefone-error" className="text-xs text-destructive">{telefoneError}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Órgão / Secretaria *</Label>
        <Select value={data.orgao} onValueChange={(v) => update("orgao", v)}>
          <SelectTrigger aria-label="Selecione o órgão"><SelectValue placeholder="Selecione o órgão" /></SelectTrigger>
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
