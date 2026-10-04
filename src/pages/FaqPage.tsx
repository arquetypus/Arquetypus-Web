import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Contato, LegalPage } from '@/components/ui/Legal'
import { FAQ_LOJA, FAQ_PRODUTO } from '@/data/faq'
import type { Pergunta } from '@/data/faq'
import { CONTATOS } from '@/data/home'

const LINK = 'border-b border-latao-texto/40 text-tinta hover:border-latao-texto'
const contato = (rede: string) => CONTATOS.find((c) => c.rede === rede)!

/** {{token}} das respostas em data/faq.ts → link (na página) ou texto puro (no schema.org) */
const TOKENS: Record<string, { texto: string; no: ReactNode }> = {
  entrega: { texto: 'Política de Entrega e Frete', no: <Link to="/entrega-e-frete" className={LINK}>Política de Entrega e Frete</Link> },
  trocas: { texto: 'Política de Trocas e Devoluções', no: <Link to="/trocas-e-devolucoes" className={LINK}>Política de Trocas e Devoluções</Link> },
  regras: { texto: 'Regras do Site', no: <Link to="/regras-do-site" className={LINK}>Regras do Site</Link> },
  criadores: { texto: 'arquetypus.com.br/criadores', no: <Link to="/criadores" className={LINK}>Seja criador</Link> },
  instagram: {
    texto: contato('instagram').rotulo,
    no: <a href={contato('instagram').href} target="_blank" rel="noopener noreferrer" className={LINK}>{contato('instagram').rotulo}</a>,
  },
  whatsapp: {
    texto: contato('whatsapp').rotulo,
    no: <a href={contato('whatsapp').href} target="_blank" rel="noopener noreferrer" className={LINK}>{contato('whatsapp').rotulo}</a>,
  },
  email: { texto: contato('email').rotulo, no: <a href={contato('email').href} className={LINK}>{contato('email').rotulo}</a> },
}

function resposta(a: string): ReactNode[] {
  return a.split(/(\{\{\w+\}\})/).map((parte, i) => {
    const m = parte.match(/^\{\{(\w+)\}\}$/)
    return m && TOKENS[m[1]] ? <span key={i}>{TOKENS[m[1]].no}</span> : parte
  })
}
const respostaTexto = (a: string) => a.replace(/\{\{(\w+)\}\}/g, (_, k) => TOKENS[k]?.texto ?? '')

function Grupo({ titulo, perguntas }: { titulo: string; perguntas: Pergunta[] }) {
  return (
    <section className="border-t border-linha pt-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl leading-snug text-tinta">{titulo}</h2>
      <div className="mt-2">
        {perguntas.map((p) => (
          <details key={p.q} className="group border-b border-linha-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 [&::-webkit-details-marker]:hidden">
              <span className="text-[15px] font-medium text-tinta">{p.q}</span>
              <span
                aria-hidden
                className="relative size-3.5 shrink-0 text-latao-texto before:absolute before:inset-x-0 before:top-1/2 before:h-px before:-translate-y-1/2 before:bg-current after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0"
              />
            </summary>
            <p className="pb-5 text-[14px] leading-relaxed text-tinta-2">
              {resposta(p.a)}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}

/**
 * Perguntas frequentes (revisadas out/2026): loja (FAQ_LOJA) + produto (FAQ_PRODUTO, o mesmo da PDP).
 * Publica o schema.org/FAQPage em JSON-LD enquanto a página está aberta.
 */
export function FaqPage() {
  useEffect(() => {
    const s = document.createElement('script')
    s.type = 'application/ld+json'
    s.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [...FAQ_LOJA, ...FAQ_PRODUTO].map((p) => ({
        '@type': 'Question',
        name: p.q,
        acceptedAnswer: { '@type': 'Answer', text: respostaTexto(p.a) },
      })),
    })
    document.head.appendChild(s)
    return () => s.remove()
  }, [])

  return (
    <LegalPage
      eyebrow="Ajuda"
      title="Perguntas frequentes"
      seoTitle="Perguntas Frequentes"
      description="Tire suas dúvidas sobre os Body Splash Premium Arquétypus: entrega, pagamento, cupom, trocas, concentração de 10% de essência e como usar."
      atualizacao={false}
    >
      <div className="space-y-10">
        <Grupo titulo="Compras, entrega e trocas" perguntas={FAQ_LOJA} />
        <Grupo titulo="Sobre os produtos" perguntas={FAQ_PRODUTO} />
        <p className="text-[14px] text-tinta-2">
          Não achou o que procurava? Fale com a gente pelo <Contato />.
        </p>
      </div>
    </LegalPage>
  )
}
