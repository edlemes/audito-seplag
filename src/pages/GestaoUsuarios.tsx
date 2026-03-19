import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/portal/Header";
import Footer from "@/components/portal/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Trash2, Shield } from "lucide-react";
import { toast } from "sonner";

const GestaoUsuarios = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<string>("readonly");
  const [newName, setNewName] = useState("");

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    const { data } = await supabase.from("profiles").select("*, user_roles(role)");
    setUsers(data || []);
  };

  const handleCreate = async () => {
    if (!newEmail || !newPassword || !newName) { toast.error("Preencha todos os campos."); return; }
    if (newPassword.length < 6) { toast.error("A senha deve ter pelo menos 6 caracteres."); return; }

    try {
      const { data, error } = await supabase.functions.invoke("create-admin", {
        body: { email: newEmail, password: newPassword, role: newRole, display_name: newName },
      });

      if (error) { toast.error("Erro ao criar usuário."); return; }
      if (data?.error) { toast.error(data.error); return; }

      toast.success("Usuário criado com sucesso!");
      setNewEmail(""); setNewPassword(""); setNewName("");
      loadUsers();
    } catch {
      toast.error("Erro ao criar usuário.");
    }
  };

  const removeRole = async (userId: string, role: string) => {
    await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role as any);
    toast.success("Permissão removida.");
    loadUsers();
  };

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Gestão de Usuários</h1>

          {/* Create user */}
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
              <UserPlus className="h-5 w-5 text-primary" /> Novo Administrador
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome completo" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@mt.gov.br" />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
              </div>
              <div className="space-y-2">
                <Label>Nível de Acesso</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin Total</SelectItem>
                    <SelectItem value="readonly">Apenas Leitura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCreate} className="mt-4 gap-2">
              <UserPlus className="h-4 w-4" /> Criar Usuário
            </Button>
          </div>

          {/* Users list */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="font-semibold text-foreground">Usuários Cadastrados</h2>
            </div>
            <div className="divide-y divide-border">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-foreground">{u.display_name || "Sem nome"}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {u.user_roles?.map((r: any) => (
                      <span key={r.role} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Shield className="h-3 w-3" />
                        {r.role === "admin" ? "Admin" : "Leitura"}
                        {isAdmin && (
                          <button onClick={() => removeRole(u.user_id, r.role)} className="ml-1 text-destructive hover:text-destructive/80">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                    {(!u.user_roles || u.user_roles.length === 0) && (
                      <span className="text-xs text-muted-foreground">Sem permissão</span>
                    )}
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <p className="px-4 py-8 text-center text-muted-foreground">Nenhum usuário cadastrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestaoUsuarios;
