import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import classNames from 'classnames'
import { useConst } from '@/hooks/useConst'

type ChatComposerProps = {
  /** 输入内容 */
  value: string
  /** 内容变更 */
  onChange: (value: string) => void
  /** 发送 */
  onSend: () => void
  /** 是否发送中 */
  sending?: boolean
  /** 是否禁用 */
  disabled?: boolean
}

/**
 * 会话输入区：快捷 chip（仅样式）、文本框、工具与发送
 */
export function ChatComposer({
  value,
  onChange,
  onSend,
  sending,
  disabled,
}: ChatComposerProps) {
  const { composerPlaceholder } = useConst()

  /** 回车发送，Shift+Enter 换行 */
  const onKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <div className="shrink-0 px-3 pb-3 pt-0">
      <div className="mb-3 flex items-center gap-3">
        <button
          type="button"
          className={classNames([
            'h-10 rounded-full bg-[#f6f8fc]/50 px-7 text-sm text-black',
            'transition-opacity hover:opacity-80',
          ])}
        >
          知识库
        </button>
        <button
          type="button"
          className={classNames([
            'h-10 rounded-full bg-[#f6f8fc]/50 px-7 text-sm text-black',
            'transition-opacity hover:opacity-80',
          ])}
        >
          智能员工
        </button>
      </div>

      <div
        className={classNames([
          'rounded-3xl border border-[#f2f5fc] bg-[#eff3fa]/50 p-4',
          disabled && 'pointer-events-none opacity-60',
        ])}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={composerPlaceholder}
          rows={3}
          className={classNames([
            'w-full resize-none bg-transparent text-base leading-[21px] text-black min-[1600px]:text-lg',
            'outline-none placeholder:text-black/35',
            'min-h-[56px] max-h-[120px] min-[1600px]:min-h-[64px]',
          ])}
        />

        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex items-center gap-4 pt-4">
            <button type="button" aria-label="提及" className="size-5">
              <img src="/imgs/workspace/at.svg" alt="" className="size-5" />
            </button>
            <button type="button" aria-label="更多附件" className="size-5">
              <img src="/imgs/workspace/add.svg" alt="" className="size-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="语音"
              className="flex size-9 items-center justify-center rounded-full bg-[#f6f8fc]/50"
            >
              <img src="/imgs/workspace/mic.svg" alt="" className="size-5" />
            </button>
            <button
              type="button"
              onClick={onSend}
              disabled={sending || !value.trim()}
              className={classNames([
                'flex h-9 items-center gap-2 rounded-[22px] bg-[#28c5e1] px-5 text-base text-white',
                'disabled:cursor-not-allowed disabled:opacity-50',
              ])}
            >
              <img src="/imgs/workspace/send.svg" alt="" className="size-5" />
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
