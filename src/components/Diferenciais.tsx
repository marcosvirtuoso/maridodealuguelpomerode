import { Shield, Clock, Star, ThumbsUp, Award, HeartHandshake } from "lucide-react";

const diferenciais = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Segurança em 1º Lugar",
    description:
      "Todos os reparos elétricos e hidráulicos são realizados seguindo as normas técnicas brasileiras (NBR). Sua família merece serviços feitos com responsabilidade.",
    highlight: "NBR & NR-10 compliant",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Qualidade Comprovada",
    description:
      "Solução mais eficiente e segura que você procura para o seu lar. Serviços feitos para não voltar mais. Satisfação garantida ou refazemos.",
    highlight: "Garantia nos serviços",
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: "Pontualidade e Organização",
    description:
      "Trabalhamos exclusivamente por agendamento. Você sabe exatamente quando o profissional vai chegar — sem espera e sem imprevistos.",
    highlight: "100% por agendamento",
  },
  {
    icon: <HeartHandshake className="w-8 h-8" />,
    title: "Atendimento Humanizado",
    description:
      "Respeito ao seu lar, à sua privacidade e ao seu tempo. O Marcos cuida da sua casa como se fosse a dele — com cuidado, limpeza e atenção.",
    highlight: "Atendimento exclusivo",
  },
  {
    icon: <ThumbsUp className="w-8 h-8" />,
    title: "Solução Eficiente",
    description:
      "Diagnóstico preciso na primeira visita. Menos tentativas, menos custo e menos transtorno para você e sua família.",
    highlight: "Diagnóstico na 1ª visita",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Profissional de Confiança",
    description:
      "Anos de experiência em Pomerode e região. Recomendado por clientes e com avaliações 5 estrelas. Referência em serviços residenciais.",
    highlight: "⭐ 5 estrelas",
  },
];

export default function Diferenciais() {
  return (
    <section
      id="diferenciais"
      className="py-20 sm:py-28 bg-primary"
      aria-labelledby="diferenciais-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Por que escolher o Marcos?
          </span>
          <h2
            id="diferenciais-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4"
          >
            A diferença está nos{" "}
            <span className="text-gradient-gold">detalhes</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-primary-foreground/70 text-base sm:text-lg max-w-2xl mx-auto">
            Qualidade, segurança e profissionalismo que se traduzem em tranquilidade para você e sua família.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {diferenciais.map((item) => (
            <div
              key={item.title}
              className="diff-card p-6 flex flex-col gap-4"
              role="article"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gold/15 border border-gold/25 text-gold flex-shrink-0">
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-gold/80 bg-gold/10 px-2 py-1 rounded-full w-fit">
                  {item.highlight}
                </span>
                <h3 className="text-lg font-bold text-primary-foreground">{item.title}</h3>
                <p className="text-sm text-primary-foreground/65 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
