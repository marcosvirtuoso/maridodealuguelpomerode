import { Calendar, MessageCircle, MapPin, Instagram, Clock } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5547988582480?text=Olá%20Marcos!%20Gostaria%20de%20agendar%20um%20serviço.";

export default function Contato() {
  return (
    <section
      id="contato"
      className="py-20 sm:py-28 bg-primary relative overflow-hidden"
      aria-labelledby="contato-heading"
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--accent-gold))" }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--accent-gold))" }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Agende seu serviço
          </span>
          <h2
            id="contato-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4"
          >
            Pronto para resolver os{" "}
            <span className="text-gradient-gold">problemas da sua casa?</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-primary-foreground/70 text-base sm:text-lg max-w-xl mx-auto">
            Atendemos exclusivamente por agendamento. Entre em contato pelo WhatsApp e agende o seu horário com facilidade.
          </p>
        </div>

        {/* CTA card */}
        <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-3xl p-8 sm:p-12 backdrop-blur-sm mb-10">
          <div className="flex flex-col items-center gap-6">
            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-4">
              {[
                { step: "1", icon: <MessageCircle className="w-5 h-5" />, title: "Mande mensagem", desc: "Descreva o serviço pelo WhatsApp" },
                { step: "2", icon: <Calendar className="w-5 h-5" />, title: "Escolha o horário", desc: "Marcamos o melhor dia para você" },
                { step: "3", icon: <Clock className="w-5 h-5" />, title: "Serviço realizado", desc: "Com qualidade e pontualidade" },
              ].map((s) => (
                <div key={s.step} className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-primary-foreground font-bold text-sm">{s.title}</p>
                    <p className="text-primary-foreground/55 text-xs mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp button */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp pulse-gold flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white rounded-full"
              aria-label="Agendar serviço com Marcos pelo WhatsApp (47) 98858-2480"
            >
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
              </svg>
              (47) 98858-2480 — Agendar Agora
            </a>
            <p className="text-primary-foreground/40 text-xs text-center">
              Clique para abrir direto no WhatsApp · Resposta rápida
            </p>
          </div>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <MapPin className="w-5 h-5 text-gold" />,
              title: "Atendimento",
              value: "Pomerode e região",
            },
            {
              icon: <Clock className="w-5 h-5 text-gold" />,
              title: "Funcionamento",
              value: "Seg a Sáb · Agendamento",
            },
            {
              icon: <Instagram className="w-5 h-5 text-gold" />,
              title: "Instagram",
              value: "@maridodealuguelpomerode",
              href: "https://instagram.com/maridodealuguelpomerode",
            },
          ].map((info) => (
            <div
              key={info.title}
              className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-5 flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0">
                {info.icon}
              </div>
              <div>
                <p className="text-primary-foreground/50 text-xs uppercase tracking-wide font-medium">{info.title}</p>
                {info.href ? (
                  <a
                    href={info.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground text-sm font-semibold hover:text-gold transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-primary-foreground text-sm font-semibold">{info.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
