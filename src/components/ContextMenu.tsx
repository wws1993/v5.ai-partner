import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { animateOverlayIn } from '@/animations'
import type { ContextMenuItem } from '@/typings'

type ContextMenuProps = {
  /** 水平坐标（fixed 模式） */
  x?: number
  /** 垂直坐标（fixed 模式） */
  y?: number
  /** 菜单项 */
  items: ContextMenuItem[]
  /** 选中某一项 */
  onSelect: (key: string) => void
  /** 关闭菜单 */
  onClose: () => void
  /** 定位模式：fixed 跟随鼠标，inline 由父级绝对定位 */
  variant?: 'fixed' | 'inline'
}

/**
 * 通用右键 / 下拉菜单
 */
export function ContextMenu({
  x = 0,
  y = 0,
  items,
  onSelect,
  onClose,
  variant = 'fixed',
}: ContextMenuProps) {
  /** 面板 DOM 引用 */
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    animateOverlayIn(panelRef.current)
  }, [])

  useEffect(() => {
    /** 点击外部关闭 */
    const onPointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        onClose()
      }
    }
    /** ESC 关闭 */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      ref={panelRef}
      style={variant === 'fixed' ? { left: x, top: y } : undefined}
      className={classNames([
        'z-50 min-w-[160px] overflow-hidden rounded-2xl',
        'bg-white/80 px-4 py-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md',
        variant === 'fixed' ? 'fixed' : 'relative',
      ])}
    >
      {items.map((item, index) => (
        <button
          key={item.key}
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSelect(item.key)
          }}
          className={classNames([
            'flex w-full items-center py-3.5 text-left text-sm text-black',
            'transition-colors hover:text-[#28c5e1]',
            index < items.length - 1 && 'border-b border-black/[0.06]',
            item.danger && 'text-[#f54b47] hover:text-[#f54b47]',
          ])}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
