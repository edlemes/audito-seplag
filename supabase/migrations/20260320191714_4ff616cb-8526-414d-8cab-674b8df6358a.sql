
CREATE TABLE public.inscricoes_evento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  orgao TEXT NOT NULL,
  cargo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.inscricoes_evento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert inscricoes"
ON public.inscricoes_evento
FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view inscricoes"
ON public.inscricoes_evento
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'readonly'));

CREATE POLICY "Admins can delete inscricoes"
ON public.inscricoes_evento
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
