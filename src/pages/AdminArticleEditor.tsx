import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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

function ImageUpload({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Erro", description: "Selecione um arquivo de imagem.", variant: "destructive" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Erro", description: "A imagem deve ter no máximo 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = `images/${fileName}`;

      const { error } = await supabase.storage.from("articles").upload(filePath, file);
      if (error) throw error;

      const { data: urlData } = supabase.storage.from("articles").getPublicUrl(filePath);
      onChange(urlData.publicUrl);
      toast({ title: "Imagem enviada com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro ao enviar imagem", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <Label className="text-foreground flex items-center gap-1">
        <Image className="w-4 h-4" /> {label}
      </Label>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

      {value ? (
        <div className="mt-2 relative inline-block">
          <img src={value} alt="Preview" className="rounded-lg max-h-48 object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/80"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="mt-1 w-full border-dashed h-24 flex flex-col gap-1"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs">{uploading ? "Enviando..." : "Clique para enviar imagem"}</span>
        </Button>
      )}
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </div>
  );
}

export default function AdminArticleEditor() {
  const { id } = useParams();
  const isEditing = id && id !== "novo";
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [featuredImageUrl, setFeaturedImageUrl] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login");
  }, [user, loading, isAdmin, navigate]);

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: article } = useQuery({
    queryKey: ["admin-article", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!isEditing && isAdmin,
  });

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSubtitle(article.subtitle ?? "");
      setCategoryId(article.category_id);
      setContent(article.content);
      setFeaturedImageUrl(article.featured_image_url ?? "");
      setMetaTitle(article.meta_title ?? "");
      setMetaDescription(article.meta_description ?? "");
      setMetaKeywords(article.meta_keywords ?? "");
      setOgImageUrl(article.og_image_url ?? "");
      setStatus(article.status as "draft" | "published");
    }
  }, [article]);

  const slug = slugify(title);
  const selectedCategory = categories.find((c) => c.id === categoryId);

  const saveMutation = useMutation({
    mutationFn: async (publishNow: boolean) => {
      const newStatus = publishNow ? "published" : status;
      const payload = {
        title,
        subtitle: subtitle || null,
        slug,
        category_id: categoryId,
        content,
        featured_image_url: featuredImageUrl || null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || subtitle || title,
        meta_keywords: metaKeywords || null,
        og_image_url: ogImageUrl || featuredImageUrl || null,
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null,
        user_id: user!.id,
      };

      if (isEditing) {
        const { error } = await supabase.from("articles").update(payload).eq("id", id!);
        if (error) {
          console.error("Update error:", error);
          throw new Error(error.message);
        }
      } else {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) {
          console.error("Insert error:", error);
          throw new Error(error.message);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: isEditing ? "Artigo atualizado!" : "Artigo criado!" });
      navigate("/admin/artigos");
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("articles").delete().eq("id", id!);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: "Artigo excluído!" });
      navigate("/admin/artigos");
    },
  });

  if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  const previewUrl = selectedCategory ? `/${selectedCategory.slug}/${slug}` : "";

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/artigos"><ArrowLeft className="w-5 h-5" /></Link>
          <span className="font-bold text-lg">{isEditing ? "Editar Artigo" : "Novo Artigo"}</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing && status === "published" && (
            <Link to={previewUrl} target="_blank">
              <Button variant="ghost" size="sm" className="text-primary-foreground/70 hover:text-gold">
                <Eye className="w-4 h-4 mr-1" /> Ver
              </Button>
            </Link>
          )}
          {isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { if (confirm("Excluir este artigo?")) deleteMutation.mutate(); }}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-1" /> Excluir
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(false); }} className="space-y-8">
          {/* Main Content */}
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              📝 Conteúdo do Artigo
            </h2>

            <div>
              <Label className="text-foreground">Categoria *</Label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full mt-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-black"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-foreground">Título (H1) *</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required className="text-black" placeholder="Título principal do artigo" />
              <p className="text-xs text-muted-foreground mt-1">Este será o H1 da página — a tag mais importante para SEO.</p>
            </div>

            <div>
              <Label className="text-foreground">Subtítulo (H2)</Label>
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="text-black" placeholder="Subtítulo complementar" />
              <p className="text-xs text-muted-foreground mt-1">Aparece como H2 — reforça palavras-chave secundárias.</p>
            </div>

            <ImageUpload
              label="Imagem Destacada"
              value={featuredImageUrl}
              onChange={setFeaturedImageUrl}
              hint="Imagem principal do artigo — usada como destaque e og:image. Máx 5MB."
            />

            <div>
              <Label className="text-foreground">Conteúdo do Artigo *</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="text-black min-h-[300px]"
                placeholder="Escreva o conteúdo do artigo aqui. Use parágrafos para melhor legibilidade..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Dica SEO: Use parágrafos curtos, inclua palavras-chave naturalmente, e mantenha o conteúdo acima de 300 palavras.
              </p>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              🔍 Configurações SEO
            </h2>

            <div>
              <Label className="text-foreground">Meta Title (título na aba do navegador)</Label>
              <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="text-black" placeholder={title || "Será usado o título do artigo"} />
              <p className="text-xs text-muted-foreground mt-1">
                Ideal: até 60 caracteres. {metaTitle.length > 0 && <span className={metaTitle.length > 60 ? "text-destructive" : "text-green-600"}>{metaTitle.length}/60</span>}
              </p>
            </div>

            <div>
              <Label className="text-foreground">Meta Description</Label>
              <Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="text-black min-h-[80px]" placeholder="Descrição que aparece nos resultados do Google..." />
              <p className="text-xs text-muted-foreground mt-1">
                Ideal: até 160 caracteres. {metaDescription.length > 0 && <span className={metaDescription.length > 160 ? "text-destructive" : "text-green-600"}>{metaDescription.length}/160</span>}
              </p>
            </div>

            <div>
              <Label className="text-foreground">Palavras-chave (separadas por vírgula)</Label>
              <Input value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} className="text-black" placeholder="marido de aluguel, pomerode, reparos residenciais" />
              <p className="text-xs text-muted-foreground mt-1">Ajudam robôs a entender o tema. Separe com vírgulas.</p>
            </div>

            <ImageUpload
              label="Imagem OG (Open Graph)"
              value={ogImageUrl}
              onChange={setOgImageUrl}
              hint="Imagem para compartilhamento em redes sociais. Se vazio, será usada a imagem destacada."
            />

            {/* URL Preview */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-semibold text-foreground mb-2">Preview da URL:</p>
              <code className="text-sm text-gold break-all">
                {selectedCategory ? `/${selectedCategory.slug}/${slug || "..."}` : "Selecione uma categoria"}
              </code>
            </div>

            {/* Google Preview */}
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs font-semibold text-foreground mb-3">Preview no Google:</p>
              <div>
                <p className="text-blue-700 text-lg leading-tight truncate">{metaTitle || title || "Título do Artigo"}</p>
                <p className="text-green-700 text-sm">{`maridodealuguelpomerode.lovable.app${previewUrl}`}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{metaDescription || subtitle || "Descrição do artigo aparecerá aqui..."}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={!title.trim() || !categoryId || saveMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              <Save className="w-4 h-4 mr-2" /> Salvar Rascunho
            </Button>
            <Button
              type="button"
              onClick={() => saveMutation.mutate(true)}
              disabled={!title.trim() || !categoryId || saveMutation.isPending}
              className="bg-gold hover:bg-gold/90 text-primary font-semibold flex-1"
            >
              <Eye className="w-4 h-4 mr-2" /> Publicar Agora
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
