import type { RefObject } from 'react'
import { gsap } from './setup'

export function fadeIn(
  scope: RefObject<HTMLElement | null>,
  selector = '[data-anim="fade"]',
) {
  return gsap.from(selector, {
    opacity: 0,
    y: 16,
    stagger: 0.08,
    // 选择器会由 useGSAP 的 scope 限定
  })
}