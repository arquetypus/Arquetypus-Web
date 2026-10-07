/**
 * Conteúdo estático da home. Fonte: arquetypus-prototipo-v6.html,
 * seções H-01 a H-25. Não inventar texto novo aqui sem confirmar —
 * ver CLAUDE.md.
 */
import { ARCHETYPES, getArchetype, productPath, produtoNome } from '@/data/archetypes'
import { FAMILIAS } from '@/data/families'
import { CONDICOES, EMPRESA, EMPRESA_LINHA, FRETE_GRATIS_PLANEJADO } from '@/data/empresa'
import { maiuscula, porExtenso } from '@/lib/extenso'
import { foto, fotosPorId, urls, type FotoBruta } from '@/lib/foto'
import heroVideo from '@/assets/hero/hero-video.mp4'
import heroVideoPoster from '@/assets/hero/hero-video-poster.jpg?responsiva'
// Fotos em src/assets/fotos/ são as escolhidas pela designer (set/2026), convertidas pra JPG.
import heroAfrodite from '@/assets/fotos/hero/afrodite.jpg?responsiva'
import heroGuerreiro from '@/assets/fotos/hero/guerreiro.jpg?responsiva'
// versões 16:9 pro desktop (lg+). Afrodite/Guerreiro: foto 9:16 da designer recortada em 3:4 e expandida
// pra 16:9 no Higgsfield (FLUX.2 Pro Outpaint), mais espaço à esquerda pro texto — o centro é a foto original.
// No slide de vídeo o desktop mostra um still (o vídeo é 9:16): frascos reais sobre pedra escura, gerado no
// Higgsfield (GPT Image 2.5) com as fotos de produto como referência — trocar pela foto de campanha quando houver
import heroVideoDesktop from '@/assets/fotos/hero/colecao-desktop.jpg?responsiva'
import heroAfroditeDesktop from '@/assets/fotos/hero/afrodite-desktop.jpg?responsiva'
import heroGuerreiroDesktop from '@/assets/fotos/hero/guerreiro-desktop.jpg?responsiva'
import segmentoFeminino from '@/assets/fotos/segmentos/feminino.jpg?responsiva'
import segmentoMasculino from '@/assets/fotos/segmentos/masculino.jpg?responsiva'
import segmentoUnissex from '@/assets/fotos/segmentos/compartilhavel.jpg?responsiva'
import energiaSeducao from '@/assets/mocks/energia-seducao.png'
import energiaPoder from '@/assets/mocks/energia-poder.png'
import energiaMisterio from '@/assets/mocks/energia-misterio.png'
import energiaForca from '@/assets/mocks/energia-forca.png'
export { default as BODEGON_IMG } from '@/assets/fotos/colecao-completa.jpg'

// Fotos da comunidade (arquivo = id do arquétipo). Fada, Fênix, Guerreiro, Imperador e Zeus foram geradas por IA
// (Higgsfield, GPT Image 2.5, out/2026) a partir das fotos de frasco da PDP — placeholders, ver UGC_VIDEOS.
// Lidas por pasta, em várias larguras (lib/foto.ts): foto nova com o id do arquétipo entra sozinha.
export const UGC_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/comunidade/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const UGC_IMG = urls(UGC_FOTO)

export const PUV =
  `Body Splash Premium de perfumaria para quem cansou de cheirar igual a todo mundo e não quer mais escolher fragrância no escuro — ${porExtenso(ARCHETYPES.length, 'm')} arquétipos, um teste de 2 minutos e ${CONDICOES.desistenciaDias} dias de garantia.`

export const HERO_SLIDES = [
  {
    id: 'video',
    type: 'video' as const,
    eyebrow: 'Perfumaria & expressão',
    eyebrowColor: '#c6a46c',
    // encurtado (out/2026): sem o "Descubra", que o CTA do quiz já diz logo abaixo
    heading: 'Qual versão de você\nquer expressar hoje?',
    sub: `${maiuscula(porExtenso(ARCHETYPES.length))} fragrâncias. Diferentes formas de expressão.`,
    requisito: 'VÍDEO · 9:16 · 1080×1920 · HERO FULLSCREEN · AUTOPLAY MUTED',
    // decorativa: no celular é clima (pessoa entre véus), no desktop os frascos; o texto do slide carrega a mensagem
    alt: '',
    img: foto(heroVideoPoster).src,
    imgDesktop: foto(heroVideoDesktop).src,
    foto: foto(heroVideoPoster),
    fotoDesktop: foto(heroVideoDesktop),
    video: heroVideo,
    // tom do escurecimento atrás do texto — marrom quase preto, da luz âmbar da foto dos frascos
    tint: '#150e09',
    // o slide dura o vídeo inteiro (11,45 s) em vez dos 4 s padrão
    durationMs: 11450,
  },
  {
    id: 'afrodite',
    type: 'image' as const,
    eyebrow: getArchetype('afrodite')?.fam ?? '',
    eyebrowColor: '#e8a9b8',
    heading: 'Afrodite',
    sub: 'O floral que não pede licença.',
    cta: { label: 'Conhecer Afrodite', to: productPath(getArchetype('afrodite')!) },
    requisito: 'FOTO · 9:16 · 1080×1920 · LIFESTYLE · AFRODITE · MODELO + FRASCO',
    alt: `${produtoNome(getArchetype('afrodite')!)} segurado junto ao colo, entre rosas cor-de-rosa`,
    img: foto(heroAfrodite).src,
    imgDesktop: foto(heroAfroditeDesktop).src,
    foto: foto(heroAfrodite),
    fotoDesktop: foto(heroAfroditeDesktop),
    tint: '#2e141c', // vinho/rosado bem escuro
  },
  {
    // foto gerada por IA (Higgsfield) com o frasco real como referência — trocar pela de campanha
    id: 'guerreiro',
    type: 'image' as const,
    eyebrow: getArchetype('guerreiro')?.fam ?? '',
    eyebrowColor: '#a9bad3',
    heading: 'Guerreiro',
    sub: 'Constância é a forma mais rara de coragem.',
    cta: { label: 'Conhecer Guerreiro', to: productPath(getArchetype('guerreiro')!) },
    requisito: 'FOTO · 9:16 · 1080×1920 · LIFESTYLE · GUERREIRO · MODELO + FRASCO',
    alt: `Mão segurando o ${produtoNome(getArchetype('guerreiro')!)}`,
    img: foto(heroGuerreiro).src,
    imgDesktop: foto(heroGuerreiroDesktop).src,
    foto: foto(heroGuerreiro),
    fotoDesktop: foto(heroGuerreiroDesktop),
    tint: '#0e1829', // azul-marinho escuro
  },
]

/** CTA do quiz no 1º banner do hero. O quiz ainda não existe: o botão aparece desligado, com o aviso "em
 *  breve" — quando a rota existir, virar Link pra ela em HeroCinema (components/directions/Cinema.tsx).
 *  Rótulo reaproveita o CTA da ponte ("Descubra seus arquétipos"); "teste de 2 minutos" vem do texto da marca. */
export const QUIZ_CTA = { label: 'Descubra seus arquétipos', aviso: 'Teste de 2 minutos · em breve' }

export const SEALS = ['Entrega garantida', 'Rápido e seguro', 'Vegano', 'Cruelty free']

/** Faixa de benefícios da home (marquee no lugar do bloco de garantia, out/2026). Textos que já existem no site:
 *  selos da PDP (envio, garantia, pagamento) e as condições de preço (parcelas e Pix vêm de CONDICOES em data/empresa.ts).
 *  `icon`: path SVG de traço, viewBox 24. */
export const BENEFITS = [
  { label: `${CONDICOES.desistenciaDias} dias de garantia`, icon: 'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6zM9 12l2 2 4-4' },
  { label: `Envio em ${CONDICOES.envioHorasUteis} h úteis`, icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { label: 'Pagamento seguro', icon: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3' },
  { label: `${CONDICOES.parcelasSemJuros}x sem juros`, icon: 'M3 6h18v12H3zM3 10h18M7 15h4' },
  { label: `${CONDICOES.pixDescontoPct}% off no Pix`, icon: 'M3 12V4h8l10 10-8 8zM7.5 7.5h.01' },
]

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
  { label: 'Para elas', name: 'Feminino', meta: '5 fragrâncias', seg: 'F' as const, img: foto(segmentoFeminino).src, foto: foto(segmentoFeminino) },
  { label: 'Para eles', name: 'Masculino', meta: '3 fragrâncias', seg: 'M' as const, img: foto(segmentoMasculino).src, foto: foto(segmentoMasculino) },
  { label: 'Para todos', name: 'Compartilhável', meta: '1 fragrância', seg: 'U' as const, img: foto(segmentoUnissex).src, foto: foto(segmentoUnissex) },
]

// Fotos das famílias olfativas, geradas no Higgsfield (GPT Image 2.5, out/2026) no estilo editorial quente
// em linho/travertino (a "opção b", escolhida em out/2026). Arquivo = {slug}.jpg. Arquivos *-opcao-*.jpg na
// mesma pasta são alternativas em avaliação: ficam fora do build até alguém escolher.
const FAMILY_FOTOS = fotosPorId(import.meta.glob<FotoBruta>(['@/assets/fotos/familias/*.jpg', '!**/*-opcao-*.jpg'], {
  eager: true,
  import: 'default',
  query: '?responsiva',
}))
export const familyFoto = (slug: string) => FAMILY_FOTOS[slug]
export const familyImg = (slug: string) => FAMILY_FOTOS[slug]?.src

/**
 * As 5 famílias (data/families.ts) com os arquétipos de cada uma, montados a partir de
 * `familias` em data/archetypes.ts: primeiro os que a têm como principal, depois como secundária,
 * na ordem do catálogo.
 */
export const FAMILIES = FAMILIAS.map((f) => ({
  ...f,
  arquetipos: [0, 1].flatMap((i) => ARCHETYPES.filter((a) => a.familias[i] === f.slug).map((a) => a.id)),
  img: familyImg(f.slug),
  foto: familyFoto(f.slug),
}))

export const ENERGIES = [
  { nome: 'Sedução', arquetipos: ['afrodite', 'cleopatra'], img: energiaSeducao },
  { nome: 'Poder', arquetipos: ['imperatriz', 'imperador'], img: energiaPoder },
  { nome: 'Mistério', arquetipos: ['sereia', 'fada'], img: energiaMisterio },
  { nome: 'Força', arquetipos: ['guerreiro', 'fenix', 'zeus'], img: energiaForca },
]

/** Foto do frasco (pasta "bodys" da designer) — card do catálogo "Os 9 arquétipos". A foto com pessoa fica na galeria da PDP. */
// Lida por pasta (arquivo = id do arquétipo), em várias larguras (lib/foto.ts): foto nova entra sozinha.
export const FRASCO_FOTO = fotosPorId(import.meta.glob<FotoBruta>('@/assets/fotos/catalogo/*.jpg', { eager: true, import: 'default', query: '?responsiva' }))
export const FRASCO_IMG = urls(FRASCO_FOTO)

/**
 * Miniatura do frasco (52:76) — product tag da comunidade. Recorte da foto de produto
 * (pasta "bodys" da designer) centrado no frasco; não é recorte com fundo transparente.
 */
// Lida por pasta (arquivo = id do arquétipo). Pequena (≤ 80 px na tela): uma versão só, sem srcset.
export const FRASCO_CUT_IMG: Record<string, string> = Object.fromEntries(
  Object.entries(import.meta.glob<string>('@/assets/fotos/miniaturas/*.jpg', { eager: true, import: 'default' }))
    .map(([caminho, url]) => [caminho.split('/').pop()!.replace('.jpg', ''), url]),
)

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

/**
 * "A diferença" (out/2026, texto do usuário): cada linha pareia a Arquétypus com o body splash tradicional, na
 * mesma ordem nas duas colunas — título (`arquetypus`/`comum`) e descrição (`…Desc`). `tema` é só rótulo de
 * leitura (e key do React).
 */
export const COMPARISON = [
  { tema: 'Concentração', arquetypus: '10% de essência', arquetypusDesc: 'Mais intensidade e presença', comum: 'Menor concentração', comumDesc: 'Experiência mais leve' },
  { tema: 'Fragrância', arquetypus: 'Perfumaria premium', arquetypusDesc: 'Fragrâncias sofisticadas', comum: 'Proposta casual', comumDesc: 'Para o cotidiano' },
  { tema: 'Identidade', arquetypus: '9 arquétipos', arquetypusDesc: 'Uma identidade para despertar', comum: 'Escolha pelo aroma', comumDesc: 'Uma fragrância para usar' },
  { tema: 'Combinação', arquetypus: 'Criados para layering', arquetypusDesc: 'Crie sua assinatura olfativa', comum: 'Uso individual', comumDesc: 'Fragrâncias independentes' },
  { tema: 'Experiência', arquetypus: 'Experiência completa', arquetypusDesc: 'Do perfume à embalagem, cada detalhe importa.', comum: 'Apresentação tradicional', comumDesc: 'Fragrância para o dia a dia' },
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
 *
 * Os outros 5 (Fada, Fênix, Guerreiro, Imperador, Zeus — out/2026) são pessoas GERADAS POR IA, com @ inventados
 * e sem depoimento: só pra seção ter os 9 arquétipos. Trocar tudo antes do lançamento. Ordem intercalada pra
 * alternar gênero/perfil no carrossel.
 */
export const UGC_VIDEOS: { creator: string; archetypeId: string; testimonial?: string }[] = [
  { creator: '@marianac_', archetypeId: 'cleopatra', testimonial: TESTIMONIALS[0] },
  { creator: '@diego.treino', archetypeId: 'guerreiro' },
  { creator: '@rafa_dias', archetypeId: 'sereia', testimonial: TESTIMONIALS[1] },
  { creator: '@theo.kai', archetypeId: 'fenix' },
  { creator: '@brunavieira', archetypeId: 'afrodite', testimonial: 'Toda vez que uso Afrodite alguém pergunta o que eu estou usando.' },
  { creator: '@ricardo.m', archetypeId: 'imperador' },
  { creator: '@camila.beauty', archetypeId: 'imperatriz', testimonial: 'Imperatriz é o meu cheiro do inverno. Sério, vicia.' },
  { creator: '@raoni_', archetypeId: 'zeus' },
  { creator: '@aline.cachos', archetypeId: 'fada' },
]

export const JOURNAL = [
  { title: 'Body Splash Premium ou perfume: a diferença real', body: 'Concentração, fixação e quando cada um faz sentido.' },
  { title: 'Como fazer o cheiro durar o dia inteiro', body: 'Pele hidratada, pontos de pulso e reaplicação.' },
  { title: 'Layering: como combinar dois arquétipos', body: 'Qual entra primeiro e por quê.' },
]

export const KIT_TIERS = [
  { qtd: 1, label: 'Um arquétipo', meta: '200–220 ml', unit: 89.9, economia: null as number | null },
  { qtd: 2, label: 'Dupla', meta: 'Layering dia + noite', unit: 84.9, economia: 10 },
  { qtd: 3, label: 'Trio', meta: 'Um por energia', unit: 79.9, economia: 30 },
]

export const REWARD_MINI = 150
// kit desligado (set/2026): a escada do KitBuilder usa o valor planejado, não a oferta ativa do site
export const REWARD_FREIGHT = FRETE_GRATIS_PLANEJADO

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
    eyebrow: 'Famílias olfativas',
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
    dias: String(CONDICOES.desistenciaDias).padStart(2, '0'),
    label: 'Dias de garantia',
    title: ['Experimente na pele.', 'Descubra se essa fragrância combina com você.'] as const,
    body: ['Deixe a fragrância se revelar.', 'Se não for para você, devolvemos o valor.'] as const,
    nota: `${CONDICOES.desistenciaDias} dias para desistir da compra · Produto lacrado e sem uso`,
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
    valor: `${CONDICOES.cupomPrimeiraCompraPct}%`,
    title: 'na sua primeira Arquétypus.',
    body: 'Receba seu benefício e descubra primeiro as novidades da Arquétypus.',
    cta: 'Quero meu cupom',
  },
  rodape: {
    tagline: ['Você não escolhe um perfume.', 'Você reconhece o seu.'] as const,
    pagamentos: 'Pix · Visa · Master · Elo · Amex · Hipercard',
    sac: EMPRESA.email,
    redes: ['Instagram', 'TikTok'] as const,
    empresa: EMPRESA_LINHA,
  },
}

/**
 * Canais oficiais da Arquétypus (out/2026) — rodapé com ícone e link. `rotulo` é o que aparece; `aria` o nome
 * lido por leitor de tela. Ícones em FooterBoutique (boutique/BoutiqueMore.tsx), pela `rede`.
 */
export const CONTATOS = [
  { rede: 'instagram', rotulo: '@arquetypus', aria: 'Instagram da Arquétypus', href: 'https://www.instagram.com/arquetypus' },
  { rede: 'tiktok', rotulo: '@arquetypusparfum', aria: 'TikTok da Arquétypus', href: 'https://www.tiktok.com/@arquetypusparfum' },
  { rede: 'whatsapp', rotulo: '(12) 99206-7178', aria: 'WhatsApp da Arquétypus', href: 'https://wa.me/5512992067178' },
  { rede: 'email', rotulo: 'contato@arquetypus.com.br', aria: 'E-mail da Arquétypus', href: 'mailto:contato@arquetypus.com.br' },
] as const
