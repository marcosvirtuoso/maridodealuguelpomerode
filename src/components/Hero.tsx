import heroImage from "@/assets/hero-handyman.jpg";

const WHATSAPP_URL = "https://wa.me/5547988582480?text=Olá%20Marcos!%20Gostaria%20de%20agendar%20um%20serviço.";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Apresentação - Marido de Aluguel Pomerode"
    >
      {/* Solid dark background */}
      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />

      {/* Decorative gradient orbs */}
      <div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
        style={{ background: "hsl(var(--accent-gold))" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 blur-3xl"
        style={{ background: "hsl(var(--accent-gold))" }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-0 flex flex-col lg:flex-row items-center lg:items-end gap-8 min-h-screen">

        {/* ── Text content ── */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1 pb-16 lg:pb-24 pt-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/10 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
            <span className="text-gold text-xs font-semibold uppercase tracking-widest">
              Somente com Agendamento · Pomerode SC
            </span>
          </div>

          {/* Heading — SEO H1 */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-primary-foreground max-w-2xl mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Reparos Residenciais{" "}
            <span className="text-gradient-gold">Profissionais</span>{" "}
            em Pomerode
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/80 max-w-lg mb-4 leading-relaxed">
            Serviços elétricos, hidráulicos, montagem de móveis e instalações residenciais com{" "}
            <strong className="text-primary-foreground">qualidade, segurança e eficiência</strong>.
            A solução certa para o seu lar.
          </p>

          <p className="text-sm text-gold/90 font-medium mb-10 max-w-md">
            Solução mais eficiente e segura que você procura para o seu lar. ✓
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp pulse-gold flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white rounded-full"
              aria-label="Agendar serviço pelo WhatsApp com Marcos"
            >
              <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
              </svg>
              Agendar pelo WhatsApp
            </a>
            <a
              href="#servicos"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("servicos")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold border-2 border-primary-foreground/30 text-primary-foreground rounded-full hover:border-gold hover:text-gold transition-all duration-300"
              aria-label="Ver todos os serviços oferecidos"
            >
              Ver Serviços
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6 text-primary-foreground/70 text-sm">
            {[
              { icon: "✓", text: "Serviços elétricos com segurança" },
              { icon: "✓", text: "Reparos hidráulicos garantidos" },
              { icon: "✓", text: "Atendimento apenas por agendamento" },
            ].map((item) => (
              <span key={item.text} className="flex items-center gap-1.5">
                <span className="text-gold font-bold">{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* ── Full-body character image ── */}
        <div className="lg:flex-shrink-0 lg:w-[420px] xl:w-[480px] flex items-end justify-center self-end">
          <img
            src={heroImage}
            alt="Marcos, profissional de reparos residenciais em Pomerode SC"
            className="w-64 sm:w-80 lg:w-full h-auto object-contain object-bottom drop-shadow-2xl"
            fetchPriority="high"
            style={{ maxHeight: "calc(100vh - 80px)" }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/40 animate-bounce"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase">Role</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
