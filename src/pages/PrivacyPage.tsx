import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { openCookiePreferences } from '@/lib/consent'

const CONTACT_EMAIL = 'contato@saniella.com.br'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-linha py-8 first:border-t-0 first:pt-0">
      <h2 className="font-display text-xl leading-snug text-tinta">{title}</h2>
      <div className="mt-3 space-y-3.5 text-[14px] leading-relaxed text-tinta-2">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border border-linha bg-papel-2 p-5">
      <h3 className="text-[14px] font-medium text-tinta">{title}</h3>
      <div className="mt-1.5 space-y-2 text-[13px] leading-relaxed text-tinta-2">{children}</div>
    </div>
  )
}

/** Lacuna do texto que depende de decisão/fornecedor ainda não definido — nenhuma pode ir ao ar. */
function Todo({ children }: { children: ReactNode }) {
  return <strong className="border-b border-dashed border-latao-texto text-latao-texto">PREENCHER — {children}</strong>
}

/**
 * Política de privacidade da loja. Descreve o que o site faz HOJE (GTM/GA4 sob
 * consentimento, sacola só em memória, quiz processado no navegador, formulário de
 * criadores sem envio) e deixa como <Todo> o que depende do checkout, da hospedagem e
 * dos fornecedores ainda não escolhidos. Atualizar junto com qualquer tag nova no GTM,
 * com o backend do formulário de criadores e com o checkout.
 * ⚠️ Revisão jurídica antes de publicar.
 */
export function PrivacyPage() {
  useEffect(() => {
    const prev = document.title
    document.title = 'Política de Privacidade | Arquétypus Parfum'
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <article className="px-5 pt-10 pb-16">
      <Eyebrow>Documento legal</Eyebrow>
      <h1 className="mt-2.5 font-display text-[32px] leading-tight text-tinta">Política de Privacidade</h1>
      <p className="mt-3 text-[13px] text-tinta-3">
        Última atualização: <Todo>data de publicação</Todo>
      </p>
      <span aria-hidden className="mt-5 block h-px w-8 bg-latao/60" />

      <div className="mt-8">
        <Section title="1. Quem trata os seus dados">
          <p>
            Os dados pessoais tratados na loja Arquétypus Parfum (arquetypus.com.br) são controlados por{' '}
            <strong>Saniella Beauty</strong>, CNPJ 58.267.823/0001-68, marca responsável pela Arquétypus Parfum.
          </p>
          <p>
            Endereço: <br /> <Todo>endereço do responsável pelo tratamento</Todo>
          </p>
          <p>
            Esta política explica quais dados coletamos quando você navega, faz o teste de arquétipo, compra ou se
            candidata ao programa de criadores — e o que você pode fazer a respeito.
          </p>
        </Section>

        <Section title="2. Quais dados coletamos">
          <div className="grid gap-3">
            <SubSection title="Navegação">
              <p>
                Páginas visitadas, origem da visita (inclusive parâmetros de campanha, como utm_source), tipo de
                dispositivo e navegador, e identificadores de cookies. A maior parte desses dados só é coletada se você
                aceitar os cookies — veja a seção 4.
              </p>
            </SubSection>
            <SubSection title="Teste de arquétipo">
              <p>
                As respostas do teste são processadas no seu próprio navegador para calcular o resultado. Elas não são
                enviadas para nossos servidores nem guardadas depois que você sai da página.
              </p>
            </SubSection>
            <SubSection title="Sacola">
              <p>
                Os produtos que você adiciona à sacola ficam apenas na memória do navegador enquanto a página está
                aberta. Não guardamos a sacola em cookie nem em servidor.
              </p>
            </SubSection>
            <SubSection title="Compra">
              <p>
                Para processar e entregar um pedido: nome, CPF, e-mail, telefone, endereço de entrega, itens comprados,
                valores e forma de pagamento.
              </p>
              <p>
                Dados de cartão são digitados diretamente no ambiente do provedor de pagamento (
                <Todo>nome do gateway/checkout</Todo>) e não ficam armazenados por nós.
              </p>
            </SubSection>
            <SubSection title="Programa de criadores">
              <p>
                Se você se candidatar em <Link to="/criadores" className="border-b border-latao-texto/40">/criadores</Link>:
                nome, WhatsApp, perfil em rede social e, se quiser informar, o link de um vídeo seu.
              </p>
            </SubSection>
            <SubSection title="Atendimento">
              <p>O que você nos enviar ao entrar em contato por e-mail ou outro canal de atendimento.</p>
            </SubSection>
          </div>
        </Section>

        <Section title="3. Para que usamos e com qual base legal">
          <p>Cada uso tem uma base legal da Lei Geral de Proteção de Dados (LGPD, Lei nº 13.709/2018):</p>
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <strong>Processar, entregar e dar suporte ao seu pedido</strong> — execução de contrato (art. 7º, V).
            </li>
            <li>
              <strong>Emitir nota fiscal e cumprir obrigações fiscais e do Código de Defesa do Consumidor</strong> —
              cumprimento de obrigação legal (art. 7º, II).
            </li>
            <li>
              <strong>Avaliar sua candidatura ao programa de criadores e responder a ela</strong> — procedimentos
              preliminares a contrato, a seu pedido (art. 7º, V).
            </li>
            <li>
              <strong>Medir o uso do site e o desempenho dos anúncios</strong> — consentimento (art. 7º, I), dado no
              aviso de cookies.
            </li>
            <li>
              <strong>Responder ao seu contato e exercer ou defender direitos</strong> — execução de contrato e
              exercício regular de direitos (art. 7º, V e VI).
            </li>
          </ul>
          <p>Não vendemos seus dados pessoais.</p>
        </Section>

        <Section title="4. Cookies">
          <p>
            Na primeira visita, um aviso pergunta se você aceita os cookies de análise e publicidade. A escolha é uma só
            para os dois tipos: aceitar ou recusar. Até você decidir — e se você recusar — esses cookies não são
            gravados no seu navegador.
          </p>
          <div className="grid gap-3">
            <SubSection title="Necessário — sempre ativo">
              <p>
                Registro da sua escolha de cookies (<code className="text-[12px]">arq_consent</code>, guardado no
                navegador por até 12 meses). Depois desse prazo, perguntamos de novo.
              </p>
            </SubSection>
            <SubSection title="Análise — só com aceite">
              <p>
                Google Analytics, carregado pelo Google Tag Manager, para entender quais páginas são visitadas e como o
                site é usado.
              </p>
            </SubSection>
            <SubSection title="Publicidade — só com aceite">
              <p>
                Tags de mídia para medir a conversão dos anúncios e formar públicos: <Todo>plataformas ativas no GTM
                (Google Ads, Meta, TikTok…)</Todo>.
              </p>
            </SubSection>
          </div>
          <p>
            Você pode mudar sua escolha a qualquer momento:{' '}
            <button
              type="button"
              onClick={openCookiePreferences}
              className="cursor-pointer border-b border-latao-texto/40 text-tinta hover:border-latao-texto"
            >
              gerenciar cookies
            </button>
            . Também dá para apagar os cookies nas configurações do navegador.
          </p>
        </Section>

        <Section title="5. Com quem compartilhamos">
          <p>Só com os fornecedores necessários para o site e a loja funcionarem, cada um no limite da sua função:</p>
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <strong>Hospedagem do site</strong> — <Todo>provedor</Todo>.
            </li>
            <li>
              <strong>Google</strong> (Tag Manager e Analytics) — medição de uso, só com seu aceite.
            </li>
            <li>
              <strong>Plataformas de anúncio</strong> — <Todo>quais</Todo>, só com seu aceite.
            </li>
            <li>
              <strong>Pagamento</strong> — <Todo>gateway/checkout</Todo>, para processar a cobrança.
            </li>
            <li>
              <strong>Entrega</strong> — <Todo>transportadora/Correios</Todo>, que recebem nome, endereço e telefone
              para levar o pedido.
            </li>
            <li>
              <strong>E-mail transacional</strong> — <Todo>provedor</Todo>, para confirmação e acompanhamento do pedido.
            </li>
          </ul>
          <p>Também podemos compartilhar dados quando uma lei ou ordem de autoridade competente exigir.</p>
        </Section>

        <Section title="6. Transferência internacional">
          <p>
            Parte desses fornecedores (como o Google) processa dados em servidores fora do Brasil. Nesses casos, a
            transferência segue as hipóteses do art. 33 da LGPD, como cláusulas contratuais com o fornecedor.
          </p>
        </Section>

        <Section title="7. Por quanto tempo guardamos">
          <ul className="list-inside list-disc space-y-1.5">
            <li>
              <strong>Escolha de cookies:</strong> até 12 meses no seu navegador.
            </li>
            <li>
              <strong>Dados de análise (Google Analytics):</strong> <Todo>prazo configurado no GA4 (2 ou 14 meses)</Todo>.
            </li>
            <li>
              <strong>Pedidos e notas fiscais:</strong> pelo prazo exigido pela legislação fiscal e de defesa do
              consumidor.
            </li>
            <li>
              <strong>Candidaturas de criadores:</strong> <Todo>prazo</Todo>, ou até você pedir a exclusão.
            </li>
          </ul>
          <p>Depois disso, os dados são eliminados ou anonimizados.</p>
        </Section>

        <Section title="8. Segurança">
          <p>
            O site usa conexão criptografada (HTTPS) e limitamos o acesso aos dados às pessoas e fornecedores que
            precisam deles para as finalidades acima. Nenhum sistema é totalmente imune a incidentes; se algum afetar
            seus dados de forma relevante, avisaremos você e a Autoridade Nacional de Proteção de Dados (ANPD), como
            prevê a LGPD.
          </p>
        </Section>

        <Section title="9. Seus direitos">
          <p>Como titular dos dados, você pode pedir a qualquer momento (art. 18 da LGPD):</p>
          <ul className="list-inside list-disc space-y-1.5">
            <li>confirmação de que tratamos seus dados;</li>
            <li>acesso aos dados que temos sobre você;</li>
            <li>correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
            <li>portabilidade dos dados a outro fornecedor;</li>
            <li>eliminação dos dados tratados com base no seu consentimento;</li>
            <li>informação sobre com quem compartilhamos seus dados;</li>
            <li>revogação do consentimento.</li>
          </ul>
          <p>
            Alguns dados não podem ser apagados enquanto a lei exigir que sejam guardados — por exemplo, os de pedidos e
            notas fiscais. Nesses casos, explicamos o motivo e o prazo.
          </p>
          <p>Você também pode apresentar reclamação à ANPD.</p>
        </Section>

        <Section title="10. Como falar com a gente">
          <p>
            Encarregado de proteção de dados (DPO): <strong>{CONTACT_EMAIL}</strong>
          </p>
          <p>
            Escreva informando o e-mail ou CPF usado na compra e o que você precisa. Para pedidos de acesso ou
            eliminação, podemos pedir uma confirmação de identidade antes de atender. O pedido é gratuito e não precisa
            de justificativa.
          </p>
        </Section>

        <Section title="11. Mudanças nesta política">
          <p>
            Quando esta política mudar, a data no topo da página será atualizada. Se a mudança afetar algo que depende
            do seu consentimento, pediremos de novo.
          </p>
        </Section>
      </div>
    </article>
  )
}
