import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/slugify";
import { ArrowLeft, Plus, Trash2, FolderOpen } from "lucide-react";

export default function AdminCategories() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  const addMutation = useMutation({
    mutationFn: async () => {
      const slug = slugify(name);
      const { error } = await supabase.from("categories").insert({ name, slug, description: description || null });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      setName("");
      setDescription("");
      toast({ title: "Categoria criada com sucesso!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Categoria removida!" });
    },
    onError: (e: Error) => toast({ title: "Erro", description: e.message, variant: "destructive" }),
  });

  if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center gap-4">
        <Link to="/admin"><ArrowLeft className="w-5 h-5" /></Link>
        <FolderOpen className="w-5 h-5 text-gold" />
        <span className="font-bold text-lg">Categorias</span>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-card rounded-xl border p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">Nova Categoria</h2>
          <form
            onSubmit={(e) => { e.preventDefault(); addMutation.mutate(); }}
            className="space-y-4"
          >
            <div>
              <Label className="text-foreground">Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="text-black" placeholder="Ex: Elétrica" />
            </div>
            <div>
              <Label className="text-foreground">Descrição (opcional)</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="text-black" placeholder="Breve descrição da categoria" />
            </div>
            <p className="text-xs text-muted-foreground">Slug: <code className="bg-muted px-1 rounded">{slugify(name) || "..."}</code></p>
            <Button type="submit" disabled={!name.trim() || addMutation.isPending} className="bg-gold hover:bg-gold/90 text-primary font-semibold">
              <Plus className="w-4 h-4 mr-1" /> Criar Categoria
            </Button>
          </form>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-4">Categorias Existentes</h2>
        {categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma categoria criada ainda.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">/{cat.slug}</p>
                  {cat.description && <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { if (confirm("Remover esta categoria e todos os artigos vinculados?")) deleteMutation.mutate(cat.id); }}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
