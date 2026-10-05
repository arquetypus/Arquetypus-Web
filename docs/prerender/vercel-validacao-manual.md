# Validação manual da Vercel — Etapa 6

Todo acesso ao painel e toda operação administrativa serão realizados pelo usuário.
O agente solicita resultados e testa o site público pelo Google Chrome. Não é necessário
compartilhar senha, token, variáveis de ambiente ou dados de visitantes.

## Preview: identidade e build

1. Abra o projeto `arquetypus-parfum` em **Deployments**. Selecione o deployment mais
   recente da branch `prerender`, ambiente **Preview**, e copie status, SHA e URL/ID.
2. Último deployment identificado nos bytes usados pelo QA Chrome:
   `dpl_89SSTyW7scpYwRyuv7LrDDK4zUge`, commit documental esperado
   `67d66d35c4535f121cd0c4179e5f531acee52012`. Caso o painel mostre outro deployment,
   envie os valores observados; não assuma que o alias continua apontando o anterior.
3. Consulte as configurações efetivas desse deployment/projeto e informe:
   **Framework Preset**, **Build Command**, **Output Directory**, **Node.js Version**
   e se existem overrides. Esperado: Vite, `npm run build` (ou equivalente que execute
   integralmente esse script), `dist`, Node `24.x`. Não altere valores nesta consulta.
4. Expanda **Build Logs**. Envie o comando executado e o trecho final, cobrindo
   verificação de `vercel.json`, TypeScript, build cliente/servidor, smoke SSR,
   pré-renderização e verificação final. Esperado: 18 páginas públicas + `404.html`,
   sem erro. Apenas `vite build` não satisfaz o plano.
5. Informe warnings existentes. Remova segredos caso apareçam nos logs; não envie
   conteúdo de variáveis de ambiente.

## Produção estável e possibilidade de rollback

1. Abra o deployment de produção estável, identificado anteriormente pelo commit
   `8a02e4a2135d407c61315e1ec039c3d28ac9b3f2` e domínio `www.arquetypus.com.br`.
2. Informe URL/ID, commit, status e domínios associados, conforme o painel atual.
3. Consulte as opções do deployment/projeto e verifique se **Instant Rollback** está
   disponível à sua conta e qual deployment seria elegível como destino de recuperação.
   Se aparecer desativado/indisponível, informe a razão exibida.
4. **Não confirme rollback, não promova preview e não publique em produção.** Esta etapa
   comprova preparação administrativa; não testa uma troca efetiva em produção.
5. Caso o fluxo não permita consultar elegibilidade sem executar a operação, interrompa
   a consulta e informe isso. Disponibilidade não será marcada como comprovada por suposição.

Referência: [Instant Rollback — documentação Vercel](https://vercel.com/docs/instant-rollback).

## Resposta para registrar evidência

```text
Preview: status / SHA / URL ou ID:
Framework Preset:
Build Command efetivo / overrides:
Output Directory:
Node.js Version:
Trecho final de Build Logs e warnings:
Produção estável: status / SHA / URL ou ID / domínios:
Instant Rollback disponível à minha conta:
Destino elegível / motivo de indisponibilidade:
```

Pendências de TBT e aceite técnico continuam independentes desta consulta.
Publicação da Etapa 7 exige o aceite da Etapa 6 e autorização específica.

## Evidência recebida — 05/10/2026

Consulta realizada manualmente pelo usuário; agente não acessou painel Vercel.
Fontes: três anexos de texto (build, static assets, lint) e prints de configurações,
deployment de produção e diálogo Instant Rollback fornecidos na conversa.

- Build do preview `prerender` / `67d66d3`: pipeline completo aprovado, incluindo
  TypeScript, SSR, 18 páginas + 404 e verificação final; 19 HTMLs no inventário.
- Configurações: Vite, Node `24.x`, root `./`, saída `dist`, overrides do painel desligados.
  `vercel.json` define `npm run build` e `dist`; não foi necessário alterar configuração.
- Lint do preview: 33 avisos, zero erros, exit 0. TypeCheck separado foi ignorado por
  ausência de script `typecheck`; `tsc -b` foi executado com sucesso no build.
- Produção estável: `main` / `8a02e4a`, Ready, Production/Current; deployment
  `arquetypus-parfum-b6orb7kc1-saniella.vercel.app`, prefixo de ID visível `4yrXKF69r`;
  domínio `www.arquetypus.com.br` e demais domínios do projeto associados.
- Overview abriu diálogo Instant Rollback: produção atual `8a02e4a`, destino anterior
  `3833162`, opção Choose another deployment e botão Continue disponíveis.
  Preparação administrativa comprovada; troca efetiva não foi testada nem solicitada.
- Após futura publicação autorizada, preservar `8a02e4a` como referência de recuperação.

**Consulta de build/configuração e preparação de rollback encerrada.** Operações futuras
permanecem manuais. Gate de TBT analisado separadamente em [investigação](etapa6-tbt.md).
