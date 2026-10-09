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
 * válido, uma vez por aba (CupomContext), também com o convite do grupo VIP (sem cadastro: `grupoVipSemCadastroUrl`);
 * `cadastro` — depois de cadastrar na caixa de cupom da home, com o convite
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

        {/* grupo VIP: convite opcional embaixo do botão principal, em verde WhatsApp pra chamar atenção (pedido do
            usuário, out/2026) — #1DA851, um tom abaixo do #25D366 da marca, pro texto branco ter leitura */}
        {grupoVipUrl && (
          <div className="mt-6 border-t border-latao/25 pt-5">
            <p className="text-[13px] leading-relaxed text-tinta-2">
              Quer receber <b className="font-semibold text-tinta">novidades e condições exclusivas</b> antes de todo mundo?
            </p>
            <a
              href={grupoVipUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative isolate mt-3.5 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#1DA851] py-4 text-[13px] font-semibold tracking-[0.1em] text-white uppercase shadow-[0_12px_26px_-12px_rgba(29,168,81,0.75)] transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-px hover:bg-[#188f45] hover:shadow-[0_18px_34px_-12px_rgba(29,168,81,0.85)] active:translate-y-0"
            >
              {/* brilho que passa, como no botão de compra */}
              <span aria-hidden className="cta-compra-sheen pointer-events-none absolute inset-y-0 -left-1/2 -z-10 w-1/2" />
              {/* logo do WhatsApp (Simple Icons, CC0) */}
              <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-5 shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
              Entrar no grupo VIP
            </a>
            <p className="mt-2 text-[11px] text-tinta-3">Grátis · você sai quando quiser</p>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
