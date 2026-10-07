import { ARCHETYPES } from '@/data/archetypes'
import { brlInteiro, CONDICOES, FRETE_GRATIS_ACIMA } from '@/data/empresa'
import { maiuscula, porExtenso } from '@/lib/extenso'

/**
 * Páginas públicas do site, fora as 9 de produto (que vêm de ARCHETYPES) — base do sitemap.xml e do llms.txt
 * gerados no build (lib/arquivosSeo.ts). As rotas do App.tsx saem desta lista (mapa PAGINAS).
 * Ficam de fora a 404 e os redirecionamentos (/kit-descoberta, /body-splash sem produto e os endereços antigos de
 * produto /loja/:id e /arquetipos/:id).
 */
export const SEO_HOME = {
  title: "Arquetypus | Body Splash Premium e Perfumaria de Arquétipos",
  description: `${maiuscula(porExtenso(ARCHETYPES.length))} fragrâncias Body Splash Premium com ${CONDICOES.essenciaPct}% de essência, uma para cada arquétipo. Descubra a sua: ${FRETE_GRATIS_ACIMA ? `frete grátis acima de ${brlInteiro(FRETE_GRATIS_ACIMA)}, ` : ''}${CONDICOES.parcelasSemJuros}x sem juros e ${CONDICOES.pixDescontoPct}% off no Pix.`,
} as const

export const PAGINAS_PUBLICAS = [
  {
    path: "/", nome: "Home",
    seo: SEO_HOME,
  },
  {
    path: "/criadores", nome: "Programa de criadores",
    seo: {
      title: "Programa de Criadores | Arquétypus Parfum",
      description: "Faça parte do programa de criadores da Arquétypus: indique nossos Body Splash Premium para a sua comunidade e ganhe comissão por venda. Candidate-se.",
    },
  },
  {
    path: "/sobre", nome: "Sobre a Arquétypus",
    seo: {
      title: "Sobre Nós: Perfumaria de Arquétipos | Arquétypus Parfum",
      description: `Conheça a Arquétypus: ${porExtenso(ARCHETYPES.length)} fragrâncias Body Splash Premium com ${CONDICOES.essenciaPct}% de essência, uma para cada arquétipo. Você não escolhe um perfume. Você reconhece o seu.`,
    },
  },
  {
    path: "/perguntas-frequentes", nome: "Perguntas frequentes",
    seo: {
      title: "Perguntas Frequentes | Arquétypus Parfum",
      description: `Tire suas dúvidas sobre os Body Splash Premium Arquétypus: entrega, pagamento, cupom, trocas, concentração de ${CONDICOES.essenciaPct}% de essência e como usar.`,
    },
  },
  {
    path: "/entrega-e-frete", nome: "Política de Entrega e Frete",
    seo: {
      title: "Entrega e Frete | Arquétypus Parfum",
      description: `Envio em até ${CONDICOES.envioHorasUteis} horas úteis para todo o Brasil${FRETE_GRATIS_ACIMA ? `, frete grátis acima de ${brlInteiro(FRETE_GRATIS_ACIMA)}` : ''} e rastreio por e-mail. Veja prazos, transportadoras e como acompanhar seu pedido.`,
    },
  },
  {
    path: "/trocas-e-devolucoes", nome: "Política de Trocas e Devoluções",
    seo: {
      title: "Trocas e Devoluções | Arquétypus Parfum",
      description: `Desistência em até ${CONDICOES.desistenciaDias} dias com o produto lacrado, ${CONDICOES.defeitoDias} dias para defeito e frete de devolução por nossa conta. Veja como pedir troca ou reembolso.`,
    },
  },
  {
    path: "/regras-do-site", nome: "Regras do Site",
    seo: {
      title: "Regras de Compra | Arquétypus Parfum",
      description: `Preços, cupom de ${CONDICOES.cupomPrimeiraCompraPct}% na primeira compra, formas de pagamento (Pix com ${CONDICOES.pixDescontoPct}% off e ${CONDICOES.parcelasSemJuros}x sem juros), confirmação, cancelamento e estoque.`,
    },
  },
  {
    path: "/privacidade", nome: "Política de Privacidade",
    seo: {
      title: "Política de Privacidade | Arquétypus Parfum",
      description: "Como a Arquétypus coleta, usa e protege seus dados pessoais, de acordo com a LGPD: cookies, compras, cadastro, seus direitos e como falar com a gente.",
    },
  },
  {
    path: "/termos-de-uso", nome: "Termos de Uso",
    seo: {
      title: "Termos de Uso | Arquétypus Parfum",
      description: "Termos de uso do site da Arquétypus Parfum: quem pode comprar, uso do conteúdo, propriedade intelectual, responsabilidade e foro.",
    },
  },
] as const
