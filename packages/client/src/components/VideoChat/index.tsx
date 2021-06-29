import Fab from "@material-ui/core/Fab";
import { CallEnd, VideoCall } from '@material-ui/icons';
import { selectAuthState } from '@xrengine/client-core/src/user/reducers/auth/selector';
import { selectLocationState } from '@xrengine/client-core/src/social/reducers/location/selector';
import { configureMediaTransports, endVideoChat } from '../../transports/SocketWebRTCClientFunctions';
import { MediaStreamSystem } from '@xrengine/engine/src/networking/systems/MediaStreamSystem';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface Props {
  authState?: any;
  locationState?: any;
}

const mapStateToProps = (state: any): any => {
  return {
    authState: selectAuthState(state),
    locationState: selectLocationState(state)
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
});

const VideoChat = (props: Props) => {
  const {
    authState,
    locationState
  } = props;

  const mediaStreamSystem = new MediaStreamSystem();

  const user = authState.get('user');
  const currentLocation = locationState.get('currentLocation').get('location');
  const gsProvision = async () => {
    if (mediaStreamSystem.mediaStream == null) {
      await configureMediaTransports(currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId);
      console.log("Send camera streams called from gsProvision");
    } else {
      await endVideoChat({});
    }
  };
  return (
    <Fab color="primary" aria-label="VideoChat" onClick={gsProvision}>
      {mediaStreamSystem.mediaStream == null && <VideoCall /> }
      {mediaStreamSystem.mediaStream != null && <CallEnd /> }
    </Fab>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoChat);
