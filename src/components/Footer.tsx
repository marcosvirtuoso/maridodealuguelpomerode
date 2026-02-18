import { Wrench, Instagram, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5547988582480?text=Olá%20Marcos!%20Gostaria%20de%20agendar%20um%20serviço.";

const serviceLinks = [
  { label: "Reparos Elétricos em Pomerode", href: "#servicos" },
  { label: "Serviços Hidráulicos em Pomerode", href: "#servicos" },
  { label: "Montagem de Móveis em Pomerode", href: "#servicos" },
  { label: "Instalação de Vaso Sanitário", href: "#servicos" },
  { label: "Instalação de Aquecedor", href: "#servicos" },
  { label: "Reparo de Caixa D'água", href: "#servicos" },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="bg-foreground text-primary-foreground py-14"
      role="contentinfo"
      aria-label="Rodapé — Marido de Aluguel Pomerode"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold/20 border border-gold/40">
                <Wrench className="w-5 h-5 text-gold" aria-hidden="true" />
              </div>
              <div>
                <span className="block text-base font-bold">Marido de Aluguel</span>
                <span className="block text-[11px] text-gold font-semibold tracking-widest uppercase">Pomerode · SC</span>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Serviços residenciais em Pomerode e região — elétrica, hidráulica, montagem de móveis e instalações. Qualidade, segurança e eficiência garantidas.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-1">
              <a
                href="https://instagram.com/maridodealuguelpomerode"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-gold/15 hover:border-gold/40 hover:text-gold transition-all"
                aria-label="Instagram @maridodealuguelpomerode"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-green-500/15 hover:border-green-500/40 hover:text-green-400 transition-all"
                aria-label="WhatsApp (47) 98858-2480"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Services — SEO links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">Serviços</h3>
            <ul className="flex flex-col gap-2.5" role="list">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="text-sm text-primary-foreground/55 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gold mb-5">Contato</h3>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/60">
              <p>Pomerode e região · SC</p>
              <p>Atendimento por agendamento</p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-foreground hover:text-gold transition-colors"
                aria-label="Ligar ou enviar WhatsApp para (47) 98858-2480"
              >
                (47) 98858-2480
              </a>
              <a
                href="https://instagram.com/maridodealuguelpomerode"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors"
              >
                @maridodealuguelpomerode
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/35">
          <p>
            © {new Date().getFullYear()} Marido de Aluguel Pomerode — Marcos. Todos os direitos reservados.
          </p>
          <p>
            Serviços residenciais em Pomerode, Blumenau, Jaraguá do Sul e região · SC
          </p>
        </div>
      </div>
    </footer>
  );
}
