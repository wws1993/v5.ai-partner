import type {
  ChatMessage,
  ContactGroup,
  ConversationItem,
  FriendSearchResult,
} from '@/typings'

/** 初始会话列表（内存态可变） */
export const initialConversations: ConversationItem[] = [
  {
    id: '1',
    name: '销售智能员工',
    preview: '好的，收到！',
    time: '10:30',
    avatar: '/imgs/workspace/avatar-sales.png',
    type: 'agent',
    org: '元气科技',
  },
  {
    id: '2',
    name: '产品设计组',
    preview: '好的，收到！',
    time: '10:28',
    avatar: '/imgs/workspace/group.svg',
    type: 'group',
    pinned: true,
  },
  {
    id: '3',
    name: '张瑞',
    preview: '这个我们需要评估一下',
    time: '10:30',
    avatar: '/imgs/workspace/avatar-zhang.png',
    type: 'friend',
    unread: 3,
  },
  {
    id: '4',
    name: '周为',
    preview: '好的，没问题',
    time: '昨天',
    avatar: '/imgs/workspace/avatar-zhou.png',
    type: 'friend',
  },
]

/** 各会话初始消息 */
export const initialMessagesMap: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'me',
      senderName: '小飞侠',
      senderAvatar: '/imgs/workspace/avatar-user.png',
      isSelf: true,
      type: 'text',
      content: '总结一下今天有限跟进客户',
      time: '2026/10/24 20:13',
      dateLabel: '7/24',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: '1',
      senderName: '销售智能员工',
      senderAvatar: '/imgs/workspace/avatar-sales.png',
      isSelf: false,
      type: 'text',
      content:
        '依托 CRM 客户数据与标准销售 SOP 流程，梳理客户跟进优先级，今日工作安排如下：\nA 客户已到合同确认阶段，今日优先电话回访跟进，推进签约落地；\nB 客户预算信息清晰明确，即刻整理并发送正式报价单，推进商务对接；',
      time: '2026/10/24 20:13',
      tokenCost: '消耗Token：¥0.18',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'me',
      senderName: '小飞侠',
      senderAvatar: '/imgs/workspace/avatar-user.png',
      isSelf: true,
      type: 'text',
      content: '这个内容删掉吧，就不展示了',
      time: '2026/10/24 20:13',
    },
    {
      id: 'm4',
      conversationId: '1',
      senderId: 'me',
      senderName: '小飞侠',
      senderAvatar: '/imgs/workspace/avatar-user.png',
      isSelf: true,
      type: 'voice',
      content: '',
      time: '2026/10/24 20:13',
      voiceDuration: 12,
    },
  ],
  '2': [
    {
      id: 'm5',
      conversationId: '2',
      senderId: '3',
      senderName: '张瑞',
      senderAvatar: '/imgs/workspace/avatar-zhang.png',
      isSelf: false,
      type: 'text',
      content: '设计稿今晚可以评审吗？',
      time: '2026/10/24 10:20',
      dateLabel: '10/24',
    },
    {
      id: 'm6',
      conversationId: '2',
      senderId: 'me',
      senderName: '小飞侠',
      senderAvatar: '/imgs/workspace/avatar-user.png',
      isSelf: true,
      type: 'text',
      content: '好的，收到！',
      time: '2026/10/24 10:28',
    },
  ],
  '3': [
    {
      id: 'm7',
      conversationId: '3',
      senderId: '3',
      senderName: '张瑞',
      senderAvatar: '/imgs/workspace/avatar-zhang.png',
      isSelf: false,
      type: 'text',
      content: '这个我们需要评估一下',
      time: '2026/10/24 10:30',
      dateLabel: '10/24',
    },
  ],
  '4': [
    {
      id: 'm8',
      conversationId: '4',
      senderId: '4',
      senderName: '周为',
      senderAvatar: '/imgs/workspace/avatar-zhou.png',
      isSelf: false,
      type: 'text',
      content: '好的，没问题',
      time: '2026/10/23 18:00',
      dateLabel: '10/23',
    },
  ],
}

/** 创建群聊可用联系人分组 */
export const initialContactGroups: ContactGroup[] = [
  {
    id: 'new',
    name: '新朋友',
    expanded: false,
    members: [],
  },
  {
    id: 'agent',
    name: '智能员工',
    expanded: true,
    members: [
      {
        id: 'c1',
        name: '销售智能员工',
        avatar: '/imgs/workspace/avatar-sales.png',
        type: 'agent',
      },
    ],
  },
  {
    id: 'company',
    name: '公司成员',
    expanded: true,
    members: [
      {
        id: 'c3',
        name: '张瑞',
        avatar: '/imgs/workspace/avatar-zhang.png',
        type: 'friend',
      },
      {
        id: 'c4',
        name: '周为',
        avatar: '/imgs/workspace/avatar-zhou.png',
        type: 'friend',
      },
    ],
  },
  {
    id: 'joined',
    name: '参与群聊',
    expanded: false,
    members: [],
  },
  {
    id: 'external',
    name: '外部用户',
    expanded: false,
    members: [],
  },
  {
    id: 'creator',
    name: '创作者好友',
    expanded: false,
    members: [],
  },
  {
    id: 'employer',
    name: '雇主好友',
    expanded: false,
    members: [],
  },
]

/** 可搜索的好友池 */
export const searchableFriends: FriendSearchResult[] = [
  {
    id: 'f1',
    name: '李明',
    avatar: '/imgs/company/member-li.png',
    org: '元气科技',
    subtitle: '产品经理',
  },
  {
    id: 'f2',
    name: '王芳',
    avatar: '/imgs/company/member-zhang.png',
    org: '元气科技',
    subtitle: '设计师',
  },
  {
    id: 'f3',
    name: '陈浩',
    avatar: '/imgs/company/member-zhou.png',
    org: '外部合作',
    subtitle: '商务顾问',
  },
]
