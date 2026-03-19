import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import FloatingButtons from "@/components/portal/FloatingButtons";
import Index from "./pages/Index.tsx";
import Agendamento from "./pages/Agendamento.tsx";
import Orientacoes from "./pages/Orientacoes.tsx";
import Avaliacao from "./pages/Avaliacao.tsx";
import Login from "./pages/Login.tsx";
import Admin from "./pages/Admin.tsx";
import GestaoUsuarios from "./pages/GestaoUsuarios.tsx";
import Vistoria from "./pages/Vistoria.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/orientacoes" element={<Orientacoes />} />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="/admin/usuarios" element={<ProtectedRoute requireAdmin><GestaoUsuarios /></ProtectedRoute>} />
            <Route path="/admin/vistoria" element={<ProtectedRoute requireAdmin><Vistoria /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingButtons />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
