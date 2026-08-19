import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUIZ_QUESTIONS } from '@/data/quiz'
import { computeResult, type Segmento } from '@/lib/quizEngine'

export function QuizPage() {
  const navigate = useNavigate()
  const [segmento, setSegmento] = useState<Segmento | null>(null)
  const [step, setStep] = useState(0)
  const [respostas, setRespostas] = useState<number[]>([])

  if (!segmento) {
    return (
      <div className="min-h-[calc(100svh-3rem)] bg-noite px-4 py-8 text-papel-inv">
        <h1 className="font-display text-3xl">Qual coleção é a sua?</h1>
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="rounded-xl border border-papel-inv/15 bg-papel-inv/5 py-4 text-sm text-papel-inv/90 transition-colors hover:bg-papel-inv/10"
            onClick={() => setSegmento('F')}
          >
            Feminina
          </button>
          <button
            className="rounded-xl border border-papel-inv/15 bg-papel-inv/5 py-4 text-sm text-papel-inv/90 transition-colors hover:bg-papel-inv/10"
            onClick={() => setSegmento('M')}
          >
            Masculina
          </button>
          <button
            className="rounded-xl border border-papel-inv/15 bg-papel-inv/5 py-4 text-sm text-papel-inv/90 transition-colors hover:bg-papel-inv/10"
            onClick={() => setSegmento('todos')}
          >
            Mostrar os nove
          </button>
        </div>
      </div>
    )
  }

  const pergunta = QUIZ_QUESTIONS[step]

  function pick(opcaoIndex: number) {
    const proximas = [...respostas.slice(0, step), opcaoIndex]
    setRespostas(proximas)
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1)
      return
    }
    const result = computeResult(segmento!, proximas)
    navigate('/resultado', { state: result })
  }

  return (
    <div className="min-h-[calc(100svh-3rem)] bg-noite px-4 py-8 text-papel-inv">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-papel-inv/50">
          {step + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <div className="h-1 flex-1 rounded-full bg-papel-inv/10">
          <div
            className="h-1 rounded-full bg-gradient-to-r from-afrodite via-latao to-fenix transition-[width] duration-400 ease-out"
            style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="mt-6 font-display text-3xl">{pergunta.pergunta}</h2>

      <div className="mt-6 flex flex-col gap-2">
        {pergunta.opcoes.map((o, i) => (
          <button
            key={i}
            onClick={() => pick(i)}
            className="flex items-center gap-3 rounded-xl border border-papel-inv/15 bg-papel-inv/5 p-4 text-left text-sm text-papel-inv/90 transition-colors hover:bg-papel-inv/10"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-papel-inv/20 font-mono text-xs text-papel-inv/50">
              {String.fromCharCode(65 + i)}
            </span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>

      {step > 0 && (
        <button
          className="mt-4 font-mono text-[10px] tracking-widest text-papel-inv/50 uppercase"
          onClick={() => setStep(step - 1)}
        >
          ← Voltar
        </button>
      )}
    </div>
  )
}
