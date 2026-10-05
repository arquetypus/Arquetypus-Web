import { Link } from 'react-router-dom'
import { EMPRESA as EMPRESA_LINHA, LegalPage, Section, TextLink } from '@/components/ui/Legal'
import { ARCHETYPES } from '@/data/archetypes'
import { EMPRESA } from '@/data/empresa'
import { FAMILIAS } from '@/data/families'
import { CONTATOS } from '@/data/home'
import { Sobrenome } from '@/components/ui/Sobrenome'

const REDES = CONTATOS.filter((c) => c.rede === 'instagram' || c.rede === 'tiktok')

/**
 * Sobre Nós (out/2026). Texto montado a partir do que o site já diz — conceito do v6, os nove arquétipos, as cinco
 * famílias, 10% de essência, layering, garantia — sem história de fundação, que ainda não existe. Revisado com o
 * usuário em out/2026.
 */
export function SobrePage() {
  return (
    <LegalPage
      eyebrow="A marca"
      title="Sobre a Arquétypus"
      atualizacao={false}
    >
      <p className="font-display text-2xl leading-snug text-tinta italic lg:text-[28px]">
        Você não escolhe um perfume. Você reconhece o seu.
      </p>

      <div className="mt-8">
        <Section title="Perfumaria a partir de quem você é">
          <p>
            Escolher uma fragrância costuma ser um tiro no escuro: um nome, uma cor de frasco, uma nota que alguém
            recomendou. A Arquétypus parte de outro lugar — da sua identidade. Cada uma das nove fragrâncias traduz um
            arquétipo, uma forma diferente de estar no mundo, para que o cheiro que você usa diga algo sobre você.
          </p>
        </Section>

        <Section title="Nove arquétipos, nove fragrâncias">
          <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {ARCHETYPES.map((a) => (
              <li key={a.id}>
                <Link to={`/loja/${a.id}`} className="group block">
                  <b className="font-display text-lg font-normal text-tinta group-hover:text-latao-texto">
                    {a.nome}
                    <Sobrenome a={a} size="text-[0.72em]" />
                  </b>
                  <span className="mt-0.5 block text-[13px] text-tinta-3 italic">{a.ep}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Body Splash Premium">
          <p>
            Nossas fragrâncias têm <strong>10% de essência</strong> — mais intensidade e presença do que um body splash
            tradicional, que costuma ter cerca de 4%. Elas se organizam em cinco famílias olfativas:{' '}
            {FAMILIAS.map((f) => f.nome).join(', ').replace(/, ([^,]*)$/, ' e $1')}.
          </p>
          <p>
            E foram criadas para combinar entre si: com o <em>layering</em>, você usa dois arquétipos juntos e cria a sua
            própria assinatura olfativa.
          </p>
        </Section>

        <Section title="Cada detalhe importa">
          <p>
            Do perfume à embalagem, tudo é pensado para quem compra para si e para quem presenteia. Nossos produtos são
            fabricados em indústria com as licenças exigidas e regularizados na Anvisa. E você compra com segurança: 7 dias
            de garantia, envio em até 24 horas úteis e atendimento direto com a gente — veja as{' '}
            <TextLink to="/trocas-e-devolucoes">trocas e devoluções</TextLink>.
          </p>
        </Section>

        <Section title="Acompanhe a gente">
          <p>
            {REDES.map((r, i) => (
              <span key={r.rede}>
                {i > 0 && ' e '}
                {r.rede === 'instagram' ? 'Instagram' : 'TikTok'}{' '}
                <a href={r.href} target="_blank" rel="noopener noreferrer" className="border-b border-latao-texto/40 text-tinta">
                  {r.rotulo}
                </a>
              </span>
            ))}
            .
          </p>
          <p className="text-[13px] text-tinta-3">
            A {EMPRESA.marca} é uma marca da {EMPRESA_LINHA}.
          </p>
        </Section>
      </div>
    </LegalPage>
  )
}
