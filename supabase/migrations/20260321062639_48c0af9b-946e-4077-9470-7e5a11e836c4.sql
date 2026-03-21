
-- Create storage bucket for article images
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true);

-- Allow authenticated users to upload images
CREATE POLICY "Admins can upload article images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'articles' AND public.has_role(auth.uid(), 'admin')
);

-- Allow anyone to view article images
CREATE POLICY "Anyone can view article images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'articles');

-- Allow admins to delete article images
CREATE POLICY "Admins can delete article images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'articles' AND public.has_role(auth.uid(), 'admin'));

-- Allow admins to update article images
CREATE POLICY "Admins can update article images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'articles' AND public.has_role(auth.uid(), 'admin'));
