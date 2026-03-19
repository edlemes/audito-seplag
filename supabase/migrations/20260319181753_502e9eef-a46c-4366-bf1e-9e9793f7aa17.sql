-- Enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'readonly');

-- Enum for inspection status
CREATE TYPE public.status_item AS ENUM ('bom', 'manutencao', 'ajuste');

-- Enum for solicitation status
CREATE TYPE public.status_solicitacao AS ENUM ('pendente', 'aprovada', 'recusada', 'cancelada');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Solicitações do Auditório
CREATE TABLE public.solicitacoes_auditorio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nome_solicitante TEXT NOT NULL,
  cpf TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  orgao TEXT NOT NULL,
  titulo_evento TEXT NOT NULL,
  descricao_evento TEXT,
  data_evento DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  num_participantes INTEGER,
  secretaria_atendida TEXT NOT NULL,
  termo_assinado_url TEXT,
  status status_solicitacao NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.solicitacoes_auditorio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create solicitations" ON public.solicitacoes_auditorio FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view own solicitations" ON public.solicitacoes_auditorio FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'readonly'));
CREATE POLICY "Admins can update solicitations" ON public.solicitacoes_auditorio FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete solicitations" ON public.solicitacoes_auditorio FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Vistoria de Equipamentos
CREATE TABLE public.vistoria_equipamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitacao_id UUID REFERENCES public.solicitacoes_auditorio(id) ON DELETE CASCADE,
  inspector_id UUID NOT NULL REFERENCES auth.users(id),
  tipo_vistoria TEXT NOT NULL CHECK (tipo_vistoria IN ('pre_evento', 'pos_evento')),
  ar_condicionado status_item NOT NULL DEFAULT 'bom',
  microfones status_item NOT NULL DEFAULT 'bom',
  projetor status_item NOT NULL DEFAULT 'bom',
  limpeza_cadeiras status_item NOT NULL DEFAULT 'bom',
  iluminacao status_item NOT NULL DEFAULT 'bom',
  som status_item NOT NULL DEFAULT 'bom',
  tela_projecao status_item NOT NULL DEFAULT 'bom',
  rede_wifi status_item NOT NULL DEFAULT 'bom',
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vistoria_equipamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage vistorias" ON public.vistoria_equipamentos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Readonly can view vistorias" ON public.vistoria_equipamentos FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'readonly'));

-- Feedback do Usuário
CREATE TABLE public.feedback_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nota_geral INTEGER NOT NULL CHECK (nota_geral BETWEEN 1 AND 5),
  nota_infraestrutura INTEGER CHECK (nota_infraestrutura BETWEEN 1 AND 5),
  nota_atendimento INTEGER CHECK (nota_atendimento BETWEEN 1 AND 5),
  nota_equipamentos INTEGER CHECK (nota_equipamentos BETWEEN 1 AND 5),
  comentario TEXT,
  sugestao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.feedback_usuario ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can submit feedback" ON public.feedback_usuario FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can view all feedback" ON public.feedback_usuario FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'readonly'));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_solicitacoes_updated_at BEFORE UPDATE ON public.solicitacoes_auditorio FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();