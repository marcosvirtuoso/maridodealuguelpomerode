

## Plano: Páginas Individuais para Tópicos de Serviços

### Resumo

Criar um sistema no painel admin para gerenciar páginas individuais de cada tópico dos cards de serviços (ex: "Instalação de tomadas e interruptores"). Cada tópico terá uma página dedicada com a identidade visual do site (Navbar + Footer), e o nome do tópico no card se tornará um link clicável quando a página existir.

### Estrutura de URLs

```text
/servicos/instalacao-de-tomadas-e-interruptores
/servicos/instalacao-de-luminarias-e-lustres
/servicos/instalacao-de-lava-louca
...
```

### O que será feito

**1. Nova tabela no banco de dados: `service_pages`**
- `id`, `service_name` (nome exato do tópico), `slug`, `title` (H1 da página), `subtitle` (H2), `content` (texto), `featured_image_url`, `meta_title`, `meta_description`, `meta_keywords`, `status` (draft/published), `created_at`, `updated_at`
- RLS: leitura pública para publicados, CRUD restrito a admins

**2. Painel Admin — Gerenciamento de Páginas de Serviços**
- Nova seção no dashboard: "Páginas de Serviços"
- Lista todos os tópicos dos cards agrupados por categoria
- Indicador visual de quais já têm página criada vs. pendentes
- Ao clicar num tópico, abre editor (reutiliza o modelo do editor de artigos) com:
  - Título (H1), subtítulo (H2), imagem, conteúdo, campos SEO
  - O `service_name` e `slug` são pré-preenchidos automaticamente
  - Preview Google e URL

**3. Página pública template: `/servicos/:slug`**
- Navbar + conteúdo + Footer (mesma identidade do site)
- SEO completo: Helmet, JSON-LD Schema.org/Service, breadcrumb
- Botão CTA WhatsApp contextual ao serviço

**4. Cards de serviços — links clicáveis**
- Cada tópico no card verifica se existe uma `service_page` publicada
- Se existir, o nome vira um link para `/servicos/slug`
- Se não existir, permanece texto normal (sem link)

**5. Rota e navegação**
- Nova rota: `/servicos/:slug` → `ServicePage.tsx`
- Link "Páginas de Serviços" no menu do admin dashboard
- Nova rota admin: `/admin/servicos` (lista) e `/admin/servicos/:id` (editor)

### Detalhes técnicos

- A tabela `service_pages` terá constraint unique no `slug`
- O componente `Servicos.tsx` fará um query para buscar slugs de páginas publicadas e renderizar links condicionalmente
- O editor reutiliza o componente `ImageUpload` já existente
- A página pública segue o mesmo padrão do `ArticlePage.tsx` (Helmet, JSON-LD, breadcrumb)

### Arquivos a criar/editar

| Ação | Arquivo |
|------|---------|
| Criar | `src/pages/AdminServicePages.tsx` (lista) |
| Criar | `src/pages/AdminServicePageEditor.tsx` (editor) |
| Criar | `src/pages/ServicePage.tsx` (página pública) |
| Editar | `src/components/Servicos.tsx` (links clicáveis) |
| Editar | `src/pages/AdminDashboard.tsx` (card novo) |
| Editar | `src/App.tsx` (novas rotas) |
| Migração | Criar tabela `service_pages` + RLS |

