import classNames from 'classnames'
import { ChatComposer } from '@/components/ChatComposer'
import { ChatHeader } from '@/components/ChatHeader'
import { MessageList } from '@/components/MessageList'
import type { ChatMessage, ConversationItem } from '@/typings'

type ChatPanelProps = {
  /** 当前会话 */
  conversation: ConversationItem | null
  /** 消息列表 */
  messages: ChatMessage[]
  /** 消息加载中 */
  messagesLoading?: boolean
  /** 输入草稿 */
  draft: string
  /** 草稿变更 */
  onDraftChange: (value: string) => void
  /** 发送 */
  onSend: () => void
  /** 发送中 */
  sending?: boolean
}

/**
 * 会话面板：头部 + 消息区 + 输入区
 */
export function ChatPanel({
  conversation,
  messages,
  messagesLoading,
  draft,
  onDraftChange,
  onSend,
  sending,
}: ChatPanelProps) {
  return (
    <div
      className={classNames([
        'flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
        'rounded-3xl border border-[#f2f5fc] bg-[#eff3fa]/40',
      ])}
    >
      <ChatHeader conversation={conversation} />
      <MessageList
        messages={messages}
        loading={messagesLoading}
        conversationId={conversation?.id ?? ''}
      />
      <ChatComposer
        value={draft}
        onChange={onDraftChange}
        onSend={onSend}
        sending={sending}
        disabled={!conversation}
      />
    </div>
  )
}
