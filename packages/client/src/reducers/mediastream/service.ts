import { Dispatch } from 'redux';
import { MediaStreamSystem } from "@xrengine/engine/src/networking/systems/MediaStreamSystem";
import {
  setCamAudioState,
  setCamVideoState,
  setFaceTrackingState,
  setConsumers
} from './actions';
import store from '@xrengine/client-core/src/store';

export const updateCamVideoState = () => {
  const ms = MediaStreamSystem.instance;
  if (!ms) changeCamVideoState(false);

  store.dispatch(setCamVideoState(ms != null && ms.camVideoProducer != null && !ms.videoPaused));
};

export const changeCamVideoState = (isEnable: boolean) => {
  return (dispatch: Dispatch): void => { dispatch(setCamVideoState(isEnable)); };
};

export const triggerUpdateConsumers = () => {
  const ms = MediaStreamSystem.instance;
  if (!ms) updateConsumers([]);

  store.dispatch(setConsumers(ms != null ? ms.consumers : []));
};

export const updateConsumers = (consumers: any[]) => {
  return (dispatch: Dispatch): void => { dispatch(setConsumers(consumers));};
};

export const updateCamAudioState = () => {
  const ms = MediaStreamSystem.instance;
  if (!ms) changeCamAudioState(false);

  store.dispatch(setCamAudioState(ms != null && ms.camAudioProducer != null && !ms.audioPaused));
};

export const changeCamAudioState = (isEnable: boolean) => {
  return (dispatch: Dispatch): void => { dispatch(setCamAudioState(isEnable)); };
};

export const updateFaceTrackingState = () => {
  const ms = MediaStreamSystem.instance;
  store.dispatch(setFaceTrackingState(ms && ms.faceTracking));
};

export const changeFaceTrackingState = (isEnable: boolean) => {
  return (dispatch: Dispatch): void => { dispatch(setFaceTrackingState(isEnable)); }; 
};
