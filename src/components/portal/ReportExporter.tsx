import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

interface ReportExporterProps {
  stats: { total: number; pendentes: number; aprovadas: number; feedbacks: number };
  barData: { name: string; media: number }[];
  pieData: { name: string; value: number }[];
}

const ReportExporter = ({ stats, barData, pieData }: ReportExporterProps) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportExcel = async () => {
    setExporting("xlsx");
    try {
      const { data: sols } = await supabase.from("solicitacoes_auditorio").select("*").order("created_at", { ascending: false });
      const { data: fbs } = await supabase.from("feedback_usuario").select("*").order("created_at", { ascending: false });

      const wb = XLSX.utils.book_new();

      // Sheet 1: Agendamentos
      const solRows = (sols || []).map((s) => ({
        "Evento": s.titulo_evento,
        "Solicitante": s.nome_solicitante,
        "CPF": s.cpf,
        "E-mail": s.email,
        "Telefone": s.telefone || "",
        "Órgão": s.orgao,
        "Secretaria": s.secretaria_atendida,
        "Data Evento": s.data_evento,
        "Horário Início": s.horario_inicio,
        "Horário Fim": s.horario_fim,
        "Participantes": s.num_participantes || "",
        "Status": s.status,
        "Criado em": new Date(s.created_at).toLocaleString("pt-BR"),
      }));
      const ws1 = XLSX.utils.json_to_sheet(solRows);
      ws1["!cols"] = Object.keys(solRows[0] || {}).map(() => ({ wch: 20 }));
      XLSX.utils.book_append_sheet(wb, ws1, "Agendamentos");

      // Sheet 2: Secretarias
      const secSheet = pieData.map((p) => ({ "Secretaria": p.name, "Quantidade": p.value }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(secSheet), "Por Secretaria");

      // Sheet 3: Feedbacks
      const fbRows = (fbs || []).map((f) => ({
        "Nota Geral": f.nota_geral,
        "Infraestrutura": f.nota_infraestrutura || "",
        "Atendimento": f.nota_atendimento || "",
        "Equipamentos": f.nota_equipamentos || "",
        "Comentário": f.comentario || "",
        "Sugestão": f.sugestao || "",
        "Data": new Date(f.created_at).toLocaleString("pt-BR"),
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fbRows), "Feedbacks");

      // Sheet 4: Resumo
      const resumo = [
        { "Indicador": "Total de Solicitações", "Valor": stats.total },
        { "Indicador": "Pendentes", "Valor": stats.pendentes },
        { "Indicador": "Aprovadas", "Valor": stats.aprovadas },
        { "Indicador": "Avaliações", "Valor": stats.feedbacks },
        ...barData.map((b) => ({ "Indicador": `Satisfação - ${b.name}`, "Valor": b.media })),
      ];
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumo), "Resumo");

      XLSX.writeFile(wb, `relatorio_seplag_${new Date().toISOString().slice(0, 10)}.xlsx`);
      toast.success("Relatório Excel gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar relatório Excel.");
    }
    setExporting(null);
  };

  const exportPDF = async () => {
    setExporting("pdf");
    try {
      const { data: sols } = await supabase.from("solicitacoes_auditorio").select("*").order("created_at", { ascending: false });

      const doc = new jsPDF();
      const blue = [0, 69, 135] as const;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(...blue);
      doc.text("RELATÓRIO EXECUTIVO", 105, 20, { align: "center" });
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text("Auditório Antônio Mendes — SEPLAG / Mato Grosso", 105, 28, { align: "center" });
      doc.setFontSize(9);
      doc.text(`Gerado em: ${new Date().toLocaleString("pt-BR")}`, 105, 34, { align: "center" });

      doc.setDrawColor(...blue);
      doc.setLineWidth(0.5);
      doc.line(20, 38, 190, 38);

      // Stats summary
      let y = 48;
      doc.setFontSize(14);
      doc.setTextColor(...blue);
      doc.setFont("helvetica", "bold");
      doc.text("Indicadores Gerais", 20, y);
      y += 10;

      const indicators = [
        ["Total de Solicitações", String(stats.total)],
        ["Pendentes", String(stats.pendentes)],
        ["Aprovadas", String(stats.aprovadas)],
        ["Avaliações Recebidas", String(stats.feedbacks)],
      ];

      doc.setFontSize(10);
      indicators.forEach(([label, val]) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60);
        doc.text(label + ":", 25, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(val, 85, y);
        y += 7;
      });

      // Satisfaction chart (bar representation)
      y += 8;
      doc.setFontSize(14);
      doc.setTextColor(...blue);
      doc.setFont("helvetica", "bold");
      doc.text("Índice de Satisfação (Média)", 20, y);
      y += 10;

      barData.forEach((item) => {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60);
        doc.text(item.name, 25, y + 4);

        // Bar background
        doc.setFillColor(230, 235, 240);
        doc.rect(65, y - 1, 100, 7, "F");

        // Bar fill
        const barWidth = (item.media / 5) * 100;
        doc.setFillColor(...blue);
        doc.rect(65, y - 1, barWidth, 7, "F");

        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text(`${item.media}/5`, 170, y + 4);
        y += 11;
      });

      // Secretarias pie chart (text representation)
      y += 8;
      doc.setFontSize(14);
      doc.setTextColor(...blue);
      doc.setFont("helvetica", "bold");
      doc.text("Solicitações por Secretaria", 20, y);
      y += 10;

      const totalPie = pieData.reduce((a, b) => a + b.value, 0);
      pieData.forEach((item) => {
        const pct = totalPie > 0 ? ((item.value / totalPie) * 100).toFixed(1) : "0";
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60);
        doc.text(`${item.name}: ${item.value} (${pct}%)`, 25, y);
        y += 6;
      });

      // Solicitations table
      if ((sols || []).length > 0) {
        doc.addPage();
        y = 20;
        doc.setFontSize(14);
        doc.setTextColor(...blue);
        doc.setFont("helvetica", "bold");
        doc.text("Agendamentos Detalhados", 20, y);
        y += 10;

        // Table header
        doc.setFillColor(...blue);
        doc.rect(15, y - 1, 180, 8, "F");
        doc.setTextColor(255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        const cols = ["Evento", "Solicitante", "Data", "Secretaria", "Status"];
        const colX = [18, 58, 108, 128, 172];
        cols.forEach((col, i) => doc.text(col, colX[i], y + 5));
        y += 10;

        doc.setTextColor(0);
        doc.setFont("helvetica", "normal");
        (sols || []).slice(0, 40).forEach((s, i) => {
          if (y > 270) { doc.addPage(); y = 20; }
          if (i % 2 === 0) { doc.setFillColor(245, 248, 252); doc.rect(15, y - 3, 180, 7, "F"); }
          doc.setFontSize(7);
          doc.text((s.titulo_evento || "").slice(0, 25), 18, y + 1);
          doc.text((s.nome_solicitante || "").slice(0, 25), 58, y + 1);
          doc.text(new Date(s.data_evento).toLocaleDateString("pt-BR"), 108, y + 1);
          doc.text((s.secretaria_atendida || "").slice(0, 25), 128, y + 1);
          doc.text(s.status || "", 172, y + 1);
          y += 7;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`SEPLAG Agenda Fácil — Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
      }

      doc.save(`relatorio_executivo_seplag_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Relatório PDF gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar relatório PDF.");
    }
    setExporting(null);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-2" onClick={exportExcel} disabled={!!exporting}>
        {exporting === "xlsx" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
        Excel
      </Button>
      <Button variant="outline" size="sm" className="gap-2" onClick={exportPDF} disabled={!!exporting}>
        {exporting === "pdf" ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
        PDF
      </Button>
    </div>
  );
};

export default ReportExporter;
