## Contexto técnico

A SPA Vite + React Router roda na hospedagem estática da Lovable, que **não suporta SSR Node em runtime**. A solução SEO-friendly equivalente é **prerendering em build-time**: gerar arquivos HTML reais para cada rota pública (home, categorias, artigos, páginas de serviço), com canonical, meta tags e conteúdo já renderizados. Googlebot recebe HTML completo sem depender de JS.

## Decisões confirmadas

- Trailing slash **com barra final** em canonicals e sitemap; React Router aceita as duas formas.
- FAQ schema: pulado.
- `sameAs`: `https://instagram.com/maridodealuguepomerode`.
- LocalBusiness: `areaServed = Pomerode, SC` (sem endereço físico).

---

## 1. Domínio canônico único

`src/lib/seo.ts`:
- `CANONICAL_HOST = "https://novolarinstalacoes.com.br"`
- `buildCanonical(path)` → força https, remove `www.`, remove query/hash, garante trailing slash.
- `DEFAULT_OG_IMAGE`, `BUSINESS_INFO` (nome, telefone, instagram, areaServed).

Substituir todos os `window.location.origin` em `ServicePage.tsx`, `ArticlePage.tsx`, `CategoryPage.tsx` por `CANONICAL_HOST` (corrige canonicals e og:url que hoje vazam o domínio de preview/lovable.app).

## 2. Componente `<SEO />` reutilizável

`src/components/SEO.tsx` baseado em `react-helmet-async`, aceita `title`, `description`, `path`, `image?`, `type?`, `jsonLd?`. Emite `<title>`, description, canonical, og:* (title/description/url/type/image), twitter:* (card/title/description/image) e tags JSON-LD em um único lugar.

Aplicar em:
- `Index.tsx` (hoje sem `<Helmet>`).
- `CategoryPage.tsx`, `ArticlePage.tsx`, `ServicePage.tsx` (substitui Helmet inline).
- `NotFound.tsx` com `<meta name="robots" content="noindex">`.
- Páginas admin recebem `noindex,nofollow`.

## 3. JSON-LD estruturado

- **LocalBusiness global** em `Index.tsx` (NovoLar Instalações, telefone +55 47 98858-2480, areaServed Pomerode/SC, url canônico, sameAs Instagram).
- **Service schema** em ServicePage (manter, corrigir host).
- **BreadcrumbList** em ServicePage/ArticlePage/CategoryPage (usar `CANONICAL_HOST`).
- **Article schema** em ArticlePage (corrigir `mainEntityOfPage`).

## 4. Prerender estático em build-time

Adicionar dev deps: `puppeteer` + `serve-handler`. Novo `scripts/prerender.mjs`:

1. Após `vite build`, sobe servidor estático sobre `dist/`.
2. Busca via REST do Supabase (anon key do `.env`) os slugs publicados de `service_pages`, `articles`+categoria e lista de `categories`.
3. Para cada rota pública (`/`, `/{categoria}`, `/{categoria}/{artigo}`, `/servicos/{slug}`) abre Puppeteer headless, espera `h1` montar e React Query hidratar, serializa `document.documentElement.outerHTML` e grava em `dist/<rota>/index.html`.
4. Rotas admin ficam fora — atendidas pelo fallback SPA.

Atualizar `package.json`: `build = vite build && node scripts/generate-sitemap.mjs && node scripts/prerender.mjs`.

`index.html` ganha fallback mínimo dentro de `<div id="root">` (logo + H1 "NovoLar Instalações — Marido de Aluguel em Pomerode" + telefone) e `<link rel="preconnect">` para Google Fonts e domínio Supabase.

## 5. Sitemap dinâmico

`scripts/generate-sitemap.mjs` lê os slugs via Supabase e regenera `public/sitemap.xml` com `https://novolarinstalacoes.com.br` (com trailing slash). Roda dentro do `npm run build` antes do prerender.

## 6. Performance / Core Web Vitals

- `loading="eager"` + `fetchpriority="high"` na imagem do hero; `loading="lazy"` no resto.
- `<link rel="preload" as="image">` para o banner do hero no `index.html`.
- `<link rel="preconnect">` para fontes e Supabase.
- Code-split das rotas admin via `React.lazy` em `App.tsx` para reduzir bundle público.

## 7. Estrutura de headings

Auditar componentes da home (Hero, Servicos, Diferenciais, Sobre, Mapa, Contato, Footer, Navbar) para garantir um único `<h1>` por rota e hierarquia H1 → H2 → H3.

---

## Estrutura

```text
src/
  lib/seo.ts                    # CANONICAL_HOST, buildCanonical, BUSINESS_INFO
  components/SEO.tsx            # wrapper Helmet único
  pages/
    Index.tsx                   # + <SEO> + LocalBusiness JSON-LD
    CategoryPage.tsx
    ArticlePage.tsx
    ServicePage.tsx
    NotFound.tsx                # noindex
scripts/
  generate-sitemap.mjs
  prerender.mjs
package.json                    # build = vite build + sitemap + prerender
index.html                      # fallback content + preloads
```
