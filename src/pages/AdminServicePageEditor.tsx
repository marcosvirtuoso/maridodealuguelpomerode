import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/slugify";
import { ArrowLeft, Save, Eye, Trash2, Image, Upload, X } from "lucide-react";

function ImageUpload({ label, value, onChange, hint }: { label: string; value: string; onChange: (url: string) => void; hint: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Erro", description: "Selecione uma imagem.", variant: "destructive" }); return; }
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Erro", description: "Máximo 5MB.", variant: "destructive" }); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const { error } = await supabase.storage.from("articles").upload(`images/${fileName}`, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("articles").getPublicUrl(`images/${fileName}`);
      onChange(urlData.publicUrl);
      toast({ title: "Imagem enviada!" });
    } catch (err: any) { toast({ title: "Erro", description: err.message, variant: "destructive" }); }
    finally { setUploading(false); if (inputRef.current) inputRef.current.value = ""; }
  };

  return (
    <div>
      <Label className="text-foreground flex items-center gap-1"><Image className="w-4 h-4" /> {label}</Label>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      {value ? (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="Preview" className="rounded-lg max-h-48 object-cover" />
          <button type="button" onClick={() => onChange("")} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"><X className="w-3 h-3" /></button>
        </div>
      ) : (
        <Button type="button" variant="outline" className="mt-1 w-full border-dashed h-24 flex flex-col gap-1" disabled={uploading} onClick={() => inputRef.current?.click()}>
          <Upload className="w-5 h-5" /><span className="text-xs">{uploading ? "Enviando..." : "Clique para enviar imagem"}</span>
        </Button>
      )}
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

export default function AdminServicePageEditor() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEditing = id && id !== "novo";
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const prefilledName = searchParams.get("service") || "";
  const prefilledSlug = searchParams.get("slug") || "";

  const [serviceName, setServiceName] = useState(prefilledName);
  const [slug, setSlug] = useState(prefilledSlug || slugify(prefilledName));
  const [title, setTitle] = useState(prefilledName);
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login", { replace: true });
  }, [user, loading, isAdmin, navigate]);

  const { data: page } = useQuery({
    queryKey: ["admin-service-page", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_pages").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!isEditing && isAdmin,
  });

  useEffect(() => {
    if (page) {
      setServiceName(page.service_name);
      setSlug(page.slug);
      setTitle(page.title);
      setSubtitle(page.subtitle ?? "");
      setContent(page.content);
      setFeaturedImageUrl(page.featured_image_url ?? "");
      setMetaTitle(page.meta_title ?? "");
      setMetaDescription(page.meta_description ?? "");
      setMetaKeywords(page.meta_keywords ?? "");
      setStatus(page.status as "draft" | "published");
    }
  }, [page]);

  const slug = isEditing && page ? page.slug : (prefilledSlug || slugify(serviceName));

  const saveMutation = useMutation({
    mutationFn: async (publishNow: boolean) => {
      const newStatus = publishNow ? "published" : status;
      const payload = {
        service_name: serviceName,
        slug,
        title,
        subtitle: subtitle || null,
        content,
        featured_image_url: featuredImageUrl || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || subtitle || title,
        meta_keywords: metaKeywords || null,
        status: newStatus,
      };
      if (isEditing) {
        const { error } = await supabase.from("service_pages").update(payload).eq("id", id!);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("service_pages").insert(payload);
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-pages"] });
      toast({ title: isEditing ? "Página atualizada!" : "Página criada!" });
      navigate("/admin/servicos");
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("service_pages").delete().eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-service-pages"] });
      toast({ title: "Página excluída!" });
      navigate("/admin/servicos");
    },
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user || !isAdmin) return null;

  const previewUrl = `/servicos/${slug}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/servicos"><ArrowLeft className="w-5 h-5" /></Link>
          <span className="font-bold text-lg">{isEditing ? "Editar Página" : "Nova Página de Serviço"}</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && status === "published" && (
            <Link to={previewUrl} target="_blank">
              <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-gold"><Eye className="w-4 h-4 mr-1" /> Ver</Button>
            </Link>
          )}
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={() => { if (confirm("Excluir esta página?")) deleteMutation.mutate(); }} className="text-red-400 hover:text-red-300">
              <Trash2 className="w-4 h-4 mr-1" /> Excluir
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(false); }} className="space-y-8">
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">📝 Conteúdo da Página</h2>

            <div>
              <Label className="text-foreground">Tópico do Serviço</Label>
              <Input value={serviceName} readOnly className="text-black bg-muted" />
              <p className="text-xs text-muted-foreground mt-1">Nome exato do tópico no card de serviços (não editável).</p>
            </div>

            <div>
              <Label className="text-foreground">Título (H1) *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="text-black" placeholder="Título principal da página" />
            </div>

            <div>
              <Label className="text-foreground">Subtítulo (H2)</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="text-black" placeholder="Subtítulo complementar" />
            </div>

            <ImageUpload label="Imagem Destacada" value={featuredImageUrl} onChange={setFeaturedImageUrl} hint="Imagem principal da página. Máx 5MB." />

            <div>
              <Label className="text-foreground">Conteúdo *</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} required className="text-black min-h-[300px]" placeholder="Descreva o serviço em detalhes..." />
              <p className="text-xs text-muted-foreground mt-1">Dica SEO: parágrafos curtos, palavras-chave naturais, acima de 300 palavras.</p>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground">🔍 Configurações SEO</h2>

            <div>
              <Label className="text-foreground">Meta Title</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="text-black" placeholder={title || "Será usado o título"} />
              <p className="text-xs text-muted-foreground mt-1">Até 60 caracteres. {metaTitle.length > 0 && <span className={metaTitle.length > 60 ? "text-destructive" : "text-green-600"}>{metaTitle.length}/60</span>}</p>
            </div>

            <div>
              <Label className="text-foreground">Meta Description</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="text-black min-h-[80px]" placeholder="Descrição para o Google..." />
              <p className="text-xs text-muted-foreground mt-1">Até 160 caracteres. {metaDescription.length > 0 && <span className={metaDescription.length > 160 ? "text-destructive" : "text-green-600"}>{metaDescription.length}/160</span>}</p>
            </div>

            <div>
              <Label className="text-foreground">Palavras-chave</Label>
              <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className="text-black" placeholder="instalação, pomerode, serviço residencial" />
            </div>

            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-semibold text-foreground mb-2">Preview da URL:</p>
              <code className="text-sm text-gold break-all">/servicos/{slug || "..."}</code>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs font-semibold text-foreground mb-3">Preview no Google:</p>
              <div>
                <p className="text-blue-700 text-lg leading-tight truncate">{metaTitle || title || "Título da Página"}</p>
                <p className="text-green-700 text-sm">maridodealuguelpomerode.lovable.app/servicos/{slug}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{metaDescription || subtitle || "Descrição aparecerá aqui..."}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={!title.trim() || saveMutation.isPending} className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
              <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button type="button" onClick={() => saveMutation.mutate(true)} disabled={!title.trim() || saveMutation.isPending} className="bg-gold hover:bg-gold/90 text-primary font-semibold flex-1">
              <Eye className="w-4 h-4 mr-2" /> Publicar Agora
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
