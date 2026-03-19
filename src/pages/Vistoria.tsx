import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardCheck, FileText, Download, Camera, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

type StatusItem = "bom" | "manutencao" | "ajuste";

const itensVistoria = [
  { key: "ar_condicionado", label: "Ar Condicionado" },
  { key: "microfones", label: "Microfones" },
  { key: "projetor", label: "Projetor" },
  { key: "limpeza_cadeiras", label: "Limpeza das Cadeiras" },
  { key: "iluminacao", label: "Iluminação" },
  { key: "som", label: "Sistema de Som" },
  { key: "tela_projecao", label: "Tela de Projeção" },
  { key: "rede_wifi", label: "Rede Wi-Fi" },
] as const;

const statusLabels: Record<StatusItem, string> = { bom: "Bom", manutencao: "Manutenção", ajuste: "Ajuste" };
const statusColors: Record<StatusItem, string> = { bom: "bg-success/10 text-success", manutencao: "bg-destructive/10 text-destructive", ajuste: "bg-warning/10 text-warning" };

interface PhotoItem {
  file: File;
  preview: string;
  label: string;
}

const Vistoria = () => {
  const { user, isAdmin } = useAuth();
  const [tipoVistoria, setTipoVistoria] = useState<string>("pre_evento");
  const [solicitacaoId, setSolicitacaoId] = useState<string>("");
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [items, setItems] = useState<Record<string, StatusItem>>(
    Object.fromEntries(itensVistoria.map((i) => [i.key, "bom"])) as Record<string, StatusItem>
  );
  const [historico, setHistorico] = useState<any[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSolicitacoes();
    loadHistorico();
  }, []);

  const loadSolicitacoes = async () => {
    const { data } = await supabase.from("solicitacoes_auditorio").select("id, titulo_evento, data_evento").eq("status", "aprovada");
    setSolicitacoes(data || []);
  };

  const loadHistorico = async () => {
    const { data } = await supabase.from("vistoria_equipamentos").select("*, solicitacoes_auditorio(titulo_evento, data_evento)").order("created_at", { ascending: false }).limit(10);
    setHistorico(data || []);
  };

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: PhotoItem[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} excede 5MB`); return; }
      newPhotos.push({ file, preview: URL.createObjectURL(file), label: file.name.split(".")[0] });
    });
    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadPhotos = async (): Promise<string[]> => {
    const urls: string[] = [];
    for (const photo of photos) {
      const ext = photo.file.name.split(".").pop();
      const path = `vistoria/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("cms-media").upload(path, photo.file);
      if (error) { console.error("[Vistoria] Upload failed:", error.message); continue; }
      const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
      urls.push(data.publicUrl);
    }
    return urls;
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    let photoUrls: string[] = [];
    if (photos.length > 0) {
      toast.info("Enviando fotos...");
      photoUrls = await uploadPhotos();
    }

    const { error } = await supabase.from("vistoria_equipamentos").insert({
      solicitacao_id: solicitacaoId || null,
      inspector_id: user.id,
      tipo_vistoria: tipoVistoria,
      observacoes: observacoes + (photoUrls.length > 0 ? `\n\n[FOTOS]\n${photoUrls.join("\n")}` : ""),
      ...items,
    } as any);
    if (error) { toast.error("Erro ao salvar vistoria."); console.error('[Vistoria] Save failed:', error?.code ?? 'unknown'); return; }
    toast.success("Vistoria registrada com sucesso!");
    generatePDF(photoUrls);
    setObservacoes("");
    setPhotos([]);
    setItems(Object.fromEntries(itensVistoria.map((i) => [i.key, "bom"])) as Record<string, StatusItem>);
    loadHistorico();
  };

  const generatePDF = async (photoUrls: string[] = []) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 69, 135);
    doc.text("TERMO DE VISTORIA", 105, 25, { align: "center" });
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Portal do Auditório — SEPLAG / MT", 105, 33, { align: "center" });

    doc.setDrawColor(0, 69, 135);
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text("Tipo:", 20, 48);
    doc.setFont("helvetica", "normal");
    doc.text(tipoVistoria === "pre_evento" ? "Pré-Evento" : "Pós-Evento", 40, 48);

    doc.setFont("helvetica", "bold");
    doc.text("Data:", 100, 48);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("pt-BR"), 115, 48);

    doc.setFont("helvetica", "bold");
    doc.text("Inspetor:", 20, 56);
    doc.setFont("helvetica", "normal");
    doc.text(user?.email || "", 45, 56);

    // Table header
    let y = 70;
    doc.setFillColor(0, 69, 135);
    doc.rect(20, y, 170, 8, "F");
    doc.setTextColor(255);
    doc.setFont("helvetica", "bold");
    doc.text("Item", 25, y + 6);
    doc.text("Status", 140, y + 6);
    y += 12;

    // Table rows
    doc.setTextColor(0);
    itensVistoria.forEach((item, i) => {
      if (i % 2 === 0) { doc.setFillColor(240, 245, 250); doc.rect(20, y - 4, 170, 8, "F"); }
      doc.setFont("helvetica", "normal");
      doc.text(item.label, 25, y + 2);
      const status = items[item.key];
      doc.setFont("helvetica", "bold");
      doc.setTextColor(status === "bom" ? [34, 139, 34] as any : status === "manutencao" ? [200, 0, 0] as any : [200, 150, 0] as any);
      doc.text(statusLabels[status].toUpperCase(), 140, y + 2);
      doc.setTextColor(0);
      y += 8;
    });

    if (observacoes) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("Observações:", 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(observacoes, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5;
    }

    // Photo URLs reference
    if (photoUrls.length > 0) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Fotos Anexadas: ${photoUrls.length} arquivo(s)`, 20, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      photoUrls.forEach((url, i) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setTextColor(0, 69, 135);
        doc.text(`Foto ${i + 1}: ${url}`, 25, y);
        y += 5;
      });
      doc.setTextColor(0);
    }

    y = Math.min(y + 20, 260);
    if (y > 250) { doc.addPage(); y = 40; }
    doc.setFontSize(10);
    doc.line(20, y, 90, y);
    doc.setFontSize(9);
    doc.text("Assinatura do Inspetor", 30, y + 5);
    doc.line(110, y, 190, y);
    doc.text("Assinatura do Responsável", 125, y + 5);

    doc.save(`vistoria_${tipoVistoria}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-2 text-2xl font-bold text-foreground">Vistoria de Equipamentos</h1>
          <p className="mb-8 text-muted-foreground">Check-list profissional — Anexo III</p>

          {/* Form */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de Vistoria</Label>
                <Select value={tipoVistoria} onValueChange={setTipoVistoria}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre_evento">Pré-Evento</SelectItem>
                    <SelectItem value="pos_evento">Pós-Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Evento Vinculado (opcional)</Label>
                <Select value={solicitacaoId} onValueChange={setSolicitacaoId}>
                  <SelectTrigger><SelectValue placeholder="Selecione um evento" /></SelectTrigger>
                  <SelectContent>
                    {solicitacoes.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.titulo_evento} — {new Date(s.data_evento).toLocaleDateString("pt-BR")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {itensVistoria.map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <div className="flex gap-2">
                    {(["bom", "manutencao", "ajuste"] as StatusItem[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => setItems({ ...items, [item.key]: status })}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                          items[item.key] === status
                            ? statusColors[status] + " ring-2 ring-offset-1 ring-current"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Photo upload section */}
            <div className="mt-6 space-y-3">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4 text-primary" /> Fotos dos Equipamentos
              </Label>
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, i) => (
                  <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border">
                    <img src={photo.preview} alt={photo.label} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px]">Câmera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition hover:border-primary hover:text-primary"
                  >
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px]">Galeria</span>
                  </button>
                </div>
              </div>
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhotoAdd(e.target.files)} />
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handlePhotoAdd(e.target.files)} />
              <p className="text-xs text-muted-foreground">Tire fotos com o celular ou selecione da galeria (máx. 5MB por foto)</p>
            </div>

            <div className="mt-4 space-y-2">
              <Label>Observações</Label>
              <Textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} placeholder="Observações adicionais..." />
            </div>

            <div className="mt-6 flex gap-3">
              <Button onClick={handleSubmit} className="gap-2">
                <ClipboardCheck className="h-4 w-4" /> Registrar Vistoria e Gerar PDF
              </Button>
              <Button variant="outline" onClick={() => generatePDF()} className="gap-2">
                <Download className="h-4 w-4" /> Apenas Gerar PDF
              </Button>
            </div>
          </div>

          {/* Historico */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="flex items-center gap-2 font-semibold text-foreground">
                <FileText className="h-5 w-5 text-primary" /> Histórico de Vistorias
              </h2>
            </div>
            <div className="divide-y divide-border">
              {historico.map((v) => (
                <div key={v.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">
                      {v.tipo_vistoria === "pre_evento" ? "Pré-Evento" : "Pós-Evento"}
                      {v.solicitacoes_auditorio && ` — ${v.solicitacoes_auditorio.titulo_evento}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                  <div className="flex gap-1">
                    {itensVistoria.map((item) => (
                      <span key={item.key} className={`h-3 w-3 rounded-full ${
                        v[item.key] === "bom" ? "bg-success" : v[item.key] === "manutencao" ? "bg-destructive" : "bg-warning"
                      }`} title={`${item.label}: ${statusLabels[v[item.key] as StatusItem]}`} />
                    ))}
                  </div>
                </div>
              ))}
              {historico.length === 0 && (
                <p className="px-4 py-8 text-center text-muted-foreground">Nenhuma vistoria registrada</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vistoria;
