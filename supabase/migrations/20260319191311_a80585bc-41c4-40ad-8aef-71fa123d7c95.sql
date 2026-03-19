
-- Revoke has_role execute from anonymous users
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;

-- Add text length constraints via validation triggers
CREATE OR REPLACE FUNCTION public.validate_solicitacao()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF char_length(NEW.nome_solicitante) > 200 THEN
    RAISE EXCEPTION 'nome_solicitante exceeds 200 characters';
  END IF;
  IF char_length(NEW.cpf) > 20 THEN
    RAISE EXCEPTION 'cpf exceeds 20 characters';
  END IF;
  IF char_length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'email exceeds 255 characters';
  END IF;
  IF NEW.telefone IS NOT NULL AND char_length(NEW.telefone) > 30 THEN
    RAISE EXCEPTION 'telefone exceeds 30 characters';
  END IF;
  IF char_length(NEW.orgao) > 200 THEN
    RAISE EXCEPTION 'orgao exceeds 200 characters';
  END IF;
  IF char_length(NEW.titulo_evento) > 300 THEN
    RAISE EXCEPTION 'titulo_evento exceeds 300 characters';
  END IF;
  IF NEW.descricao_evento IS NOT NULL AND char_length(NEW.descricao_evento) > 5000 THEN
    RAISE EXCEPTION 'descricao_evento exceeds 5000 characters';
  END IF;
  IF char_length(NEW.secretaria_atendida) > 300 THEN
    RAISE EXCEPTION 'secretaria_atendida exceeds 300 characters';
  END IF;
  IF NEW.horario_fim <= NEW.horario_inicio THEN
    RAISE EXCEPTION 'horario_fim must be after horario_inicio';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_solicitacao
BEFORE INSERT OR UPDATE ON public.solicitacoes_auditorio
FOR EACH ROW EXECUTE FUNCTION public.validate_solicitacao();

-- Add feedback text length validation trigger
CREATE OR REPLACE FUNCTION public.validate_feedback()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.comentario IS NOT NULL AND char_length(NEW.comentario) > 2000 THEN
    RAISE EXCEPTION 'comentario exceeds 2000 characters';
  END IF;
  IF NEW.sugestao IS NOT NULL AND char_length(NEW.sugestao) > 2000 THEN
    RAISE EXCEPTION 'sugestao exceeds 2000 characters';
  END IF;
  IF NEW.nota_geral < 1 OR NEW.nota_geral > 5 THEN
    RAISE EXCEPTION 'nota_geral must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_feedback
BEFORE INSERT OR UPDATE ON public.feedback_usuario
FOR EACH ROW EXECUTE FUNCTION public.validate_feedback();
