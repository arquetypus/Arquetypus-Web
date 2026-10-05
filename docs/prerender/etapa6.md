# Etapa 6 — roteamento Vercel e preview

## Estado

Em execução. Build local aprovado (19 HTMLs, 91 recursos, 18 canonicals), matcher
validado em 139 casos. Push/validação remota e aceite de navegador ainda pendentes.
Produção/`main` não foram alterados. Etapa 7 não está autorizada nesta execução.

## Configuração

`scripts/configure-vercel.mjs` carrega `ARCHETYPES` pelo Vite existente e materializa
`vercel.json` antes do commit. `verify:vercel`, primeiro gate do build, detecta drift
sem tentar corrigir configuração depois de ela ser lida pela Vercel. Sem dependência nova.

Preset Vite, comando completo e saída `dist` ficam explícitos no arquivo versionado.
`cleanUrls`/`trailingSlash` substituem rewrite SPA. Matcher preserva nove IDs válidos,
incluindo percent-encoding, barra e extensão; rejeita prefixos/sufixos, IDs maiúsculos
e nomes herdados. Segmento adicional não é tratado como produto inválido: recebe 404.

`404.html` é o mecanismo estático nativo documentado pela
[Vercel](https://vercel.com/kb/guide/custom-404-page); status e corpo ainda precisam
ser comprovados no deployment. Não há catch-all 200 nem configuração `routes` legado.

README e CLAUDE descrevem pipeline e novo roteamento. Regras de produto preservadas.

## Pendências para aceite

- Conferir check Vercel/SHA e GET/HEAD de páginas, redirects, 404 e recursos.
- Canonicals oficiais, header `noindex` do preview, cache e integridade dos assets.
- Repetir paridade/hidratação e cenários funcionais da Etapa 5 no preview.
- Três medidas equivalentes por URL e investigação do LCP da PDP; Lighthouse SEO.
- Schema.org, limites de Rich Results e metadados sociais sem enviar mensagens.
- Disponibilidade/permissão de rollback antes de produção.

Navegador conectado indisponível no início desta execução. HTTP não depende dele;
ausência de evidência visual/desempenho não será registrada como aprovação.
