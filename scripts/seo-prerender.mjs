/**
 * Build-time SEO prerender + sitemap generator.
 *
 * Runs in Vite's closeBundle hook. For each known public route, writes a
 * static <route>/index.html into dist/ with full canonical, meta, og/twitter,
 * JSON-LD and a content body fallback (h1/h2/p) so crawlers see real HTML
 * before React hydrates. Also regenerates dist/sitemap.xml from Supabase data.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const HOST = "https://novolarinstalacoes.com.br";
const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/LKgXwebzBuRDVRqH8AAHQ3mwsgN2/social-images/social-1774387463293-Banner_prestação_de_serviços_novolar_em_pomerode_santa_catarina.webp";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || "https://phonirownqgsnqhdzpxe.supabase.co";
const SUPABASE_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBob25pcm93bnFnc25xaGR6cHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNjc2NDUsImV4cCI6MjA4OTY0MzY0NX0.NsEolLQOtRbSxWtGdUUbpcNaPi04qLCO2T6rM6BzcI4";

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const canonical = (p) => {
  let s = p || "/";
  s = s.split("?")[0].split("#")[0];
  if (!s.startsWith("/")) s = "/" + s;
  if (!s.endsWith("/")) s = s + "/";
  return HOST + s;
};

async function rest(table, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${params}`;
  const res = await fetch(url, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) {
    console.warn(`[seo-prerender] ${table} fetch failed: ${res.status}`);
    return [];
  }
  return res.json();
}

function buildHead({ title, description, path: p, image, type = "website", keywords, jsonLd = [] }) {
  const url = canonical(p);
  const img = image || OG_IMAGE;
  const ldTags = jsonLd
    .map((d) => `<script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`)
    .join("\n    ");
  return `<title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    ${keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : ""}
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="NovoLar Instalações" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${escapeHtml(img)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(img)}" />
    ${ldTags}`;
}

function buildBodyFallback({ h1, h2, paragraphs = [], image, breadcrumbs = [] }) {
  return `
      <div style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="false">
        ${breadcrumbs.length ? `<nav aria-label="Breadcrumb"><ol>${breadcrumbs.map((b) => `<li><a href="${b.href}">${escapeHtml(b.name)}</a></li>`).join("")}</ol></nav>` : ""}
        <h1>${escapeHtml(h1)}</h1>
        ${h2 ? `<h2>${escapeHtml(h2)}</h2>` : ""}
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(h1)}" />` : ""}
        ${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        <p><a href="https://wa.me/5547988582480">Agende pelo WhatsApp: (47) 98858-2480</a></p>
      </div>`;
}

function injectIntoTemplate(template, headBlock, bodyBlock) {
  // Replace existing <title> + meta description + canonical (defaults from index.html) with route-specific ones
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<meta\s+name="keywords"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "")
    .replace(/<meta\s+property="og:title"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:description"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:url"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:type"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:image"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:site_name"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:locale"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:card"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:title"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:description"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:image"[^>]*>/gi, "");

  html = html.replace(/<\/head>/i, `    ${headBlock}\n  </head>`);
  html = html.replace(/<div id="root">/i, `<div id="root">${bodyBlock}`);
  return html;
}

async function writeRoute(distDir, routePath, html) {
  const dir = path.join(distDir, routePath.replace(/^\//, ""));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), html, "utf8");
}

const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "NovoLar Instalações",
  alternateName: "Marido de Aluguel Pomerode",
  description:
    "Instalações e reparos residenciais em Pomerode e região: elétrica, hidráulica, montagem de móveis e instalações em geral.",
  url: HOST,
  telephone: "+5547988582480",
  image: OG_IMAGE,
  priceRange: "$$",
  areaServed: { "@type": "City", name: "Pomerode", containedInPlace: { "@type": "State", name: "Santa Catarina" } },
  address: { "@type": "PostalAddress", addressLocality: "Pomerode", addressRegion: "SC", addressCountry: "BR" },
  openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "08:00", closes: "18:00" }],
  sameAs: ["https://instagram.com/maridodealuguepomerode"],
};

export async function runSeoPrerender(distDir) {
  const indexPath = path.join(distDir, "index.html");
  let template;
  try {
    template = await fs.readFile(indexPath, "utf8");
  } catch {
    console.warn("[seo-prerender] dist/index.html not found, skipping");
    return;
  }

  // Fetch data
  const [categories, articles, servicePages] = await Promise.all([
    rest("categories", "select=id,name,slug,description"),
    rest("articles", "select=id,title,slug,subtitle,meta_title,meta_description,meta_keywords,featured_image_url,og_image_url,published_at,updated_at,category_id,content,status&status=eq.published"),
    rest("service_pages", "select=slug,title,subtitle,service_name,meta_title,meta_description,meta_keywords,featured_image_url,content,status&status=eq.published"),
  ]);

  const catById = new Map(categories.map((c) => [c.id, c]));
  const sitemapUrls = [{ loc: HOST + "/", changefreq: "weekly", priority: "1.0" }];

  // Home (root index.html) — inject home meta + body
  const homeHead = buildHead({
    title: "NovoLar Instalações | Marido de Aluguel em Pomerode SC",
    description: "Instalações e reparos residenciais em Pomerode e região: elétrica, hidráulica, montagem de móveis e instalações em geral. Atendimento por agendamento.",
    path: "/",
    type: "website",
    jsonLd: [localBusinessLd],
  });
  const homeBody = buildBodyFallback({
    h1: "Instalações e Reparos Residenciais em Pomerode e Região",
    h2: "NovoLar Instalações — Marido de Aluguel em Pomerode SC",
    paragraphs: [
      "Serviços elétricos, hidráulicos, montagem de móveis e instalações residenciais com qualidade, segurança e eficiência.",
      "Atendimento por agendamento em Pomerode e região, com pontualidade e atenção total ao seu lar.",
    ],
  });
  await fs.writeFile(indexPath, injectIntoTemplate(template, homeHead, homeBody), "utf8");

  // Categories
  for (const cat of categories) {
    const head = buildHead({
      title: `${cat.name} em Pomerode | NovoLar Instalações`,
      description: cat.description || `Artigos e serviços sobre ${cat.name} em Pomerode e região — NovoLar Instalações.`,
      path: `/${cat.slug}`,
      jsonLd: [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: HOST + "/" },
          { "@type": "ListItem", position: 2, name: cat.name, item: canonical(`/${cat.slug}`) },
        ],
      }],
    });
    const body = buildBodyFallback({
      h1: cat.name,
      paragraphs: [cat.description || `Artigos sobre ${cat.name} em Pomerode e região.`],
      breadcrumbs: [{ name: "Início", href: HOST + "/" }, { name: cat.name, href: canonical(`/${cat.slug}`) }],
    });
    await writeRoute(distDir, `/${cat.slug}`, injectIntoTemplate(template, head, body));
    sitemapUrls.push({ loc: canonical(`/${cat.slug}`), changefreq: "weekly", priority: "0.7" });
  }

  // Articles
  for (const a of articles) {
    const cat = catById.get(a.category_id);
    if (!cat) continue;
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: a.meta_description || a.subtitle || "",
      image: a.og_image_url || a.featured_image_url || OG_IMAGE,
      datePublished: a.published_at,
      dateModified: a.updated_at,
      author: { "@type": "Person", name: "Marcos — Marido de Aluguel Pomerode" },
      publisher: { "@type": "Organization", name: "NovoLar Instalações" },
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical(`/${cat.slug}/${a.slug}`) },
      keywords: a.meta_keywords || "",
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: HOST + "/" },
        { "@type": "ListItem", position: 2, name: cat.name, item: canonical(`/${cat.slug}`) },
        { "@type": "ListItem", position: 3, name: a.title, item: canonical(`/${cat.slug}/${a.slug}`) },
      ],
    };
    const head = buildHead({
      title: `${a.meta_title || a.title} | NovoLar Instalações Pomerode`,
      description: a.meta_description || a.subtitle || a.title,
      path: `/${cat.slug}/${a.slug}`,
      image: a.og_image_url || a.featured_image_url || undefined,
      type: "article",
      keywords: a.meta_keywords || undefined,
      jsonLd: [articleLd, breadcrumbLd],
    });
    const body = buildBodyFallback({
      h1: a.title,
      h2: a.subtitle || "",
      image: a.featured_image_url || undefined,
      paragraphs: [(a.content || "").slice(0, 600)],
      breadcrumbs: [
        { name: "Início", href: HOST + "/" },
        { name: cat.name, href: canonical(`/${cat.slug}`) },
        { name: a.title, href: canonical(`/${cat.slug}/${a.slug}`) },
      ],
    });
    await writeRoute(distDir, `/${cat.slug}/${a.slug}`, injectIntoTemplate(template, head, body));
    sitemapUrls.push({ loc: canonical(`/${cat.slug}/${a.slug}`), changefreq: "monthly", priority: "0.6" });
  }

  // Service pages
  for (const s of servicePages) {
    const serviceLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      description: s.meta_description || s.subtitle || s.title,
      image: s.featured_image_url || OG_IMAGE,
      provider: {
        "@type": "LocalBusiness",
        name: "NovoLar Instalações",
        telephone: "+5547988582480",
        url: HOST,
        areaServed: { "@type": "City", name: "Pomerode" },
      },
      areaServed: { "@type": "City", name: "Pomerode" },
      url: canonical(`/servicos/${s.slug}`),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Início", item: HOST + "/" },
        { "@type": "ListItem", position: 2, name: "Serviços", item: HOST + "/#servicos" },
        { "@type": "ListItem", position: 3, name: s.title, item: canonical(`/servicos/${s.slug}`) },
      ],
    };
    const head = buildHead({
      title: `${s.meta_title || s.title} | NovoLar Instalações Pomerode`,
      description: s.meta_description || s.subtitle || s.title,
      path: `/servicos/${s.slug}`,
      image: s.featured_image_url || undefined,
      type: "website",
      keywords: s.meta_keywords || undefined,
      jsonLd: [serviceLd, breadcrumbLd],
    });
    const body = buildBodyFallback({
      h1: s.title,
      h2: s.subtitle || "",
      image: s.featured_image_url || undefined,
      paragraphs: [(s.content || "").slice(0, 600)],
      breadcrumbs: [
        { name: "Início", href: HOST + "/" },
        { name: "Serviços", href: HOST + "/#servicos" },
        { name: s.title, href: canonical(`/servicos/${s.slug}`) },
      ],
    });
    await writeRoute(distDir, `/servicos/${s.slug}`, injectIntoTemplate(template, head, body));
    sitemapUrls.push({ loc: canonical(`/servicos/${s.slug}`), changefreq: "monthly", priority: "0.8" });
  }

  // Sitemap
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemapUrls
      .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
      .join("\n") +
    `\n</urlset>\n`;
  await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

  console.log(`[seo-prerender] wrote ${sitemapUrls.length} routes + sitemap.xml`);
}

/** Vite plugin entry point */
export default function seoPrerenderPlugin() {
  return {
    name: "seo-prerender",
    apply: "build",
    async closeBundle() {
      const distDir = path.resolve(process.cwd(), "dist");
      try {
        await runSeoPrerender(distDir);
      } catch (err) {
        console.warn("[seo-prerender] failed:", err?.message || err);
      }
    },
  };
}