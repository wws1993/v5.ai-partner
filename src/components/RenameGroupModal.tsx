import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { animateOverlayIn } from '@/animations'

type RenameGroupModalProps = {
  /** 当前名称 */
  value: string
  /** 名称变更 */
  onChange: (value: string) => void
  /** 提交 */
  onSubmit: () => void
  /** 取消 */
  onClose: () => void
}

/**
 * 群聊重命名弹窗
 */
export function RenameGroupModal({
  value,
  onChange,
  onSubmit,
  onClose,
}: RenameGroupModalProps) {
  /** 面板引用 */
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    animateOverlayIn(panelRef.current)
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div
        ref={panelRef}
        className={classNames([
          'w-full max-w-[400px] rounded-2xl bg-[#eff3fa] px-8 py-6',
        ])}
      >
        <h3 className="text-xl leading-[23px] text-[#2f2924]">群聊重命名</h3>

        <div className="mt-8">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="请输入群聊名称"
            className="h-[52px] w-full rounded-2xl bg-white px-4 text-sm outline-none"
            autoFocus
          />
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-12 flex-1 rounded-full bg-white text-base text-black"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim()}
            className="h-12 flex-1 rounded-full bg-[#28c5e1] text-base text-white disabled:opacity-50"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  )
}
