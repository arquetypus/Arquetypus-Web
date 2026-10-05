# Identidade oficial dos produtos

## Fonte e aplicação

Nomes registrados e GTINs informados pelo usuário em 05/10/2026. O cadastro usa o vínculo por slug, não a posição na lista. A validação local confirmou os 13 dígitos, o dígito verificador, a ausência de duplicações e a correspondência entre nome, fragrância e volume. Não houve consulta de titularidade na GS1 ou verificação independente do registro.

| Slug | Nome oficial | GTIN-13 |
| --- | --- | --- |
| afrodite | BODY SPLASH AFRODITE FIRST KISS 200 ML | 7898745336491 |
| imperatriz | BODY SPLASH IMPERATRIZ VELVET DYNASTY 200 ML | 7898745336507 |
| fada | BODY SPLASH FADA PURE LIGHT 200 ML | 7898745336514 |
| cleopatra | BODY SPLASH CLEÓPATRA NILE ROSE 200 ML | 7898745336484 |
| sereia | BODY SPLASH SEREIA OCEAN BREEZE 200 ML | 7898745336477 |
| fenix | BODY SPLASH FÊNIX AMBER BURN 220 ML | 7898745336545 |
| zeus | BODY SPLASH ZEUS STORMBREAK 220 ML | 7898745336460 |
| guerreiro | BODY SPLASH GUERREIRO STEEL BLUE 220 ML | 7898745336521 |
| imperador | BODY SPLASH IMPERADOR RED EMPIRE 220 ML | 7898745336538 |

`src/data/archetypes.ts` armazena `nomeOficial` e `gtin13`. O modelo compartilhado `src/lib/seoModel.ts` usa esses campos em `Product.name` e `Product.gtin13`, tanto na pré-renderização quanto no cliente. O GTIN permanece texto, conforme [Schema.org](https://schema.org/gtin13).

Conforme esclarecimento do usuário, `nomeOficial` é o nome cadastrado no GTIN, não o nome comercial exibido no site. Seu uso fica restrito à identificação estruturada para SEO e futuras integrações de catálogo. Componentes visuais devem continuar usando `nome` e `sobrenome`; não substituir textos de cards, H1, sacola ou botões pelo nome registrado. Uma integração com Google Shopping/Merchant Center ainda precisa ser implementada e validada separadamente.

Os campos de apresentação, H1, título, descrição, URLs e volumes permanecem iguais. O SKU no JSON-LD continua sendo o slug; `cod` continua identificador interno existente. GTIN não foi convertido em SKU ou MPN. Ofertas, disponibilidade e avaliações continuam ausentes enquanto não houver dados e operação de venda confirmados.

## Manutenção e validação

Após alterar dados, executar `npm run build`. O gate permanente rejeita GTIN malformado, dígito verificador incorreto, duplicação e divergência de identidade/volume. Também confere nome e GTIN no Product extraído do HTML bruto de cada PDP.

Publicar dados exige novo build/deploy. Após a publicação, conferir os nove JSON-LD no HTML entregue pelo domínio principal e os nomes comerciais na navegação com Google Chrome. Relatórios locais de SSR e artefatos ficam em `dist-server`, fora da saída publicada.

O identificador melhora a identificação dos produtos para consumidores de dados estruturados. Ele sozinho não garante resultados enriquecidos ou aprovação no Merchant Center; essas integrações exigem configuração e critérios próprios.
