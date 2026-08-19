import type { QuizQuestion } from '@/types/archetype'

/**
 * Fonte da verdade: arquetypus-prototipo-v6.html (var QZ).
 * Cada resposta pontua DOIS arquétipos, nunca um — garante que o
 * secundário sempre tem lastro e nenhuma pergunta isolada decide o
 * resultado. Nenhuma pergunta menciona nota olfativa (ver v6, "Como o
 * quiz pontua").
 */
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    pergunta: 'Quando você entra num lugar cheio, o que acontece?',
    opcoes: [
      { label: 'As pessoas percebem antes de eu falar', pontos: { afrodite: 2, imperatriz: 1 } },
      { label: 'Eu observo primeiro e escolho onde ficar', pontos: { sereia: 2, cleopatra: 1 } },
      { label: 'Eu vou direto a quem já conheço', pontos: { guerreiro: 2, fada: 1 } },
      { label: 'Eu não penso nisso. Simplesmente estou ali', pontos: { fenix: 2, imperador: 1 } },
    ],
  },
  {
    pergunta: 'O que você quer que digam quando você sai?',
    opcoes: [
      { label: '"Que pessoa impressionante"', pontos: { imperatriz: 2, imperador: 2 } },
      { label: '"Quem era aquela pessoa?"', pontos: { cleopatra: 2, sereia: 2 } },
      { label: '"Fiquei bem perto dela o tempo todo"', pontos: { fada: 2, afrodite: 1 } },
      { label: '"Se ela conseguiu, eu consigo"', pontos: { fenix: 2, guerreiro: 1 } },
    ],
  },
  {
    pergunta: 'Qual dessas frases mais te incomoda?',
    opcoes: [
      { label: '"Você é intensa demais"', pontos: { afrodite: 2, imperatriz: 1 } },
      { label: '"Você é difícil de ler"', pontos: { cleopatra: 2, sereia: 1 } },
      { label: '"Você é sempre a mesma"', pontos: { fenix: 2, zeus: 1 } },
      { label: '"Você é boazinha demais"', pontos: { fada: 2, guerreiro: 1 } },
    ],
  },
  {
    pergunta: 'Como você quer que o seu cheiro se comporte?',
    opcoes: [
      { label: 'Chega antes de mim', pontos: { afrodite: 2, imperatriz: 2 } },
      { label: 'Fica depois que eu saio', pontos: { sereia: 2, cleopatra: 1 } },
      { label: 'Parece que é da minha pele', pontos: { fada: 2, guerreiro: 2 } },
      { label: 'Muda ao longo do dia', pontos: { fenix: 2, imperador: 1 } },
    ],
  },
  {
    pergunta: 'Escolha um horário.',
    opcoes: [
      { label: 'Meia-noite', pontos: { cleopatra: 2, afrodite: 1 } },
      { label: 'Seis da manhã', pontos: { guerreiro: 2, zeus: 2 } },
      { label: 'Fim de tarde', pontos: { fada: 2, sereia: 1 } },
      { label: 'A hora que der', pontos: { fenix: 2, imperador: 1 } },
    ],
  },
]
