import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Servicos from "@/components/Servicos";
import Diferenciais from "@/components/Diferenciais";
import Sobre from "@/components/Sobre";
import Mapa from "@/components/Mapa";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { localBusinessJsonLd, CANONICAL_HOST } from "@/lib/seo";

const Index = () => {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NovoLar Instalações",
    url: CANONICAL_HOST,
    inLanguage: "pt-BR",
  };
  return (
    <>
      <SEO
        title="NovoLar Instalações | Marido de Aluguel em Pomerode SC"
        description="Instalações e reparos residenciais em Pomerode e região: elétrica, hidráulica, montagem de móveis e instalações em geral. Atendimento por agendamento."
        path="/"
        type="website"
        jsonLd={[localBusinessJsonLd, websiteJsonLd]}
      />
      <Navbar />
      <main className="pt-16 sm:pt-[72px]">
        <Hero />
        <Servicos />
        <Diferenciais />
        <Sobre />
        <Mapa />
        <Contato />
      </main>
      <Footer />
    </>
  );
};

export default Index;
