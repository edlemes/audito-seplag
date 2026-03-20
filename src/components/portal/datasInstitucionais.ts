export interface DataInstitucional {
  titulo: string;
  tipo: "pagamento" | "feriado";
}

const DATAS_INSTITUCIONAIS: Record<string, DataInstitucional> = {
  // ===== FERIADOS FIXOS (repetidos todo ano) =====
  // Usamos 2026 e 2027, mas a lookup usa mês-dia para fixos

  // 2026
  "2026-01-01": { titulo: "Confraternização Universal", tipo: "feriado" },
  "2026-04-08": { titulo: "Aniversário de Cuiabá", tipo: "feriado" },
  "2026-04-21": { titulo: "Tiradentes", tipo: "feriado" },
  "2026-05-01": { titulo: "Dia do Trabalho", tipo: "feriado" },
  "2026-09-07": { titulo: "Independência do Brasil", tipo: "feriado" },
  "2026-10-05": { titulo: "Aniversário de Mato Grosso", tipo: "feriado" },
  "2026-10-12": { titulo: "Nsa. Sra. Aparecida", tipo: "feriado" },
  "2026-10-28": { titulo: "Dia do Servidor Público", tipo: "feriado" },
  "2026-11-02": { titulo: "Finados", tipo: "feriado" },
  "2026-11-15": { titulo: "Proclamação da República", tipo: "feriado" },
  "2026-11-20": { titulo: "Consciência Negra", tipo: "feriado" },
  "2026-12-25": { titulo: "Natal", tipo: "feriado" },

  // 2027
  "2027-01-01": { titulo: "Confraternização Universal", tipo: "feriado" },
  "2027-04-08": { titulo: "Aniversário de Cuiabá", tipo: "feriado" },
  "2027-04-21": { titulo: "Tiradentes", tipo: "feriado" },
  "2027-05-01": { titulo: "Dia do Trabalho", tipo: "feriado" },
  "2027-09-07": { titulo: "Independência do Brasil", tipo: "feriado" },
  "2027-10-05": { titulo: "Aniversário de Mato Grosso", tipo: "feriado" },
  "2027-10-12": { titulo: "Nsa. Sra. Aparecida", tipo: "feriado" },
  "2027-10-28": { titulo: "Dia do Servidor Público", tipo: "feriado" },
  "2027-11-02": { titulo: "Finados", tipo: "feriado" },
  "2027-11-15": { titulo: "Proclamação da República", tipo: "feriado" },
  "2027-11-20": { titulo: "Consciência Negra", tipo: "feriado" },
  "2027-12-25": { titulo: "Natal", tipo: "feriado" },

  // ===== PAGAMENTOS 2026 =====
  "2026-01-30": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-02-27": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-03-30": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-04-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-05-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-06-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-07-30": { titulo: "Pagamento + 1ª Parcela 13º", tipo: "pagamento" },
  "2026-08-28": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-09-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-10-28": { titulo: "Dia do Servidor / Pagamento", tipo: "pagamento" },
  "2026-11-27": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2026-12-18": { titulo: "2ª Parcela 13º / Parcela Única", tipo: "pagamento" },
  "2026-12-23": { titulo: "Pagamento Salarial", tipo: "pagamento" },

  // ===== PAGAMENTOS 2027 =====
  "2027-01-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-02-26": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-03-30": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-04-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-05-28": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-06-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-07-30": { titulo: "Pagamento + 1ª Parcela 13º", tipo: "pagamento" },
  "2027-08-30": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-09-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-10-28": { titulo: "Dia do Servidor / Pagamento", tipo: "pagamento" },
  "2027-11-29": { titulo: "Pagamento Salarial", tipo: "pagamento" },
  "2027-12-17": { titulo: "2ª Parcela 13º / Parcela Única", tipo: "pagamento" },
  "2027-12-23": { titulo: "Pagamento Salarial", tipo: "pagamento" },
};

export default DATAS_INSTITUCIONAIS;
