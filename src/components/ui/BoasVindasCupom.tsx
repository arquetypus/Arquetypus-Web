import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Cupom } from '@/data/cupons'

/** textos de cada entrada do pop-up — copy escrita por mim a partir dos pedidos, neutra de gênero; revisar com o usuário */
const TEXTOS: Record<'link' | 'cadastro' | 'cadastroJaTinha', { eyebrow: string; titulo: ReactNode; texto: string; cta: string }> = {
  // chegada pelo link com ?cupom= (pedido: "Parabéns, você foi selecionado…", gatilho de exclusividade)
  link: {
    eyebrow: 'Convite exclusivo',
    titulo: (
      <>
        Parabéns.
        <br />
        <span className="text-latao-texto italic">Este acesso é seu.</span>
      </>
    ),
    texto: 'Você está entre as primeiras pessoas a conhecer a Arquétypus e recebeu um desconto especial de lançamento em todas as fragrâncias.',
    cta: 'Descobrir minha fragrância',
  },
  // depois do cadastro na caixa de cupom da home (FormCupom)
  cadastro: {
    eyebrow: 'Cadastro confirmado',
    titulo: (
      <>
        Boas-vindas à Arquétypus.
        <br />
        <span className="text-latao-texto italic">Seu cupom está ativo.</span>
      </>
    ),
    texto: 'Todos os preços do site já estão com o seu desconto de primeira compra. É só escolher a sua fragrância.',
    cta: 'Ver fragrâncias com desconto',
  },
  // cadastro feito por quem já tinha outro cupom ativo (ex.: CONHECA15 dos clientes Saniella): cupons não se somam
  cadastroJaTinha: {
    eyebrow: 'Cadastro confirmado',
    titulo: (
      <>
        Obrigado por se cadastrar.
        <br />
        <span className="text-latao-texto italic">Seu cupom continua ativo.</span>
      </>
    ),
    texto: 'Você já tem um cupom aplicado em todos os preços do site. Os cupons não se somam, então o seu segue valendo.',
    cta: 'Ver fragrâncias com desconto',
  },
}

/**
 * Pop-up do cupom (out/2026). Duas entradas com o mesmo desenho de convite impresso: `link` — chegada com `?cupom=`
 * válido, uma vez por aba (CupomContext); `cadastro` — depois de cadastrar na caixa de cupom da home, com o convite
 * (`cadastroJaTinha` quando a pessoa já estava com outro cupom, que continua — cupons não se somam)
 * opcional pro grupo VIP no WhatsApp embaixo (`grupoVipUrl`, abre em nova aba pra pessoa continuar no site).
 * Portal no <body> com z-50, acima do banner de cookies e do pop-up de compra. Fecha pelo botão, ✕, fundo ou Esc;
 * `aoContinuar` roda no botão principal (ex.: rolar até o catálogo).
 */
export function BoasVindasCupom({
  cupom,
  fechar,
  variante = 'link',
  grupoVipUrl,
  aoContinuar,
}: {
  cupom: Cupom
  fechar: () => void
  variante?: 'link' | 'cadastro' | 'cadastroJaTinha'
  grupoVipUrl?: string
  aoContinuar?: () => void
}) {
  const ctaRef = useRef<HTMLButtonElement>(null)
  const t = TEXTOS[variante]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar()
    document.addEventListener('keydown', onKey)
    ctaRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [fechar])

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="boas-vindas-cupom-titulo">
      <button type="button" aria-label="Fechar" onClick={fechar} className="sheet-backdrop absolute inset-0 cursor-default bg-noite/60" />
      <div className="sheet-in relative max-h-[94svh] w-full max-w-md overflow-y-auto rounded-2xl bg-papel px-6 pt-10 pb-7 text-center shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-latao/40 sm:px-10">
        {/* moldura interna fina, como um convite impresso */}
        <span aria-hidden className="pointer-events-none absolute inset-2 rounded-xl ring-1 ring-latao/25" />
        <button
          type="button"
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-lg text-tinta-3 transition-colors hover:bg-papel-2 hover:text-tinta"
        >
          ✕
        </button>

        <div className="flex items-center justify-center gap-3">
          <span aria-hidden className="h-px w-6 bg-latao/60" />
          <p className="font-label text-[10px] tracking-[0.24em] text-latao-texto uppercase">{t.eyebrow}</p>
          <span aria-hidden className="h-px w-6 bg-latao/60" />
        </div>
        <h2 id="boas-vindas-cupom-titulo" className="mt-5 font-display text-[28px] leading-[1.12] text-tinta sm:text-[32px]">
          {t.titulo}
        </h2>
        <p className="mx-auto mt-4 max-w-[34ch] text-sm leading-relaxed text-tinta-2">{t.texto}</p>

        {/* o benefício: % grande + o código num bilhete tracejado */}
        <p className="mt-6 font-display text-[64px] leading-none font-light tracking-tight text-ok">
          {cupom.pct}% <span className="text-[0.4em] tracking-normal">off</span>
        </p>
        <div className="mx-auto mt-4 inline-flex items-center gap-3 rounded-sm border border-dashed border-latao/70 bg-latao/[0.07] px-4 py-2.5">
          <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-latao-texto">
            <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z" />
            <circle cx="8" cy="8" r="1.3" />
          </svg>
          <span className="font-label text-[13px] font-medium tracking-[0.2em] text-latao-texto uppercase">{cupom.codigo}</span>
          <span aria-hidden className="h-4 w-px bg-latao/50" />
          <span className="font-label text-[10px] tracking-[0.14em] text-ok uppercase">Aplicado</span>
        </div>
        <p className="mt-3 text-[12px] text-tinta-3">O desconto já aparece nos preços do site.</p>

        <button
          ref={ctaRef}
          type="button"
          onClick={() => {
            fechar()
            aoContinuar?.()
          }}
          className="group relative isolate mt-7 w-full overflow-hidden rounded-lg bg-latao py-4 text-[13px] font-semibold tracking-[0.14em] text-papel uppercase shadow-[0_12px_28px_-14px_color-mix(in_srgb,var(--color-latao)_90%,black)] transition-[box-shadow,transform] duration-300 hover:-translate-y-px hover:shadow-[0_18px_36px_-12px_color-mix(in_srgb,var(--color-latao)_100%,transparent)]"
        >
          <span aria-hidden className="cta-compra-sheen pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2" />
          {t.cta}
        </button>

        {/* grupo VIP: convite opcional, abaixo do botão principal e mais discreto que ele */}
        {grupoVipUrl && (
          <div className="mt-6 border-t border-latao/25 pt-5">
            <p className="text-[13px] leading-relaxed text-tinta-2">Quer receber novidades e condições antes de todo mundo?</p>
            <a
              href={grupoVipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2.5 rounded-lg py-3.5 text-[12px] font-semibold tracking-[0.14em] text-latao-texto uppercase ring-1 ring-latao/60 transition-colors hover:bg-latao/10 hover:ring-latao"
            >
              <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-[18px]">
                <path d="M4.2 20l1.2-4.1A8.3 8.3 0 1 1 8.6 19z" />
                <path d="M9.3 8.6c.2-.5.6-.5.9-.5.3 0 .5.4.8 1.2.2.5-.4.9-.5 1.1.4 1 1.3 1.9 2.4 2.4.2-.2.6-.8 1.1-.6.8.4 1.2.6 1.2.9 0 .4-.1.8-.5 1.1-.5.4-1.4.5-2.6 0a7.6 7.6 0 0 1-3.6-3.6c-.4-1-.4-1.8-.2-2z" />
              </svg>
              Entrar no grupo VIP
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
