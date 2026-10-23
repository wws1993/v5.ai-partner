import classNames from 'classnames'
import type { ChatMessage } from '@/typings'

type MessageBubbleProps = {
  /** 消息数据 */
  message: ChatMessage
}

/**
 * 单条消息气泡：文本 / 语音，左右布局
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  /** 是否己方消息 */
  const isSelf = message.isSelf

  return (
    <div
      className={classNames([
        'flex w-full gap-3',
        isSelf ? 'flex-row-reverse' : 'flex-row',
      ])}
    >
      <div className="shrink-0 pt-1">
        <img
          src={message.senderAvatar}
          alt=""
          className="size-9 rounded-full object-cover"
        />
      </div>

      <div
        className={classNames([
          'flex min-w-0 max-w-[78%] flex-col gap-1.5 min-[1400px]:max-w-[70%] min-[1600px]:max-w-[60%]',
          isSelf ? 'items-end' : 'items-start',
        ])}
      >
        <span className="text-xs leading-[14px] text-black/80">
          {message.senderName} {message.time}
        </span>

        {message.type === 'voice' ? (
          <div
            className={classNames([
              'flex items-center gap-3 rounded-[22px] px-5 py-3.5',
              isSelf ? 'bg-[#28c5e1] text-white' : 'bg-white/60 text-black',
            ])}
          >
            {/* 简易波形 */}
            <div className="flex h-8 items-end gap-[2px]">
              {Array.from({ length: 24 }).map((_, index) => (
                <span
                  key={index}
                  className={classNames([
                    'w-[1.5px] rounded-full',
                    isSelf ? 'bg-white' : 'bg-black/50',
                  ])}
                  style={{
                    height: `${4 + ((index * 7) % 12)}px`,
                  }}
                />
              ))}
            </div>
            <span className="text-base leading-[22px]">
              {message.voiceDuration ?? 0}″
            </span>
          </div>
        ) : (
          <div
            className={classNames([
              'rounded-[22px] px-5 py-3.5 text-base leading-[19px] whitespace-pre-wrap',
              isSelf
                ? 'rounded-tr-md bg-[#28c5e1] text-white'
                : 'rounded-tl-md bg-white/60 text-black',
            ])}
          >
            {message.content}
            {message.tokenCost ? (
              <p
                className={classNames([
                  'mt-2 text-xs leading-[14px]',
                  isSelf ? 'text-white/80' : 'text-black/60',
                ])}
              >
                {message.tokenCost}
              </p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
