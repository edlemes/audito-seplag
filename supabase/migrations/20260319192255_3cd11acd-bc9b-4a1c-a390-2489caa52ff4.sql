
-- Storage bucket for CMS media
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-media', 'cms-media', true);

-- Table for CMS content (carousel slides, logo, etc.)
CREATE TABLE public.cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL, -- 'carousel', 'logo'
  titulo text,
  subtitulo text,
  imagem_url text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- Anyone can view active content
CREATE POLICY "Public can view active CMS content"
ON public.cms_content FOR SELECT TO public
USING (ativo = true);

-- Admins can manage all CMS content
CREATE POLICY "Admins can manage CMS content"
ON public.cms_content FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Storage policies for cms-media bucket
CREATE POLICY "Public can view cms media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'cms-media');

CREATE POLICY "Admins can upload cms media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cms media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'cms-media' AND public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_cms_content_updated_at
BEFORE UPDATE ON public.cms_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
