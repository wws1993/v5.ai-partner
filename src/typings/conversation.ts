import type { MouseEvent as ReactMouseEvent } from 'react'

/** 会话类型：好友 / 群聊 / 智能员工 */
export type ConversationType = 'friend' | 'group' | 'agent'

/** 会话列表单项 */
export type ConversationItem = {
  /** 会话唯一标识 */
  id: string
  /** 显示名称 */
  name: string
  /** 最近消息预览 */
  preview: string
  /** 最近消息时间文案 */
  time: string
  /** 头像地址 */
  avatar: string
  /** 会话类型 */
  type: ConversationType
  /** 未读条数，0 或不存在表示已读 */
  unread?: number
  /** 是否置顶 */
  pinned?: boolean
  /** 所属组织名称 */
  org?: string
}

/** 会话行组件入参 */
export type ConversationRowProps = {
  /** 会话数据 */
  item: ConversationItem
  /** 是否选中 */
  active: boolean
  /** 点击选中 */
  onSelect: () => void
  /** 关闭/删除会话 */
  onDelete: () => void
  /** 右键菜单 */
  onContextMenu: (event: ReactMouseEvent) => void
}

/** 消息类型：文本 / 语音 */
export type MessageType = 'text' | 'voice'

/** 会话内单条消息 */
export type ChatMessage = {
  /** 消息唯一标识 */
  id: string
  /** 所属会话 id */
  conversationId: string
  /** 发送者 id */
  senderId: string
  /** 发送者名称 */
  senderName: string
  /** 发送者头像 */
  senderAvatar: string
  /** 是否为当前用户发送 */
  isSelf: boolean
  /** 消息类型 */
  type: MessageType
  /** 文本内容或语音占位文案 */
  content: string
  /** 发送时间展示文案 */
  time: string
  /** 日期分隔文案，如 7/24 */
  dateLabel?: string
  /** Token 消耗文案（智能员工回复） */
  tokenCost?: string
  /** 语音时长（秒） */
  voiceDuration?: number
}
