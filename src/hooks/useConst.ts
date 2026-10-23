import { useRef } from 'react'
import type { ConversationItem } from '@/typings'

/** 会话列表左滑删除露出宽度 */
export const CONVERSATION_DELETE_WIDTH = 72

/** 会话列表初始 mock 数据 */
export const CONVERSATION_INITIAL_ITEMS: ConversationItem[] = [
  {
    id: '1',
    name: '销售智能员工',
    preview: '好的，收到！',
    time: '10:30',
    avatar: '/imgs/workspace/avatar-sales.png',
  },
  {
    id: '2',
    name: '产品设计组',
    preview: '好的，收到！',
    time: '10:28',
    avatar: '/imgs/workspace/group.svg',
  },
  {
    id: '3',
    name: '张瑞',
    preview: '这个我们需要评估一下',
    time: '10:30',
    avatar: '/imgs/workspace/avatar-zhang.png',
    unread: 3,
  },
  {
    id: '4',
    name: '周为',
    preview: '好的，没问题',
    time: '昨天',
    avatar: '/imgs/workspace/avatar-zhou.png',
  },
]

type AppConst = {
  conversationDeleteWidth: number
  conversationInitialItems: ConversationItem[]
}

/**
 * 返回应用级常量（引用在组件生命周期内保持稳定）。
 * 也可传入 factory，按工厂函数惰性初始化任意常量。
 */
export function useConst(): AppConst
export function useConst<T>(factory: () => T): T
export function useConst<T>(factory?: () => T): T | AppConst {
  const ref = useRef<T | AppConst | undefined>(undefined)

  if (ref.current === undefined) {
    ref.current = factory
      ? factory()
      : {
          conversationDeleteWidth: CONVERSATION_DELETE_WIDTH,
          conversationInitialItems: CONVERSATION_INITIAL_ITEMS,
        }
  }

  return ref.current
}
