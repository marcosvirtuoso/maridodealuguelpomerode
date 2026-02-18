import { Zap, Droplets, Sofa, WrenchIcon, Waves, Toilet, Flame, Wrench } from "lucide-react";

interface ServiceItem {
  name: string;
  description: string;
  seoKeywords?: string;
}

interface ServiceCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  services: ServiceItem[];
}

const categories: ServiceCategory[] = [
  {
    id: "eletrica",
    icon: <Zap className="w-7 h-7" />,
    title: "Elétrica Residencial",
    subtitle: "Instalações e reparos elétricos com segurança total",
    color: "hsl(45 95% 45%)",
    bgColor: "hsl(45 95% 45% / 0.10)",
    borderColor: "hsl(45 95% 45% / 0.30)",
    services: [
      { name: "Instalação de tomadas e interruptores", description: "Troca, instalação e organização de pontos elétricos", seoKeywords: "instalação tomadas interruptores Pomerode" },
      { name: "Instalação de luminárias e lustres", description: "Fixação segura de qualquer tipo de iluminação", seoKeywords: "instalação luminária lustres Pomerode" },
      { name: "Instalação de ventiladores de teto", description: "Fixação e fiação elétrica com segurança", seoKeywords: "instalação ventilador teto Pomerode" },
      { name: "Troca de disjuntores e chaves", description: "Substituição e revisão do quadro elétrico", seoKeywords: "troca disjuntor quadro elétrico Pomerode" },
      { name: "Instalação de suportes elétricos", description: "Tomadas USB, externas e embutidas", seoKeywords: "instalação tomada USB Pomerode" },
    ],
  },
  {
    id: "hidraulica",
    icon: <Droplets className="w-7 h-7" />,
    title: "Hidráulica Residencial",
    subtitle: "Reparos e instalações hidráulicas sem vazamentos",
    color: "hsl(210 80% 45%)",
    bgColor: "hsl(210 80% 45% / 0.10)",
    borderColor: "hsl(210 80% 45% / 0.30)",
    services: [
      { name: "Instalação de torneiras", description: "Cozinha, banheiro, lavanderia e área externa", seoKeywords: "instalação torneira Pomerode" },
      { name: "Instalação de chuveiros", description: "Elétrico ou a gás, com segurança total", seoKeywords: "instalação chuveiro Pomerode" },
      { name: "Reparo de vazamentos", description: "Identificação e correção de vazamentos em tubulações", seoKeywords: "reparo vazamento encanamento Pomerode" },
      { name: "Instalação de pias e lavatórios", description: "Bancadas, cuba, sifão e conexões completas", seoKeywords: "instalação pia lavatório Pomerode" },
      { name: "Reparos em caixa acoplada", description: "Manutenção e reparo do mecanismo de descarga", seoKeywords: "reparo caixa acoplada Pomerode" },
      { name: "Reparos em caixa d'água", description: "Limpeza, reparo de boia e vedação", seoKeywords: "reparo limpeza caixa d'água Pomerode" },
    ],
  },
  {
    id: "banheiro",
    icon: <Toilet className="w-7 h-7" />,
    title: "Banheiro Completo",
    subtitle: "Instalação e reforma de banheiro do início ao fim",
    color: "hsl(160 60% 38%)",
    bgColor: "hsl(160 60% 38% / 0.10)",
    borderColor: "hsl(160 60% 38% / 0.30)",
    services: [
      { name: "Instalação de vaso sanitário", description: "Completo com fixação e vedação anti-odor", seoKeywords: "instalação vaso sanitário Pomerode" },
      { name: "Instalação de aquecedor de água", description: "Aquecedores convencionais a gás e elétrico", seoKeywords: "instalação aquecedor água Pomerode" },
      { name: "Instalação de box de banheiro", description: "Fixação de trilhos, perfis e vidros", seoKeywords: "instalação box banheiro Pomerode" },
      { name: "Instalação de espelhos e acessórios", description: "Porta-toalha, toalheiro, cabideiro e saboneteira", seoKeywords: "instalação acessórios banheiro Pomerode" },
    ],
  },
  {
    id: "moveis",
    icon: <Sofa className="w-7 h-7" />,
    title: "Montagem de Móveis",
    subtitle: "Montagem profissional de qualquer móvel comprado",
    color: "hsl(280 50% 48%)",
    bgColor: "hsl(280 50% 48% / 0.10)",
    borderColor: "hsl(280 50% 48% / 0.30)",
    services: [
      { name: "Montagem de armários e guarda-roupas", description: "Todos os modelos e marcas, incluindo Tok&Stok, IKEA", seoKeywords: "montagem guarda-roupa armário Pomerode" },
      { name: "Montagem de camas e berços", description: "Estruturas de casal, solteiro, beliches e berços", seoKeywords: "montagem cama berço Pomerode" },
      { name: "Montagem de racks e estantes", description: "TVs, livros, home theater e decorativos", seoKeywords: "montagem rack estante Pomerode" },
      { name: "Montagem de escrivaninhas e mesas", description: "Escritório, sala de jantar e sala de estudos", seoKeywords: "montagem mesa escritório Pomerode" },
      { name: "Montagem de cozinhas planejadas", description: "Gabinetes, módulos e acessórios", seoKeywords: "montagem cozinha planejada Pomerode" },
    ],
  },
  {
    id: "instalacoes",
    icon: <WrenchIcon className="w-7 h-7" />,
    title: "Instalações Residenciais",
    subtitle: "Suportes, fixações e instalações em geral",
    color: "hsl(20 85% 48%)",
    bgColor: "hsl(20 85% 48% / 0.10)",
    borderColor: "hsl(20 85% 48% / 0.30)",
    services: [
      { name: "Instalação de suportes para TV", description: "Fixação na parede com nível e precisão", seoKeywords: "instalação suporte TV parede Pomerode" },
      { name: "Instalação de prateleiras e nichos", description: "Suportes e prateleiras em qualquer parede", seoKeywords: "instalação prateleira nicho Pomerode" },
      { name: "Fixação de quadros e espelhos", description: "Quadros pesados, espelhos e obras de arte", seoKeywords: "fixação quadro espelho Pomerode" },
      { name: "Instalação de balcões e bancadas", description: "Fixação e nivelamento de balcões e bancadas", seoKeywords: "instalação balcão bancada Pomerode" },
      { name: "Instalação de persianas e cortinas", description: "Trilhos, varões e todos os tipos de persiana", seoKeywords: "instalação persiana cortina Pomerode" },
    ],
  },
  {
    id: "aquecedor",
    icon: <Flame className="w-7 h-7" />,
    title: "Aquecimento",
    subtitle: "Instalação e manutenção de aquecedores",
    color: "hsl(0 75% 50%)",
    bgColor: "hsl(0 75% 50% / 0.10)",
    borderColor: "hsl(0 75% 50% / 0.30)",
    services: [
      { name: "Instalação de aquecedor a gás", description: "Aquecedores Lorenzetti, Rinnai, Bosch e outros", seoKeywords: "instalação aquecedor gás Pomerode" },
      { name: "Instalação de aquecedor elétrico", description: "Ducha elétrica e chuveiro multitemperatura", seoKeywords: "instalação aquecedor elétrico Pomerode" },
      { name: "Manutenção de aquecedores", description: "Revisão, limpeza e ajuste de aquecedores", seoKeywords: "manutenção aquecedor Pomerode" },
    ],
  },
];

export default function Servicos() {
  return (
    <section
      id="servicos"
      className="py-20 sm:py-28"
      aria-labelledby="servicos-heading"
      itemScope
      itemType="https://schema.org/Service"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Serviços Profissionais em Pomerode, SC
          </span>
          <h2
            id="servicos-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
            itemProp="name"
          >
            Tudo que sua casa precisa,{" "}
            <span className="text-gradient-gold">em um só lugar</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto" itemProp="description">
            Serviços de marido de aluguel em Pomerode e região — elétrica, hidráulica, montagem de móveis e instalações residenciais com profissionalismo e garantia.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat) => (
            <article
              key={cat.id}
              className="service-card flex flex-col"
              aria-label={`Categoria: ${cat.title}`}
            >
              {/* Card header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-start gap-4">
                  <div
                    className="category-icon flex-shrink-0"
                    style={{
                      background: cat.bgColor,
                      borderColor: cat.borderColor,
                      color: cat.color,
                    }}
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-snug">{cat.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Services list */}
              <ul className="p-6 flex-1 flex flex-col gap-3" role="list">
                {cat.services.map((service) => (
                  <li
                    key={service.name}
                    className="flex items-start gap-3 group"
                    title={service.seoKeywords}
                  >
                    <span
                      className="mt-1 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: cat.bgColor }}
                      aria-hidden="true"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: cat.color }}
                      />
                    </span>
                    <div>
                      <span className="text-sm font-semibold text-foreground">{service.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Card CTA */}
              <div className="px-6 pb-6">
                <a
                  href={`https://wa.me/5547988582480?text=Olá%20Marcos!%20Tenho%20interesse%20em%20serviços%20de%20${encodeURIComponent(cat.title)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-300 hover:text-white"
                  style={{
                    borderColor: cat.borderColor,
                    color: cat.color,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = cat.color;
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = cat.color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = cat.borderColor;
                  }}
                  aria-label={`Solicitar orçamento para ${cat.title} via WhatsApp`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
                  </svg>
                  Solicitar orçamento
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
