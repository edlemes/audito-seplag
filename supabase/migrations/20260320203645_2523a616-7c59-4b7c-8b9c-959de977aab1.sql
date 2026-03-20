
ALTER TABLE public.feedback_usuario
  ADD COLUMN IF NOT EXISTS nota_logistica integer,
  ADD COLUMN IF NOT EXISTS nota_tecnologia integer,
  ADD COLUMN IF NOT EXISTS nota_conforto integer,
  ADD COLUMN IF NOT EXISTS suporte_tecnico boolean,
  ADD COLUMN IF NOT EXISTS nota_temperatura integer,
  ADD COLUMN IF NOT EXISTS nps_score integer,
  ADD COLUMN IF NOT EXISTS sugestao_recurso text;
