import { Contato, EMPRESA, LegalPage, Section, SubSection, TextLink } from '@/components/ui/Legal'
import { OPERACAO } from '@/data/empresa'

/**
 * Política de Trocas e Devoluções (vigência 01/10/2026). Regras confirmadas pelo usuário: arrependimento em 7 dias
 * com produto lacrado e sem uso; defeito em 30 dias (CDC art. 26); reembolso no Pix em até 3 dias após receber e
 * avaliar o produto; estorno no cartão conforme a operadora. Frete de devolução por conta da loja.
 */
export function TrocasPage() {
  return (
    <LegalPage
      title="Política de Trocas e Devoluções"
    >
      <Section title="1. Em resumo">
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>Desistiu da compra?</strong> Você tem 7 dias corridos a partir do recebimento, com o produto lacrado e
            sem uso.
          </li>
          <li>
            <strong>Chegou com defeito?</strong> Você tem 30 dias para nos avisar, mesmo com o produto aberto.
          </li>
          <li>
            <strong>O frete de volta</strong> é sempre por nossa conta.
          </li>
        </ul>
      </Section>

      <Section title="2. Desistência da compra">
        <p>
          Comprou e mudou de ideia? Você pode desistir em até <strong>7 dias corridos</strong> a partir do recebimento,
          como garante o Código de Defesa do Consumidor (art. 49) para compras feitas pela internet.
        </p>
        <p>
          Como nossas fragrâncias são produtos de uso pessoal, por questão de higiene e segurança a devolução por
          desistência vale para o produto <strong>lacrado, sem uso</strong>, na embalagem original e com o lacre intacto.
        </p>
        <p>
          Devolvemos o valor integral, incluindo o frete pago na compra. Se preferir, no lugar do reembolso você pode
          trocar por outra fragrância da coleção.
        </p>
      </Section>

      <Section title="3. Produto com defeito">
        <p>
          Se o produto apresentar defeito — vazamento, válvula que não borrifa, frasco trincado ou tampa danificada —,
          avise em até <strong>30 dias</strong> a partir do recebimento (art. 26 do Código de Defesa do Consumidor),
          mesmo que ele já tenha sido aberto. Você escolhe: troca pelo mesmo produto, troca por outro de mesmo valor ou
          reembolso.
        </p>
        <p>
          A percepção de fixação e de intensidade muda de pessoa para pessoa — com o tipo de pele, o clima e a forma de
          aplicar — e, por isso, sozinha não caracteriza defeito.
        </p>
      </Section>

      <Section title="4. Avaria no transporte e extravio">
        <p>
          Produto que chegou danificado ou pedido extraviado seguem a{' '}
          <TextLink to="/entrega-e-frete">Política de Entrega e Frete</TextLink>: avise a gente com fotos e resolvemos com
          um novo envio ou com o reembolso, sem custo para você.
        </p>
      </Section>

      <Section title="5. Como solicitar">
        <ol className="list-inside list-decimal space-y-1.5">
          <li>
            Fale com a gente pelo <Contato />.
          </li>
          <li>Informe o número do pedido e o motivo. Em caso de defeito ou avaria, envie fotos do produto e da embalagem.</li>
          <li>Enviamos as instruções e o código para postar o produto de volta, sem custo.</li>
          <li>Envie o produto com a nota fiscal.</li>
          <li>Ao receber, avaliamos o produto e fazemos a troca ou o reembolso.</li>
        </ol>
      </Section>

      <Section title="6. Reembolso">
        <p>O reembolso é feito pela mesma forma de pagamento usada na compra, processada pelo {OPERACAO.pagamento}:</p>
        <div className="grid gap-3">
          <SubSection title="Pix">
            <p>Devolvemos o valor em até 3 dias depois de recebermos e avaliarmos o produto devolvido.</p>
          </SubSection>
          <SubSection title="Cartão de crédito">
            <p>
              Solicitamos o estorno assim que recebemos e avaliamos o produto. O crédito aparece na sua fatura de acordo
              com os prazos de cada operadora de cartão — em caso de dúvida, consulte a sua.
            </p>
          </SubSection>
        </div>
      </Section>

      <Section title="7. Fale com a gente">
        <p>
          Dúvidas sobre trocas ou devoluções: <Contato />.
        </p>
        <p className="text-[13px] text-tinta-3">{EMPRESA}</p>
      </Section>
    </LegalPage>
  )
}
