import type { Familia, FamiliaSlug } from '@/types/archetype'

/**
 * As 5 famílias olfativas (out/2026), na ordem dos filtros. Nomes e descrições vêm do briefing do usuário;
 * attrs foram escritos a partir dos produtos de cada família. Cada body splash tem duas (principal e
 * secundária, em data/archetypes.ts) e aparece no filtro das duas.
 */
export const FAMILIAS: Familia[] = [
  {
    slug: 'florais-elegantes',
    nome: 'Florais & Elegantes',
    desc: 'Bouquets de rosa, jasmim e flor de laranjeira. Sofisticados, femininos e marcantes.',
    attrs: ['Sedutor', 'Majestoso', 'Delicado'],
  },
  {
    slug: 'frutados-citricos',
    nome: 'Frutados & Cítricos',
    desc: 'Frutas suculentas e cítricos na saída. Alegres e vibrantes.',
    attrs: ['Suculento', 'Vibrante', 'Solar'],
  },
  {
    slug: 'frescos-luminosos',
    nome: 'Frescos & Luminosos',
    desc: 'Leves, radiantes e cheios de frescor. Como luz do sol na pele.',
    attrs: ['Leve', 'Limpo', 'Radiante'],
  },
  {
    slug: 'ambarados-adocicados',
    nome: 'Ambarados & Adocicados',
    desc: 'Quentes, doces e envolventes: baunilha, âmbar, açúcar.',
    attrs: ['Quente', 'Envolvente', 'Marcante'],
  },
  {
    slug: 'amadeirados-especiados',
    nome: 'Amadeirados & Especiados',
    desc: 'Madeiras e especiarias. Intensos, marcantes, com presença.',
    attrs: ['Intenso', 'Seco', 'Imponente'],
  },
]

export const FAMILIAS_BY_SLUG = Object.fromEntries(FAMILIAS.map((f) => [f.slug, f])) as Record<FamiliaSlug, Familia>
