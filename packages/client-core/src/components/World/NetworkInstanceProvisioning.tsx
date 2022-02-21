import { AppAction, GeneralStateList } from '@xrengine/client-core/src/common/services/AppService'
import {
  MediaInstanceConnectionService,
  useMediaInstanceConnectionState
} from '@xrengine/client-core/src/common/services/MediaInstanceConnectionService'
import {
  LocationInstanceConnectionAction,
  LocationInstanceConnectionService,
  useLocationInstanceConnectionState
} from '@xrengine/client-core/src/common/services/LocationInstanceConnectionService'
import { MediaStreamService } from '@xrengine/client-core/src/media/services/MediaStreamService'
import { useChatState } from '@xrengine/client-core/src/social/services/ChatService'
import { useLocationState } from '@xrengine/client-core/src/social/services/LocationService'
import { useDispatch } from '@xrengine/client-core/src/store'
import { AuthService, useAuthState } from '@xrengine/client-core/src/user/services/AuthService'
import { UserService, useUserState } from '@xrengine/client-core/src/user/services/UserService'
import { EngineActions, useEngineState } from '@xrengine/engine/src/ecs/classes/EngineService'
import { shutdownEngine } from '@xrengine/engine/src/initializeEngine'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { MessageTypes } from '@xrengine/engine/src/networking/enums/MessageTypes'
import { dispatchLocal } from '@xrengine/engine/src/networking/functions/dispatchFrom'
import { receiveJoinWorld } from '@xrengine/engine/src/networking/functions/receiveJoinWorld'
import React, { useEffect } from 'react'
import { retriveLocationByName } from './LocationLoadHelper'
import GameServerWarnings from './GameServerWarnings'
import { usePartyState } from '../../social/services/PartyService'
import { getSearchParamFromURL } from '../../util/getSearchParamFromURL'

interface Props {
  locationName: string
}

export const NetworkInstanceProvisioning = (props: Props) => {
  const authState = useAuthState()
  const selfUser = authState.user
  const userState = useUserState()
  const dispatch = useDispatch()
  const chatState = useChatState()
  const locationState = useLocationState()
  const instanceConnectionState = useLocationInstanceConnectionState()
  const channelConnectionState = useMediaInstanceConnectionState()
  const isUserBanned = locationState.currentLocation.selfUserBanned.value
  const engineState = useEngineState()

  // 1. Ensure api server connection in and set up reset listener
  useEffect(() => {
    AuthService.doLoginAuto(true)
  }, [])

  useEffect(() => {
    const action = async (ev: any) => {
      if (!ev.instance) return
      await shutdownEngine()
      dispatch(LocationInstanceConnectionAction.disconnect())
      if (!isUserBanned) {
        retriveLocationByName(authState, props.locationName, history)
      }
    }
    if (engineState.socketInstance.value) action({ instance: true })
  }, [engineState.socketInstance.value])

  // 2. once we have the location, provision the instance server
  useEffect(() => {
    const currentLocation = locationState.currentLocation.location

    if (currentLocation.id?.value) {
      if (!isUserBanned && !instanceConnectionState.provisioned.value && !instanceConnectionState.provisioning.value) {
        const search = window.location.search
        let instanceId

        if (search != null) {
          const parsed = new URL(window.location.href).searchParams.get('instanceId')
          instanceId = parsed
        }

        // start listening for users joining or leaving the location
        AuthService.listenForUserPatch()

        LocationInstanceConnectionService.provisionServer(
          currentLocation.id.value,
          instanceId || undefined,
          currentLocation.sceneId.value
        )
      }
    } else {
      if (!locationState.currentLocationUpdateNeeded.value && !locationState.fetchingCurrentLocation.value) {
        dispatch(AppAction.setAppSpecificOnBoardingStep(GeneralStateList.FAILED, false))
      }
    }
  }, [locationState.currentLocation.location.value])

  // 3. once engine is initialised and the server is provisioned, connect the the instance server
  useEffect(() => {
    if (
      engineState.isEngineInitialized.value &&
      !instanceConnectionState.connected.value &&
      instanceConnectionState.provisioned.value &&
      !instanceConnectionState.connecting.value
    )
      LocationInstanceConnectionService.connectToServer()
  }, [
    engineState.isEngineInitialized.value,
    instanceConnectionState.connected.value,
    instanceConnectionState.connecting.value,
    instanceConnectionState.provisioned.value
  ])

  useEffect(() => {
    const transportRequestData = {
      inviteCode: getSearchParamFromURL('inviteCode')!
    }

    if (engineState.connectedWorld.value && engineState.sceneLoaded.value) {
      Network.instance.transportHandler
        .getWorldTransport()
        .request(MessageTypes.JoinWorld.toString(), transportRequestData)
        .then(receiveJoinWorld)
    }
  }, [engineState.connectedWorld.value, engineState.sceneLoaded.value])

  useEffect(() => {
    if (engineState.joinedWorld.value) {
      dispatch(AppAction.setAppOnBoardingStep(GeneralStateList.SUCCESS))
      dispatch(AppAction.setAppLoaded(true))
    }
  }, [engineState.joinedWorld.value])

  // channel server provisioning (if needed)
  useEffect(() => {
    if (chatState.instanceChannelFetched.value) {
      const channels = chatState.channels.channels.value
      const instanceChannel = Object.values(channels).find(
        (channel) => channel.instanceId === instanceConnectionState.instance.id.value
      )
      MediaInstanceConnectionService.provisionServer(instanceChannel?.id, true)
    }
  }, [chatState.instanceChannelFetched.value])

  // periodically listening for users spatially near
  useEffect(() => {
    if (selfUser?.instanceId.value != null && userState.layerUsersUpdateNeeded.value) UserService.getLayerUsers(true)
  }, [selfUser?.instanceId.value, userState.layerUsersUpdateNeeded.value])

  // if a media connection has been provisioned and is ready, connect to it
  useEffect(() => {
    if (
      channelConnectionState.provisioned.value === true &&
      channelConnectionState.updateNeeded.value === true &&
      channelConnectionState.connecting.value === false &&
      channelConnectionState.connected.value === false
    ) {
      MediaInstanceConnectionService.connectToServer(channelConnectionState.channelId.value)
      MediaStreamService.updateCamVideoState()
      MediaStreamService.updateCamAudioState()
    }
  }, [
    channelConnectionState.connected.value,
    channelConnectionState.updateNeeded.value,
    channelConnectionState.provisioned.value,
    channelConnectionState.connecting.value
  ])

  return <GameServerWarnings locationName={props.locationName} />
}

export default NetworkInstanceProvisioning
