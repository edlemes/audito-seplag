-- Create noticias table for dynamic news/events on the home page
CREATE TABLE public.noticias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text,
  imagem_url text NOT NULL,
  data_publicacao date NOT NULL DEFAULT CURRENT_DATE,
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage noticias" ON public.noticias
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view active noticias" ON public.noticias
  FOR SELECT TO public
  USING (ativo = true);

CREATE TRIGGER update_noticias_updated_at
  BEFORE UPDATE ON public.noticias
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();