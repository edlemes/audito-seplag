import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CalendarDays, Users, ClipboardCheck, MessageSquare, LogOut, ShieldCheck, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const COLORS = ["#004587", "#0066CC", "#3399FF", "#66B2FF", "#99CCFF", "#CCE5FF", "#1a6fc4", "#2980b9", "#3498db", "#5dade2", "#85c1e9", "#aed6f1", "#d4e6f1", "#1b4f72", "#2471a3"];

const statusLabels: Record<string, string> = { pendente: "Pendente", aprovada: "Aprovada", recusada: "Recusada", cancelada: "Cancelada" };

const Admin = () => {
  const { user, isAdmin, isReadonly, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pendentes: 0, aprovadas: 0, feedbacks: 0 });
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [barData, setBarData] = useState<{ name: string; media: number }[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin && !isReadonly) return;
    loadData();
  }, [isAdmin, isReadonly]);

  const loadData = async () => {
    // Solicitations
    const { data: sols } = await supabase.from("solicitacoes_auditorio").select("*").order("created_at", { ascending: false });
    setSolicitacoes(sols || []);
    
    const total = sols?.length || 0;
    const pendentes = sols?.filter((s) => s.status === "pendente").length || 0;
    const aprovadas = sols?.filter((s) => s.status === "aprovada").length || 0;

    // Feedbacks
    const { count } = await supabase.from("feedback_usuario").select("*", { count: "exact", head: true });

    setStats({ total, pendentes, aprovadas, feedbacks: count || 0 });

    // Pie: solicitations by secretary
    const secMap: Record<string, number> = {};
    sols?.forEach((s) => { secMap[s.secretaria_atendida] = (secMap[s.secretaria_atendida] || 0) + 1; });
    setPieData(Object.entries(secMap).map(([name, value]) => ({ name: name.replace(/.*\(/, "").replace(")", "") || name, value })));

    // Bar: avg ratings
    const { data: fbs } = await supabase.from("feedback_usuario").select("*");
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

  const updateStatus = async (id: string, status: string) => {
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
            <div className="flex gap-2">
              {isAdmin && (
                <>
                  <Link to="/admin/vistoria">
                    <Button variant="outline" size="sm" className="gap-1"><ClipboardCheck className="h-4 w-4" />Vistoria</Button>
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
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Solicitações", value: stats.total, icon: CalendarDays, color: "text-primary" },
              { label: "Pendentes", value: stats.pendentes, icon: FileSearch, color: "text-warning" },
              { label: "Aprovadas", value: stats.aprovadas, icon: ClipboardCheck, color: "text-success" },
              { label: "Avaliações", value: stats.feedbacks, icon: MessageSquare, color: "text-accent" },
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

          {/* Solicitations table */}
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
