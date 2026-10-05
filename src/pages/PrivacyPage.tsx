import { Link } from 'react-router-dom'
import { LegalPage, Section, SubSection } from '@/components/ui/Legal'
import { EMPRESA, OPERACAO } from '@/data/empresa'
import { openCookiePreferences } from '@/lib/consent'

const LINK = 'border-b border-latao-texto/40 text-tinta hover:border-latao-texto'

/**
 * Política de Privacidade (vigência 01/10/2026). Descreve o que o site faz hoje — GTM/GA4 e tags de mídia só com
 * consentimento, sacola em memória, teste no navegador — e os fornecedores confirmados pelo usuário (OPERACAO em
 * data/empresa.ts). Atualizar junto com qualquer tag nova no GTM, o backend dos formulários e o checkout.
 * Retenção do GA4: o usuário pediu 12 meses, mas o GA4 padrão só oferece 2 ou 14 — o texto diz 14; configurar igual.
 */
export function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
    >
      <Section title="1. Quem cuida dos seus dados">
        <p>
          A Arquétypus Parfum é uma marca da <strong>{EMPRESA.razao}</strong>, CNPJ {EMPRESA.cnpj}, com sede na{' '}
          {EMPRESA.endereco}. Somos os responsáveis (controladores) pelos dados pessoais tratados neste site.
        </p>
        <p>
          Esta política explica quais dados coletamos quando você navega, se cadastra para receber novidades, compra ou se
          candidata ao programa de criadores — para que usamos, com quem compartilhamos e como você pode exercer seus
          direitos.
        </p>
      </Section>

      <Section title="2. Quais dados coletamos">
        <div className="grid gap-3">
          <SubSection title="Navegação">
            <p>
              Páginas visitadas, origem da visita (inclusive parâmetros de campanha, como utm_source), tipo de dispositivo
              e navegador, e identificadores de cookies. A maior parte desses dados só é coletada se você aceitar os
              cookies — veja a seção 4.
            </p>
          </SubSection>
          <SubSection title="Cadastro para o cupom e novidades">
            <p>E-mail e, se você informar, WhatsApp, para enviar o cupom de primeira compra e as novidades da marca.</p>
          </SubSection>
          <SubSection title="Compra">
            <p>
              Nome, CPF, e-mail, telefone, endereço de entrega, itens comprados, valores e forma de pagamento. Os dados do
              cartão são digitados diretamente no ambiente do {OPERACAO.pagamento} e não ficam armazenados com a gente.
            </p>
          </SubSection>
          <SubSection title="Programa de criadores">
            <p>
              Se você se candidatar em{' '}
              <Link to="/criadores" className={LINK}>
                Seja criador
              </Link>
              : nome, WhatsApp, perfil em rede social e, se quiser informar, o link de um vídeo seu.
            </p>
          </SubSection>
          <SubSection title="Atendimento">
            <p>O que você nos enviar ao falar com a gente pelo WhatsApp ou por e-mail.</p>
          </SubSection>
          <SubSection title="Teste de arquétipo">
            <p>
              As respostas do teste são processadas no seu próprio navegador para calcular o resultado. Elas não são
              enviadas para nossos servidores nem guardadas depois que você sai da página.
            </p>
          </SubSection>
        </div>
        <p>
          Você pode escolher não nos fornecer dados pessoais. Alguns, porém, são indispensáveis para concluir uma compra ou
          responder a um contato — sem eles, não conseguimos prestar esse serviço.
        </p>
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
            <strong>Enviar o cupom e as novidades da marca</strong> — consentimento (art. 7º, I), que você pode retirar a
            qualquer momento pelo link de descadastro das mensagens ou falando com a gente.
          </li>
          <li>
            <strong>Avaliar sua candidatura ao programa de criadores e responder a ela</strong> — procedimentos
            preliminares a contrato, a seu pedido (art. 7º, V).
          </li>
          <li>
            <strong>Medir o uso do site e o desempenho dos anúncios</strong> — consentimento (art. 7º, I), dado no aviso
            de cookies.
          </li>
          <li>
            <strong>Prevenir fraudes e confirmar dados de compras</strong> — legítimo interesse e proteção do crédito
            (art. 7º, IX e X).
          </li>
          <li>
            <strong>Responder ao seu contato e exercer ou defender direitos</strong> — execução de contrato e exercício
            regular de direitos (art. 7º, V e VI).
          </li>
        </ul>
        <p>Não vendemos seus dados pessoais.</p>
      </Section>

      <Section title="4. Cookies">
        <p>
          Na primeira visita, um aviso pergunta se você aceita os cookies de análise e publicidade. A escolha vale para os
          dois tipos. Até você decidir — e se você recusar —, esses cookies não são gravados no seu navegador.
        </p>
        <div className="grid gap-3">
          <SubSection title="Necessário — sempre ativo">
            <p>
              Registro da sua escolha de cookies (<code className="text-[12px]">arq_consent</code>), guardado no seu
              navegador por até 12 meses. Depois desse prazo, perguntamos de novo.
            </p>
          </SubSection>
          <SubSection title="Análise — só com o seu aceite">
            <p>Google Analytics, carregado pelo Google Tag Manager, para entender quais páginas são visitadas e como o site é usado.</p>
          </SubSection>
          <SubSection title="Publicidade — só com o seu aceite">
            <p>Tags de {OPERACAO.anuncios}, para medir a conversão dos anúncios e formar públicos.</p>
          </SubSection>
        </div>
        <p>
          Você pode mudar sua escolha a qualquer momento em{' '}
          <button
            type="button"
            onClick={openCookiePreferences}
            className="cursor-pointer border-b border-latao-texto/40 text-tinta hover:border-latao-texto"
          >
            gerenciar cookies
          </button>
          . Também dá para apagar os cookies nas configurações do seu navegador.
        </p>
      </Section>

      <Section title="5. Com quem compartilhamos">
        <p>Só com os fornecedores necessários para o site e a loja funcionarem, cada um no limite da sua função:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Hospedagem do site</strong> — {OPERACAO.hospedagem}.
          </li>
          <li>
            <strong>Pagamento</strong> — {OPERACAO.pagamento}, para processar a cobrança e prevenir fraudes.
          </li>
          <li>
            <strong>Entrega</strong> — {OPERACAO.frete} e as transportadoras {OPERACAO.transportadoras}, que recebem nome,
            endereço e telefone para levar o pedido.
          </li>
          <li>
            <strong>E-mail</strong> — {OPERACAO.email}, para confirmação de pedido, rastreio, atendimento e novidades.
          </li>
          <li>
            <strong>Medição e anúncios</strong> — Google (Tag Manager e Analytics) e {OPERACAO.anuncios}, só com o seu
            aceite de cookies.
          </li>
        </ul>
        <p>Também podemos compartilhar dados quando uma lei ou ordem de autoridade competente exigir.</p>
      </Section>

      <Section title="6. Transferência internacional">
        <p>
          Parte desses fornecedores — como Vercel, Google, Meta e TikTok — processa dados em servidores fora do Brasil.
          Nesses casos, a transferência segue as hipóteses do art. 33 da LGPD, como as cláusulas contratuais de proteção
          de dados oferecidas por esses fornecedores.
        </p>
      </Section>

      <Section title="7. Por quanto tempo guardamos">
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Escolha de cookies:</strong> até 12 meses, no seu navegador.
          </li>
          <li>
            <strong>Dados de análise (Google Analytics):</strong> 14 meses.
          </li>
          <li>
            <strong>Cadastro para cupom e novidades:</strong> até você pedir o descadastro.
          </li>
          <li>
            <strong>Candidaturas de criadores:</strong> 12 meses, ou até você pedir a exclusão.
          </li>
          <li>
            <strong>Pedidos e notas fiscais:</strong> pelo prazo exigido pela legislação fiscal e de defesa do consumidor
            — em regra, 5 anos.
          </li>
        </ul>
        <p>Depois disso, os dados são eliminados ou anonimizados.</p>
      </Section>

      <Section title="8. Segurança">
        <p>
          O site usa conexão criptografada (HTTPS) e limitamos o acesso aos dados às pessoas e aos fornecedores que
          precisam deles para as finalidades acima. Nenhum sistema é totalmente imune a incidentes; se algum afetar seus
          dados de forma relevante, avisaremos você e a Autoridade Nacional de Proteção de Dados (ANPD), como prevê a
          LGPD.
        </p>
      </Section>

      <Section title="9. Seus direitos">
        <p>Como titular dos dados, você pode pedir a qualquer momento (art. 18 da LGPD):</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>confirmação de que tratamos seus dados e acesso a eles;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;</li>
          <li>portabilidade dos dados a outro fornecedor;</li>
          <li>eliminação dos dados tratados com base no seu consentimento e revogação desse consentimento;</li>
          <li>informação sobre com quem compartilhamos seus dados.</li>
        </ul>
        <p>
          Alguns dados não podem ser apagados enquanto a lei exigir que sejam guardados — por exemplo, os de pedidos e
          notas fiscais. Nesses casos, explicamos o motivo e o prazo. Você também pode apresentar reclamação à ANPD.
        </p>
      </Section>

      <Section title="10. Menores de idade">
        <p>
          As compras no site devem ser feitas por maiores de 18 anos. Não coletamos intencionalmente dados de crianças e
          adolescentes; se identificarmos que isso aconteceu, os dados são eliminados.
        </p>
      </Section>

      <Section title="11. Links para outros sites">
        <p>
          O site tem links para páginas que não são nossas — como nossos perfis no Instagram e no TikTok e a conversa no
          WhatsApp. Ao abrir esses links, vale a política de privacidade de cada plataforma, sobre a qual não temos
          controle.
        </p>
      </Section>

      <Section title="12. Como falar com a gente">
        <p>
          Encarregado de proteção de dados (DPO):{' '}
          <a href={`mailto:${EMPRESA.email}`} className={LINK}>
            {EMPRESA.email}
          </a>
        </p>
        <p>
          Escreva informando o e-mail ou o CPF usado na compra e o que você precisa. Para pedidos de acesso ou eliminação,
          podemos pedir uma confirmação de identidade antes de atender. O pedido é gratuito e não precisa de justificativa.
        </p>
      </Section>

      <Section title="13. Mudanças nesta política">
        <p>
          Quando esta política mudar, a data no topo da página será atualizada. Se a mudança afetar algo que depende do
          seu consentimento, pediremos de novo.
        </p>
      </Section>
    </LegalPage>
  )
}
