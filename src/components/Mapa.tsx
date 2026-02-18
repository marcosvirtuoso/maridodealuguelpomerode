import { MapPin } from "lucide-react";

const areas = [
  { name: "Pomerode", desc: "Cidade principal — atendimento completo", highlight: true },
  { name: "Timbó", desc: "Atendimento regular por agendamento", highlight: false },
  { name: "Indaial", desc: "Atendimento regular por agendamento", highlight: false },
  { name: "Blumenau (bairros)", desc: "Consulte disponibilidade para seu bairro", highlight: false },
];

// OpenStreetMap embed centered on Pomerode, SC
// Coordinates: lat -26.7458, lon -49.1754
const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html?bbox=-49.2454%2C-26.8058%2C-49.1054%2C-26.6858&layer=mapnik&marker=-26.7458%2C-49.1754";

export default function Mapa() {
  return (
    <section
      id="area-atendimento"
      className="py-20 sm:py-28 bg-muted/40"
      aria-labelledby="mapa-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Área de Atendimento
          </span>
          <h2
            id="mapa-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Onde o Marcos{" "}
            <span className="text-gradient-gold">atende</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Atendimento presencial em <strong className="text-foreground">Pomerode</strong> e cidades da região do Vale do Itajaí — sempre com agendamento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          {/* Map iframe */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg border border-border relative min-h-[340px] sm:min-h-[420px]">
            {/* Map label overlay */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold px-3 py-2 rounded-full shadow-md pointer-events-none">
              <MapPin className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
              Pomerode, SC — Sede
            </div>

            <iframe
              title="Mapa de atendimento — Marido de Aluguel Pomerode SC"
              src={MAP_EMBED_URL}
              className="w-full h-full min-h-[340px] sm:min-h-[420px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Mapa mostrando a localização de Pomerode, SC — área de atendimento do Marido de Aluguel"
            />
          </div>

          {/* Area cards */}
          <div className="lg:col-span-2 flex flex-col gap-4 justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Cidades atendidas
            </p>
            {areas.map((area) => (
              <div
                key={area.name}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                  area.highlight
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-card text-foreground border-border hover:border-gold/40"
                }`}
                role="listitem"
              >
                <div
                  className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    area.highlight
                      ? "bg-gold/20 border border-gold/40"
                      : "bg-muted border border-border"
                  }`}
                  aria-hidden="true"
                >
                  <MapPin
                    className={`w-4 h-4 ${area.highlight ? "text-gold" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <p
                    className={`font-bold text-base ${
                      area.highlight ? "text-primary-foreground" : "text-foreground"
                    }`}
                  >
                    {area.name}
                  </p>
                  <p
                    className={`text-sm mt-0.5 ${
                      area.highlight ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {area.desc}
                  </p>
                </div>
                {area.highlight && (
                  <span className="ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-widest bg-gold/20 text-gold border border-gold/30 px-2 py-1 rounded-full self-start">
                    Principal
                  </span>
                )}
              </div>
            ))}

            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              * Para cidades não listadas, entre em contato pelo WhatsApp para verificar disponibilidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
