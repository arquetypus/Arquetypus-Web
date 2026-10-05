import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Fixture } from './etapa2-fixture'

const errors: string[] = []
hydrateRoot(document.getElementById('root')!, <StrictMode><Fixture /></StrictMode>, {
  onRecoverableError: error => {
    errors.push(String(error))
    document.getElementById('qa-hydration')!.textContent = JSON.stringify(errors)
  },
})
