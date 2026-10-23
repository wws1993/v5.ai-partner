import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import classNames from 'classnames'
import { useConst } from '@/hooks/useConst'
import type { ConversationRowProps } from '@/typings'

/**
 * 会话列表单行：支持选中、右键、移动端左滑删除
 */
export function ConversationRow({
  item,
  active,
  onSelect,
  onDelete,
  onContextMenu,
}: ConversationRowProps) {
  const { conversationDeleteWidth } = useConst()
  /** 左滑偏移量 */
  const [offset, setOffset] = useState(0)
  /** 指针起始 X */
  const startX = useRef(0)
  /** 开始拖动时的偏移 */
  const startOffset = useRef(0)
  /** 是否正在拖动 */
  const dragging = useRef(false)

  /** 按下开始左滑（仅移动端） */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(min-width: 768px)').matches) return
    dragging.current = true
    startX.current = e.clientX
    startOffset.current = offset
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  /** 拖动更新偏移 */
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    /** 位移增量 */
    const delta = e.clientX - startX.current
    /** 限制后的偏移 */
    const next = Math.min(
      0,
      Math.max(-conversationDeleteWidth, startOffset.current + delta),
    )
    setOffset(next)
  }

  /** 松手吸附 */
  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    setOffset((prev) =>
      prev < -conversationDeleteWidth / 2 ? -conversationDeleteWidth : 0,
    )
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      onContextMenu={onContextMenu}
    >
      {/* 移动端左滑删除 */}
      <button
        type="button"
        onClick={onDelete}
        style={{ width: conversationDeleteWidth }}
        className="absolute inset-y-0 right-0 flex items-center justify-center bg-[#f54b47] text-sm text-white md:hidden"
      >
        删除
      </button>

      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (offset !== 0) {
            setOffset(0)
            return
          }
          onSelect()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onSelect()
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ transform: `translateX(${offset}px)` }}
        className={classNames([
          'relative flex w-full cursor-pointer items-center rounded-xl touch-pan-y',
          'gap-[9px] px-2 py-3 md:py-4',
          active
            ? 'bg-[#d9f9ff]'
            : classNames([
                'bg-transparent md:hover:bg-white/20',
                offset !== 0 && 'bg-[#eff3fa]',
              ]),
          offset !== 0
            ? 'transition-none'
            : 'duration-200 transition-[transform,colors]',
          item.pinned && !active && 'bg-white/10',
        ])}
      >
        <div className="relative shrink-0">
          <img
            src={item.avatar}
            alt=""
            className="size-12 rounded-full object-cover md:size-9"
          />
          {item.unread ? (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#f54b47] text-[10px] leading-none text-white">
              {item.unread}
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="truncate text-base font-medium leading-[19px] text-black">
              {item.name}
            </span>
            <span className="shrink-0 text-xs leading-[14px] text-black/40">
              {item.time}
            </span>
          </div>
          <p className="mt-1.5 truncate text-sm leading-4 text-black/40 md:mt-[6px]">
            {item.preview}
          </p>
        </div>
      </div>
    </div>
  )
}
