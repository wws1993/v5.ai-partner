import { ContextMenu } from '@/components/ContextMenu'
import { Conversation } from '@/components/Conversation'
import { ChatPanel } from '@/components/ChatPanel'
import { CreateGroupModal } from '@/components/CreateGroupModal'
import { AddFriendModal } from '@/components/AddFriendModal'
import { RenameGroupModal } from '@/components/RenameGroupModal'
import { useChatController } from '@/hooks/useChatController'
import { useConst } from '@/hooks/useConst'

/**
 * 消息页：会话列表 + 会话面板 + 浮层交互
 */
export function Chat() {
  /** 页面控制器 */
  const chat = useChatController()
  /** 工作区最大高度 */
  const { chatWorkspaceMaxHeight } = useConst()

  return (
    <div
      style={{ maxHeight: chatWorkspaceMaxHeight }}
      className="relative flex h-full min-h-0 w-full max-w-[1200px] items-stretch gap-0 self-center md:gap-3 md:pl-0"
    >
      <Conversation
        items={chat.filteredConversations}
        activeId={chat.activeId}
        keyword={chat.keyword}
        onKeywordChange={chat.setKeyword}
        onSelect={chat.selectConversation}
        onClose={(id) => {
          void chat.closeConversation(id)
        }}
        onContextMenu={chat.openContextMenu}
        plusMenuOpen={chat.plusMenuOpen}
        onTogglePlusMenu={() => {
          chat.setContextMenu(null)
          chat.setPlusMenuOpen(!chat.plusMenuOpen)
        }}
        onPlusAction={chat.handlePlusAction}
        onClosePlusMenu={() => chat.setPlusMenuOpen(false)}
      />

      <div className="hidden h-full min-h-0 min-w-0 flex-1 md:flex md:min-w-[520px]">
        <ChatPanel
          conversation={chat.activeConversation}
          messages={chat.messages}
          messagesLoading={chat.messagesLoading}
          draft={chat.draft}
          onDraftChange={chat.setDraft}
          onSend={() => {
            void chat.sendMessage()
          }}
          sending={chat.sending}
        />
      </div>

      {chat.contextMenu ? (
        <ContextMenu
          x={chat.contextMenu.x}
          y={chat.contextMenu.y}
          items={chat.contextMenu.items}
          onSelect={(key) => {
            void chat.handleContextAction(key)
          }}
          onClose={() => chat.setContextMenu(null)}
        />
      ) : null}

      {chat.modal === 'createGroup' ? (
        <CreateGroupModal
          groups={chat.contactGroups}
          selectedIds={chat.selectedMemberIds}
          selectedMembers={chat.selectedMembers}
          groupName={chat.groupName}
          onGroupNameChange={chat.setGroupName}
          onToggleGroup={chat.toggleContactGroup}
          onToggleMember={chat.toggleMember}
          onRemoveMember={chat.removeMember}
          onSubmit={() => {
            void chat.submitCreateGroup()
          }}
          onClose={chat.closeModal}
        />
      ) : null}

      {chat.modal === 'addFriend' ? (
        <AddFriendModal
          step={chat.addFriendStep}
          keyword={chat.friendKeyword}
          onKeywordChange={chat.setFriendKeyword}
          onSearch={() => {
            void chat.searchFriends()
          }}
          results={chat.friendResults}
          selected={chat.selectedFriend}
          onPick={chat.goApplyFriend}
          remark={chat.friendRemark}
          onRemarkChange={chat.setFriendRemark}
          message={chat.friendMessage}
          onMessageChange={chat.setFriendMessage}
          onSubmit={() => {
            void chat.submitApplyFriend()
          }}
          onClose={chat.closeModal}
          onBack={() => chat.setAddFriendStep('result')}
        />
      ) : null}

      {chat.modal === 'renameGroup' ? (
        <RenameGroupModal
          value={chat.renameValue}
          onChange={chat.setRenameValue}
          onSubmit={() => {
            void chat.submitRename()
          }}
          onClose={chat.closeModal}
        />
      ) : null}
    </div>
  )
}
