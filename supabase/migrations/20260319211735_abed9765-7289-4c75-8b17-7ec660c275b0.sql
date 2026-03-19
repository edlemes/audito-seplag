-- Table for blocked dates (holidays, maintenance, etc.)
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data date NOT NULL,
  motivo text NOT NULL DEFAULT '',
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(data)
);

ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Anyone can read blocked dates (needed to show in calendar)
CREATE POLICY "Public can view blocked dates"
ON public.blocked_dates FOR SELECT TO public
USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert blocked dates"
ON public.blocked_dates FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete blocked dates"
ON public.blocked_dates FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'));