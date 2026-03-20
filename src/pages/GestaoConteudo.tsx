import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, ArrowUp, ArrowDown, Image as ImageIcon, ArrowLeft, Pencil, Save, Link2, Newspaper, Type, Camera } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface CmsItem {
  id: string;
  tipo: string;
  titulo: string | null;
  subtitulo: string | null;
  imagem_url: string;
  ordem: number;
  ativo: boolean;
}

interface Noticia {
  id: string;
  titulo: string;
  descricao: string | null;
  imagem_url: string;
  data_publicacao: string;
  ativo: boolean;
  ordem: number;
}

const GestaoConteudo = () => {
  const { isAdmin } = useAuth();
  const [carouselItems, setCarouselItems] = useState<CmsItem[]>([]);
  const [logoItem, setLogoItem] = useState<CmsItem | null>(null);
  const [splashNomeItem, setSplashNomeItem] = useState<CmsItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState("");
  const [editSubtitulo, setEditSubtitulo] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [splashNome, setSplashNome] = useState("AUDITÓRIO SEPLAG ANTÔNIO MENDES");

  // News state
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [noticiaUrl, setNoticiaUrl] = useState("");
  const [noticiaTitulo, setNoticiaTitulo] = useState("");
  const [noticiaDesc, setNoticiaDesc] = useState("");
  const [noticiaData, setNoticiaData] = useState(new Date().toISOString().split("T")[0]);
  const [editingNoticiaId, setEditingNoticiaId] = useState<string | null>(null);
  const [editNoticiaTitulo, setEditNoticiaTitulo] = useState("");
  const [editNoticiaDesc, setEditNoticiaDesc] = useState("");
  const [editNoticiaUrl, setEditNoticiaUrl] = useState("");

  useEffect(() => { loadContent(); loadNoticias(); }, []);

  const loadContent = async () => {
    const { data } = await supabase.from("cms_content").select("*").order("ordem", { ascending: true });
    if (data) {
      setCarouselItems(data.filter((d) => d.tipo === "carousel"));
      setLogoItem(data.find((d) => d.tipo === "logo") || null);
      const nome = data.find((d) => d.tipo === "splash_nome");
      setSplashNomeItem(nome || null);
      if (nome?.titulo) setSplashNome(nome.titulo);
    }
  };

  const loadNoticias = async () => {
    const { data } = await supabase.from("noticias").select("*").order("ordem", { ascending: true });
    if (data) setNoticias(data);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("cms-media").upload(path, file);
    if (error) { toast.error("Erro ao enviar arquivo"); return null; }
    const { data } = supabase.storage.from("cms-media").getPublicUrl(path);
    return data.publicUrl;
  };

  // --- Splash Name ---
  const saveSplashNome = async () => {
    if (!splashNome.trim()) return toast.error("Nome não pode ser vazio");
    if (splashNomeItem) {
      await supabase.from("cms_content").update({ titulo: splashNome.trim() }).eq("id", splashNomeItem.id);
    } else {
      await supabase.from("cms_content").insert({ tipo: "splash_nome", titulo: splashNome.trim(), imagem_url: "-", ordem: 0 });
    }
    toast.success("Nome da splash atualizado!");
    loadContent();
  };

  // --- Carousel ---
  const handleAddCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return toast.error("Informe o link da imagem");
    setUploading(true);
    const { error } = await supabase.from("cms_content").insert({
      tipo: "carousel", titulo: titulo || null, subtitulo: subtitulo || null,
      imagem_url: newUrl.trim(), ordem: carouselItems.length,
    });
    if (error) toast.error("Erro ao salvar");
    else { toast.success("Slide adicionado!"); setTitulo(""); setSubtitulo(""); setNewUrl(""); loadContent(); }
    setUploading(false);
  };

  const handleUploadLogo = async (file: File) => {
    setUploading(true);
    const url = await uploadFile(file);
    if (!url) { setUploading(false); return; }
    if (logoItem) {
      await supabase.from("cms_content").update({ imagem_url: url }).eq("id", logoItem.id);
    } else {
      await supabase.from("cms_content").insert({ tipo: "logo", imagem_url: url, ordem: 0 });
    }
    toast.success("Logo atualizada!"); loadContent(); setUploading(false);
  };

  const handleDelete = async (item: CmsItem) => {
    await supabase.from("cms_content").delete().eq("id", item.id);
    toast.success("Item removido!"); loadContent();
  };

  const handleReorder = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= carouselItems.length) return;
    const items = [...carouselItems];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);
    await Promise.all(items.map((item, i) => supabase.from("cms_content").update({ ordem: i }).eq("id", item.id)));
    loadContent();
  };

  const startEdit = (item: CmsItem) => {
    setEditingId(item.id); setEditTitulo(item.titulo || ""); setEditSubtitulo(item.subtitulo || ""); setEditUrl(item.imagem_url);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editUrl.trim()) return toast.error("O link da imagem é obrigatório");
    await supabase.from("cms_content").update({ titulo: editTitulo || null, subtitulo: editSubtitulo || null, imagem_url: editUrl.trim() }).eq("id", editingId);
    toast.success("Slide atualizado!"); setEditingId(null); loadContent();
  };

  // --- Noticias ---
  const handleAddNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticiaUrl.trim() || !noticiaTitulo.trim()) return toast.error("Título e link da imagem são obrigatórios");
    setUploading(true);
    const { error } = await supabase.from("noticias").insert({
      titulo: noticiaTitulo.trim(), descricao: noticiaDesc.trim() || null,
      imagem_url: noticiaUrl.trim(), data_publicacao: noticiaData, ordem: noticias.length,
    });
    if (error) toast.error("Erro ao salvar notícia");
    else { toast.success("Notícia adicionada!"); setNoticiaTitulo(""); setNoticiaDesc(""); setNoticiaUrl(""); loadNoticias(); }
    setUploading(false);
  };

  const handleDeleteNoticia = async (id: string) => {
    await supabase.from("noticias").delete().eq("id", id);
    toast.success("Notícia removida!"); loadNoticias();
  };

  const startEditNoticia = (n: Noticia) => {
    setEditingNoticiaId(n.id); setEditNoticiaTitulo(n.titulo); setEditNoticiaDesc(n.descricao || ""); setEditNoticiaUrl(n.imagem_url);
  };

  const saveEditNoticia = async () => {
    if (!editingNoticiaId) return;
    await supabase.from("noticias").update({ titulo: editNoticiaTitulo, descricao: editNoticiaDesc || null, imagem_url: editNoticiaUrl.trim() }).eq("id", editingNoticiaId);
    toast.success("Notícia atualizada!"); setEditingNoticiaId(null); loadNoticias();
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6 flex items-center gap-3">
            <Link to="/admin">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Gestão de Conteúdo</h1>
              <p className="text-sm text-muted-foreground">Gerencie splash, carrossel, logo e notícias</p>
            </div>
          </div>

          {/* Splash Name */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <Type className="h-5 w-5 text-primary" /> Nome da Splash Screen
            </h3>
            <div className="flex gap-3">
              <Input value={splashNome} onChange={(e) => setSplashNome(e.target.value)} placeholder="AUDITÓRIO SEPLAG ANTÔNIO MENDES" className="flex-1" />
              <Button onClick={saveSplashNome} className="gap-2"><Save className="h-4 w-4" /> Salvar</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Este nome aparece na tela de abertura com efeito neon.</p>
          </div>

          {/* Logo Section */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Logo do Portal / Splash</h3>
            <div className="flex items-center gap-6">
              {logoItem ? (
                <div className="relative">
                  <img src={logoItem.imagem_url} alt="Logo" className="h-20 w-20 rounded-lg border border-border object-contain" />
                  <button onClick={() => handleDelete(logoItem)} className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-border">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                    <Plus className="h-4 w-4" />
                    {logoItem ? "Trocar Logo" : "Enviar Logo"}
                  </div>
                </Label>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUploadLogo(e.target.files[0])} disabled={uploading} />
                <p className="mt-1 text-xs text-muted-foreground">PNG ou JPG recomendado. Usada na splash e no portal.</p>
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Slides do Carrossel</h3>
            <div className="mb-6 space-y-3">
              {carouselItems.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border bg-muted/30 p-3">
                  {editingId === item.id ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <img src={editUrl || item.imagem_url} alt="Preview" className="h-16 w-28 rounded-md object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                        <div className="flex-1 space-y-2">
                          <div><Label className="text-xs">Link da Imagem</Label><Input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} className="h-8 text-sm" /></div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div><Label className="text-xs">Título</Label><Input value={editTitulo} onChange={(e) => setEditTitulo(e.target.value)} className="h-8 text-sm" /></div>
                            <div><Label className="text-xs">Subtítulo</Label><Input value={editSubtitulo} onChange={(e) => setEditSubtitulo(e.target.value)} className="h-8 text-sm" /></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 gap-1 text-xs" onClick={saveEdit}><Save className="h-3 w-3" /> Salvar</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <img src={item.imagem_url} alt={item.titulo || "Slide"} className="h-16 w-28 rounded-md object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{item.titulo || "Sem título"}</p>
                        <p className="text-xs text-muted-foreground">{item.subtitulo || "Sem subtítulo"}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(item)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleReorder(index, -1)} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleReorder(index, 1)} disabled={index === carouselItems.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {carouselItems.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Nenhum slide cadastrado.</p>}
            </div>
            <form onSubmit={handleAddCarousel} className="rounded-lg border border-dashed border-border p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground"><Link2 className="h-4 w-4 text-primary" /> Adicionar slide (via link)</p>
              <div className="space-y-3">
                <div><Label className="text-xs">Link da Imagem *</Label><Input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://exemplo.com/foto.jpg" /></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label className="text-xs">Título</Label><Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Auditório SEPLAG" /></div>
                  <div><Label className="text-xs">Subtítulo</Label><Input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Ex: Espaço moderno..." /></div>
                </div>
              </div>
              <Button type="submit" className="mt-3 gap-2" disabled={uploading}><Plus className="h-4 w-4" />{uploading ? "Salvando..." : "Adicionar Slide"}</Button>
            </form>
          </div>

          {/* Noticias Section */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <Newspaper className="h-5 w-5 text-primary" /> Notícias / Últimos Eventos
            </h3>
            <div className="mb-6 space-y-3">
              {noticias.map((n) => (
                <div key={n.id} className="rounded-lg border border-border bg-muted/30 p-3">
                  {editingNoticiaId === n.id ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-4">
                        <img src={editNoticiaUrl || n.imagem_url} alt="Preview" className="h-16 w-28 rounded-md object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                        <div className="flex-1 space-y-2">
                          <div><Label className="text-xs">Link da Imagem</Label><Input value={editNoticiaUrl} onChange={(e) => setEditNoticiaUrl(e.target.value)} className="h-8 text-sm" /></div>
                          <div><Label className="text-xs">Título</Label><Input value={editNoticiaTitulo} onChange={(e) => setEditNoticiaTitulo(e.target.value)} className="h-8 text-sm" /></div>
                          <div><Label className="text-xs">Descrição</Label><Textarea value={editNoticiaDesc} onChange={(e) => setEditNoticiaDesc(e.target.value)} className="text-sm" rows={2} /></div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="h-7 gap-1 text-xs" onClick={saveEditNoticia}><Save className="h-3 w-3" /> Salvar</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setEditingNoticiaId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <img src={n.imagem_url} alt={n.titulo} className="h-16 w-28 rounded-md object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{n.titulo}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{n.descricao || "Sem descrição"}</p>
                        <p className="text-xs text-muted-foreground/60">{n.data_publicacao}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditNoticia(n)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteNoticia(n.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {noticias.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Nenhuma notícia cadastrada. Adicione abaixo.</p>}
            </div>
            <form onSubmit={handleAddNoticia} className="rounded-lg border border-dashed border-border p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground"><Plus className="h-4 w-4 text-primary" /> Adicionar notícia</p>
              <div className="space-y-3">
                <div><Label className="text-xs">Título *</Label><Input value={noticiaTitulo} onChange={(e) => setNoticiaTitulo(e.target.value)} placeholder="Ex: Palestra sobre Inovação" /></div>
                <div><Label className="text-xs">Descrição</Label><Textarea value={noticiaDesc} onChange={(e) => setNoticiaDesc(e.target.value)} placeholder="Breve descrição do evento..." rows={2} /></div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div><Label className="text-xs">Link da Imagem *</Label><Input value={noticiaUrl} onChange={(e) => setNoticiaUrl(e.target.value)} placeholder="https://..." /></div>
                  <div><Label className="text-xs">Data</Label><Input type="date" value={noticiaData} onChange={(e) => setNoticiaData(e.target.value)} /></div>
                </div>
              </div>
              <Button type="submit" className="mt-3 gap-2" disabled={uploading}><Plus className="h-4 w-4" />{uploading ? "Salvando..." : "Adicionar Notícia"}</Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestaoConteudo;
