import { useRef } from 'react'
import { useGSAP, staggerReveal } from '@/animations'
import SplitText from '@/reactbits/components/SplitText'

export function Demo() {
  const root = useRef<HTMLUListElement>(null)

  useGSAP(() => {
    staggerReveal('[data-anim="stagger"]', { each: 1.51, from: 'start' })
  }, { scope: root })

  return (
    <ul ref={root}>
      <li data-anim="stagger"><SplitText text="A" /></li>
      <li data-anim="stagger"><SplitText text="B" /></li>
      <li data-anim="stagger"><SplitText text="C" /></li>
    </ul>
  )
}