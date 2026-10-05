import { Contato, EMPRESA as EMPRESA_LINHA, LegalPage, Section, TextLink } from '@/components/ui/Legal'
import { EMPRESA } from '@/data/empresa'

/**
 * Termos de Uso (vigência 01/10/2026). Limitação de responsabilidade escrita dentro do CDC (não afasta direitos do
 * consumidor) e foro do domicílio do consumidor (art. 101, I, do CDC). Regras de compra ficam em /regras-do-site.
 */
export function TermosPage() {
  return (
    <LegalPage
      title="Termos de Uso"
    >
      <Section title="1. Sobre estes termos">
        <p>
          Estes termos valem para quem navega ou compra no site da Arquétypus Parfum, marca da {EMPRESA.razao}, CNPJ{' '}
          {EMPRESA.cnpj}. Ao usar o site, você concorda com eles e com a{' '}
          <TextLink to="/privacidade">Política de Privacidade</TextLink>, as{' '}
          <TextLink to="/regras-do-site">Regras do Site</TextLink>, a{' '}
          <TextLink to="/entrega-e-frete">Política de Entrega e Frete</TextLink> e a{' '}
          <TextLink to="/trocas-e-devolucoes">Política de Trocas e Devoluções</TextLink>.
        </p>
      </Section>

      <Section title="2. Quem pode comprar">
        <p>
          As compras devem ser feitas por maiores de 18 anos, com dados verdadeiros e atualizados. Você é responsável
          pelas informações que fornece.
        </p>
      </Section>

      <Section title="3. Uso do site">
        <p>
          O conteúdo do site é para uso pessoal e não comercial. Não é permitido copiar, reproduzir, modificar ou
          distribuir textos, fotos, vídeos, marcas ou o design do site sem autorização por escrito, nem usar robôs ou
          qualquer meio automatizado para extrair conteúdo.
        </p>
        <p>Também não é permitido usar o site para:</p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>qualquer atividade ilegal ou fraudulenta;</li>
          <li>publicar ou enviar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros;</li>
          <li>enviar vírus ou qualquer código que prejudique o site ou outros usuários;</li>
          <li>tentar acessar áreas, sistemas ou dados sem autorização.</li>
        </ul>
      </Section>

      <Section title="4. Propriedade intelectual">
        <p>
          A marca Arquétypus, o logotipo, os nomes e as descrições dos nove arquétipos, os textos, as fotos e o design do
          site pertencem à {EMPRESA.razao} ou são usados com autorização, e são protegidos pelas leis de direitos autorais e
          de propriedade industrial.
        </p>
      </Section>

      <Section title="5. Informações do site">
        <p>
          Trabalhamos para manter as informações corretas e atualizadas, mas o site pode conter erros de digitação ou de
          imagem. Podemos corrigi-los e atualizar o conteúdo a qualquer momento. Se um erro afetar um pedido seu, seguimos o
          que está nas <TextLink to="/regras-do-site">Regras do Site</TextLink>.
        </p>
        <p>
          O teste de arquétipo e as descrições das fragrâncias são uma forma de orientar sua escolha a partir do seu jeito
          de ser — não são avaliação psicológica nem promessa de efeito.
        </p>
      </Section>

      <Section title="6. Links para outros sites">
        <p>
          O site tem links para páginas de terceiros, como nossos perfis no Instagram e no TikTok e a conversa no
          WhatsApp. Não controlamos o conteúdo nem as práticas desses sites, que têm termos e políticas próprios.
        </p>
      </Section>

      <Section title="7. Disponibilidade e responsabilidade">
        <p>
          Fazemos o possível para que o site funcione sem interrupções e com segurança, mas não podemos garantir que ele
          esteja sempre disponível ou livre de falhas técnicas. Nada nestes termos limita os direitos que o Código de
          Defesa do Consumidor garante a você.
        </p>
      </Section>

      <Section title="8. Mudanças nestes termos">
        <p>
          Podemos atualizar estes termos. A data no topo da página mostra a versão em vigor; compras já feitas seguem os
          termos válidos no momento da compra.
        </p>
      </Section>

      <Section title="9. Lei aplicável e foro">
        <p>
          Estes termos seguem a legislação brasileira. Questões relacionadas a eles podem ser levadas ao foro do seu
          domicílio, como prevê o Código de Defesa do Consumidor.
        </p>
      </Section>

      <Section title="10. Fale com a gente">
        <p>
          <Contato />.
        </p>
        <p className="text-[13px] text-tinta-3">{EMPRESA_LINHA}</p>
      </Section>
    </LegalPage>
  )
}
