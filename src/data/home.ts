/**
 * Conteúdo estático da home. Fonte: arquetypus-prototipo-v6.html,
 * seções H-01 a H-25. Não inventar texto novo aqui sem confirmar —
 * ver CLAUDE.md.
 */
import heroVideo from '@/assets/hero/hero-video.mp4'
import heroVideoPoster from '@/assets/hero/hero-video-poster.jpg'
// Fotos em src/assets/fotos/ são as escolhidas pela designer (set/2026), convertidas pra JPG.
import heroAfrodite from '@/assets/fotos/hero/afrodite.jpg'
import heroGuerreiro from '@/assets/fotos/hero/guerreiro.jpg'
// versões 16:9 pro desktop (lg+). Afrodite/Guerreiro: foto 9:16 da designer recortada em 3:4 e expandida
// pra 16:9 no Higgsfield (FLUX.2 Pro Outpaint), mais espaço à esquerda pro texto — o centro é a foto original.
// No slide de vídeo o desktop mostra um still (o vídeo é 9:16): frascos reais sobre pedra escura, gerado no
// Higgsfield (GPT Image 2.5) com as fotos de produto como referência — trocar pela foto de campanha quando houver
import heroVideoDesktop from '@/assets/fotos/hero/colecao-desktop.jpg'
import heroAfroditeDesktop from '@/assets/fotos/hero/afrodite-desktop.jpg'
import heroGuerreiroDesktop from '@/assets/fotos/hero/guerreiro-desktop.jpg'
import segmentoFeminino from '@/assets/fotos/segmentos/feminino.jpg'
import segmentoMasculino from '@/assets/fotos/segmentos/masculino.jpg'
import segmentoUnissex from '@/assets/fotos/segmentos/compartilhavel.jpg'
import familiaFloral from '@/assets/mocks/familia-floral-bleed.png'
import familiaAquatico from '@/assets/mocks/familia-aquatico-bleed.png'
import familiaAmadeirado from '@/assets/mocks/familia-amadeirado-bleed.png'
import familiaOriental from '@/assets/mocks/familia-oriental-bleed.png'
import energiaSeducao from '@/assets/mocks/energia-seducao.png'
import energiaPoder from '@/assets/mocks/energia-poder.png'
import energiaMisterio from '@/assets/mocks/energia-misterio.png'
import energiaForca from '@/assets/mocks/energia-forca.png'
import frascoAfrodite from '@/assets/fotos/catalogo/afrodite.jpg'
import frascoImperatriz from '@/assets/fotos/catalogo/imperatriz.jpg'
import frascoCleopatra from '@/assets/fotos/catalogo/cleopatra.jpg'
import frascoFada from '@/assets/fotos/catalogo/fada.jpg'
import frascoSereia from '@/assets/fotos/catalogo/sereia.jpg'
import frascoZeus from '@/assets/fotos/catalogo/zeus.jpg'
import frascoGuerreiro from '@/assets/fotos/catalogo/guerreiro.jpg'
import frascoImperador from '@/assets/fotos/catalogo/imperador.jpg'
import frascoFenix from '@/assets/fotos/catalogo/fenix.jpg'
import miniAfrodite from '@/assets/fotos/miniaturas/afrodite.jpg'
import miniImperatriz from '@/assets/fotos/miniaturas/imperatriz.jpg'
import miniCleopatra from '@/assets/fotos/miniaturas/cleopatra.jpg'
import miniFada from '@/assets/fotos/miniaturas/fada.jpg'
import miniSereia from '@/assets/fotos/miniaturas/sereia.jpg'
import miniZeus from '@/assets/fotos/miniaturas/zeus.jpg'
import miniGuerreiro from '@/assets/fotos/miniaturas/guerreiro.jpg'
import miniImperador from '@/assets/fotos/miniaturas/imperador.jpg'
import miniFenix from '@/assets/fotos/miniaturas/fenix.jpg'
export { default as BODEGON_IMG } from '@/assets/fotos/colecao-completa.jpg'
import ugcCleopatra from '@/assets/fotos/comunidade/cleopatra.jpg'
import ugcSereia from '@/assets/fotos/comunidade/sereia.jpg'
import ugcAfrodite from '@/assets/fotos/comunidade/afrodite.jpg'
import ugcImperatriz from '@/assets/fotos/comunidade/imperatriz.jpg'

export const UGC_IMG: Record<string, string> = {
  cleopatra: ugcCleopatra,
  sereia: ugcSereia,
  afrodite: ugcAfrodite,
  imperatriz: ugcImperatriz,
}

export const PUV =
  'Body splash de perfumaria para quem cansou de cheirar igual a todo mundo e não quer mais escolher fragrância no escuro — nove arquétipos, um teste de 2 minutos e o direito de devolver se não for você.'

export const HERO_SLIDES = [
  {
    id: 'video',
    type: 'video' as const,
    eyebrow: 'Perfumaria & expressão',
    eyebrowColor: '#c6a46c',
    heading: 'Descubra qual versão\nde você quer\nexpressar hoje.',
    sub: 'Nove fragrâncias. Diferentes formas de expressão.',
    requisito: 'VÍDEO · 9:16 · 1080×1920 · HERO FULLSCREEN · AUTOPLAY MUTED',
    img: heroVideoPoster,
    imgDesktop: heroVideoDesktop,
    video: heroVideo,
    // tom do escurecimento atrás do texto — marrom quase preto, da luz âmbar da foto dos frascos
    tint: '#150e09',
    // o slide dura o vídeo inteiro (11,45 s) em vez dos 5 s padrão
    durationMs: 11450,
  },
  {
    id: 'afrodite',
    type: 'image' as const,
    eyebrow: 'ARQ-01 · Floral fresco',
    eyebrowColor: '#e8a9b8',
    heading: 'Afrodite',
    sub: 'O floral que não pede licença.',
    cta: { label: 'Conhecer Afrodite', to: '/loja/afrodite' },
    requisito: 'FOTO · 9:16 · 1080×1920 · LIFESTYLE · AFRODITE · MODELO + FRASCO',
    img: heroAfrodite,
    imgDesktop: heroAfroditeDesktop,
    tint: '#2e141c', // vinho/rosado bem escuro
  },
  {
    // foto gerada por IA (Higgsfield) com o frasco real como referência — trocar pela de campanha
    id: 'guerreiro',
    type: 'image' as const,
    eyebrow: 'ARQ-07 · Aromático aquático',
    eyebrowColor: '#a9bad3',
    heading: 'Guerreiro',
    sub: 'Constância é a forma mais rara de coragem.',
    cta: { label: 'Conhecer Guerreiro', to: '/loja/guerreiro' },
    requisito: 'FOTO · 9:16 · 1080×1920 · LIFESTYLE · GUERREIRO · MODELO + FRASCO',
    img: heroGuerreiro,
    imgDesktop: heroGuerreiroDesktop,
    tint: '#0e1829', // azul-marinho escuro
  },
]

export const SEALS = ['Entrega garantida', 'Rápido e seguro', 'Vegano', 'Cruelty free']

export const DIAGNOSIS = [
  {
    n: '01',
    title: 'Escolheu sem experimentar',
    body: 'Cada fragrância desperta uma sensação diferente.',
  },
  {
    n: '02',
    title: 'Não entregou a experiência que você esperava',
    body: 'Composição, intensidade e aplicação transformam a experiência na pele.',
  },
  {
    n: '03',
    title: 'Faltava algo que parecesse seu',
    body: 'Uma fragrância também pode expressar como você quer se sentir e ser percebido.',
  },
]

// título da seção de gênero — copy nova aprovada pelo usuário (set/2026), não vem do v6
export const SEGMENTS_HEADING = { eyebrow: 'Coleções', title: 'Escolha por onde começar' }

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

/** Foto do frasco (pasta "bodys" da designer) — card do catálogo "Os 9 arquétipos". A foto com pessoa fica na galeria da PDP. */
export const FRASCO_IMG: Record<string, string> = {
  afrodite: frascoAfrodite,
  imperatriz: frascoImperatriz,
  cleopatra: frascoCleopatra,
  fada: frascoFada,
  sereia: frascoSereia,
  zeus: frascoZeus,
  guerreiro: frascoGuerreiro,
  imperador: frascoImperador,
  fenix: frascoFenix,
}

/**
 * Miniatura do frasco (52:76) — product tag da comunidade. Recorte da foto de produto
 * (pasta "bodys" da designer) centrado no frasco; não é recorte com fundo transparente.
 */
export const FRASCO_CUT_IMG: Record<string, string> = {
  afrodite: miniAfrodite,
  imperatriz: miniImperatriz,
  cleopatra: miniCleopatra,
  fada: miniFada,
  sereia: miniSereia,
  zeus: miniZeus,
  guerreiro: miniGuerreiro,
  imperador: miniImperador,
  fenix: miniFenix,
}

export const QUALIFICATION = [
  {
    title: 'Você quer uma fragrância que tenha mais a ver com você.',
    body: 'Um cheiro que tenha presença, intenção e personalidade.',
  },
  {
    title: 'Seu perfume pode mudar com o seu momento.',
    body: 'Você não se sente igual todos os dias — seu cheiro também não precisa ser.',
  },
  {
    title: 'Você quer escolher com intenção.',
    body: 'Entender o que uma fragrância transmite antes de escolher.',
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
]

export const TESTIMONIALS = [
  'Fiz o teste achando que era brincadeira. Deu Cleópatra e era exatamente eu.',
  'Uso Sereia de dia e Fênix à noite. Virou rotina.',
]

/**
 * Depoimentos fictícios/ilustrativos — placeholders pra carrossel ter
 * scroll real antes de existir conteúdo de criador de verdade. As fotos
 * (UGC_IMG) são as escolhidas pela designer (set/2026), com os @ tirados
 * dos nomes dos arquivos dela — confirmar se são pessoas reais e autorizadas. Trocar fotos, @ e depoimentos por
 * conteúdo real e autorizado antes do lançamento (ver CLAUDE.md).
 */
export const UGC_VIDEOS = [
  { creator: '@marianac_', archetypeId: 'cleopatra', testimonial: TESTIMONIALS[0] },
  { creator: '@rafa_dias', archetypeId: 'sereia', testimonial: TESTIMONIALS[1] },
  { creator: '@brunavieira', archetypeId: 'afrodite', testimonial: 'Toda vez que uso Afrodite alguém pergunta o que eu estou usando.' },
  { creator: '@camila.beauty', archetypeId: 'imperatriz', testimonial: 'Imperatriz é o meu cheiro do inverno. Sério, vicia.' },
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

/**
 * Textos das seções da home que estavam escritos direto no HomePage. As direções com página própria
 * (components/directions/) leem daqui — mesmo conteúdo, só muda a forma. Não é copy nova: é a mesma do
 * HomePage (revisão de set/2026).
 */
export const HOME_COPY = {
  segmentos: { cta: 'Ver coleção' },
  diagnostico: {
    eyebrow: 'O perfume errado',
    title: 'Você já escolheu uma fragrância que não combinava com você?',
    sub: 'Às vezes, encontrar o cheiro certo começa por entender o que você procura.',
    fecho: ['Não comece pelo nome.', 'Comece por você.'] as const,
  },
  familias: {
    eyebrow: 'Entrada racional',
    title: 'Descubra pelo cheiro',
    sub: 'Explore as famílias olfativas e encontre os cheiros que mais combinam com você.',
  },
  energias: {
    eyebrow: 'Entrada emocional',
    title: 'Como você quer se sentir hoje?',
    sub: 'Escolha pela presença que você quer expressar.',
  },
  reconhecimento: {
    eyebrow: 'Reconhecimento',
    title: 'Talvez você esteja procurando mais do que um cheiro.',
    sub: 'Talvez esteja procurando uma fragrância que acompanhe o seu momento.',
    fecho: ['Se você se reconheceu,', 'existe uma Arquétypus', 'para o seu momento.'] as const,
  },
  catalogo: { eyebrow: 'O catálogo', title: ['Nove fragrâncias.', 'Diferentes versões de você.'] as const },
  destaque: { eyebrow: 'Arquétipo em destaque', cta: 'Conhecer' },
  ponte: { text: 'Talvez você não seja apenas um.', cta: 'Descubra seus arquétipos' },
  diferenca: {
    eyebrow: 'A diferença',
    title: ['Uma experiência que vai', 'além do cheiro.'] as const,
    colunas: ['Arquétypus', 'Splash comum'] as const,
    fecho: ['Não é apenas sobre cheirar bem.', 'É sobre como você quer se sentir.'] as const,
  },
  comunidade: {
    eyebrow: 'A comunidade',
    title: 'Experiências Arquétypus',
    sub: 'Pessoas reais. Diferentes fragrâncias, momentos e formas de expressão.',
    cta: 'Descobrir',
  },
  garantia: {
    dias: '07',
    label: 'Dias de garantia',
    title: ['Experimente na pele.', 'Descubra se essa fragrância combina com você.'] as const,
    body: ['Deixe a fragrância se revelar.', 'Se não for para você, devolvemos o valor.'] as const,
    nota: 'Sem perguntas · Mesmo com o frasco aberto',
  },
  criadores: {
    eyebrow: 'Para criadores',
    title: ['Sua experiência com Arquétypus pode', 'inspirar novas descobertas.'] as const,
    body: 'Compartilhe suas fragrâncias favoritas e ganhe com cada venda pelo seu link.',
    body2:
      'Você experimenta, escolhe suas favoritas e compartilha a experiência do seu jeito. Materiais, ângulos que funcionam e ranking de criadores no painel.',
    cta: 'Quero ser criador',
  },
  diario: { eyebrow: 'Descubra mais sobre perfumaria', title: 'Diário olfativo', breve: 'Em breve' },
  cupom: {
    eyebrow: 'Primeira compra',
    valor: '15%',
    title: 'na sua primeira Arquétypus.',
    body: 'Receba seu benefício e descubra primeiro as novidades da Arquétypus.',
    cta: 'Quero meu cupom',
  },
  rodape: {
    tagline: ['Você não escolhe um perfume.', 'Você reconhece o seu.'] as const,
    pagamentos: 'Pix · Visa · Master · Elo · Boleto',
    sac: 'sac@arquetypus.com.br',
    redes: ['Instagram', 'TikTok', 'Pinterest'] as const,
    empresa: 'Saniella Ltda · CNPJ 58.267.823/0001-68 · Caraguatatuba SP',
  },
}
