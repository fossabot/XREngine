import {VideoCall, CallEnd, PersonAdd} from '@material-ui/icons';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { MediaStreamComponent } from '@xr3ngine/engine/src/networking/components/MediaStreamComponent';
import { Network } from '@xr3ngine/engine/src/networking/components/Network';
import { observer } from 'mobx-react';
import { selectAuthState } from '../../../redux/auth/selector';
import { selectLocationState } from '../../../redux/location/selector';
import Fab from "@material-ui/core/Fab";
import { configureMediaTransports, endVideoChat } from '../../../classes/transports/WebRTCFunctions';
import { useEffect, useState } from 'react';

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

const VideoChat = observer((props: Props) => {
  const {
    authState,
    locationState
  } = props;

  const user = authState.get('user');
  const currentLocation = locationState.get('currentLocation').get('location');
  const gsProvision = async () => {
    if (MediaStreamComponent.instance.mediaStream == null) {
      await configureMediaTransports(currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId);
      console.log("Send camera streams called from gsProvision");
    } else {
      await endVideoChat({});
    }
  };
  return (
    <Fab color="primary" aria-label="VideoChat" onClick={gsProvision}>
      {MediaStreamComponent?.instance?.mediaStream == null && <VideoCall /> }
      {MediaStreamComponent?.instance?.mediaStream != null && <CallEnd /> }
    </Fab>
  );
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoChat);
