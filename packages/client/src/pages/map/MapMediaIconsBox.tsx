import { Mic, MicOff, Videocam, VideocamOff } from '@material-ui/icons'
import { selectAppOnBoardingStep } from '@xrengine/client-core/src/common/reducers/app/selector'
import { selectLocationState } from '@xrengine/client-core/src/social/reducers/location/selector'
import { selectAuthState } from '@xrengine/client-core/src/user/reducers/auth/selector'
import { Network } from '@xrengine/engine/src/networking/classes/Network'
import { MediaStreamSystem } from '@xrengine/engine/src/networking/systems/MediaStreamSystem'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { changeFaceTrackingState, updateCamAudioState, updateCamVideoState } from '../../reducers/mediastream/service'
import {
  configureMediaTransports,
  createCamAudioProducer,
  createCamVideoProducer,
  endVideoChat,
  leave,
  pauseProducer,
  resumeProducer
} from '../../transports/SocketWebRTCClientFunctions'
// @ts-ignore
import styles from './MapMediaIconsBox.module.scss'

const mapStateToProps = (state: any): any => {
  return {
    onBoardingStep: selectAppOnBoardingStep(state),
    authState: selectAuthState(state),
    locationState: selectLocationState(state),
    mediastream: state.get('mediastream')
  }
}

const mapDispatchToProps = (dispatch): any => ({
  changeFaceTrackingState: bindActionCreators(changeFaceTrackingState, dispatch)
})

const MediaIconsBox = (props) => {
  const { authState, locationState, mediastream } = props

  const user = authState.get('user')
  const currentLocation = locationState.get('currentLocation').get('location')

  const videoEnabled = currentLocation.locationSettings ? currentLocation.locationSettings.videoEnabled : false
  const instanceMediaChatEnabled = currentLocation.locationSettings
    ? currentLocation.locationSettings.instanceMediaChatEnabled
    : false

  const isCamVideoEnabled = mediastream.get('isCamVideoEnabled')
  const isCamAudioEnabled = mediastream.get('isCamAudioEnabled')

  const onEngineLoaded = () => {
    document.removeEventListener('ENGINE_LOADED', onEngineLoaded)
  }
  document.addEventListener('ENGINE_LOADED', onEngineLoaded)

  const checkMediaStream = async (partyId: string): Promise<boolean> => {
    return await configureMediaTransports(partyId)
  }

  const checkEndVideoChat = async () => {
    if (
      (MediaStreamSystem.instance.audioPaused || MediaStreamSystem.instance?.camAudioProducer == null) &&
      (MediaStreamSystem.instance.videoPaused || MediaStreamSystem.instance?.camVideoProducer == null)
    ) {
      await endVideoChat({})
      if ((Network.instance.transport as any).channelSocket?.connected === true) await leave(false)
    }
  }
  const handleMicClick = async () => {
    const partyId = currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId
    if (await checkMediaStream(partyId)) {
      if (MediaStreamSystem.instance?.camAudioProducer == null) await createCamAudioProducer(partyId)
      else {
        const audioPaused = MediaStreamSystem.instance.toggleAudioPaused()
        if (audioPaused === true) await pauseProducer(MediaStreamSystem.instance?.camAudioProducer)
        else await resumeProducer(MediaStreamSystem.instance?.camAudioProducer)
        checkEndVideoChat()
      }
      updateCamAudioState()
    }
  }

  const handleCamClick = async () => {
    const partyId = currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId
    if (await checkMediaStream(partyId)) {
      if (MediaStreamSystem.instance?.camVideoProducer == null) await createCamVideoProducer(partyId)
      else {
        const videoPaused = MediaStreamSystem.instance.toggleVideoPaused()
        if (videoPaused === true) await pauseProducer(MediaStreamSystem.instance?.camVideoProducer)
        else await resumeProducer(MediaStreamSystem.instance?.camVideoProducer)
        checkEndVideoChat()
      }

      updateCamVideoState()
    }
  }

  const VideocamIcon = isCamVideoEnabled ? Videocam : VideocamOff
  const MicIcon = isCamAudioEnabled ? Mic : MicOff

  return (
    <section className={styles.drawerBox}>
      {instanceMediaChatEnabled ? (
        <button
          type="button"
          id="UserAudio"
          className={styles.iconContainer + ' ' + (isCamAudioEnabled ? styles.on : '')}
          onClick={handleMicClick}
        >
          <MicIcon />
        </button>
      ) : null}
      {videoEnabled ? (
        <>
          <button
            type="button"
            id="UserVideo"
            className={styles.iconContainer + ' ' + (isCamVideoEnabled ? styles.on : '')}
            onClick={handleCamClick}
          >
            <VideocamIcon />
          </button>
        </>
      ) : null}
    </section>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaIconsBox)
