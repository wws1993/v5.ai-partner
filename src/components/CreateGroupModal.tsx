import { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { animateOverlayIn } from '@/animations'
import type { ContactGroup, ContactMember } from '@/typings'

type CreateGroupModalProps = {
  /** 联系人分组 */
  groups: ContactGroup[]
  /** 已选成员 id */
  selectedIds: string[]
  /** 已选成员详情 */
  selectedMembers: ContactMember[]
  /** 群名称 */
  groupName: string
  /** 群名称变更 */
  onGroupNameChange: (value: string) => void
  /** 切换分组展开 */
  onToggleGroup: (groupId: string) => void
  /** 切换成员选中 */
  onToggleMember: (memberId: string) => void
  /** 移除已选 */
  onRemoveMember: (memberId: string) => void
  /** 完成 */
  onSubmit: () => void
  /** 取消 */
  onClose: () => void
}

/**
 * 创建群聊弹窗：左侧选人，右侧命名与已选列表
 */
export function CreateGroupModal({
  groups,
  selectedIds,
  selectedMembers,
  groupName,
  onGroupNameChange,
  onToggleGroup,
  onToggleMember,
  onRemoveMember,
  onSubmit,
  onClose,
}: CreateGroupModalProps) {
  /** 面板引用 */
  const panelRef = useRef<HTMLDivElement>(null)
  /** 左侧搜索关键词 */
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    animateOverlayIn(panelRef.current)
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <div
        ref={panelRef}
        className={classNames([
          'flex max-h-[90vh] w-full max-w-[800px] flex-col overflow-hidden',
          'rounded-2xl bg-[#eff3fa] px-8 py-6',
        ])}
      >
        <h3 className="text-xl leading-[23px] text-[#2f2924]">创建群聊</h3>

        <div className="mt-6 flex min-h-0 flex-1 gap-8 overflow-hidden">
          {/* 左侧联系人 */}
          <div className="flex w-full max-w-[336px] flex-col">
            <label className="flex h-10 items-center gap-2 rounded-2xl border border-[#f7fafc] bg-white px-4">
              <img
                src="/imgs/workspace/search.svg"
                alt=""
                className="size-4 shrink-0"
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索好友"
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/30"
              />
            </label>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              {groups.map((group) => {
                /** 过滤后的成员 */
                const members = group.members.filter(
                  (member) =>
                    !keyword || member.name.includes(keyword),
                )
                if (keyword && members.length === 0 && group.members.length > 0) {
                  return null
                }
                return (
                  <div key={group.id} className="mb-1">
                    <button
                      type="button"
                      onClick={() => onToggleGroup(group.id)}
                      className="flex w-full items-center gap-2 rounded-xl px-2 py-3 text-left"
                    >
                      <img
                        src="/imgs/workspace/kb-chevron-right.svg"
                        alt=""
                        className={classNames([
                          'size-5 transition-transform',
                          group.expanded && 'rotate-90',
                        ])}
                      />
                      <span className="text-sm text-black">{group.name}</span>
                    </button>
                    {group.expanded
                      ? members.map((member) => {
                          /** 是否已选 */
                          const checked = selectedIds.includes(member.id)
                          return (
                            <button
                              key={member.id}
                              type="button"
                              onClick={() => onToggleMember(member.id)}
                              className={classNames([
                                'mb-1 flex w-full items-center gap-2 rounded-xl px-2 py-3',
                                checked ? 'bg-[#d9f9ff]' : 'hover:bg-white/50',
                              ])}
                            >
                              <span
                                className={classNames([
                                  'flex size-5 items-center justify-center rounded-full border',
                                  checked
                                    ? 'border-[#28c5e1] bg-[#28c5e1]'
                                    : 'border-[#b3b3b3] bg-transparent',
                                ])}
                              >
                                {checked ? (
                                  <span className="block size-1.5 rounded-sm bg-white" />
                                ) : null}
                              </span>
                              <img
                                src={member.avatar}
                                alt=""
                                className="size-9 rounded-full object-cover"
                              />
                              <span className="truncate text-sm text-black">
                                {member.name}
                              </span>
                            </button>
                          )
                        })
                      : null}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="hidden w-px self-stretch bg-[#e0dfdf] md:block" />

          {/* 右侧已选 */}
          <div className="flex min-w-0 flex-1 flex-col">
            <input
              value={groupName}
              onChange={(e) => onGroupNameChange(e.target.value)}
              placeholder="群聊名称"
              className={classNames([
                'h-10 w-full rounded-2xl bg-white/80 px-4 text-sm text-black',
                'outline-none placeholder:text-black/40',
              ])}
            />

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
              {selectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="mb-1 flex items-center gap-2 rounded-xl bg-[#d9f9ff] px-2 py-3"
                >
                  <img
                    src={member.avatar}
                    alt=""
                    className="size-9 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-sm text-black">
                    {member.name}
                  </span>
                  <button
                    type="button"
                    aria-label="移除"
                    onClick={() => onRemoveMember(member.id)}
                    className="size-5 shrink-0"
                  >
                    <img
                      src="/imgs/workspace/close.svg"
                      alt=""
                      className="size-5 opacity-50"
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-4">
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
                disabled={!selectedIds.length}
                className="h-12 flex-1 rounded-full bg-[#28c5e1] text-base text-white disabled:opacity-50"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
