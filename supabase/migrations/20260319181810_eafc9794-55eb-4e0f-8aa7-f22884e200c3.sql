-- Fix INSERT policies to require user_id matches auth.uid()
DROP POLICY "Anyone can create solicitations" ON public.solicitacoes_auditorio;
CREATE POLICY "Authenticated users can create solicitations" ON public.solicitacoes_auditorio FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY "Anyone authenticated can submit feedback" ON public.feedback_usuario;
CREATE POLICY "Authenticated users can submit feedback" ON public.feedback_usuario FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);