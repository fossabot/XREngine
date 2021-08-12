import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {
  Add,
  Call,
  CallEnd,
  Clear,
  Close,
  Delete,
  Edit,
  ExpandMore,
  Grain,
  Group,
  GroupAdd,
  GroupWork,
  Mic,
  PeopleOutline,
  Person,
  Public,
  Save,
  Send,
  Settings,
  ThreeDRotation,
  Videocam
} from '@material-ui/icons'
import { selectChatState } from '@xrengine/client-core/src/social/reducers/chat/selector'
import {
  createMessage,
  getChannelMessages,
  getChannels,
  patchMessage,
  removeMessage,
  updateChatTarget,
  updateMessageScrollInit
} from '@xrengine/client-core/src/social/reducers/chat/service'
import { selectFriendState } from '@xrengine/client-core/src/social/reducers/friend/selector'
import { getFriends, unfriend } from '@xrengine/client-core/src/social/reducers/friend/service'
import { selectGroupState } from '@xrengine/client-core/src/social/reducers/group/selector'
import {
  createGroup,
  getGroups,
  patchGroup,
  removeGroup,
  removeGroupUser
} from '@xrengine/client-core/src/social/reducers/group/service'
import { updateInviteTarget } from '@xrengine/client-core/src/social/reducers/invite/service'
import { selectLocationState } from '@xrengine/client-core/src/social/reducers/location/selector'
import { banUserFromLocation } from '@xrengine/client-core/src/social/reducers/location/service'
import { selectPartyState } from '@xrengine/client-core/src/social/reducers/party/selector'
import {
  createParty,
  getParty,
  removeParty,
  removePartyUser,
  transferPartyOwner
} from '@xrengine/client-core/src/social/reducers/party/service'
import ProfileMenu from '@xrengine/client-core/src/user/components/UserMenu/menus/ProfileMenu'
import { selectAuthState } from '@xrengine/client-core/src/user/reducers/auth/selector'
import { doLoginAuto } from '@xrengine/client-core/src/user/reducers/auth/service'
import { useUserState } from '@xrengine/client-core/src/user/store/UserState'
import { UserService } from '@xrengine/client-core/src/user/store/UserService'
import PartyParticipantWindow from '../../components/PartyParticipantWindow'
import { selectChannelConnectionState } from '../../reducers/channelConnection/selector'
import {
  connectToChannelServer,
  provisionChannelServer,
  resetChannelServer
} from '../../reducers/channelConnection/service'
import { Group as GroupType } from '@xrengine/common/src/interfaces/Group'
import { Message } from '@xrengine/common/src/interfaces/Message'
import { User } from '@xrengine/common/src/interfaces/User'
import { EngineEvents } from '@xrengine/engine/src/ecs/classes/EngineEvents'
import { initializeEngine, shutdownEngine } from '@xrengine/engine/src/initializeEngine'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { NetworkSchema } from '@xrengine/engine/src/networking/interfaces/NetworkSchema'
import { MediaStreams } from '@xrengine/engine/src/networking/systems/MediaStreamSystem'
import classNames from 'classnames'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { selectMediastreamState } from '../../reducers/mediastream/selector'
import { updateCamAudioState, updateCamVideoState } from '../../reducers/mediastream/service'
import { selectTransportState } from '../../reducers/transport/selector'
import { changeChannelTypeState, updateChannelTypeState } from '../../reducers/transport/service'
import {
  configureMediaTransports,
  createCamAudioProducer,
  createCamVideoProducer,
  endVideoChat,
  leave,
  pauseProducer,
  resumeProducer
} from '../../transports/SocketWebRTCClientFunctions'
import { SocketWebRTCClientTransport } from '../../transports/SocketWebRTCClientTransport'
import styles from './style.module.scss'
import WarningRefreshModal from '../AlertModals/WarningRetryModal'
import { InitializeOptions } from '@xrengine/engine/src/initializationOptions'
import { Downgraded } from '@hookstate/core'

const engineRendererCanvasId = 'engine-renderer-canvas'

const mapStateToProps = (state: any): any => {
  return {
    authState: selectAuthState(state),
    chatState: selectChatState(state),
    channelConnectionState: selectChannelConnectionState(state),
    friendState: selectFriendState(state),
    groupState: selectGroupState(state),
    locationState: selectLocationState(state),
    partyState: selectPartyState(state),
    transportState: selectTransportState(state),
    mediastream: selectMediastreamState(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  doLoginAuto: bindActionCreators(doLoginAuto, dispatch),
  getChannels: bindActionCreators(getChannels, dispatch),
  getChannelMessages: bindActionCreators(getChannelMessages, dispatch),
  createMessage: bindActionCreators(createMessage, dispatch),
  removeMessage: bindActionCreators(removeMessage, dispatch),
  updateChatTarget: bindActionCreators(updateChatTarget, dispatch),
  provisionChannelServer: bindActionCreators(provisionChannelServer, dispatch),
  connectToChannelServer: bindActionCreators(connectToChannelServer, dispatch),
  resetChannelServer: bindActionCreators(resetChannelServer, dispatch),
  patchMessage: bindActionCreators(patchMessage, dispatch),
  updateMessageScrollInit: bindActionCreators(updateMessageScrollInit, dispatch),
  getFriends: bindActionCreators(getFriends, dispatch),
  unfriend: bindActionCreators(unfriend, dispatch),
  getGroups: bindActionCreators(getGroups, dispatch),
  createGroup: bindActionCreators(createGroup, dispatch),
  patchGroup: bindActionCreators(patchGroup, dispatch),
  removeGroup: bindActionCreators(removeGroup, dispatch),
  removeGroupUser: bindActionCreators(removeGroupUser, dispatch),
  getParty: bindActionCreators(getParty, dispatch),
  createParty: bindActionCreators(createParty, dispatch),
  removeParty: bindActionCreators(removeParty, dispatch),
  removePartyUser: bindActionCreators(removePartyUser, dispatch),
  transferPartyOwner: bindActionCreators(transferPartyOwner, dispatch),
  updateInviteTarget: bindActionCreators(updateInviteTarget, dispatch),
  banUserFromLocation: bindActionCreators(banUserFromLocation, dispatch),
  changeChannelTypeState: bindActionCreators(changeChannelTypeState, dispatch)
})

interface Props {
  authState?: any
  doLoginAuto?: typeof doLoginAuto
  setLeftDrawerOpen: any
  setRightDrawerOpen: any
  chatState?: any
  channelConnectionState?: any
  getChannels?: any
  getChannelMessages?: any
  createMessage?: any
  removeMessage?: any
  updateChatTarget?: any
  patchMessage?: any
  updateMessageScrollInit?: any
  provisionChannelServer?: typeof provisionChannelServer
  connectToChannelServer?: typeof connectToChannelServer
  resetChannelServer?: typeof resetChannelServer
  friendState?: any
  getFriends?: any
  groupState?: any
  getGroups?: any
  partyState?: any
  removeParty?: any
  removePartyUser?: any
  transferPartyOwner?: any
  setDetailsType?: any
  setGroupFormMode?: any
  setGroupFormOpen?: any
  setGroupForm?: any
  setSelectedUser?: any
  setSelectedGroup?: any
  locationState?: any
  transportState?: any
  changeChannelTypeState?: any
  mediastream?: any
  setHarmonyOpen?: any
  isHarmonyPage?: boolean
  harmonyHidden?: boolean
}

const initialRefreshModalValues = {
  open: false,
  title: '',
  body: '',
  action: async () => {},
  parameters: [],
  timeout: 10000,
  closeAction: async () => {}
}

const Harmony = (props: Props): any => {
  const {
    authState,
    chatState,
    channelConnectionState,
    getChannels,
    getChannelMessages,
    createMessage,
    removeMessage,
    setLeftDrawerOpen,
    setRightDrawerOpen,
    updateChatTarget,
    patchMessage,
    updateMessageScrollInit,
    provisionChannelServer,
    connectToChannelServer,
    resetChannelServer,
    friendState,
    getFriends,
    groupState,
    getGroups,
    partyState,
    setDetailsType,
    setGroupFormOpen,
    setGroupFormMode,
    setGroupForm,
    setSelectedUser,
    setSelectedGroup,
    locationState,
    transportState,
    changeChannelTypeState,
    mediastream,
    setHarmonyOpen,
    isHarmonyPage,
    harmonyHidden
  } = props

  const dispatch = useDispatch()
  const userState = useUserState()

  const messageRef = React.useRef()
  const messageEl = messageRef.current
  const selfUser = authState.get('user') as User
  const channelState = chatState.get('channels')
  const channels = channelState.get('channels')
  const targetObject = chatState.get('targetObject')
  const targetObjectType = chatState.get('targetObjectType')
  const targetChannelId = chatState.get('targetChannelId')
  const messageScrollInit = chatState.get('messageScrollInit')
  const [messageScrollUpdate, setMessageScrollUpdate] = useState(false)
  const [topMessage, setTopMessage] = useState({})
  const [messageCrudSelected, setMessageCrudSelected] = useState('')
  const [messageDeletePending, setMessageDeletePending] = useState('')
  const [messageUpdatePending, setMessageUpdatePending] = useState('')
  const [editingMessage, setEditingMessage] = useState('')
  const [composingMessage, setComposingMessage] = useState('')
  const activeChannel = channels.get(targetChannelId)
  const [producerStarting, _setProducerStarting] = useState('')
  const [activeAVChannelId, _setActiveAVChannelId] = useState('')
  const [channelAwaitingProvision, _setChannelAwaitingProvision] = useState({
    id: '',
    audio: false,
    video: false
  })
  const [selectedAccordion, setSelectedAccordion] = useState('friends')
  const [tabIndex, setTabIndex] = useState(0)
  const [videoPaused, setVideoPaused] = useState(false)
  const [audioPaused, setAudioPaused] = useState(false)
  const [selectorsOpen, setSelectorsOpen] = useState(false)
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })
  const [engineInitialized, setEngineInitialized] = useState(false)
  const [lastConnectToWorldId, _setLastConnectToWorldId] = useState('')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [warningRefreshModalValues, setWarningRefreshModalValues] = useState(initialRefreshModalValues)
  const [noGameserverProvision, setNoGameserverProvision] = useState(false)
  const [channelDisconnected, setChannelDisconnected] = useState(false)
  const [hasAudioDevice, setHasAudioDevice] = useState(false)
  const [hasVideoDevice, setHasVideoDevice] = useState(false)

  const instanceLayerUsers = userState.layerUsers.value
  const channelLayerUsers = userState.channelLayerUsers.value
  const layerUsers =
    channels.get(activeAVChannelId)?.channelType === 'instance' ? instanceLayerUsers : channelLayerUsers
  const friendSubState = friendState.get('friends')
  const friends = friendSubState.get('friends')
  const groupSubState = groupState.get('groups')
  const groups = groupSubState.get('groups')
  const party = partyState.get('party')
  const currentLocation = locationState.get('currentLocation').get('location')

  const setProducerStarting = (value) => {
    producerStartingRef.current = value
    _setProducerStarting(value)
  }

  const setActiveAVChannelId = (value) => {
    activeAVChannelIdRef.current = value
    _setActiveAVChannelId(value)
  }

  const setChannelAwaitingProvision = (value) => {
    channelAwaitingProvisionRef.current = value
    _setChannelAwaitingProvision(value)
  }

  const setLastConnectToWorldId = (value) => {
    lastConnectToWorldIdRef.current = value
    _setLastConnectToWorldId(value)
  }

  const producerStartingRef = useRef(producerStarting)
  const activeAVChannelIdRef = useRef(activeAVChannelId)
  const channelAwaitingProvisionRef = useRef(channelAwaitingProvision)
  const lastConnectToWorldIdRef = useRef(lastConnectToWorldId)
  const chatStateRef = useRef(chatState)
  const videoEnabled =
    isHarmonyPage === true
      ? true
      : currentLocation.locationSettings
      ? currentLocation.locationSettings.videoEnabled
      : false
  const isCamVideoEnabled = mediastream.get('isCamVideoEnabled')
  const isCamAudioEnabled = mediastream.get('isCamAudioEnabled')

  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          if (device.kind === 'audioinput') setHasAudioDevice(true)
          if (device.kind === 'videoinput') setHasVideoDevice(true)
        })
      })
      .catch((err) => console.log('could not get media devices', err))
  }, [])

  useEffect(() => {
    if (EngineEvents.instance != null) {
      setEngineInitialized(true)
      createEngineListeners()
    }
    window.addEventListener('resize', handleWindowResize)

    EngineEvents.instance.addEventListener(
      SocketWebRTCClientTransport.EVENTS.PROVISION_CHANNEL_NO_GAMESERVERS_AVAILABLE,
      () => setNoGameserverProvision(true)
    )

    EngineEvents.instance.addEventListener(SocketWebRTCClientTransport.EVENTS.CHANNEL_DISCONNECTED, () => {
      if (activeAVChannelIdRef.current.length > 0) setChannelDisconnected(true)
    })
    EngineEvents.instance.addEventListener(SocketWebRTCClientTransport.EVENTS.CHANNEL_RECONNECTED, async () => {
      setChannelAwaitingProvision({
        id: activeAVChannelIdRef.current,
        audio: !audioPaused,
        video: !videoPaused
      })
      await shutdownEngine()
      setWarningRefreshModalValues(initialRefreshModalValues)
      await init()
      resetChannelServer()
    })

    return () => {
      if (EngineEvents.instance != null) {
        setEngineInitialized(false)
        EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD, connectToWorldHandler)

        EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD_TIMEOUT, (e: any) => {
          if (e.instance === true) resetChannelServer()
        })

        EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.LEAVE_WORLD, () => {
          resetChannelServer()
          if (channelAwaitingProvisionRef.current.id.length === 0) _setActiveAVChannelId('')
        })
      }

      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  useEffect(() => {
    if (
      selfUser?.instanceId != null &&
      MediaStreams.instance.channelType === 'instance' &&
      (MediaStreams.instance.channelId == null || MediaStreams.instance.channelId === '')
    ) {
      const channelEntries = [...channels.entries()]
      const instanceChannel = channelEntries.find((entry) => entry[1].instanceId != null)
      MediaStreams.instance.channelId = instanceChannel[0]
      updateChannelTypeState()
    }
    if (selfUser?.instanceId != null && userState.layerUsersUpdateNeeded.value === true)
      dispatch(UserService.getLayerUsers(true))
    if (selfUser?.channelInstanceId != null && userState.channelLayerUsersUpdateNeeded.value === true)
      dispatch(UserService.getLayerUsers(false))
  }, [selfUser, userState.layerUsersUpdateNeeded.value, userState.channelLayerUsersUpdateNeeded.value])

  useEffect(() => {
    setActiveAVChannelId(transportState.get('channelId'))
  }, [transportState])

  useEffect(() => {
    if (channelConnectionState.get('connected') === false && channelAwaitingProvision?.id?.length > 0) {
      provisionChannelServer(null, channelAwaitingProvision.id)
      if (channelAwaitingProvision?.audio === true) setProducerStarting('audio')
      if (channelAwaitingProvision?.video === true) setProducerStarting('video')
      setChannelAwaitingProvision({
        id: '',
        audio: false,
        video: false
      })
    }
  }, [channelConnectionState])

  useEffect(() => {
    chatStateRef.current = chatState
    if (messageScrollInit === true && messageEl != null && (messageEl as any).scrollTop != null) {
      ;(messageEl as any).scrollTop = (messageEl as any).scrollHeight
      updateMessageScrollInit(false)
      setMessageScrollUpdate(false)
    }
    if (messageScrollUpdate === true) {
      setMessageScrollUpdate(false)
      if (messageEl != null && (messageEl as any).scrollTop != null) {
        ;(messageEl as any).scrollTop = (topMessage as any).offsetTop
      }
    }
  }, [chatState])

  useEffect(() => {
    if (channelState.get('updateNeeded') === true) {
      getChannels()
    }
  }, [channelState])

  useEffect(() => {
    channels.forEach((channel) => {
      if (chatState.get('updateMessageScroll') === true) {
        chatState.set('updateMessageScroll', false)
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
        getChannelMessages(channel.id)
      }
    })
  }, [channels])

  useEffect(() => {
    setVideoPaused(!isCamVideoEnabled)
  }, [isCamVideoEnabled])

  useEffect(() => {
    setAudioPaused(!isCamAudioEnabled)
  }, [isCamAudioEnabled])

  useEffect(() => {
    if (noGameserverProvision === true) {
      const newValues = {
        ...warningRefreshModalValues,
        open: true,
        title: 'No Available Servers',
        body: "There aren't any servers available to handle this request. Attempting to re-connect in",
        action: async () => {
          provisionChannelServer()
        },
        parameters: [null, targetChannelId],
        timeout: 10000,
        closeAction: endCall
      }
      setWarningRefreshModalValues(newValues)
      setNoGameserverProvision(false)
    }
  }, [noGameserverProvision])

  // If user if on Firefox in Private Browsing mode, throw error, since they can't use db storage currently
  useEffect(() => {
    var db = indexedDB.open('test')
    db.onerror = function () {
      const newValues = {
        ...warningRefreshModalValues,
        open: true,
        title: 'Browser Error',
        body: 'Your browser does not support storage in private browsing mode. Either try another browser, or exit private browsing mode. ',
        noCountdown: true
      }
      setWarningRefreshModalValues(newValues)
    }
  }, [])

  useEffect(() => {
    if (channelDisconnected === true) {
      const newValues = {
        ...warningRefreshModalValues,
        open: true,
        title: 'Call disconnected',
        body: "You've lost your connection to this call. We'll try to reconnect before the following time runs out, otherwise you'll hang up",
        action: async () => endCall(),
        parameters: [],
        timeout: 30000,
        closeAction: endCall
      }
      setWarningRefreshModalValues(newValues)
      setChannelDisconnected(false)
    }
  }, [channelDisconnected])

  const handleWindowResize = () => {
    setDimensions({
      height: window.innerHeight,
      width: window.innerWidth
    })
  }

  const handleComposingMessageChange = (event: any): void => {
    const message = event.target.value
    setComposingMessage(message)
  }

  const handleEditingMessageChange = (event: any): void => {
    const message = event.target.value
    setEditingMessage(message)
  }

  const packageMessage = (): void => {
    if (composingMessage.length > 0) {
      createMessage({
        targetObjectId: targetObject.id,
        targetObjectType: targetObjectType,
        text: composingMessage
      })
      setComposingMessage('')
    }
  }

  const setActiveChat = (channelType, target): void => {
    updateMessageScrollInit(true)
    updateChatTarget(channelType, target)
    setMessageDeletePending('')
    setMessageUpdatePending('')
    setEditingMessage('')
    setComposingMessage('')
  }

  const connectToWorldHandler = async ({ instance }: { instance: boolean }): Promise<void> => {
    if (instance !== true) {
      setLastConnectToWorldId(activeAVChannelIdRef.current)
      await toggleAudio(activeAVChannelIdRef.current)
      await toggleVideo(activeAVChannelIdRef.current)
      updateChannelTypeState()
      updateCamVideoState()
      updateCamAudioState()
      EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.SCENE_LOADED })
    }
  }

  const createEngineListeners = (): void => {
    EngineEvents.instance.addEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD, connectToWorldHandler)

    EngineEvents.instance.addEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD_TIMEOUT, (e: any) => {
      if (e.instance === true) resetChannelServer()
    })

    EngineEvents.instance.addEventListener(EngineEvents.EVENTS.LEAVE_WORLD, () => {
      resetChannelServer()
      setLastConnectToWorldId('')
      MediaStreams.instance.channelId = ''
      MediaStreams.instance.channelType = ''
      if (channelAwaitingProvisionRef.current.id.length === 0) _setActiveAVChannelId('')
      updateChannelTypeState()
      updateCamVideoState()
      updateCamAudioState()
    })
  }

  const onMessageScroll = (e): void => {
    if (
      e.target.scrollTop === 0 &&
      e.target.scrollHeight > e.target.clientHeight &&
      messageScrollInit !== true &&
      activeChannel.skip + activeChannel.limit < activeChannel.total
    ) {
      setMessageScrollUpdate(true)
      setTopMessage((messageEl as any).firstElementChild)
      nextMessagePage()
    }
  }

  const nextChannelPage = (): void => {
    if (channelState.get('skip') + channelState.get('limit') < channelState.get('total')) {
      getChannels(channelState.get('skip') + channelState.get('limit'))
    }
  }

  const nextMessagePage = (): void => {
    if (activeChannel.skip + activeChannel.limit < activeChannel.total) {
      getChannelMessages(targetChannelId, activeChannel.skip + activeChannel.limit)
    } else {
      setMessageScrollUpdate(false)
    }
  }

  const generateMessageSecondary = (message: Message): string => {
    const date = moment(message.createdAt).format('MMM D YYYY, h:mm a')
    if (message.senderId !== selfUser.id) {
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
    removeMessage(message.id, message.channelId)
  }

  const cancelMessageUpdate = (e: any) => {
    e.preventDefault()
    setMessageUpdatePending('')
    setEditingMessage('')
  }

  const confirmMessageUpdate = (e: any, message: Message) => {
    e.preventDefault()
    patchMessage(message.id, editingMessage)
    setMessageUpdatePending('')
    setEditingMessage('')
  }

  const toggleMessageCrudSelect = (e: any, message: Message) => {
    e.preventDefault()
    if (message.senderId === selfUser.id) {
      if (messageCrudSelected === message.id && messageUpdatePending !== message.id) {
        setMessageCrudSelected('')
      } else {
        setMessageCrudSelected(message.id)
      }
    }
  }

  const checkMediaStream = async (streamType: string, channelType: string, channelId?: string) => {
    if (streamType === 'video' && !MediaStreams.instance?.videoStream) {
      console.log('Configuring video transport', channelType, channelId)
      await configureMediaTransports(['video'], channelType, channelId)
    }
    if (streamType === 'audio' && !MediaStreams.instance?.audioStream) {
      console.log('Configuring audio transport', channelType, channelId)
      await configureMediaTransports(['audio'], channelType, channelId)
    }
  }

  const handleMicClick = async (e: any) => {
    e.stopPropagation()
    if (MediaStreams.instance?.camAudioProducer == null) {
      const channel = channels.get(targetChannelId)
      if (channel.instanceId == null) await createCamAudioProducer('channel', targetChannelId)
      else await createCamAudioProducer('instance')
      setAudioPaused(false)
      await resumeProducer(MediaStreams.instance?.camAudioProducer)
    } else {
      const msAudioPaused = MediaStreams.instance?.toggleAudioPaused()
      setAudioPaused(
        MediaStreams.instance?.audioStream === null ||
          MediaStreams.instance?.camAudioProducer == null ||
          MediaStreams.instance?.audioPaused === true
      )
      if (msAudioPaused === true) await pauseProducer(MediaStreams.instance?.camAudioProducer)
      else await resumeProducer(MediaStreams.instance?.camAudioProducer)
    }
    updateCamAudioState()
  }

  const handleCamClick = async (e: any) => {
    e.stopPropagation()
    if (MediaStreams.instance?.camVideoProducer == null) {
      const channel = channels.get(targetChannelId)
      if (channel.instanceId == null) await createCamVideoProducer('channel', targetChannelId)
      else await createCamVideoProducer('instance')
      setVideoPaused(false)
      await resumeProducer(MediaStreams.instance?.camVideoProducer)
    } else {
      const msVideoPaused = MediaStreams.instance?.toggleVideoPaused()
      setVideoPaused(
        MediaStreams.instance?.videoStream === null ||
          MediaStreams.instance?.camVideoProducer == null ||
          MediaStreams.instance?.videoPaused === true
      )
      if (msVideoPaused === true) await pauseProducer(MediaStreams.instance?.camVideoProducer)
      else await resumeProducer(MediaStreams.instance?.camVideoProducer)
    }
    updateCamVideoState()
  }

  const handleStartCall = async (e?: any) => {
    if (e?.stopPropagation) e.stopPropagation()
    const channel = channels.get(targetChannelId)
    const channelType = channel.instanceId != null ? 'instance' : 'channel'
    changeChannelTypeState(channelType, targetChannelId)
    await endVideoChat({})
    await leave(false)
    setActiveAVChannelId(targetChannelId)
    if (channel.instanceId == null) provisionChannelServer(null, targetChannelId)
    else {
      const audioConfigured = await checkMediaStream('audio', 'instance')
      const videoConfigured = await checkMediaStream('video', 'instance')
      if (videoConfigured === true) await createCamVideoProducer('instance')
      if (audioConfigured === true) await createCamAudioProducer('instance')
      updateCamVideoState()
      updateCamAudioState()
    }
  }

  const endCall = async () => {
    changeChannelTypeState('', '')
    await endVideoChat({})
    await leave(false)
    setActiveAVChannelId('')
    MediaStreams.instance.channelType = ''
    MediaStreams.instance.channelId = ''
    updateCamVideoState()
    updateCamAudioState()
  }
  const handleEndCall = async (e: any) => {
    e.stopPropagation()
    await endCall()
  }

  const toggleAudio = async (channelId) => {
    console.log('toggleAudio')
    await checkMediaStream('audio', 'channel', channelId)

    if (MediaStreams.instance?.camAudioProducer == null) await createCamAudioProducer('channel', channelId)
    else {
      const audioPaused = MediaStreams.instance?.toggleAudioPaused()
      setAudioPaused(
        MediaStreams.instance?.audioStream === null ||
          MediaStreams.instance?.camAudioProducer == null ||
          MediaStreams.instance?.audioPaused === true
      )
      if (audioPaused === true) await pauseProducer(MediaStreams.instance?.camAudioProducer)
      else await resumeProducer(MediaStreams.instance?.camAudioProducer)
    }
  }

  const toggleVideo = async (channelId) => {
    console.log('toggleVideo')
    await checkMediaStream('video', 'channel', channelId)
    if (MediaStreams.instance?.camVideoProducer == null) await createCamVideoProducer('channel', channelId)
    else {
      const videoPaused = MediaStreams.instance?.toggleVideoPaused()
      setVideoPaused(
        MediaStreams.instance?.videoStream === null ||
          MediaStreams.instance?.camVideoProducer == null ||
          MediaStreams.instance?.videoPaused === true
      )
      if (videoPaused === true) await pauseProducer(MediaStreams.instance?.camVideoProducer)
      else await resumeProducer(MediaStreams.instance?.camVideoProducer)
    }
  }

  const handleAccordionSelect = (accordionType: string) => () => {
    if (accordionType === selectedAccordion) {
      setSelectedAccordion('')
    } else {
      setSelectedAccordion(accordionType)
    }
  }

  const openInvite = (targetObjectType?: string, targetObjectId?: string): void => {
    updateInviteTarget(targetObjectType, targetObjectId)
    setLeftDrawerOpen(false)
    setRightDrawerOpen(true)
  }

  const openDetails = (e, type, object) => {
    e.stopPropagation()
    setLeftDrawerOpen(true)
    setDetailsType(type)
    if (type === 'user') {
      setSelectedUser(object)
    } else if (type === 'group') {
      setSelectedGroup(object)
    }
  }

  const openGroupForm = (mode: string, group?: GroupType) => {
    setLeftDrawerOpen(true)
    setGroupFormOpen(true)
    setGroupFormMode(mode)
    if (group != null) {
      setGroupForm({
        id: group.id,
        name: group.name,
        groupUsers: group.groupUsers,
        description: group.description
      })
    }
  }

  async function init(): Promise<any> {
    if (Network.instance?.isInitialized !== true) {
      const initializationOptions: InitializeOptions = {
        networking: {
          schema: {
            transport: SocketWebRTCClientTransport
          } as NetworkSchema
        },
        renderer: {
          disabled: true
        }
      }

      await initializeEngine(initializationOptions)
      if (engineInitialized === false) createEngineListeners()
    }
  }

  function getChannelName(): string {
    const channel = channels.get(targetChannelId)
    if (channel && channel.channelType !== 'instance') {
      if (channel.channelType === 'group') return channel[channel.channelType].name
      if (channel.channelType === 'party') return 'Current party'
      if (channel.channelType === 'user')
        return channel.user1.id === selfUser.id ? channel.user2.name : channel.user1.name
    } else return 'Current Layer'
  }

  function getAVChannelName(): string {
    const channel = channels.get(activeAVChannelId)
    if (channel && channel.channelType !== 'instance') {
      if (channel.channelType === 'group') return channel[channel.channelType].name
      if (channel.channelType === 'party') return 'Current party'
      if (channel.channelType === 'user')
        return channel.user1.id === selfUser.id ? channel.user2.name : channel.user1.name
    } else return 'Current Layer'
  }

  const nextFriendsPage = (): void => {
    if (friendSubState.get('skip') + friendSubState.get('limit') < friendSubState.get('total')) {
      getFriends(friendSubState.get('skip') + friendSubState.get('limit'))
    }
  }

  const nextGroupsPage = (): void => {
    if (groupSubState.get('skip') + groupSubState.get('limit') < groupSubState.get('total')) {
      getGroups(groupSubState.get('skip') + groupSubState.get('limit'))
    }
  }

  const onListScroll = (e): void => {
    if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
      if (tabIndex === 0) {
        nextFriendsPage()
      } else if (tabIndex === 1) {
        nextGroupsPage()
      }
    }
  }

  const isActiveChat = (channelType: string, targetObjectId: string): boolean => {
    const channelEntries = [...channels.entries()]
    const channelMatch =
      channelType === 'instance'
        ? channelEntries.find((entry) => entry[1].instanceId === targetObjectId)
        : channelType === 'group'
        ? channelEntries.find((entry) => entry[1].groupId === targetObjectId)
        : channelType === 'friend'
        ? channelEntries.find((entry) => entry[1].userId1 === targetObjectId || entry[1].userId2 === targetObjectId)
        : channelEntries.find((entry) => entry[1].partyId === targetObjectId)
    return channelMatch != null && channelMatch[0] === targetChannelId
  }

  const isActiveAVCall = (channelType: string, targetObjectId: string): boolean => {
    const channelEntries = [...channels.entries()]
    const channelMatch =
      channelType === 'instance'
        ? channelEntries.find((entry) => entry[1].instanceId === targetObjectId)
        : channelType === 'group'
        ? channelEntries.find((entry) => entry[1].groupId === targetObjectId)
        : channelType === 'friend'
        ? channelEntries.find((entry) => entry[1].userId1 === targetObjectId || entry[1].userId2 === targetObjectId)
        : channelEntries.find((entry) => entry[1].partyId === targetObjectId)
    return channelMatch != null && channelMatch[0] === activeAVChannelId
  }

  const closeHarmony = (): void => {
    const canvas = document.getElementById(engineRendererCanvasId) as HTMLCanvasElement
    if (canvas?.style != null) canvas.style.width = '100%'
    setHarmonyOpen(false)
    if (MediaStreams.instance.channelType === '' || MediaStreams.instance.channelType == null) {
      const channelEntries = [...channels.entries()]
      const instanceChannel = channelEntries.find((entry) => entry[1].instanceId != null)
      if (instanceChannel != null) {
        MediaStreams.instance.channelType = 'instance'
        MediaStreams.instance.channelType = instanceChannel[0]
        setActiveAVChannelId(instanceChannel[0])
      }
    }
    EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.START_SUSPENDED_CONTEXTS })
  }

  const openProfileMenu = (): void => {
    setProfileMenuOpen(true)
  }

  useEffect(() => {
    if (
      channelConnectionState.get('instanceProvisioned') === true &&
      channelConnectionState.get('updateNeeded') === true &&
      channelConnectionState.get('instanceServerConnecting') === false &&
      channelConnectionState.get('connected') === false
    ) {
      init().then(() => {
        connectToChannelServer(channelConnectionState.get('channelId'), isHarmonyPage)
        updateCamVideoState()
        updateCamAudioState()
      })
    }
  }, [channelConnectionState])

  const chatSelectors = (
    <div
      className={classNames({
        [styles['list-container']]: true,
        [styles['chat-selectors']]: true
      })}
    >
      <div className={styles.partyInstanceButtons}>
        <div
          className={classNames({
            [styles.partyButton]: true,
            [styles.activeChat]: party != null && isActiveChat('party', party.id)
          })}
          onClick={(e) => {
            if (party != null) {
              setActiveChat('party', party)
              if (dimensions.width <= 768) setSelectorsOpen(false)
            } else openDetails(e, 'party', party)
          }}
        >
          <PeopleOutline className={styles['icon-margin-right']} />
          <span>Party</span>
          <div
            className={classNames({
              [styles.activeAVCall]: party != null && isActiveAVCall('party', party.id)
            })}
          />
          {party != null && party.id != null && party.id !== '' && (
            <ListItemIcon className={styles.groupEdit} onClick={(e) => openDetails(e, 'party', party)}>
              <Settings />
            </ListItemIcon>
          )}
        </div>
        {selfUser?.instanceId != null && (
          <div
            className={classNames({
              [styles.instanceButton]: true,
              [styles.activeChat]: isActiveChat('instance', selfUser.instanceId)
            })}
            onClick={() => {
              setActiveChat('instance', {
                id: selfUser.instanceId
              })
              if (dimensions.width <= 768) setSelectorsOpen(false)
            }}
          >
            <Grain className={styles['icon-margin-right']} />
            <span>Here</span>
            <div
              className={classNames({
                [styles.activeAVCall]: isActiveAVCall('instance', selfUser.instanceId)
              })}
            />
          </div>
        )}
      </div>
      {selfUser?.userRole !== 'guest' && (
        <Accordion
          expanded={selectedAccordion === 'user'}
          onChange={handleAccordionSelect('user')}
          className={styles['MuiAccordion-root']}
        >
          <AccordionSummary id="friends-header" expandIcon={<ExpandMore />} aria-controls="friends-content">
            <Group className={styles['icon-margin-right']} />
            <Typography>Friends</Typography>
          </AccordionSummary>
          <AccordionDetails className={styles['list-container']}>
            <div className={styles['flex-center']}>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => openInvite('user')}>
                Invite Friend
              </Button>
            </div>
            <List onScroll={(e) => onListScroll(e)}>
              {friends &&
                friends.length > 0 &&
                friends
                  .sort((a, b) => a.name - b.name)
                  .map((friend, index) => {
                    return (
                      <div key={friend.id}>
                        <ListItem
                          className={classNames({
                            [styles.selectable]: true,
                            [styles.activeChat]: isActiveChat('user', friend.id)
                          })}
                          onClick={() => {
                            setActiveChat('user', friend)
                            if (dimensions.width <= 768) setSelectorsOpen(false)
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar src={friend.avatarUrl} />
                          </ListItemAvatar>
                          <ListItemText primary={friend.name} />
                          <div
                            className={classNames({
                              [styles.activeAVCall]: isActiveAVCall('user', friend.id)
                            })}
                          />
                          <ListItemIcon className={styles.groupEdit} onClick={(e) => openDetails(e, 'user', friend)}>
                            <Settings />
                          </ListItemIcon>
                        </ListItem>
                        {index < friends.length - 1 && <Divider />}
                      </div>
                    )
                  })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      {selfUser?.userRole !== 'guest' && (
        <Accordion
          expanded={selectedAccordion === 'group'}
          onChange={handleAccordionSelect('group')}
          className={styles['MuiAccordion-root']}
        >
          <AccordionSummary id="groups-header" expandIcon={<ExpandMore />} aria-controls="groups-content">
            <GroupWork className={styles['icon-margin-right']} />
            <Typography>Groups</Typography>
          </AccordionSummary>
          <AccordionDetails className={styles['list-container']}>
            <div className={styles['flex-center']}>
              <Button variant="contained" color="primary" startIcon={<Add />} onClick={() => openGroupForm('create')}>
                Create Group
              </Button>
            </div>
            <List onScroll={(e) => onListScroll(e)}>
              {groups &&
                groups.length > 0 &&
                groups
                  .sort((a, b) => a.name - b.name)
                  .map((group, index) => {
                    return (
                      <div key={group.id}>
                        <ListItem
                          className={classNames({
                            [styles.selectable]: true,
                            [styles.activeChat]: isActiveChat('group', group.id)
                          })}
                          onClick={() => {
                            setActiveChat('group', group)
                            if (dimensions.width <= 768) setSelectorsOpen(false)
                          }}
                        >
                          <ListItemText primary={group.name} />
                          <div
                            className={classNames({
                              [styles.activeAVCall]: isActiveAVCall('group', group.id)
                            })}
                          />
                          <ListItemIcon className={styles.groupEdit} onClick={(e) => openDetails(e, 'group', group)}>
                            <Settings />
                          </ListItemIcon>
                        </ListItem>
                        {index < groups.length - 1 && <Divider />}
                      </div>
                    )
                  })}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      {selfUser && selfUser.instanceId && (
        <Accordion expanded={selectedAccordion === 'layerUsers'} onChange={handleAccordionSelect('layerUsers')}>
          <AccordionSummary id="layer-user-header" expandIcon={<ExpandMore />} aria-controls="layer-user-content">
            <Public className={styles['icon-margin-right']} />
            <Typography>Layer Users</Typography>
          </AccordionSummary>
          <AccordionDetails
            className={classNames({
              [styles.flexbox]: true,
              [styles['flex-column']]: true,
              [styles['flex-center']]: true
            })}
          >
            <div className={styles['list-container']}>
              <div className={styles.title}>Users on this Layer</div>
              <List
                className={classNames({
                  [styles['flex-center']]: true,
                  [styles['flex-column']]: true
                })}
                onScroll={(e) => onListScroll(e)}
              >
                {instanceLayerUsers &&
                  instanceLayerUsers.length > 0 &&
                  instanceLayerUsers
                    .slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((layerUser) => {
                      return (
                        <ListItem key={layerUser.id}>
                          <ListItemAvatar>
                            <Avatar src={layerUser.avatarUrl} />
                          </ListItemAvatar>
                          {selfUser.id === layerUser.id && <ListItemText primary={layerUser.name + ' (you)'} />}
                          {selfUser.id !== layerUser.id && <ListItemText primary={layerUser.name} />}
                          {/*{*/}
                          {/*    locationBanPending !== layerUser.id &&*/}
                          {/*    isLocationAdmin === true &&*/}
                          {/*    selfUser.id !== layerUser.id &&*/}
                          {/*    layerUser.locationAdmins?.find(locationAdmin => locationAdmin.locationId === currentLocation.id) == null &&*/}
                          {/*    <Tooltip title="Ban user">*/}
                          {/*        <Button onClick={(e) => showLocationBanConfirm(e, layerUser.id)}>*/}
                          {/*            <Block/>*/}
                          {/*        </Button>*/}
                          {/*    </Tooltip>*/}
                          {/*}*/}
                          {/*{locationBanPending === layerUser.id &&*/}
                          {/*<div>*/}
                          {/*    <Button variant="contained"*/}
                          {/*            color="primary"*/}
                          {/*            onClick={(e) => confirmLocationBan(e, layerUser.id)}*/}
                          {/*    >*/}
                          {/*        Ban User*/}
                          {/*    </Button>*/}
                          {/*    <Button variant="contained"*/}
                          {/*            color="secondary"*/}
                          {/*            onClick={(e) => cancelLocationBan(e)}*/}
                          {/*    >*/}
                          {/*        Cancel*/}
                          {/*    </Button>*/}
                          {/*</div>*/}
                          {/*}*/}
                        </ListItem>
                      )
                    })}
              </List>
            </div>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  )

  return (
    <div
      className={classNames({
        [styles['harmony-component']]: true,
        [styles['display-none']]: harmonyHidden === true
      })}
    >
      <style>
        {' '}
        {`
                .Mui-selected {
                    background-color: rgba(0, 0, 0, 0.4) !important;
                }
                .MuiOutlinedInput-notchedOutline {
                    border-color: rgba(127, 127, 127, 0.7);
                }
            `}
      </style>
      {dimensions.width <= 768 && (
        <SwipeableDrawer
          className={classNames({
            [styles['flex-column']]: true,
            [styles['list-container']]: true
          })}
          BackdropProps={{ invisible: true }}
          anchor="left"
          open={selectorsOpen === true}
          onClose={() => {
            setSelectorsOpen(false)
          }}
          onOpen={() => {
            setSelectedAccordion('friends')
          }}
        >
          <div className={styles['close-button']} onClick={() => setSelectorsOpen(false)}>
            <Close />
          </div>
          {chatSelectors}
        </SwipeableDrawer>
      )}
      {dimensions.width > 768 && chatSelectors}
      <div className={styles['chat-window']}>
        <div className={styles['harmony-header']}>
          {dimensions.width <= 768 && (
            <div
              className={classNames({
                [styles['chat-toggle']]: true,
                [styles.iconContainer]: true
              })}
              onClick={() => setSelectorsOpen(true)}
            >
              <Group />
            </div>
          )}
          {targetChannelId?.length > 0 && (
            <header className={styles.mediaControls}>
              {activeAVChannelId === '' && (
                <div
                  className={classNames({
                    [styles.iconContainer]: true,
                    [styles.startCall]: true
                  })}
                  onClick={(e) => handleStartCall(e)}
                >
                  <Call />
                </div>
              )}
              {activeAVChannelId !== '' && (
                <div className={styles.activeCallControls}>
                  <div
                    className={classNames({
                      [styles.iconContainer]: true,
                      [styles.endCall]: true
                    })}
                    onClick={(e) => handleEndCall(e)}
                  >
                    <CallEnd />
                  </div>
                  {hasAudioDevice && (
                    <div className={styles.iconContainer + ' ' + (audioPaused ? styles.off : styles.on)}>
                      <Mic id="micOff" className={styles.offIcon} onClick={(e) => handleMicClick(e)} />
                      <Mic id="micOn" className={styles.onIcon} onClick={(e) => handleMicClick(e)} />
                    </div>
                  )}
                  {videoEnabled && hasVideoDevice && (
                    <div className={styles.iconContainer + ' ' + (videoPaused ? styles.off : styles.on)}>
                      <Videocam id="videoOff" className={styles.offIcon} onClick={(e) => handleCamClick(e)} />
                      <Videocam id="videoOn" className={styles.onIcon} onClick={(e) => handleCamClick(e)} />
                    </div>
                  )}
                </div>
              )}
            </header>
          )}
          {targetChannelId?.length === 0 && <div />}

          <div className={styles.controls}>
            <div
              className={classNames({
                [styles['profile-toggle']]: true,
                [styles.iconContainer]: true
              })}
              onClick={() => openProfileMenu()}
            >
              <Person />
            </div>
            {selfUser?.userRole !== 'guest' && (
              <div
                className={classNames({
                  [styles['invite-toggle']]: true,
                  [styles.iconContainer]: true
                })}
                onClick={() => openInvite()}
              >
                <GroupAdd />
              </div>
            )}
            {isHarmonyPage !== true && (
              <div
                className={classNames({
                  [styles['harmony-toggle']]: true,
                  [styles.iconContainer]: true
                })}
                onClick={() => closeHarmony()}
              >
                <ThreeDRotation />
              </div>
            )}
          </div>
        </div>
        {activeAVChannelId !== '' && harmonyHidden !== true && (
          <div className={styles['video-container']}>
            <div className={styles['active-chat-plate']}>{getAVChannelName()}</div>
            <Grid className={styles['party-user-container']} container direction="row">
              <Grid
                item
                className={classNames({
                  [styles['grid-item']]: true,
                  [styles.single]: layerUsers.length == null || layerUsers.length <= 1,
                  [styles.two]: layerUsers.length === 2,
                  [styles.four]: layerUsers.length === 3 || layerUsers.length === 4,
                  [styles.six]: layerUsers.length === 5 || layerUsers.length === 6,
                  [styles.nine]: layerUsers.length >= 7 && layerUsers.length <= 9,
                  [styles.many]: layerUsers.length > 9
                })}
              >
                <PartyParticipantWindow harmony={true} peerId={'me_cam'} />
              </Grid>
              {layerUsers
                .filter((user) => user.id !== selfUser.id)
                .map((user) => (
                  <Grid
                    item
                    key={user.id}
                    className={classNames({
                      [styles['grid-item']]: true,
                      [styles.single]: layerUsers.length == null || layerUsers.length <= 1,
                      [styles.two]: layerUsers.length === 2,
                      [styles.four]: layerUsers.length === 3 || layerUsers.length === 4,
                      [styles.six]: layerUsers.length === 5 || layerUsers.length === 6,
                      [styles.nine]: layerUsers.length >= 7 && layerUsers.length <= 9,
                      [styles.many]: layerUsers.length > 9
                    })}
                  >
                    <PartyParticipantWindow harmony={true} peerId={user.id} key={user.id} />
                  </Grid>
                ))}
            </Grid>
          </div>
        )}
        <div className={styles['list-container']}>
          {targetChannelId != null && targetChannelId !== '' && (
            <div className={styles['active-chat-plate']}>{getChannelName()}</div>
          )}
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
                        [styles.self]: message.senderId === selfUser.id,
                        [styles.other]: message.senderId !== selfUser.id
                      })}
                      key={message.id}
                      onMouseEnter={(e) => toggleMessageCrudSelect(e, message)}
                      onMouseLeave={(e) => toggleMessageCrudSelect(e, message)}
                      onTouchEnd={(e) => toggleMessageCrudSelect(e, message)}
                    >
                      <div>
                        {message.senderId !== selfUser.id && (
                          <ListItemAvatar>
                            <Avatar src={message.sender?.avatarUrl} />
                          </ListItemAvatar>
                        )}
                        {messageUpdatePending !== message.id && (
                          <ListItemText primary={message.text} secondary={generateMessageSecondary(message)} />
                        )}
                        {message.senderId === selfUser.id && messageUpdatePending !== message.id && (
                          <div className="message-crud">
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
                              placeholder="Abc"
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
            {targetChannelId != null && targetChannelId.length === 0 && targetObject.id != null && (
              <div className={styles['first-message-placeholder']}>
                <div>{targetChannelId}</div>
                Start a chat with{' '}
                {targetObjectType === 'user' || targetObjectType === 'group'
                  ? targetObject.name
                  : targetObjectType === 'instance'
                  ? 'your current layer'
                  : 'your current party'}
              </div>
            )}
          </List>
          {targetObject != null && targetObject.id != null && (
            <div className={styles['flex-center']}>
              <div className={styles['chat-box']}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  multiline
                  fullWidth
                  id="newMessage"
                  placeholder="Abc"
                  name="newMessage"
                  autoFocus
                  value={composingMessage}
                  inputProps={{
                    maxLength: 1000
                  }}
                  onKeyPress={(e) => {
                    if (e.shiftKey === false && e.charCode === 13) {
                      e.preventDefault()
                      packageMessage()
                    }
                  }}
                  onChange={handleComposingMessageChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={styles['send-button']}
                  startIcon={<Send />}
                  onClick={packageMessage}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
          {(targetObject == null || targetObject.id == null) && (
            <div className={styles['no-chat']}>
              <div>Start a chat with a friend or group from the side panel</div>
            </div>
          )}
        </div>
      </div>
      {profileMenuOpen && (
        <ClickAwayListener onClickAway={() => setProfileMenuOpen(false)}>
          <div className={styles.profileMenu}>
            <ProfileMenu setProfileMenuOpen={setProfileMenuOpen} />
          </div>
        </ClickAwayListener>
      )}
      <WarningRefreshModal
        open={warningRefreshModalValues.open}
        handleClose={() => {
          setWarningRefreshModalValues(initialRefreshModalValues)
        }}
        title={warningRefreshModalValues.title}
        body={warningRefreshModalValues.body}
        action={warningRefreshModalValues.action}
        parameters={warningRefreshModalValues.parameters}
        timeout={warningRefreshModalValues.timeout}
        closeEffect={warningRefreshModalValues.closeAction}
      />
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Harmony)
