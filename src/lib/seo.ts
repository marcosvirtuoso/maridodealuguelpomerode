export const CANONICAL_HOST = "https://novolarinstalacoes.com.br";

export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/LKgXwebzBuRDVRqH8AAHQ3mwsgN2/social-images/social-1774387463293-Banner_prestação_de_serviços_novolar_em_pomerode_santa_catarina.webp";

export const BUSINESS_INFO = {
  name: "NovoLar Instalações",
  legalName: "NovoLar Instalações e Reparos Residenciais",
  telephone: "+5547988582480",
  telephoneDisplay: "(47) 98858-2480",
  email: "",
  areaServed: "Pomerode",
  region: "SC",
  country: "BR",
  url: CANONICAL_HOST,
  sameAs: ["https://instagram.com/maridodealuguepomerode"],
};

/**
 * Build a canonical absolute URL from a path.
 * - Always uses https://novolarinstalacoes.com.br
 * - Strips query and hash
 * - Ensures a trailing slash
 */
export function buildCanonical(path: string): string {
  let p = path || "/";
  // Strip query/hash
  p = p.split("?")[0].split("#")[0];
  // Ensure leading slash
  if (!p.startsWith("/")) p = "/" + p;
  // Ensure trailing slash
  if (!p.endsWith("/")) p = p + "/";
  return CANONICAL_HOST + p;
}

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS_INFO.name,
  alternateName: "Marido de Aluguel Pomerode",
  description:
    "Instalações e reparos residenciais em Pomerode e região: elétrica, hidráulica, montagem de móveis e instalações em geral.",
  url: BUSINESS_INFO.url,
  telephone: BUSINESS_INFO.telephone,
  image: DEFAULT_OG_IMAGE,
  priceRange: "$$",
  areaServed: {
    "@type": "City",
    name: BUSINESS_INFO.areaServed,
    containedInPlace: { "@type": "State", name: "Santa Catarina" },
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: BUSINESS_INFO.areaServed,
    addressRegion: BUSINESS_INFO.region,
    addressCountry: BUSINESS_INFO.country,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  sameAs: BUSINESS_INFO.sameAs,
};