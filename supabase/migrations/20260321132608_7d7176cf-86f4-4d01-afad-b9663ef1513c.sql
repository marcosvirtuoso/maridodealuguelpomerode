
CREATE TABLE public.service_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  content text NOT NULL DEFAULT '',
  featured_image_url text,
  meta_title text,
  meta_description text,
  meta_keywords text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published service pages" ON public.service_pages
  FOR SELECT TO public USING (status = 'published' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert service pages" ON public.service_pages
  FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update service pages" ON public.service_pages
  FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete service pages" ON public.service_pages
  FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_service_pages_updated_at
  BEFORE UPDATE ON public.service_pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
