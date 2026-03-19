import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (error) { toast.error(error.message); }
      else { toast.success("Conta criada! Verifique seu e-mail."); }
    } else {
      const { error } = await signIn(email, password);
      if (error) { toast.error("Credenciais inválidas."); }
      else { navigate("/admin"); }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Portal do Auditório</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Crie sua conta" : "Acesso Administrativo"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <LogIn className="h-4 w-4" />
            {loading ? "Aguarde..." : isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

        <div className="text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-primary hover:underline">
            {isSignUp ? "Já tem conta? Fazer login" : "Não tem conta? Criar conta"}
          </button>
        </div>

        <Link to="/" className="block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Voltar ao portal
        </Link>
      </div>
    </div>
  );
};

export default Login;
