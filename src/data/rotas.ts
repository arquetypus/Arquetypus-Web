/**
 * Páginas públicas do site, fora as 9 de produto (que vêm de ARCHETYPES) — base do sitemap.xml e do llms.txt
 * gerados no build (lib/arquivosSeo.ts). Ao criar ou remover uma página em App.tsx, atualizar aqui também.
 * Ficam de fora a 404 e os redirecionamentos (/arquetipos/:id, /kit-descoberta).
 */
export const PAGINAS_PUBLICAS = [
  { path: '/', nome: 'Home' },
  { path: '/criadores', nome: 'Programa de criadores' },
  { path: '/sobre', nome: 'Sobre a Arquétypus' },
  { path: '/perguntas-frequentes', nome: 'Perguntas frequentes' },
  { path: '/entrega-e-frete', nome: 'Política de Entrega e Frete' },
  { path: '/trocas-e-devolucoes', nome: 'Política de Trocas e Devoluções' },
  { path: '/regras-do-site', nome: 'Regras do Site' },
  { path: '/privacidade', nome: 'Política de Privacidade' },
  { path: '/termos-de-uso', nome: 'Termos de Uso' },
] as const
