import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import ReportExporter from "@/components/portal/ReportExporter";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CalendarDays, Users, ClipboardCheck, MessageSquare, LogOut, ShieldCheck, FileSearch, LayoutDashboard, Download, Search, Ticket } from "lucide-react";
import CalendarioOcupacao from "@/components/portal/CalendarioOcupacao";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate } from "react-router-dom";

const COLORS = ["#004587", "#0066CC", "#3399FF", "#66B2FF", "#99CCFF", "#CCE5FF", "#1a6fc4", "#2980b9", "#3498db", "#5dade2", "#85c1e9", "#aed6f1", "#d4e6f1", "#1b4f72", "#2471a3"];

const statusLabels: Record<string, string> = { pendente: "Pendente", aprovada: "Aprovada", recusada: "Recusada", cancelada: "Cancelada" };

const exportCSV = (data: any[]) => {
  if (!data.length) return;
  const headers = ["Nome", "Email", "Telefone", "Órgão", "Cargo", "Data"];
  const rows = data.map((r) => [r.nome, r.email, r.telefone || "", r.orgao, r.cargo || "", new Date(r.created_at).toLocaleDateString("pt-BR")]);
  const csv = [headers, ...rows].map((r) => r.map((c: string) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `inscritos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const InscricoesTab = ({ inscricoes, searchInscricao, setSearchInscricao, filterOrgao, setFilterOrgao }: {
  inscricoes: any[]; searchInscricao: string; setSearchInscricao: (v: string) => void; filterOrgao: string; setFilterOrgao: (v: string) => void;
}) => {
  const orgaos = useMemo(() => [...new Set(inscricoes.map((i) => i.orgao))].sort(), [inscricoes]);
  const filtered = useMemo(() => {
    return inscricoes.filter((i) => {
      const matchSearch = !searchInscricao || i.nome?.toLowerCase().includes(searchInscricao.toLowerCase()) || i.email?.toLowerCase().includes(searchInscricao.toLowerCase());
      const matchOrgao = !filterOrgao || i.orgao === filterOrgao;
      return matchSearch && matchOrgao;
    });
  }, [inscricoes, searchInscricao, filterOrgao]);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
        <h3 className="font-semibold text-foreground">Inscritos ({filtered.length})</h3>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar nome ou email..." value={searchInscricao} onChange={(e) => setSearchInscricao(e.target.value)} className="h-8 w-48 pl-8 text-xs" />
          </div>
          <select value={filterOrgao} onChange={(e) => setFilterOrgao(e.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground">
            <option value="">Todos os órgãos</option>
            {orgaos.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
          <Button size="sm" variant="outline" className="h-8 gap-1 text-xs" onClick={() => exportCSV(filtered)}>
            <Download className="h-3.5 w-3.5" /> CSV
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nome</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Telefone</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Órgão</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Cargo</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i: any) => (
              <tr key={i.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{i.nome}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.telefone || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.orgao}</td>
                <td className="px-4 py-3 text-muted-foreground">{i.cargo || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(i.created_at).toLocaleDateString("pt-BR")}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhuma inscrição encontrada</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Admin = () => {
  const { user, isAdmin, isReadonly, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pendentes: 0, aprovadas: 0, feedbacks: 0, inscritos: 0 });
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [barData, setBarData] = useState<{ name: string; media: number }[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [inscricoes, setInscricoes] = useState<any[]>([]);
  const [searchInscricao, setSearchInscricao] = useState("");
  const [filterOrgao, setFilterOrgao] = useState("");

  useEffect(() => {
    if (!isAdmin && !isReadonly) return;
    loadData();
  }, [isAdmin, isReadonly]);

  const loadData = async () => {
    const [solsRes, countRes, fbsRes, inscRes] = await Promise.all([
      supabase.from("solicitacoes_auditorio").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("feedback_usuario").select("*", { count: "exact", head: true }),
      supabase.from("feedback_usuario").select("nota_geral, nota_infraestrutura, nota_atendimento, nota_equipamentos"),
      supabase.from("inscricoes_evento").select("*").order("created_at", { ascending: false }),
    ]);

    const sols = solsRes.data || [];
    setSolicitacoes(sols);
    setInscricoes(inscRes.data || []);

    const total = sols.length;
    const pendentes = sols.filter((s) => s.status === "pendente").length;
    const aprovadas = sols.filter((s) => s.status === "aprovada").length;
    setStats({ total, pendentes, aprovadas, feedbacks: countRes.count || 0, inscritos: inscRes.data?.length || 0 });

    // Pie: solicitations by secretary
    const secMap: Record<string, number> = {};
    for (const s of sols) {
      secMap[s.secretaria_atendida] = (secMap[s.secretaria_atendida] || 0) + 1;
    }
    setPieData(Object.entries(secMap).map(([name, value]) => ({ name: name.replace(/.*\(/, "").replace(")", "") || name, value })));

    // Bar: avg ratings
    const fbs = fbsRes.data;
    if (fbs && fbs.length > 0) {
      const avg = (key: string) => {
        const vals = fbs.map((f: any) => f[key]).filter(Boolean) as number[];
        return vals.length ? +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : 0;
      };
      setBarData([
        { name: "Geral", media: avg("nota_geral") },
        { name: "Infraestrutura", media: avg("nota_infraestrutura") },
        { name: "Atendimento", media: avg("nota_atendimento") },
        { name: "Equipamentos", media: avg("nota_equipamentos") },
      ]);
    }
  };

  const updateStatus = async (id: string, status: "pendente" | "aprovada" | "recusada" | "cancelada") => {
    await supabase.from("solicitacoes_auditorio").update({ status }).eq("id", id);
    loadData();
  };

  if (!isAdmin && !isReadonly) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <ShieldCheck className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-bold text-foreground">Acesso Restrito</h2>
            <p className="text-muted-foreground">Você não tem permissão para acessar esta área.</p>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">Voltar ao portal</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">
                {isAdmin ? "Administrador" : "Apenas Leitura"} — {user?.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <ReportExporter stats={stats} barData={barData} pieData={pieData} />
              {(isAdmin || isReadonly) && (
                <>
                  <Link to="/admin/vistoria">
                    <Button variant="outline" size="sm" className="gap-1"><ClipboardCheck className="h-4 w-4" />Vistoria</Button>
                  </Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link to="/admin/conteudo">
                    <Button variant="outline" size="sm" className="gap-1"><LayoutDashboard className="h-4 w-4" />Conteúdo</Button>
                  </Link>
                  <Link to="/admin/usuarios">
                    <Button variant="outline" size="sm" className="gap-1"><Users className="h-4 w-4" />Usuários</Button>
                  </Link>
                </>
              )}
              <Button variant="outline" size="sm" className="gap-1" onClick={() => { signOut(); navigate("/"); }}>
                <LogOut className="h-4 w-4" />Sair
              </Button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "Total Solicitações", value: stats.total, icon: CalendarDays, color: "text-primary" },
              { label: "Pendentes", value: stats.pendentes, icon: FileSearch, color: "text-warning" },
              { label: "Aprovadas", value: stats.aprovadas, icon: ClipboardCheck, color: "text-success" },
              { label: "Avaliações", value: stats.feedbacks, icon: MessageSquare, color: "text-accent" },
              { label: "Inscritos", value: stats.inscritos, icon: Ticket, color: "text-primary" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Solicitações por Secretaria</h3>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-20 text-center text-muted-foreground">Nenhuma solicitação registrada</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-semibold text-foreground">Índice de Satisfação (Média)</h3>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="media" fill="#004587" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="py-20 text-center text-muted-foreground">Nenhuma avaliação registrada</p>
              )}
            </div>
           </div>

          {/* Calendário de Ocupação */}
          <div className="mb-8">
            <CalendarioOcupacao isAdmin={isAdmin} />
          </div>

          {/* Tabs: Solicitações + Inscrições */}
          <Tabs defaultValue="solicitacoes" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="solicitacoes">Solicitações</TabsTrigger>
              <TabsTrigger value="inscricoes">Inscrições Evento</TabsTrigger>
            </TabsList>

            <TabsContent value="solicitacoes">
              <div className="rounded-xl border border-border bg-card">
                <div className="border-b border-border p-4">
                  <h3 className="font-semibold text-foreground">Solicitações Recentes</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Evento</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Solicitante</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Secretaria</th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                        {isAdmin && <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ações</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {solicitacoes.map((s) => (
                        <tr key={s.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 font-medium text-foreground">{s.titulo_evento}</td>
                          <td className="px-4 py-3 text-muted-foreground">{s.nome_solicitante}</td>
                          <td className="px-4 py-3 text-muted-foreground">{new Date(s.data_evento).toLocaleDateString("pt-BR")}</td>
                          <td className="px-4 py-3 text-muted-foreground">{s.secretaria_atendida}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              s.status === "aprovada" ? "bg-success/10 text-success" :
                              s.status === "pendente" ? "bg-warning/10 text-warning" :
                              s.status === "recusada" ? "bg-destructive/10 text-destructive" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {statusLabels[s.status] || s.status}
                            </span>
                          </td>
                          {isAdmin && (
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {s.status === "pendente" && (
                                  <>
                                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateStatus(s.id, "aprovada")}>Aprovar</Button>
                                    <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => updateStatus(s.id, "recusada")}>Recusar</Button>
                                  </>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                      {solicitacoes.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Nenhuma solicitação encontrada</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="inscricoes">
              <InscricoesTab inscricoes={inscricoes} searchInscricao={searchInscricao} setSearchInscricao={setSearchInscricao} filterOrgao={filterOrgao} setFilterOrgao={setFilterOrgao} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
