import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, LogOut, FileText, FolderOpen, Plus } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, loading, isAdmin, navigate]);

  const { data: articleCount } = useQuery({
    queryKey: ["admin-article-count"],
    queryFn: async () => {
      const { count } = await supabase.from("articles").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    enabled: isAdmin,
  });

  const { data: categoryCount } = useQuery({
    queryKey: ["admin-category-count"],
    queryFn: async () => {
      const { count } = await supabase.from("categories").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
    enabled: isAdmin,
  });

  if (loading || !isAdmin) return <div className="min-h-screen bg-background flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-gold" />
          </div>
          <span className="font-bold text-lg">Painel Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-primary-foreground/70 hover:text-gold transition-colors">Ver Site</Link>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/admin/login"); }} className="text-primary-foreground/70 hover:text-gold">
            <LogOut className="w-4 h-4 mr-1" /> Sair
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Artigos</CardTitle>
              <FileText className="w-5 h-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{articleCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Categorias</CardTitle>
              <FolderOpen className="w-5 h-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{categoryCount ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/admin/artigos">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base">
              <FileText className="w-5 h-5 mr-2" /> Gerenciar Artigos
            </Button>
          </Link>
          <Link to="/admin/categorias">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-base">
              <FolderOpen className="w-5 h-5 mr-2" /> Gerenciar Categorias
            </Button>
          </Link>
          <Link to="/admin/artigos/novo">
            <Button className="w-full bg-gold hover:bg-gold/90 text-primary h-14 text-base font-semibold">
              <Plus className="w-5 h-5 mr-2" /> Novo Artigo
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
