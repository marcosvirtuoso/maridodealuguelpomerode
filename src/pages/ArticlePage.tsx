import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CANONICAL_HOST, buildCanonical } from "@/lib/seo";

export default function ArticlePage() {
  const { categorySlug, articleSlug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", categorySlug, articleSlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", categorySlug!)
        .single();

      if (!category) throw new Error("Categoria não encontrada");

      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("category_id", category.id)
        .eq("slug", articleSlug!)
        .eq("status", "published")
        .single();

      if (error || !data) throw new Error("Artigo não encontrado");

      return { ...data, category };
    },
    enabled: !!categorySlug && !!articleSlug,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Carregando artigo...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Artigo não encontrado</h1>
            <p className="text-muted-foreground">O artigo que você procura não existe ou não está publicado.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.meta_description || article.subtitle || "",
    image: article.og_image_url || article.featured_image_url || "",
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: "Marcos — Marido de Aluguel Pomerode",
    },
    publisher: {
      "@type": "Organization",
      name: "NovoLar Instalações",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": buildCanonical(`/${article.category.slug}/${article.slug}`),
    },
    keywords: article.meta_keywords || "",
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: CANONICAL_HOST + "/" },
      { "@type": "ListItem", position: 2, name: article.category.name, item: buildCanonical(`/${article.category.slug}`) },
      { "@type": "ListItem", position: 3, name: article.title, item: buildCanonical(`/${article.category.slug}/${article.slug}`) },
    ],
  };

  return (
    <>
      <SEO
        title={`${article.meta_title || article.title} | NovoLar Instalações Pomerode`}
        description={article.meta_description || article.subtitle || article.title}
        path={`/${article.category.slug}/${article.slug}`}
        image={article.og_image_url || article.featured_image_url || undefined}
        type="article"
        keywords={article.meta_keywords || undefined}
        jsonLd={[jsonLd, breadcrumbLd]}
      />

      <Navbar />
      <main className="bg-background min-h-screen">
        <article className="max-w-3xl mx-auto px-4 py-16 sm:py-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-gold transition-colors">Início</a>
            <span className="mx-2">›</span>
            <a href={`/${article.category.slug}`} className="hover:text-gold transition-colors capitalize">{article.category.name}</a>
            <span className="mx-2">›</span>
            <span className="text-foreground">{article.title}</span>
          </nav>

          {/* Featured Image */}
          {article.featured_image_url && (
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full rounded-xl mb-8 max-h-96 object-cover"
              loading="lazy"
            />
          )}

          {/* Category badge */}
          <span className="inline-block text-xs font-semibold text-gold uppercase tracking-wider mb-3">
            {article.category.name}
          </span>

          {/* H1 Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {article.title}
          </h1>

          {/* H2 Subtitle */}
          {article.subtitle && (
            <h2 className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {article.subtitle}
            </h2>
          )}

          {/* Published date */}
          {article.published_at && (
            <time dateTime={article.published_at} className="text-xs text-muted-foreground block mb-8">
              Publicado em {new Date(article.published_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
            </time>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
