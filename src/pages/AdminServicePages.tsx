import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, FileText, Plus } from "lucide-react";

const ALL_TOPICS = [
  { category: "Elétrica Residencial", services: [
    "Instalação de tomadas e interruptores",
    "Instalação de luminárias e lustres",
    "Instalação de ventiladores de teto",
    "Troca de disjuntores e chaves",
    "Automação residencial",
  ]},
  { category: "Hidráulica Residencial", services: [
    "Instalação de torneiras",
    "Instalação de chuveiros",
    "Reparo de vazamentos",
    "Instalação de pias e lavatórios",
    "Reparos em caixa acoplada",
    "Reparos em caixa d'água",
  ]},
  { category: "Banheiro Completo", services: [
    "Instalação de vaso sanitário",
    "Instalação de aquecedor de água",
    "Instalação de Pias, cubas, Torneiras",
    "Instalação de espelhos e acessórios",
  ]},
  { category: "Montagem de Móveis", services: [
    "Montagem de armários e guarda-roupas",
    "Montagem de camas e berços",
    "Montagem de racks e estantes",
    "Montagem de escrivaninhas e mesas",
    "Montagem de Móveis para Cozinha",
  ]},
  { category: "Instalações Residenciais", services: [
    "Instalação de suportes para TV",
    "Instalação de prateleiras e nichos",
    "Fixação de quadros e espelhos",
    "Instalação de balcões e bancadas",
    "Instalação de persianas e cortinas",
  ]},
  { category: "Utilidades Domésticas", services: [
    "Instalação de Lava-louça",
    "Instalação de Máquina de Lavar Roupa",
    "Máquina Lava e Seca",
    "Instalação de Coifa de Ilha",
    "Coifa de Parede",
  ]},
];

function slugify(text: string): string {
  return text.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminServicePages() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login", { replace: true });
  }, [user, loading, isAdmin, navigate]);

  const { data: existingPages = [] } = useQuery({
    queryKey: ["admin-service-pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("service_pages").select("id, service_name, slug, status");
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!user || !isAdmin) return null;

  const pageMap = new Map(existingPages.map((p) => [p.service_name, p]));

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin"><ArrowLeft className="w-5 h-5" /></Link>
          <span className="font-bold text-lg">Páginas de Serviços</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-muted-foreground mb-8">
          Clique em um tópico para criar ou editar sua página dedicada. Quando publicada, o tópico se torna um link clicável no site.
        </p>

        {ALL_TOPICS.map((group) => (
          <div key={group.category} className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-3">{group.category}</h2>
            <div className="space-y-2">
              {group.services.map((name) => {
                const existing = pageMap.get(name);
                const slug = slugify(name);
                return (
                  <Link
                    key={name}
                    to={existing ? `/admin/servicos/${existing.id}` : `/admin/servicos/novo?service=${encodeURIComponent(name)}&slug=${slug}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:border-gold/50 transition-colors bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {existing ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${existing.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {existing.status === "published" ? "Publicado" : "Rascunho"}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Criar página
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
