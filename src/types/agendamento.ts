export interface DadosSolicitante {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  orgao: string;
  orgaoOutro: string;
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
  recursosUtilizados: string[];
  falhaTecnica: boolean;
  descricaoFalha: string;
}

export const RECURSOS_AUDITORIO = [
  "Microfone sem fio",
  "Microfone de lapela",
  "Pointer/Apontador laser",
  "Cabine de tradução",
  "Gravação do evento",
  "Transmissão ao vivo",
  "Notebook auxiliar",
  "Adaptador HDMI/VGA",
] as const;

export const ORGAOS_POR_CATEGORIA = [
  {
    categoria: 'NÍVEL ESTRATÉGICO (Governança do Estado)',
    orgaos: [
      'GABGOV / Gabinete do Governador',
      'VICE-GOV / Gabinete do Vice-Governador',
      'CASA CIVIL / Casa Civil',
      'CGE / Controladoria Geral do Estado',
      'PGE / Procuradoria Geral do Estado',
      'SECOM / Secretaria de Estado de Comunicação',
    ],
  },
  {
    categoria: 'GESTÃO, PLANEJAMENTO E ECONOMIA',
    orgaos: [
      'SEFAZ / Secretaria de Estado de Fazenda',
      'SEPLAG / Secretaria de Estado de Planejamento e Gestão',
      'SEDEC / Secretaria de Estado de Desenvolvimento Econômico',
    ],
  },
  {
    categoria: 'DESENVOLVIMENTO SOCIAL E CIDADANIA',
    orgaos: [
      'SETASC / Secretaria de Estado de Assistência Social e Cidadania',
      'SECEL / Secretaria de Estado de Cultura, Esporte e Lazer',
      'SEDUC / Secretaria de Estado de Educação',
    ],
  },
  {
    categoria: 'SAÚDE',
    orgaos: [
      'SES / Secretaria de Estado de Saúde',
      'MT-HEMOCENTRO / Hemocentro do Estado de Mato Grosso',
    ],
  },
  {
    categoria: 'INFRAESTRUTURA, MEIO AMBIENTE E PRODUÇÃO',
    orgaos: [
      'SEMA / Secretaria de Estado de Meio Ambiente',
      'SINFRA / Secretaria de Estado de Infraestrutura e Logística',
      'SEAF / Secretaria de Estado de Agricultura Familiar',
      'SEDER / Secretaria de Estado de Desenvolvimento Rural',
    ],
  },
  {
    categoria: 'SEGURANÇA PÚBLICA E JUSTIÇA',
    orgaos: [
      'SESP / Secretaria de Estado de Segurança Pública',
      'SEJUDH / Secretaria de Estado de Justiça e Direitos Humanos',
      'PMMT / Polícia Militar do Estado de Mato Grosso',
      'PJC-MT / Polícia Judiciária Civil do Estado de Mato Grosso',
      'CBM-MT / Corpo de Bombeiros Militar do Estado de Mato Grosso',
    ],
  },
  {
    categoria: 'ADMINISTRAÇÃO INDIRETA E EXECUÇÃO',
    orgaos: [
      'MTI / Empresa Mato-grossense de Tecnologia da Informação',
      'INTERMAT / Instituto de Terras de Mato Grosso',
      'DETRAN-MT / Departamento Estadual de Trânsito',
      'AGER-MT / Agência Estadual de Regulação dos Serviços Públicos Delegados',
      'INDEA-MT / Instituto de Defesa Agropecuária do Estado de Mato Grosso',
      'EMPAER / Empresa Mato-grossense de Pesquisa, Assistência e Extensão Rural',
      'JUCEMAT / Junta Comercial do Estado de Mato Grosso',
      'IPEM-MT / Instituto de Pesos e Medidas de Mato Grosso',
      'FUNAC / Fundação Nova Chance',
    ],
  },
  {
    categoria: 'EDUCAÇÃO SUPERIOR E PESQUISA',
    orgaos: ['UNEMAT / Universidade do Estado de Mato Grosso'],
  },
  {
    categoria: 'PODER LEGISLATIVO E CONTROLE EXTERNO',
    orgaos: [
      'ALMT / Assembleia Legislativa do Estado de Mato Grosso',
      'TCE-MT / Tribunal de Contas do Estado de Mato Grosso',
    ],
  },
  {
    categoria: 'PODER JUDICIÁRIO E FUNÇÕES ESSENCIAIS À JUSTIÇA',
    orgaos: [
      'TJMT / Tribunal de Justiça do Estado de Mato Grosso',
      'MP-MT / Ministério Público do Estado de Mato Grosso',
      'DPE-MT / Defensoria Pública do Estado de Mato Grosso',
    ],
  },
  {
    categoria: 'OUTROS',
    orgaos: ['OUTROS / Especificar outra instituição'],
  },
] as const;

// Flat list for backward compatibility
export const SECRETARIAS_MT = ORGAOS_POR_CATEGORIA.flatMap(c => c.orgaos);
