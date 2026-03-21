import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Diferenciais from "@/components/Diferenciais";
import Sobre from "@/components/Sobre";
import Mapa from "@/components/Mapa";
import Contato from "@/components/Contato";
import { Helmet } from "react-helmet-async";

export default function ServicePage() {
  const { slug } = useParams();

  const { data: page, isLoading } = useQuery({
    queryKey: ["service-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_pages")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .single();
      if (error || !data) throw new Error("Página não encontrada");
      return data;
    },
    enabled: !!slug,
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

  if (!page) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Página não encontrada</h1>
            <p className="text-muted-foreground">Este serviço ainda não possui uma página dedicada.</p>
            <Link to="/#servicos" className="text-gold hover:underline mt-4 inline-block">← Voltar aos serviços</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.meta_description || page.subtitle || page.title,
    image: page.featured_image_url || "",
    provider: {
      "@type": "LocalBusiness",
      name: "Marido de Aluguel Pomerode",
      telephone: "+5547988582480",
      areaServed: { "@type": "City", name: "Pomerode" },
    },
    areaServed: { "@type": "City", name: "Pomerode" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: window.location.origin },
      { "@type": "ListItem", position: 2, name: "Serviços", item: `${window.location.origin}/#servicos` },
      { "@type": "ListItem", position: 3, name: page.title, item: `${window.location.origin}/servicos/${page.slug}` },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{page.meta_title || page.title} | Marido de Aluguel Pomerode</title>
        <meta name="description" content={page.meta_description || page.subtitle || page.title} />
        {page.meta_keywords && <meta name="keywords" content={page.meta_keywords} />}
        <meta property="og:title" content={page.meta_title || page.title} />
        <meta property="og:description" content={page.meta_description || page.subtitle || ""} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/servicos/${page.slug}`} />
        {page.featured_image_url && <meta property="og:image" content={page.featured_image_url} />}
        <link rel="canonical" href={`${window.location.origin}/servicos/${page.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <Navbar />
      <main className="bg-background">
        {/* Hero Section — Image left, text right */}
        <section style={{ backgroundColor: "hsl(var(--service-hero))" }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
              {/* Image — left side */}
              {page.featured_image_url && (
                <div className="relative flex items-center justify-center overflow-hidden pt-[72px] px-6 min-h-[50vh] lg:min-h-[60vh]">
                  <img
                    src={page.featured_image_url}
                    alt={page.title}
                    className="max-h-[50vh] lg:max-h-[500px] w-auto object-contain rounded-[30px]"
                    loading="eager"
                  />
                </div>
              )}

              {/* Text — right side */}
              <div className={`flex flex-col justify-center px-6 sm:px-10 lg:px-14 pt-[calc(72px+2rem)] pb-12 sm:pt-[calc(72px+2rem)] sm:pb-16 lg:pt-20 lg:pb-20 ${!page.featured_image_url ? 'lg:col-span-2 items-center text-center lg:pt-[calc(72px+3rem)]' : ''}`}>
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="text-sm text-primary-foreground/50 mb-6">
                  <a href="/" className="hover:text-gold transition-colors">Início</a>
                  <span className="mx-2">›</span>
                  <a href="/#servicos" className="hover:text-gold transition-colors">Serviços</a>
                  <span className="mx-2">›</span>
                  <span className="text-primary-foreground/80">{page.title}</span>
                </nav>

                {/* H1 */}
                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {page.title}
                </h1>

                {/* H2 */}
                {page.subtitle && (
                  <h2 className="text-lg sm:text-xl text-primary-foreground/70 mb-8 leading-relaxed max-w-lg">
                    {page.subtitle}
                  </h2>
                )}

                {/* CTA WhatsApp */}
                <a
                  href={`https://wa.me/5547988582480?text=Olá%20Marcos!%20Tenho%20interesse%20em%20${encodeURIComponent(page.service_name)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-white rounded-2xl w-fit"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
                  </svg>
                  Agendar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Content */}
        <section className="py-16 sm:py-20">
          <article className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
              {page.content}
            </div>
          </article>
        </section>

        {/* Sections from homepage */}
        <Diferenciais />
        <Sobre />
        <Mapa />
        <Contato />
      </main>
      <Footer />
    </>
  );
}
