import { useEffect, useMemo, useRef } from 'react'
import { animateMessagesIn } from '@/animations'
import { MessageBubble } from '@/components/MessageBubble'
import type { ChatMessage } from '@/typings'

type MessageListProps = {
  /** 消息列表 */
  messages: ChatMessage[]
  /** 是否加载中 */
  loading?: boolean
  /** 用于切换会话时重播入场动效 */
  conversationId: string
}

/**
 * 消息列表：日期分隔 + 气泡，自动滚到底
 */
export function MessageList({
  messages,
  loading,
  conversationId,
}: MessageListProps) {
  /** 滚动容器 */
  const scrollerRef = useRef<HTMLDivElement>(null)
  /** 动效容器 */
  const contentRef = useRef<HTMLDivElement>(null)

  /** 按日期分组后的渲染结构 */
  const sections = useMemo(() => {
    /** 分组结果 */
    const result: { label: string; items: ChatMessage[] }[] = []
    /** 当前分组标签 */
    let currentLabel = ''
    for (const message of messages) {
      if (message.dateLabel && message.dateLabel !== currentLabel) {
        currentLabel = message.dateLabel
        result.push({ label: currentLabel, items: [message] })
      } else if (result.length === 0) {
        result.push({ label: '', items: [message] })
      } else {
        result[result.length - 1].items.push(message)
      }
    }
    return result
  }, [messages])

  useEffect(() => {
    animateMessagesIn(contentRef.current)
  }, [conversationId])

  useEffect(() => {
    /** 滚动到底部 */
    const el = scrollerRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 min-[1400px]:px-6">
      {loading ? (
        <p className="py-8 text-center text-sm text-black/40">加载中…</p>
      ) : null}
      <div ref={contentRef} className="flex flex-col gap-4">
        {sections.map((section, sectionIndex) => (
          <div key={`${section.label}-${sectionIndex}`} className="flex flex-col gap-4">
            {section.label ? (
              <p className="text-center text-base text-black/70">{section.label}</p>
            ) : null}
            {section.items.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ))}
        {!loading && messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-black/40">暂无消息</p>
        ) : null}
      </div>
    </div>
  )
}
