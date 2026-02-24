import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, MessageCircle, MapPin, Instagram, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/5547988582480?text=Olá%20Marcos!%20Gostaria%20de%20agendar%20um%20serviço.";
const WHATSAPP_PHONE = "5547988582480";

const formSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, { message: "Por favor, informe seu nome completo." })
    .max(100, { message: "Nome muito longo." }),
  whatsapp: z
    .string()
    .trim()
    .min(10, { message: "Informe um número de WhatsApp válido com DDD." })
    .max(20, { message: "Número muito longo." })
    .regex(/^[\d\s()\-+]+$/, { message: "Use apenas números, espaços, +, ( e )." }),
  mensagem: z
    .string()
    .trim()
    .min(10, { message: "Descreva brevemente o serviço que precisa." })
    .max(800, { message: "Mensagem muito longa. Máximo 800 caracteres." }),
});

type FormData = z.infer<typeof formSchema>;

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const mensagemValue = watch("mensagem") ?? "";

  const onSubmit = (data: FormData) => {
    const text = `Olá Marcos! Me chamo *${data.nome}* e entrei em contato pelo site.\n\n📱 Meu WhatsApp: ${data.whatsapp}\n\n📝 Mensagem:\n${data.mensagem}\n\nGostaria de agendar um serviço!`;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/15 border-2 border-green-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-400" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-primary-foreground">Mensagem enviada!</h3>
        <p className="text-primary-foreground/65 text-sm max-w-xs">
          O WhatsApp foi aberto com sua mensagem. Marcos responderá em breve!
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-2 text-sm text-gold underline underline-offset-4 hover:text-gold/80 transition-colors"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Formulário de contato"
      className="flex flex-col gap-5"
    >
      {/* WhatsApp notice */}
      <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/25 rounded-xl px-4 py-3">
        <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
        </svg>
        <p className="text-green-300 text-xs leading-relaxed">
          <strong className="text-green-200">Resposta mais rápida pelo WhatsApp!</strong> O formulário também funciona, mas pelo WhatsApp o Marcos responde em minutos.
        </p>
      </div>

      {/* Nome */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-nome"
          className="text-sm font-semibold text-primary-foreground/80"
        >
          Seu nome <span className="text-gold" aria-label="campo obrigatório">*</span>
        </label>
        <input
          id="contact-nome"
          type="text"
          autoComplete="name"
          placeholder="Ex: Maria Silva"
          maxLength={100}
          aria-invalid={!!errors.nome}
          aria-describedby={errors.nome ? "nome-error" : undefined}
          className={`w-full rounded-xl px-4 py-3 text-sm bg-primary-foreground/8 border text-black placeholder:text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all ${
            errors.nome
              ? "border-red-400/60 bg-red-500/5"
              : "border-primary-foreground/15 focus:border-gold/50"
          }`}
          {...register("nome")}
        />
        {errors.nome && (
          <p id="nome-error" className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            {errors.nome.message}
          </p>
        )}
      </div>

      {/* WhatsApp */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-whatsapp"
          className="text-sm font-semibold text-primary-foreground/80"
        >
          Seu WhatsApp <span className="text-gold" aria-label="campo obrigatório">*</span>
        </label>
        <input
          id="contact-whatsapp"
          type="tel"
          autoComplete="tel"
          placeholder="(47) 9xxxx-xxxx"
          maxLength={20}
          aria-invalid={!!errors.whatsapp}
          aria-describedby={errors.whatsapp ? "whatsapp-error" : "whatsapp-hint"}
          className={`w-full rounded-xl px-4 py-3 text-sm bg-primary-foreground/8 border text-black placeholder:text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all ${
            errors.whatsapp
              ? "border-red-400/60 bg-red-500/5"
              : "border-primary-foreground/15 focus:border-gold/50"
          }`}
          {...register("whatsapp")}
        />
        {errors.whatsapp ? (
          <p id="whatsapp-error" className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            {errors.whatsapp.message}
          </p>
        ) : (
          <p id="whatsapp-hint" className="text-xs text-primary-foreground/40">
            Com DDD — para que Marcos possa te chamar de volta.
          </p>
        )}
      </div>

      {/* Mensagem */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="contact-mensagem"
          className="text-sm font-semibold text-primary-foreground/80"
        >
          Descreva o serviço <span className="text-gold" aria-label="campo obrigatório">*</span>
        </label>
        <textarea
          id="contact-mensagem"
          rows={4}
          placeholder="Ex: Preciso instalar uma torneira nova na cozinha e trocar o chuveiro do banheiro..."
          maxLength={800}
          aria-invalid={!!errors.mensagem}
          aria-describedby={errors.mensagem ? "mensagem-error" : "mensagem-hint"}
          className={`w-full rounded-xl px-4 py-3 text-sm bg-primary-foreground/8 border text-black placeholder:text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all resize-none ${
            errors.mensagem
              ? "border-red-400/60 bg-red-500/5"
              : "border-primary-foreground/15 focus:border-gold/50"
          }`}
          {...register("mensagem")}
        />
        <div className="flex items-start justify-between gap-2">
          {errors.mensagem ? (
            <p id="mensagem-error" className="flex items-center gap-1.5 text-xs text-red-400" role="alert">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {errors.mensagem.message}
            </p>
          ) : (
            <p id="mensagem-hint" className="text-xs text-primary-foreground/40">
              Quanto mais detalhes, melhor o orçamento!
            </p>
          )}
          <span className="text-xs text-primary-foreground/30 flex-shrink-0">
            {mensagemValue.length}/800
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-whatsapp w-full flex items-center justify-center gap-3 px-6 py-4 text-base font-bold text-white rounded-xl mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        aria-label="Enviar mensagem pelo WhatsApp"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
        </svg>
        {isSubmitting ? "Abrindo WhatsApp..." : "Enviar pelo WhatsApp"}
      </button>
    </form>
  );
}

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
        className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-[0.08] blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--accent-gold))" }}
        aria-hidden="true"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-gold text-sm font-semibold uppercase tracking-widest mb-3">
            Entre em contato
          </span>
          <h2
            id="contato-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4"
          >
            Agende seu{" "}
            <span className="text-gradient-gold">serviço</span>
          </h2>
          <div className="section-divider mb-6" />
          <p className="text-primary-foreground/70 text-base sm:text-lg max-w-xl mx-auto">
            Prefere o formulário? Sem problema! Mas se quiser resposta em minutos, use o WhatsApp direto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left — Steps & Info */}
          <div className="flex flex-col gap-8">
            {/* How it works */}
            <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
              <h3 className="text-primary-foreground font-bold text-base mb-5 uppercase tracking-wide text-sm">
                Como funciona o agendamento
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { step: "1", icon: <MessageCircle className="w-5 h-5" />, title: "Mande mensagem", desc: "Descreva o serviço pelo WhatsApp ou formulário" },
                  { step: "2", icon: <Calendar className="w-5 h-5" />, title: "Escolha o horário", desc: "Combinamos o melhor dia e horário para você" },
                  { step: "3", icon: <Clock className="w-5 h-5" />, title: "Serviço realizado", desc: "Pontualidade, qualidade e limpeza garantidas" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-primary-foreground font-semibold text-sm">{s.title}</p>
                      <p className="text-primary-foreground/55 text-xs mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp pulse-gold flex items-center justify-center gap-3 px-7 py-4 text-base font-bold text-white rounded-2xl"
              aria-label="Agendar pelo WhatsApp (47) 98858-2480"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.882l6.221-1.438A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.016-1.38l-.36-.214-3.69.853.879-3.59-.235-.371A9.79 9.79 0 012.182 12C2.182 6.577 6.577 2.182 12 2.182c5.424 0 9.818 4.395 9.818 9.818 0 5.424-4.394 9.818-9.818 9.818z"/>
              </svg>
              (47) 98858-2480 — Resposta Imediata
            </a>

            {/* Info chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              {[
                { icon: <MapPin className="w-4 h-4 text-gold" />, label: "Atendimento", value: "Pomerode e região" },
                { icon: <Clock className="w-4 h-4 text-gold" />, label: "Funcionamento", value: "Seg–Sáb · Agendamento" },
                { icon: <Instagram className="w-4 h-4 text-gold" />, label: "Instagram", value: "@maridodealuguelpomerode", href: "https://instagram.com/maridodealuguelpomerode" },
              ].map((info) => (
                <div key={info.label} className="flex items-center gap-3 bg-primary-foreground/5 border border-primary-foreground/10 rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-primary-foreground/45 text-[10px] uppercase tracking-wide font-medium">{info.label}</p>
                    {info.href ? (
                      <a href={info.href} target="_blank" rel="noopener noreferrer" className="text-primary-foreground text-xs font-semibold hover:text-gold transition-colors">
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-primary-foreground text-xs font-semibold">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6 sm:p-8">
            <h3 className="text-primary-foreground font-bold text-lg mb-1">Formulário de contato</h3>
            <p className="text-primary-foreground/50 text-sm mb-6">
              Preencha abaixo e enviaremos sua mensagem diretamente pelo WhatsApp.
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
