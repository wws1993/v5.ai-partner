import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import classNames from 'classnames'
import { useConst } from '@/hooks/useConst'
import type { ConversationRowProps } from '@/typings'

function ConversationRow({
  item,
  active,
  onSelect,
  onDelete,
}: ConversationRowProps) {
  const { conversationDeleteWidth } = useConst()
  const [offset, setOffset] = useState(0)
  const startX = useRef(0)
  const startOffset = useRef(0)
  const dragging = useRef(false)

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(min-width: 768px)').matches) return
    dragging.current = true
    startX.current = e.clientX
    startOffset.current = offset
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    const delta = e.clientX - startX.current
    const next = Math.min(
      0,
      Math.max(-conversationDeleteWidth, startOffset.current + delta),
    )
    setOffset(next)
  }

  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    setOffset((prev) =>
      prev < -conversationDeleteWidth / 2 ? -conversationDeleteWidth : 0,
    )
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
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
          offset !== 0 ? 'transition-none' : 'duration-200 transition-[transform,colors]',
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

export function Conversation() {
  const { conversationInitialItems } = useConst()
  const [activeId, setActiveId] = useState('1')
  const [keyword, setKeyword] = useState('')
  const [items, setItems] = useState(conversationInitialItems)

  const filtered = items.filter(
    (item) =>
      !keyword
      || item.name.includes(keyword)
      || item.preview.includes(keyword),
  )

  return (
    <div
      className={classNames([
        'flex h-full w-full flex-col font-sans',
        // mobile：标题/搜索在玻璃容器外
        'gap-3 px-3 pt-2',
        // pc：整体玻璃面板
        'md:w-[280px] md:shrink-0 md:gap-3 md:rounded-3xl md:border md:border-[#f2f5fc]',
        'md:bg-[#eff3fa]/40 md:px-2 md:py-3',
      ])}
    >
      {/* 标题 */}
      <div className="flex h-10 items-center px-2 md:px-2">
        <img
          src="/imgs/workspace/channel.png"
          alt=""
          className="mr-[-10px] size-7 object-contain max-md:hidden"
        />
        <div className="flex items-baseline gap-1 max-md:w-full max-md:justify-center">
          <h1 className="text-xl leading-[23px] text-white md:text-black">
            通讯频道
          </h1>
          <span className="hidden text-base leading-[19px] text-black/40 md:inline">
            消息
          </span>
        </div>
      </div>

      {/* 搜索 + 新建 */}
      <div className="flex items-center gap-3">
        <label
          className={classNames([
            'flex h-10 flex-1 items-center gap-2 border border-[#f7fafc] px-4',
            'bg-[#f6f8fc]/40 md:bg-[#f6f8fc]/60',
            'rounded-3xl md:rounded-xl',
          ])}
        >
          <img src="/imgs/workspace/search.svg" alt="" className="size-4 shrink-0" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索消息"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30"
          />
        </label>
        <button
          type="button"
          aria-label="新建会话"
          className={classNames([
            'flex size-10 shrink-0 items-center justify-center bg-[#28c5e0]',
            'rounded-3xl md:rounded-xl',
          ])}
        >
          <img src="/imgs/workspace/plus.svg" alt="" className="size-6" />
        </button>
      </div>

      {/* 列表 */}
      <div
        className={classNames([
          'min-h-0 flex-1 overflow-y-auto',
          // mobile：玻璃列表容器
          'rounded-3xl border border-[#f2f5fc]/40 bg-[#eff3fa]/40 p-2',
          // pc：已在外层玻璃内，去掉多余边框
          'md:border-0 md:bg-transparent md:p-0 md:flex md:flex-col md:gap-1',
        ])}
      >
        {filtered.map((item) => (
          <ConversationRow
            key={item.id}
            item={item}
            active={activeId === item.id}
            onSelect={() => setActiveId(item.id)}
            onDelete={() => {
              setItems((prev) => prev.filter((i) => i.id !== item.id))
              if (activeId === item.id) {
                setActiveId((id) => {
                  const rest = items.filter((i) => i.id !== item.id)
                  return rest[0]?.id ?? id
                })
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
