/**
 * Páginas públicas do site, fora as 9 de produto (que vêm de ARCHETYPES) — base do sitemap.xml e do llms.txt
 * gerados no build (lib/arquivosSeo.ts). Ao criar ou remover uma página em App.tsx, atualizar aqui também.
 * Ficam de fora a 404 e os redirecionamentos (/arquetipos/:id, /kit-descoberta).
 */
export const SEO_HOME = {
  title: "Arquetypus | Body Splash Premium e Perfumaria de Arquétipos",
  description: "Nove fragrâncias Body Splash Premium com 10% de essência, uma para cada arquétipo. Descubra a sua: frete grátis acima de R$ 199, 6x sem juros e 5% off no Pix.",
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
      description: "Conheça a Arquétypus: nove fragrâncias Body Splash Premium com 10% de essência, uma para cada arquétipo. Você não escolhe um perfume. Você reconhece o seu.",
    },
  },
  {
    path: "/perguntas-frequentes", nome: "Perguntas frequentes",
    seo: {
      title: "Perguntas Frequentes | Arquétypus Parfum",
      description: "Tire suas dúvidas sobre os Body Splash Premium Arquétypus: entrega, pagamento, cupom, trocas, concentração de 10% de essência e como usar.",
    },
  },
  {
    path: "/entrega-e-frete", nome: "Política de Entrega e Frete",
    seo: {
      title: "Entrega e Frete | Arquétypus Parfum",
      description: "Envio em até 24 horas úteis para todo o Brasil, frete grátis acima de R$ 199 e rastreio por e-mail. Veja prazos, transportadoras e como acompanhar seu pedido.",
    },
  },
  {
    path: "/trocas-e-devolucoes", nome: "Política de Trocas e Devoluções",
    seo: {
      title: "Trocas e Devoluções | Arquétypus Parfum",
      description: "Desistência em até 7 dias com o produto lacrado, 30 dias para defeito e frete de devolução por nossa conta. Veja como pedir troca ou reembolso.",
    },
  },
  {
    path: "/regras-do-site", nome: "Regras do Site",
    seo: {
      title: "Regras de Compra | Arquétypus Parfum",
      description: "Preços, cupom de 15% na primeira compra, formas de pagamento (Pix com 5% off e 6x sem juros), confirmação, cancelamento e estoque.",
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
