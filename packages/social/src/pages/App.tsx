import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { SnackbarProvider } from 'notistack'

import AppHeader from '@xrengine/social/src/components/Header'
import FeedMenu from '@xrengine/social/src/components/FeedMenu'
import AppFooter from '@xrengine/social/src/components/Footer'
import { useCreatorState } from '@xrengine/social/src/reducers/creator/CreatorState'
// import {Stories} from '@xrengine/client-core/src/socialmedia/components/Stories';
import { useAuthState } from '@xrengine/client-core/src/user/reducers/auth/AuthState'
import { useWebxrNativeState } from '@xrengine/social/src/reducers/webxr_native/WebxrNativeState'

import { WebxrNativeService } from '@xrengine/social/src/reducers/webxr_native/WebxrNativeService'

import CreatorPopup from '@xrengine/social/src/components/popups/CreatorPopup'
import FeedPopup from '@xrengine/social/src/components/popups/FeedPopup'
import CreatorFormPopup from '@xrengine/social/src/components/popups/CreatorFormPopup'
import ArMediaPopup from '@xrengine/social/src/components/popups/ArMediaPopup'
import FeedFormPopup from '@xrengine/social/src/components/popups/FeedFormPopup'
import SharedFormPopup from '@xrengine/social/src/components/popups/SharedFormPopup'
import Onboard from '@xrengine/social/src/components/OnBoard'
import FeedOnboarding from '@xrengine/social/src/components/FeedOnboarding'
// @ts-ignore
import styles from './index.module.scss'
import Button from '@material-ui/core/Button'

// import image from '/static/images/image.jpg'
// import mockupIPhone from '/static/images/mockupIPhone.jpg'
import Splash from '@xrengine/social/src/components/Splash'
import { isIOS } from '@xrengine/client-core/src/util/platformCheck'
import TermsAndPolicy from '@xrengine/social/src/components/TermsandPolicy'
import Blocked from '@xrengine/social/src/components/Blocked'
import WebXRStart from '../components/popups/WebXR'
import { useHistory } from 'react-router-dom'
import TemporarySolution from './TemporarySolution'

import { CreatorAction } from '../reducers/creator/CreatorActions'

interface Props {}

const Home = (props: Props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const auth = useAuthState()
  /*hided for now*/
  const [onborded, setOnborded] = useState(true)
  const [feedOnborded, setFeedOnborded] = useState(true)
  const [feedHintsOnborded, setFeedHintsOnborded] = useState(true)
  const [registrationForm, setRegistrationForm] = useState(true)
  const [view, setView] = useState('featured')
  const creatorsState = useCreatorState()
  const currentCreator = creatorsState.creators.currentCreator
  const currentTime = new Date(Date.now()).toISOString()

  useEffect(() => {
    if (!!currentCreator?.value && !!currentCreator?.createdAt?.value) {
      currentTime.slice(0, -5) === currentCreator?.createdAt?.value?.slice(0, -5) && setOnborded(false)
    }
  }, [currentCreator])
  const webxrnativeState = useWebxrNativeState()
  const webxrRecorderActivity = webxrnativeState.webxrnative.value

  const changeOnboarding = () => {
    setOnborded(true)
    setFeedOnborded(false)
    setFeedHintsOnborded(false)
  }
  const platformClass = isIOS ? styles.isIos : ''
  const splashTimeout = creatorsState.creators.splashTimeout.value
  const hideContentOnRecord = webxrRecorderActivity ? styles.hideContentOnRecord : ''

  if (
    !currentCreator?.value ||
    currentCreator?.value === null ||
    (splashTimeout && currentCreator?.isBlocked?.value == false)
  ) {
    //add additional duration Splash after initialized user
    const splash = setTimeout(() => {
      dispatch(CreatorAction.setStateCreators(false))
      clearTimeout(splash)
    }, 5000)
    return <Splash />
  }

  const onGoRegistration = (callBack?) => {
    if (auth.user.userRole.value === 'guest') {
      history.push('/registration')
    } else if (callBack) {
      callBack()
    }
  }

  if (currentCreator?.isBlocked?.value == true) {
    return (
      <div>
        <Splash />
        <Blocked />
      </div>
    )
  }

  const changeWebXrNative = () => {
    dispatch(WebxrNativeService.changeWebXrNative())
  }

  // if (!onborded) return <Onboard setOnborded={changeOnboarding} image={image} mockupIPhone={mockupIPhone} />
  return (
    <>
      {view === 'terms' || view === 'policy' ? (
        <TemporarySolution view={view} setView={setView} />
      ) : (
        <div className={platformClass + ' ' + hideContentOnRecord}>
          {/*{!feedOnborded && <FeedOnboarding setFeedOnborded={setFeedOnborded} />}*/}
          <div className={webxrRecorderActivity ? styles.hideContent + ' ' + styles.viewport : styles.viewport}>
            <AppHeader setView={setView} onGoRegistration={onGoRegistration} />
            {/* <Stories stories={stories} /> */}
            <FeedMenu view={view} setView={setView} />
            <AppFooter setView={setView} onGoRegistration={onGoRegistration} />
            {currentCreator?.value &&
              // Made at the time of the test Aleks951
              (!!!currentCreator.terms.value || !!!currentCreator.policy.value) &&
              auth.user.userRole.value === 'user' && <TermsAndPolicy view={view} setView={setView} />}
            <ArMediaPopup />
            <WebXRStart
              feedHintsOnborded={feedHintsOnborded}
              webxrRecorderActivity={webxrRecorderActivity}
              setContentHidden={changeWebXrNative}
              setFeedHintsOnborded={setFeedHintsOnborded}
            />
            <CreatorPopup webxrRecorderActivity={webxrRecorderActivity} setView={setView} />
            <FeedPopup webxrRecorderActivity={webxrRecorderActivity} setView={setView} />
            <CreatorFormPopup webxrRecorderActivity={webxrRecorderActivity} setView={setView} />
            <FeedFormPopup setView={setView} />
            <SharedFormPopup setView={setView} />
          </div>
        </div>
      )}
    </>
  )
}

export default Home
