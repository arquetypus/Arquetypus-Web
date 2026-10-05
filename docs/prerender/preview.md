# Validação do preview — baseline da Etapa 0

Coleta em **04/10/2026**, concluída às 23:42 UTC (20:42 de Brasília).
URL: <https://arquetypus-parfum-git-prerender-saniella.vercel.app/>.

**Resultado: aprovado como baseline da SPA atual nos testes executados.**
Nenhuma etapa de migração foi iniciada. Não interpretar este resultado como aprovação de
SSG, hidratação, publicação em produção ou desempenho após a migração.

## Acesso e equivalência dos artefatos

O primeiro acesso foi bloqueado por login Vercel, com respostas 302. Na nova tentativa
solicitada pelo usuário, a mesma URL abriu o aplicativo e respondeu 200. O agente não
alterou proteção nem autenticação. [Registro inicial](evidence/preview-access.json).

| Verificação | Resultado |
|---|---|
| GET direto das 18 rotas públicas | 18/18 HTTP 200, sem redirect |
| Seis casos adicionais de roteamento | 6/6 HTTP 200 com template SPA; comportamento atual, não aceite futuro |
| Proteção de indexação | `X-Robots-Tag: noindex` nas 24 respostas HTML examinadas |
| JS/CSS versus build local | HTTP 200; bytes e SHA-256 idênticos |
| robots.txt, sitemap.xml e llms.txt | HTTP 200, content-type correspondente e bytes idênticos; header noindex |
| HTML das 23 URLs exceto home | Idêntico ao `dist/index.html` local |
| HTML da home | Template local intacto, seguido de um script de feedback Vercel |

O acréscimo na home foi isolado por comparação de bytes: prefixo inteiro idêntico ao
build local e único sufixo `https://vercel.live/_next-live/feedback/feedback.js`.
O atributo do script informa `data-deployment-id="dpl_z5Y2spehfBoNCpKxyFdzjeay4tpU"`;
trata-se do ID informado pelo feedback deste preview, sem confirmação administrativa de
SHA, URL imutável ou vínculo com o deployment ativo de produção.

Evidências: [HTTP e hashes](evidence/preview-http-baseline.json),
[HTML bruto da home](evidence/preview-index.html), [resumo](evidence/preview-validation.json).

## Conteúdo e metadados depois de JavaScript

As 18 páginas foram visitadas diretamente no Chrome. Comparação por rota com
[baseline local](evidence/metadata-client.json): **nenhuma divergência** em title,
description, canonical, Open Graph (title/description/type/url), texto do H1, JSON-LD e
primeiros 1.000 caracteres do conteúdo principal. Origem da URL do navegador foi excluída
da comparação; canonical e OG continuam apontando para domínio oficial sem www.

Todos os nove produtos têm H1 correspondente, conteúdo próprio e **R$ 79,90** no DOM.
Home foi comparada no primeiro slide; autoplay muda H1 e conteúdo durante uso normal.
Não foram observadas imagens quebradas entre os elementos `img` concluídos e visíveis
na coleta. Isso não certifica todas as imagens lazy, vídeos ou recursos de terceiros.

[Dados e diferenças por rota](evidence/preview-metadata-client.json).

## Navegação e interface

| Fluxo examinado | Resultado observado |
|---|---|
| Acesso direto e refresh de `/loja/zeus` | PDP completa; H1 e SEO de Zeus; sem modal |
| Home → produto no desktop | URL `/loja/zeus`; modal sobre a home |
| Reload com modal aberto | Modal e home de fundo preservados |
| Voltar / avançar do navegador | Volta à home / restaura modal |
| Link “Ver página completa” | Mesma URL; modal removido; PDP e SEO de Zeus |
| Fechar pelo X | Retorna à home, no desktop e mobile |
| Modal mobile | Conteúdo de Fênix, preço e Pix visíveis; botão “Em breve” desabilitado |
| Drawer mobile → FAQ | Navega para `/perguntas-frequentes`; menu fecha |
| FAQ | Clique abre disclosure nativo; um `details[open]` observado |
| Caminho inexistente | Interface “Página não encontrada”; HTTP permanece 200 |
| Produto inexistente | Redirect à home somente depois de JavaScript |
| Cookies | Banner observado; recusa remove banner |
| Console capturado | Nenhum warn/error retornado na consulta de até 100 registros da aba de QA |

[Estados de navegação registrados](evidence/preview-navigation.json).
Não foram enviados formulários, mensagens ou compras. Busca, quiz e checkout continuam
com os rótulos/controles “Em breve” já presentes no baseline.

## Capturas inspecionadas

| Página | 390 × 844 | 1440 × 900 |
|---|---|---|
| Home | [Mobile](screenshots/preview-home-390x844.jpg) | [Desktop](screenshots/preview-home-1440x900.jpg) |
| Zeus | [Mobile](screenshots/preview-zeus-390x844.jpg) | [Desktop](screenshots/preview-zeus-1440x900.jpg) |
| FAQ | [Mobile](screenshots/preview-faq-390x844.jpg) | [Desktop](screenshots/preview-faq-1440x900.jpg) |
| 404 | [Mobile](screenshots/preview-404-390x844.jpg) | [Desktop](screenshots/preview-404-1440x900.jpg) |
| Modal | [Fênix mobile](screenshots/preview-modal-390x844.jpg) | [Zeus desktop](screenshots/preview-modal-1440x900.jpg) |

Inspeção visual não mostrou quebra nos estados capturados. Hero e vídeo têm fases distintas
do baseline; capturas não constituem comparação automatizada de pixels. Feedback flutuante
da Vercel é acréscimo da plataforma. Capturas iniciais com frame/enquadramento transitórios
foram substituídas e dimensões finais verificadas. A home usa container próprio
`[data-scroll-container]`: `document.scrollTop === 0` sozinho não comprova topo da página.

## Pendências existentes e limites

- HTML bruto das 24 respostas tem **root vazio e zero H1**. Title, description e canonical
  iniciais são genéricos da home; H1, preços e conteúdo principal dependem de JavaScript.
  É exatamente o problema que o plano pretende corrigir.
- Modal mantém SEO da home e dois H1 no DOM (home + produto), como no baseline.
  Correção pertence ao SEO compartilhado e ao contrato de hidratação previstos no plano.
- HTTP 200 para caminhos inexistentes é soft 404 da SPA atual; futuros testes precisam
  exigir corpo e status corretos, sem tomar esta coleta como aceite de roteamento estático.
- PDP continua mostrando estoque junto de compra “Em breve” desabilitada. Nenhuma copy
  comercial foi alterada e nenhuma oferta estruturada foi inventada.
- Hidratação ainda não existe: aplicativo usa `createRoot`. Ausência de erros nesta SPA
  não comprova ausência futura de hydration mismatch.
- Lighthouse não foi repetido no preview; as seis auditorias locais permanecem referência,
  sem alegar ganho de performance ou igualdade de métricas entre ambientes.
- Após a coleta, usuário informou Node configurado `24.x` e enviou prints identificando
  produção atual `8a02e4a` e anterior `3833162`. URL e identificador exibido foram registrados
  na [baseline](baseline.md). Ambiente efetivo do build da migração e disponibilidade/permissão
  de rollback continuam sujeitos a confirmação antes da publicação, que ocorrerá só ao final.

Etapa 1 permanece **pendente**, aguardando pedido explícito para executá-la.
Evidências desta validação integram a documentação da branch `prerender`.

## Repetir coleta HTTP

```powershell
node docs/prerender/tools/collect-http.mjs https://arquetypus-parfum-git-prerender-saniella.vercel.app preview
node docs/prerender/tools/summarize-preview.mjs
```

Preservar evidências anteriores antes de repetir: comandos substituem resultados do preview.
Resumo usa também metadados coletados no navegador; repetir HTTP sozinho não atualiza essa
coleta cliente. Nenhuma dependência de QA foi adicionada ao package/lockfile do aplicativo.
