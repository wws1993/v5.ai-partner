// src/animations/staggerReveal.ts
import { gsap } from './setup'

type StaggerFrom = 'start' | 'center' | 'end' | 'edges' | 'random'

export function staggerReveal(
  selector = '[data-anim="stagger"]',
  opts?: {
    y?: number
    each?: number
    from?: StaggerFrom
  },
) {
  const { y = 20, each = 0.08, from = 'start' } = opts ?? {}

  return gsap.from(selector, {
    opacity: 0,
    y,
    stagger: { each, from },
  })
}