import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SweepCta } from '@/components/ui/SweepCta'
import { BoasVindasCupom } from '@/components/ui/BoasVindasCupom'
import { useCupom } from '@/context/CupomContext'
import { scrollToId } from '@/lib/scrollToId'
import type { Cupom } from '@/data/cupons'
import { CUPOM_CADASTRO, grupoVipUrl, LEAD_SOURCE, VIP_API } from '@/data/lead'

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
const digitos = (v: string) => v.replace(/\D/g, '')
/** (12) 99206-7178 enquanto digita */
const mascaraTelefone = (raw: string) => {
  const d = digitos(raw).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

/** UTMs da URL de chegada (as mesmas que a página VIP manda no tracking) */
function utms() {
  const p = new URLSearchParams(window.location.search)
  const out: Record<string, string> = {}
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = p.get(k)
    if (v) out[k] = v.slice(0, 100)
  }
  return out
}

const CAMPO =
  'mt-1.5 block w-full border-b bg-transparent pb-2.5 text-[15px] text-tinta placeholder:text-tinta-3/70 focus:border-latao focus:outline-none'

/**
 * Caixa de cupom da home (out/2026): nome, e-mail e WhatsApp. No envio, o lead vai pra API do projeto VIP
 * (data/lead.ts) sem esperar resposta — o pop-up do cupom abre na hora, o BEMVINDO10 liga em todos os preços do site
 * (CupomContext.ativarCupom) e o grupo VIP fica como convite opcional no pop-up. Payload no contrato do /api/lead
 * (leadSchema do VIP): consentimento só de WhatsApp, como a variante sem caixas de aceite de lá — a base legal é o
 * aviso de privacidade abaixo do botão (decisão do usuário, out/2026: só acrescentar o nome, sem caixas de aceite).
 * Falha de rede só vai pro console: o cupom já foi entregue e a pessoa não fica presa num erro.
 */
export function FormCupom({ hydrated }: { hydrated: boolean }) {
  const { ativarCupom } = useCupom()
  const [v, setV] = useState({ nome: '', email: '', telefone: '' })
  const [erros, setErros] = useState<Record<string, string>>({})
  // honeypot: humano não vê nem preenche (o VIP descarta o lead se vier preenchido)
  const [website, setWebsite] = useState('')
  // jaTinha: a pessoa já estava com outro cupom ativo (ex.: CONHECA15) — o BEMVINDO10 não entra, cupons não se somam
  const [pronto, setPronto] = useState<{ cupom: Cupom; eventId: string; jaTinha: boolean } | null>(null)
  const [popup, setPopup] = useState(false)

  function enviar(e: FormEvent) {
    e.preventDefault()
    const novo: Record<string, string> = {}
    if (v.nome.trim().length < 2) novo.nome = 'Escreva seu nome.'
    if (!isEmail(v.email)) novo.email = 'Confira o e-mail — parece incompleto.'
    const tel = digitos(v.telefone)
    if (tel.length < 10 || tel.length > 11) novo.telefone = 'Coloque DDD + número.'
    setErros(novo)
    if (Object.keys(novo).length) return

    const eventId = crypto.randomUUID()
    const payload = {
      name: v.nome.trim(),
      email: v.email.trim().toLowerCase(),
      phone: v.telefone.trim(),
      consents: [{ type: 'WHATSAPP', accepted: true }],
      event_id: eventId,
      tracking: {
        source: LEAD_SOURCE,
        ...utms(),
        front_variant: 'short',
        referrer: document.referrer || undefined,
        landing_page: window.location.pathname,
        event_id: eventId,
      },
      website,
    }
    fetch(`${VIP_API}/api/lead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then((r) => {
        if (!r.ok) console.error('lead_submit_failed', r.status)
      })
      .catch((err) => console.error('lead_submit_failed', String(err)))

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'lead_submitted', event_id: eventId, brand: 'arquetypus', lead_source: LEAD_SOURCE })

    const ativado = ativarCupom(CUPOM_CADASTRO)
    if (ativado.cupom) {
      setPronto({ cupom: ativado.cupom, eventId, jaTinha: !ativado.novo })
      setPopup(true)
    }
  }

  const campo = (k: 'nome' | 'email' | 'telefone') => `${CAMPO} ${erros[k] ? 'border-alerta' : 'border-linha-2'}`
  const Erro = ({ k }: { k: string }) =>
    erros[k] ? (
      <span role="alert" className="mt-1.5 block text-[11px] text-alerta">
        {erros[k]}
      </span>
    ) : null

  return (
    <>
      <form noValidate className="mt-8 flex flex-col gap-4 text-left lg:mt-0 lg:gap-6 lg:pl-16" onSubmit={enviar}>
        <label className="block">
          <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">Nome</span>
          <input
            type="text"
            name="nome"
            disabled={!hydrated || !!pronto}
            autoComplete="given-name"
            placeholder="Como podemos te chamar"
            value={v.nome}
            onChange={(e) => setV((s) => ({ ...s, nome: e.target.value }))}
            aria-invalid={!!erros.nome}
            className={campo('nome')}
          />
          <Erro k="nome" />
        </label>
        <label className="block">
          <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">E-mail</span>
          <input
            type="email"
            name="email"
            disabled={!hydrated || !!pronto}
            autoComplete="email"
            inputMode="email"
            placeholder="seu@email.com"
            value={v.email}
            onChange={(e) => setV((s) => ({ ...s, email: e.target.value }))}
            aria-invalid={!!erros.email}
            className={campo('email')}
          />
          <Erro k="email" />
        </label>
        <label className="block">
          <span className="font-label text-[9px] tracking-[0.2em] text-tinta-3 uppercase">WhatsApp</span>
          <input
            type="tel"
            name="whatsapp"
            disabled={!hydrated || !!pronto}
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="DDD + número"
            value={v.telefone}
            onChange={(e) => setV((s) => ({ ...s, telefone: mascaraTelefone(e.target.value) }))}
            aria-invalid={!!erros.telefone}
            className={campo('telefone')}
          />
          <Erro k="telefone" />
        </label>
        {/* honeypot fora da tela */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute -left-[9999px] h-px w-px opacity-0"
        />
        <div className="mt-2 text-center">
          {pronto ? (
            // já cadastrado: o botão reabre o pop-up do cupom (com o convite do grupo VIP)
            <SweepCta type="button" onClick={() => setPopup(true)}>
              Cupom {pronto.cupom.codigo} ativo
            </SweepCta>
          ) : (
            <SweepCta type="submit" disabled={!hydrated}>
              Quero meu cupom
            </SweepCta>
          )}
        </div>
        {/* LGPD: o cadastro é a base do consentimento pra novidades (ver /privacidade, seção 3) */}
        <p className="text-center text-[11px] leading-relaxed text-tinta-3">
          Ao se cadastrar, você aceita receber o cupom e as novidades da Arquétypus. Cancele quando quiser.{' '}
          <Link to="/privacidade" className="border-b border-tinta-3/50 hover:text-tinta">
            Política de Privacidade
          </Link>
        </p>
      </form>
      {popup && pronto && (
        <BoasVindasCupom
          cupom={pronto.cupom}
          variante={pronto.jaTinha ? 'cadastroJaTinha' : 'cadastro'}
          grupoVipUrl={grupoVipUrl(pronto.eventId)}
          fechar={() => setPopup(false)}
          aoContinuar={() => scrollToId('catalogo')}
        />
      )}
    </>
  )
}
