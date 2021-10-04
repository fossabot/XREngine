import Fab from '@material-ui/core/Fab'
import { CallEnd, VideoCall } from '@material-ui/icons'
import { useAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'
import { useLocationState } from '@xrengine/client-core/src/social/reducers/location/LocationState'
import { configureMediaTransports, endVideoChat } from '../../transports/SocketWebRTCClientFunctions'
import { MediaStreams } from '@xrengine/engine/src/networking/systems/MediaStreamSystem'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

interface Props {}

const mapStateToProps = (state: any): any => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({})

const VideoChat = (props: Props) => {
  const mediaStreamSystem = new MediaStreams()

  const user = useAuthState().user
  const currentLocation = useLocationState().currentLocation.location
  const gsProvision = async () => {
    if (mediaStreamSystem.videoStream == null) {
      await configureMediaTransports(
        ['video', 'audio'],
        currentLocation?.locationSettings?.instanceMediaChatEnabled?.value === true ? 'instance' : user.partyId.value
      )
      console.log('Send camera streams called from gsProvision')
    } else {
      await endVideoChat({})
    }
  }
  return (
    <Fab color="primary" aria-label="VideoChat" onClick={gsProvision}>
      {mediaStreamSystem.videoStream == null && <VideoCall />}
      {mediaStreamSystem.videoStream != null && <CallEnd />}
    </Fab>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(VideoChat)
