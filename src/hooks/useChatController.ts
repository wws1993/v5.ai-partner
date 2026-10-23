import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { apiMap } from '@/api/api-map'
import { buildConversationMenuItems } from '@/hooks/useConst'
import type {
  AddFriendStep,
  ApplyFriendPayload,
  ChatMessage,
  ChatModalKind,
  ContactGroup,
  ContactMember,
  ContextMenuState,
  ConversationItem,
  CreateGroupPayload,
  FriendSearchResult,
} from '@/typings'

/**
 * 会话页控制器：列表、消息、菜单与弹窗状态及接口调用
 */
export function useChatController() {
  /** 会话列表 */
  const [conversations, setConversations] = useState<ConversationItem[]>([])
  /** 当前选中会话 id */
  const [activeId, setActiveId] = useState('')
  /** 当前消息列表 */
  const [messages, setMessages] = useState<ChatMessage[]>([])
  /** 列表搜索关键词 */
  const [keyword, setKeyword] = useState('')
  /** 列表加载中 */
  const [listLoading, setListLoading] = useState(false)
  /** 消息加载中 */
  const [messagesLoading, setMessagesLoading] = useState(false)
  /** 发送中 */
  const [sending, setSending] = useState(false)
  /** 输入框内容 */
  const [draft, setDraft] = useState('')
  /** 加号菜单是否打开 */
  const [plusMenuOpen, setPlusMenuOpen] = useState(false)
  /** 右键菜单状态 */
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  /** 当前弹窗类型 */
  const [modal, setModal] = useState<ChatModalKind>(null)
  /** 创建群聊联系人 */
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([])
  /** 创建群聊已选成员 id */
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  /** 创建群聊名称 */
  const [groupName, setGroupName] = useState('')
  /** 添加好友步骤 */
  const [addFriendStep, setAddFriendStep] = useState<AddFriendStep>('search')
  /** 添加好友搜索词 */
  const [friendKeyword, setFriendKeyword] = useState('')
  /** 好友搜索结果 */
  const [friendResults, setFriendResults] = useState<FriendSearchResult[]>([])
  /** 当前选中的好友结果 */
  const [selectedFriend, setSelectedFriend] = useState<FriendSearchResult | null>(
    null,
  )
  /** 好友申请备注 */
  const [friendRemark, setFriendRemark] = useState('')
  /** 好友申请验证信息 */
  const [friendMessage, setFriendMessage] = useState('你好，我想加你为好友')
  /** 重命名输入 */
  const [renameValue, setRenameValue] = useState('')
  /** 待重命名会话 id */
  const [renameTargetId, setRenameTargetId] = useState('')

  /** 当前选中会话对象 */
  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [conversations, activeId],
  )

  /** 过滤后的会话列表 */
  const filteredConversations = useMemo(() => {
    if (!keyword) return conversations
    return conversations.filter(
      (item) =>
        item.name.includes(keyword) || item.preview.includes(keyword),
    )
  }, [conversations, keyword])

  /** 创建群聊已选成员详情 */
  const selectedMembers = useMemo(() => {
    /** 扁平成员表 */
    const all: ContactMember[] = contactGroups.flatMap((g) => g.members)
    return selectedMemberIds
      .map((id) => all.find((m) => m.id === id))
      .filter((m): m is ContactMember => !!m)
  }, [contactGroups, selectedMemberIds])

  /** 拉取会话列表 */
  const loadConversations = useCallback(async (preferId?: string) => {
    setListLoading(true)
    try {
      /** 接口返回列表 */
      const list = await apiMap.getConversations()
      setConversations(list)
      setActiveId((prev) => {
        if (preferId && list.some((item) => item.id === preferId)) {
          return preferId
        }
        if (prev && list.some((item) => item.id === prev)) return prev
        return list[0]?.id ?? ''
      })
    } finally {
      setListLoading(false)
    }
  }, [])

  /** 拉取指定会话消息 */
  const loadMessages = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setMessagesLoading(true)
    try {
      /** 消息列表 */
      const list = await apiMap.getMessages(conversationId)
      setMessages(list)
    } finally {
      setMessagesLoading(false)
    }
  }, [])

  /** 首次加载列表 */
  useEffect(() => {
    void loadConversations()
  }, [loadConversations])

  /** 选中会话变化时加载消息 */
  useEffect(() => {
    if (!activeId) return
    void loadMessages(activeId)
    setDraft('')
  }, [activeId, loadMessages])

  /** 选中会话并清除未读 */
  const selectConversation = useCallback((id: string) => {
    setActiveId(id)
    setPlusMenuOpen(false)
    setContextMenu(null)
    setConversations((prev) => {
      /** 是否需要同步已读到服务端 */
      const needClear = (prev.find((item) => item.id === id)?.unread ?? 0) > 0
      if (needClear) {
        void apiMap.patchConversation(id, { unread: 0 }).catch(() => undefined)
      }
      return prev.map((item) =>
        item.id === id && (item.unread ?? 0) > 0
          ? { ...item, unread: 0 }
          : item,
      )
    })
  }, [])

  /** 发送文本消息 */
  const sendMessage = useCallback(async () => {
    /** 去除首尾空白后的内容 */
    const content = draft.trim()
    if (!content || !activeId || sending) return
    setSending(true)
    try {
      /** 新消息 */
      const message = await apiMap.sendMessage(activeId, { content })
      setMessages((prev) => [...prev, message])
      setDraft('')
      await loadConversations(activeId)
    } finally {
      setSending(false)
    }
  }, [activeId, draft, loadConversations, sending])

  /** 关闭会话（列表移除） */
  const closeConversation = useCallback(
    async (id: string) => {
      await apiMap.patchConversation(id, { closed: true })
      /** 关闭后优先选中的相邻会话 */
      const index = conversations.findIndex((item) => item.id === id)
      const next =
        conversations[index + 1]?.id
        ?? conversations[index - 1]?.id
        ?? ''
      await loadConversations(next)
      if (activeId === id) {
        setActiveId(next)
      }
      setContextMenu(null)
    },
    [activeId, conversations, loadConversations],
  )

  /** 切换置顶 */
  const togglePin = useCallback(
    async (id: string) => {
      /** 目标会话 */
      const target = conversations.find((item) => item.id === id)
      if (!target) return
      await apiMap.patchConversation(id, { pinned: !target.pinned })
      await loadConversations(activeId)
      setContextMenu(null)
    },
    [activeId, conversations, loadConversations],
  )

  /** 切换已读/未读 */
  const toggleRead = useCallback(
    async (id: string) => {
      /** 目标会话 */
      const target = conversations.find((item) => item.id === id)
      if (!target) return
      /** 下一未读值 */
      const nextUnread = (target.unread ?? 0) > 0 ? 0 : 1
      await apiMap.patchConversation(id, { unread: nextUnread })
      await loadConversations(activeId)
      setContextMenu(null)
    },
    [activeId, conversations, loadConversations],
  )

  /** 打开右键菜单 */
  const openContextMenu = useCallback(
    (event: ReactMouseEvent, item: ConversationItem) => {
      event.preventDefault()
      event.stopPropagation()
      setPlusMenuOpen(false)
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        conversationId: item.id,
        items: buildConversationMenuItems(
          item.type,
          !!item.pinned,
          item.unread ?? 0,
        ),
      })
    },
    [],
  )

  /** 处理右键菜单点击 */
  const handleContextAction = useCallback(
    async (key: string) => {
      if (!contextMenu) return
      /** 目标 id */
      const id = contextMenu.conversationId
      if (key === 'pin') {
        await togglePin(id)
        return
      }
      if (key === 'read') {
        await toggleRead(id)
        return
      }
      if (key === 'close') {
        await closeConversation(id)
        return
      }
      if (key === 'rename') {
        /** 待重命名会话 */
        const target = conversations.find((item) => item.id === id)
        setRenameTargetId(id)
        setRenameValue(target?.name ?? '')
        setModal('renameGroup')
        setContextMenu(null)
      }
    },
    [closeConversation, contextMenu, conversations, togglePin, toggleRead],
  )

  /** 打开创建群聊弹窗 */
  const openCreateGroup = useCallback(async () => {
    setPlusMenuOpen(false)
    setSelectedMemberIds([])
    setGroupName('')
    /** 联系人分组 */
    const groups = await apiMap.getContacts()
    setContactGroups(groups)
    setModal('createGroup')
  }, [])

  /** 切换联系人分组展开 */
  const toggleContactGroup = useCallback((groupId: string) => {
    setContactGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, expanded: !group.expanded }
          : group,
      ),
    )
  }, [])

  /** 切换成员选中 */
  const toggleMember = useCallback((memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    )
  }, [])

  /** 移除已选成员 */
  const removeMember = useCallback((memberId: string) => {
    setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId))
  }, [])

  /** 提交创建群聊 */
  const submitCreateGroup = useCallback(async () => {
    if (!selectedMemberIds.length) return
    /** 创建入参 */
    const payload: CreateGroupPayload = {
      name: groupName.trim() || '未命名群聊',
      memberIds: selectedMemberIds,
    }
    /** 新群会话 */
    const group = await apiMap.createGroup(payload)
    setModal(null)
    await loadConversations(group.id)
    setActiveId(group.id)
  }, [groupName, loadConversations, selectedMemberIds])

  /** 打开添加好友弹窗 */
  const openAddFriend = useCallback(() => {
    setPlusMenuOpen(false)
    setAddFriendStep('search')
    setFriendKeyword('')
    setFriendResults([])
    setSelectedFriend(null)
    setFriendRemark('')
    setFriendMessage('你好，我想加你为好友')
    setModal('addFriend')
  }, [])

  /** 搜索好友 */
  const searchFriends = useCallback(async (value?: string) => {
    /** 关键词 */
    const q = (value ?? friendKeyword).trim()
    setFriendKeyword(q)
    if (!q) {
      setFriendResults([])
      setAddFriendStep('search')
      return
    }
    /** 搜索结果 */
    const results = await apiMap.searchFriends(q)
    setFriendResults(results)
    setAddFriendStep(results.length ? 'result' : 'search')
  }, [friendKeyword])

  /** 进入申请好友步骤 */
  const goApplyFriend = useCallback((friend: FriendSearchResult) => {
    setSelectedFriend(friend)
    setFriendRemark(friend.name)
    setAddFriendStep('apply')
  }, [])

  /** 提交好友申请 */
  const submitApplyFriend = useCallback(async () => {
    if (!selectedFriend) return
    /** 申请入参 */
    const payload: ApplyFriendPayload = {
      userId: selectedFriend.id,
      remark: friendRemark.trim() || selectedFriend.name,
      message: friendMessage.trim(),
    }
    await apiMap.applyFriend(payload)
    setModal(null)
    await loadConversations()
  }, [friendMessage, friendRemark, loadConversations, selectedFriend])

  /** 提交群聊重命名 */
  const submitRename = useCallback(async () => {
    if (!renameTargetId || !renameValue.trim()) return
    await apiMap.patchConversation(renameTargetId, {
      name: renameValue.trim(),
    })
    setModal(null)
    await loadConversations(activeId)
  }, [activeId, loadConversations, renameTargetId, renameValue])

  /** 关闭弹窗 */
  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  /** 关闭所有浮层 */
  const closeOverlays = useCallback(() => {
    setPlusMenuOpen(false)
    setContextMenu(null)
  }, [])

  /** 加号菜单选择 */
  const handlePlusAction = useCallback(
    (key: string) => {
      if (key === 'createGroup') {
        void openCreateGroup()
        return
      }
      if (key === 'addFriend') {
        openAddFriend()
      }
    },
    [openAddFriend, openCreateGroup],
  )

  return {
    conversations,
    filteredConversations,
    activeId,
    activeConversation,
    messages,
    listLoading,
    messagesLoading,
    sending,
    keyword,
    setKeyword,
    draft,
    setDraft,
    plusMenuOpen,
    setPlusMenuOpen,
    contextMenu,
    setContextMenu,
    modal,
    contactGroups,
    selectedMemberIds,
    selectedMembers,
    groupName,
    setGroupName,
    addFriendStep,
    setAddFriendStep,
    friendKeyword,
    setFriendKeyword,
    friendResults,
    selectedFriend,
    friendRemark,
    setFriendRemark,
    friendMessage,
    setFriendMessage,
    renameValue,
    setRenameValue,
    selectConversation,
    sendMessage,
    closeConversation,
    openContextMenu,
    handleContextAction,
    handlePlusAction,
    toggleContactGroup,
    toggleMember,
    removeMember,
    submitCreateGroup,
    searchFriends,
    goApplyFriend,
    submitApplyFriend,
    submitRename,
    closeModal,
    closeOverlays,
  }
}
