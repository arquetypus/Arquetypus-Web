// Ensaio isolado de Etapa 1. Não é uma entrada SSR do site nem gera rotas de produção.
import { MemoryRouter } from 'react-router-dom'
import App from '../../../src/App'
import { ProductGallery } from '../../../src/components/ProductGallery'
import { Reveal } from '../../../src/components/ui/Reveal'
import { useThemeState } from '../../../src/lib/theme'

function ThemeProbe() {
  return <output id="theme-probe">{JSON.stringify(useThemeState())}</output>
}

export function Fixture() {
  return <MemoryRouter initialEntries={['/']}>
    <App />
    <Reveal id="reveal-probe">Conteúdo disponível mesmo se o bundle falhar.</Reveal>
    <div id="gallery-probe" style={{ width: 300 }}>
      <ProductGallery nome="QA" bg="#fff" slides={[
        { src: '/favicon-32.png', requisito: 'QA 1' },
        { src: '/apple-touch-icon.png', requisito: 'QA 2' },
      ]} />
    </div>
    <ThemeProbe />
  </MemoryRouter>
}
