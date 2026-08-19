import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export interface CartItem {
  /** archetypeId + variante, ex. "sereia-200ml" */
  key: string
  archetypeId: string
  label: string
  variant: string
  unitPrice: number
  qty: number
}

interface CartContextValue {
  items: CartItem[]
  subtotal: number
  count: number
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  removeItem: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  function addItem(item: Omit<CartItem, 'qty'>, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.key === item.key)
      if (existing) {
        return prev.map((i) => (i.key === item.key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { ...item, qty }]
    })
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function clear() {
    setItems([])
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0), [items])
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, subtotal, count, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart precisa estar dentro de CartProvider')
  return ctx
}
