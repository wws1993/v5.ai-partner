import type { ConversationItem, ChatMessage, ConversationType } from './conversation'

/** 接口统一响应壳 */
export type ApiResponse<T> = {
  /** 业务状态码，0 表示成功 */
  code: number
  /** 业务数据 */
  data: T
  /** 提示文案 */
  message: string
}

/** 更新会话的补丁字段 */
export type ConversationPatch = {
  /** 是否置顶 */
  pinned?: boolean
  /** 未读数；传 0 为标已读，传正数为标未读 */
  unread?: number
  /** 新名称（群聊重命名） */
  name?: string
  /** 是否关闭会话（移出列表） */
  closed?: boolean
}

/** 发送消息入参 */
export type SendMessagePayload = {
  /** 文本内容 */
  content: string
}

/** 联系人分组 */
export type ContactGroup = {
  /** 分组唯一标识 */
  id: string
  /** 分组名称 */
  name: string
  /** 是否默认展开 */
  expanded?: boolean
  /** 分组成员 */
  members: ContactMember[]
}

/** 联系人成员 */
export type ContactMember = {
  /** 成员唯一标识 */
  id: string
  /** 显示名称 */
  name: string
  /** 头像 */
  avatar: string
  /** 成员类型 */
  type: ConversationType
}

/** 创建群聊入参 */
export type CreateGroupPayload = {
  /** 群聊名称 */
  name: string
  /** 成员 id 列表 */
  memberIds: string[]
}

/** 好友搜索结果 */
export type FriendSearchResult = {
  /** 用户 id */
  id: string
  /** 昵称 */
  name: string
  /** 头像 */
  avatar: string
  /** 组织或简介 */
  org?: string
  /** 副标题 */
  subtitle?: string
}

/** 申请好友入参 */
export type ApplyFriendPayload = {
  /** 目标用户 id */
  userId: string
  /** 申请备注 */
  remark: string
  /** 验证信息 */
  message: string
}

/** 右键/下拉菜单项 */
export type ContextMenuItem = {
  /** 菜单项唯一 key */
  key: string
  /** 展示文案 */
  label: string
  /** 是否危险操作样式 */
  danger?: boolean
}

/** 右键菜单位置 */
export type ContextMenuState = {
  /** 水平坐标 */
  x: number
  /** 垂直坐标 */
  y: number
  /** 目标会话 id */
  conversationId: string
  /** 菜单项列表 */
  items: ContextMenuItem[]
} | null

/** 添加好友弹窗步骤 */
export type AddFriendStep = 'search' | 'result' | 'apply'

/** 弹窗种类 */
export type ChatModalKind = 'createGroup' | 'addFriend' | 'renameGroup' | null

/** Controller 对外暴露的会话状态快照（便于组件 props 类型复用） */
export type ChatStateSnapshot = {
  /** 会话列表 */
  conversations: ConversationItem[]
  /** 当前选中会话 id */
  activeId: string
  /** 当前会话消息 */
  messages: ChatMessage[]
}
