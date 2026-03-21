import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

export default function CategoryPage() {
  const { categorySlug } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["category-articles", categorySlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", categorySlug!)
        .single();

      if (!category) throw new Error("Categoria não encontrada");

      const { data: articles } = await supabase
        .from("articles")
        .select("*")
        .eq("category_id", category.id)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      return { category, articles: articles ?? [] };
    },
    enabled: !!categorySlug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Carregando...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <h1 className="text-2xl font-bold text-foreground">Categoria não encontrada</h1>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{data.category.name} | Marido de Aluguel Pomerode</title>
        <meta name="description" content={data.category.description || `Artigos sobre ${data.category.name} — Marido de Aluguel Pomerode`} />
      </Helmet>

      <Navbar />
      <main className="bg-background min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-gold transition-colors">Início</a>
            <span className="mx-2">›</span>
            <span className="text-foreground">{data.category.name}</span>
          </nav>

          <h1 className="text-3xl font-bold text-foreground mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            {data.category.name}
          </h1>

          {data.category.description && (
            <p className="text-muted-foreground mb-10 text-lg">{data.category.description}</p>
          )}

          {data.articles.length === 0 ? (
            <p className="text-muted-foreground">Nenhum artigo publicado nesta categoria.</p>
          ) : (
            <div className="grid gap-6">
              {data.articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/${data.category.slug}/${article.slug}`}
                  className="bg-card border rounded-xl p-6 hover:border-gold/40 transition-all group"
                >
                  <div className="flex gap-5">
                    {article.featured_image_url && (
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-32 h-24 object-cover rounded-lg flex-shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-foreground group-hover:text-gold transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                      {article.subtitle && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.subtitle}</p>
                      )}
                      {article.published_at && (
                        <time dateTime={article.published_at} className="text-xs text-muted-foreground mt-2 block">
                          {new Date(article.published_at).toLocaleDateString("pt-BR")}
                        </time>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
