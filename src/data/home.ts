/**
 * Conteúdo estático da home. Fonte: arquetypus-prototipo-v6.html,
 * seções H-01 a H-25. Não inventar texto novo aqui sem confirmar —
 * ver CLAUDE.md.
 */
import heroVideoConcept from '@/assets/mocks/hero-video-concept.png'
import heroAfrodite from '@/assets/mocks/hero-afrodite.png'
import heroKit from '@/assets/mocks/hero-kit.png'
import segmentoFeminino from '@/assets/mocks/segmento-feminino.png'
import segmentoMasculino from '@/assets/mocks/segmento-masculino.png'
import segmentoUnissex from '@/assets/mocks/segmento-unissex.png'
import familiaFloral from '@/assets/mocks/familia-floral-bleed.png'
import familiaAquatico from '@/assets/mocks/familia-aquatico-bleed.png'
import familiaAmadeirado from '@/assets/mocks/familia-amadeirado-bleed.png'
import familiaOriental from '@/assets/mocks/familia-oriental-bleed.png'
import energiaSeducao from '@/assets/mocks/energia-seducao.png'
import energiaPoder from '@/assets/mocks/energia-poder.png'
import energiaMisterio from '@/assets/mocks/energia-misterio.png'
import energiaForca from '@/assets/mocks/energia-forca.png'
import frascoAfrodite from '@/assets/mocks/frasco-afrodite.png'
import frascoImperatriz from '@/assets/mocks/frasco-imperatriz.png'
import frascoCleopatra from '@/assets/mocks/frasco-cleopatra.png'
import frascoFada from '@/assets/mocks/frasco-fada.png'
import frascoSereia2 from '@/assets/mocks/frasco-sereia2.png'
import frascoZeus from '@/assets/mocks/frasco-zeus.png'
import frascoGuerreiro from '@/assets/mocks/frasco-guerreiro.png'
import frascoImperador from '@/assets/mocks/frasco-imperador.png'
import frascoFenix from '@/assets/mocks/frasco-fenix.png'
import frascoCutCleopatra from '@/assets/mocks/frasco-cut-cleopatra.png'
import frascoCutSereia from '@/assets/mocks/frasco-cut-sereia.png'
import frascoCutAfrodite from '@/assets/mocks/frasco-cut-afrodite.png'
import frascoCutGuerreiro from '@/assets/mocks/frasco-cut-guerreiro.png'
import frascoCutImperatriz from '@/assets/mocks/frasco-cut-imperatriz.png'
export { default as BODEGON_IMG } from '@/assets/mocks/bodegon-9-frascos.png'
import ugcCleopatra from '@/assets/mocks/ugc-cleopatra.jpg'
import ugcSereia from '@/assets/mocks/ugc-sereia.jpg'
import ugcAfrodite from '@/assets/mocks/ugc-afrodite.jpg'
import ugcGuerreiro from '@/assets/mocks/ugc-guerreiro.jpg'
import ugcImperatriz from '@/assets/mocks/ugc-imperatriz.jpg'

export const UGC_IMG: Record<string, string> = {
  cleopatra: ugcCleopatra,
  sereia: ugcSereia,
  afrodite: ugcAfrodite,
  guerreiro: ugcGuerreiro,
  imperatriz: ugcImperatriz,
}

export const PUV =
  'Body splash de perfumaria para quem cansou de cheirar igual a todo mundo e não quer mais escolher fragrância no escuro — nove arquétipos, um teste de 2 minutos e o direito de devolver se não for você.'

export const HERO_SLIDES = [
  {
    id: 'video',
    type: 'video' as const,
    eyebrow: 'Perfumaria de arquétipos',
    eyebrowColor: '#c9b98a',
    heading: 'Qual arquétipo\ndesperta em você?',
    sub: 'Nove fragrâncias. Uma responde pelo seu nome.',
    requisito: 'VÍDEO · 9:16 · 1080×1920 · HERO FULLSCREEN · AUTOPLAY MUTED LOOP',
    img: heroVideoConcept,
  },
  {
    id: 'afrodite',
    type: 'image' as const,
    eyebrow: 'ARQ-01 · Floral fresco',
    eyebrowColor: '#e8a9b8',
    heading: 'Afrodite',
    sub: 'O floral que não pede licença.',
    cta: { label: 'Conhecer Afrodite', to: '/arquetipos/afrodite' },
    requisito: 'FOTO · 9:16 · 1080×1920 · LIFESTYLE · AFRODITE · MODELO + FRASCO',
    img: heroAfrodite,
  },
  {
    id: 'kit',
    type: 'image' as const,
    eyebrow: 'Kit Descoberta · R$ 79,90',
    eyebrowColor: '#f7f6f3',
    heading: 'Nove miniaturas.\nO valor volta.',
    sub: 'Teste os nove antes de escolher o seu.',
    cta: { label: 'Quero experimentar', to: '/kit-descoberta' },
    requisito: 'FOTO · 9:16 · 1080×1920 · 9 MINIS · FLAT LAY OU MÃO SEGURANDO',
    img: heroKit,
  },
]

export const SEALS = ['Entrega garantida', 'Rápido e seguro', 'Vegano', 'Cruelty free']

export const DIAGNOSIS = [
  {
    n: '01',
    title: 'Escolheu sem sentir na pele',
    body: 'Nem toda fragrância combina com a sua presença.',
  },
  {
    n: '02',
    title: 'Sumiu rápido demais',
    body: 'Concentração e composição mudam toda a experiência.',
  },
  {
    n: '03',
    title: 'Parecia o cheiro de todo mundo',
    body: 'Seu perfume também pode ser parte da sua identidade.',
  },
]

export const SEGMENTS = [
  { label: 'Para elas', name: 'Feminino', meta: '200 ml · 5 SKUs', seg: 'F' as const, img: segmentoFeminino },
  { label: 'Para eles', name: 'Masculino', meta: '220 ml · 3 SKUs', seg: 'M' as const, img: segmentoMasculino },
  { label: 'Para todos', name: 'Compartilhável', meta: '220 ml · 1 SKU', seg: 'U' as const, img: segmentoUnissex },
]

/**
 * desc/attrs são copy nova (mood curto), não vem do v6 — texto pedido
 * diretamente pelo usuário para os cards de família. Revisar se já
 * existir equivalente oficial.
 */
export const FAMILIES = [
  {
    nome: 'Floral',
    arquetipos: ['afrodite', 'fada'],
    img: familiaFloral,
    desc: 'Sedutor e envolvente.',
    attrs: ['Floral', 'Sedutor', 'Leve'],
  },
  {
    nome: 'Aquático',
    arquetipos: ['sereia', 'guerreiro'],
    img: familiaAquatico,
    desc: 'Fresco e discreto.',
    attrs: ['Aquático', 'Fresco', 'Discreto'],
  },
  {
    nome: 'Amadeirado',
    arquetipos: ['imperador', 'fenix'],
    img: familiaAmadeirado,
    desc: 'Quente e marcante.',
    attrs: ['Amadeirado', 'Intenso', 'Elegante'],
  },
  {
    nome: 'Oriental doce',
    arquetipos: ['cleopatra', 'imperatriz'],
    img: familiaOriental,
    desc: 'Quente e viciante.',
    attrs: ['Oriental', 'Doce', 'Envolvente'],
  },
]

export const ENERGIES = [
  { nome: 'Sedução', arquetipos: ['afrodite', 'cleopatra'], img: energiaSeducao },
  { nome: 'Poder', arquetipos: ['imperatriz', 'imperador'], img: energiaPoder },
  { nome: 'Mistério', arquetipos: ['sereia', 'fada'], img: energiaMisterio },
  { nome: 'Força', arquetipos: ['guerreiro', 'fenix', 'zeus'], img: energiaForca },
]

/** Mock de still-life de frasco por arquétipo — mesmo molde, cor muda por SKU (ver CLAUDE.md). */
export const FRASCO_IMG: Record<string, string> = {
  afrodite: frascoAfrodite,
  imperatriz: frascoImperatriz,
  cleopatra: frascoCleopatra,
  fada: frascoFada,
  sereia: frascoSereia2,
  zeus: frascoZeus,
  guerreiro: frascoGuerreiro,
  imperador: frascoImperador,
  fenix: frascoFenix,
}

/**
 * Frasco recortado (fundo transparente, 240px de altura) — miniatura do product tag da comunidade.
 * Recorte feito no Higgsfield a partir de FRASCO_IMG; só existe para os arquétipos que têm UGC.
 */
export const FRASCO_CUT_IMG: Record<string, string> = {
  cleopatra: frascoCutCleopatra,
  sereia: frascoCutSereia,
  afrodite: frascoCutAfrodite,
  guerreiro: frascoCutGuerreiro,
  imperatriz: frascoCutImperatriz,
}

export const QUALIFICATION = [
  {
    title: 'Você cansou de cheirar igual a todo mundo.',
    body: 'Quer uma fragrância com mais identidade e menos obviedade.',
  },
  {
    title: 'Seu perfume muda com o seu momento.',
    body: 'Você não se sente igual todos os dias — seu cheiro também não precisa ser.',
  },
  {
    title: 'Você quer escolher com intenção.',
    body: 'Entender o que está usando, em vez de confiar apenas no nome ou na embalagem.',
  },
]

export const METHOD_STEPS = [
  { n: '01', title: 'Responda', body: 'Cinco perguntas sobre você — nenhuma sobre notas olfativas.' },
  { n: '02', title: 'Descubra', body: 'Seu arquétipo dominante e o secundário, com a leitura de cada um.' },
  { n: '03', title: 'Desperte', body: 'A fragrância que traduz os dois — e como usar as duas juntas.' },
]

export const STATS = [
  { pct: '94%', label: 'disseram que a fixação superou a expectativa para um splash' },
  { pct: '89%', label: 'receberam elogio no primeiro dia de uso' },
  { pct: '91%', label: 'identificaram o próprio arquétipo no resultado do teste' },
  { pct: '78%', label: 'passaram a usar mais de um arquétipo por semana' },
]

/** Cada linha pareia o que a Arquétypus declara com o que o splash comum costuma entregar. `tema` é só rótulo de leitura. */
export const COMPARISON = [
  { tema: 'Essência', arquetypus: 'Essência importada Scentec', comum: 'Essência genérica sem origem' },
  { tema: 'Segurança', arquetypus: 'Conformidade IFRA 51 declarada', comum: 'Sem declaração de conformidade' },
  { tema: 'Transparência', arquetypus: 'INCI completo publicado', comum: 'Composição só no rótulo' },
  { tema: 'Escolha', arquetypus: 'Teste de arquétipo antes da compra', comum: 'Escolha no escuro' },
  { tema: 'Sistema', arquetypus: 'Sistema de layering entre os nove', comum: 'SKU solto, sem combinação' },
  { tema: 'Origem', arquetypus: 'Fabricação em indústria licenciada', comum: 'Origem nem sempre informada' },
  { tema: 'Experimentar', arquetypus: 'Kit de amostra com crédito integral', comum: 'Sem como testar antes' },
]

export const TESTIMONIALS = [
  'Fiz o teste achando que era brincadeira. Deu Cleópatra e era exatamente eu.',
  'Uso Sereia de dia e Fênix à noite. Virou rotina.',
]

/**
 * Depoimentos fictícios/ilustrativos — placeholders pra carrossel ter
 * scroll real antes de existir conteúdo de criador de verdade. As fotos
 * (UGC_IMG) são geradas por IA (Higgsfield, com o frasco real como
 * referência): pessoas NÃO existem. Trocar fotos, @ e depoimentos por
 * conteúdo real e autorizado antes do lançamento (ver CLAUDE.md).
 */
export const UGC_VIDEOS = [
  { creator: '@marianac_', archetypeId: 'cleopatra', testimonial: TESTIMONIALS[0] },
  { creator: '@rafa.dias', archetypeId: 'sereia', testimonial: TESTIMONIALS[1] },
  { creator: '@brunavieira', archetypeId: 'afrodite', testimonial: 'Toda vez que uso Afrodite alguém pergunta o que eu estou usando.' },
  { creator: '@lucas.arq', archetypeId: 'guerreiro', testimonial: 'Não achava que body splash podia fixar assim. Guerreiro mudou o jogo.' },
  { creator: '@camis.beauty', archetypeId: 'imperatriz', testimonial: 'Imperatriz é o meu cheiro do inverno. Sério, vicia.' },
]

export const JOURNAL = [
  { title: 'Body splash ou perfume: a diferença real', body: 'Concentração, fixação e quando cada um faz sentido.' },
  { title: 'Como fazer o cheiro durar o dia inteiro', body: 'Pele hidratada, pontos de pulso e reaplicação.' },
  { title: 'Layering: como combinar dois arquétipos', body: 'Qual entra primeiro e por quê.' },
]

export const KIT_TIERS = [
  { qtd: 1, label: 'Um arquétipo', meta: '200–220 ml', unit: 89.9, economia: null as number | null },
  { qtd: 2, label: 'Dupla', meta: 'Layering dia + noite', unit: 84.9, economia: 10 },
  { qtd: 3, label: 'Trio', meta: 'Um por energia', unit: 79.9, economia: 30 },
]

export const REWARD_MINI = 150
export const REWARD_FREIGHT = 199
