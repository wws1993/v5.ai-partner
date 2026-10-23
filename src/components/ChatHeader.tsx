import type { ConversationItem } from '@/typings'

type ChatHeaderProps = {
  /** 当前会话，空则展示占位 */
  conversation: ConversationItem | null
}

/**
 * 会话面板顶部：头像、名称、组织、更多按钮
 */
export function ChatHeader({ conversation }: ChatHeaderProps) {
  if (!conversation) {
    return (
      <div className="flex h-[88px] items-center border-b border-[#d5dce2] px-6">
        <span className="text-sm text-black/40">请选择会话</span>
      </div>
    )
  }

  return (
    <div className="flex h-[88px] items-center justify-between border-b border-[#d5dce2] px-4 min-[1400px]:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={conversation.avatar}
          alt=""
          className="size-10 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium leading-[19px] text-black">
            {conversation.name}
          </h2>
          {conversation.org ? (
            <div className="mt-1.5 flex items-center gap-1">
              <img
                src="/imgs/workspace/org.svg"
                alt=""
                className="size-3 shrink-0"
              />
              <span className="text-xs leading-[14px] text-black/70">
                {conversation.org}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        aria-label="更多"
        className="flex size-5 shrink-0 items-center justify-center"
      >
        <img src="/imgs/workspace/more.svg" alt="" className="size-5" />
      </button>
    </div>
  )
}
