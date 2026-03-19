import { Download, Upload, FileCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";

interface Props {
  file: File | null;
  onFileChange: (file: File | null) => void;
}

const FormDocumentacao = ({ file, onFileChange }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File | null) => {
    if (f && f.type === "application/pdf") onFileChange(f);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Documentação & Termo de Responsabilidade</h3>

      {/* Orientações */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <div className="mb-2 flex items-center gap-2 text-primary">
          <Info className="h-5 w-5" />
          <span className="font-semibold">Orientações para Assinatura via SigDoc</span>
        </div>
        <ol className="ml-6 list-decimal space-y-1 text-sm text-muted-foreground">
          <li>Baixe o Termo de Responsabilidade clicando no botão abaixo.</li>
          <li>Acesse o sistema <strong>SigDoc</strong> do Governo de MT.</li>
          <li>Faça upload do PDF e assine digitalmente.</li>
          <li>Baixe o documento assinado e faça upload nesta página.</li>
        </ol>
      </div>

      {/* Download */}
      <div>
        <Button variant="outline" className="gap-2" onClick={() => alert("Download do Termo de Responsabilidade (PDF modelo)")}>
          <Download className="h-4 w-4" />
          Baixar Termo de Responsabilidade (PDF)
        </Button>
      </div>

      {/* Upload */}
      <div className="space-y-2">
        <Label>Upload do Termo Assinado (PDF) *</Label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            dragOver ? "border-primary bg-primary/5" : file ? "border-success bg-success/5" : "border-border hover:border-primary/50"
          }`}
        >
          {file ? (
            <>
              <FileCheck className="h-10 w-10 text-success" />
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Arraste o PDF aqui ou <span className="font-medium text-primary">clique para selecionar</span>
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] || null)}
          />
        </div>
      </div>
    </div>
  );
};

export default FormDocumentacao;
