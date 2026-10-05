// Executado somente na página local de QA; DOMParser mantém scripts analisados inertes.
function inspectDocument(input) {
  const doc = new DOMParser().parseFromString(input.html, 'text/html');
  const clean = node => {
    const clone = node.cloneNode(true);
    clone.querySelectorAll('script,style,noscript').forEach(item => item.remove());
    return clone.textContent.replace(/\s+/g, ' ').trim();
  };
  const compact = value => value.replace(/\s/g, '');
  const one = (selector, value, attr) => {
    const nodes = doc.querySelectorAll(selector);
    return nodes.length === 1 && (attr ? nodes[0].getAttribute(attr) : nodes[0].textContent) === value;
  };
  const main = doc.querySelector('main'), headings = main.querySelectorAll('h1'), text = clean(main);
  const schemas = Array.from(doc.querySelectorAll('script[type="application/ld+json"]')).map(node => ({ id: node.id, data: JSON.parse(node.textContent) }));
  const checks = {
    title: one('title', input.head.title),
    description: one('meta[name="description"]', input.head.description, 'content'),
    canonical: input.route === null ? doc.querySelectorAll('link[rel="canonical"]').length === 0 : one('link[rel="canonical"]', input.head.canonical, 'href'),
    og: one('meta[property="og:type"]', input.head.og.type, 'content') && one('meta[property="og:title"]', input.head.title, 'content'),
    main: text.length > 100, h1: headings.length === 1, noInternal: !/ARQ-\d+/.test(text),
    noCookie: !doc.querySelector('[aria-label="Cookies neste site"]'),
    json: JSON.stringify(schemas) === JSON.stringify(input.head.scripts.map(script => ({ id: script.id, data: JSON.parse(script.json) }))),
    formsSafeBeforeHydration: Array.from(doc.querySelectorAll('form input,form select,form textarea')).every(node => !node.name || node.matches(':disabled')),
  };
  if (input.product) {
    const product = input.product, identity = headings[0].closest('section'), buy = identity.nextElementSibling;
    const schema = schemas.find(script => script.id === 'arq-seo-product').data;
    checks.productName = compact(clean(headings[0])) === compact(product.nome + (product.sobrenome || ''));
    checks.purchasePrice = compact(clean(buy)).includes(compact(product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })));
    checks.productDescription = clean(identity).includes(product.card);
    checks.noOffer = !schema.offers && !schema.aggregateRating;
    checks.photo = main.querySelector('[aria-roledescription="slide"] img').getAttribute('src') === new URL(schema.image).pathname;
  }
  return { route: input.route, file: input.file, checks, h1: Array.from(headings).map(clean), mainExcerpt: text.slice(0, 500), jsonLdCount: schemas.length, passed: Object.values(checks).every(Boolean) };
}
(async () => {
  try {
    const inputs = await (await fetch('/__qa/contracts')).json();
    const rows = inputs.map(inspectDocument);
    const original = inputs.find(input => input.product);
    const negativeDoc = new DOMParser().parseFromString(original.html, 'text/html');
    const price = original.product.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    // Mantém preço verdadeiro no ritual; somente bloco principal de compra perde o preço.
    // Scripts/noscript falsos dentro do próprio bloco também precisam ser ignorados.
    negativeDoc.querySelector('main h1').closest('section').nextElementSibling.innerHTML = '<script>' + JSON.stringify(price) + '</script><noscript>' + price + '</noscript>';
    const withoutPrice = { ...original, html: negativeDoc.documentElement.outerHTML };
    const negative = !inspectDocument(withoutPrice).checks.purchasePrice;
    document.getElementById('qa-dom').textContent = JSON.stringify({ rows, negativeScriptPriceRejected: negative, passed: rows.every(row => row.passed) && negative, ready: true });
  } catch (error) { document.getElementById('qa-dom').textContent = JSON.stringify({ error: String(error), ready: true, passed: false }); }
})();
