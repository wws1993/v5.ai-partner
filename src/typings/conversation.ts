export type ConversationItem = {
  id: string
  name: string
  preview: string
  time: string
  avatar: string
  unread?: number
}

export type ConversationRowProps = {
  item: ConversationItem
  active: boolean
  onSelect: () => void
  onDelete: () => void
}
