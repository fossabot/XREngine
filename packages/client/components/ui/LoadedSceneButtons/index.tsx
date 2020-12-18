import React from 'react';
import { connect } from 'react-redux';
import { Button} from '@material-ui/core';
import { selectAppOnBoardingStep } from '../../../redux/app/selector';
import { generalStateList, setAppOnBoardingStep } from '../../../redux/app/actions';
import store from '../../../redux/store';
import { joinWorld } from "@xr3ngine/engine/src/networking/functions/joinWorld";
import styles from './LoadedSceneButtons.module.scss';

const mapStateToProps = (state: any): any => {
  return {
    onBoardingStep: selectAppOnBoardingStep(state),
  };
};

interface Props{
  onBoardingStep?:number; 
}
const LoadedSceneButtons = ({onBoardingStep}:Props): any => {

  const joinWorldHandler = async () =>{
    await joinWorld();
    store.dispatch(setAppOnBoardingStep(generalStateList.ALL_DONE));
  }

  const startTutorialHandler = async () =>{
    await joinWorld().then(()=>store.dispatch(setAppOnBoardingStep(generalStateList.TUTOR_LOOKAROUND)));
  }
  return onBoardingStep === generalStateList.SCENE_LOADED && 
    (<section className={styles.loadedSceneButtonsContainer}>
        <Button variant="contained" color="primary" onClick={startTutorialHandler}>Start Tutorial</Button>
        <Button variant="contained" onClick={joinWorldHandler}>Join World</Button>
    </section>)   
};


export default connect(mapStateToProps)(LoadedSceneButtons);
