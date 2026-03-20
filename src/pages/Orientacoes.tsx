import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { Download, FileText, Info, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const orientacoes = [
  "O Auditório Antônio Mendes deve ser solicitado com no mínimo 5 dias úteis de antecedência.",
  "O uso é exclusivo para atividades institucionais de órgãos do Governo de MT.",
  "É proibido o consumo de alimentos e bebidas dentro do Auditório Antônio Mendes.",
  "O solicitante é responsável pela organização e limpeza do espaço.",
  "Equipamentos audiovisuais devem ser solicitados previamente.",
  "O horário de funcionamento é das 8h às 18h, de segunda a sexta-feira.",
];

const Orientacoes = () => (
  <div className="flex min-h-screen flex-col">
    <Header />

    <div className="flex-1 py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-2 text-2xl font-bold text-foreground">Orientações de Uso</h1>
        <p className="mb-8 text-muted-foreground">
          Informações importantes sobre o uso do Auditório Antônio Mendes e documentação necessária.
        </p>

        {/* Regras */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <Info className="h-5 w-5 text-primary" />
            Regras de Utilização
          </h2>
          <ul className="space-y-3">
            {orientacoes.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Termo */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            Termo de Responsabilidade
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Para utilizar o Auditório Antônio Mendes, é obrigatória a assinatura do Termo de Responsabilidade via SigDoc. Baixe o modelo, assine digitalmente e envie na etapa de agendamento.
          </p>
          <Button variant="outline" className="gap-2" onClick={() => alert("Download do Termo de Responsabilidade")}>
            <Download className="h-4 w-4" />
            Baixar Termo de Responsabilidade (PDF)
          </Button>
        </div>

        {/* SigDoc */}
        <div className="rounded-xl border border-border bg-muted/50 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <ExternalLink className="h-5 w-5 text-primary" />
            Como Assinar via SigDoc
          </h2>
          <ol className="ml-5 list-decimal space-y-2 text-sm text-muted-foreground">
            <li>Acesse o portal <strong>SigDoc</strong> com suas credenciais do Governo de MT.</li>
            <li>Clique em <strong>"Novo Documento"</strong> e faça upload do Termo de Responsabilidade.</li>
            <li>Selecione o tipo de assinatura <strong>"Assinatura Digital"</strong>.</li>
            <li>Após assinar, faça o download do documento assinado.</li>
            <li>Retorne à página de <strong>Agendamento</strong> e envie o PDF assinado.</li>
          </ol>
        </div>
      </div>
    </div>

    <Footer />
  </div>
);

export default Orientacoes;
