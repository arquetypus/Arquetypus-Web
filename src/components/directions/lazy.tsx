import { lazy, Suspense, type ComponentType } from 'react'

/**
 * Peças das direções visuais que NÃO são a decidida (out/2026): carregadas só quando desenhadas. Com o ThemeSwitcher
 * desligado nunca são — e assim ficam fora do JS principal (eram ~220 KB processados em toda página). Com o painel
 * ligado, cada uma baixa na hora em que for escolhida (mostra nada por um instante, sem quebrar).
 * A direção decidida (Boutique + hero/catálogo do Cinema) continua importada direto no HomePage — é ela que o
 * servidor pré-renderiza, e React.lazy não renderiza no renderToString.
 */
function sobDemanda<P extends object>(carregar: () => Promise<ComponentType<P>>) {
  const Lazy = lazy(() => carregar().then((c) => ({ default: c })))
  return function Peca(props: P) {
    return (
      <Suspense fallback={null}>
        <Lazy {...props} />
      </Suspense>
    )
  }
}

// home inteira desenhada pela direção
export const OraculoPage = sobDemanda(() => import('./OraculoPage').then((m) => m.OraculoPage))
export const GaleriaPage = sobDemanda(() => import('./GaleriaPage').then((m) => m.GaleriaPage))
export const ManifestoPage = sobDemanda(() => import('./ManifestoPage').then((m) => m.ManifestoPage))
export const CinemaPage = sobDemanda(() => import('./CinemaPage').then((m) => m.CinemaPage))
export const HerbarioPage = sobDemanda(() => import('./Herbario').then((m) => m.HerbarioPage))
export const LaboratorioPage = sobDemanda(() => import('./Laboratorio').then((m) => m.LaboratorioPage))
export const RivieraPage = sobDemanda(() => import('./Riviera').then((m) => m.RivieraPage))
export const ZenPage = sobDemanda(() => import('./Zen').then((m) => m.ZenPage))

// heroes trocáveis
export const HeroCarousel = sobDemanda(() => import('../HeroCarousel').then((m) => m.HeroCarousel))
export const HeroAtelie = sobDemanda(() => import('../atelie/HeroAtelie').then((m) => m.HeroAtelie))
export const HeroOraculo = sobDemanda(() => import('./Oraculo').then((m) => m.HeroOraculo))
export const HeroGaleria = sobDemanda(() => import('./Galeria').then((m) => m.HeroGaleria))
export const HeroManifesto = sobDemanda(() => import('./Manifesto').then((m) => m.HeroManifesto))
export const HeroHerbario = sobDemanda(() => import('./Herbario').then((m) => m.HeroHerbario))
export const HeroLaboratorio = sobDemanda(() => import('./Laboratorio').then((m) => m.HeroLaboratorio))
export const HeroRiviera = sobDemanda(() => import('./Riviera').then((m) => m.HeroRiviera))
export const HeroZen = sobDemanda(() => import('./Zen').then((m) => m.HeroZen))

// catálogos trocáveis
export const CatalogIndex = sobDemanda(() => import('../atelie/CatalogIndex').then((m) => m.CatalogIndex))
export const CatalogOraculo = sobDemanda(() => import('./Oraculo').then((m) => m.CatalogOraculo))
export const CatalogGaleria = sobDemanda(() => import('./Galeria').then((m) => m.CatalogGaleria))
export const CatalogManifesto = sobDemanda(() => import('./Manifesto').then((m) => m.CatalogManifesto))
export const CatalogHerbario = sobDemanda(() => import('./Herbario').then((m) => m.CatalogHerbario))
export const CatalogLaboratorio = sobDemanda(() => import('./Laboratorio').then((m) => m.CatalogLaboratorio))
export const CatalogRiviera = sobDemanda(() => import('./Riviera').then((m) => m.CatalogRiviera))
export const CatalogZen = sobDemanda(() => import('./Zen').then((m) => m.CatalogZen))

// seções do Ateliê
export const CommunityAtelie = sobDemanda(() => import('../atelie/AtelieSections').then((m) => m.CommunityAtelie))
export const DiaryAtelie = sobDemanda(() => import('../atelie/AtelieSections').then((m) => m.DiaryAtelie))
export const FeaturedAtelie = sobDemanda(() => import('../atelie/AtelieSections').then((m) => m.FeaturedAtelie))
export const FooterAtelie = sobDemanda(() => import('../atelie/AtelieSections').then((m) => m.FooterAtelie))
