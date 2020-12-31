import { CameraComponent } from '@xr3ngine/engine/src/camera/components/CameraComponent';
import { isMobileOrTablet } from '@xr3ngine/engine/src/common/functions/isMobile';
import { resetEngine } from "@xr3ngine/engine/src/ecs/functions/EngineFunctions";
import { getMutableComponent } from '@xr3ngine/engine/src/ecs/functions/EntityFunctions';
import { DefaultInitializationOptions, initializeEngine } from '@xr3ngine/engine/src/initialize';
import { NetworkSchema } from '@xr3ngine/engine/src/networking/interfaces/NetworkSchema';
import { loadScene } from "@xr3ngine/engine/src/scene/functions/SceneLoading";
import { CharacterAvatars } from '@xr3ngine/engine/src/templates/character/CharacterAvatars';
import { DefaultNetworkSchema } from '@xr3ngine/engine/src/templates/networking/DefaultNetworkSchema';
import { TransformComponent } from '@xr3ngine/engine/src/transform/components/TransformComponent';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Network } from "@xr3ngine/engine/src/networking/components/Network";
import { loadActorAvatar } from "@xr3ngine/engine/src/templates/character/behaviors/loadActorAvatar";
import { setActorAvatar } from "@xr3ngine/engine/src/templates/character/behaviors/setActorAvatar";
import { SocketWebRTCClientTransport } from '../../classes/transports/SocketWebRTCClientTransport';
import { generalStateList, setAppLoaded, setAppOnBoardingStep } from '../../redux/app/actions';
import { selectAppOnBoardingStep } from '../../redux/app/selector';
import { selectAuthState } from '../../redux/auth/selector';
import { client } from '../../redux/feathers';
import store from '../../redux/store';
import { InfoBox } from '../ui/InfoBox';
import LinearProgressComponent from '../ui/LinearProgress';
import MediaIconsBox from "../ui/MediaIconsBox";
import NetworkDebug from '../ui/NetworkDebug/NetworkDebug';
import OnBoardingBox from '../ui/OnBoardingBox';
import OnBoardingDialog from '../ui/OnBoardingDialog';
import TooltipContainer from '../ui/TooltipContainer';
import LoadedSceneButtons from '../ui/LoadedSceneButtons';
import SceneTitle from '../ui/SceneTitle';
import NamePlate from '../ui/NamePlate';
import { number } from 'prop-types';
import { Vector3 } from 'three';

const MobileGamepad = dynamic(() => import("../ui/MobileGampad").then((mod) => mod.MobileGamepad),  { ssr: false });

const projectRegex = /\/([A-Za-z0-9]+)\/([a-f0-9-]+)$/;

interface Props {
  setAppLoaded?: any,
  sceneId?: string,
  onBoardingStep?:number,
  authState?: any;
}

const mapStateToProps = (state: any): any => {
  return {
    onBoardingStep: selectAppOnBoardingStep(state),
    authState: selectAuthState(state),
  };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  setAppLoaded: bindActionCreators(setAppLoaded, dispatch)
});

export const EnginePage = (props: Props) => {
  
  const {
    sceneId,
    setAppLoaded,
    onBoardingStep,
    authState
  } = props;
  const currentUser = authState.get('user');
  const [hoveredLabel, setHoveredLabel] = useState('');
  const [actorEntity, setActorEntity] = useState(null);
  const [actorAvatarId, setActorAvatarId] = useState('Rose');
  const [infoBoxData, setInfoBoxData] = useState(null);
  const [progressEntity, setProgressEntity] = useState('');
  const [userHovered, setonUserHover] = useState(false);
  const [userId, setonUserId] = useState(null);
  const [position, setonUserPosition] = useState(null);
  const [objectActivated, setObjectActivated] = useState(false);
  const [objectHovered, setObjectHovered] = useState(false);

  //all scene entities are loaded
  const onSceneLoaded = (event: CustomEvent): void => {
    if (event.detail.loaded) {
      console.warn('onSceneLoaded');
      store.dispatch(setAppOnBoardingStep(generalStateList.SCENE_LOADED));
      document.removeEventListener('scene-loaded', onSceneLoaded);
      setAppLoaded(true);
    }
  };

  //started loading scene entities
  const onSceneLoadedEntity = (event: CustomEvent): void => {
    setProgressEntity(event.detail.left);
  };

  const onObjectHover = (event: CustomEvent): void => {
    setObjectHovered(event.detail.focused);
    setHoveredLabel(event.detail.interactionText);
  };

  const onUserHover = (event: CustomEvent): void => {
    setonUserHover(event.detail.focused);
    setonUserId(event.detail.focused ? event.detail.userId : null);
    setonUserPosition(event.detail.focused ? event.detail.position: null); 
  };

  const onObjectActivation = (event: CustomEvent): void =>{
    setInfoBoxData(event.detail.payload);
    setObjectActivated(true);
  };

  const addEventListeners = () => {
    document.addEventListener('scene-loaded', onSceneLoaded);
    document.addEventListener('scene-loaded-entity', onSceneLoadedEntity);
    document.addEventListener('object-activation', onObjectActivation);
    document.addEventListener('object-hover', onObjectHover);
    document.addEventListener('user-hover', onUserHover);
  };

  useEffect(() => {
    addEventListeners();
    console.log("LOAD SCENE WITH ID ", sceneId);

    const actorEntityWaitInterval = setInterval(() => {
      if (Network.instance?.localClientEntity) {
        console.log('setActorEntity');
        setActorEntity(Network.instance.localClientEntity);
        clearInterval(actorEntityWaitInterval);
      }
    }, 300);

    return (): void => {
      resetEngine();
    };
  }, []);

  useEffect(() => {
    if (actorEntity) {
      setActorAvatar(actorEntity, {avatarId: actorAvatarId});
      loadActorAvatar(actorEntity);
    }
  }, [ actorEntity, actorAvatarId ]);

  //mobile gamepad
  const mobileGamepadProps = {hovered:objectHovered, layout: 'default' };
  const mobileGamepad = isMobileOrTablet() && onBoardingStep >= generalStateList.TUTOR_MOVE ? <MobileGamepad {...mobileGamepadProps} /> : null;

  return (
    <>
      <NetworkDebug />
      <LinearProgressComponent label={progressEntity} />
      <SceneTitle />
      <LoadedSceneButtons />
      <OnBoardingBox actorEntity={actorEntity} />
      <MediaIconsBox />
      { userHovered && <NamePlate userId={userId} position={{x:position?.x, y:position?.y}} isFocused={userHovered} autoHideDuration={10000} />}
      {objectHovered && !objectActivated && <TooltipContainer message={hoveredLabel}  />}
      <InfoBox onClose={() => { setInfoBoxData(null); setObjectActivated(false); }} data={infoBoxData} />
      {mobileGamepad}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EnginePage);