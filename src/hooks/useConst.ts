import { useRef } from 'react'
import type { ContextMenuItem } from '@/typings'

/** 会话列表左滑删除露出宽度 */
export const CONVERSATION_DELETE_WIDTH = 72

/** 会话工作区最大高度（对齐 Figma 923） */
export const CHAT_WORKSPACE_MAX_HEIGHT = 923

/** 加号菜单项 */
export const PLUS_MENU_ITEMS: ContextMenuItem[] = [
  { key: 'createGroup', label: '创建群聊' },
  { key: 'addFriend', label: '添加好友' },
]

/** 好友/智能员工右键菜单基础项（置顶文案由调用方覆盖） */
export const FRIEND_MENU_KEYS = {
  pin: 'pin',
  read: 'read',
  close: 'close',
} as const

/** 群聊右键额外菜单 key */
export const GROUP_MENU_KEYS = {
  rename: 'rename',
} as const

/** Composer 占位文案 */
export const COMPOSER_PLACEHOLDER = '输入消息，或@智能员工协助处理任务'

/** 应用级常量结构 */
type AppConst = {
  /** 左滑删除宽度 */
  conversationDeleteWidth: number
  /** 会话工作区最大高度 */
  chatWorkspaceMaxHeight: number
  /** 加号菜单项 */
  plusMenuItems: ContextMenuItem[]
  /** 输入框占位 */
  composerPlaceholder: string
}

/**
 * 返回应用级常量（引用在组件生命周期内保持稳定）。
 * 也可传入 factory，按工厂函数惰性初始化任意常量。
 */
export function useConst(): AppConst
export function useConst<T>(factory: () => T): T
export function useConst<T>(factory?: () => T): T | AppConst {
  /** 稳定引用容器 */
  const ref = useRef<T | AppConst | undefined>(undefined)

  if (ref.current === undefined) {
    ref.current = factory
      ? factory()
      : {
          conversationDeleteWidth: CONVERSATION_DELETE_WIDTH,
          chatWorkspaceMaxHeight: CHAT_WORKSPACE_MAX_HEIGHT,
          plusMenuItems: PLUS_MENU_ITEMS,
          composerPlaceholder: COMPOSER_PLACEHOLDER,
        }
  }

  return ref.current
}

/**
 * 根据会话状态生成右键菜单项
 * @param type 会话类型
 * @param pinned 是否已置顶
 * @param unread 未读数
 */
export function buildConversationMenuItems(
  type: 'friend' | 'group' | 'agent',
  pinned: boolean,
  unread: number,
): ContextMenuItem[] {
  /** 菜单项列表 */
  const items: ContextMenuItem[] = [
    {
      key: FRIEND_MENU_KEYS.pin,
      label: pinned ? '取消置顶' : '置顶',
    },
    {
      key: FRIEND_MENU_KEYS.read,
      label: unread > 0 ? '标为已读' : '标为未读',
    },
  ]

  if (type === 'group') {
    items.push({
      key: GROUP_MENU_KEYS.rename,
      label: '群聊重命名',
    })
  }

  items.push({
    key: FRIEND_MENU_KEYS.close,
    label: '关闭对话',
  })

  return items
}
