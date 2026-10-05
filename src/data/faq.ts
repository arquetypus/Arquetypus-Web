/**
 * Perguntas frequentes (revisadas em out/2026). FAQ_PRODUTO aparece na página do produto (PDP) e em
 * /perguntas-frequentes; FAQ_LOJA só nesta última. Respostas com {{token}} viram link na página (ver FaqPage).
 * Texto aqui, nunca no componente. Números comerciais (prazos, Pix, parcelas, essência) vêm de CONDICOES.
 * Regras do usuário: sem promessa de duração na pele (só a concentração de 10%);
 * desistência em 7 dias com o produto lacrado e sem uso.
 */
import { ARCHETYPES } from '@/data/archetypes'
import { brlInteiro, CONDICOES, FRETE_GRATIS_ACIMA, OPERACAO } from '@/data/empresa'
import { porExtenso } from '@/lib/extenso'

export interface Pergunta {
  q: string
  a: string
}

export const FAQ_PRODUTO: Pergunta[] = [
  {
    q: 'Qual a diferença entre Body Splash Premium e perfume?',
    a: `O Body Splash Premium é feito para o corpo todo, com sensação de frescor e reaplicação livre ao longo do dia. O nosso tem ${CONDICOES.essenciaPct}% de essência — bem acima dos cerca de 4% de um body splash tradicional. O perfume concentra mais essência e é aplicado em pontos específicos. Um não substitui o outro: muita gente usa os dois em camadas.`,
  },
  {
    q: `O que significa ter ${CONDICOES.essenciaPct}% de essência?`,
    a: `É a proporção de fragrância na fórmula. Com ${CONDICOES.essenciaPct}% de essência, o Body Splash Premium tem mais intensidade e presença do que um body splash tradicional. A percepção muda de pessoa para pessoa, com o tipo de pele e o clima — aplicar logo depois do banho, com a pele ainda úmida, ajuda a fragrância a se revelar.`,
  },
  { q: 'Posso usar todos os dias?', a: 'Sim. É um produto de uso diário, para o corpo todo. Reaplique quando quiser.' },
  {
    q: 'Pode manchar a roupa?',
    a: 'Aplique na pele, não sobre o tecido, e espere secar antes de vestir. Como qualquer produto com álcool e essência, o contato direto com tecidos claros ou delicados pode marcar.',
  },
  {
    q: 'Gestantes e lactantes podem usar?',
    a: 'Recomendamos consultar seu médico antes de usar qualquer cosmético com fragrância durante a gestação e a amamentação.',
  },
  {
    q: 'Tenho pele sensível ou alergia. E agora?',
    a: 'A composição completa (INCI), com os alérgenos de declaração obrigatória, está na embalagem de cada produto. Antes do primeiro uso, faça um teste numa pequena área do antebraço e aguarde 24 horas. Se houver irritação, suspenda o uso.',
  },
  {
    q: 'Como funciona o teste de arquétipo?',
    a: 'São cinco perguntas sobre você — nenhuma sobre notas olfativas. No fim, você recebe seu arquétipo dominante e o secundário, com a fragrância de cada um e a sugestão de como combinar os dois. O teste chega em breve ao site.',
  },
  {
    q: 'E se eu não gostar da fragrância?',
    a: `Você tem ${CONDICOES.desistenciaDias} dias a partir do recebimento para desistir da compra, com o produto lacrado e sem uso. Para escolher com segurança antes de abrir, veja as notas olfativas e a família de cada fragrância na página do produto.`,
  },
  {
    q: 'Como funciona a entrega?',
    a: `Enviamos em até ${CONDICOES.envioHorasUteis} horas úteis depois da aprovação do pagamento, para todo o Brasil. O frete é grátis acima de ${brlInteiro(FRETE_GRATIS_ACIMA)}, e o prazo aparece no carrinho assim que você informa o CEP.`,
  },
]

export const FAQ_LOJA: Pergunta[] = [
  {
    q: 'O site é seguro?',
    a: 'Sim. O site usa conexão criptografada (HTTPS, com certificado SSL), e os pagamentos são processados pelo Mercado Pago — os dados do seu cartão não ficam guardados com a gente.',
  },
  {
    q: 'Os produtos são originais?',
    a: `Sim. Os ${porExtenso(ARCHETYPES.length, 'm')} Body Splash Premium são criados e vendidos pela própria Arquétypus — não revendemos outras marcas. Todos são fabricados em indústria com as licenças exigidas e regularizados na Anvisa.`,
  },
  {
    q: 'A Arquétypus tem CNPJ e emite nota fiscal?',
    a: 'Sim. A Arquétypus é uma marca da Saniella Ltda, CNPJ 58.267.823/0001-68, e todo pedido sai com nota fiscal eletrônica, enviada por e-mail.',
  },
  {
    q: 'Quais são as formas de pagamento?',
    a: `Pix, com ${CONDICOES.pixDescontoPct}% de desconto, e cartão de crédito Visa, Mastercard, Elo, American Express ou Hipercard em até ${CONDICOES.parcelasSemJuros}x sem juros. Os pagamentos são processados pelo ${OPERACAO.pagamento}.`,
  },
  {
    q: 'Como funciona o cupom de primeira compra?',
    a: `Cadastre seu e-mail na home e receba ${CONDICOES.cupomPrimeiraCompraPct}% de desconto na primeira compra. O cupom vale uma vez por CPF e pode ser usado junto com outras promoções, inclusive o desconto do Pix. Regras completas em {{regras}}.`,
  },
  {
    q: 'Em quanto tempo meu pedido é enviado?',
    a: `Em até ${CONDICOES.envioHorasUteis} horas úteis depois da aprovação do pagamento. Os envios são feitos pela plataforma ${OPERACAO.frete}, com Correios, Jadlog ou J&T Express — você escolhe a opção no carrinho, com o valor e o prazo para o seu CEP. Detalhes em {{entrega}}.`,
  },
  {
    q: 'Como acompanho a entrega?',
    a: 'Assim que o pedido é postado, você recebe por e-mail o código de rastreio para acompanhar a entrega.',
  },
  {
    q: 'Posso trocar ou devolver?',
    a: `Sim. Você tem ${CONDICOES.desistenciaDias} dias a partir do recebimento para desistir da compra, com o produto lacrado e sem uso, e ${CONDICOES.defeitoDias} dias para nos avisar de um defeito. O frete de volta é por nossa conta. Veja {{trocas}}.`,
  },
  {
    q: 'As fotos são reais?',
    a: 'As fotos do catálogo e das páginas de produto mostram os frascos reais. Algumas imagens de ambientação e de campanha são ilustrativas, e as cores podem variar um pouco conforme a tela.',
  },
  {
    q: 'A Arquétypus tem loja física?',
    a: 'Não. A Arquétypus é 100% online e entrega em todo o Brasil.',
  },
  {
    q: 'A Arquétypus trabalha com criadores de conteúdo?',
    a: 'Sim. Se a sua comunidade combina com a marca, candidate-se em {{criadores}}.',
  },
  {
    q: 'Como falo com vocês?',
    a: 'Pelo WhatsApp {{whatsapp}}, pelo e-mail {{email}} ou pelo Instagram {{instagram}}.',
  },
]
