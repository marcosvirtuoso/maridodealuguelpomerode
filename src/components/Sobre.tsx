import heroImage from "@/assets/hero-handyman.jpg";
import { MapPin, Instagram, Calendar } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5547988582480?text=Olá%20Marcos!%20Gostaria%20de%20agendar%20um%20serviço.";

export default function Sobre() {
  return (
    <section
      id="sobre"
      className="py-20 sm:py-28"
      aria-labelledby="sobre-heading"
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] max-w-sm mx-auto lg:max-w-none">
              <img
                src={heroImage}
                alt="Marcos — Marido de Aluguel em Pomerode SC"
                className="w-full h-full object-cover object-center"
                loading="lazy"
                itemProp="image"
              />
              {/* Overlay card */}
              <div className="absolute bottom-6 left-6 right-6 bg-primary/90 backdrop-blur-md rounded-2xl p-4 border border-primary-foreground/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">M</span>
                  </div>
                  <div>
                    <p className="text-primary-foreground font-bold text-sm" itemProp="name">Marcos</p>
                    <p className="text-primary-foreground/60 text-xs">Marido de Aluguel · Pomerode, SC</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative accent */}
            <div
              className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-20 blur-2xl -z-10"
              style={{ background: "hsl(var(--accent-gold))" }}
              aria-hidden="true"
            />
            <div
              className="absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-15 blur-2xl -z-10"
              style={{ background: "hsl(var(--primary))" }}
              aria-hidden="true"
            />
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <div>
              <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
                Sobre o profissional
              </span>
              <h2
                id="sobre-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
              >
                Olá, sou o{" "}
                <span className="text-gradient-gold">Marcos</span>
              </h2>
              <div className="section-divider mb-6" style={{ margin: "0 0 1.5rem 0" }} />
            </div>

            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed" itemProp="description">
              Sou especialista em <strong className="text-foreground">serviços residenciais em Pomerode</strong> e região. Atuo com reparos elétricos, hidráulicos, montagem de móveis e instalações residenciais — sempre com foco em qualidade, segurança e eficiência.
            </p>

            <p className="text-muted-foreground text-base leading-relaxed">
              Entendo que sua casa é o lugar mais importante para você e sua família. Por isso, trabalho com <strong className="text-foreground">agendamento exclusivo</strong>, garantindo pontualidade, atenção total ao serviço e respeito ao seu espaço.
            </p>

            <blockquote className="border-l-4 border-gold pl-5 py-1">
              <p className="text-foreground font-medium italic">
                "Solução mais eficiente e segura que você procura para o seu lar."
              </p>
              <footer className="text-gold text-sm font-semibold mt-2">— Marcos</footer>
            </blockquote>

            {/* Info chips */}
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted px-4 py-2 rounded-full border border-border">
                <MapPin className="w-4 h-4 text-gold" aria-hidden="true" />
                <span itemProp="address">Pomerode, SC</span>
              </span>
              <span className="flex items-center gap-2 text-sm font-medium text-foreground bg-muted px-4 py-2 rounded-full border border-border">
                <Calendar className="w-4 h-4 text-gold" aria-hidden="true" />
                Apenas por agendamento
              </span>
            </div>

            {/* Social / CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-white rounded-full"
                aria-label="Agendar serviço com Marcos pelo WhatsApp"
                itemProp="telephone"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
                </svg>
                Falar com Marcos
              </a>
              <a
                href="https://instagram.com/maridodealuguelpomerode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold border-2 border-border text-foreground rounded-full hover:border-gold hover:text-gold transition-all duration-300"
                aria-label="Seguir no Instagram @maridodealuguelpomerode"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
                @maridodealuguelpomerode
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
