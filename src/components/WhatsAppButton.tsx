import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5547988582480";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Gostaria de agendar um serviço.`;

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-200 hover:shadow-xl"
    >
      <MessageCircle className="w-7 h-7 fill-white stroke-white" />
    </a>
  );
}
