import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import TextField from '@material-ui/core/TextField'
import { Clear, Delete, Edit, Save, Send } from '@material-ui/icons'
import { useChatState } from '@xrengine/client-core/src/social/reducers/chat/ChatState'
import { ChatService } from '@xrengine/client-core/src/social/reducers/chat/ChatService'
import { useAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'
import { Message } from '@xrengine/common/src/interfaces/Message'
import { User } from '@xrengine/common/src/interfaces/User'
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styles from './Bottom.module.scss'
import { ChatAction } from '@xrengine/client-core/src/social/reducers/chat/ChatActions'

interface Props {
  bottomDrawerOpen: boolean
  setBottomDrawerOpen: any
  setLeftDrawerOpen: any
}

const BottomDrawer = (props: Props): any => {
  const { bottomDrawerOpen, setBottomDrawerOpen, setLeftDrawerOpen } = props

  const dispatch = useDispatch()
  const messageRef = React.useRef()
  const messageEl = messageRef.current
  const user = useAuthState().user
  const chatState = useChatState()
  const channelState = chatState.channels
  const channels = channelState.channels
  const targetObject = chatState.targetObject
  const targetObjectType = chatState.targetObjectType
  const targetChannelId = chatState.targetChannelId
  const messageScrollInit = chatState.messageScrollInit
  const [messageScrollUpdate, setMessageScrollUpdate] = useState(false)
  const [topMessage, setTopMessage] = useState({})
  const [messageCrudSelected, setMessageCrudSelected] = useState('')
  const [messageDeletePending, setMessageDeletePending] = useState('')
  const [messageUpdatePending, setMessageUpdatePending] = useState('')
  const [editingMessage, setEditingMessage] = useState('')
  const [composingMessage, setComposingMessage] = useState('')
  const activeChannel = channels[targetChannelId.value]

  useEffect(() => {
    if (messageScrollInit.value === true && messageEl != null && (messageEl as any).scrollTop != null) {
      ;(messageEl as any).scrollTop = (messageEl as any).scrollHeight
      dispatch(ChatService.updateMessageScrollInit(false))
      setMessageScrollUpdate(false)
    }
    if (messageScrollUpdate === true) {
      setMessageScrollUpdate(false)
      if (messageEl != null && (messageEl as any).scrollTop != null) {
        ;(messageEl as any).scrollTop = (topMessage as any).offsetTop
      }
    }
  }, [chatState.messageScrollInit])

  useEffect(() => {
    if (channelState.updateNeeded.value === true) {
      dispatch(ChatService.getChannels())
    }
  }, [channelState.updateNeeded.value])

  useEffect(() => {
    Object.entries(channels.value).forEach(([key, channel]) => {
      if (chatState.updateMessageScroll.value === true) {
        dispatch(ChatAction.setUpdateMessageScroll(false))
        if (
          channel.id === targetChannelId &&
          messageEl != null &&
          (messageEl as any).scrollHeight -
            (messageEl as any).scrollTop -
            (messageEl as any).firstElementChild?.offsetHeight <=
            (messageEl as any).clientHeight + 20
        ) {
          ;(messageEl as any).scrollTop = (messageEl as any).scrollHeight
        }
      }
      if (channel.updateNeeded === true) {
        dispatch(ChatService.getChannelMessages(channel.id))
      }
    })
  }, [channels.value])

  const openLeftDrawer = (e: any): void => {
    setBottomDrawerOpen(false)
    setLeftDrawerOpen(true)
  }

  const handleComposingMessageChange = (event: any): void => {
    const message = event.target.value
    setComposingMessage(message)
  }

  const handleEditingMessageChange = (event: any): void => {
    const message = event.target.value
    setEditingMessage(message)
  }

  const packageMessage = (event: any): void => {
    if (composingMessage.length > 0) {
      dispatch(
        ChatService.createMessage({
          targetObjectId: targetObject.id.value,
          targetObjectType: targetObjectType,
          text: composingMessage
        })
      )
      setComposingMessage('')
    }
  }

  const setActiveChat = (channel): void => {
    dispatch(ChatService.updateMessageScrollInit(true))
    const channelType = channel.channelType
    const target =
      channelType === 'user'
        ? channel.user1?.id === user.id.value
          ? channel.user2
          : channel.user2?.id === user.id.value
          ? channel.user1
          : {}
        : channelType === 'group'
        ? channel.group
        : channelType === 'instance'
        ? channel.instance
        : channel.party
    dispatch(ChatService.updateChatTarget(channelType, target)) //, channel.id))
    setMessageDeletePending('')
    setMessageUpdatePending('')
    setEditingMessage('')
    setComposingMessage('')
  }

  const onChannelScroll = (e): void => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      nextChannelPage()
    }
  }

  const onMessageScroll = (e): void => {
    if (
      e.target.scrollTop === 0 &&
      e.target.scrollHeight > e.target.clientHeight &&
      messageScrollInit.value !== true &&
      activeChannel.skip + activeChannel.limit < activeChannel.total
    ) {
      setMessageScrollUpdate(true)
      setTopMessage((messageEl as any).firstElementChild)
      nextMessagePage()
    }
  }

  const nextChannelPage = (): void => {
    if (channelState.skip.value + channelState.limit.value < channelState.total.value) {
      dispatch(ChatService.getChannels(channelState.skip.value + channelState.limit.value))
    }
  }

  const nextMessagePage = (): void => {
    if (activeChannel.skip + activeChannel.limit < activeChannel.total) {
      dispatch(ChatService.getChannelMessages(targetChannelId.value, activeChannel.skip + activeChannel.limit))
    } else {
      setMessageScrollUpdate(false)
    }
  }

  const generateMessageSecondary = (message: Message): string => {
    const date = moment(message.createdAt).format('MMM D YYYY, h:mm a')
    if (message.senderId !== user.id.value) {
      return `${message?.sender?.name ? message.sender.name : 'A former user'} on ${date}`
    } else {
      return date
    }
  }

  const loadMessageEdit = (e: any, message: Message) => {
    e.preventDefault()
    setMessageUpdatePending(message.id)
    setEditingMessage(message.text)
    setMessageDeletePending('')
  }

  const showMessageDeleteConfirm = (e: any, message: Message) => {
    e.preventDefault()
    setMessageDeletePending(message.id)
    setMessageUpdatePending('')
  }

  const cancelMessageDelete = (e: any) => {
    e.preventDefault()
    setMessageDeletePending('')
  }

  const confirmMessageDelete = (e: any, message: Message) => {
    e.preventDefault()
    setMessageDeletePending('')
    dispatch(ChatService.removeMessage(message.id)) //, message.channelId))
  }

  const cancelMessageUpdate = (e: any) => {
    e.preventDefault()
    setMessageUpdatePending('')
    setEditingMessage('')
  }

  const confirmMessageUpdate = (e: any, message: Message) => {
    e.preventDefault()
    dispatch(ChatService.patchMessage(message.id, editingMessage))
    setMessageUpdatePending('')
    setEditingMessage('')
  }

  const toggleMessageCrudSelect = (e: any, message: Message) => {
    e.preventDefault()
    if (message.senderId === user.id.value) {
      if (messageCrudSelected === message.id && messageUpdatePending !== message.id) {
        setMessageCrudSelected('')
      } else {
        setMessageCrudSelected(message.id)
      }
    }
  }

  return (
    <div>
      <SwipeableDrawer
        className={styles['flex-column']}
        anchor="bottom"
        open={bottomDrawerOpen === true}
        onClose={() => {
          setBottomDrawerOpen(false)
        }}
        onOpen={() => {}}
      >
        <div className={styles['bottom-container']}>
          <List onScroll={(e) => onChannelScroll(e)} className={styles['chat-container']}>
            {channels &&
              channels.value.size > 0 &&
              Array.from(channels.value)
                .sort(
                  ([channelId1, channel1], [channelId2, channel2]) =>
                    new Date(channel2.updatedAt).getTime() - new Date(channel1.updatedAt).getTime()
                )
                .map(([channelId, channel], index) => {
                  return (
                    <ListItem
                      key={channelId}
                      className={styles.selectable}
                      onClick={() => setActiveChat(channel)}
                      selected={channelId === targetChannelId}
                      divider={index < channels.value.size - 1}
                    >
                      {channel.channelType === 'user' && (
                        <ListItemAvatar>
                          <Avatar
                            src={channel.userId1 === user.id.value ? channel.user2.avatarUrl : channel.user1.avatarUrl}
                          />
                        </ListItemAvatar>
                      )}
                      <ListItemText
                        primary={
                          channel.channelType === 'user'
                            ? channel.user1?.id === user.id.value
                              ? channel.user2.name
                              : channel.user2?.id === user.id.value
                              ? channel.user1.name
                              : ''
                            : channel.channelType === 'group'
                            ? channel.group.name
                            : channel.channelType === 'instance'
                            ? 'Current layer'
                            : 'Current party'
                        }
                      />
                    </ListItem>
                  )
                })}
            {channels == null ||
              (channels.value.size === 0 && (
                <ListItem key="no-chats" disabled>
                  <ListItemText primary="No active chats" />
                </ListItem>
              ))}
          </List>
          <div className={styles['list-container']}>
            <List ref={messageRef as any} onScroll={(e) => onMessageScroll(e)} className={styles['message-container']}>
              {activeChannel != null &&
                activeChannel.messages &&
                activeChannel.messages
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((message) => {
                    return (
                      <ListItem
                        className={classNames({
                          [styles.message]: true,
                          [styles.self]: message.senderId === user.id.value,
                          [styles.other]: message.senderId !== user.id.value
                        })}
                        key={message.id}
                        onMouseEnter={(e) => toggleMessageCrudSelect(e, message)}
                        onMouseLeave={(e) => toggleMessageCrudSelect(e, message)}
                        onTouchEnd={(e) => toggleMessageCrudSelect(e, message)}
                      >
                        <div>
                          {message.senderId !== user.id.value && (
                            <ListItemAvatar>
                              <Avatar src={message.sender?.avatarUrl} />
                            </ListItemAvatar>
                          )}
                          {messageUpdatePending !== message.id && (
                            <ListItemText primary={message.text} secondary={generateMessageSecondary(message)} />
                          )}
                          {message.senderId === user.id.value && messageUpdatePending !== message.id && (
                            <div>
                              {messageDeletePending !== message.id && messageCrudSelected === message.id && (
                                <div className={styles['crud-controls']}>
                                  {messageDeletePending !== message.id && (
                                    <Edit
                                      className={styles.edit}
                                      onClick={(e) => loadMessageEdit(e, message)}
                                      onTouchEnd={(e) => loadMessageEdit(e, message)}
                                    />
                                  )}
                                  {messageDeletePending !== message.id && (
                                    <Delete
                                      className={styles.delete}
                                      onClick={(e) => showMessageDeleteConfirm(e, message)}
                                      onTouchEnd={(e) => showMessageDeleteConfirm(e, message)}
                                    />
                                  )}
                                </div>
                              )}
                              {messageDeletePending === message.id && (
                                <div className={styles['crud-controls']}>
                                  {messageDeletePending === message.id && (
                                    <Delete
                                      className={styles.delete}
                                      onClick={(e) => confirmMessageDelete(e, message)}
                                      onTouchEnd={(e) => confirmMessageDelete(e, message)}
                                    />
                                  )}
                                  {messageDeletePending === message.id && (
                                    <Clear
                                      className={styles.cancel}
                                      onClick={(e) => cancelMessageDelete(e)}
                                      onTouchEnd={(e) => cancelMessageDelete(e)}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {messageUpdatePending === message.id && (
                            <div className={styles['message-edit']}>
                              <TextField
                                variant="outlined"
                                margin="normal"
                                multiline
                                fullWidth
                                id="editingMessage"
                                label="Message text"
                                name="editingMessage"
                                autoFocus
                                value={editingMessage}
                                inputProps={{
                                  maxLength: 1000
                                }}
                                onChange={handleEditingMessageChange}
                              />
                              <div className={styles['editing-controls']}>
                                <Clear
                                  className={styles.cancel}
                                  onClick={(e) => cancelMessageUpdate(e)}
                                  onTouchEnd={(e) => cancelMessageUpdate(e)}
                                />
                                <Save
                                  className={styles.save}
                                  onClick={(e) => confirmMessageUpdate(e, message)}
                                  onTouchEnd={(e) => confirmMessageUpdate(e, message)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </ListItem>
                    )
                  })}
              {targetChannelId.value.length === 0 && targetObject.value.id != null && (
                <div className={styles['first-message-placeholder']}>
                  <div>{targetChannelId.value}</div>
                  Start a chat with{' '}
                  {targetObjectType.value === 'user' || targetObjectType.value === 'group'
                    ? targetObject.name.value
                    : targetObjectType.value === 'instance'
                    ? 'your current layer'
                    : 'your current party'}
                </div>
              )}
            </List>
            {targetObject != null && targetObject.value.id != null && (
              <div className={styles['flex-center']}>
                <div className={styles['chat-box']}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    multiline
                    fullWidth
                    id="newMessage"
                    label="Message text"
                    name="newMessage"
                    autoFocus
                    value={composingMessage}
                    inputProps={{
                      maxLength: 1000
                    }}
                    onChange={handleComposingMessageChange}
                  />
                  <Button variant="contained" color="primary" startIcon={<Send />} onClick={packageMessage}>
                    Send
                  </Button>
                </div>
              </div>
            )}
            {(targetObject == null || targetObject.value.id == null) && (
              <div className={styles['no-chat']}>
                <div>Start a chat with a friend or group from the left drawer</div>
                <Button variant="contained" color="primary" onClick={openLeftDrawer}>
                  Open Drawer
                </Button>
              </div>
            )}
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  )
}

export default BottomDrawer
