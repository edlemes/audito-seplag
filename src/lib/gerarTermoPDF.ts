import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DadosSolicitante, DadosEvento } from "@/types/agendamento";

export function gerarTermoResponsabilidade(
  solicitante: DadosSolicitante,
  evento: DadosEvento
) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("ANEXO II", pw / 2, y, { align: "center" });
  y += 7;
  doc.setFontSize(12);
  doc.text("TERMO DE RESPONSABILIDADE", pw / 2, y, { align: "center" });
  y += 4;
  doc.setLineWidth(0.5);
  doc.line(30, y, pw - 30, y);
  y += 10;

  // Section helper
  const section = (title: string) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 51, 102);
    doc.text(title, 15, y);
    y += 2;
    doc.setLineWidth(0.3);
    doc.setDrawColor(0, 51, 102);
    doc.line(15, y, pw - 15, y);
    doc.setTextColor(0, 0, 0);
    doc.setDrawColor(0, 0, 0);
    y += 6;
  };

  // 1 - IDENTIFICAÇÃO DO RESPONSÁVEL PELO EVENTO
  section("1. IDENTIFICAÇÃO DO RESPONSÁVEL PELO EVENTO");

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    theme: "grid",
    headStyles: { fillColor: [0, 51, 102], fontSize: 9 },
    bodyStyles: { fontSize: 10 },
    head: [["Campo", "Dados"]],
    body: [
      ["Nome Completo", solicitante.nome || ""],
      ["CPF", solicitante.cpf || ""],
      ["Telefone", solicitante.telefone || ""],
      ["E-mail", solicitante.email || ""],
      ["Órgão / Secretaria", solicitante.orgao || ""],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // 2 - IDENTIFICAÇÃO DO REPRESENTANTE DA ADMINISTRAÇÃO
  section("2. IDENTIFICAÇÃO DO REPRESENTANTE DA ADMINISTRAÇÃO");

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    theme: "grid",
    headStyles: { fillColor: [0, 51, 102], fontSize: 9 },
    bodyStyles: { fontSize: 10 },
    head: [["Campo", "Dados"]],
    body: [
      ["Nome", ""],
      ["Matrícula / CPF", ""],
      ["Telefone", ""],
      ["E-mail", ""],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // 3 - INFORMAÇÕES SOBRE A VISTORIA
  section("3. INFORMAÇÕES SOBRE A VISTORIA");

  autoTable(doc, {
    startY: y,
    margin: { left: 15, right: 15 },
    theme: "grid",
    headStyles: { fillColor: [0, 51, 102], fontSize: 9 },
    bodyStyles: { fontSize: 10 },
    head: [["Campo", "Dados"]],
    body: [
      ["Espaço Utilizado", "Auditório SEPLAG Antônio Mendes"],
      ["Unidade da SEPLAG", solicitante.orgao || ""],
      ["Nome do Evento", evento.titulo || ""],
      ["Descrição", evento.descricao || ""],
      ["Data do Evento", evento.data || ""],
      ["Horário", `${evento.horarioInicio || ""} às ${evento.horarioFim || ""}`],
      ["Nº de Participantes", String(evento.numParticipantes || "")],
      ["Secretaria Atendida", evento.secretariaAtendida || ""],
    ],
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // 4 - DECLARAÇÃO
  section("4. DECLARAÇÃO DE RESPONSABILIDADE");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const declaracao =
    "Declaro, para os devidos fins, que me responsabilizo pela utilização do espaço acima identificado, " +
    "comprometendo-me a zelar pela conservação das instalações, equipamentos e demais bens disponibilizados, " +
    "devolvendo-os nas mesmas condições em que foram recebidos. Responsabilizo-me, ainda, por quaisquer danos " +
    "causados durante o período de utilização.";
  const lines = doc.splitTextToSize(declaracao, pw - 30);
  doc.text(lines, 15, y);
  y += lines.length * 4.5 + 10;

  // 5 - ASSINATURA
  section("5. DATA E ASSINATURA");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Cuiabá - MT, ______/________/________,  às _____:______", 15, y);
  y += 25;

  // Signature lines
  doc.line(15, y, 90, y);
  doc.line(pw / 2 + 5, y, pw - 15, y);
  y += 5;
  doc.setFontSize(8);
  doc.text("Responsável pelo Evento", 52.5, y, { align: "center" });
  doc.text("Representante da Administração", (pw / 2 + 5 + pw - 15) / 2, y, { align: "center" });

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(128);
  doc.text(
    "Documento gerado automaticamente pelo sistema SEPLAG Agenda Fácil",
    pw / 2,
    doc.internal.pageSize.getHeight() - 10,
    { align: "center" }
  );

  doc.save(`Termo_Responsabilidade_${solicitante.nome.replace(/\s+/g, "_") || "evento"}.pdf`);
}
