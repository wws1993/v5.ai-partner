import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { animateOverlayIn } from '@/animations'
import type { AddFriendStep, FriendSearchResult } from '@/typings'

type AddFriendModalProps = {
  /** 当前步骤 */
  step: AddFriendStep
  /** 搜索关键词 */
  keyword: string
  /** 关键词变更 */
  onKeywordChange: (value: string) => void
  /** 触发搜索 */
  onSearch: () => void
  /** 搜索结果 */
  results: FriendSearchResult[]
  /** 选中好友 */
  selected: FriendSearchResult | null
  /** 进入申请步骤 */
  onPick: (friend: FriendSearchResult) => void
  /** 备注 */
  remark: string
  /** 备注变更 */
  onRemarkChange: (value: string) => void
  /** 验证信息 */
  message: string
  /** 验证信息变更 */
  onMessageChange: (value: string) => void
  /** 提交申请 */
  onSubmit: () => void
  /** 关闭 */
  onClose: () => void
  /** 返回上一步 */
  onBack: () => void
}

/**
 * 添加好友弹窗：搜索空态 → 结果 → 申请表单
 */
export function AddFriendModal({
  step,
  keyword,
  onKeywordChange,
  onSearch,
  results,
  selected,
  onPick,
  remark,
  onRemarkChange,
  message,
  onMessageChange,
  onSubmit,
  onClose,
  onBack,
}: AddFriendModalProps) {
  /** 面板引用 */
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    animateOverlayIn(panelRef.current)
  }, [step])

  /** 标题文案 */
  const title = step === 'apply' ? '申请好友' : '添加好友'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div
        ref={panelRef}
        className={classNames([
          'flex w-full max-w-[400px] flex-col',
          'rounded-2xl bg-[#eff3fa] px-8 py-6',
          step === 'apply' ? 'min-h-[642px]' : 'min-h-[420px]',
        ])}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl leading-[23px] text-[#2f2924]">{title}</h3>
          <button type="button" aria-label="关闭" onClick={onClose}>
            <img src="/imgs/workspace/close.svg" alt="" className="size-6" />
          </button>
        </div>

        <div className="mt-8 flex min-h-0 flex-1 flex-col">
          {step !== 'apply' ? (
            <>
              <label className="flex h-10 items-center gap-2 rounded-2xl border border-[#f7fafc] bg-white px-4">
                <img
                  src="/imgs/workspace/search.svg"
                  alt=""
                  className="size-4 shrink-0"
                />
                <input
                  value={keyword}
                  onChange={(e) => onKeywordChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch()
                  }}
                  placeholder="搜索用户昵称 / 组织"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-black/30"
                />
                <button
                  type="button"
                  onClick={onSearch}
                  className="shrink-0 text-sm text-[#28c5e1]"
                >
                  搜索
                </button>
              </label>

              {step === 'search' ? (
                <p className="mt-16 text-center text-sm text-black/40">
                  输入关键词搜索好友
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {results.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => onPick(friend)}
                      className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left transition-colors hover:bg-[#d9f9ff]"
                    >
                      <img
                        src={friend.avatar}
                        alt=""
                        className="size-12 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base text-black">
                          {friend.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-black/50">
                          {[friend.org, friend.subtitle]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : selected ? (
            <>
              <div className="flex items-center gap-3">
                <img
                  src={selected.avatar}
                  alt=""
                  className="size-14 rounded-full object-cover"
                />
                <div>
                  <p className="text-base text-black">{selected.name}</p>
                  <p className="mt-1 text-xs text-black/50">
                    {selected.org}
                  </p>
                </div>
              </div>

              <label className="mt-8 block">
                <span className="mb-2 block text-sm text-black/60">备注名</span>
                <input
                  value={remark}
                  onChange={(e) => onRemarkChange(e.target.value)}
                  className="h-12 w-full rounded-2xl bg-white px-4 text-sm outline-none"
                />
              </label>

              <label className="mt-6 block">
                <span className="mb-2 block text-sm text-black/60">验证信息</span>
                <textarea
                  value={message}
                  onChange={(e) => onMessageChange(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm outline-none"
                />
              </label>

              <div className="mt-auto flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={onBack}
                  className="h-12 flex-1 rounded-full bg-white text-base text-black"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={onSubmit}
                  className="h-12 flex-1 rounded-full bg-[#28c5e1] text-base text-white"
                >
                  发送
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
