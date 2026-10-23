import { gsap } from './setup'

/** 是否应跳过动效 */
function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 菜单 / 弹窗入场：淡入 + 轻微缩放
 * @param el 目标 DOM
 */
export function animateOverlayIn(el: HTMLElement | null) {
  if (!el) return
  if (shouldReduceMotion()) {
    gsap.set(el, { opacity: 1, scale: 1 })
    return
  }
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.96 },
    { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' },
  )
}

/**
 * 消息列表切换淡入
 * @param el 消息列表容器
 */
export function animateMessagesIn(el: HTMLElement | null) {
  if (!el) return
  if (shouldReduceMotion()) {
    gsap.set(el, { opacity: 1, y: 0 })
    return
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
  )
}

/**
 * 会话行置顶/关闭时的轻微位移
 * @param els 行元素集合
 */
export function animateConversationList(els: HTMLElement[]) {
  if (!els.length || shouldReduceMotion()) return
  gsap.fromTo(
    els,
    { opacity: 0.6, y: 6 },
    {
      opacity: 1,
      y: 0,
      duration: 0.22,
      stagger: 0.03,
      ease: 'power2.out',
    },
  )
}
