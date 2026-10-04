import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CONTATOS } from '@/data/home'
import { EMPRESA_LINHA, POLITICAS_ATUALIZADAS } from '@/data/empresa'
import { comMarca, useSeo } from '@/lib/seo'

const LINK = 'border-b border-latao-texto/40 text-tinta hover:border-latao-texto'

/**
 * Casca das páginas institucionais (out/2026): coluna central de leitura, eyebrow, título, data de atualização
 * (opcional) e título da aba. Usada por Entrega e Frete, Trocas, Termos, Regras, Sobre e Perguntas frequentes.
 */
export function LegalPage({
  eyebrow = 'Documento legal',
  title,
  seoTitle,
  description,
  atualizacao = true,
  children,
}: {
  eyebrow?: string
  title: string
  /** título da aba e do Google, se diferente do H1 (mais curto, palavra-chave primeiro) */
  seoTitle?: string
  /** descrição para o Google (até ~155 caracteres) */
  description: string
  atualizacao?: boolean
  children: ReactNode
}) {
  useSeo({ title: comMarca(seoTitle ?? title), description, path: useLocation().pathname })
  return (
    <article className="mx-auto max-w-3xl px-5 pt-10 pb-16 lg:pt-16 lg:pb-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-2.5 font-display text-[32px] leading-tight text-tinta lg:text-[40px]">{title}</h1>
      {atualizacao && (
        <p className="mt-3 text-[13px] text-tinta-3">
          Última atualização: {POLITICAS_ATUALIZADAS}
        </p>
      )}
      <span aria-hidden className="mt-5 block h-px w-8 bg-latao/60" />
      <div className="mt-8">{children}</div>
    </article>
  )
}

/** Link interno no corpo do texto */
export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className={LINK}>
      {children}
    </Link>
  )
}

/** "WhatsApp (12) … ou e-mail contato@…" com os dois links — dados de CONTATOS (data/home.ts) */
export function Contato() {
  const w = CONTATOS.find((c) => c.rede === 'whatsapp')!
  const e = CONTATOS.find((c) => c.rede === 'email')!
  return (
    <>
      WhatsApp{' '}
      <a href={w.href} target="_blank" rel="noopener noreferrer" className={LINK}>
        {w.rotulo}
      </a>{' '}
      ou e-mail{' '}
      <a href={e.href} className={LINK}>
        {e.rotulo}
      </a>
    </>
  )
}

/** Razão social, CNPJ e endereço — rodapé das páginas institucionais (data/empresa.ts) */
export const EMPRESA = EMPRESA_LINHA

/** Blocos das páginas legais (Privacidade, Entrega e Frete…): seção numerada, quadro e lacuna a preencher. */
export function Section({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return (
    <section id={id} className="border-t border-linha py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl leading-snug text-tinta">{title}</h2>
      <div className="mt-3 space-y-3.5 text-[14px] leading-relaxed text-tinta-2">{children}</div>
    </section>
  )
}

export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-linha bg-papel-2 p-5">
      <h3 className="text-[14px] font-medium text-tinta">{title}</h3>
      <div className="mt-1.5 space-y-2 text-[13px] leading-relaxed text-tinta-2">{children}</div>
    </div>
  )
}

/** Lacuna do texto que depende de decisão/fornecedor ainda não definido — nenhuma pode ir ao ar. */
export function Todo({ children }: { children: ReactNode }) {
  return <strong className="border-b border-dashed border-latao-texto text-latao-texto">PREENCHER — {children}</strong>
}
