import Mock from 'mockjs'
import type {
  ApplyFriendPayload,
  ChatMessage,
  ContactGroup,
  ConversationItem,
  ConversationPatch,
  CreateGroupPayload,
  SendMessagePayload,
} from '@/typings'
import {
  initialContactGroups,
  initialConversations,
  initialMessagesMap,
  searchableFriends,
} from './data'

/** 深拷贝工具，避免污染初始常量 */
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

/** 内存态会话列表 */
let conversations: ConversationItem[] = clone(initialConversations)

/** 内存态消息表 */
let messagesMap: Record<string, ChatMessage[]> = clone(initialMessagesMap)

/** 内存态联系人分组 */
let contactGroups: ContactGroup[] = clone(initialContactGroups)

/** 消息自增序号 */
let messageSeq = 100

/** 会话自增序号 */
let conversationSeq = 10

/** 包装统一成功响应 */
function ok<T>(data: T) {
  return {
    code: 0,
    data,
    message: 'ok',
  }
}

/** 按置顶优先排序会话列表 */
function sortConversations(list: ConversationItem[]): ConversationItem[] {
  return [...list].sort((a, b) => {
    /** 置顶优先级 */
    const pinDiff = Number(!!b.pinned) - Number(!!a.pinned)
    if (pinDiff !== 0) return pinDiff
    return 0
  })
}

/** 从请求体解析 JSON */
function parseBody<T>(body: unknown): T {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body) as T
    } catch {
      return {} as T
    }
  }
  return (body || {}) as T
}

/** 从 URL 提取会话 id */
function extractConversationId(url: string): string {
  /** 匹配 /api/conversations/:id 或 .../messages */
  const match = url.match(/\/api\/conversations\/([^/?]+)/)
  return match?.[1] ?? ''
}

/** 注册会话相关 Mock 路由 */
export function setupChatMock() {
  /** 获取消息（需先于会话列表注册，避免路径误匹配） */
  Mock.mock(/\/api\/conversations\/[^/?]+\/messages(\?.*)?$/, 'get', (options: {
    url: string
  }) => {
    /** 会话 id */
    const id = extractConversationId(options.url)
    return ok(messagesMap[id] ?? [])
  })

  /** 发送消息 */
  Mock.mock(/\/api\/conversations\/[^/?]+\/messages$/, 'post', (options: {
    url: string
    body: unknown
  }) => {
    /** 会话 id */
    const id = extractConversationId(options.url)
    /** 发送内容 */
    const payload = parseBody<SendMessagePayload>(options.body)
    messageSeq += 1
    /** 新消息 */
    const message: ChatMessage = {
      id: `m${messageSeq}`,
      conversationId: id,
      senderId: 'me',
      senderName: '小飞侠',
      senderAvatar: '/imgs/workspace/avatar-user.png',
      isSelf: true,
      type: 'text',
      content: payload.content,
      time: new Date()
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
        .replace(/\//g, '/'),
    }
    messagesMap[id] = [...(messagesMap[id] ?? []), message]

    /** 同步列表预览 */
    conversations = conversations.map((item) =>
      item.id === id
        ? {
            ...item,
            preview: payload.content,
            time: '刚刚',
            unread: 0,
          }
        : item,
    )

    return ok(message)
  })

  /** 会话列表 */
  Mock.mock(/\/api\/conversations(\?.*)?$/, 'get', () => {
    return ok(sortConversations(conversations))
  })

  /** 更新会话 */
  Mock.mock(/\/api\/conversations\/[^/?]+$/, 'patch', (options: {
    url: string
    body: unknown
  }) => {
    /** 目标会话 id */
    const id = extractConversationId(options.url)
    /** 补丁字段 */
    const patch = parseBody<ConversationPatch>(options.body)
    /** 目标下标 */
    const index = conversations.findIndex((item) => item.id === id)
    if (index < 0) {
      return { code: 404, data: null, message: '会话不存在' }
    }

    if (patch.closed) {
      conversations = conversations.filter((item) => item.id !== id)
      return ok(conversations[0] ?? null)
    }

    /** 合并后的会话 */
    const next: ConversationItem = {
      ...conversations[index],
      ...('pinned' in patch ? { pinned: patch.pinned } : {}),
      ...('unread' in patch ? { unread: patch.unread } : {}),
      ...('name' in patch && patch.name ? { name: patch.name } : {}),
    }
    conversations[index] = next
    conversations = sortConversations(conversations)
    return ok(next)
  })

  /** 联系人分组 */
  Mock.mock(/\/api\/contacts(\?.*)?$/, 'get', () => {
    return ok(contactGroups)
  })

  /** 创建群聊 */
  Mock.mock(/\/api\/groups$/, 'post', (options: { body: unknown }) => {
    /** 入参 */
    const payload = parseBody<CreateGroupPayload>(options.body)
    conversationSeq += 1
    /** 新群会话 */
    const group: ConversationItem = {
      id: String(conversationSeq),
      name: payload.name || '未命名群聊',
      preview: '群聊已创建',
      time: '刚刚',
      avatar: '/imgs/workspace/group.svg',
      type: 'group',
    }
    conversations = sortConversations([group, ...conversations])
    messagesMap[group.id] = []
    return ok(group)
  })

  /** 搜索好友 */
  Mock.mock(/\/api\/friends\/search(\?.*)?$/, 'get', (options: { url: string }) => {
    /** 查询串 */
    const query = options.url.split('?')[1] ?? ''
    /** URL 参数 */
    const params = new URLSearchParams(query)
    /** 关键词 */
    const keyword = (params.get('q') || '').trim()
    if (!keyword) {
      return ok([])
    }
    /** 过滤结果 */
    const results = searchableFriends.filter(
      (item) =>
        item.name.includes(keyword)
        || (item.org ?? '').includes(keyword)
        || (item.subtitle ?? '').includes(keyword),
    )
    return ok(results)
  })

  /** 申请好友 */
  Mock.mock(/\/api\/friends\/apply$/, 'post', (options: { body: unknown }) => {
    /** 申请入参 */
    const payload = parseBody<ApplyFriendPayload>(options.body)
    /** 目标用户 */
    const target = searchableFriends.find((item) => item.id === payload.userId)
    if (target) {
      conversationSeq += 1
      /** 新好友会话 */
      const friend: ConversationItem = {
        id: String(conversationSeq),
        name: target.name,
        preview: payload.message || '好友申请已发送',
        time: '刚刚',
        avatar: target.avatar,
        type: 'friend',
        org: target.org,
      }
      conversations = sortConversations([friend, ...conversations])
      messagesMap[friend.id] = []
    }
    return ok({ success: true })
  })
}
