import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, FileText, Pencil } from "lucide-react";

export default function AdminArticles() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login", { replace: true });
  }, [user, loading, isAdmin, navigate]);

  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*, categories(name, slug)")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin"><ArrowLeft className="w-5 h-5" /></Link>
          <FileText className="w-5 h-5 text-gold" />
          <span className="font-bold text-lg">Artigos</span>
        </div>
        <Link to="/admin/artigos/novo">
          <Button size="sm" className="bg-gold hover:bg-gold/90 text-primary font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Novo Artigo
          </Button>
        </Link>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum artigo criado ainda.</p>
            <Link to="/admin/artigos/novo">
              <Button className="mt-4 bg-gold hover:bg-gold/90 text-primary font-semibold">
                <Plus className="w-4 h-4 mr-1" /> Criar Primeiro Artigo
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div key={article.id} className="bg-card border rounded-lg p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={article.status === "published" ? "default" : "secondary"}>
                      {article.status === "published" ? "Publicado" : "Rascunho"}
                    </Badge>
                    {article.categories && (
                      <span className="text-xs text-gold font-medium">{(article.categories as any).name}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{article.title}</h3>
                  {article.subtitle && <p className="text-sm text-muted-foreground truncate">{article.subtitle}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    /{(article.categories as any)?.slug}/{article.slug}
                  </p>
                </div>
                <Link to={`/admin/artigos/${article.id}`}>
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
