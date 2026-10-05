import { CONTATOS } from '@/data/home'

const contato = (rede: string) => CONTATOS.find((c) => c.rede === rede)!

/** Texto dos links da FAQ, compartilhado entre conteúdo visível e JSON-LD. */
export const FAQ_TOKEN_TEXT: Record<string, string> = {
  entrega: 'Política de Entrega e Frete',
  trocas: 'Política de Trocas e Devoluções',
  regras: 'Regras do Site',
  criadores: 'arquetypus.com.br/criadores',
  instagram: contato('instagram').rotulo,
  whatsapp: contato('whatsapp').rotulo,
  email: contato('email').rotulo,
}

export const respostaTexto = (a: string) => a.replace(/\{\{(\w+)\}\}/g, (_, k: string) => FAQ_TOKEN_TEXT[k] ?? '')
