import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { TextLink } from '@/components/ui/Legal'
import { ARCHETYPES, productPath } from '@/data/archetypes'
import { CONDICOES } from '@/data/empresa'
import { FAMILIAS } from '@/data/families'
import { CONTATOS } from '@/data/home'
import { Sobrenome } from '@/components/ui/Sobrenome'
import { Ornament, SectionEyebrow } from '@/components/ui/Editorial'
import { IconeArquetipo } from '@/components/ui/IconeArquetipo'
import { IconeContato } from '@/components/boutique/BoutiqueMore'

const REDES = CONTATOS.filter((c) => c.rede === 'instagram' || c.rede === 'tiktok')

/** quantas vezes os nove se repetem em cada metade da faixa — o bastante pra cobrir telas largas sem buraco */
const REPETE = 2

/** Uma metade da faixa: ícone + nome na cor do arquétipo, cada um leva ao produto. A cópia (hidden) sai da leitura. */
function Icones({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4">
      {Array.from({ length: REPETE }).flatMap((_, r) =>
        ARCHETYPES.map((a) => (
          <li key={`${r}-${a.id}`} className={`flex shrink-0 items-center ${r > 0 ? 'motion-reduce:hidden' : ''}`}>
            <Link
              to={productPath(a)}
              tabIndex={hidden ? -1 : undefined}
              className="flex items-center gap-3 px-6 transition-opacity hover:opacity-75 lg:gap-4 lg:px-9"
              style={{ color: a.cor }}
            >
              <IconeArquetipo id={a.id} className="size-10 lg:size-12" />
              <b className="font-display text-[17px] leading-tight font-normal whitespace-nowrap lg:text-xl">
                {a.nome}
                <Sobrenome a={a} size="text-[0.66em]" />
              </b>
            </Link>
            {/* losango dourado entre os itens */}
            <span aria-hidden className="size-1 rotate-45 bg-latao/70" />
          </li>
        )),
      )}
    </ul>
  )
}

/** Bloco de texto: coluna de leitura centrada, título display, ornamento dourado separando do bloco anterior. */
function Bloco({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-2xl px-5 text-center">
      <Ornament className="mx-auto w-20" />
      <h2 className="mt-8 font-display text-[28px] leading-[1.15] text-tinta lg:text-[40px]">{title}</h2>
      <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-tinta-2 lg:mt-6 lg:text-[17px] lg:leading-[1.75]">{children}</div>
    </section>
  )
}

/**
 * Sobre Nós (out/2026). Texto montado a partir do que o site já diz — conceito do v6, os nove arquétipos, as cinco
 * famílias, 10% de essência, layering, garantia — sem história de fundação, que ainda não existe. Revisado com o
 * usuário em out/2026.
 *
 * Layout (out/2026, pedido do usuário: editorial, mas simples): um fundo só, coluna de leitura centrada, o manifesto
 * como título, blocos separados pelo ornamento dourado. Em "Nove arquétipos" uma faixa corrida com os ícones de
 * /criadores (IconeArquetipo) e os nomes, cada um levando ao produto — substituiu a faixa de fotos (pedido do
 * usuário, out/2026). Mesmos textos de antes.
 */
export function SobrePage() {
  return (
    <div className="-mb-24 bg-papel pt-14 pb-36 lg:pt-24 lg:pb-48">
      <header className="mx-auto max-w-5xl px-5 text-center">
        <SectionEyebrow center>Sobre a Arquétypus</SectionEyebrow>
        <h1 className="mt-6 font-display text-[33px] leading-[1.08] text-tinta min-[390px]:text-[36px] md:text-5xl lg:text-6xl">
          Você não escolhe um perfume.
          <br />
          <span className="text-latao-texto italic">Você reconhece o seu.</span>
        </h1>
      </header>

      <div className="mt-14 space-y-16 lg:mt-20 lg:space-y-24">
        <Bloco title="Perfumaria a partir de quem você é">
          <p>
            Escolher uma fragrância costuma ser um tiro no escuro: um nome, uma cor de frasco, uma nota que alguém
            recomendou. A Arquétypus parte de outro lugar — da sua identidade. Cada uma das nove fragrâncias traduz um
            arquétipo, uma forma diferente de estar no mundo, para que o cheiro que você usa diga algo sobre você.
          </p>
        </Bloco>

        {/* Os nove — título na coluna, faixa corrida de ícones na largura toda */}
        <section>
          <div className="mx-auto max-w-2xl px-5 text-center">
            <Ornament className="mx-auto w-20" />
            <h2 className="mt-8 font-display text-[28px] leading-[1.15] text-tinta lg:text-[40px]">Nove arquétipos, nove fragrâncias</h2>
          </div>
          {/* faixa corrida (marquee) com os ícones dos nove, na cor de cada um, entre filetes dourados; para no hover.
              Duas metades iguais deslizam -50% em loop (.beneficios-marquee, index.css); com movimento reduzido fica
              parada e quebra em linhas */}
          <div className="group mt-8 overflow-hidden border-y border-latao/30 py-5 lg:mt-12 lg:py-7">
            <div
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              }}
            >
              <div className="beneficios-marquee flex w-max motion-reduce:w-auto motion-reduce:justify-center">
                <Icones />
                <div className="flex motion-reduce:hidden">
                  <Icones hidden />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Bloco title="Body Splash Premium">
          <p>
            Nossas fragrâncias têm <strong className="font-semibold text-tinta">{CONDICOES.essenciaPct}% de essência</strong> — mais
            intensidade e presença do que um body splash tradicional, que costuma ter cerca de 4%. Elas se organizam em
            cinco famílias olfativas: {FAMILIAS.map((f) => f.nome).join(', ').replace(/, ([^,]*)$/, ' e $1')}.
          </p>
          <p>
            E foram criadas para combinar entre si: com o <em>layering</em>, você usa dois arquétipos juntos e cria a sua
            própria assinatura olfativa.
          </p>
        </Bloco>

        <Bloco title="Cada detalhe importa">
          <p>
            Do perfume à embalagem, tudo é pensado para quem compra para si e para quem presenteia. Nossos produtos são
            fabricados em indústria com as licenças exigidas e regularizados na Anvisa. E você compra com segurança:{' '}
            {CONDICOES.desistenciaDias} dias de garantia, envio em até {CONDICOES.envioHorasUteis} horas úteis e atendimento
            direto com a gente — veja as <TextLink to="/trocas-e-devolucoes">trocas e devoluções</TextLink>.
          </p>
        </Bloco>

        <Bloco title="Acompanhe a gente">
          {/* ícone da rede em aro latão (o mesmo do rodapé) em cima do usuário */}
          <ul className="flex justify-center gap-10 pt-2 lg:gap-14">
            {REDES.map((r) => (
              <li key={r.rede}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={r.aria}
                  className="group flex flex-col items-center gap-3 text-tinta"
                >
                  <span className="grid size-11 place-items-center rounded-full ring-1 ring-latao/50 transition-colors group-hover:bg-latao/10 group-hover:ring-latao">
                    <IconeContato rede={r.rede} cor="var(--color-latao-texto)" className="size-5" />
                  </span>
                  <span className="border-b border-latao-texto/40 transition-colors group-hover:border-latao-texto">{r.rotulo}</span>
                </a>
              </li>
            ))}
          </ul>
        </Bloco>
      </div>
    </div>
  )
}
