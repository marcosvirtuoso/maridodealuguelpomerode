import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Servicos from "@/components/Servicos";
import Diferenciais from "@/components/Diferenciais";
import Sobre from "@/components/Sobre";
import Contato from "@/components/Contato";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      {/* SEO meta is set via index.html */}
      <Navbar />
      <main>
        <Hero />
        <Servicos />
        <Diferenciais />
        <Sobre />
        <Contato />
      </main>
      <Footer />
    </>
  );
};

export default Index;
