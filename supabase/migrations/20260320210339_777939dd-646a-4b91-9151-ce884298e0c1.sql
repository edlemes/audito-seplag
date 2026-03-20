ALTER TABLE public.feedback_usuario
  ADD COLUMN IF NOT EXISTS recursos_utilizados text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS falha_tecnica boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS descricao_falha text;

CREATE OR REPLACE FUNCTION public.validate_feedback()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.comentario IS NOT NULL AND char_length(NEW.comentario) > 2000 THEN
    RAISE EXCEPTION 'comentario exceeds 2000 characters';
  END IF;
  IF NEW.sugestao IS NOT NULL AND char_length(NEW.sugestao) > 2000 THEN
    RAISE EXCEPTION 'sugestao exceeds 2000 characters';
  END IF;
  IF NEW.sugestao_recurso IS NOT NULL AND char_length(NEW.sugestao_recurso) > 2000 THEN
    RAISE EXCEPTION 'sugestao_recurso exceeds 2000 characters';
  END IF;
  IF NEW.descricao_falha IS NOT NULL AND char_length(NEW.descricao_falha) > 2000 THEN
    RAISE EXCEPTION 'descricao_falha exceeds 2000 characters';
  END IF;
  IF NEW.nota_geral < 1 OR NEW.nota_geral > 5 THEN
    RAISE EXCEPTION 'nota_geral must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$function$;