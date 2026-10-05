import { useLocation } from 'react-router-dom'
import { resolveSeo } from '@/lib/seoModel'
import { useSeo } from '@/lib/seo'

export function RouteSeo() {
  const { pathname } = useLocation()
  useSeo(resolveSeo(pathname))
  return null
}
