import { useEffect, useState } from 'react'

const SESSION_KEY = 'arquetypus_capture_shown'

export function CaptureModal() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return

    const show = () => {
      setOpen(true)
      sessionStorage.setItem(SESSION_KEY, '1')
    }

    const timer = setTimeout(show, 8000)

    function onExitIntent(e: MouseEvent) {
      if (e.clientY <= 0) show()
    }
    document.addEventListener('mouseleave', onExitIntent)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', onExitIntent)
    }
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-tinta/60 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-papel p-6">
        <button
          aria-label="Fechar"
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 text-lg text-tinta-3"
        >
          ✕
        </button>
        {submitted ? (
          <p className="py-6 text-center text-sm font-medium">Cupom enviado para seu e-mail!</p>
        ) : (
          <>
            <p className="font-mono text-[10px] tracking-[0.22em] text-latao uppercase">
              Primeira compra
            </p>
            <h2 className="mt-2 font-display text-2xl">
              15% no seu
              <br />
              primeiro arquétipo
            </h2>
            <p className="mt-2 text-sm text-tinta-2">Cupom no e-mail, lançamentos antes de todo mundo.</p>
            <form
              className="mt-4 flex flex-col gap-2.5"
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
            >
              <input
                type="email"
                placeholder="seu@email.com"
                aria-label="E-mail"
                required
                className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm"
              />
              <input
                type="tel"
                placeholder="WhatsApp (DDD + número)"
                aria-label="WhatsApp"
                className="rounded-md border border-linha-2 bg-papel px-3 py-2.5 text-sm"
              />
              <button className="rounded-lg bg-tinta py-3.5 text-sm font-medium text-papel">
                Quero meu cupom
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
