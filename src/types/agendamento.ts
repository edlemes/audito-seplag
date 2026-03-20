export interface DadosSolicitante {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  orgao: string;
}

export interface DadosEvento {
  titulo: string;
  descricao: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  numParticipantes: number;
  secretariaAtendida: string;
}

export interface DocumentacaoUpload {
  termoAssinado: File | null;
}

export interface SolicitacaoAgendamento {
  solicitante: DadosSolicitante;
  evento: DadosEvento;
  documentacao: DocumentacaoUpload;
}

export interface AvaliacaoFeedback {
  notaGeral: number;
  notaInfraestrutura: number;
  notaAtendimento: number;
  notaEquipamentos: number;
  notaLogistica: number;
  notaTecnologia: number;
  notaConforto: number;
  suporteTecnico: boolean | null;
  notaTemperatura: number;
  npsScore: number;
  comentario: string;
  sugestao: string;
  sugestaoRecurso: string;
}

export const SECRETARIAS_MT = [
  "Casa Civil",
  "Casa Militar",
  "Controladoria-Geral do Estado (CGE)",
  "Gabinete de Comunicação (SECOM)",
  "Procuradoria-Geral do Estado (PGE)",
  "Secretaria de Estado de Assistência Social e Cidadania (SETASC)",
  "Secretaria de Estado de Ciência, Tecnologia e Inovação (SECITECI)",
  "Secretaria de Estado de Cultura, Esporte e Lazer (SECEL)",
  "Secretaria de Estado de Desenvolvimento Econômico (SEDEC)",
  "Secretaria de Estado de Educação (SEDUC)",
  "Secretaria de Estado de Fazenda (SEFAZ)",
  "Secretaria de Estado de Infraestrutura e Logística (SINFRA)",
  "Secretaria de Estado de Meio Ambiente (SEMA)",
  "Secretaria de Estado de Planejamento e Gestão (SEPLAG)",
  "Secretaria de Estado de Saúde (SES)",
  "Secretaria de Estado de Segurança Pública (SESP)",
] as const;

export const ORGAOS_MT = [
  "SEPLAG",
  "SEFAZ",
  "SEDUC",
  "SES",
  "SESP",
  "SINFRA",
  "SEMA",
  "SEDEC",
  "SECITECI",
  "SECEL",
  "SETASC",
  "SECOM",
  "CGE",
  "PGE",
  "Casa Civil",
  "Casa Militar",
  "Outro",
] as const;
