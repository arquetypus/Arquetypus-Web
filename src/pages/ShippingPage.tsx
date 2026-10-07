import { Contato, EMPRESA, LegalPage, Section, TextLink } from '@/components/ui/Legal'
import { CONDICOES, FRETE_GRATIS_ACIMA, OPERACAO } from '@/data/empresa'

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

/**
 * Política de Entrega e Frete (vigência 01/10/2026). Dados confirmados pelo usuário: postagem em 24 h úteis, frete
 * grátis acima de REWARD_FREIGHT, verificação por WhatsApp, Melhor Envio com Correios, Jadlog e J&T Express
 * (OPERACAO em data/empresa.ts). Trocas e devoluções em /trocas-e-devolucoes.
 */
export function ShippingPage() {
  return (
    <LegalPage
      title="Política de Entrega e Frete"
    >
      <Section title="1. Quando seu pedido é enviado">
        <p>
          Seu pedido é preparado e postado em até <strong>{CONDICOES.envioHorasUteis} horas úteis</strong> depois que o pagamento é aprovado. No
          Pix, a aprovação costuma ser imediata; no cartão de crédito, ela acontece quando a operadora confirma a compra.
          Pedidos aprovados em fins de semana ou feriados seguem no próximo dia útil.
        </p>
        <p>
          Por segurança, podemos falar com você pelo WhatsApp para confirmar algum dado da compra antes do envio. Nesse
          caso, o prazo de postagem começa a contar a partir da sua confirmação.
        </p>
      </Section>

      <Section title="2. Frete e transportadoras">
        <p>
          Entregamos em todo o Brasil. Os envios são feitos pela plataforma {OPERACAO.frete}, com as transportadoras{' '}
          {OPERACAO.transportadoras}. Ao informar o CEP no carrinho, você vê as opções de entrega disponíveis para o seu
          endereço, com o valor e o prazo de cada uma, e escolhe a que preferir.
        </p>
        {FRETE_GRATIS_ACIMA && (
          <p>
            Compras acima de <strong>{brl(FRETE_GRATIS_ACIMA)}</strong> têm frete grátis.
          </p>
        )}
      </Section>

      <Section title="3. Prazo de entrega">
        <p>
          O prazo de entrega começa a contar no dia útil seguinte à postagem e é informado pela transportadora em dias
          úteis — sem contar fins de semana e feriados. É uma estimativa: pode variar por fatores fora do nosso controle,
          como clima, greves ou restrições de entrega em algumas regiões.
        </p>
      </Section>

      <Section title="4. Acompanhamento do pedido">
        <p>
          Assim que o pedido é postado, você recebe por e-mail o código de rastreio para acompanhar a entrega. Se não
          encontrar a mensagem, confira a caixa de spam ou fale com a gente.
        </p>
        <p>
          Se a entrega passar do prazo informado, acionamos a transportadora e acompanhamos o caso com você até o pedido
          chegar.
        </p>
      </Section>

      <Section title="5. Endereço e tentativas de entrega">
        <p>
          Confira o endereço com atenção antes de finalizar a compra. Se o pedido voltar para nós por endereço incorreto
          ou incompleto, ou porque ninguém pôde recebê-lo depois das tentativas da transportadora, entramos em contato
          para combinar um novo envio — nesse caso, o novo frete fica por conta do cliente.
        </p>
      </Section>

      <Section title="6. Ao receber o pedido">
        <p>
          Confira a embalagem na hora da entrega. Se ela estiver violada, amassada ou molhada, você pode recusar o
          recebimento. Se aceitar e encontrar o produto danificado, fotografe a embalagem e o produto e avise a gente o
          quanto antes — de preferência em até 7 dias. Resolvemos com um novo envio ou com o reembolso, sem custo para
          você.
        </p>
        <p>
          Em caso de extravio ou roubo durante o transporte, abrimos a apuração com a transportadora e, confirmado o
          ocorrido, enviamos o pedido novamente ou devolvemos o valor pago, como você preferir.
        </p>
      </Section>

      <Section title="7. Trocas e devoluções">
        <p>
          Prazos, condições e o passo a passo estão na{' '}
          <TextLink to="/trocas-e-devolucoes">Política de Trocas e Devoluções</TextLink>.
        </p>
      </Section>

      <Section title="8. Fale com a gente">
        <p>
          Dúvidas sobre entrega ou frete: <Contato />.
        </p>
        <p className="text-[13px] text-tinta-3">{EMPRESA}</p>
      </Section>
    </LegalPage>
  )
}
