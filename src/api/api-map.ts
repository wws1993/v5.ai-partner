import request from './request'
import type {
  ApplyFriendPayload,
  ChatMessage,
  ContactGroup,
  ConversationItem,
  ConversationPatch,
  CreateGroupPayload,
  FriendSearchResult,
  SendMessagePayload,
} from '@/typings'

/** 接口分发：会话 / 消息 / 好友 / 群聊 */
export const apiMap = {
  /** 获取会话列表 */
  getConversations: () =>
    request.get<never, ConversationItem[]>('/api/conversations'),

  /** 更新会话（置顶、已读、重命名、关闭） */
  patchConversation: (id: string, patch: ConversationPatch) =>
    request.patch<never, ConversationItem>(`/api/conversations/${id}`, patch),

  /** 获取会话消息 */
  getMessages: (conversationId: string) =>
    request.get<never, ChatMessage[]>(
      `/api/conversations/${conversationId}/messages`,
    ),

  /** 发送文本消息 */
  sendMessage: (conversationId: string, payload: SendMessagePayload) =>
    request.post<never, ChatMessage>(
      `/api/conversations/${conversationId}/messages`,
      payload,
    ),

  /** 获取创建群聊联系人分组 */
  getContacts: () => request.get<never, ContactGroup[]>('/api/contacts'),

  /** 创建群聊 */
  createGroup: (payload: CreateGroupPayload) =>
    request.post<never, ConversationItem>('/api/groups', payload),

  /** 搜索好友 */
  searchFriends: (keyword: string) =>
    request.get<never, FriendSearchResult[]>('/api/friends/search', {
      params: { q: keyword },
    }),

  /** 申请好友 */
  applyFriend: (payload: ApplyFriendPayload) =>
    request.post<never, { success: boolean }>('/api/friends/apply', payload),
}

export default apiMap
