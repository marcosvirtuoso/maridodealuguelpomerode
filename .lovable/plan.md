
## Corrigir cor do texto digitado no formulario de contato

O problema: os campos de input e textarea usam a classe `text-primary-foreground`, que e uma cor clara (quase branca) porque a secao de contato tem fundo escuro (navy). Isso torna o texto digitado dificil de ler.

### Solucao

Alterar a cor do texto digitado nos 3 campos do formulario (nome, whatsapp, mensagem) de `text-primary-foreground` para `text-black` no arquivo `src/components/Contato.tsx`.

### Detalhes tecnicos

Nos 3 campos (linhas 104, 135 e 169), substituir `text-primary-foreground` por `text-black` na string de classes CSS:

- **Input Nome** (linha 104): `text-primary-foreground` -> `text-black`
- **Input WhatsApp** (linha 135): `text-primary-foreground` -> `text-black`
- **Textarea Mensagem** (linha 169): `text-primary-foreground` -> `text-black`

Isso garante que o texto digitado pelo usuario apareca em preto, contrastando bem com o fundo claro dos campos de input.
