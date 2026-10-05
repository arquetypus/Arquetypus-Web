import { Contato, EMPRESA, LegalPage, Section, TextLink } from '@/components/ui/Legal'
import { CONDICOES, OPERACAO } from '@/data/empresa'

/**
 * Regras do Site (vigência 01/10/2026): as regras de compra — preço, promoções e cupom, pagamento, pedido,
 * cancelamento, estoque, informações dos produtos. Cupom confirmado pelo usuário: 15%, primeira compra, um por CPF,
 * acumula com outras promoções. Pagamento pelo Mercado Pago (OPERACAO em data/empresa.ts).
 */
export function RegrasPage() {
  return (
    <LegalPage
      title="Regras do Site"
    >
      <Section title="1. Preços">
        <p>
          Os preços valem para compras feitas no site e podem mudar sem aviso prévio. Vale o preço exibido no momento em
          que você finaliza o pedido.
        </p>
        <p>
          Se um preço aparecer com erro evidente — muito diferente do valor real, por falha técnica —, falamos com você
          antes do envio, e você escolhe entre manter o pedido pelo preço correto ou cancelar com reembolso integral.
        </p>
      </Section>

      <Section title="2. Promoções e cupom de primeira compra">
        <p>
          Cada promoção tem prazo e condições informados na própria oferta.
        </p>
        <p>
          Ao cadastrar seu e-mail na home, você recebe um cupom de <strong>{CONDICOES.cupomPrimeiraCompraPct}% de desconto na primeira compra</strong>. O
          cupom vale uma única vez por CPF e pode ser usado junto com outras promoções do site, inclusive o desconto do
          Pix.
        </p>
      </Section>

      <Section title="3. Formas de pagamento">
        <p>
          Os pagamentos são processados pelo {OPERACAO.pagamento}, em ambiente seguro — os dados do seu cartão não ficam
          guardados com a gente.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Pix</strong>, com {CONDICOES.pixDescontoPct}% de desconto.
          </li>
          <li>
            <strong>Cartão de crédito</strong> Visa, Mastercard, Elo, American Express ou Hipercard, em até {CONDICOES.parcelasSemJuros}x sem juros.
          </li>
        </ul>
      </Section>

      <Section title="4. Confirmação do pedido">
        <p>
          Depois da compra, você recebe por e-mail o resumo do pedido. Ele é confirmado quando o pagamento é aprovado. Por
          segurança, podemos falar com você pelo WhatsApp para confirmar algum dado antes do envio.
        </p>
      </Section>

      <Section title="5. Cancelamento">
        <p>
          Você pode cancelar o pedido antes do envio falando com a gente, com reembolso integral. Depois do envio, vale a{' '}
          <TextLink to="/trocas-e-devolucoes">Política de Trocas e Devoluções</TextLink>.
        </p>
        <p>
          Podemos cancelar pedidos com indício de fraude ou com dados que não conseguimos confirmar. Nesse caso, devolvemos
          o valor pago integralmente.
        </p>
      </Section>

      <Section title="6. Estoque">
        <p>
          Os produtos estão sujeitos à disponibilidade de estoque. Se algum item ficar indisponível depois da compra,
          avisamos você e, como preferir, devolvemos o valor pago ou trocamos por outra fragrância.
        </p>
      </Section>

      <Section title="7. Informações e imagens dos produtos">
        <p>
          As fotos do catálogo mostram os frascos reais; algumas imagens de ambientação e de campanha são ilustrativas, e
          as cores podem variar um pouco conforme a tela. Notas olfativas, volume e composição estão na página de cada
          produto.
        </p>
      </Section>

      <Section title="8. Entrega, trocas e privacidade">
        <p>
          Veja também a <TextLink to="/entrega-e-frete">Política de Entrega e Frete</TextLink>, a{' '}
          <TextLink to="/trocas-e-devolucoes">Política de Trocas e Devoluções</TextLink>, a{' '}
          <TextLink to="/privacidade">Política de Privacidade</TextLink> e os{' '}
          <TextLink to="/termos-de-uso">Termos de Uso</TextLink>.
        </p>
      </Section>

      <Section title="9. Fale com a gente">
        <p>
          <Contato />.
        </p>
        <p className="text-[13px] text-tinta-3">{EMPRESA}</p>
      </Section>
    </LegalPage>
  )
}
