import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from 'react'
import classNames from 'classnames'
import { animateConversationList } from '@/animations'
import { ContextMenu } from '@/components/ContextMenu'
import { ConversationRow } from '@/components/ConversationRow'
import { useConst } from '@/hooks/useConst'
import type { ConversationItem } from '@/typings'

type ConversationProps = {
  /** 过滤后的会话列表 */
  items: ConversationItem[]
  /** 当前选中 id */
  activeId: string
  /** 搜索关键词 */
  keyword: string
  /** 更新搜索关键词 */
  onKeywordChange: (value: string) => void
  /** 选中会话 */
  onSelect: (id: string) => void
  /** 关闭会话 */
  onClose: (id: string) => void
  /** 右键菜单 */
  onContextMenu: (
    event: ReactMouseEvent,
    item: ConversationItem,
  ) => void
  /** 加号菜单是否打开 */
  plusMenuOpen: boolean
  /** 切换加号菜单 */
  onTogglePlusMenu: () => void
  /** 加号菜单选择 */
  onPlusAction: (key: string) => void
  /** 关闭加号菜单 */
  onClosePlusMenu: () => void
}

/**
 * 会话列表侧栏：标题、搜索、加号菜单、会话行
 */
export function Conversation({
  items,
  activeId,
  keyword,
  onKeywordChange,
  onSelect,
  onClose,
  onContextMenu,
  plusMenuOpen,
  onTogglePlusMenu,
  onPlusAction,
  onClosePlusMenu,
}: ConversationProps) {
  const { plusMenuItems } = useConst()
  /** 列表容器引用，用于动效 */
  const listRef = useRef<HTMLDivElement>(null)
  /** 加号按钮容器，用于定位菜单 */
  const plusWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    /** 行元素集合 */
    const rows = listRef.current
      ? Array.from(listRef.current.querySelectorAll<HTMLElement>('[data-conv-row]'))
      : []
    animateConversationList(rows)
  }, [items])

  return (
    <div
      className={classNames([
        'relative flex h-full max-h-full w-full flex-col overflow-hidden font-sans',
        'gap-3 px-3 pt-2',
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
      <div className="relative flex items-center gap-3">
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
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="搜索消息"
            className="w-full bg-transparent text-sm text-black outline-none placeholder:text-black/30"
          />
        </label>
        <div ref={plusWrapRef} className="relative shrink-0">
          <button
            type="button"
            aria-label="新建会话"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              onTogglePlusMenu()
            }}
            className={classNames([
              'flex size-10 items-center justify-center bg-[#28c5e0]',
              'rounded-3xl md:rounded-xl',
            ])}
          >
            <img src="/imgs/workspace/plus.svg" alt="" className="size-6" />
          </button>
          {plusMenuOpen ? (
            <div className="absolute right-0 top-12 z-40">
              <ContextMenu
                variant="inline"
                items={plusMenuItems}
                onSelect={onPlusAction}
                onClose={onClosePlusMenu}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* 列表 */}
      <div
        ref={listRef}
        className={classNames([
          'min-h-0 flex-1 overflow-y-auto',
          'rounded-3xl border border-[#f2f5fc]/40 bg-[#eff3fa]/40 p-2',
          'md:flex md:flex-col md:gap-1 md:border-0 md:bg-transparent md:p-0',
        ])}
      >
        {items.map((item) => (
          <div key={item.id} data-conv-row>
            <ConversationRow
              item={item}
              active={activeId === item.id}
              onSelect={() => onSelect(item.id)}
              onDelete={() => onClose(item.id)}
              onContextMenu={(event) => onContextMenu(event, item)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
