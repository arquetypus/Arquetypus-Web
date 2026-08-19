/**
 * Conteúdo estático da home. Fonte: arquetypus-prototipo-v6.html,
 * seções H-01 a H-25. Não inventar texto novo aqui sem confirmar —
 * ver CLAUDE.md.
 */

export const PUV =
  'Body splash de perfumaria para quem cansou de cheirar igual a todo mundo e não quer mais escolher fragrância no escuro — nove arquétipos, um teste de 2 minutos e o direito de devolver se não for você.'

export const HERO_SLIDES = [
  {
    id: 'video',
    type: 'video' as const,
    eyebrow: 'Perfumaria de arquétipos',
    heading: 'Qual arquétipo\ndesperta em você?',
    sub: 'Nove fragrâncias. Uma responde pelo seu nome.',
    cta: { label: 'Fazer o teste', to: '/teste' },
    requisito: 'VÍDEO 9:16 · HERO FULLSCREEN · AUTOPLAY MUTED LOOP',
  },
  {
    id: 'afrodite',
    type: 'image' as const,
    eyebrow: 'ARQ-01 · Floral fresco',
    heading: 'Afrodite',
    sub: 'O floral que não pede licença.',
    cta: { label: 'Conhecer Afrodite', to: '/arquetipos/afrodite' },
    requisito: 'LIFESTYLE · AFRODITE · MODELO + FRASCO',
  },
  {
    id: 'kit',
    type: 'image' as const,
    eyebrow: 'Kit Descoberta · R$ 79,90',
    heading: 'Nove miniaturas.\nO valor volta.',
    sub: 'Teste os nove antes de escolher o seu.',
    cta: { label: 'Quero experimentar', to: '/kit-descoberta' },
    requisito: '9 MINIS · FLAT LAY OU MÃO SEGURANDO',
  },
  {
    id: 'masculino',
    type: 'image' as const,
    eyebrow: 'Coleção masculina · 220 ml',
    heading: 'Eles também\ntêm arquétipo.',
    sub: 'Guerreiro, Imperador e Zeus.',
    cta: { label: 'Ver a coleção', to: '/#segmentos' },
    requisito: 'LIFESTYLE · MASCULINO · 3 FRASCOS',
  },
]

export const SEALS = ['Vegano', 'Cruelty free', 'Notificado ANVISA', 'Padrão IFRA 51']

export const DIAGNOSIS = [
  {
    n: '01',
    title: 'Você escolheu no escuro.',
    body: 'Comprou pela embalagem, pelo nome ou porque alguém disse que era bom — sem nunca ter cheirado na sua pele.',
  },
  {
    n: '02',
    title: 'Sumiu em duas horas.',
    body: 'Body splash barato é quase todo álcool e água. Sem fixador, o cheiro evapora antes de você sair de casa.',
  },
  {
    n: '03',
    title: 'Todo mundo estava usando o mesmo.',
    body: 'Três marcas dominam a prateleira, e o cheiro que era seu virou o cheiro do elevador.',
  },
]

export const SEGMENTS = [
  { label: 'Para elas', name: 'Feminino', meta: '200 ml · 5 SKUs', seg: 'F' as const },
  { label: 'Para eles', name: 'Masculino', meta: '220 ml · 3 SKUs', seg: 'M' as const },
  { label: 'Para todos', name: 'Unissex', meta: '220 ml · 1 SKU', seg: 'U' as const },
]

export const FAMILIES = [
  { nome: 'Floral', arquetipos: ['afrodite', 'fada'] },
  { nome: 'Aquático', arquetipos: ['sereia', 'guerreiro'] },
  { nome: 'Amadeirado', arquetipos: ['imperador', 'fenix'] },
  { nome: 'Oriental doce', arquetipos: ['cleopatra', 'imperatriz'] },
]

export const ENERGIES = [
  { nome: 'Sedução', arquetipos: ['afrodite', 'cleopatra'] },
  { nome: 'Poder', arquetipos: ['imperatriz', 'imperador'] },
  { nome: 'Mistério', arquetipos: ['sereia', 'fada'] },
  { nome: 'Força', arquetipos: ['guerreiro', 'fenix', 'zeus'] },
]

export const QUALIFICATION = [
  'Você nunca encontrou um cheiro que parecesse realmente seu',
  'Você troca de fragrância conforme o humor, não conforme o frasco acaba',
  'Você quer que perguntem o que você está usando',
  'Você acha body splash prático, mas cansou de cheirar igual a todo mundo',
  'Você prefere entender o que está passando na pele a confiar no rótulo',
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

export const COMPARISON = {
  arquetypus: [
    'Essência importada Scentec',
    'Conformidade IFRA 51 declarada',
    'INCI completo publicado',
    'Teste de arquétipo antes da compra',
    'Sistema de layering entre os nove',
    'Fabricação em indústria licenciada',
    'Kit de amostra com crédito integral',
  ],
  comum: [
    'Essência genérica sem origem',
    'Sem declaração de conformidade',
    'Composição só no rótulo',
    'Escolha no escuro',
    'SKU solto, sem combinação',
    'Origem nem sempre informada',
    'Sem como testar antes',
  ],
}

export const TESTIMONIALS = [
  'Fiz o teste achando que era brincadeira. Deu Cleópatra e era exatamente eu.',
  'Uso Sereia de dia e Fênix à noite. Virou rotina.',
]

/**
 * Depoimentos fictícios/ilustrativos — placeholders pra carrossel ter
 * scroll real antes de existir conteúdo de criador de verdade. Trocar
 * por depoimentos reais antes do lançamento (ver CLAUDE.md).
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
